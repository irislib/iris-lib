import { Message } from './Message';
export declare function generateUuid(): string;
export declare class Actor {
    id: string;
    handle(_message: Message): void;
    postMessage(message: Message): void;
    constructor(id?: string);
}
