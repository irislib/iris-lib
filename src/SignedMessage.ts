// @ts-nocheck

/*jshint unused: false */
`use strict`;
import util from './util';
import Attribute from './Attribute';
import Key from './Key';

const errorMsg = `Invalid message:`;

class ValidationError extends Error {}

/**
* Signed message object. Your friends can index and relay your messages, while others can still verify that they were signed by you.
*
* Fields: signedData, signer (public key) and signature.
*
* signedData has an author, signer, type, time and optionally other fields.
*
* signature covers the utf8 string representation of signedData. Since messages are digitally signed, users only need to care about the message signer and not who relayed it or whose index it was found from.
*
* signer is the entity that verified its origin. In other words: message author and signer can be different entities, and only the signer needs to use Iris.
*
* For example, a crawler can import and sign other people's messages from Twitter. Only the users who trust the crawler will see the messages.
*
* Constructor: creates a message from the param obj.signedData that must contain at least the mandatory fields: author, type and time.
* @param obj
*
*/
class SignedMessage {
  signedData: any;
  pubKey: any;
  sig: any;

  constructor(obj: any) {
    this.signedData = obj.signedData;
    this.pubKey = obj.pubKey;
    if (obj.sig) {
      if (typeof obj.sig !== `string`) {
        throw new ValidationError(`SignedMessage signature must be a string`);
      }
      this.sig = obj.sig;
      this.getHash();
    }
    this._validate();
  }

  getSignerKeyID() {
    return this.pubKey; // hack until gun supports keyID lookups
    //return util.getHash(this.pubKey);
  }

  _validate() {
    if (!this.signedData) {throw new ValidationError(`${errorMsg} Missing signedData`);}
    if (typeof this.signedData !== `object`) {throw new ValidationError(`${errorMsg} signedData must be an object`);}
    const d = this.signedData;

    if (!d.type) {throw new ValidationError(`${errorMsg} Missing type definition`);}
    if (!d.author) {throw new ValidationError(`${errorMsg} Missing author`);}
    if (typeof d.author !== `object`) {throw new ValidationError(`${errorMsg} Author must be object`);}
    if (Array.isArray(d.author)) {throw new ValidationError(`${errorMsg} Author must not be an array`);}
    if (Object.keys(d.author).length === 0) {throw new ValidationError(`${errorMsg} Author empty`);}
    if (this.pubKey) {
      this.signerKeyHash = this.getSignerKeyID();
    }
    for (const attr in d.author) {
      const t = typeof d.author[attr];
      if (t !== `string`) {
        if (Array.isArray(d.author[attr])) {
          for (let i = 0;i < d.author[attr].length;i++) {
            if (typeof d.author[attr][i] !== `string`) {throw new ValidationError(`${errorMsg} Author attribute must be string, got ${attr}: [${d.author[attr][i]}]`);}
            if (d.author[attr][i].length === 0) {
              throw new ValidationError(`${errorMsg} author ${attr} in array[${i}] is empty`);
            }
          }
        } else {
          throw new ValidationError(`${errorMsg} Author attribute must be string or array, got ${attr}: ${d.author[attr]}`);
        }
      }
      if (attr === `keyID`) {
        if (t !== `string`) {throw new ValidationError(`${errorMsg} Author keyID must be string, got ${t}`);}
        if (this.signerKeyHash && d.author[attr] !== this.signerKeyHash) {throw new ValidationError(`${errorMsg} If message has a keyID author, it must be signed by the same key`);}
      }
    }
    if (d.recipient) {
      if (typeof d.recipient !== `object`) {throw new ValidationError(`${errorMsg} Recipient must be object`);}
      if (Array.isArray(d.recipient)) {throw new ValidationError(`${errorMsg} Recipient must not be an array`);}
      if (Object.keys(d.recipient).length === 0) {throw new ValidationError(`${errorMsg} Recipient empty`);}
      for (const attr in d.recipient) {
        const t = typeof d.recipient[attr];
        if (t !== `string`) {
          if (Array.isArray(d.recipient[attr])) {
            for (let i = 0;i < d.recipient[attr].length;i++) {
              if (typeof d.recipient[attr][i] !== `string`) {throw new ValidationError(`${errorMsg} Recipient attribute must be string, got ${attr}: [${d.recipient[attr][i]}]`);}
              if (d.recipient[attr][i].length === 0) {
                throw new ValidationError(`${errorMsg} recipient ${attr} in array[${i}] is empty`);
              }
            }
          } else {
            throw new ValidationError(`${errorMsg} Recipient attribute must be string or array, got ${attr}: ${d.recipient[attr]}`);
          }
        }
      }
    }
    if (!(d.time || d.timestamp)) {throw new ValidationError(`${errorMsg} Missing time field`);}

    if (!Date.parse(d.time || d.timestamp)) {throw new ValidationError(`${errorMsg} Invalid time field`);}

    return true;
  }

  /**
  * @param {Object} key keypair to sign the message with
  */
  async sign(key) {
    this.sig = await Key.sign(this.signedData, key);
    this.pubKey = key.pub;
    await this.getHash();
    return true;
  }

  /**
  * Create an iris message. SignedMessage time is automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
  * @param {Object} signedData message data object including author, recipient and other possible attributes
  * @param {Object} signingKey optionally, you can set the key to sign the message with
  * @returns {Promise<SignedMessage>}  message
  */
  static async create(signedData, signingKey) {
    if (!signedData.author && signingKey) {
      signedData.author = {keyID: Key.getId(signingKey)};
    }
    signedData.time = signedData.time || (new Date()).toISOString();
    const m = new SignedMessage({signedData});
    if (signingKey) {
      await m.sign(signingKey);
    }
    return m;
  }

  getAuthor(index) {
    for (const a of this.getAuthorIterable()) {
      if (a.isUniqueType()) {
        return index.getContacts(a);
      }
    }
  }

  getRecipient(index) {
    if (!this.signedData.recipient) {
      return undefined;
    }
    for (const a of this.getRecipientIterable()) {
      if (a.isUniqueType()) {
        return index.getContacts(a);
      }
    }
  }

  /**
  * @returns {string} base64 sha256 hash of message
  */
  async getHash() {
    if (this.sig && !this.hash) {
      this.hash = await util.getHash(this.sig);
    }
    return this.hash;
  }

  getId() {
    return this.getHash();
  }

  static async fromSig(obj) {
    if (!obj.sig) {
      throw new Error(`Missing signature in object:`, obj);
    }
    if (!obj.pubKey) {
      throw new Error(`Missing pubKey in object:`);
    }
    //const signedData = await Key.verify(obj.sig, obj.pubKey); // disable sig verification while migrating to new gun :(
    const signedData = JSON.parse(obj.sig.slice(4)).m;
    const o = {signedData, sig: obj.sig, pubKey: obj.pubKey};
    return new SignedMessage(o);
  }

  /**
  * @return {boolean} true if message signature is valid. Otherwise throws ValidationError.
  */
  async verify() {
    if (!this.pubKey) {
      throw new ValidationError(`${errorMsg} SignedMessage has no .pubKey`);
    }
    if (!this.sig) {
      throw new ValidationError(`${errorMsg} SignedMessage has no .sig`);
    }
    this.signedData = await Key.verify(this.sig, this.pubKey);
    if (!this.signedData) {
      throw new ValidationError(`${errorMsg} Invalid signature`);
    }
    if (this.hash) {
      if (this.hash !== (await util.getHash(this.sig))) {
        throw new ValidationError(`${errorMsg} Invalid message hash`);
      }
    } else {
      this.getHash();
    }
    return true;
  }

  /**
  * @returns {string}
  */
  serialize() {
    return {sig: this.sig, pubKey: this.pubKey};
  }

  toString() {
    return JSON.stringify(this.serialize());
  }

  /**
  * @returns {Promise<SignedMessage>}
  */
  static async deserialize(s) {
    return SignedMessage.fromSig(s);
  }

  static async fromString(s) {
    return SignedMessage.fromSig(JSON.parse(s));
  }
}

export default SignedMessage;
