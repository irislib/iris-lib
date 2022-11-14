/// <reference types="node" />
import local from './local';
import global from './global';
import publicState from './public';
import group from './group';
import privateState from './private';
import SignedMessage from './SignedMessage';
import Channel from './Channel';
import Node from './db/Node';
declare const _default: {
    local: typeof local;
    global: typeof global;
    group: typeof group;
    public: typeof publicState;
    private: typeof privateState;
    static: {
        get(hash: string, callback: Function): Promise<unknown>;
        put(value: any): Promise<string | ArrayBuffer>;
    };
    electron: Node | null;
    peers: {
        known: {
            [key: string]: {
                url?: string | undefined;
                enabled?: boolean | undefined;
                from?: string | undefined;
                visibility?: string | undefined;
            };
        };
        add(peer: {
            url?: string | undefined;
            enabled?: boolean | undefined;
            from?: string | undefined;
            visibility?: string | undefined;
        }): Promise<void>;
        remove(url: string): void;
        disconnect(peerFromGun: any): void;
        save(): void;
        getSaved(): any;
        reset(): void;
        connect(url: string): void;
        disable(url: string, peerFromGun: any): void;
        isMixedContent(url: string): boolean;
        random(): any[];
        checkGunPeerCount(): void;
        init(): void;
    };
    session: {
        init(options?: any): void;
        DEFAULT_SETTINGS: {
            electron: {
                openAtLogin: boolean;
                minimizeOnClose: boolean;
            };
            local: {
                enableWebtorrent: boolean;
                enablePublicPeerDiscovery: boolean;
                autoplayWebtorrent: boolean;
                maxConnectedPeers: number;
            };
        };
        DEFAULT_FOLLOW: string;
        taskQueue: any[];
        updateSearchIndex: () => void;
        saveSearchResult: () => void;
        addFollow(callback: Function, k: string, followDistance: number, follower?: string | undefined): void;
        removeFollow(k: string, followDistance: number, follower: string): void;
        getExtendedFollows(callback: Function, k?: any, maxDepth?: number, currentDepth?: number): any;
        updateNoFollows: () => void;
        updateNoFollowers: () => void;
        getSearchIndex(): any;
        setOurOnlineStatus(): void;
        updateGroups(): void;
        login(k: any): void;
        loginAsNewUser(options?: any): Promise<void>;
        logOut(): Promise<void>;
        clearIndexedDB(): Promise<unknown>;
        getMyChatLink(): string;
        getKey(): any;
        getPubKey(): any;
        getMyName(): string;
        myPeerUrl: (ip: string) => string;
        shareMyPeerUrl(channel: Channel): Promise<void>;
        newChannel(pub: string, chatLink?: string | undefined): Channel | undefined;
        addChannel(chat: Channel): void;
        processMessage(chatId: string, msg: any, info: any, onClickNotification?: Function | undefined): void;
        subscribeToMsgs(pub: any): void;
        channelIds: Set<unknown>;
    };
    util: {
        gunOnceDefined: (node: any) => Promise<unknown>;
        getHash(data: any, format?: string): Promise<string | ArrayBuffer>;
        capitalize(s: string): string;
        generateName(): string;
        base64ToHex(str: string): string;
        arrayBufferToBase64(buffer: any): string;
        getCaret(el: HTMLInputElement): any;
        getUrlParameter(sParam: string, sParams: string): string | true | undefined;
        formatTime(date: Date): any;
        formatDate(date: Date): string;
        getDaySeparatorText(date: Date, dateStr: string, now?: Date | undefined, nowStr?: string | undefined): string;
        getProfileLink(pub: string): string;
        truncateString(s: string, length?: number): string;
        createElement(type: string, cls?: string | undefined, parent?: HTMLElement | undefined): HTMLElement;
        isNode: boolean;
        isElectron: boolean | "";
        isMobile: boolean;
        throttle: (func: Function, limit: number) => () => void;
        debounce: (func: Function, delay: number) => () => void;
        sample: (arr: any[]) => any;
        sampleSize: (arr: any[], size: number) => any[];
        defer: (func: Function) => number;
        once: (func: Function) => () => void;
        omit: (obj: any, keys: string[]) => {};
    };
    notifications: {
        init: () => void;
        notifyMsg: (msg: any, info: any, channelId: any, onClick: any) => void;
        getNotificationText: (notification: any) => Promise<string>;
        sendWebPushNotification: (recipient: any, notification: any) => Promise<void>;
        changeUnseenNotificationCount: (change: any) => void;
        subscribeToIrisNotifications: (onClick?: Function | undefined) => void;
        sendIrisNotification: (recipient: any, notification: any) => Promise<void>;
        changeChatUnseenCount: (chatId: any, change: any) => void;
        webPushSubscriptions: {};
        subscribeToWebPush: () => Promise<false | undefined>;
        getWebPushSubscriptions: () => Promise<void>;
        removeSubscription: (hash: any) => void;
    };
    SignedMessage: typeof SignedMessage;
    Channel: typeof Channel;
    Node: typeof Node;
    Key: {
        getActiveKey(datadir?: string, keyfile?: string, fs?: any): Promise<any>;
        getDefault(datadir?: string, keyfile?: string): Promise<any>;
        getActivePub(datadir?: string, keyfile?: string): Promise<any>;
        setActiveKey(key: any, save: boolean | undefined, datadir: string | undefined, keyfile: string | undefined, fs: any): void;
        toString(key: any): string;
        getId(key: any): any;
        fromString(str: string): any;
        generate(): Promise<{
            pub: any;
            priv: any;
            epub: any;
            epriv: any;
        } | undefined>;
        keyToJwk(key: any): JsonWebKey;
        sign(data: any, pair: any, cb?: Function | undefined, opt?: any): Promise<any>;
        verify(data: any, pair: any, cb?: Function | undefined, opt?: any): Promise<any>;
        secret(key: any, pair: any): Promise<string | undefined>;
        aeskey(key: any, salt?: Buffer | undefined): Promise<CryptoKey>;
        random(len: number): Buffer;
        encrypt(data: any, pair: any, cb?: Function | undefined, opt?: any): Promise<any>;
        decrypt(data: any, pair: any, cb?: Function | undefined, opt?: any): Promise<any>;
    };
};
export default _default;
