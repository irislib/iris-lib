import 'gun/sea';
declare type MyKey = {
    pub: string;
    priv: string;
    epriv: string;
    epub: string;
    secp256k1: any;
};
declare class Key {
    /**
     * Derive a key from bytes. For example, sign a login prompt string with metamask and
     * pass the signature to this function to derive a key.
     * @param bytes
     */
    static deriveFromBytes(bytes: Uint8Array): Promise<MyKey>;
    private static addSecp256k1KeyPair;
    static fromSecp256k1(priv: string): Promise<MyKey>;
    static irisKeyPairFromHash(hash: any): {
        pub: string;
        priv: any;
    };
    static secp256k1KeyPairFromHash(hash: any): {
        rpub: string;
        priv: any;
    };
    static getActiveKey(datadir?: string, keyfile?: string, fs?: any): Promise<MyKey>;
    static getDefault(datadir?: string, keyfile?: string): Promise<MyKey>;
    static getActivePub(datadir?: string, keyfile?: string): Promise<string>;
    static setActiveKey(key: any, save: boolean | undefined, datadir: string | undefined, keyfile: string | undefined, fs: any): void;
    static toString(key: any): string;
    static getId(key: any): any;
    static fromString(str: string): any;
    static generate(): Promise<import("gun").ISEAPair>;
    static sign(msg: any, pair: any): Promise<string>;
    static verify(msg: any, pubKey: any): Promise<any>;
}
export default Key;
