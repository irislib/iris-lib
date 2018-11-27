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
async function searchText(node, query, limit, cursor) {
  return new Promise(resolve => {
    const r = [];
    function sortAndResolve() {
      r.sort((a, b) => {
        if (a.key < b.key) {
          return - 1;
        }
        if (a.key > b.key) {
          return 1;
        }
        return 0;
      });
      resolve(r);
    }
    node.map((value, key) => {
      if ((!cursor || (key > cursor)) && key.indexOf(query) === 0) {
        if (value) {
          r.push({value, key});
        }
        if (r.length >= limit) {
          sortAndResolve();
        }
      }
    });
    setTimeout(() => { /* console.log(`r`, r);*/ sortAndResolve(); }, 100);
  });
}

// TODO: flush onto IPFS
/**
* Identifi index root. Contains four indexes: identitiesBySearchKey, identitiesByTrustDistance,
* messagesByTimestamp, messagesByDistance.
*/
class Index {
  /**
  * When you use someone else's index, initialise it with this constructor
  */
  constructor(gun: Object) {
    this.gun = gun || new Gun();
  }

  /**
  * Use this to load an index that you can write to
  * @returns {Index}
  */
  static create(gun: Object, viewpoint) {
    const i = new Index(gun);
    const setViewpoint = vp => {
      i.viewpoint = new Attribute(vp);
      i.gun.get(`viewpoint`).put(i.viewpoint);
      const uri = i.viewpoint.uri();
      const g = i.gun.get(`identitiesBySearchKey`).get(uri);
      const vpId = new Identity(g,
        {
          trustDistance: 0,
          linkTo: i.viewpoint
        }, true);
      i._addIdentityToIndexes(vpId.gun);
    };
    if (viewpoint) {
      setViewpoint(viewpoint);
    } else {
      Key.getDefault().then(defaultKey => {
        setViewpoint({name: `keyID`, val: Key.getId(defaultKey)});
      });
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

  static async getIdentityIndexKeys(identity, hash) {
    const indexKeys = [];
    const d = await util.timeoutPromise(identity.get(`trustDistance`).then(), GUN_TIMEOUT);
    await identity.get(`attrs`).map().once(a => {
      if (!a) { // TODO: this sometimes returns undefined
        return;
      }
      let distance = d !== undefined ? d : parseInt(a.dist);
      distance = Number.isNaN(distance) ? 99 : distance;
      distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
      const v = a.val || a[1];
      const n = a.name || a[0];
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
    }).then();
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
  * @param value identifier value to search by
  * @param type (optional) identifier type to search by. If omitted, tries to guess it
  * @returns {Identity} identity that is connected to the identifier param
  */
  get(value: String, type: String) {
    if (typeof value === `undefined`) {
      throw `Value is undefined`;
    }
    if (typeof type === `undefined`) {
      type = Attribute.guessTypeOf(value);
    }
    const a = new Attribute([type, value]);
    return new Identity(this.gun.get(`identitiesBySearchKey`).get(a.uri()), {linkTo: a});
  }

  async _getMsgs(msgIndex, limit, cursor) {
    const rawMsgs = await searchText(msgIndex, ``, limit, cursor, true);
    const msgs = [];
    for (let i = 0;i < rawMsgs.length;i ++) {
      const msg = await Message.fromSig(rawMsgs[i].value);
      if (rawMsgs[i].value && rawMsgs[i].value.ipfsUri) {
        msg.ipfsUri = rawMsgs[i].value.ipfsUri;
      }
      msgs.push(msg);
    }
    return msgs;
  }

  async _addIdentityToIndexes(id) {
    const hash = Gun.node.soul(id) || `todo`;
    const indexKeys = await Index.getIdentityIndexKeys(id, hash.substr(0, 6));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`adding key ${key}`);
      this.gun.get(`identitiesByTrustDistance`).get(key).put(id);
      this.gun.get(`identitiesBySearchKey`).get(key.substr(key.indexOf(`:`) + 1)).put(id);
    }
  }

  /**
  * @returns {Array} list of messages sent by param identity
  */
  async getSentMsgs(identity: Identity, limit, cursor = ``) {
    return this._getMsgs(identity.gun.get(`sent`), limit, cursor);
  }

  /**
  * @returns {Array} list of messages received by param identity
  */
  async getReceivedMsgs(identity, limit, cursor = ``) {
    return this._getMsgs(identity.gun.get(`received`), limit, cursor);
  }

  async _getAttributeTrustDistance(a) {
    if (!Attribute.isUniqueType(a.name)) {
      return;
    }
    if (this.viewpoint.equals(a)) {
      return 0;
    }
    const id = this.get(a.val, a.name);
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
    const signerAttr = new Attribute([`keyID`, msg.getSignerKeyID()]);
    if (!signerAttr.equals(this.viewpoint)) {
      const signer = this.get(signerAttr.val, signerAttr.name);
      const d = await signer.gun.get(`trustDistance`).then();
      if (isNaN(d)) {
        return;
      }
    }
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const d = await this._getAttributeTrustDistance(new Attribute(msg.signedData.author[i]));
      if (d < shortestDistance) {
        shortestDistance = d;
      }
    }
    return shortestDistance < Infinity ? shortestDistance : undefined;
  }

  async _updateMsgRecipientIdentity(msg, msgIndexKey, recipient) {
    const hash = `todo`;
    const identityIndexKeysBefore = await Index.getIdentityIndexKeys(recipient, hash.substr(0, 6));
    const attrs = await new Promise(resolve => { recipient.get(`attrs`).load(r => resolve(r)); });
    if (msg.signedData.type === `verification`) {
      msg.signedData.recipient.forEach(a1 => {
        let hasAttr = false;
        Object.keys(attrs).forEach(k => {
          // TODO: if author is self, mark as self verified
          if (Attribute.equals(a1, attrs[k])) {
            attrs[k].conf = (attrs[k].conf || 0) + 1;
            hasAttr = true;
          }
        });
        if (!hasAttr) {
          attrs[`${encodeURIComponent(a1[1])}:${encodeURIComponent(a1[0])}`] = {name: a1[0], val: a1[1], conf: 1, ref: 0};
        }
        if (msg.goodVerification) {
          attrs[`${encodeURIComponent(a1[1])}:${encodeURIComponent(a1[0])}`].verified = true;
        }
      });
      recipient.get(`mostVerifiedAttributes`).put(Identity.getMostVerifiedAttributes(attrs));
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
    const identityIndexKeysAfter = await Index.getIdentityIndexKeys(recipient, hash.substr(0, 6));
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
    return author.get(`sent`).get(msgIndexKey).put(obj).then();
  }

  async _updateIdentityProfilesByMsg(msg, authorIdentities, recipientIdentities) {
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    const ids = Object.values(Object.assign({}, authorIdentities, recipientIdentities));
    for (let i = 0;i < ids.length;i ++) { // add new identifiers to identity
      if (recipientIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        await this._updateMsgRecipientIdentity(msg, msgIndexKey, ids[i].gun);
      }
      if (authorIdentities.hasOwnProperty(ids[i].gun[`_`].link)) {
        await this._updateMsgAuthorIdentity(msg, msgIndexKey, ids[i].gun);
      }
      await this._addIdentityToIndexes(ids[i].gun); // TODO: broblem. ids[i].gun may have become null
    }
  }

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = {};
    const authorIdentities = {};
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = msg.signedData.author[i];
      const id = this.get(a[1], a[0]);
      const td = await util.timeoutPromise(id.gun.get(`trustDistance`).then(), GUN_TIMEOUT);
      if (!isNaN(td)) {
        authorIdentities[id.gun[`_`].link] = id;
        const scores = await id.gun.get(`scores`).then();
        if (scores && scores.verifier && msg.signedData.type === `verification`) {
          msg.goodVerification = true;
        }
      }
    }
    if (!Object.keys(authorIdentities).length) {
      return; // unknown author, do nothing
    }
    for (let i = 0;i < msg.signedData.recipient.length;i ++) {
      const a = msg.signedData.recipient[i];
      const id = this.get(a[1], a[0]);
      const td = await util.timeoutPromise(id.gun.get(`trustDistance`).then(), GUN_TIMEOUT);

      if (!isNaN(td)) {
        recipientIdentities[id.gun[`_`].link] = id;
      }
    }
    if (!Object.keys(recipientIdentities).length) { // recipient is previously unknown
      const attrs = {};
      msg.signedData.recipient.forEach(a => {
        const attr = new Attribute([a[0], a[1]]);
        attrs[attr.uri()] = attr;
      });
      const linkTo = Identity.getLinkTo(attrs);
      const id = new Identity(this.gun.get(`identities`).set({}), {attrs, linkTo, trustDistance: 99}, true);

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
  async addMessages(msgs, ipfs) {
    const msgsByAuthor = {};
    if (Array.isArray(msgs)) {
      console.log(`sorting ${msgs.length} messages onto a search tree...`);
      for (let i = 0;i < msgs.length;i ++) {
        for (let j = 0;j < msgs[i].signedData.author.length;j ++) {
          const id = msgs[i].signedData.author[j];
          if (Attribute.isUniqueType(id[0])) {
            const key = `${encodeURIComponent(id[1])}:${encodeURIComponent(id[0])}:${msgs[i].getHash()}`;
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
      const knownIdentities = await searchText(index, ``);
      let i = 0;
      let author = msgAuthors[i];
      let knownIdentity = knownIdentities.shift();
      initialMsgCount = msgAuthors.length;
      // sort-merge join identitiesBySearchKey and msgsByAuthor
      while (author && knownIdentity) {
        if (author.indexOf(knownIdentity.key) === 0) {
          try {
            await util.timeoutPromise(this.addMessage(msgsByAuthor[author], ipfs), 10000);
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
  async addMessage(msg: Message, ipfs) {
    if (msg.constructor.name !== `Message`) {
      throw new Error(`addMessage failed: param must be a Message, received ${msg.constructor.name}`);
    }
    msg.distance = await this.getMsgTrustDistance(msg);
    if (msg.distance === undefined) {
      return false; // do not save messages from untrusted author
    }
    let indexKey = Index.getMsgIndexKey(msg);
    const obj = {sig: msg.sig, pubKey: msg.pubKey};
    if (ipfs) {
      const ipfsUri = await msg.saveToIpfs(ipfs);
      obj.ipfsUri = ipfsUri;
    }
    this.gun.get(`messagesByDistance`).get(indexKey).put(obj);
    indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
    this.gun.get(`messagesByTimestamp`).get(indexKey).put(obj);
    await this._updateIdentityIndexesByMsg(msg);
    return true;
  }

  /**
  * @param {string} value search string
  * @param {string} type (optional) type of searched value
  * @returns {Array} list of matching identities
  */
  async search(value) { // TODO: param 'exact', type param
    const r = {};
    return new Promise(resolve => {
      this.gun.get(`identitiesByTrustDistance`).map((id, key) => {
        if (key.indexOf(encodeURIComponent(value)) === - 1) {
          return;
        }
        const soul = Gun.node.soul(id);
        if (soul && !r.hasOwnProperty(soul)) {
          r[soul] = new Identity(this.gun.get(`identitiesByTrustDistance`).get(key));
        }
      });
      setTimeout(() => { resolve(Object.values(r)); }, 200);
    });
  }

  /**
  * @returns {Array} list of messages
  */
  async getMessagesByTimestamp(limit, cursor = ``) {
    return this._getMsgs(this.gun.get(`messagesByTimestamp`), limit, cursor);
  }

  /**
  * @returns {Array} list of messages
  */
  async getMessagesByDistance(limit, cursor = ``) {
    return this._getMsgs(this.gun.get(`messagesByDistance`), limit, cursor);
  }
}

export default Index;
