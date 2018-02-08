/*eslint no-useless-escape: "off", camelcase: "off" */

import {MessageDigest, KEYUTIL} from 'jsrsasign';

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

  guessTypeOf: function(value) {
    for (const key in this.UNIQUE_ID_VALIDATORS) {
      if (value.match(this.UNIQUE_ID_VALIDATORS[key])) {
        return key;
      }
    }
  },

  generateKey: function() {
    const key = {public: {}, private: {}};
    const kp = KEYUTIL.generateKeypair(`EC`, `secp256r1`);
    console.log(kp);
    key.private.pem = KEYUTIL.getPEM(kp.prvKeyObj, `PKCS8PRV`);
    key.public.pem = KEYUTIL.getPEM(kp.pubKeyObj);
    key.public.hex = kp.pubKeyObj.pubKeyHex;
    key.hash = this.getHash(key.public.hex);
    return key;
  },

  getHash: function(publicKey) {
    const hex = new MessageDigest({alg: `sha256`, prov: `cryptojs`}).digestString(publicKey);
    return new Buffer(hex, `hex`).toString(`base64`);
  },

  getPubkeyPEMfromHex: function(hex) {
    return KEYUTIL.getKey(hex, null, `pkcs8pub`);
  },

  getPubHexFromPrivPEM: function(privPEM) {
    const key = KEYUTIL.getKey(privPEM);
    return KEYUTIL.getPEM(key);
  },

  getDefault: function(datadir) {
    if (myKey) {
      return myKey;
    }
    if (isNode) {
      const fs = require(`fs`);
      const privKeyFile = `${datadir}/private.key`;
      if (!fs.existsSync(privKeyFile)) {
        // execSync(`openssl ecparam -genkey -noout -name secp256k1 -out ${privKeyFile}`, {stdio: stdio});
        fs.chmodSync(privKeyFile, 400);
      }
      myKey = {public: {}, private: {}};
      myKey.private.pem = fs.readFileSync(privKeyFile, `utf8`);
      myKey.public.hex = this.getPubHexFromPrivPEM(myKey.private.pem);
      // myKey.public.pem = execSync(`openssl ec -in ${privKeyFile} -pubout`, {stdio: stdio}).toString();
      myKey.hash = this.getHash(myKey.public.hex);
    } else {
      myKey = window.localStorage.getItem(`identifi.myKey`);
      if (!myKey) {
        myKey = this.generateKey();
        window.localStorage.setItem(`identifi.myKey`, myKey);
      }
    }
    return myKey;
  }
};
