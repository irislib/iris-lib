import {Message} from './Message';

export function generateUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

export class Actor {
    id: string;

    handle(_message: Message) {
        throw new Error('not implemented');
    }

    // so we can support a similar api as Channels
    postMessage(message: Message) {
        this.handle(message);
    }

    constructor(id = generateUuid()) {
        this.id = id;
    }
}