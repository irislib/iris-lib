import _ from '../lodash';
import {Actor}  from './Actor';
import {Message, Put, Get, UpdatedNodes} from './Message';

// @ts-ignore
import Router from './Router';
//import * as Comlink from "comlink";

type FunEventListener = {
    off: Function;
};

export type NodeData = {
    value: any;
    updatedAt: number;
};

export type Children = {
    [key: string]: NodeData;
}

export type Config = {
    peerId?: string;
    allowPublicSpace: boolean;
    myPublicKey?: string;
    enableStats: boolean;
    webSocketPeers?: string[];
    localOnly: boolean;
}

export const DEFAULT_CONFIG: Config = {
    allowPublicSpace: false,
    enableStats: true,
    localOnly: true
}

const debug = false;

function log(...args: any[]) {
    debug && console.log(...args);
}

// TODO move memory storage to its own adapter? it would make things simpler here
export default class Node extends Actor {
    root: Node;
    parent?: Node;
    children = new Map<string, Node>();
    once_subscriptions = new Map<number, Function>();
    on_subscriptions = new Map<number, Function>();
    map_subscriptions = new Map<number, Function>();
    data: NodeData | undefined = undefined;
    counter = 0;
    loaded = false;
    config: Config;
    currentUser: any;
    router: Actor;

    constructor(id = '', config?: Config, parent?: Node) {
        super(id);
        this.parent = parent;
        this.config = config || (parent && parent.config) || DEFAULT_CONFIG;
        if (parent) {
            this.root = parent.root;
            this.router = parent.router;
        } else {
            this.root = this;
            //@ts-ignore
            this.router = new Router({dbName: this.id + '-idb', peers: this.config.webSocketPeers});
            //console.log('idbWorker', idbWorker);
            //const router = Comlink.wrap(routerWorker);
        }
    }

    getCurrentUser(): any {
        return this.parent ? this.parent.getCurrentUser() : this.currentUser;
    }

    setCurrentUser(key: any) {
        if (this.parent) {
            this.parent.setCurrentUser(key);
        } else {
            this.currentUser = key;
        }
    }

    handle(message: Message): void {
        if (message instanceof Put) {
            for (const [key, children] of Object.entries(message.updatedNodes)) {
                if (!children) {
                    continue;
                }
                if (key === this.id) {
                    this.loaded = true;
                    for (const [childKey, data] of Object.entries(children)) {
                        this.get(childKey).merge(data);
                    }
                    this.parent && this.parent.handle(message);
                }
            }
            setTimeout(() => this.doCallbacks(), 100); // why is this needed?
        }
    };

    private merge(data: NodeData) {
        if (this.data && this.data.updatedAt > data.updatedAt) {
            return;
        }
        this.data = data;
    }

    get(key: string): Node {
        const existing = this.children.get(key);
        if (existing) {
            return existing;
        }
        const newNode = new Node(`${this.id}/${key}`, this.config, this);
        this.children.set(key, newNode);
        return newNode;
    }

    user(pub: string | undefined): Node {
        pub = pub || (this.root.currentUser && this.root.currentUser.pub);
        if (!pub) {
            throw new Error("no public key!");
        }
        return this.get('users').get(pub as string);
    }

    auth(key: any) {
        // TODO get public key from key
        this.root.currentUser = key;
        this.root.setCurrentUser(key);
        return;
    }

    doCallbacks = _.throttle(() => {
        for (const [id, callback] of this.on_subscriptions) {
            const event = { off: () => this.on_subscriptions.delete(id) };
            this.once(callback, event, false);
        }
        for (const [id, callback] of this.once_subscriptions) {
            this.once(callback, undefined, false);
            this.once_subscriptions.delete(id);
        }

        if (this.parent) {
            for (const [id, callback] of this.parent.on_subscriptions) {
                const event = { off: () => this.parent?.on_subscriptions.delete(id) };
                this.parent.once(callback, event, false);
            }
            for (const [id, callback] of this.parent.map_subscriptions) {
                const event = { off: () => this.parent?.map_subscriptions.delete(id) };
                this.once(callback, event, false);
            }
        }
    }, 40);

    put(value: any): void {
        if (this.data === value) {
            return; // TODO: when timestamps are added, this should be changed
        }
        if (Array.isArray(value)) {
            throw new Error('put() does not support arrays');
        }
        if (typeof value === 'function') {
            throw new Error('put() does not support functions');
        }
        if (typeof value === 'object' && value !== null) {
            this.data = undefined;
            // TODO: update the whole path of parent nodes
            for (const key in value) {
                this.get(key).put(value[key]);
            }
            return;
        }
        this.children = new Map();
        this.data = { value, updatedAt: Date.now() };
        this.doCallbacks();
        const updatedNodes: UpdatedNodes = {};
        this.addParentNodes(updatedNodes);
        this.router.postMessage(Put.new(updatedNodes, this));
    }

    private addParentNodes(updatedNodes: UpdatedNodes) {
        if (this.parent) {
            this.parent.data = undefined;
            const children: any = {};
            children[this.id.split('/').pop() as string] = this.data;
            // remove the part before first / from id
            const parentId = this.parent.id.split('/').slice(1).join('/');
            updatedNodes[parentId] = children;
            this.parent.addParentNodes(updatedNodes);
        }
    }

    async once(callback?: Function | null, event?: FunEventListener, returnIfUndefined = true): Promise<any> {
        let result: any;
        if (!this.loaded) {
            let id = this.id.split('/').slice(1).join('/');
            id = id.replace(/^users\//, '~');
            this.router.postMessage(Get.new(id, this));
        }
        if (this.children.size) {
            // return an object containing all children
            result = {};
            await Promise.all(Array.from(this.children.keys()).map(async key => {
                result[key] = await this.get(key).once(null, event);
            }));
        } else if (this.data !== undefined) {
            result = this.data && this.data.value;
        } else if (returnIfUndefined) {
            const id = this.counter++;
            callback && this.once_subscriptions.set(id, callback);
        }
        if (result !== undefined || returnIfUndefined) {
            log('once', this.id, result);
            callback && callback(result, this.id.slice(this.id.lastIndexOf('/') + 1), null, event);
            return result;
        }
    }

    on(callback: Function): void {
        log('on', this.id);
        const id = this.counter++;
        this.on_subscriptions.set(id, callback);
        const event = { off: () => this.on_subscriptions.delete(id) };
        this.once(callback, event, false);
    }

    map(callback: Function): void {
        log('map', this.id);
        const id = this.counter++;
        this.map_subscriptions.set(id, callback);
        const event = { off: () => this.map_subscriptions.delete(id) };
        for (const child of this.children.values()) {
            child.once(callback, event, false);
        }
    }
}