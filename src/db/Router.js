import {Actor} from "./Actor.ts";
import IndexedDB from "./adapters/IndexedDB.js";
import Websocket from "./adapters/Websocket.ts";
import { Put, Get } from "./Message.ts";
// import * as Comlink from "comlink";

/*
class SeenGetMessage {
    constructor(id, from, lastReplyChecksum) {
        this.id = id;
        this.from = from;
        this.lastReplyChecksum = lastReplyChecksum;
    }
}
*/

export default class Router extends Actor {
    storageAdapters = new Set();
    networkAdapters = new Set();
    serverPeers = new Set();
    seenMessages = new Set();
    seenGetMessages = new Map();
    subscribersByTopic = new Map();
    msgCounter = 0;

    constructor(config = {}) {
        super('router');
        // default random id
        this.peerId = config.peerId || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.storageAdapters.add(new IndexedDB(config));
        console.log('config', config);
        if (config.peers) {
            for (const peer of config.peers) {
                if (peer) {
                    this.serverPeers.add(new Websocket(peer, this));
                }
            }
        }
    }

    handle(message) {
        //console.log('router received', message);
        if (this.seenMessages.has(message.id)) {
            return;
        }
        this.seenMessages.add(message.id);
        if (message instanceof Put) {
            this.handlePut(message);
        } else if (message instanceof Get) {
            this.handleGet(message);
        }
    }

    handlePut(put) {
        Object.keys(put.updatedNodes).forEach(path => {
            const topic = path.split('/')[1] || '';
            const subscribers = this.subscribersByTopic.get(topic);
            // send to storage adapters
            //console.log('put subscribers', subscribers);
            for (const storageAdapter of this.storageAdapters) {
                storageAdapter.postMessage(put);
            }

            for (const peer of this.serverPeers) {
                peer.postMessage(put);
            }

            if (subscribers) {
                for (const [k, v] of subscribers) {
                    if (k !== put.from) {
                        v.postMessage(put);
                    }
                }
            }
        });
    }

    handleGet(get) {
        const topic = get.nodeId.split('/')[1];
        for (const storageAdapter of this.storageAdapters) {
            storageAdapter.postMessage(get);
        }
        for (const peer of this.serverPeers) {
            peer.postMessage(get);
        }
        if (!this.subscribersByTopic.has(topic)) {
            this.subscribersByTopic.set(topic, new Map());
        }
        const subscribers = this.subscribersByTopic.get(topic);
        for (const [k, v] of subscribers) { // TODO: sample
            if (k !== get.from.id) {
                v.postMessage(get);
            }
        }
        if (!subscribers.has(get.from.id)) {
            subscribers.set(get.from.id, get.from);
        }
    }
}

let actor;
self.onconnect = () => {
    console.log('router shared worker connected');
    actor = actor || new Router();
}

// self.onconnect = (e) => Comlink.expose(actor, e.ports[0]);