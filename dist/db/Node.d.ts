import { Actor } from './Actor';
import { Message } from './Message';
declare type FunEventListener = {
    off: Function;
};
export declare type NodeData = {
    value: any;
    updatedAt: number;
};
export declare type Children = {
    [key: string]: NodeData;
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
    root: Node;
    parent?: Node;
    children: Map<string, Node>;
    once_subscriptions: Map<number, Function>;
    on_subscriptions: Map<number, Function>;
    map_subscriptions: Map<number, Function>;
    data: NodeData | undefined;
    counter: number;
    loaded: boolean;
    config: Config;
    currentUser: any;
    router: Actor;
    constructor(id?: string, config?: Config, parent?: Node);
    getCurrentUser(): any;
    setCurrentUser(key: any): void;
    handle(message: Message): void;
    private merge;
    get(key: string): Node;
    user(pub: string | undefined): Node;
    auth(key: any): void;
    doCallbacks: () => void;
    put(value: any): void;
    private addParentNodes;
    once(callback?: Function | null, event?: FunEventListener, returnIfUndefined?: boolean): Promise<any>;
    on(callback: Function): void;
    map(callback: Function): void;
}
export {};
