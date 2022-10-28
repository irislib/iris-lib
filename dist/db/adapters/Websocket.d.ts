import { Message } from "../Message";
import { Actor } from "../Actor";
import Router from "../Router.js";
export default class Websocket extends Actor {
    ws: WebSocket;
    router: Router;
    sendQueue: string[];
    constructor(url: string, router: Actor);
    handle(message: Message): void;
}
