export declare class Message {
    static fromObject(obj: any): Message;
}
export declare class Get implements Message {
    type: string;
    id: string;
    nodeId: string;
    from: string;
    recipients?: string[];
    childKey?: string;
    jsonStr?: string;
    checksum?: string;
    toJsonString(): string;
    static fromObject(obj: any): Get;
    static new(nodeId: string, from: string, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string): Get;
    constructor(id: string, nodeId: string, from: string, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string);
}
export declare class Put implements Message {
    type: string;
    id: string;
    from: string;
    updatedNodes: object;
    inResponseTo?: string;
    recipients?: string[];
    jsonStr?: string;
    checksum?: string;
    toJsonString(): string;
    static fromObject(obj: any): Put;
    static new(updatedNodes: object, from: string, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put;
    static newFromKv(key: string, children: object, from: string): Put;
    constructor(id: string, updatedNodes: object, from: string, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string);
}
export declare function messageFromJsonString(jsonStr: string, from: string): Message;
