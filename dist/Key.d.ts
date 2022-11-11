/// <reference types="node" />
declare const _default: {
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
    decrypt(data: any, pair: any, cb?: Function | undefined, opt?: any): Promise<string>;
};
export default _default;
