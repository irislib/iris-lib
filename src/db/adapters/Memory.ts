import {Put, Get, Message} from '../Message'
import { Actor } from '../Actor';
import _ from "../../lodash";
import QuickLRU from 'quick-lru';
import {Children} from "../Node";
//import {NodeData} from "../Node";
// import * as Comlink from "comlink";

export default class Memory extends Actor {
    config = {};
    store: QuickLRU<string, Children> = new QuickLRU({ maxSize: 10000 });

    constructor(config: any = {}) {
        super();
        this.config = config;
    }

    handle(message: Message) {
        if (message instanceof Put) {
            console.log('Memory handle Put', message);
            this.handlePut(message);
        } else if (message instanceof Get) {
            console.log('Memory handle Get', message);
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
            console.log('have', message.nodeId, children);
            if (message.childKey) {
                const o: Children = {};
                o[message.childKey] = children[message.childKey];
                children = o;
            }
            const putMessage = Put.newFromKv(message.nodeId, children, this);
            putMessage.inResponseTo = message.id;
            console.log('memory sending', putMessage);
            message.from && message.from.postMessage(putMessage);
        } else {
            console.log('dont have', message.nodeId);
        }
    }

    mergeAndSave(nodeName: string, children: any) {
        const existing = this.store.get(nodeName);

        // TODO check updatedAt timestamp
        if (existing === undefined) {
            this.store.set(nodeName, children);
        } else if (!_.isEqual(existing, children)) {
            console.log('merging', nodeName, existing, children);
            this.store.set(nodeName, Object.assign(existing, children));
        } else {
            console.log('not updating', nodeName, existing, children);
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