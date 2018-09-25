/*jshint unused: false */
`use strict`;
import util from './util';
import Attribute from './attribute';
import Key from './key';

const errorMsg = `Invalid Identifi message:`;

class ValidationError extends Error {}

/**
* Identifi message: an object that has an author, recipient, signer, type, timestamp, context and optionally other fields.
*
* On Identifi, signer and author can be different entities. This enables the crawling of content
* from existing datasets. That makes Identifi an useful search tool even with no initial userbase.
*
* Messages are serialized as JSON Web Signatures.
*/
class Message {
  /**
  * Creates a message from the param object that must contain at least the mandatory fields: author, recipient, type, context and timestamp. You can use createRating() and createVerification() to automatically populate some of these fields and optionally sign the message.
  * @param signedData
  */
  constructor(obj: Object) {
    if (obj.signedData) {
      this.signedData = obj.signedData;
    }
    if (obj.pubKey) {
      this.pubKey = obj.pubKey;
    }
    if (obj.sig) {
      if (typeof obj.sig !== `string`) {
        throw new ValidationError(`Message signature must be a string`);
      }
      this.sig = obj.sig;
      this.getHash();
    }
    this._validate();
  }

  /**
  * @returns {string} Message signer keyID, i.e. base64 hash of public key
  */
  getSignerKeyID() {
    return util.getHash(this.pubKey);
  }

  _validate() {
    if (!this.signedData) {throw new ValidationError(`${errorMsg} Missing signedData`);}
    if (typeof this.signedData !== `object`) {throw new ValidationError(`${errorMsg} signedData must be an object`);}
    const d = this.signedData;

    if (!d.type) {throw new ValidationError(`${errorMsg} Missing type definition`);}
    if (!d.author) {throw new ValidationError(`${errorMsg} Missing author`);}
    if (!d.author.length) {throw new ValidationError(`${errorMsg} Author empty`);}
    let i;
    let authorKeyID;
    if (this.pubKey) {
      this.getSignerKeyID().then(hash => {
        this.signerKeyHash = hash;
      });
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

  /**
  * @returns {boolean} true if message has a positive rating
  */
  isPositive() {
    return this.signedData.type === `rating` && this.signedData.rating > (this.signedData.maxRating + this.signedData.minRating) / 2;
  }

  /**
  * @returns {boolean} true if message has a negative rating
  */
  isNegative() {
    return this.signedData.type === `rating` && this.signedData.rating < (this.signedData.maxRating + this.signedData.minRating) / 2;
  }

  /**
  * @returns {boolean} true if message has a neutral rating
  */
  isNeutral() {
    return this.signedData.type === `rating` && this.signedData.rating === (this.signedData.maxRating + this.signedData.minRating) / 2;
  }

  /**
  * @param {Object} key Gun.SEA keypair to sign the message with
  */
  async sign(key: Object) {
    this.sig = await Key.sign(this.signedData, key);
    this.pubKey = key.pub;
    await this.getHash();
    return true;
  }

  /**
  * Create an identifi message. Message timestamp and context (identifi) are automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
  * @param {Object} signedData message data object including author, recipient and other possible attributes
  * @param {Object} signingKey optionally, you can set the key to sign the message with
  * @returns {Message} Identifi message
  */
  static async create(signedData: Object, signingKey: Object) {
    if (!signedData.author && signingKey) {
      signedData.author = [[`keyID`, await Key.getId(signingKey)]];
    }
    signedData.timestamp = signedData.timestamp || (new Date()).toISOString();
    signedData.context = signedData.context || `identifi`;
    const m = new Message({signedData});
    if (signingKey) {
      await m.sign(signingKey);
    }
    return m;
  }

  /**
  * Create an Identifi verification message. Message type, maxRating, minRating, timestamp and context (identifi) are automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
  */
  static createVerification(signedData: Object, signingKey: Object) {
    signedData.type = `verification`;
    return Message.create(signedData, signingKey);
  }

  /**
  * Create an Identifi rating message. Message type, maxRating, minRating, timestamp and context are set automatically. If signingKey is specified and author omitted, signingKey will be used as author.
  */
  static createRating(signedData: Object, signingKey: Object) {
    signedData.type = `rating`;
    signedData.maxRating = signedData.maxRating || 10;
    signedData.minRating = signedData.minRating || - 10;
    return Message.create(signedData, signingKey);
  }

  /**
  * @param {Index} index index to look up the message author from
  * @returns {Promise(Identity)} message author identity
  */
  getAuthor(index) {
    for (let i = 0;i < this.signedData.author.length;i ++) {
      const a = this.signedData.author[i];
      if (Attribute.isUniqueType(a[0])) {
        return index.get(a[1], a[0]);
      }
    }
  }

  /**
  * @param {Index} index index to look up the message recipient from
  * @returns {Promise(Identity)} message recipient identity
  */
  getRecipient(index) {
    for (let i = 0;i < this.signedData.recipient.length;i ++) {
      const a = this.signedData.recipient[i];
      if (Attribute.isUniqueType(a[0])) {
        return index.get(a[1], a[0]);
      }
    }
  }

  /**
  * @returns {string} base64 hash of message
  */
  async getHash() {
    if (this.sig && !this.hash) {
      this.hash = await util.getHash(this.sig);
    }
    return this.hash;
  }

  static async fromSig(obj) {
    const signedData = await Key.verify(obj.sig, obj.pubKey);
    return new Message({signedData, sig: obj.sig, pubKey: obj.pubKey});
  }

  /**
  * @return {boolean} true if message signature is valid. Otherwise throws ValidationError.
  */
  async verify() {
    if (!this.pubKey) {
      throw new ValidationError(`${errorMsg} Message has no .pubKey`);
    }
    if (!this.sig) {
      throw new ValidationError(`${errorMsg} Message has no .sig`);
    }
    this.signedData = await Key.verify(this.sig, this.pubKey);
    if (!this.signedData) {
      throw new ValidationError(`${errorMsg} Invalid signature`);
    }
    if (this.hash) {
      if (this.hash !== await util.getHash(this.sig)) {
        throw new ValidationError(`${errorMsg} Invalid message hash`);
      }
    } else {
      await this.getHash();
    }
    return true;
  }
}

export default Message;
