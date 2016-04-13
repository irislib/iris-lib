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
      privKeyFile = datadir + '/private.key',
      pubKeyFile = datadir + '/public.key';
    if (fs.existsSync(privKeyFile) && fs.existsSync(pubKeyFile)) {
      var prvPEM = fs.readFileSync(privKeyFile, 'utf8');
      var pubPEM = fs.readFileSync(pubKeyFile, 'utf8');
      // Pubkey could be deducted from the privkey
      k = { prvKeyObj: rs.KEYUTIL.getKey(prvPEM), pubKeyObj: rs.KEYUTIL.getKey(pubPEM) };
      k.prvKeyObj.pem = prvPEM;
      k.pubKeyObj.pem = pubPEM;
    } else {
      k = this.generate();
      fs.writeFileSync(privKeyFile, k.prvKeyObj.pem, 'utf8');
      fs.writeFileSync(pubKeyFile, k.pubKeyObj.pem, 'utf8');
      fs.chmodSync(privKeyFile, 400);
    }
    return k;
  }
};
