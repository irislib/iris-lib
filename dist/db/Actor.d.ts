import { Message } from './Message';
export declare function generateUuid(): string;
export declare class Actor {
    channel: BroadcastChannel;
    handle(_message: Message): void;
    getChannel(): BroadcastChannel;
    constructor(id?: string);
}
