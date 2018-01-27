/*jshint unused: false */
`use strict`;
import {createHash} from 'crypto';
const jws = require(`jws`);
const keyutil = require(`./keyutil`);

const encoding = `base64`;
const JWS_MAX_LENGTH = 10000;
const errorMsg = `Invalid Identifi message:`;

function getHash(msg) {
  return createHash(`sha256`).update(JSON.stringify(msg.jws)).digest(`base64`);
}

function getSignerKeyHash(msg) {
  return keyutil.getHash(msg.jwsHeader.kid);
}

function validateJws(msg) {
  if (typeof msg.jws !== `string`) {throw Error(`${errorMsg} Message JWS must be a string`);}
  if (msg.jws.length > JWS_MAX_LENGTH) {throw Error(`${errorMsg} Message JWS max length is ${JWS_MAX_LENGTH}`);}
  return true;
}

function validate(msg) {
  if (!msg.signedData) {throw Error(`${errorMsg} Missing signedData`);}
  const d = msg.signedData;

  if (!d.type) {throw Error(`${errorMsg} Missing type definition`);}
  if (!d.author) {throw Error(`${errorMsg} Missing author`);}
  if (!d.author.length) {throw Error(`${errorMsg} Author empty`);}
  let i;
  let authorKeyID;
  if (msg.jwsHeader) {
    msg.signerKeyHash = getSignerKeyHash(msg);
  }
  for (i = 0;i < d.author.length;i ++) {
    if (d.author[i].length !== 2) {throw Error(`${errorMsg} Invalid author: ${d.author[i].toString()}`);}
    if (d.author[i][0] === `keyID`) {
      if (authorKeyID) {throw Error(`${errorMsg} Author may have only one keyID`);}
      else {authorKeyID = d.author[i][1];}
      if (msg.signerKeyHash && authorKeyID !== msg.signerKeyHash) {throw Error(`${errorMsg} If message has a keyID author, it must be signed by the same key`);}
    }
  }
  if (!d.recipient) {throw Error(`${errorMsg} Missing recipient`);}
  if (!d.recipient.length) {throw Error(`${errorMsg} Author empty`);}
  for (i = 0;i < d.recipient.length;i ++) {
    if (d.recipient[i].length !== 2) {throw Error(`${errorMsg} Invalid recipient: ${d.recipient[i].toString()}`);}
  }
  if (!d.timestamp) {throw Error(`${errorMsg} Missing timestamp`);}

  if (!Date.parse(d.timestamp)) {throw Error(`${errorMsg} Invalid timestamp`);}

  if (d.type === `rating`) {
    if (isNaN(d.rating)) {throw Error(`${errorMsg} Invalid rating`);}
    if (isNaN(d.maxRating)) {throw Error(`${errorMsg} Invalid maxRating`);}
    if (isNaN(d.minRating)) {throw Error(`${errorMsg} Invalid minRating`);}
    if (d.rating > d.maxRating) {throw Error(`${errorMsg} Rating is above maxRating`);}
    if (d.rating < d.minRating) {throw Error(`${errorMsg} Rating is below minRating`);}
    if (typeof d.context !== `string` || !d.context.length) {throw Error(`${errorMsg} Rating messages must have a context field`);}
  }

  if (d.type === `verify_identity` || d.type === `unverify_identity`) {
    if (d.recipient.length < 2) {throw Error(`${errorMsg} At least 2 recipient attributes are needed for a connection / disconnection`);}
  }

  return true;
}

function create(signedData, skipValidation) {
  const msg = {
    signedData: signedData
  };

  msg.signedData.timestamp = msg.signedData.timestamp || (new Date()).toISOString();

  if (!skipValidation) {
    validate(msg);
  }

  return msg;
}

export default {
  create: create,

  JWS_MAX_LENGTH: JWS_MAX_LENGTH,

  createRating: function(signedData, skipValidation) {
    const msg = this.create(signedData, true);

    msg.signedData.type = `rating`;
    msg.signedData.maxRating = msg.signedData.maxRating || 10;
    msg.signedData.minRating = msg.signedData.minRating || - 10;

    if (!skipValidation) {
      validate(msg);
    }

    return msg;
  },

  validate: validate,

  sign: function(msg, privKeyPEM, hex, skipValidation) {
    if (!skipValidation) {
      validate(msg);
    }
    msg.jwsHeader = {alg: `ES256`, kid: hex};
    msg.jws = jws.sign({
      header: msg.jwsHeader,
      payload: msg.signedData,
      privateKey: privKeyPEM
    });
    if (!skipValidation) {
      validateJws(msg);
    }
    msg.hash = getHash(msg).toString(encoding);
    return msg.jws;
  },

  decode: function(msg) {
    if (!msg.signedData) {
      const d = jws.decode(msg.jws);
      msg.signedData = JSON.parse(d.payload);
      msg.jwsHeader = d.header;
      msg.hash = getHash(msg).toString(encoding);
    }
    validateJws(msg);
    validate(msg);
    return msg;
  },

  verify: function(msg) {
    this.decode(msg);
    const pubKeyPEM = keyutil.getPubkeyPEMfromHex(msg.jwsHeader.kid);
    if (!jws.verify(msg.jws, msg.jwsHeader.alg, pubKeyPEM)) {
      throw new Error(`${errorMsg} Invalid signature`);
    }
    if (msg.hash) {
      if (msg.hash !== getHash(msg)) {
        throw new Error(`${errorMsg} Invalid message hash`);
      }
    } else {
      msg.hash = getHash(msg);
    }
    return true;
  },

  deserialize: function(jws) {
    const msg = {jws: jws};
    this.decode(msg);
    return msg;
  },

  isPositive: function(msg) {
    const d = msg.signedData;
    return d.rating > (d.maxRating + d.minRating) / 2;
  },

  getSignerKeyHash: getSignerKeyHash
};
