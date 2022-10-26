import { Actor } from './Actor';
export declare class Message {
    static fromObject(obj: any): Message;
}
export declare class Get implements Message {
    type: string;
    id: string;
    nodeId: string;
    from: Actor;
    recipients?: string[];
    childKey?: string;
    jsonStr?: string;
    checksum?: string;
    serialize(): string;
    static deserialize(jsonStr: string, from: Actor): Get;
    static fromObject(obj: any): Get;
    static new(nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string): Get;
    constructor(id: string, nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string);
}
export declare class Put implements Message {
    type: string;
    id: string;
    from: Actor;
    updatedNodes: object;
    inResponseTo?: string;
    recipients?: string[];
    jsonStr?: string;
    checksum?: string;
    deserialize(): string;
    static fromObject(obj: any): Put;
    static new(updatedNodes: object, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put;
    static newFromKv(key: string, children: object, from: Actor): Put;
    constructor(id: string, updatedNodes: object, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string);
}
export declare function messageFromJsonString(jsonStr: string, from: Actor): Message;
