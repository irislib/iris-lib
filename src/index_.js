import Message from './message';
import Key from './key';
import Identity from './identity';
import Attribute from './attribute';
import util from './util';
import Gun from 'gun'; // eslint-disable-line no-unused-vars
import then from 'gun/lib/then'; // eslint-disable-line no-unused-vars
import load from 'gun/lib/load'; // eslint-disable-line no-unused-vars

const GUN_TIMEOUT = 100;

// temp method for GUN search
async function searchText(node, callback, query, limit, cursor) {
  const seen = {};
  node.map((value, key) => {
    if ((!cursor || (key > cursor)) && key.indexOf(query) === 0) {
      if (Object.keys(seen).length >= limit) {
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
* Identifi index root. Contains five indexes: identitiesBySearchKey, identitiesByTrustDistance,
* messagesByHash, messagesByTimestamp, messagesByDistance. If you want messages saved to IPFS, pass
* options.ipfs = instance.
*
* When you use someone else's index, initialise it using the Index constructor
* @param {Object} gun gun node that contains an Identifi index (e.g. user.get('identifi'))
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
*    }
*  }
*}
* @returns {Index} Identifi index object
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
        }
      }
    }, options);
    if (this.options.indexSync.subscribe.enabled) {
      setTimeout(() => {
        this.gun.get(`trustedIndexes`).map().once((val, uri) => {
          if (val) {
            // TODO: only get new messages?
            this.gun.user(uri).get(`identifi`).get(`messagesByDistance`).map((val, key) => {
              const d = Number.parseInt(key.split(`:`)[0]);
              console.log(`got msg with d`, d, key);
              if (!isNaN(d) && d <= this.options.indexSync.subscribe.maxMsgDistance) {
                Message.fromSig(val).then(msg => {
                  console.log(`adding msg ${msg.hash} from trusted index`);
                  if (this.options.indexSync.msgTypes.all ||
                    this.options.indexSync.msgTypes.hasOwnProperty(msg.signedData.type)) {
                    this.addMessage(msg, {checkIfExists: true});
                  }
                });
              }
            });
          }
        });
      }, 5000); // TODO: this should be made to work without timeout
    }
  }

  /**
  * Use this to load an index that you can write to
  * @param {Object} gun gun instance where the index is stored (e.g. new Gun())
  * @param {Object} keypair SEA keypair (can be generated with await identifiLib.Key.generate())
  * @param {Object} options see default options in Index constructor's example
  * @returns {Promise}
  */
  static async create(gun: Object, keypair, options = {}) {
    if (!keypair) {
      keypair = await Key.getDefault();
    }
    const user = gun.user();
    user.auth(keypair);
    const i = new Index(user.get(`identifi`), options);
    i.viewpoint = new Attribute(`keyID`, Key.getId(keypair));
    await i.gun.get(`viewpoint`).put(i.viewpoint);
    const uri = i.viewpoint.uri();
    const g = i.gun.get(`identitiesBySearchKey`).get(uri);
    const id = await Identity.create(g, {trustDistance: 0, linkTo: i.viewpoint});
    await i._addIdentityToIndexes(id.gun);
    if (options.self) {
      const recipient = Object.assign(options.self, {keyID: i.viewpoint.value});
      const msg = await Message.createVerification({recipient}, keypair);
      i.addMessage(msg);
    }

    return i;
  }

  static getMsgIndexKey(msg) {
    let distance = parseInt(msg.distance);
    distance = Number.isNaN(distance) ? 99 : distance;
    distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
    const key = `${distance}:${Math.floor(Date.parse(msg.timestamp || msg.signedData.timestamp) / 1000)}:${(msg.ipfs_hash || msg.hash).substr(0, 9)}`;
    return key;
  }

  async getIdentityIndexKeys(identity, hash) {
    const indexKeys = [];
    let d;
    if (identity.linkTo && this.viewpoint.equals(identity.linkTo)) {
      d = 0;
    } else {
      d = await util.timeoutPromise(identity.get(`trustDistance`).then(), GUN_TIMEOUT);
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
      let key = `${distance}:${value}:${name}`;
      let lowerCaseKey = `${distance}:${lowerCaseValue}:${name}`;
      if (!Attribute.isUniqueType(n)) { // allow for multiple index keys with same non-unique attribute
        key = `${key}:${hash.substr(0, 9)}`;
        lowerCaseKey = `${lowerCaseKey}:${hash.substr(0, 9)}`;
      }
      indexKeys.push(key);
      if (key !== lowerCaseKey) {
        indexKeys.push(lowerCaseKey);
      }
      if (v.indexOf(` `) > - 1) {
        const words = v.toLowerCase().split(` `);
        for (let l = 0;l < words.length;l += 1) {
          let k = `${distance}:${encodeURIComponent(words[l])}:${name}`;
          if (!Attribute.isUniqueType(n)) {
            k = `${k}:${hash.substr(0, 9)}`;
          }
          indexKeys.push(k);
        }
      }
      if (key.match(/^http(s)?:\/\/.+\/[a-zA-Z0-9_]+$/)) {
        const split = key.split(`/`);
        indexKeys.push(split[split.length - 1]);
      }
    }

    if (this.viewpoint.equals(identity.linkTo)) {
      addIndexKey(identity.linkTo);
    }

    await identity.get(`attrs`).map().once(addIndexKey).then();
    return indexKeys;
  }

  /**
  * @returns {Identity} viewpoint identity of the index
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
  get(a: String, b: String) {
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
    return new Identity(this.gun.get(`identitiesBySearchKey`).get(attr.uri()), attr);
  }

  async _getMsgs(msgIndex, callback, limit, cursor) {
    async function resultFound(result) {
      const msg = await Message.fromSig(result.value);
      if (result.value && result.value.ipfsUri) {
        msg.ipfsUri = result.value.ipfsUri;
      }
      callback(msg);
    }
    searchText(msgIndex, resultFound, ``, limit, cursor);
  }

  async _addIdentityToIndexes(id) {
    const hash = Gun.node.soul(id) || `todo`;
    const indexKeys = await this.getIdentityIndexKeys(id, hash.substr(0, 6));

    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`adding key ${key}`);
      await this.gun.get(`identitiesByTrustDistance`).get(key).put(id);
      await this.gun.get(`identitiesBySearchKey`).get(key.substr(key.indexOf(`:`) + 1)).put(id);
    }
  }

  /**
  * Get Messages sent by identity
  * @param {Identity} identity identity whose sent Messages to get
  * @param {Function} callback callback function that receives the Messages one by one
  */
  async getSentMsgs(identity: Identity, callback, limit, cursor = ``) {
    return this._getMsgs(identity.gun.get(`sent`), callback, limit, cursor);
  }

  /**
  * Get Messages received by identity
  * @param {Identity} identity identity whose received Messages to get
  * @param {Function} callback callback function that receives the Messages one by one
  */
  async getReceivedMsgs(identity, callback, limit, cursor = ``) {
    return this._getMsgs(identity.gun.get(`received`), callback, limit, cursor);
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
    for (const a of msg.getAuthorIterable()) {
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
    if (msg.signedData.type === `verification`) {
      for (const a of msg.getRecipientIterable()) {
        let hasAttr = false;
        Object.keys(attrs).forEach(k => {
          // TODO: if author is self, mark as self verified
          if (a.equals(attrs[k])) {
            attrs[k].conf = (attrs[k].conf || 0) + 1;
            hasAttr = true;
          }
        });
        if (!hasAttr) {
          attrs[a.uri()] = {type: a.type, value: a.value, conf: 1, ref: 0};
        }
        if (msg.goodVerification) {
          attrs[a.uri()].verified = true;
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
        if (msg.distance + 1 < id.trustDistance) {
          recipient.get(`trustDistance`).put(msg.distance + 1);
        }
        id.receivedPositive ++;
      } else if (msg.isNegative()) {
        id.receivedNegative ++;
      } else {
        id.receivedNeutral ++;
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
    for (let j = 0;j < identityIndexKeysBefore.length;j ++) {
      const k = identityIndexKeysBefore[j];
      if (identityIndexKeysAfter.indexOf(k) === - 1) {
        this.gun.get(`identitiesByTrustDistance`).get(k).put(null);
        this.gun.get(`identitiesBySearchKey`).get(k.substr(k.indexOf(`:`) + 1)).put(null);
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
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    const ids = Object.values(Object.assign({}, authorIdentities, recipientIdentities));
    for (let i = 0;i < ids.length;i ++) { // add new identifiers to identity
      const data = await ids[i].gun.then(); // TODO: data is sometimes undefined and new identity is not added!
      const relocated = data ? this.gun.get(`identities`).set(data) : ids[i].gun; // this may screw up real time updates? and create unnecessary `identities` entries
      if (recipientIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        await this._updateMsgRecipientIdentity(msg, msgIndexKey, ids[i].gun);
      }
      if (authorIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        await this._updateMsgAuthorIdentity(msg, msgIndexKey, ids[i].gun);
      }
      await this._addIdentityToIndexes(relocated);
    }
  }

  async addTrustedIndex(gunUri,
    maxMsgsToCrawl = this.options.indexSync.importOnAdd.maxMsgCount,
    maxMsgDistance = this.options.indexSync.importOnAdd.maxMsgDistance) {
    if (gunUri === this.viewpoint.value) {
      return;
    }
    console.log(`addTrustedIndex`, gunUri);
    const exists = await this.gun.get(`trustedIndexes`).get(gunUri).then();
    if (exists) {
      return;
    }
    this.gun.get(`trustedIndexes`).get(gunUri).put(true);
    const msgs = [];
    if (this.options.indexSync.importOnAdd.enabled) {
      await util.timeoutPromise(new Promise(resolve => {
        this.gun.user(gunUri).get(`identifi`).get(`messagesByDistance`).map((val, key) => {
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
      console.log(`adding`, msgs.length, `msgs`);
      this.addMessages(msgs);
    }
  }

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = {};
    const authorIdentities = {};
    let selfAuthored = false;
    for (const a of msg.getAuthorIterable()) {
      const id = this.get(a);
      const td = await util.timeoutPromise(id.gun.get(`trustDistance`).then(), GUN_TIMEOUT);
      if (!isNaN(td)) {
        authorIdentities[id.gun[`_`].link] = id;
        const scores = await id.gun.get(`scores`).then();
        if (scores && scores.verifier && msg.signedData.type === `verification`) {
          msg.goodVerification = true;
        }
        if (td === 0) {
          selfAuthored = true;
        }
      }
    }
    if (!Object.keys(authorIdentities).length) {
      return; // unknown author, do nothing
    }
    for (const a of msg.getRecipientIterable()) {
      const id = this.get(a);
      const td = await util.timeoutPromise(id.gun.get(`trustDistance`).then(), GUN_TIMEOUT);

      if (!isNaN(td)) {
        recipientIdentities[id.gun[`_`].link] = id;
      }
      if (selfAuthored && a.type === `keyID` && a.value !== this.viewpoint.value && msg.isPositive()) { // TODO: not if already added - causes infinite loop?
        this.addTrustedIndex(a.value);
      }
    }
    if (!Object.keys(recipientIdentities).length) { // recipient is previously unknown
      const attrs = {};
      for (const a of msg.getRecipientIterable()) {
        attrs[a.uri()] = a;
      }
      const linkTo = Identity.getLinkTo(attrs);
      const random = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); // TODO: bubblegum fix
      const id = await Identity.create(this.gun.get(`identities`).get(random).put({}), {attrs, linkTo, trustDistance: 99}, true);
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
      console.log(`sorting ${msgs.length} messages onto a search tree...`);
      for (let i = 0;i < msgs.length;i ++) {
        for (const a of msgs[i].getAuthorIterable()) {
          if (a.isUniqueType()) {
            const key = `${a.uri()}:${msgs[i].getHash()}`;
            msgsByAuthor[key] = msgs[i];
          }
        }
      }
      console.log(`...done`);
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
      await new Promise(resolve => setTimeout(resolve, 200)); // wait for results to accumulate
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
            console.log(`adding failed:`, e, JSON.stringify(msgsByAuthor[author], null, 2));
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
  * @param msg Message to add to the index
  * @param ipfs (optional) ipfs instance where the message is additionally saved
  */
  async addMessage(msg: Message, options = {}) {
    if (msg.constructor.name !== `Message`) {
      throw new Error(`addMessage failed: param must be a Message, received ${msg.constructor.name}`);
    }
    const hash = msg.getHash();
    if (true === options.checkIfExists) {
      const exists = await this.gun.get(`messagesByHash`).get(hash).once().then();
      if (exists) {
        return;
      }
    }
    msg.distance = await this.getMsgTrustDistance(msg);
    if (msg.distance === undefined) {
      return false; // do not save messages from untrusted author
    }
    let indexKey = Index.getMsgIndexKey(msg);
    const obj = {sig: msg.sig, pubKey: msg.pubKey};
    if (this.options.ipfs) {
      try {
        const ipfsUri = await msg.saveToIpfs(this.options.ipfs);
        obj.ipfsUri = ipfsUri;
        this.gun.get(`messagesByHash`).get(ipfsUri).put(obj);
        this.gun.get(`messagesByHash`).get(ipfsUri).put(obj);
      } catch (e) {
        console.error(`adding msg ${msg} to ipfs failed: ${e}`);
      }
    }
    this.gun.get(`messagesByHash`).get(hash).put(obj);
    this.gun.get(`messagesByHash`).get(hash).put(obj);
    this.gun.get(`messagesByDistance`).get(indexKey).put(obj);
    this.gun.get(`messagesByDistance`).get(indexKey).put(obj); // umm, what? doesn't work unless I write it twice
    indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
    this.gun.get(`messagesByTimestamp`).get(indexKey).put(obj);
    this.gun.get(`messagesByTimestamp`).get(indexKey).put(obj);
    await this._updateIdentityIndexesByMsg(msg);
    return true;
  }

  /**
  * @param {string} value search string
  * @param {string} type (optional) type of searched value
  * @returns {Array} list of matching identities
  */
  async search(value, type, callback, limit) { // TODO: param 'exact', type param
    const seen = {};
    this.gun.get(`identitiesByTrustDistance`).map().once((id, key) => {
      if (Object.keys(seen).length >= limit) {
        // TODO: turn off .map cb
        return;
      }
      if (key.indexOf(encodeURIComponent(value)) === - 1) {
        return;
      }
      const soul = Gun.node.soul(id);
      if (soul && !seen.hasOwnProperty(soul)) {
        seen[soul] = true;
        callback(new Identity(this.gun.get(`identitiesByTrustDistance`).get(key)));
      }
    });
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          this.gun.user(key).get(`identifi`).get(`identitiesByTrustDistance`).map().once((id, k) => {
            if (Object.keys(seen).length >= limit) {
              // TODO: turn off .map cb
              return;
            }
            if (key.indexOf(encodeURIComponent(value)) === - 1) {
              return;
            }
            const soul = Gun.node.soul(id);
            if (soul && !seen.hasOwnProperty(soul)) {
              seen[soul] = true;
              callback(
                new Identity(this.gun.user(key).get(`identifi`).get(`identitiesByTrustDistance`).get(k))
              );
            }
          });
        }
      });
    }
  }

  /**
  * @returns {Array} list of messages
  */
  getMessagesByTimestamp(callback, limit, cursor = ``) {
    const seen = {};
    const cb = msg => {
      console.log(`hash`, msg.hash);
      if ((!limit || Object.keys(seen).length <= limit) && !seen.hasOwnProperty(msg.hash)) {
        seen[msg.hash] = true;
        callback(msg);
      }
    };
    this._getMsgs(this.gun.get(`messagesByTimestamp`), cb, limit, cursor);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`identifi`).get(`messagesByTimestamp`);
          this._getMsgs(n, cb, limit, cursor);
        }
      });
    }
  }

  /**
  * @returns {Array} list of messages
  */
  getMessagesByDistance(callback, limit, cursor = ``) {
    const seen = {};
    const cb = msg => {
      if (!seen.hasOwnProperty(msg.hash)) {
        if ((!limit || Object.keys(seen).length <= limit) && !seen.hasOwnProperty(msg.hash)) {
          seen[msg.hash] = true;
          callback(msg);
        }
      }
    };
    this._getMsgs(this.gun.get(`messagesByDistance`), cb, limit, cursor);
    if (this.options.indexSync.query.enabled) {
      this.gun.get(`trustedIndexes`).map().once((val, key) => {
        if (val) {
          const n = this.gun.user(key).get(`identifi`).get(`messagesByDistance`);
          this._getMsgs(n, cb, limit, cursor);
        }
      });
    }
  }
}

export default Index;
