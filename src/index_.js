import Message from './message';
import Key from './key';
import Identity from './identity';
import Attribute from './attribute';
import util from './util';
import Gun from 'gun'; // eslint-disable-line no-unused-vars
import then from 'gun/lib/then'; // eslint-disable-line no-unused-vars
import load from 'gun/lib/load'; // eslint-disable-line no-unused-vars

// temp method for GUN search
async function searchText(node, callback, query, limit, cursor, desc) {
  const seen = {};
  //console.log(`cursor`, cursor, `query`, query, `desc`, desc);
  const q = {'-': desc};
  if (cursor) {
    if (desc) {
      q[`<`] = cursor;
    } else {
      q[`>`] = cursor;
    }
  }
  node.get({'.': q, '%': 20 * 1000}).once().map().on((value, key) => {
    //console.log(`searchText`, value, key, desc);
    if (key.indexOf(query) === 0) {
      if (typeof limit === `number` && Object.keys(seen).length >= limit) {
        return;
      }
      if (seen.hasOwnProperty(key)) {
        return;
      }
      if (value && Object.keys(value).length > 1) {
        seen[key] = true;
        callback({value, key});
      }
    }
  });
}

// TODO: flush onto IPFS
/**
* A database of Messages and Identities within the indexer's web of trust.
*
* Each added Message updates the Message and Identity indexes and web of trust accordingly.
*
* If you want messages saved to IPFS, pass options.ipfs = instance.
*
* When you use someone else's index, initialise it using the Index constructor
* @param {Object} gun gun node that contains an  index (e.g. user.get('iris'))
* @param {Object} options see default options in example
* @example
* Default options:
*{
*  ipfs: undefined,
*  indexSync: {
*    importOnAdd: {
*      enabled: true,
*      maxMsgCount: 500,
*      maxMsgDistance: 2
*    },
*    subscribe: {
*      enabled: true,
*      maxMsgDistance: 1
*    },
*    query: {
*      enabled: true
*    },
*    msgTypes: {
*      all: false,
*      rating: true,
*      verification: true,
*      unverification: true
*    },
*    debug: false
*  }
*}
* @returns {Index}  index object
*/
class Index {
  constructor(gun: Object, options) {
    this.gun = gun || new Gun();
    this.options = Object.assign({
      indexSync: {
        importOnAdd: {
          enabled: true,
          maxMsgCount: 100,
          maxMsgDistance: 2
        },
        subscribe: {
          enabled: true,
          maxMsgDistance: 1
        },
        query: {
          enabled: true
        },
        msgTypes: {
          all: false,
          rating: true,
          verification: true,
          unverification: true
        },
        debug: false
      }
    }, options);
    if (options.viewpoint) {
      this.viewpoint = options.viewpoint;
    } else {
      this.gun.get(`viewpoint`).on((val, key, msg, eve) => {
        if (val) {
          this.viewpoint = new Attribute(val);
          eve.off();
        }
      });
    }
    if (this.options.indexSync.subscribe.enabled) {
      setTimeout(() => {
        this.gun.get(`trustedIndexes`).map().once((val, uri) => {
          if (val) {
            // TODO: only get new messages?
            this.gun.user(uri).get(`iris`).get(`messagesByDistance`).map((val, key) => {
              const d = Number.parseInt(key.split(`:`)[0]);
              if (!isNaN(d) && d <= this.options.indexSync.subscribe.maxMsgDistance) {
                Message.fromSig(val).then(msg => {
                  if (this.options.indexSync.msgTypes.all ||
                    this.options.indexSync.msgTypes.hasOwnProperty(msg.signedData.type)) {
                    this.addMessage(msg, {checkIfExists: true});
                  }
                });
              }
            });
            this.gun.user(uri).get(`iris`).get(`reactions`).map((reaction, msgHash) => {
              this.gun.get(`messagesByHash`).get(msgHash).get(`reactions`).get(uri).put(reaction);
              this.gun.get(`messagesByHash`).get(msgHash).get(`reactions`).get(uri).put(reaction);
            });
          }
        });
      }, 5000); // TODO: this should be made to work without timeout
    }
  }

  debug() {
    const d = (util.isNode && process.env.DEBUG) ? process.env.DEBUG === `true` : this.options.debug;
    if (d) {
      console.log.apply(console, arguments);
    }
  }

  /**
  * Use this to load an index that you can write to
  * @param {Object} gun gun instance where the index is stored (e.g. new Gun())
  * @param {Object} keypair SEA keypair (can be generated with await irisLib.Key.generate())
  * @param {Object} options see default options in Index constructor's example
  * @returns {Promise}
  */
  static async create(gun: Object, keypair, options = {}) {
    if (!keypair) {
      keypair = await Key.getDefault();
    }
    const user = gun.user();
    user.auth(keypair);
    this.writable = true;
    options.viewpoint = new Attribute(`keyID`, Key.getId(keypair));
    const gunRoot = user.get(`iris`);
    const i = new Index(gunRoot, options);
    i.gun.get(`viewpoint`).put(options.viewpoint);
    const uri = options.viewpoint.uri();
    const g = i.gun.get(`identitiesBySearchKey`).get(uri);
    g.put({});
    const attrs = {};
    attrs[uri] = options.viewpoint;
    if (options.self) {
      const keys = Object.keys(options.self);
      for (let i = 0;i < keys.length;i ++) {
        const a = new Attribute(keys[i], options.self[keys[i]]);
        attrs[a.uri()] = a;
      }
    }
    const id = Identity.create(g, {trustDistance: 0, linkTo: options.viewpoint, attrs});
    await i._addIdentityToIndexes(id.gun);
    if (options.self) {
      const recipient = Object.assign(options.self, {keyID: options.viewpoint.value});
      Message.createVerification({recipient}, keypair).then(msg => {
        i.addMessage(msg);
      });
    }
    return i;
  }

  static getMsgIndexKey(msg) {
    let distance = parseInt(msg.distance);
    distance = Number.isNaN(distance) ? 99 : distance;
    distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
    const key = `${distance}:${Math.floor(Date.parse(msg.timestamp || msg.signedData.timestamp))}:${(msg.ipfs_hash || msg.hash).substr(0, 9)}`;
    return key;
  }

  // TODO: GUN indexing module that does this automatically
  static getMsgIndexKeys(msg) {
    const keys = {};
    let distance = parseInt(msg.distance);
    distance = Number.isNaN(distance) ? 99 : distance;
    distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
    const timestamp = Math.floor(Date.parse(msg.timestamp || msg.signedData.timestamp));
    const hashSlice = msg.getHash().substr(0, 9);
    keys.messagesByHash = [msg.getHash()];
    keys.messagesByTimestamp = [`${timestamp}:${hashSlice}`];
    keys.messagesByDistance = [`${distance}:${keys.messagesByTimestamp[0]}`];
    keys.messagesByType = [`${msg.signedData.type}:${timestamp}:${hashSlice}`];

    keys.messagesByAuthor = {};
    const authors = msg.getAuthorArray();
    for (let i = 0;i < authors.length;i ++) {
      if (authors[i].isUniqueType()) {
        keys.messagesByAuthor[authors[i].uri()] = `${msg.signedData.timestamp}:${hashSlice}`;
      }
    }
    keys.messagesByRecipient = {};
    const recipients = msg.getRecipientArray();
    for (let i = 0;i < recipients.length;i ++) {
      if (recipients[i].isUniqueType()) {
        keys.messagesByRecipient[recipients[i].uri()] = `${msg.signedData.timestamp}:${hashSlice}`;
      }
    }

    if ([`verification`, `unverification`].indexOf(msg.signedData.type) > - 1) {
      keys.verificationsByRecipient = {};
      for (let i = 0;i < recipients.length;i ++) {
        const r = recipients[i];
        if (!r.isUniqueType()) {
          continue;
        }
        for (let j = 0;j < authors.length;j ++) {
          const a = authors[j];
          if (!a.isUniqueType()) {
            continue;
          }
          keys.verificationsByRecipient[r.uri()] = a.uri();
        }
      }
    } else if (msg.signedData.type === `rating`) {
      keys.ratingsByRecipient = {};
      for (let i = 0;i < recipients.length;i ++) {
        const r = recipients[i];
        if (!r.isUniqueType()) {
          continue;
        }
        for (let j = 0;j < authors.length;j ++) {
          const a = authors[j];
          if (!a.isUniqueType()) {
            continue;
          }
          keys.ratingsByRecipient[r.uri()] = a.uri();
        }
      }
    }
    return keys;
  }

  async getIdentityIndexKeys(identity, hash) {
    const indexKeys = {identitiesByTrustDistance: [], identitiesBySearchKey: []};
    let d;
    if (identity.linkTo && this.viewpoint.equals(identity.linkTo)) { // TODO: identity is a gun instance, no linkTo
      d = 0;
    } else {
      d = await identity.get(`trustDistance`).then();
    }

    function addIndexKey(a) {
      if (!(a && a.value && a.type)) { // TODO: this sometimes returns undefined
        return;
      }
      let distance = d !== undefined ? d : parseInt(a.dist);
      distance = Number.isNaN(distance) ? 99 : distance;
      distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
      const v = a.value || a[1];
      const n = a.type || a[0];
      const value = encodeURIComponent(v);
      const lowerCaseValue = encodeURIComponent(v.toLowerCase());
      const name = encodeURIComponent(n);
      let key = `${value}:${name}`;
      let lowerCaseKey = `${lowerCaseValue}:${name}`;
      if (!Attribute.isUniqueType(n)) { // allow for multiple index keys with same non-unique attribute
        key = `${key}:${hash.substr(0, 9)}`;
        lowerCaseKey = `${lowerCaseKey}:${hash.substr(0, 9)}`;
      }
      indexKeys.identitiesBySearchKey.push(key);
      indexKeys.identitiesByTrustDistance.push(`${distance}:${key}`);
      if (key !== lowerCaseKey) {
        indexKeys.identitiesBySearchKey.push(lowerCaseKey);
        indexKeys.identitiesByTrustDistance.push(`${distance}:${lowerCaseKey}`);
      }
      if (v.indexOf(` `) > - 1) {
        const words = v.toLowerCase().split(` `);
        for (let l = 0;l < words.length;l += 1) {
          let k = `${encodeURIComponent(words[l])}:${name}`;
          if (!Attribute.isUniqueType(n)) {
            k = `${k}:${hash.substr(0, 9)}`;
          }
          indexKeys.identitiesBySearchKey.push(k);
          indexKeys.identitiesByTrustDistance.push(`${distance}:${k}`);
        }
      }
      if (key.match(/^http(s)?:\/\/.+\/[a-zA-Z0-9_]+$/)) {
        const split = key.split(`/`);
        indexKeys.identitiesBySearchKey.push(split[split.length - 1]);
        indexKeys.identitiesByTrustDistance.push(`${distance}:${split[split.length - 1]}`);
      }
    }

    if (this.viewpoint.equals(identity.linkTo)) {
      addIndexKey(identity.linkTo);
    }

    await identity.get(`attrs`).map().once(addIndexKey).then();
    return indexKeys;
  }

  /**
  * @returns {Identity} viewpoint identity (trustDistance == 0) of the index
  */
  async getViewpoint() {
    let vpAttr;
    if (this.viewpoint) {
      vpAttr = this.viewpoint;
    } else {
      vpAttr = new Attribute(await this.gun.get(`viewpoint`).then());
    }
    return new Identity(this.gun.get(`identitiesBySearchKey`).get(vpAttr.uri()));
  }

  /**
  * Get an identity referenced by an identifier.
  * get(type, value)
  * get(Attribute)
  * get(value) - guesses the type or throws an error
  * @returns {Identity} identity that is connected to the identifier param
  */
  get(a: String, b: String, reload = false) {
    if (!a) {
      throw new Error(`get failed: param must be a string, received ${typeof a} ${a}`);
    }
    let attr = a;
    if (a.constructor.name !== `Attribute`) {
      let type, value;
      if (b) {
        type = a;
        value = b;
      } else {
        value = a;
        type = Attribute.guessTypeOf(value);
      }
      attr = new Attribute(type, value);
    }
    if (reload) {
      // 1) get verifications connecting attr to other attributes
      // 2) recurse
      // 3) get messages received by this list of attributes
      // 4) calculate stats
      // 5) update identity index entry
      const o = {
        attributes: {},
        sent: {},
        received: {},
        receivedPositive: 0,
        receivedNeutral: 0,
        receivedNegative: 0,
        sentPositive: 0,
        sentNeutral: 0,
        sentNegative: 0
      };
      const node = this.gun.get(`identities`).set(o);
      const updateIdentityByLinkedAttribute = attribute => {
        this.gun.get(`verificationsByRecipient`).get(attribute.uri()).map().once(val => {
          const m = Message.fromSig(val);
          const recipients = m.getRecipientArray();
          for (let i = 0;i < recipients.length;i ++) {
            const a2 = recipients[i];
            if (!o.attributes.hasOwnProperty(a2.uri())) {
              // TODO remove attribute from identity if not enough verifications / too many unverifications
              o.attributes[a2.uri()] = a2;
              this.gun.get(`messagesByRecipient`).get(a2.uri()).map().once(val => {
                const m2 = Message.fromSig(val);
                if (!o.received.hasOwnProperty(m2.getHash())) {
                  o.received[m2.getHash()] = m2;
                  if (m2.isPositive()) {
                    o.receivedPositive ++;
                    m2.getAuthor(this).gun.get(`trustDistance`).on(d => {
                      if (typeof d === `number`) {
                        if (typeof o.trustDistance !== `number` || o.trustDistance > d + 1) {
                          o.trustDistance = d + 1;
                          node.get(`trustDistance`).put(d + 1);
                        }
                      }
                    });
                  } else if (m2.isNegative()) {
                    o.receivedNegative ++;
                  } else {
                    o.receivedNeutral ++;
                  }
                  node.put(o);
                }
              });
              this.gun.get(`messagesByAuthor`).get(a2.uri()).map().once(val => {
                const m2 = Message.fromSig(val);
                if (!o.sent.hasOwnProperty(m2.getHash())) {
                  o.sent[m2.getHash()] = m2;
                  if (m2.isPositive()) {
                    o.sentPositive ++;
                  } else if (m2.isNegative()) {
                    o.sentNegative ++;
                  } else {
                    o.sentNeutral ++;
                  }
                  node.put(o);
                }
              });
              updateIdentityByLinkedAttribute(a2);
            }
          }
        });
      };
      updateIdentityByLinkedAttribute(attr);
      if (this.writable) {
        this._addIdentityToIndexes(node);
      }
      return new Identity(node, attr);
    } else {
      return new Identity(this.gun.get(`identitiesBySearchKey`).get(attr.uri()), attr);
    }
  }

  async _getMsgs(msgIndex, callback, limit, cursor, desc, filter) {
    let results = 0;
    async function resultFound(result) {
      if (results >= limit) { return; }
      const msg = await Message.fromSig(result.value);
      if (filter && !filter(msg)) { return; }
      results ++;
      msg.cursor = result.key;
      if (result.value && result.value.ipfsUri) {
        msg.ipfsUri = result.value.ipfsUri;
      }
      msg.gun = msgIndex.get(result.key);
      callback(msg);
    }
    searchText(msgIndex, resultFound, ``, undefined, cursor, desc);
  }

  async _addIdentityToIndexes(id) {
    if (typeof id === `undefined`) {
      const e = new Error(`id is undefined`);
      console.error(e.stack);
      throw e;
    }
    const hash = Gun.node.soul(id) || `todo`;
    const indexKeys = await this.getIdentityIndexKeys(id, hash.substr(0, 6));

    const indexes = Object.keys(indexKeys);
    for (let i = 0;i < indexes.length;i ++) {
      const index = indexes[i];
      for (let j = 0;j < indexKeys[index].length;j ++) {
        const key = indexKeys[index][j];
        // this.debug(`adding to index ${index} key ${key}`);
        await this.gun.get(index).get(key).put(id);
      }
    }
  }

  /**
  * Get Messages sent by identity
  * @param {Identity} identity identity whose sent Messages to get
  * @param {Function} callback callback function that receives the Messages one by one
  */
  async getSentMsgs(identity: Identity, callback, limit, cursor, filter) {
    this._getMsgs(identity.gun.get(`sent`), callback, limit, cursor, true, filter);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`iris`).get(`messagesByAuthor`).get(identity.linkTo.uri());
          this._getMsgs(n, callback, limit, cursor, false, filter);
        }
      });
    }
  }

  /**
  * Get Messages received by identity
  * @param {Identity} identity identity whose received Messages to get
  * @param {Function} callback callback function that receives the Messages one by one
  */
  async getReceivedMsgs(identity, callback, limit, cursor, filter) {
    this._getMsgs(identity.gun.get(`received`), callback, limit, cursor, true, filter);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`iris`).get(`messagesByRecipient`).get(identity.linkTo.uri());
          this._getMsgs(n, callback, limit, cursor, false, filter);
        }
      });
    }
  }

  async _getAttributeTrustDistance(a) {
    if (!Attribute.isUniqueType(a.type)) {
      return;
    }
    if (this.viewpoint.equals(a)) {
      return 0;
    }
    const id = this.get(a);
    let d = await id.gun.get(`trustDistance`).then();
    if (isNaN(d)) {
      d = Infinity;
    }
    return d;
  }

  /**
  * @param {Message} msg
  * @returns {number} trust distance to msg author. Returns undefined if msg signer is not trusted.
  */
  async getMsgTrustDistance(msg) {
    let shortestDistance = Infinity;
    const signerAttr = new Attribute(`keyID`, msg.getSignerKeyID());
    if (!signerAttr.equals(this.viewpoint)) {
      const signer = this.get(signerAttr);
      const d = await signer.gun.get(`trustDistance`).then();
      if (isNaN(d)) {
        return;
      }
    }
    for (const a of msg.getAuthorArray()) {
      const d = await this._getAttributeTrustDistance(a);
      if (d < shortestDistance) {
        shortestDistance = d;
      }
    }
    return shortestDistance < Infinity ? shortestDistance : undefined;
  }

  async _updateMsgRecipientIdentity(msg, msgIndexKey, recipient) {
    const hash = `todo`;
    const identityIndexKeysBefore = await this.getIdentityIndexKeys(recipient, hash.substr(0, 6));
    const attrs = await new Promise(resolve => { recipient.get(`attrs`).load(r => resolve(r)); });
    if ([`verification`, `unverification`].indexOf(msg.signedData.type) > - 1) {
      const isVerification = msg.signedData.type === `verification`;
      for (const a of msg.getRecipientArray()) {
        let hasAttr = false;
        const v = {
          verifications: isVerification ? 1 : 0,
          unverifications: isVerification ? 0 : 1
        };
        Object.keys(attrs).forEach(k => {
          // TODO: if author is self, mark as self verified
          // TODO: only 1 verif / unverif per author
          if (a.equals(attrs[k])) {
            attrs[k].verifications = (attrs[k].verifications || 0) + v.verifications;
            attrs[k].unverifications = (attrs[k].unverifications || 0) + v.unverifications;
            hasAttr = true;
          }
        });
        if (!hasAttr) {
          attrs[a.uri()] = Object.assign({type: a.type, value: a.value}, v);
        }
        if (msg.goodVerification) {
          if (isVerification) {
            attrs[a.uri()].wellVerified = true;
          } else {
            attrs[a.uri()].wellUnverified = true;
          }
        }
      }
      recipient.get(`mostVerifiedAttributes`).put(Identity.getMostVerifiedAttributes(attrs)); // TODO: why this needs to be done twice to register?
      recipient.get(`mostVerifiedAttributes`).put(Identity.getMostVerifiedAttributes(attrs));
      recipient.get(`attrs`).put(attrs);
      recipient.get(`attrs`).put(attrs);
    }
    if (msg.signedData.type === `rating`) {
      const id = await recipient.then();
      id.receivedPositive = (id.receivedPositive || 0);
      id.receivedNegative = (id.receivedNegative || 0);
      id.receivedNeutral = (id.receivedNeutral || 0);
      if (msg.isPositive()) {
        if (typeof id.trustDistance !== `number` || msg.distance + 1 < id.trustDistance) {
          recipient.get(`trustDistance`).put(msg.distance + 1);
        }
        id.receivedPositive ++;
      } else {
        if (msg.distance < id.trustDistance) {
          recipient.get(`trustDistance`).put(false); // TODO: this should take into account the aggregate score of the identity
        }
        if (msg.isNegative()) {
          id.receivedNegative ++;
        } else {
          id.receivedNeutral ++;
        }
      }
      recipient.get(`receivedPositive`).put(id.receivedPositive);
      recipient.get(`receivedNegative`).put(id.receivedNegative);
      recipient.get(`receivedNeutral`).put(id.receivedNeutral);
      if (msg.signedData.context === `verifier`) {
        if (msg.distance === 0) {
          if (msg.isPositive) {
            recipient.get(`scores`).get(msg.signedData.context).get(`score`).put(10);
          } else if (msg.isNegative()) {
            recipient.get(`scores`).get(msg.signedData.context).get(`score`).put(0);
          } else {
            recipient.get(`scores`).get(msg.signedData.context).get(`score`).put(- 10);
          }
        }
      } else {
        // TODO: generic context-dependent score calculation
      }
    }
    const obj = {sig: msg.sig, pubKey: msg.pubKey};
    if (msg.ipfsUri) {
      obj.ipfsUri = msg.ipfsUri;
    }
    recipient.get(`received`).get(msgIndexKey).put(obj);
    recipient.get(`received`).get(msgIndexKey).put(obj);
    const identityIndexKeysAfter = await this.getIdentityIndexKeys(recipient, hash.substr(0, 6));
    const indexesBefore = Object.keys(identityIndexKeysBefore);
    for (let i = 0;i < indexesBefore.length;i ++) {
      const index = indexesBefore[i];
      for (let j = 0;j < identityIndexKeysBefore[index].length;j ++) {
        const key = identityIndexKeysBefore[index][j];
        if (!identityIndexKeysAfter[index] || identityIndexKeysAfter[index].indexOf(key) === - 1) {
          this.gun.get(index).get(key).put(null);
        }
      }
    }
  }

  async _updateMsgAuthorIdentity(msg, msgIndexKey, author) {
    if (msg.signedData.type === `rating`) {
      const id = await author.then();
      id.sentPositive = (id.sentPositive || 0);
      id.sentNegative = (id.sentNegative || 0);
      id.sentNeutral = (id.sentNeutral || 0);
      if (msg.isPositive()) {
        id.sentPositive ++;
      } else if (msg.isNegative()) {
        id.sentNegative ++;
      } else {
        id.sentNeutral ++;
      }
      author.get(`sentPositive`).put(id.sentPositive);
      author.get(`sentNegative`).put(id.sentNegative);
      author.get(`sentNeutral`).put(id.sentNeutral);
    }
    const obj = {sig: msg.sig, pubKey: msg.pubKey};
    if (msg.ipfsUri) {
      obj.ipfsUri = msg.ipfsUri;
    }
    author.get(`sent`).get(msgIndexKey).put(obj); // for some reason, doesn't work unless I do it twice
    author.get(`sent`).get(msgIndexKey).put(obj);
    return;
  }

  async _updateIdentityProfilesByMsg(msg, authorIdentities, recipientIdentities) {
    let start;
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    const ids = Object.values(Object.assign({}, authorIdentities, recipientIdentities));
    for (let i = 0;i < ids.length;i ++) { // add new identifiers to identity
      if (recipientIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        start = new Date();
        await this._updateMsgRecipientIdentity(msg, msgIndexKey, ids[i].gun);
        this.debug((new Date()) - start, `ms _updateMsgRecipientIdentity`);
      }
      if (authorIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        start = new Date();
        await this._updateMsgAuthorIdentity(msg, msgIndexKey, ids[i].gun);
        this.debug((new Date()) - start, `ms _updateMsgAuthorIdentity`);
      }
      start = new Date();
      await this._addIdentityToIndexes(ids[i].gun);
      this.debug((new Date()) - start, `ms _addIdentityToIndexes`);
    }
  }

  async removeTrustedIndex(gunUri) {
    this.gun.get(`trustedIndexes`).get(gunUri).put(null);
  }

  async addTrustedIndex(gunUri,
    maxMsgsToCrawl = this.options.indexSync.importOnAdd.maxMsgCount,
    maxMsgDistance = this.options.indexSync.importOnAdd.maxMsgDistance) {
    if (gunUri === this.viewpoint.value) {
      return;
    }
    const exists = await this.gun.get(`trustedIndexes`).get(gunUri).then();
    if (exists) {
      return;
    }
    this.gun.get(`trustedIndexes`).get(gunUri).put(true);
    const msgs = [];
    if (this.options.indexSync.importOnAdd.enabled) {
      await util.timeoutPromise(new Promise(resolve => {
        this.gun.user(gunUri).get(`iris`).get(`messagesByDistance`).map((val, key) => {
          const d = Number.parseInt(key.split(`:`)[0]);
          if (!isNaN(d) && d <= maxMsgDistance) {
            Message.fromSig(val).then(msg => {
              msgs.push(msg);
              if (msgs.length >= maxMsgsToCrawl) {
                resolve();
              }
            });
          }
        });
      }), 10000);
      this.debug(`adding`, msgs.length, `msgs`);
      this.addMessages(msgs);
    }
  }

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = {};
    const authorIdentities = {};
    let selfAuthored = false;
    let start;
    start = new Date();
    for (const a of msg.getAuthorArray()) {
      const id = this.get(a);
      let start2 = new Date();
      const td = await id.gun.get(`trustDistance`).then();
      this.debug((new Date()) - start2, `ms get trustDistance`);
      if (!isNaN(td)) {
        authorIdentities[id.gun[`_`].link] = id;
        start2 = new Date();
        const scores = await id.gun.get(`scores`).then();
        this.debug((new Date()) - start2, `ms get scores`);
        if (scores && scores.verifier && msg.signedData.type === `verification`) {
          msg.goodVerification = true;
        }
        if (td === 0) {
          selfAuthored = true;
        }
      }
    }
    this.debug((new Date()) - start, `ms getAuthorArray`);
    if (!Object.keys(authorIdentities).length) {
      return; // unknown author, do nothing
    }
    start = new Date();
    for (const a of msg.getRecipientArray()) {
      const id = this.get(a);
      const td = await id.gun.get(`trustDistance`).then();

      if (!isNaN(td)) {
        recipientIdentities[id.gun[`_`].link] = id;
      }
      if (selfAuthored && a.type === `keyID` && a.value !== this.viewpoint.value) { // TODO: not if already added - causes infinite loop?
        if (msg.isPositive()) {
          this.addTrustedIndex(a.value);
        } else {
          this.removeTrustedIndex(a.value);
        }
      }
    }
    this.debug((new Date()) - start, `ms getRecipientArray`);
    if (!Object.keys(recipientIdentities).length) { // recipient is previously unknown
      const attrs = {};
      let u;
      for (const a of msg.getRecipientArray()) {
        attrs[a.uri()] = a;
        if (!u && a.isUniqueType()) {
          u = a;
        }
      }
      const linkTo = Identity.getLinkTo(attrs);
      const trustDistance = msg.isPositive() && typeof msg.distance === `number` ? msg.distance + 1 : false;
      const start = new Date();
      const node = this.gun.get(`identitiesBySearchKey`).get(u.uri());
      node.put({});
      const id = Identity.create(node, {attrs, linkTo, trustDistance});
      this.debug((new Date) - start, `ms identity.create`);
      // {a:1} because inserting {} causes a "no signature on data" error from gun

      // TODO: take msg author trust into account
      recipientIdentities[id.gun[`_`].link] = id;
    }

    return this._updateIdentityProfilesByMsg(msg, authorIdentities, recipientIdentities);
  }

  /**
  * Add a list of messages to the index.
  * Useful for example when adding a new WoT dataset that contains previously
  * unknown authors.
  *
  * Iteratively performs sorted merge joins on [previously known identities] and
  * [new msgs authors], until all messages from within the WoT have been added.
  *
  * @param {Array} msgs an array of messages.
  * @param {Object} ipfs (optional) ipfs instance where the messages are saved
  * @returns {boolean} true on success
  */
  async addMessages(msgs) {
    const msgsByAuthor = {};
    if (Array.isArray(msgs)) {
      this.debug(`sorting ${msgs.length} messages onto a search tree...`);
      for (let i = 0;i < msgs.length;i ++) {
        for (const a of msgs[i].getAuthorArray()) {
          if (a.isUniqueType()) {
            const key = `${a.uri()}:${msgs[i].getHash()}`;
            msgsByAuthor[key] = msgs[i];
          }
        }
      }
      this.debug(`...done`);
    } else {
      throw `msgs param must be an array`;
    }
    const msgAuthors = Object.keys(msgsByAuthor).sort();
    if (!msgAuthors.length) {
      return;
    }
    let initialMsgCount, msgCountAfterwards;
    const index = this.gun.get(`identitiesBySearchKey`);
    do {
      const knownIdentities = [];
      let stop = false;
      searchText(index, result => {
        if (stop) { return; }
        knownIdentities.push(result);
      }, ``);
      await new Promise(r => setTimeout(r, 2000)); // wait for results to accumulate
      stop = true;
      knownIdentities.sort((a, b) => {
        if (a.key === b.key) {
          return 0;
        } else if (a.key > b.key) {
          return 1;
        } else {
          return - 1;
        }
      });
      let i = 0;
      let author = msgAuthors[i];
      let knownIdentity = knownIdentities.shift();
      initialMsgCount = msgAuthors.length;
      // sort-merge join identitiesBySearchKey and msgsByAuthor
      while (author && knownIdentity) {
        if (author.indexOf(knownIdentity.key) === 0) {
          try {
            await util.timeoutPromise(this.addMessage(msgsByAuthor[author], {checkIfExists: true}), 10000);
          } catch (e) {
            this.debug(`adding failed:`, e, JSON.stringify(msgsByAuthor[author], null, 2));
          }
          msgAuthors.splice(i, 1);
          author = i < msgAuthors.length ? msgAuthors[i] : undefined;
          //knownIdentity = knownIdentities.shift();
        } else if (author < knownIdentity.key) {
          author = i < msgAuthors.length ? msgAuthors[++ i] : undefined;
        } else {
          knownIdentity = knownIdentities.shift();
        }
      }
      msgCountAfterwards = msgAuthors.length;
    } while (msgCountAfterwards !== initialMsgCount);
    return true;
  }

  /**
  * Add a message to messagesByTimestamp and other relevant indexes. Update identities in the web of trust according to message data.
  *
  * @param msg Message to add to the index
  * @param ipfs (optional) ipfs instance where the message is additionally saved
  */
  async addMessage(msg: Message, options = {}) {
    let start;
    if (msg.constructor.name !== `Message`) {
      throw new Error(`addMessage failed: param must be a Message, received ${msg.constructor.name}`);
    }
    const hash = msg.getHash();
    if (true === options.checkIfExists) {
      const exists = await this.gun.get(`messagesByHash`).get(hash).then();
      if (exists) {
        return;
      }
    }
    const obj = {sig: msg.sig, pubKey: msg.pubKey};
    //const node = this.gun.get(`messagesByHash`).get(hash).put(obj);
    const node = this.gun.back(- 1).get(`messagesByHash`).get(hash).put(obj); // TODO: needs fix to https://github.com/amark/gun/issues/719
    start = new Date();
    msg.distance = await this.getMsgTrustDistance(msg);
    this.debug(`----`);
    this.debug((new Date()) - start, `ms getMsgTrustDistance`);
    if (msg.distance === undefined) {
      return false; // do not save messages from untrusted author
    }
    if (msg.signedData.replyTo) {
      this.gun.back(- 1).get(`messagesByHash`).get(msg.signedData.replyTo).get(`replies`).get(hash).put(node);
      this.gun.back(- 1).get(`messagesByHash`).get(msg.signedData.replyTo).get(`replies`).get(hash).put(node);
    }
    if (msg.signedData.sharedMsg) {
      this.gun.back(- 1).get(`messagesByHash`).get(msg.signedData.sharedMsg).get(`shares`).get(hash).put(node);
      this.gun.back(- 1).get(`messagesByHash`).get(msg.signedData.sharedMsg).get(`shares`).get(hash).put(node);
    }
    start = new Date();
    const indexKeys = Index.getMsgIndexKeys(msg);
    this.debug((new Date()) - start, `ms getMsgIndexKeys`);
    for (const index in indexKeys) {
      if (Array.isArray(indexKeys[index])) {
        for (let i = 0;i < indexKeys[index].length;i ++) {
          const key = indexKeys[index][i];
          // this.debug(`adding to index ${index} key ${key}`);
          this.gun.get(index).get(key).put(node);
          this.gun.get(index).get(key).put(node); // umm, what? doesn't work unless I write it twice
        }
      } else if (typeof indexKeys[index] === `object`) {
        for (const key in indexKeys[index]) {
          this.gun.get(index).get(key).get(indexKeys[index][key]).put(node);
          this.gun.get(index).get(key).get(indexKeys[index][key]).put(node);
        }
      }
    }
    if (this.options.ipfs) {
      try {
        const ipfsUri = await msg.saveToIpfs(this.options.ipfs);
        this.gun.get(`messagesByHash`).get(ipfsUri).put(node);
        this.gun.get(`messagesByHash`).get(ipfsUri).put(node);
        this.gun.get(`messagesByHash`).get(ipfsUri).put({ipfsUri});
      } catch (e) {
        console.error(`adding msg ${msg} to ipfs failed: ${e}`);
      }
    }
    start = new Date();
    await this._updateIdentityIndexesByMsg(msg);
    this.debug((new Date()) - start, `ms _updateIdentityIndexesByMsg`);
    return true;
  }

  /**
  * @param {string} value search string
  * @param {string} type (optional) type of searched value
  * @returns {Array} list of matching identities
  */
  async search(value = ``, type, callback, limit, cursor) { // TODO: param 'exact', type param
    const seen = {};
    function searchTermCheck(key) {
      const arr = key.split(`:`);
      if (arr.length < 2) { return false; }
      const keyValue = arr[0];
      const keyType = arr[1];
      if (keyValue.indexOf(encodeURIComponent(value)) !== 0) { return false; }
      if (type && keyType !== type) { return false; }
      return true;
    }
    this.debug(`search()`, value, type, limit, cursor);
    const node = this.gun.get(`identitiesBySearchKey`);
    node.get({'.': {'*': value, '>': cursor}, '%': 2000}).once().map().on((id, key) => {
      this.debug(`search(${value}, ${type}, callback, ${limit}, ${cursor}) returned id ${id} key ${key}`);
      if (Object.keys(seen).length >= limit) {
        // TODO: turn off .map cb
        return;
      }
      if (!searchTermCheck(key)) { return; }
      const soul = Gun.node.soul(id);
      if (soul && !seen.hasOwnProperty(soul)) {
        seen[soul] = true;
        const identity = new Identity(node.get(key));
        identity.cursor = key;
        callback(identity);
      }
    });
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          this.gun.user(key).get(`iris`).get(`identitiesBySearchKey`).get({'.': {'*': value, '%': 2000}}).once().map().once((id, k) => {
            if (Object.keys(seen).length >= limit) {
              // TODO: turn off .map cb
              return;
            }
            if (!searchTermCheck(key)) { return; }
            const soul = Gun.node.soul(id);
            if (soul && !seen.hasOwnProperty(soul)) {
              seen[soul] = true;
              callback(
                new Identity(this.gun.user(key).get(`iris`).get(`identitiesBySearchKey`).get(k))
              );
            }
          });
        }
      });
    }
  }

  /**
  * @returns {Object} message matching the hash
  */
  getMessageByHash(hash) {
    const isIpfsUri = hash.indexOf(`Qm`) === 0;
    return new Promise(async resolve => {
      const resolveIfHashMatches = async d => {
        const obj = typeof d === `object` ? d : JSON.parse(d);
        const m = await Message.fromSig(obj);
        let h;
        let republished = false;
        if (isIpfsUri && this.options.ipfs) {
          h = await m.saveToIpfs(this.options.ipfs);
          republished = true;
        } else {
          h = m.getHash();
        }
        if (h === hash || (isIpfsUri && !this.options.ipfs)) { // does not check hash validity if it's an ipfs uri and we don't have ipfs
          if (!isIpfsUri && this.options.ipfs && this.writable && !republished) {
            m.saveToIpfs(this.options.ipfs).then(ipfsUri => {
              obj.ipfsUri = ipfsUri;
              this.gun.get(`messagesByHash`).get(hash).put(obj);
              this.gun.get(`messagesByHash`).get(ipfsUri).put(obj);
            });
          }
          resolve(m);
        } else {
          console.error(`queried index for message ${hash} but received ${h}`);
        }
      };
      if (isIpfsUri && this.options.ipfs) {
        this.options.ipfs.cat(hash).then(file => {
          const s = this.options.ipfs.types.Buffer.from(file).toString(`utf8`);
          this.debug(`got msg ${hash} from ipfs`);
          resolveIfHashMatches(s);
        });
      }
      this.gun.get(`messagesByHash`).get(hash).on(d => {
        this.debug(`got msg ${hash} from own gun index`);
        resolveIfHashMatches(d);
      });
      if (this.options.indexSync.query.enabled) {
        this.gun.get(`trustedIndexes`).map().once((val, key) => {
          if (val) {
            this.gun.user(key).get(`iris`).get(`messagesByHash`).get(hash).on(d => {
              this.debug(`got msg ${hash} from friend's gun index ${val}`);
              resolveIfHashMatches(d);
            });
          }
        });
      }
    });
  }

  /**
  * @returns {Array} list of messages
  */
  getMessagesByTimestamp(callback, limit, cursor, desc = true, filter) {
    const seen = {};
    const cb = msg => {
      if ((!limit || Object.keys(seen).length < limit) && !seen.hasOwnProperty(msg.hash)) {
        seen[msg.getHash()] = true;
        callback(msg);
      }
    };



    this._getMsgs(this.gun.get(`messagesByTimestamp`), cb, limit, cursor, desc, filter);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`iris`).get(`messagesByTimestamp`);
          this._getMsgs(n, cb, limit, cursor, desc, filter);
        }
      });
    }
  }

  /**
  * @returns {Array} list of messages
  */
  getMessagesByDistance(callback, limit, cursor, desc, filter) {
    const seen = {};
    const cb = msg => {
      if (!seen.hasOwnProperty(msg.hash)) {
        if ((!limit || Object.keys(seen).length <= limit) && !seen.hasOwnProperty(msg.hash)) {
          seen[msg.hash] = true;
          callback(msg);
        }
      }
    };
    this._getMsgs(this.gun.get(`messagesByDistance`), cb, limit, cursor, desc, filter);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`iris`).get(`messagesByDistance`);
          this._getMsgs(n, cb, limit, cursor, desc, filter);
        }
      });
    }
  }

  setReaction(msg: Object, reaction) {
    this.gun.get(`reactions`).get(msg.getHash()).put(reaction);
    this.gun.get(`reactions`).get(msg.getHash()).put(reaction);
    this.gun.get(`messagesByHash`).get(msg.getHash()).get(`reactions`).get(this.viewpoint.value).put(reaction);
    this.gun.get(`messagesByHash`).get(msg.getHash()).get(`reactions`).get(this.viewpoint.value).put(reaction);
  }
}

export default Index;
