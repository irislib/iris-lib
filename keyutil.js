'use strict';
var execSync = require('child_process').execSync;

module.exports = {
  generate: function() {
    var k = { public: {}, private: {} };
    k.private.pem = execSync('openssl ecparam -genkey -noout -name secp256k1').toString();
    k.public.pem = execSync('openssl ec -pubout', { input: k.private.pem }).toString();
    k.public.hex = this.getPubHexFromPrivPEM(k.private.pem);
    return k;
  },

  getPubkeyPEMfromHex: function(hex) {
    return execSync('openssl ec -pubin -pubout -inform DER', { input: new Buffer(hex, 'hex') }).toString();
  },

  getPubHexFromPrivPEM: function(privPEM) {
    var hex = execSync('openssl ec -pubout -outform DER', { input: privPEM }).toString('hex');
    return hex;
  },

  getDefault: function(datadir) {
    var fs = require('fs'),
      privKeyFile = datadir + '/private.key';
    if (!fs.existsSync(privKeyFile)) {
      execSync('openssl ecparam -genkey -noout -name secp256k1 -out ' + privKeyFile);
      fs.chmodSync(privKeyFile, 400);
    }
    var k = { public: {}, private: {} };
    k.private.pem = fs.readFileSync(privKeyFile, 'utf8');
    k.public.hex = this.getPubHexFromPrivPEM(k.private.pem);
    k.public.pem = execSync('openssl ec -in ' + privKeyFile + ' -pubout').toString();
    return k;
  }
};
