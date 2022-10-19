import _ from '../lodash';
import {Actor}  from './Actor';
import {Get, Message, Put} from './Message';
//@ts-ignore
import IndexedDBWorker from "./adapters/IndexedDB.sharedworker.js";
//import * as Comlink from "comlink";

type FunEventListener = {
    off: Function;
};

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

export default class Node extends Actor {
    id: string;
    root: Node;
    parent?: Node;
    children = new Map<string, Node>();
    once_subscriptions = new Map<number, Function>();
    on_subscriptions = new Map<number, Function>();
    map_subscriptions = new Map<number, Function>();
    value = undefined;
    counter = 0;
    loaded = false;
    config: Config;
    currentUser: any;
    router: any;

    constructor(id = '', config?: Config, parent?: Node) {
        super(id);
        this.id = id;
        this.router = new BroadcastChannel(id + '-idb');
        this.parent = parent;
        this.config = config || (parent && parent.config) || DEFAULT_CONFIG;
        if (parent) {
            this.root = parent.root;
        } else {
            this.root = this;
            //@ts-ignore
            const idbWorker = new IndexedDBWorker({id});
            //console.log('idbWorker', idbWorker);
            //const router = Comlink.wrap(routerWorker);
        }
    }

    handle(message: Message): void {
        if (message instanceof Put) {
            for (const [key, value] of Object.entries(message.updatedNodes)) {
                if (key === this.id) {
                    if (Array.isArray(value)) {
                        value.forEach(childKey => this.get(childKey));
                    } else {
                        this.value = value;
                    }
                    this.parent && this.parent.handle(message);
                }
            }
            setTimeout(() => this.doCallbacks(), 100);
        }
    };

    get(key: string): Node {
        const existing = this.children.get(key);
        if (existing) {
            return existing;
        }
        const newNode = new Node(`${this.id}/${key}`, this.config, this);
        this.children.set(key, newNode);
        return newNode;
    }

    user(pub: string = (this.root.currentUser && this.root.currentUser.pub)): Node {
        console.log('user', pub);
        return this.get('users').get(pub);
    }

    auth(key: any) {
        // TODO get public key from key
        console.log('auth', key);
        this.root.currentUser = key;
        console.log(this.root);
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
        if (this.value === value) {
            return; // TODO: when timestamps are added, this should be changed
        }
        if (Array.isArray(value)) {
            throw new Error('put() does not support arrays');
        }
        if (typeof value === 'function') {
            throw new Error('put() does not support functions');
        }
        if (typeof value === 'object' && value !== null) {
            this.value = undefined;
            // TODO: update the whole path of parent nodes
            for (const key in value) {
                this.get(key).put(value[key]);
            }
            return;
        }
        this.children = new Map();
        this.value = value;
        this.doCallbacks();
        const updatedNodes: any = {};
        updatedNodes[this.id] = value;
        this.addParentNodes(updatedNodes);
        console.log('put', updatedNodes);
        try {
            structuredClone(updatedNodes);
            this.router.postMessage(Put.new(updatedNodes, this.channel.name));
            this.channel.postMessage(Put.new(updatedNodes, this.channel.name));
        } catch(e) {
            console.log('put failed', e);
        }
    }

    private addParentNodes(updatedNodes: any) {
        if (this.parent) {
            this.parent.value = undefined;
            const children: any = {};
            for (const [key, child] of this.parent.children) {
                if (!key.indexOf) {
                    console.log('key', key);
                    this.parent.children.delete(key);
                    continue;
                }
                if (child.children.size > 0) {
                    children[key] = Array.from(child.children.keys());
                } else if (child.value !== undefined) {
                    children[key] = child.value;
                }
            }
            console.log('this.parent.id', this.parent.id, children);
            updatedNodes[this.parent.id] = children;
            this.parent.addParentNodes(updatedNodes);
        }
    }

    async once(callback?: Function | null, event?: FunEventListener, returnIfUndefined = true): Promise<any> {
        let result: any;
        if (this.children.size) {
            // return an object containing all children
            result = {};
            await Promise.all(Array.from(this.children.keys()).map(async key => {
                result[key] = await this.get(key).once(null, event);
            }));
        } else if (this.value !== undefined) {
            result = this.value;
        } else {
            this.router.postMessage(Get.new(this.id, this.channel.name));
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