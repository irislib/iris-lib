/*jshint unused: false */
'use strict';
var crypto = require('crypto');
var jws = require('jws');
var moment = require('moment');

var algorithm = 'ecdsa-with-SHA1';
var encoding = 'base64';

var getHash = function(msg) {
  return crypto.createHash('sha256').update(JSON.stringify(msg.signedData)).digest();
};

var derToPem = function(der) {
  var pem = '-----BEGIN PUBLIC KEY-----';

  var size = der.length;

  for (var i = 0; i < size; i = i + 64) {
      var end = i + 64 < size ? i + 64 : size;
      pem = pem + '\n' + der.substring(i, end);
  }

  pem = pem + '\n-----END PUBLIC KEY-----';
  return pem;
};

var validate = function(msg) {
  var errorMsg = "Invalid Identifi message: ";
  if (!msg.signedData) { throw Error(errorMsg + "Missing signedData"); }
  var d = msg.signedData;

  if (!d.type) { throw Error(errorMsg + "Missing type definition"); }
  if (!d.author) { throw Error(errorMsg + "Missing author"); }
  if (!d.author.length) { throw Error(errorMsg + "Author empty"); }
  var i;
  for (i = 0; i < d.author.length; i++) {
    if (d.author[i].length !== 2) { throw Error(errorMsg + "Invalid author: " + d.author[i].toString() ); }
  }
  if (!d.recipient) { throw Error(errorMsg + "Missing recipient"); }
  if (!d.recipient.length) { throw Error(errorMsg + "Author empty"); }
  for (i = 0; i < d.recipient.length; i++) {
    if (d.recipient[i].length !== 2) { throw Error(errorMsg + "Invalid recipient: " + d.recipient[i].toString() ); }
  }
  if (!d.timestamp) { throw Error(errorMsg + "Missing timestamp"); }

  if (!moment(d.timestamp)) { throw Error(errorMsg + "Invalid timestamp"); }

  if (d.type === "rating") {
    if (isNaN(d.rating)) { throw Error(errorMsg + "Invalid rating"); }
    if (isNaN(d.maxRating)) { throw Error(errorMsg + "Invalid maxRating"); }
    if (isNaN(d.minRating)) { throw Error(errorMsg + "Invalid minRating"); }
    if (d.rating > d.maxRating) { throw Error(errorMsg + "Rating is above maxRating"); }
    if (d.rating < d.minRating) { throw Error(errorMsg + "Rating is below minRating"); }
  }

  if (d.type === "confirm_connection" || d.type === "refute_connection") {

  }

  return true;
};

function create(signedData, skipValidation) {
  var msg = {
    signedData: signedData
  };

  msg.signedData.timestamp = msg.signedData.timestamp || moment.utc().toISOString();

  if (!skipValidation) {
    validate(msg);
  }

  return msg;
}

module.exports = {
  create: create,

  createRating: function(signedData, skipValidation) {
    var msg = this.create(signedData, true);

    msg.signedData.type = 'rating';
    msg.signedData.maxRating = msg.signedData.maxRating || 10;
    msg.signedData.minRating = msg.signedData.minRating || -10;

    if (!skipValidation) {
      validate(msg);
    }

    return msg;
  },

  validate: validate,

  sign: function(msg, privKey, keyID) {
    validate(msg);
    msg.jwsHeader = { alg: 'ES256', kid: keyID };
    msg.jws = jws.sign({
      header: msg.jwsHeader,
      payload: msg.signedData,
      privateKey: privKey
    });
    msg.hash = getHash(msg).toString(encoding);
    return msg.jws;
  },

  decode: function(msg) {
    if (!msg.signedData) {
      var d = jws.decode(msg.jws);
      msg.signedData = d.payload;
      msg.jwsHeader = d.header;
      msg.hash = getHash(msg).toString(encoding);
    }
    validate(msg);
    return msg.jwsData;
  },

  verify: function(msg, pubKey) {
    this.decode(msg);
    return jws.verify(msg.jws, msg.jwsHeader.alg, pubKey);
  },

  deserialize: function(jws) {
    var msg = { jws: jws };
    this.decode(msg);
    return msg;
  },

  isPositive: function(msg) {
    var d = msg.signedData;
    return d.rating > (d.maxRating + d.minRating) / 2;
  }
};
