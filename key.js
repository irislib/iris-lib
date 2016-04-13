'use strict';
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

module.exports = {
  derToPem: function(der) {
    var pem = '-----BEGIN PUBLIC KEY-----';

    var size = der.length;

    for (var i = 0; i < size; i = i + 64) {
        var end = i + 64 < size ? i + 64 : size;
        pem = pem + '\n' + der.substring(i, end);
    }

    pem = pem + '\n-----END PUBLIC KEY-----';
    return pem;
  },

  generate: function() {
    return ec.genKeyPair();
  },

  getDefault: function(datadir) {
    var k,
      fs = require('fs'),
      keyFile = datadir + '/private.key';
    if (fs.existsSync(keyFile)) {
      var f = fs.readFileSync(keyFile);
      k = ec.keyFromPrivate(f, 'base64');
    } else {
      k = this.generate();
      fs.writeFileSync(keyFile, k.getPrivate('base64'), 'utf8');
      fs.fchmod(keyFile, 600); // u+r og-rwx
    }
    return k;
  }
};
