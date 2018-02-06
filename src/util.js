/*eslint no-useless-escape: "off", camelcase: "off" */

const execSync = require(`child_process`).execSync;
import crypto from 'webcrypto';

let myKey;

const stdio = [`pipe`, `pipe`, `ignore`]; // Ignore stderr

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

  guessTypeOf: function(value) {
    for (const key in this.UNIQUE_ID_VALIDATORS) {
      if (value.match(this.UNIQUE_ID_VALIDATORS[key])) {
        return key;
      }
    }
  },

  generate: function() {
    const key = {public: {}, private: {}};
    key.private.pem = execSync(`openssl ecparam -genkey -noout -name secp256k1`, {stdio: stdio}).toString();
    key.public.pem = execSync(`openssl ec -pubout`, {input: key.private.pem, stdio: stdio}).toString();
    key.public.hex = this.getPubHexFromPrivPEM(key.private.pem);
    key.hash = this.getHash(key.public.hex);
    return key;
  },

  getHash: function(publicKey) {
    return crypto.createHash(`sha256`).update(publicKey).digest(`base64`);
  },

  getPubkeyPEMfromHex: function(hex) {
    return execSync(`openssl ec -pubin -pubout -inform DER`, {input: new Buffer(hex, `hex`), stdio: stdio}).toString();
  },

  getPubHexFromPrivPEM: function(privPEM) {
    return execSync(`openssl ec -pubout -outform DER`, {input: privPEM, stdio: stdio}).toString(`hex`);
  },

  getDefault: function(datadir) {
    if (myKey) {
      return myKey;
    }
    const fs = require(`fs`);
    const privKeyFile = `${datadir}/private.key`;
    if (!fs.existsSync(privKeyFile)) {
      execSync(`openssl ecparam -genkey -noout -name secp256k1 -out ${privKeyFile}`, {stdio: stdio});
      fs.chmodSync(privKeyFile, 400);
    }
    myKey = {public: {}, private: {}};
    myKey.private.pem = fs.readFileSync(privKeyFile, `utf8`);
    myKey.public.hex = this.getPubHexFromPrivPEM(myKey.private.pem);
    myKey.public.pem = execSync(`openssl ec -in ${privKeyFile} -pubout`, {stdio: stdio}).toString();
    myKey.hash = this.getHash(myKey.public.hex);
    return myKey;
  }
};
