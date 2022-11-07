import { Put, Get, Message } from '../Message';
import { Actor } from '../Actor';
import QuickLRU from 'quick-lru';
import { Children } from "../Node";
export default class Memory extends Actor {
    config: {};
    store: QuickLRU<string, Children>;
    constructor(config?: any);
    handle(message: Message): void;
    handleGet(message: Get): void;
    mergeAndSave(nodeName: string, children: Children): void;
    handlePut(put: Put): Promise<void>;
}
