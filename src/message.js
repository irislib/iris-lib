/*jshint unused: false */
`use strict`;
import {MessageDigest, jws, KEYUTIL, asn1} from 'jsrsasign';
import util from './util';
import Identity from './identity';

const JWS_MAX_LENGTH = 10000;
const errorMsg = `Invalid Identifi message:`;

class ValidationError extends Error {}

class Message {
  constructor(signedData) {
    this.signedData = signedData;
    this.validate();
  }

  getSignerKeyID() {
    return util.getHash(this.jwsHeader.key || this.jwsHeader.kid);
  }

  validate() {
    if (!this.signedData) {throw new ValidationError(`${errorMsg} Missing signedData`);}
    if (typeof this.signedData !== `object`) {throw new ValidationError(`${errorMsg} signedData must be an object`);}
    const d = this.signedData;

    if (!d.type) {throw new ValidationError(`${errorMsg} Missing type definition`);}
    if (!d.author) {throw new ValidationError(`${errorMsg} Missing author`);}
    if (!d.author.length) {throw new ValidationError(`${errorMsg} Author empty`);}
    let i;
    let authorKeyID;
    if (this.jwsHeader) {
      this.signerKeyHash = this.getSignerKeyID();
    }
    for (i = 0;i < d.author.length;i ++) {
      if (d.author[i].length !== 2) {throw new ValidationError(`${errorMsg} Invalid author: ${d.author[i].toString()}`);}
      if (d.author[i][0] === `keyID`) {
        if (authorKeyID) {throw new ValidationError(`${errorMsg} Author may have only one keyID`);}
        else {authorKeyID = d.author[i][1];}
        if (this.signerKeyHash && authorKeyID !== this.signerKeyHash) {throw new ValidationError(`${errorMsg} If message has a keyID author, it must be signed by the same key`);}
      }
    }
    if (!d.recipient) {throw new ValidationError(`${errorMsg} Missing recipient`);}
    if (!d.recipient.length) {throw new ValidationError(`${errorMsg} Author empty`);}
    for (i = 0;i < d.recipient.length;i ++) {
      if (d.recipient[i].length !== 2) {throw new ValidationError(`${errorMsg} Invalid recipient: ${d.recipient[i].toString()}`);}
    }
    if (!d.timestamp) {throw new ValidationError(`${errorMsg} Missing timestamp`);}

    if (!Date.parse(d.timestamp)) {throw new ValidationError(`${errorMsg} Invalid timestamp`);}

    if (d.type === `rating`) {
      if (isNaN(d.rating)) {throw new ValidationError(`${errorMsg} Invalid rating`);}
      if (isNaN(d.maxRating)) {throw new ValidationError(`${errorMsg} Invalid maxRating`);}
      if (isNaN(d.minRating)) {throw new ValidationError(`${errorMsg} Invalid minRating`);}
      if (d.rating > d.maxRating) {throw new ValidationError(`${errorMsg} Rating is above maxRating`);}
      if (d.rating < d.minRating) {throw new ValidationError(`${errorMsg} Rating is below minRating`);}
      if (typeof d.context !== `string` || !d.context.length) {throw new ValidationError(`${errorMsg} Rating messages must have a context field`);}
    }

    if (d.type === `verify_identity` || d.type === `unverify_identity`) {
      if (d.recipient.length < 2) {throw new ValidationError(`${errorMsg} At least 2 recipient attributes are needed for a connection / disconnection`);}
    }

    return true;
  }

  isPositive() {
    return this.signedData.rating > (this.signedData.maxRating + this.signedData.minRating) / 2;
  }

  sign(key, skipValidation) {
    this.jwsHeader = {alg: `ES256`, key: key.pubKeyASN1};
    this.jws = jws.JWS.sign(this.jwsHeader.alg, JSON.stringify(this.jwsHeader), JSON.stringify(this.signedData), key);
    if (!skipValidation) {
      Message.validateJws(this.jws);
    }
    this.getHash();
    return this;
  }

  static create(signedData, signingKey) {
    if (!signedData.author && signingKey) {
      signedData.author = [[`keyID`, signingKey.keyID]];
    }
    signedData.timestamp = signedData.timestamp || (new Date()).toISOString();
    signedData.context = signedData.context || `identifi`;
    const m = new Message(signedData);
    if (signingKey) {
      m.sign(signingKey);
    }
    return m;
  }

  static createVerification(signedData, signingKey) {
    signedData.type = `verification`;
    return Message.create(signedData, signingKey);
  }

  static createRating(signedData, signingKey) {
    signedData.type = `rating`;
    signedData.maxRating = signedData.maxRating || 10;
    signedData.minRating = signedData.minRating || - 10;
    return Message.create(signedData, signingKey);
  }

  static fromJws(jwsString) {
    Message.validateJws(jwsString);
    const d = jws.JWS.parse(jwsString);
    const msg = new Message(d.payloadObj);
    msg.hash = Message.getHash(jwsString);
    msg.jwsHeader = d.headerObj;
    msg.jws = jwsString;
    return msg;
  }

  getAuthor(index) {
    if (index) {
      // TODO: search from index
    } else {
      const attrs = [];
      this.signedData.author.forEach(a => {
        attrs.push({name: a[0], val: a[1]});
      });
      const id = new Identity({attrs});
      if (this.authorPos && this.authorNeg) {
        id.data.receivedPositive = this.authorPos;
        id.data.receivedNegative = this.authorNeg;
      }
      if (this.authorTrustDistance) {
        id.data.trustDistance = this.authorTrustDistance;
      }
      if (this.authorName) {
        id.profile.name = this.authorName;
      }
      return id;
    }
  }

  getRecipient(index) {
    if (index) {
      // TODO: search from index
    } else {
      const attrs = [];
      this.signedData.recipient.forEach(a => {
        attrs.push({name: a[0], val: a[1]});
      });
      const id = new Identity({attrs});
      if (this.recipientPos && this.recipientNeg) {
        id.data.receivedPositive = this.recipientPos;
        id.data.receivedNegative = this.recipientNeg;
      }
      if (this.recipientTrustDistance) {
        id.data.trustDistance = this.recipientTrustDistance;
      }
      if (this.recipientName) {
        id.profile.name = this.recipientName;
      }
      return id;
    }
  }

  getHash() {
    if (this.jws && !this.hash) {
      this.hash = Message.getHash(this.jws);
    }
    return this.hash;
  }

  static getHash(jwsString) {
    const hex = new MessageDigest({alg: `sha256`, prov: `cryptojs`}).digestString(jwsString);
    return new Buffer(hex, `hex`).toString(`base64`);
  }

  verify() {
    const keyHex = this.jwsHeader.key || this.jwsHeader.kid;
    const pem = asn1.ASN1Util.getPEMStringFromHex(keyHex, `PUBLIC KEY`);
    const pubKey = KEYUTIL.getKey(pem);
    if (!jws.JWS.verify(this.jws, pubKey, [this.jwsHeader.alg])) {
      throw new ValidationError(`${errorMsg} Invalid signature`);
    }
    if (this.hash) {
      if (this.hash !== Message.getHash(this.jws)) {
        throw new ValidationError(`${errorMsg} Invalid message hash`);
      }
    } else {
      this.getHash();
    }
    return true;
  }

  static validateJws(jwsString) {
    if (typeof jwsString !== `string`) {throw new ValidationError(`${errorMsg} Message JWS must be a string`);}
    if (jwsString.length > JWS_MAX_LENGTH) {throw new ValidationError(`${errorMsg} Message JWS max length is ${JWS_MAX_LENGTH}`);}
    return true;
  }
}

export default Message;
