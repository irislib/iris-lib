'use strict';
var rs = require('jsrsasign');

module.exports = {
  generate: function() {
    var k = rs.KEYUTIL.generateKeypair("EC", "secp256r1");
    var prvPEM = rs.KEYUTIL.getPEM(k.prvKeyObj, "PKCS8PRV");
    var pubPEM = rs.KEYUTIL.getPEM(k.pubKeyObj);
    k.prvKeyObj.pem = prvPEM;
    k.pubKeyObj.pem = pubPEM;
    return k;
  },

  getPubkeyPEMfromHex: function(hex) {
    return rs.KEYUTIL.getPEM(rs.KEYUTIL.getKey(hex).pubKeyObj);
  },

  getDefault: function(datadir) {
    var k,
      fs = require('fs'),
      keyFile = datadir + '/private.key';
    if (fs.existsSync(keyFile)) {
      var pem = fs.readFileSync(keyFile, 'utf8');
      k = rs.KEYUTIL.getKey(pem);
      k.prvKeyObj.pem = pem;
    } else {
      k = this.generate();
      fs.writeFileSync(keyFile, k.prvKeyObj.pem, 'utf8');
      fs.chmodSync(keyFile, 400); // u+r og-rwx
    }
    return k;
  }
};
