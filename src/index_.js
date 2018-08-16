import btree from 'merkle-btree';
import Message from './message';
import Key from './key';
import Identity from './identity';
import Attribute from './attribute';
import Gun from 'gun'; // eslint-disable-line no-unused-vars
import then from 'gun/lib/then'; // eslint-disable-line no-unused-vars
import load from 'gun/lib/load'; // eslint-disable-line no-unused-vars

// temp method for GUN search
function searchText(node, query) {
  return new Promise(resolve => {
    node.once().map(
      (value, key) => { key.indexOf(query) ? undefined : value; }
    ).once(results => resolve(results));
  });
}

// TODO: make the whole thing use GUN for indexing and flush onto IPFS
/**
* Identifi index root. Contains four indexes: identitiesBySearchKey, gun.get(`identitiesByTrustDistance`),
* messagesByTimestamp, messagesByDistance.
*/
class Index {
  constructor(gun: Object, viewpoint: Attribute) {
    if (gun) {
      this.gun = gun;
      if (viewpoint) {
        this.viewpoint = new Attribute(viewpoint);
      } else {
        this.viewpoint = {name: `keyID`, val: Key.getDefault().keyID, conf: 1, ref: 0};
      }
      const vp = Identity.create(this.gun.get(`identities`), {attrs: [this.viewpoint], trustDistance: 0});
      this.ready = new Promise(async (resolve, reject) => {
        try {
          await this._addIdentityToIndexes(vp);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }
  }

  static async create(gun: Object, viewpoint: Attribute) {
    const i = new Index(gun, viewpoint);
    await i.ready;
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
    const d = await identity.gun.get(`trustDistance`).load().then();
    const f = await identity.gun.get(`attrs`).once().then();
    await identity.gun.get(`attrs`).map().once(a => {
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
    const r = await this.gun.get(`identitiesByTrustDistance`).searchText(`00`, 1);
    if (r.length) {
      return r[0].value;
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
    const found = await this.gun.get(`identitiesBySearchKey`).get(key).once().then();
    if (!found) {
      return undefined;
    }
    return new Identity(this.gun.get(`identitiesBySearchKey`).get(key));
  }

  async _getMsgs(msgIndex, limit, cursor) {
    const rawMsgs = await searchText(msgIndex, ``, limit, cursor, true);
    const msgs = [];
    rawMsgs.forEach(row => {
      const msg = Message.fromJws(row.value.jws);
      msg.cursor = row.key;
      msg.authorPos = row.value.author_pos;
      msg.authorNeg = row.value.author_neg;
      msg.recipientPos = row.value.recipient_pos;
      msg.recipientNeg = row.value.recipient_neg;
      msg.authorTrustDistance = row.value.distance;
      msg.authorName = row.value.author_name;
      msg.recipientName = row.value.recipient_name;
      msgs.push(msg);
    });
    return msgs;
  }

  async _removeIdentityFromIndexes(id: Identity) {
    const hash = `TODO`;
    const indexKeys = await Index.getIdentityIndexKeys(id, hash.substr(2));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`deleting key ${key}`);
      this.gun.get(`identitiesByTrustDistance`).get(key).put(null);
      this.gun.get(`identitiesBySearchKey`).get(key.substr(key.indexOf(`:`) + 1)).put(null);
    }
  }

  async _addIdentityToIndexes(id: Identity) {
    const hash = `todo`;
    const prs = await id.gun.load().then();
    const idNode = this.gun.get(`identities`).set(id.gun);
    const indexKeys = await Index.getIdentityIndexKeys(id, hash.substr(2));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`adding key ${key}`);
      await new Promise(resolve => {
        this.gun.get(`identitiesByTrustDistance`).get(key).put(idNode, () => {resolve();});
      });
      await new Promise(resolve => {
        this.gun.get(`identitiesBySearchKey`).get(key.substr(key.indexOf(`:`) + 1)).put(idNode, () => {resolve();});
      });
    }
  }

  /**
  * @returns {Array} list of messages sent by param identity
  */
  async getSentMsgs(identity: Identity, limit, cursor = ``) {
    return this._getMsgs(identity.get(`sent`), limit, cursor);
  }

  /**
  * @returns {Array} list of messages received by param identity
  */
  async getReceivedMsgs(identity, limit, cursor = ``) {
    return this._getMsgs(identity.get(`received`), limit, cursor);
  }

  async _getAttributeTrustDistance(a) {
    if (!Attribute.isUniqueType(a.name)) {
      return;
    }
    const id = await this.get(a.val, a.name);
    return id && id.gun.get(`trustDistance`).once().then();
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
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = new Attribute(msg.signedData.author[i]);
      if (Attribute.equals(a, this.viewpoint)) {
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

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = {};
    const authorIdentities = {};
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = msg.signedData.author[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        authorIdentities[id.ipfsHash] = id;
      }
    }
    if (!Object.keys(authorIdentities).length) {
      return; // unknown author, do nothing
    }
    for (let i = 0;i < msg.signedData.recipient.length;i ++) {
      const a = msg.signedData.recipient[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        recipientIdentities[id.ipfsHash] = id;
      }
    }
    if (!Object.keys(recipientIdentities).length) { // recipient is previously unknown
      const attrs = [];
      msg.signedData.recipient.forEach(a => {
        attrs.push({name: a[0], val: a[1], conf: 1, ref: 0});
      });
      const id = Identity.create(this.gun.get(`identities`), {attrs});
      // TODO: take msg author trust into account
      recipientIdentities[id.gun[`#`]] = id;
    }
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    const ids = Object.values(Object.assign({}, authorIdentities, recipientIdentities));
    console.log('ids', ids);
    for (let i = 0;i < ids.length;i ++) { // add new identifiers to identity
      const id = ids[i];
      await this._removeIdentityFromIndexes(id);
      if (recipientIdentities.hasOwnProperty(id.ipfsHash)) {
        msg.signedData.recipient.forEach(a1 => {
          let hasAttr = false;
          for (let j = 0;j < id.data.attrs.length;j ++) {
            if (Attribute.equals(a1, id.data.attrs[j])) {
              id.data.attrs[j].conf |= 0;
              id.data.attrs[j].conf += 1;
              hasAttr = true;
              break;
            }
          }
          if (!hasAttr) {
            id.data.attrs[`${encodeURIComponent(a1[0])}:${encodeURIComponent(a1[1])}`] = {name: a1[0], val: a1[1], conf: 1, ref: 0};
          }
        });
        if (msg.signedData.type === `rating`) {
          if (msg.isPositive()) {
            if (msg.distance + 1 < id.data.trustDistance) {
              id.data.trustDistance = msg.distance + 1;
            }
            id.data.receivedPositive ++;
          } else if (msg.isNegative()) {
            id.data.receivedNegative ++;
          } else {
            id.data.receivedNeutral ++;
          }
        }
        await this.gun.get(`id key`).get(`received`).get(msgIndexKey).put(msg.jws); // TODO
      }
      if (authorIdentities.hasOwnProperty(id.ipfsHash)) {
        if (msg.signedData.type === `rating`) {
          if (msg.isPositive()) {
            id.data.sentPositive ++;
          } else if (msg.isNegative()) {
            id.data.sentNegative ++;
          } else {
            id.data.sentNeutral ++;
          }
        }
        await this.gun.get(`id key`).get(`sent`).get(msgIndexKey).put(msg.jws);
      }
      await this._addIdentityToIndexes(id);
    }
  }

  /**
  * Add a list of messages to the index.
  * Useful for example when adding a new WoT dataset that contains previously
  * unknown authors.
  *
  * Iteratively performs sorted merge joins on [previously known identities] and
  * [new msgs authors], until all messages from within the WoT have been added.
  *
  * @param {MerkleBTree | Array} msgs can be either a merkle-btree or an array of messages.
  * @returns {boolean} true on success
  */
  async addMessages(msgs) {
    let msgsByAuthor;
    if (Array.isArray(msgs)) {
      console.log(`sorting ${msgs.length} messages onto a search tree...`);
      msgsByAuthor = new btree.MerkleBTree(new btree.RAMStorage(), 1000);
      for (let i = 0;i < msgs.length;i ++) {
        for (let j = 0;j < msgs[i].signedData.author.length;j ++) {
          const id = msgs[i].signedData.author[j];
          if (Attribute.isUniqueType(id[0])) {
            const key = `${encodeURIComponent(id[1])}:${encodeURIComponent(id[0])}:${msgs[i].getHash()}`;
            await msgsByAuthor.put(key, msgs[i]);
          }
        }
      }
      console.log(`...done`);
    } else if (msgs instanceof btree.MerkleBTree) {
      msgsByAuthor = msgs;
    } else {
      throw `msgs param must be an array or MerkleBTree`;
    }
    let initialMsgCount, msgCountAfterwards;
    do {
      initialMsgCount = await msgsByAuthor.size();
      let leftCursor, rightCursor;
      let leftRes = await searchText(this.gun.get(`identitiesBySearchKey`), ``, 1, leftCursor);
      let rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
      // sort-merge join identitiesBySearchKey and msgsByAuthor
      while (leftRes.length && rightRes.length) {
        leftCursor = leftRes[0].key;
        rightCursor = rightRes[0].key;
        if (rightRes[0].key.indexOf(leftRes[0].key) === 0) {
          console.log(`adding msg by`, rightRes[0].key);
          try {
            const m = Message.fromJws(rightRes[0].value.jws);
            await this.addMessage(m);
          } catch (e) {
            const m = Message.fromJws(rightRes[0].value.jws);
            console.log(`adding failed:`, e, JSON.stringify(m, null, 2));
          }
          await msgsByAuthor.delete(rightCursor);
          leftRes = await this.gun.get(`identitiesBySearchKey`).searchText(``, 1, leftCursor);
          rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
        } else if (leftRes[0].key < rightRes[0].key) {
          leftRes = await this.gun.get(`identitiesBySearchKey`).searchText(``, 1, leftCursor);
        } else {
          rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
        }
      }
      msgCountAfterwards = await msgsByAuthor.size();
    } while (msgCountAfterwards !== initialMsgCount);
    return true;
  }

  /**
  * @param msg Message to add to the index
  * @param {boolean} updateIdentityIndexes default true
  */
  async addMessage(msg: Message, updateIdentityIndexes = true) {
    msg.distance = await this.getMsgTrustDistance(msg);
    if (msg.distance === undefined) {
      return false; // do not save messages from untrusted author
    }
    let indexKey = Index.getMsgIndexKey(msg);
    await new Promise(resolve => {
      this.gun.get(`messagesByDistance`).get(indexKey).put(msg.jws, () => {resolve();});
    });
    indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
    await new Promise(resolve => {
      this.gun.get(`messagesByTimestamp`).get(indexKey).put(msg.jws, () => {resolve();});
    });
    if (updateIdentityIndexes) {
      await this._updateIdentityIndexesByMsg(msg);
    }
    return true;
  }

  /**
  * @param {string} value search string
  * @param {string} type (optional) type of searched value
  * @returns {Array} list of matching identities
  */
  async search(value) { // TODO: param 'exact'
    return this.gun.get(`identitiesByTrustDistance`).map((id, key) => {
      if (key.indexOf(encodeURIComponent(value)) === - 1) {
        return;
      }
      return new Identity(id);
    }).once().then();
  }
}

export default Index;
