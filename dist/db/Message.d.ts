import { Actor } from './Actor';
import { Children } from "./Node";
export declare class Message {
    static fromObject(obj: any): Message;
    static deserialize(str: string, from: Actor): Message;
    serialize(): string;
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
    static deserialize(obj: any, jsonStr: string, from: Actor): Get;
    static fromObject(obj: any): Get;
    static new(nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string): Get;
    constructor(id: string, nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string);
}
export declare type UpdatedNodes = {
    [key: string]: Children;
};
export declare class Put implements Message {
    type: string;
    id: string;
    from: Actor;
    updatedNodes: UpdatedNodes;
    inResponseTo?: string;
    recipients?: string[];
    jsonStr?: string;
    checksum?: string;
    serialize(): string;
    static deserialize(obj: any, jsonStr: string, from: Actor): Put;
    static fromObject(obj: any): Put;
    static new(updatedNodes: UpdatedNodes, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put;
    static newFromKv(key: string, children: object, from: Actor): Put;
    constructor(id: string, updatedNodes: UpdatedNodes, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string);
}
export declare class Hi implements Message {
    type: string;
    peerId: string;
    jsonStr?: string;
    serialize(): string;
    static deserialize(obj: any): Hi;
    constructor(peerId: string, jsonStr?: string);
}
export declare function messageFromJsonString(jsonStr: string, from: Actor): Message;
