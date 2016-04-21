'use strict';
var execSync = require('child_process').execSync;
var crypto = require('crypto');

var myKey;

var stdio = ['pipe', 'pipe', 'ignore']; // Ignore stderr

module.exports = {
  generate: function() {
    var key = { public: {}, private: {} };
    key.private.pem = execSync('openssl ecparam -genkey -noout -name secp256k1', { stdio: stdio }).toString();
    key.public.pem = execSync('openssl ec -pubout', { input: key.private.pem, stdio: stdio }).toString();
    key.public.hex = this.getPubHexFromPrivPEM(key.private.pem);
    key.hash = this.getHash(key.public.hex);
    return key;
  },

  getHash: function(publicKey) {
    return crypto.createHash('sha256').update(publicKey).digest('base64');
  },

  getPubkeyPEMfromHex: function(hex) {
    return execSync('openssl ec -pubin -pubout -inform DER', { input: new Buffer(hex, 'hex'), stdio: stdio }).toString();
  },

  getPubHexFromPrivPEM: function(privPEM) {
    var hex = execSync('openssl ec -pubout -outform DER', { input: privPEM, stdio: stdio }).toString('hex');
    return hex;
  },

  getDefault: function(datadir) {
    if (myKey) {
      return myKey;
    }
    var fs = require('fs'),
      privKeyFile = datadir + '/private.key';
    if (!fs.existsSync(privKeyFile)) {
      execSync('openssl ecparam -genkey -noout -name secp256k1 -out ' + privKeyFile, { stdio: stdio });
      fs.chmodSync(privKeyFile, 400);
    }
    myKey = { public: {}, private: {} };
    myKey.private.pem = fs.readFileSync(privKeyFile, 'utf8');
    myKey.public.hex = this.getPubHexFromPrivPEM(myKey.private.pem);
    myKey.public.pem = execSync('openssl ec -in ' + privKeyFile + ' -pubout', { stdio: stdio }).toString();
    myKey.hash = this.getHash(myKey.public.hex);
    return myKey;
  }
};
