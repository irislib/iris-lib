declare class Key {
    static getActiveKey(datadir?: string, keyfile?: string, fs?: any): Promise<any>;
    static getDefault(datadir?: string, keyfile?: string): Promise<any>;
    static getActivePub(datadir?: string, keyfile?: string): Promise<any>;
    static setActiveKey(key: any, save: boolean | undefined, datadir: string | undefined, keyfile: string | undefined, fs: any): void;
    static toString(key: any): string;
    static getId(key: any): any;
    static fromString(str: string): any;
    static generate(): Promise<{
        pub: any;
        priv: any;
        epub: any;
        epriv: any;
    } | undefined>;
    static sign(data: any, _pair: any, _cb?: Function, _opt?: {}): Promise<any>;
    static secret(_pub: any, _pair: any): Promise<string>;
    static encrypt(_data: any, _pair: any, _cb?: Function, _opt?: {}): Promise<string>;
    static verify(_msg: any, _pubKey: any): boolean;
}
export default Key;
