/*eslint no-useless-escape: "off", camelcase: "off" */

import {MessageDigest, KEYUTIL, pemtohex} from 'jsrsasign';

let myKey;
let isNode = false;
try {
  isNode = Object.prototype.toString.call(global.process) === `[object process]`;
} catch (e) { null; }

export default {
  UNIQUE_ID_VALIDATORS: {
    email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
    bitcoin: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
    bitcoin_address: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
    ip: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/,
    ipv6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/,
    gpg_fingerprint: null,
    gpg_keyid: null,
    google_oauth2: null,
    tel: /^\d{7,}$/,
    phone: /^\d{7,}$/,
    keyID: null,
    url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
    account: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
  },

  isNode,

  isUniqueType: function(type) {
    return Object.keys(this.UNIQUE_ID_VALIDATORS).indexOf(type) > - 1;
  },

  guessTypeOf: function(value) {
    for (const key in this.UNIQUE_ID_VALIDATORS) {
      if (value.match(this.UNIQUE_ID_VALIDATORS[key])) {
        return key;
      }
    }
  },

  getPubKeyASN1: function(keyObj) {
    if (keyObj.curveName === `P-256`) { // bug in jsrsasign
      keyObj.curveName = `secp256r1`;
    }
    const pem = KEYUTIL.getPEM(keyObj);
    return pemtohex(pem);
  },

  generateKeyPair: function() {
    return KEYUTIL.generateKeypair(`EC`, `secp256r1`);
  },

  keypairToJWK: function(kp) {
    return {
      prv: KEYUTIL.getJWKFromKey(kp.prvKeyObj),
      pub: KEYUTIL.getJWKFromKey(kp.pubKeyObj)
    };
  },

  jwkPairToPrvKey: function(jwkp) {
    const prv = KEYUTIL.getKey(jwkp.prv);
    prv.pubKeyASN1 = this.getPubKeyASN1(prv);
    return prv;
  },

  generateKey: function() {
    const key = this.generateKeyPair();
    key.prvKeyObj.pubKeyASN1 = this.getPubKeyASN1(key.pubKeyObj);
    return key.prvKeyObj;
  },

  getHash: function(str) {
    const hex = new MessageDigest({alg: `sha256`, prov: `cryptojs`}).digestString(str);
    return new Buffer(hex, `hex`).toString(`base64`);
  },

  getDefaultKey: function(datadir) {
    if (myKey) {
      return myKey;
    }
    if (isNode) {
      const fs = require(`fs`);
      const privKeyFile = `${datadir}/private.key`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        const jwkp = JSON.parse(f);
        myKey = this.jwkPairToPrvKey(jwkp);
      } else {
        const kp = this.generateKeyPair();
        myKey = kp.prvKeyObj;
        myKey.pubKeyASN1 = this.getPubKeyASN1(kp.pubKeyObj);
        const k = this.keypairToJWK(kp);
        fs.writeFile(privKeyFile, JSON.stringify(k));
        fs.chmodSync(privKeyFile, 400);
      }
    } else {
      const jwkp = window.localStorage.getItem(`identifi.myKey`);
      if (jwkp) {
        myKey = this.jwkPairToPrvKey(JSON.parse(jwkp));
      } else {
        const kp = this.generateKeyPair();
        myKey = kp.prvKeyObj;
        myKey.pubKeyASN1 = this.getPubKeyASN1(kp.pubKeyObj);
        const k = this.keypairToJWK(kp);
        window.localStorage.setItem(`identifi.myKey`, JSON.stringify(k));
      }
    }
    return myKey;
  }
};
