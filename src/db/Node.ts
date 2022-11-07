import _ from '../lodash';
import {Actor}  from './Actor';
import {Message, Put, Get, UpdatedNodes} from './Message';

// @ts-ignore
import Router from './Router';
//import * as Comlink from "comlink";

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

// TODO move memory storage to its own adapter? it would make things simpler here
export default class Node extends Actor {
    root: Node;
    parent?: Node;
    children = new Map<string, Node>();
    once_subscriptions = new Map<number, Function>();
    on_subscriptions = new Map<number, Function>();
    map_subscriptions = new Map<number, Function>();
    counter = 0;
    config: Config;
    currentUser: any;
    router: Router;

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
                if (!children || typeof children !== 'object') {
                    continue;
                }
                if (key === this.id) {
                    for (const [childKey, childData] of Object.entries(children)) {
                        console.log('put', childKey, childData);
                        this.get(childKey).doCallbacks(childData, childKey); // TODO children should have proper NodeData
                    }
                }
            }
            this.parent && this.parent.handle(message);
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

    user(pub: string | undefined): Node {
        pub = pub || (this.root.currentUser && this.root.currentUser.pub);
        if (!pub) {
            throw new Error("no public key!");
        }
        return this.get('user').get(pub as string);
    }

    auth(key: any) {
        // TODO get public key from key
        this.root.setCurrentUser(key);
        return;
    }

    doCallbacks = (data: NodeData, key: string) => {
        if (typeof data.value === 'string' && data.value.startsWith('{":":"')) {
            data.value = JSON.parse(data.value)[':'];
        }
        console.log('doCallbacks', this.id, key, data);
        for (const [id, callback] of this.on_subscriptions) {
            const event = { off: () => this.on_subscriptions.delete(id) };
            callback(data.value, key, null, event);
        }
        for (const [id, callback] of this.once_subscriptions) {
            callback(data.value, key, null, {});
            this.once_subscriptions.delete(id);
        }
        if (this.parent) {
            const parent = this.parent;
            for (const [id, callback] of parent.map_subscriptions) {
                console.log('map_subscriptions', parent.id, id, key, data);
                const event = { off: () => parent.map_subscriptions.delete(id) };
                callback(data.value, key, null, event);
            }
        }
    };

    put(value: any): void {
        const updatedAt = Date.now();
        if (Array.isArray(value)) {
            throw new Error('put() does not support arrays');
        }
        if (typeof value === 'function') {
            throw new Error('put() does not support functions');
        }
        if (typeof value === 'object' && value !== null) {
            // TODO: update the whole path of parent nodes
            for (const key in value) {
                this.get(key).put(value[key]);
            }
            return;
        }
        this.children = new Map();
        const updatedNodes: UpdatedNodes = {};
        this.addParentNodes(updatedNodes, value, updatedAt);
        const put = Put.new(updatedNodes, this);
        this.handle(put);
        console.log('put', put);
        this.router.postMessage(put);
    }

    private addParentNodes(updatedNodes: UpdatedNodes, value: any, updatedAt: number) {
        if (this.parent) {
            const childName = this.id.split('/').pop() as string;
            const parentId = this.parent.id;
            updatedNodes[parentId] = updatedNodes[parentId] || {};
            updatedNodes[parentId][childName] = {value, updatedAt};
            this.parent.addParentNodes(updatedNodes, {'#': this.parent.id }, updatedAt);
        }
    }

    private request() {
        if (this.parent) { // TODO router should decide whether to re-request from peers
            const childKey = this.id.split('/').pop();
            this.router.postMessage(Get.new(this.parent.id, this, undefined, childKey));
        }
    }

    async once(callback?: Function | null): Promise<any> {
        const id = this.counter++;
        callback && this.once_subscriptions.set(id, callback);
        this.request();
    }

    on(callback: Function): void {
        const id = this.counter++;
        this.on_subscriptions.set(id, callback);
        //const event = { off: () => this.on_subscriptions.delete(id) };
        this.request();
    }

    map(callback: Function): void {
        const id = this.counter++;
        this.map_subscriptions.set(id, callback);
        this.request();
    }

    opt(opts: any) {
        this.router.opt(opts);
    }
}