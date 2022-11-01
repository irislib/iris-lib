import { Put, Get, Message } from '../Message';
import { Actor } from '../Actor';
import Dexie from 'dexie';
import { NodeData } from "../Node";
declare class MyDexie extends Dexie {
    nodes: Dexie.Table<NodeData, string>;
    constructor(dbName: string);
}
export default class IndexedDB extends Actor {
    config: {};
    notStored: Set<unknown>;
    putQueue: any;
    getQueue: any;
    i: number;
    queue: number;
    db: MyDexie;
    constructor(config?: any);
    put(nodeId: string, value: any): void;
    throttledPut: () => void;
    get(path: string, callback: Function): void;
    throttledGet: () => void;
    handle(message: Message): void;
    handleGet(message: Get): void;
    mergeAndSave(path: string, newValue: any): void;
    savePath(path: string, value: any): void;
    handlePut(put: Put): Promise<void>;
}
export {};
