/*eslint no-useless-escape: "off", camelcase: "off" */

import util from './util';
import Gun from 'gun'; // eslint-disable-line no-unused-vars
import 'gun/sea';
const EC = require('elliptic').ec;
import * as secp from '@noble/secp256k1';
// eslint-disable-line no-unused-vars

type MyKey = {
  pub: string;
  priv: string;
  epriv: string;
  epub: string;
  secp256k1: any;
};

let myKey: MyKey;

function arrayToBase64Url(array: any) {
  return btoa(String.fromCharCode.apply(null, array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

function arrayToHex(array: any) {
  return Array.from(array, (byte: any) => {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');
};

function base64UrlToArray(base64Url: string) {
  return Uint8Array.from(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')), (c: any) => c.charCodeAt(0));
}

const hexToUint8Array = (hexString: string) => {
  const match = hexString.match(/.{1,2}/g);
  if (!match) {
    throw new Error('Not a hex string');
  }
  return Uint8Array.from(match.map((byte) => parseInt(byte, 16)));
};

class Key {
  /**
   * Derive a key from bytes. For example, sign a login prompt string with metamask and
   * pass the signature to this function to derive a key.
   * @param bytes
   */
  static async deriveFromBytes(bytes: Uint8Array): Promise<MyKey> {
    const hash1 = await window.crypto.subtle.digest('SHA-256', bytes);
    const hash2 = await window.crypto.subtle.digest('SHA-256', hash1);
    const signingKey = this.irisKeyPairFromHash(hash1);
    const encryptionKey = this.irisKeyPairFromHash(hash2);

    let k: any = {
      pub: signingKey.pub,
      priv: signingKey.priv,
      epub: encryptionKey.pub,
      epriv: encryptionKey.priv,
    };
    k = await Key.addSecp256k1KeyPair(k);
    return k;
  }

  private static async addSecp256k1KeyPair(key: any): Promise<MyKey> {
    if (!key.secp256k1) {
      const hash = await window.crypto.subtle.digest('SHA-256', base64UrlToArray(key.priv));
      key.secp256k1 = Key.secp256k1KeyPairFromHash(hash);
    }
    return key;
  }

  static async fromSecp256k1(priv: string): Promise<MyKey> {
    if (!secp.utils.isValidPrivateKey(priv)) {
      throw new Error(`invalid secp256k1 private key`);
    }
    const privArr = hexToUint8Array(priv);
    const hash = await window.crypto.subtle.digest('SHA-256', privArr);
    const k: any = await this.deriveFromBytes(new Uint8Array(hash));
    k.secp256k1 = { priv, rpub: arrayToHex(secp.schnorr.getPublicKey(privArr)) };
    return k;
  }

  static irisKeyPairFromHash(hash: any) {
    const ec = new EC('p256');
    const keyPair = ec.keyFromPrivate(new Uint8Array(hash));

    let privKey: any = keyPair.getPrivate().toArray('be', 32);
    let x: any = keyPair.getPublic().getX().toArray('be', 32);
    let y: any = keyPair.getPublic().getY().toArray('be', 32);

    privKey = arrayToBase64Url(privKey);
    x = arrayToBase64Url(x);
    y = arrayToBase64Url(y);

    const kp = { pub: `${x}.${y}`, priv: privKey };
    return kp;
  }

  // secp256k1 is used by nostr among others
  static secp256k1KeyPairFromHash(hash: any) {
    const p = new Uint8Array(hash);
    // double p to get a 64 byte array. hacky.
    let priv = new Uint8Array(64);
    priv.set(p);
    priv.set(p, 32);
    priv = secp.utils.hashToPrivateKey(priv);
    const rpub = secp.schnorr.getPublicKey(priv);

    const kp = { rpub: arrayToHex(rpub), priv: arrayToHex(priv) };
    return kp;
  }

  static async getActiveKey(datadir = `.`, keyfile = `iris.key`, fs?: any): Promise<MyKey> {
    if (myKey) {
      return myKey;
    }
    if (fs) {
      const privKeyFile = `${datadir}/${keyfile}`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        myKey = Key.fromString(f);
      } else {
        const newKey = await Key.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        fs.writeFileSync(privKeyFile, Key.toString(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check ${datadir}/${keyfile}`);
      }
    } else {
      const str = window.localStorage.getItem(`iris.myKey`);
      if (str) {
        myKey = Key.fromString(str);
      } else {
        const newKey = await Key.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        window.localStorage.setItem(`iris.myKey`, Key.toString(myKey));
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check localStorage iris.myKey`);
      }
    }
    return this.addSecp256k1KeyPair(myKey);
  }

  static getDefault(datadir = `.`, keyfile = `iris.key`): Promise<MyKey> {
    return Key.getActiveKey(datadir, keyfile);
  }

  static async getActivePub(datadir = `.`, keyfile = `iris.key`) {
    const key = await Key.getActiveKey(datadir, keyfile);
    return key.pub;
  }

  static setActiveKey(key: any, save = true, datadir = `.`, keyfile = `iris.key`, fs: any) {
    myKey = key;
    if (!save) return;
    if (util.isNode) {
      const privKeyFile = `${datadir}/${keyfile}`;
      fs.writeFileSync(privKeyFile, Key.toString(myKey));
      fs.chmodSync(privKeyFile, 400);
    } else {
      window.localStorage.setItem(`iris.myKey`, Key.toString(myKey));
    }
  }

  static toString(key: any) {
    return JSON.stringify(key);
  }

  static getId(key: any) {
    if (!(key && key.pub)) {
      throw new Error(`missing param`);
    }
    return key.pub; // hack until GUN supports lookups by keyID
    //return util.getHash(key.pub);
  }

  static fromString(str: string) {
    return JSON.parse(str);
  }

  static generate() {
    return Gun.SEA.pair();
  }

  static async schnorrSign(msg: string, priv: string): Promise<string> {
    const msgArr = hexToUint8Array(msg);
    const privArr = hexToUint8Array(priv);
    const sig = await secp.schnorr.sign(msgArr, privArr);
    return arrayToHex(sig);
  }

  static schnorrVerify(sig: string, msg: string, pub: string): Promise<boolean> {
    const sigArr = hexToUint8Array(sig);
    const msgArr = hexToUint8Array(msg);
    const pubArr = hexToUint8Array(pub);
    return secp.schnorr.verify(sigArr, msgArr, pubArr);
  }

  static async sign(msg: any, pair: any) {
    const sig = await Gun.SEA.sign(msg, pair);
    return `a${sig}`;
  }

  static verify(msg: any, pubKey: any) {
    return Gun.SEA.verify(msg.slice(1), pubKey);
  }
}

export default Key;
