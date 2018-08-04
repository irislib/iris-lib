/*eslint no-useless-escape: "off", camelcase: "off" */

import {MessageDigest, KEYUTIL, pemtohex} from 'jsrsasign';

let myKey;
let isNode = false;
try {
  isNode = Object.prototype.toString.call(global.process) === `[object process]`;
} catch (e) { null; }

/**
* Utility class for Identifi integrations.
*/
export default {
  /**
  * @param {string} datadir directory to find key from. In browser, localStorage is used instead.
  * @returns {Object} jsrsasign private key object. If a key does not exist in datadir, a new one is generated.
  */
  getDefaultKey: function(datadir = `.`) {
    if (myKey) {
      return myKey;
    }
    if (isNode) {
      const fs = require(`fs`);
      const privKeyFile = `${datadir}/private.key`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        const jwk = JSON.parse(f);
        myKey = this.jwkToPrvKey(jwk);
      } else {
        fs.writeFileSync(privKeyFile, this._generateAndSerializeKey());
        fs.chmodSync(privKeyFile, 400);
      }
    } else {
      const jwk = window.localStorage.getItem(`identifi.myKey`);
      if (jwk) {
        myKey = this.jwkToPrvKey(JSON.parse(jwk));
      } else {
        window.localStorage.setItem(`identifi.myKey`, this._generateAndSerializeKey());
      }
    }
    return myKey;
  },

  /**
  * @returns {Object} jsrsasign private key object with additional attributes "pubKeyASN1" and "keyID".
  */
  generateKey: function() {
    const key = this.generateKeyPair();
    key.prvKeyObj.pubKeyASN1 = this.getPubKeyASN1(key.pubKeyObj);
    key.prvKeyObj.keyID = this.getHash(key.prvKeyObj.pubKeyASN1);
    return key.prvKeyObj;
  },

  generateKeyPair: function() {
    return KEYUTIL.generateKeypair(`EC`, `secp256r1`);
  },

  /**
  * Convert a private key object to a JSON Web Key
  */
  prvKeyToJwk: function(key) {
    return KEYUTIL.getJWKFromKey(key);
  },

  /**
  * Convert a JWK (JSON Web Key) to a jsrsasign private key object
  */
  jwkToPrvKey: function(jwk) {
    const prv = KEYUTIL.getKey(jwk);
    prv.pubKeyASN1 = this.getPubKeyASN1(prv);
    prv.keyID = this.getHash(prv.pubKeyASN1);
    return prv;
  },

  /**
  * @param str Input string
  * @returns {string} Sha256 hash in base64
  */
  getHash: function(str) {
    const hex = new MessageDigest({alg: `sha256`, prov: `cryptojs`}).digestString(str);
    return new Buffer(hex, `hex`).toString(`base64`);
  },

  _generateAndSerializeKey: function() {
    myKey = this.generateKey();
    return JSON.stringify(this.prvKeyToJwk(myKey));
  },

  /**
  * Set a timeout for a promise
  * @param promise The promise to timeout
  * @param {number} timeout Number of milliseconds after which to timeout
  */
  timeoutPromise(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((resolve => {
        setTimeout(() => {
          // console.log('promise timed out');
          resolve();
        }, timeout);
      })),
    ]);
  },

  isNode,

  _getPubKeyASN1: function(keyObj) {
    if (keyObj.curveName === `P-256`) { // bug in jsrsasign
      keyObj.curveName = `secp256r1`;
    }
    const pem = KEYUTIL.getPEM(keyObj);
    return pemtohex(pem);
  },
};
