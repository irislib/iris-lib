import {Get, Message, Put} from "../Message";
import {Actor} from "../Actor";
//@ts-ignore

export default class Websocket extends Actor {
    ws: WebSocket;
    router: Actor;
    sendQueue: string[] = [];

    constructor(url: string, router: Actor) {
        super('websocket:' + url);
        console.log('Websocket', url);
        this.router = router;
        this.ws = new WebSocket(url.replace('http', 'ws'));
        this.ws.onopen = () => {
            //this.ws.send(new Hi(this.router.peerId).serialize());
            console.log(`Connected to ${url}`);
            this.sendQueue.forEach((message) => this.ws.send(message));
            this.sendQueue = [];
        }
        this.ws.onmessage = (event) => {
            try {
                const message = Message.deserialize(event.data, this);
                this.router.postMessage(message);
            } catch (e) {
                console.log('Failed to deserialize message', event.data, e);
            }
        }
        this.ws.onclose = () => {
            console.log(`Disconnected from ${url}`);
        }
        this.ws.onerror = () => {
            console.log(`Error on ${url}`);
        }
    }

    handle(message: Message): void {
        if (message instanceof Get || message instanceof Put) {
            if (message.from === this) {
                return;
            }
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(message.serialize());
            } else if (this.ws.readyState === WebSocket.CONNECTING) {
                this.sendQueue.push(message.serialize());
            }
        }
    }
}


