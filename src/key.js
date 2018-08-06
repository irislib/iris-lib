/*eslint no-useless-escape: "off", camelcase: "off" */

import {KEYUTIL, pemtohex} from 'jsrsasign';
import util from './util';

let myKey;

/**
* Key management utils
*/
class Key {
  /**
  * Load default key from datadir/private.key on node.js or from local storage 'identifi.myKey' in browser.
  *
  * If default key does not exist, it is generated.
  * @param {string} datadir directory to find key from. In browser, localStorage is used instead.
  * @returns {Object} Key object
  */
  static getDefault(datadir = `.`) {
    if (myKey) {
      return myKey;
    }
    if (util.isNode) {
      const fs = require(`fs`);
      const privKeyFile = `${datadir}/private.key`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        const jwk = JSON.parse(f);
        myKey = Key.fromJwk(jwk);
      } else {
        myKey = Key.generate();
        fs.writeFileSync(privKeyFile, Key.toJwk(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
    } else {
      const jwk = window.localStorage.getItem(`identifi.myKey`);
      if (jwk) {
        myKey = Key.fromJwk(JSON.parse(jwk));
      } else {
        myKey = Key.generate();
        window.localStorage.setItem(`identifi.myKey`, Key.toJwk(myKey));
      }
    }
    return myKey;
  }

  /**
  * Serialize key as JSON Web key
  * @returns {String} JSON Web Key
  */
  static toJwk(key) {
    return JSON.stringify(KEYUTIL.getJWKFromKey(key));
  }

  /**
  * Get a Key from a JSON Web Key string.
  * @param {string} jwk JSON Web Key
  * @returns {Object}
  */
  static fromJwk(jwk) {
    const prv = KEYUTIL.getKey(jwk);
    prv.pubKeyASN1 = Key._getPubKeyASN1(prv);
    prv.keyID = util.getHash(prv.pubKeyASN1);
    return prv;
  }

  /**
  * Generate a new key
  * @returns {Object} jsrsasign private key object with additional attributes "pubKeyASN1" and "keyID".
  */
  static generate() {
    const key = KEYUTIL.generateKeypair(`EC`, `secp256r1`);
    key.prvKeyObj.pubKeyASN1 = Key._getPubKeyASN1(key.pubKeyObj);
    key.prvKeyObj.keyID = util.getHash(key.prvKeyObj.pubKeyASN1);
    return key.prvKeyObj;
  }

  static _getPubKeyASN1(key) {
    if (key.curveName === `P-256`) { // bug in jsrsasign
      key.curveName = `secp256r1`;
    }
    const pem = KEYUTIL.getPEM(key);
    return pemtohex(pem);
  }
}

export default Key;
