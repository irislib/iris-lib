/*eslint no-useless-escape: "off", camelcase: "off" */

import util from './util';
import Gun from 'gun';
import sea from 'gun/sea'; // eslint-disable-line no-unused-vars
const SEA = Gun.SEA;

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
  static async getDefault(datadir = `.`) {
    if (myKey) {
      return myKey;
    }
    if (util.isNode) {
      const fs = require(`fs`);
      const privKeyFile = `${datadir}/private.key`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        myKey = Key.fromJwk(f);
      } else {
        myKey = await Key.generate();
        fs.writeFileSync(privKeyFile, Key.toJwk(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check ${datadir}/private.key`);
      }
    } else {
      const jwk = window.localStorage.getItem(`identifi.myKey`);
      if (jwk) {
        myKey = Key.fromJwk(jwk);
      } else {
        myKey = await Key.generate();
        window.localStorage.setItem(`identifi.myKey`, Key.toJwk(myKey));
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check localStorage identifi.myKey`);
      }
    }
    return myKey;
  }

  /**
  * Serialize key as JSON Web key
  * @returns {String} JSON Web Key string
  */
  static toJwk(key) {
    return JSON.stringify(key);
  }

  static getId(key) {
    return util.getHash(key.pub);
  }

  /**
  * Get a Key from a JSON Web Key object.
  * @param {Object} jwk JSON Web Key
  * @returns {String}
  */
  static fromJwk(jwk) {
    return JSON.parse(jwk);
  }

  /**
  * Generate a new key
  * @returns {Object} Gun.SEA private key object
  */
  static generate() {
    return SEA.pair();
  }

  static sign(msg, pair) {
    return SEA.sign(msg, pair);
  }

  static verify(msg, pubKey) {
    return SEA.verify(msg, pubKey);
  }
}

export default Key;
