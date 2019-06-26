/*eslint no-useless-escape: "off", camelcase: "off" */

import util from './util';
import Gun from 'gun';

let myKey;

/**
* Key management utils
*/
class Key {
  /**
  * Load default key from datadir/private.key on node.js or from local storage 'iris.myKey' in browser.
  *
  * If default key does not exist, it is generated.
  * @param {string} datadir directory to find key from. In browser, localStorage is used instead.
  * @returns {Promise(Object)} keypair object
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
        myKey = Key.fromString(f);
      } else {
        myKey = await Key.generate();
        fs.writeFileSync(privKeyFile, Key.toString(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check ${datadir}/private.key`);
      }
    } else {
      const jwk = window.localStorage.getItem(`iris.myKey`);
      if (jwk) {
        myKey = Key.fromString(jwk);
      } else {
        myKey = await Key.generate();
        window.localStorage.setItem(`iris.myKey`, Key.toString(myKey));
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check localStorage iris.myKey`);
      }
    }
    return myKey;
  }

  /**
  * Serialize key as JSON string
  * @param {Object} key key to serialize
  * @returns {String} JSON Web Key string
  */
  static toString(key) {
    return JSON.stringify(key);
  }

  /**
  * Get keyID
  * @param {Object} key key to get an id for. Currently just returns the public key string.
  * @returns {String} JSON Web Key string
  */
  static getId(key) {
    if (!(key && key.pub)) {
      throw new Error(`missing param`);
    }
    return key.pub; // hack until GUN supports lookups by keyID
    //return util.getHash(key.pub);
  }

  /**
  * Get a keypair from a JSON string.
  * @param {Object} jwk JSON Web Key
  * @returns {String}
  */
  static fromString(jwk) {
    return JSON.parse(jwk);
  }

  /**
  * Generate a new keypair
  * @returns {Promise(Object)} Gun.SEA keypair object
  */
  static generate() {
    return Gun.SEA.pair();
  }

  /**
  * Sign a message
  * @param {String} msg message to sign
  * @param {Object} pair signing keypair
  * @returns {Promise(String)} signed message string
  */
  static async sign(msg, pair) {
    const sig = await Gun.SEA.sign(msg, pair);
    return `a${sig}`;
  }

  /**
  * Verify a signed message
  * @param {String} msg message to verify
  * @param {Object} pubKey public key of the signer
  * @returns {Promise(String)} signature string
  */
  static verify(msg, pubKey) {
    return Gun.SEA.verify(msg.slice(1), pubKey);
  }
}

export default Key;
