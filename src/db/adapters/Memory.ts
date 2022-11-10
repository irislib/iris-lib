import {Put, Get, Message} from '../Message'
import { Actor } from '../Actor';
import QuickLRU from 'quick-lru';
import {Children} from "../Node";
//import {NodeData} from "../Node";
// import * as Comlink from "comlink";
import _ from '../../lodash';

export default class Memory extends Actor {
    config = {};
    store: QuickLRU<string, Children> = new QuickLRU({ maxSize: 10000 });

    constructor(config: any = {}) {
        super();
        this.config = config;
    }

    handle(message: Message) {
        if (message instanceof Put) {
            this.handlePut(message);
        } else if (message instanceof Get) {
            this.handleGet(message);
        } else {
            console.log('Memory got unknown message', message);
        }
    }

    handleGet(message: Get) {
        if (!message.from) {
            console.log('no from in get message');
            return;
        }
        let children = this.store.get(message.nodeId);
        if (children) {
            //console.log('have', message.nodeId, children);
            const putMessage = Put.newFromKv(message.nodeId, children, this);
            putMessage.inResponseTo = message.id;
            message.from && message.from.postMessage(putMessage);
        } else {
            //console.log('dont have', message.nodeId);
        }
    }

    mergeAndSave(nodeName: string, children: Children) {
        const existing = this.store.get(nodeName);

        // TODO check updatedAt timestamp
        if (existing === undefined) {
            this.store.set(nodeName, children);
        } else {
            for (const [key, value] of Object.entries(children)) {
                if (existing[key] && existing[key].updatedAt >= value.updatedAt) {
                    continue;
                }
                existing[key] = value;
            }
            this.store.set(nodeName, existing);
        }
    }

    async handlePut(put: Put) {
        for (const [nodeName, children] of Object.entries(put.updatedNodes)) {
            if (!children) {
                console.log('deleting', nodeName);
                this.store.delete(nodeName);
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