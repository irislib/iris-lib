'use strict';
var execSync = require('child_process').execSync;
var crypto = require('crypto');

var myKey;

module.exports = {
  generate: function() {
    myKey = { public: {}, private: {} };
    myKey.private.pem = execSync('openssl ecparam -genkey -noout -name secp256k1').toString();
    myKey.public.pem = execSync('openssl ec -pubout', { input: myKey.private.pem }).toString();
    myKey.public.hex = this.getPubHexFromPrivPEM(myKey.private.pem);
    myKey.id = this.getId(new Buffer(myKey.public.hex, 'hex'));
    return myKey;
  },

  getId: function(publicKeyBuffer) {
    if (!(publicKeyBuffer instanceof Buffer)) {
      throw new Error('getId param must be a buffer');
    }
    return crypto.createHash('sha256').update(publicKeyBuffer).digest('base64');
  },

  getPubkeyPEMfromHex: function(hex) {
    return execSync('openssl ec -pubin -pubout -inform DER', { input: new Buffer(hex, 'hex') }).toString();
  },

  getPubHexFromPrivPEM: function(privPEM) {
    var hex = execSync('openssl ec -pubout -outform DER', { input: privPEM }).toString('hex');
    return hex;
  },

  getDefault: function(datadir) {
    if (myKey) {
      return myKey;
    }
    var fs = require('fs'),
      privKeyFile = datadir + '/private.key';
    if (!fs.existsSync(privKeyFile)) {
      execSync('openssl ecparam -genkey -noout -name secp256k1 -out ' + privKeyFile);
      fs.chmodSync(privKeyFile, 400);
    }
    myKey = { public: {}, private: {} };
    myKey.private.pem = fs.readFileSync(privKeyFile, 'utf8');
    myKey.public.hex = this.getPubHexFromPrivPEM(myKey.private.pem);
    myKey.public.pem = execSync('openssl ec -in ' + privKeyFile + ' -pubout').toString();
    myKey.id = this.getId(new Buffer(myKey.public.hex, 'hex'));
    return myKey;
  }
};
