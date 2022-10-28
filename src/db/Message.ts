import {Actor} from './Actor';
import {Children} from "./Node";

export class Message {
    // When Messages are sent over BroadcastChannel, class name is lost.
    static fromObject(obj: any): Message {
        if (obj.type === 'get') {
            return Get.fromObject(obj);
        } else if (obj.type === 'put') {
            return Put.fromObject(obj);
        } else {
            throw new Error('not implemented');
        }
    }

    static deserialize(str: string, from: Actor): Message {
        const obj = JSON.parse(str);
        if (obj.get) {
            return Get.deserialize(obj, str, from);
        } else if (obj.put) {
            return Put.deserialize(obj, str, from);
        } else if (obj.dam && obj.dam === "hi") {
            return Hi.deserialize(obj);
        } else {
            throw new Error('unknown message type');
        }
    }

    serialize(): string {
        throw new Error('not implemented');
    }
}

function generateMsgId(): string {
    return Math.random().toString(36).slice(2, 10);
}

export class Get implements Message {
    type: string = 'get';
    id: string;
    nodeId: string;
    from: Actor;
    recipients?: string[];
    childKey?: string;
    jsonStr?: string;
    checksum?: string;

    serialize(): string {
        if (this.jsonStr) {
            return this.jsonStr;
        }

        const obj: any = {
            get: {
                "#": this.nodeId,
            },
            "#": this.id,
        };

        if (this.childKey) {
            obj.get['.'] = this.childKey;
        }
        this.jsonStr = JSON.stringify(obj);
        return this.jsonStr;
    }

    static deserialize(obj: any, jsonStr: string, from: Actor): Get {
        const id = obj['#'];
        const nodeId = obj.get['#'];
        const childKey = obj.get['.'];
        return new Get(id, nodeId, from, undefined, childKey, jsonStr);
    }

    static fromObject(obj: any): Get {
        return new Get(obj.id, obj.nodeId, obj.from, obj.recipients, obj.childKey, obj.jsonStr, obj.checksum);
    }

    static new(nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string): Get {
        const id = generateMsgId();
        return new Get(id, nodeId, from, recipients, childKey, jsonStr, checksum);
    }

    constructor(id: string, nodeId: string, from: Actor, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string) {
        this.id = id;
        this.from = from;
        this.nodeId = nodeId;
        this.recipients = recipients;
        this.childKey = childKey;
        this.jsonStr = jsonStr;
        this.checksum = checksum;
    }
}

export type UpdatedNodes = {
    [key: string]: Children;
};

export class Put implements Message {
    type: string = 'put';
    id: string;
    from: Actor;
    updatedNodes: UpdatedNodes;
    inResponseTo?: string;
    recipients?: string[];
    jsonStr?: string;
    checksum?: string;

    serialize(): string {
        const obj = {
            "#" : this.id,
            "put": {} as any
        };

        // iterate over this.updatedNodes
        for (const [nodeId, children] of Object.entries(this.updatedNodes)) {
            const node: any = obj.put[nodeId] = {};
            for (const [childKey, childValue] of Object.entries(children)) {
                if (!childValue) {
                    continue;
                }
                const data = childValue;
                node[childKey] = data.value;
                node["_"] = node["_"] || {};
                node["_"][">"] = node["_"][">"] || {};
                node["_"][">"][childKey] = data.updatedAt;
            }
        }
        return JSON.stringify(obj);
    }

    static deserialize(obj: any, jsonStr: string, from: Actor): Put {
        const id = obj['#'];
        const updatedNodes = obj.put;
        return new Put(id, updatedNodes, from, undefined, undefined, jsonStr);
    }

    static fromObject(obj: any): Put {
        return new Put(obj.id, obj.updatedNodes, obj.from, obj.inResponseTo, obj.recipients, obj.jsonStr, obj.checksum);
    }

    static new(updatedNodes: UpdatedNodes, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put {
        const id = generateMsgId();
        return new Put(id, updatedNodes, from, inResponseTo, recipients, jsonStr, checksum);
    }

    static newFromKv(key: string, children: object, from:Actor) {
        const updatedNodes: any = {};
        updatedNodes[key] = children;
        return Put.new(updatedNodes, from);
    }

    constructor(id: string, updatedNodes: UpdatedNodes, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string) {
        this.id = id;
        this.from = from;
        this.updatedNodes = updatedNodes;
        this.inResponseTo = inResponseTo;
        this.recipients = recipients;
        this.jsonStr = jsonStr;
        this.checksum = checksum;
    }
}

export class Hi implements Message {
    type: string = 'hi';
    peerId: string;
    jsonStr?: string;

    //{"#":"aHHO9Srurq9nh6Q9","dam":"hi"}


    serialize(): string {
        if (this.jsonStr) {
            return this.jsonStr;
        }

        const obj: any = {
            dam: "hi",
            "#": this.peerId,
        };

        this.jsonStr = JSON.stringify(obj);
        return this.jsonStr;
    }

    static deserialize(obj: any): Hi {
        const peerId = obj['#'];
        return new Hi(peerId);
    }

    constructor(peerId: string, jsonStr?: string) {
        this.peerId = peerId;
        this.jsonStr = jsonStr;
    }
}

const parseGet = (get: any, from: Actor): Get => {
    return new Get(get.id, get.nodeId, from, get.recipients, get.childKey, get.jsonStr, get.checksum);
}

const parsePut = (put: any, from: Actor): Put => {
    return new Put(put.id, put.updatedNodes, from, put.inResponseTo, put.recipients, put.jsonStr, put.checksum);
}

export function messageFromJsonString(jsonStr: string, from: Actor): Message {
    const obj = JSON.parse(jsonStr);
    if (obj.get) {
        return parseGet(obj.get, from);
    } else if (obj.put) {
        return parsePut(obj.put, from);
    } else {
        throw new Error('Unknown message type');
    }
}