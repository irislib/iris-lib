import Message from './message';
import Key from './key';
import Identity from './identity';
import Attribute from './attribute';
import util from './util';
import Gun from 'gun'; // eslint-disable-line no-unused-vars
import then from 'gun/lib/then'; // eslint-disable-line no-unused-vars
import load from 'gun/lib/load'; // eslint-disable-line no-unused-vars
import space from 'gun/lib/space'; // eslint-disable-line no-unused-vars

// TODO: flush onto IPFS
/**
* Identifi index root. Contains four indexes: identitiesBySearchKey, gun.get(`identitiesByTrustDistance`),
* messagesByTimestamp, messagesByDistance.
*/
class Index {
  constructor(gun: Object) {
    this.gun = gun || new Gun();
  }

  static async create(gun: Object, viewpoint: Attribute) {
    const i = new Index(gun);
    if (!viewpoint) {
      const defaultKey = await Key.getDefault();
      viewpoint = {name: `keyID`, val: Key.getId(defaultKey), conf: 1, ref: 0};
    }
    await i.gun.get(`viewpoint`).put(new Attribute(viewpoint));
    const vp = Identity.create(i.gun.get(`identities`), {attrs: [viewpoint], trustDistance: 0});
    await i._addIdentityToIndexes(vp.gun);
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
    const d = await identity.get(`trustDistance`).then();
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
    const r = await new Promise(resolve => {
      this.gun.get(`identitiesByTrustDistance`).space(`00`, res => {
        resolve(res.tree);
      });
    });
    const keys = Object.keys(r);
    if (keys.length) {
      return new Identity(this.gun.get(`identitiesByTrustDistance`).get(r[keys[0]]));
    }
  }

  /**
  * Get an identity referenced by an identifier.
  * @param value identifier value to search by
  * @param type (optional) identifier type to search by. If omitted, tries to guess it
  * @returns {Identity} identity that is connected to the identifier param
  */
  async get(value: String, type: String) {
    if (typeof value === `undefined`) {
      throw `Value is undefined`;
    }
    if (typeof type === `undefined`) {
      type = Attribute.guessTypeOf(value);
    }
    const key = `${encodeURIComponent(value)}:${encodeURIComponent(type)}`;
    const found = await this.gun.get(`identitiesBySearchKey`).get(key).then();
    if (!found) {
      return undefined;
    }
    return new Identity(this.gun.get(`identitiesBySearchKey`).get(key));
  }

  async _getMsgs(msgIndex, limit, cursor) {
    const rawMsgs = await new Promise(resolve => {
      msgIndex.space(``, r => {
        console.log(`_getMsgs`, r);
        resolve(Object.keys(r.tree));
      });
    });
    const msgs = [];
    const keys = Object.keys(rawMsgs);
    for (let i = 0;i < keys.length;i ++) {
      const msg = await Message.fromSig(rawMsgs[keys[i]].value);
      msgs.push(msg);
    }
    return msgs;
  }

  async _addIdentityToIndexes(id) {
    const hash = Gun.node.soul(id) || `todo`;
    const indexKeys = await Index.getIdentityIndexKeys(id, hash.substr(0, 6));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      this.gun.get(`identitiesByTrustDistance`).put({}); // have to do this first, gun/lib/space weirdness
      this.gun.get(`identitiesBySearchKey`).put({});
      this.gun.get(`identitiesByTrustDistance`).space(key, id);
      this.gun.get(`identitiesBySearchKey`).space(key.substr(key.indexOf(`:`) + 1), id);
    }
  }

  /**
  * @returns {Array} list of messages sent by param identity
  */
  async getSentMsgs(identity: Identity, limit, cursor = ``) {
    console.log(`getSentMsgs`);
    return this._getMsgs(identity.gun.get(`sent`), limit, cursor);
  }

  /**
  * @returns {Array} list of messages received by param identity
  */
  async getReceivedMsgs(identity, limit, cursor = ``) {
    console.log(`getReceivedMsgs`);
    return this._getMsgs(identity.gun.get(`received`), limit, cursor);
  }

  async _getAttributeTrustDistance(a) {
    if (!Attribute.isUniqueType(a.name)) {
      return;
    }
    const id = await this.get(a.val, a.name);
    return id && id.gun.get(`trustDistance`).then();
  }

  /**
  * @param {Message} msg
  * @returns {number} trust distance to msg author. Returns undefined if msg signer is not trusted.
  */
  async getMsgTrustDistance(msg) {
    let shortestDistance = Infinity;
    const signer = await this.get(msg.getSignerKeyID(), `keyID`);
    if (!signer) {
      return;
    }
    const vp = await this.gun.get(`viewpoint`).then();
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = new Attribute(msg.signedData.author[i]);
      if (Attribute.equals(a, vp)) {
        return 0;
      } else {
        const d = await this._getAttributeTrustDistance(a);
        if (d < shortestDistance) {
          shortestDistance = d;
        }
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
          if (Attribute.equals(a1, attrs[k])) {
            attrs[k].conf = (attrs[k].conf || 0) + 1;
            hasAttr = true;
          }
        });
        if (!hasAttr) {
          attrs[`${encodeURIComponent(a1[0])}:${encodeURIComponent(a1[1])}`] = {name: a1[0], val: a1[1], conf: 1, ref: 0};
        }
      });
      await recipient.get(`mostVerifiedAttributes`).put(Identity.getMostVerifiedAttributes(attrs));
      await recipient.get(`attrs`).put(attrs);
    }
    if (msg.signedData.type === `rating`) {
      const id = await recipient.then();
      if (msg.isPositive()) {
        if (msg.distance + 1 < id.trustDistance) {
          recipient.get(`trustDistance`).put(msg.distance + 1);
        }
        await recipient.get(`receivedPositive`).put(id.receivedPositive + 1);
      } else if (msg.isNegative()) {
        await recipient.get(`receivedNegative`).put(id.receivedNegative + 1);
      } else {
        await recipient.get(`receivedNeutral`).put(id.receivedNeutral + 1);
      }
    }
    const m = this.gun.get(`messagesByTimestamp`).get(msgIndexKey).put({sig: msg.sig, pubKey: msg.pubKey});
    await recipient.get(`received`).space(msgIndexKey, m);
    const identityIndexKeysAfter = await Index.getIdentityIndexKeys(recipient, hash.substr(0, 6));
    for (let j = 0;j < identityIndexKeysBefore.length;j ++) {
      const k = identityIndexKeysBefore[j];
      if (identityIndexKeysAfter.indexOf(k) === - 1) {
        await this.gun.get(`identitiesByTrustDistance`).space(k, null);
        await this.gun.get(`identitiesBySearchKey`).space(k.substr(k.indexOf(`:`) + 1), null);
      }
    }
  }

  async _updateMsgAuthorIdentity(msg, msgIndexKey, author) {
    if (msg.signedData.type === `rating`) {
      const id = await author.then();
      if (msg.isPositive()) {
        await author.get(`sentPositive`).put(id.sentPositive + 1);
      } else if (msg.isNegative()) {
        await author.get(`sentNegative`).put(id.sentNegative + 1);
      } else {
        await author.get(`sentNeutral`).put(id.sentNeutral + 1);
      }
    }
    const m = this.gun.get(`messagesByTimestamp`).get(msgIndexKey).put({sig: msg.sig, pubKey: msg.pubKey});
    return author.get(`sent`).space(msgIndexKey, m);
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
      await this._addIdentityToIndexes(ids[i].gun);
    }
  }

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = {};
    const authorIdentities = {};
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = msg.signedData.author[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        authorIdentities[id.gun[`_`].link] = id;
      }
    }
    if (!Object.keys(authorIdentities).length) {
      return; // unknown author, do nothing
    }
    for (let i = 0;i < msg.signedData.recipient.length;i ++) {
      const a = msg.signedData.recipient[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        recipientIdentities[id.gun[`_`].link] = id;
      }
    }
    if (!Object.keys(recipientIdentities).length) { // recipient is previously unknown
      const attrs = [];
      msg.signedData.recipient.forEach(a => {
        attrs.push({name: a[0], val: a[1], conf: 1, ref: 0});
      });
      const id = Identity.create(this.gun.get(`identities`), {attrs});
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
  * @returns {boolean} true on success
  */
  async addMessages(msgs) {
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
    do {
      const knownIdentities = await new Promise(resolve => {
        this.gun.get(`identitiesBySearchKey`).space(``, r => {
          console.log(22222,r);
          resolve(Object.values(r.tree));
        });
      });
      let i = 0;
      let author = msgAuthors[i];
      let knownIdentity = knownIdentities.shift();
      initialMsgCount = msgAuthors.length;
      // sort-merge join identitiesBySearchKey and msgsByAuthor
      while (author && knownIdentity) {
        if (author.indexOf(knownIdentity.key) === 0) {
          try {
            await util.timeoutPromise(this.addMessage(msgsByAuthor[author]), 10000);
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
  */
  async addMessage(msg: Message) {
    if (msg.constructor.name !== `Message`) {
      throw new Error(`addMessage failed: param must be a Message, received ${msg.constructor.name}`);
    }
    msg.distance = await this.getMsgTrustDistance(msg);
    if (msg.distance === undefined) {
      return false; // do not save messages from untrusted author
    }
    let indexKey = Index.getMsgIndexKey(msg);
    await this.gun.get(`messagesByDistance`).get(indexKey).put({sig: msg.sig, pubKey: msg.pubKey}).then();
    indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
    await this.gun.get(`messagesByTimestamp`).get(indexKey).put({sig: msg.sig, pubKey: msg.pubKey}).then();
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
        if (!r.hasOwnProperty(Gun.node.soul(id))) {
          r[Gun.node.soul(id)] = new Identity(this.gun.get(`identitiesByTrustDistance`).get(key));
        }
      });
      setTimeout(() => { resolve(Object.values(r)); }, 200);
    });
  }
}

export default Index;
