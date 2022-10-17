import { Actor } from './Actor';
import { Message } from './Message';
declare type FunEventListener = {
    off: Function;
};
export declare type Config = {
    peerId?: string;
    allowPublicSpace: boolean;
    myPublicKey?: string;
    enableStats: boolean;
    webSocketPeers?: string[];
    localOnly: boolean;
};
export declare const DEFAULT_CONFIG: Config;
export default class Node extends Actor {
    id: string;
    parent?: Node;
    children: Map<string, Node>;
    once_subscriptions: Map<number, Function>;
    on_subscriptions: Map<number, Function>;
    map_subscriptions: Map<number, Function>;
    value: undefined;
    counter: number;
    loaded: boolean;
    config: Config;
    router: BroadcastChannel;
    constructor(id?: string, config?: Config, parent?: Node);
    handle(message: Message): void;
    get(key: string): Node;
    doCallbacks: () => void;
    put(value: any): void;
    private addParentNodes;
    once(callback?: Function | null, event?: FunEventListener, returnIfUndefined?: boolean): Promise<any>;
    on(callback: Function): void;
    map(callback: Function): void;
}
export {};
