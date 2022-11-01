import {Put, Get, Message} from '../Message'
import { Actor } from '../Actor';
import _ from "../../lodash";
import Dexie from 'dexie';
import {NodeData} from "../Node";
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
        this.get(message.nodeId, (value: any) => {
            // TODO: this takes a long time to return
            if (value === undefined) {
                this.notStored.add(message.nodeId);
                // TODO message implying that the key is not stored
            } else {
                const putMessage = Put.newFromKv(message.nodeId, value, this);
                putMessage.inResponseTo = message.id;
                message.from && message.from.postMessage(putMessage);
            }
        });
    }

    mergeAndSave(path: string, newValue: any) {
        this.get(path, (existing: any) => {
            // TODO check updatedAt timestamp
            if (existing === undefined) {
                this.put(path, newValue);
            } else if (!_.isEqual(existing, newValue)) {
                // if existing value is array, merge it
                if (Array.isArray(existing) && Array.isArray(newValue)) {
                    newValue = _.uniq(existing.concat(newValue));
                }
                if (Array.isArray(newValue) && newValue.length === 0) {
                    console.log('no kids', path);
                }
                this.put(path, newValue);
            } else {
                //console.log('not updating', path, existing, newValue);
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
            if (typeof children !== 'object') { // we receiving bad messages? or is this handled correctly?
                this.savePath(nodeName, children);
                continue;
            }
            for (const [childName, newValue] of Object.entries(children)) {
                const path = `${nodeName}/${childName}`;
                this.savePath(path, newValue);
            }
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