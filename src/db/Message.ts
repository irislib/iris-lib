import {Actor} from './Actor';

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

    static deserialize(jsonStr: string, from: Actor): Get {
        const obj = JSON.parse(jsonStr);
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

export class Put implements Message {
    type: string = 'put';
    id: string;
    from: Actor;
    updatedNodes: object;
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
                node[childKey] = childValue.value;
                node["_"][">"][childKey] = childValue.updatedAt;
            }
        }
    }

    static fromObject(obj: any): Put {
        return new Put(obj.id, obj.updatedNodes, obj.from, obj.inResponseTo, obj.recipients, obj.jsonStr, obj.checksum);
    }

    static new(updatedNodes: object, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put {
        const id = generateMsgId();
        return new Put(id, updatedNodes, from, inResponseTo, recipients, jsonStr, checksum);
    }

    static newFromKv(key: string, children: object, from:Actor) {
        const updatedNodes: any = {};
        updatedNodes[key] = children;
        return Put.new(updatedNodes, from);
    }

    constructor(id: string, updatedNodes: object, from: Actor, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string) {
        this.id = id;
        this.from = from;
        this.updatedNodes = updatedNodes;
        this.inResponseTo = inResponseTo;
        this.recipients = recipients;
        this.jsonStr = jsonStr;
        this.checksum = checksum;
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