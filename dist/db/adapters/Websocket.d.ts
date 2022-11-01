import { Message } from "../Message";
import { Actor } from "../Actor";
export default class Websocket extends Actor {
    ws: WebSocket;
    router: Actor;
    sendQueue: string[];
    constructor(url: string, router: Actor);
    handle(message: Message): void;
}
