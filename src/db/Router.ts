import {Actor} from "./Actor";
import Memory from "./adapters/Memory";
//import IndexedDB from "./adapters/IndexedDB";
import Websocket from "./adapters/Websocket";
import {Put, Get, Message} from "./Message";
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
    storageAdapters: Set<Actor> = new Set();
    networkAdapters: Set<Actor> = new Set();
    serverPeers: Set<Actor> = new Set();
    seenMessages: Set<string> = new Set();
    seenGetMessages: Map<string, Message> = new Map();
    subscribersByTopic: Map<string, Set<Actor>> = new Map();
    msgCounter = 0;
    peerId: string;

    constructor(config: any = {}) {
        super('router');
        // default random id
        this.peerId = config.peerId || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        this.storageAdapters.add(new Memory(config));
        //this.storageAdapters.add(new IndexedDB(config));
        console.log('config', config);
        if (config.peers) {
            for (const peer of config.peers) {
                if (peer) {
                    this.serverPeers.add(new Websocket(peer, this));
                }
            }
        }
    }

    handle(message: Message) {
        //console.log('router received', message);
        if (message instanceof Put || message instanceof Get) {
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
    }

    handlePut(put: Put) {
        console.log('router handlePut', put);
        const sendTo: Set<Actor> = new Set();
        Object.keys(put.updatedNodes).forEach(path => {
            // topic is first 3 nodes of path
            const topic = path.split('/').slice(0, 3).join('/');
            const subscribers = this.subscribersByTopic.get(topic);
            // send to storage adapters
            //console.log('put subscribers', subscribers);
            for (const storageAdapter of this.storageAdapters) {
                if (put.from !== storageAdapter) {
                    sendTo.add(storageAdapter);
                }
            }

            for (const peer of this.serverPeers) {
                if (put.from !== peer) {
                    sendTo.add(peer);
                }
            }

            if (subscribers) {
                for (const subscriber of subscribers) {
                    if (subscriber !== put.from) {
                        sendTo.add(subscriber);
                    }
                }
            }
        });
        for (const actor of sendTo) {
            actor.postMessage(put);
        }
    }

    opt(opts: any) {
        if (opts.peers) {
            for (const peer of opts.peers) {
                if (peer) {
                    this.serverPeers.add(new Websocket(peer, this));
                }
            }
        }
    }

    handleGet(get: Get) {
        const topic = get.nodeId.split('/')[1];
        const sendTo: Set<Actor> = new Set();
        for (const storageAdapter of this.storageAdapters) {
            if (get.from !== storageAdapter) {
                sendTo.add(storageAdapter);
            }
        }
        for (const peer of this.serverPeers) {
            if (get.from !== peer) {
                sendTo.add(peer);
            }
        }
        if (!this.subscribersByTopic.has(topic)) {
            this.subscribersByTopic.set(topic, new Set());
        }
        const subscribers = this.subscribersByTopic.get(topic);
        if (subscribers) {
            if (!subscribers.has(get.from)) {
                subscribers.add(get.from);
            }
        }
        for (const actor of sendTo) {
            actor.postMessage(get);
        }
    }
}

/*
let actor: Actor;
self.onconnect = () => {
    console.log('router shared worker connected');
    actor = actor || new Router();
}
*/

// self.onconnect = (e) => Comlink.expose(actor, e.ports[0]);