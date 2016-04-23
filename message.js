/*jshint unused: false */
'use strict';
var crypto = require('crypto');
var jws = require('jws');
var moment = require('moment');

var algorithm = 'ecdsa-with-SHA1';
var encoding = 'base64';

var keyutil = require('./keyutil');

function getHash(msg) {
  return crypto.createHash('sha256').update(JSON.stringify(msg.signedData)).digest('base64');
}

function getSignerKeyHash(msg) {
  return keyutil.getHash(msg.jwsHeader.kid);
}

function validate(msg) {
  var errorMsg = "Invalid Identifi message: ";
  if (!msg.signedData) { throw Error(errorMsg + "Missing signedData"); }
  var d = msg.signedData;

  if (!d.type) { throw Error(errorMsg + "Missing type definition"); }
  if (!d.author) { throw Error(errorMsg + "Missing author"); }
  if (!d.author.length) { throw Error(errorMsg + "Author empty"); }
  var i;
  var authorKeyID;
  if (msg.jwsHeader) {
    msg.signerKeyHash = getSignerKeyHash(msg);
  }
  for (i = 0; i < d.author.length; i++) {
    if (d.author[i].length !== 2) { throw Error(errorMsg + "Invalid author: " + d.author[i].toString() ); }
    if (d.author[i][0] === 'keyID') {
      if (authorKeyID) { throw Error(errorMsg + "Author may have only one keyID"); }
      else { authorKeyID = d.author[i][1]; }
      if (msg.signerKeyHash && authorKeyID !== msg.signerKeyHash) { throw Error(errorMsg + "If message has a keyID author, it must be signed by the same key"); }
    }
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
    if (typeof d.context !== 'string' || !d.context.length) { throw Error(errorMsg + "Rating messages must have a context field"); }
  }

  if (d.type === "confirm_connection" || d.type === "refute_connection") {
    if (d.recipient.length < 2) { throw Error(errorMsg + "At least 2 recipient identifiers are needed for a connection / disconnection"); }
  }

  return true;
}

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

  sign: function(msg, privKeyPEM, hex) {
    validate(msg);
    msg.jwsHeader = { alg: 'ES256', kid: hex };
    msg.jws = jws.sign({
      header: msg.jwsHeader,
      payload: msg.signedData,
      privateKey: privKeyPEM
    });
    msg.hash = getHash(msg).toString(encoding);
    return msg.jws;
  },

  decode: function(msg) {
    if (!msg.signedData) {
      var d = jws.decode(msg.jws);
      msg.signedData = JSON.parse(d.payload);
      msg.jwsHeader = d.header;
      msg.hash = getHash(msg).toString(encoding);
    }
    validate(msg);
    return msg;
  },

  verify: function(msg) {
    this.decode(msg);
    var pubKeyPEM = keyutil.getPubkeyPEMfromHex(msg.jwsHeader.kid);
    if (!jws.verify(msg.jws, msg.jwsHeader.alg, pubKeyPEM)) {
      throw new Error('Invalid signature');
    }
    return true;
  },

  deserialize: function(jws) {
    var msg = { jws: jws };
    this.decode(msg);
    return msg;
  },

  isPositive: function(msg) {
    var d = msg.signedData;
    return d.rating > (d.maxRating + d.minRating) / 2;
  },

  getSignerKeyHash: getSignerKeyHash
};
