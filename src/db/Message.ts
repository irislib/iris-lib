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
    from: string;
    recipients?: string[];
    childKey?: string;
    jsonStr?: string;
    checksum?: string;

    toJsonString(): string {
        return JSON.stringify({
            id: this.id,
            from: this.from,
            nodeId: this.nodeId,
            recipients: this.recipients,
            childKey: this.childKey,
            jsonStr: this.jsonStr,
            checksum: this.checksum
        });
    }

    static fromObject(obj: any): Get {
        return new Get(obj.id, obj.nodeId, obj.from, obj.recipients, obj.childKey, obj.jsonStr, obj.checksum);
    }

    static new(nodeId: string, from: string, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string): Get {
        const id = generateMsgId();
        return new Get(id, nodeId, from, recipients, childKey, jsonStr, checksum);
    }

    constructor(id: string, nodeId: string, from: string, recipients?: string[], childKey?: string, jsonStr?: string, checksum?: string) {
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
    from: string;
    updatedNodes: object;
    inResponseTo?: string;
    recipients?: string[];
    jsonStr?: string;
    checksum?: string;

    toJsonString(): string {
        return JSON.stringify(this);
    }

    static fromObject(obj: any): Put {
        return new Put(obj.id, obj.updatedNodes, obj.from, obj.inResponseTo, obj.recipients, obj.jsonStr, obj.checksum);
    }

    static new(updatedNodes: object, from: string, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string): Put {
        const id = generateMsgId();
        return new Put(id, updatedNodes, from, inResponseTo, recipients, jsonStr, checksum);
    }

    static newFromKv(key: string, children: object, from:string) {
        const updatedNodes: any = {};
        updatedNodes[key] = children;
        return Put.new(updatedNodes, from);
    }

    constructor(id: string, updatedNodes: object, from: string, inResponseTo?: string, recipients?: string[], jsonStr?: string, checksum?: string) {
        this.id = id;
        this.from = from;
        this.updatedNodes = updatedNodes;
        this.inResponseTo = inResponseTo;
        this.recipients = recipients;
        this.jsonStr = jsonStr;
        this.checksum = checksum;
    }
}

const parseGet = (get: any, from: string): Get => {
    return new Get(get.id, get.nodeId, from, get.recipients, get.childKey, get.jsonStr, get.checksum);
}

const parsePut = (put: any, from: string): Put => {
    return new Put(put.id, put.updatedNodes, from, put.inResponseTo, put.recipients, put.jsonStr, put.checksum);
}

export function messageFromJsonString(jsonStr: string, from: string): Message {
    const obj = JSON.parse(jsonStr);
    if (obj.get) {
        return parseGet(obj.get, from);
    } else if (obj.put) {
        return parsePut(obj.put, from);
    } else {
        throw new Error('Unknown message type');
    }
}