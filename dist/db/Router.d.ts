import { Actor } from "./Actor";
import { Put, Get, Message } from "./Message";
export default class Router extends Actor {
    storageAdapters: Set<Actor>;
    networkAdapters: Set<Actor>;
    serverPeers: Set<Actor>;
    seenMessages: Set<string>;
    seenGetMessages: Map<string, Message>;
    subscribersByTopic: Map<string, Set<Actor>>;
    msgCounter: number;
    peerId: string;
    constructor(config?: any);
    handle(message: Message): void;
    handlePut(put: Put): void;
    opt(opts: any): void;
    handleGet(get: Get): void;
}
