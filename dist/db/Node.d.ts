import { Actor } from './Actor';
import { Message } from './Message';
import Router from './Router';
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
    counter: number;
    config: Config;
    currentUser: any;
    router: Router;
    constructor(id?: string, config?: Config, parent?: Node);
    getCurrentUser(): any;
    setCurrentUser(key: any): void;
    handle(message: Message): void;
    get(key: string): Node;
    user(pub: string | undefined): Node;
    auth(key: any): void;
    doCallbacks: (data: NodeData, key: string) => void;
    put(value: any): Promise<void>;
    private signIfNeeded;
    private addParentNodes;
    private request;
    once(callback?: Function | null): Promise<any>;
    on(callback: Function): void;
    map(callback: Function): void;
    opt(opts: any): void;
}
