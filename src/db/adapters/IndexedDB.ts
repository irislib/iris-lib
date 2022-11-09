import {Put, Get, Message} from '../Message'
import { Actor } from '../Actor';
import _ from "../../lodash";
import Dexie from 'dexie';
import {Children, NodeData} from "../Node";
// import * as Comlink from "comlink";

class MyDexie extends Dexie {
    nodes: Dexie.Table<NodeData, string>;
    constructor(dbName: string) {
        super(dbName);
        this.version(1).stores({
            nodes: ", value, updatedAt"
        });
        this.nodes = this.table("nodes");
    }
}

export default class IndexedDB extends Actor {
    config = {};
    notStored = new Set();
    putQueue: any = {};
    getQueue: any = {};
    i = 0;
    queue = 0;
    db: MyDexie;

    constructor(config: any = {}) {
        super();
        this.config = config;
        const dbName = (config.dbName || 'iris');
        this.db = new MyDexie(dbName);
        this.db.open().catch((err) => {
            console.error(err.stack || err);
        });
    }

    put(nodeId: string, value: any) {
        // add puts to a queue and dexie bulk write them once per 500ms
        this.putQueue[nodeId] = value;
        this.throttledPut();
    }

    throttledPut = _.throttle(() => {
        const keys = Object.keys(this.putQueue);
        const values = keys.map(key => {
            this.notStored.delete(key);
            return this.putQueue[key];
        });
        this.db.nodes.bulkPut(values, keys);
        this.putQueue = {};
    }, 500);

    get(path: string, callback: Function) {
        this.getQueue[path] = this.getQueue[path] || [];
        this.getQueue[path].push(callback);
        this.throttledGet();
    }

    throttledGet = _.throttle(() => {
        // clone this.getQueue and clear it
        const queue = this.getQueue;
        const keys = Object.keys(queue);
        this.db.nodes.bulkGet(keys).then((values: (any | undefined)[]) => {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                const value = values[i];
                const callbacks = queue[key];
                // console.log('have', key, value);
                for (const callback of callbacks) {
                    callback(value);
                }
            }
        });
        this.getQueue = {};
    }, 100);

    handle(message: Message) {
        if (message instanceof Put) {
            this.handlePut(message);
        } else if (message instanceof Get) {
            this.handleGet(message);
        } else {
            console.log('worker got unknown message', message);
        }
    }

    handleGet(message: Get) {
        if (this.notStored.has(message.nodeId)) {
            // TODO message implying that the key is not stored
            return;
        }
        this.get(message.nodeId, (children: any) => {
            // TODO: this takes a long time to return
            if (children === undefined) {
                this.notStored.add(message.nodeId);
                // TODO message implying that the key is not stored
            } else {
                const putMessage = Put.newFromKv(message.nodeId, children, this);
                putMessage.inResponseTo = message.id;
                message.from && message.from.postMessage(putMessage);
            }
        });
    }

    mergeAndSave(path: string, children: Children) {
        this.get(path, (existing: any) => {
            // TODO check updatedAt timestamp
            if (existing === undefined) {
                this.put(path, children);
            } else {
                for (const [key, value] of Object.entries(children)) {
                    if (existing[key] && existing[key].updatedAt >= value.updatedAt) {
                        continue;
                    }
                    existing[key] = value;
                }
                this.put(path, existing);
            }
        });
    }

    savePath(path: string, value: any) {
        if (value === undefined) {
            this.db.nodes.delete(path);
            this.notStored.add(path);
        } else {
            this.notStored.delete(path);
            this.mergeAndSave(path, value);
        }
    }

    async handlePut(put: Put) {
        for (const [nodeName, children] of Object.entries(put.updatedNodes)) {
            if (!children) {
                console.log('deleting', nodeName);
                continue;
            }
            this.mergeAndSave(nodeName, children);
        }
    }
}

/*
let actor;
global.onconnect = () => {
    if (actor) {
        console.log ('worker already exists');
    } else {
        console.log('starting worker');
        actor = actor || new IndexedDB();
    }
}
 */

// self.onconnect = (e) => Comlink.expose(actor, e.ports[0]);