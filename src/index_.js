import btree from 'merkle-btree';
import util from './util';
import Message from './message';
import Identity from './identity';
import Attribute from './attribute';
import fetch from 'node-fetch';

const DEFAULT_INDEX = `/ipns/Qmbb1DRwd75rZk5TotTXJYzDSJL6BaNT1DAQ6VbKcKLhbs`;
const DEFAULT_STATIC_FALLBACK_INDEX = `/ipfs/QmPxLM631zJQ12tUDWs55LkGqqroFZKHeLjAZ2XwL9Miu3`;
const DEFAULT_IPFS_PROXIES = [
  `https://identi.fi`,
  `https://ipfs.io`,
  `https://ipfs.infura.io`,
  `https://www.eternum.io`
];
const IPFS_INDEX_WIDTH = 200;
const DEFAULT_TIMEOUT = 10000;

// TODO: make the whole thing use GUN for indexing and flush onto IPFS
class Index {
  constructor(ipfs, viewpoint) {
    if (ipfs) {
      this.ipfs = ipfs;
      this.storage = new btree.IPFSStorage(ipfs);
      this.identitiesBySearchKey = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      this.identitiesByTrustDistance = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      this.messagesByTimestamp = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      this.messagesByDistance = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      if (viewpoint) {
        this.viewpoint = new Attribute(viewpoint);
      } else {
        this.viewpoint = {name: `keyID`, val: util.getDefaultKey().keyID, conf: 1, ref: 0};
      }
      const vp = new Identity({attrs: [this.viewpoint], trustDistance: 0});
      this.ready = new Promise(async (resolve, reject) => {
        try {
          await this._setSentRcvdIndexes(vp);
          await this._addIdentityToIndexes(vp);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    }
  }

  static async create(ipfs, viewpoint) {
    const i = new Index(ipfs, viewpoint);
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

  static getIdentityIndexKeys(identity, hash) {
    const indexKeys = [];
    const attrs = identity.data.attrs;
    for (let j = 0;j < attrs.length;j += 1) {
      let distance = identity.data.hasOwnProperty(`trustDistance`) ? identity.data.trustDistance : parseInt(attrs[j].dist);
      distance = Number.isNaN(distance) ? 99 : distance;
      distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
      const v = attrs[j].val || attrs[j][1];
      const n = attrs[j].name || attrs[j][0];
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
    return indexKeys;
  }

  static async load(indexRoot, ipfs) {
    const i = new Index();
    await i.init(indexRoot, ipfs);
    return i;
  }

  async init(indexRoot, ipfs = DEFAULT_IPFS_PROXIES, timeout = DEFAULT_TIMEOUT) {
    let useDefaultIndex = false;
    if (typeof indexRoot === `undefined`) {
      useDefaultIndex = true;
      indexRoot = DEFAULT_INDEX;
    }
    if (typeof ipfs === `string`) {
      this.storage = new btree.IPFSGatewayStorage(ipfs);
    } else if (Array.isArray(ipfs)) {
      let url;
      for (let i = 0;i < ipfs.length;i ++) {
        let res;
        let u = `${ipfs[i]}${indexRoot}`;
        try {
          res = await util.timeoutPromise(fetch(u, {timeout}).catch(() => {}), timeout);
          if (!res) {console.log(`fetching ${u} timed out`);}
        } catch (e) {
          console.log(`fetching ${u} failed:`, e);
        }
        if (!(res && res.ok && res.status === 200) && useDefaultIndex) { // try static fallback
          u = `${ipfs[i]}${DEFAULT_STATIC_FALLBACK_INDEX}`;
          try {
            res = await util.timeoutPromise(fetch(u, {timeout}).catch(() => {}), timeout);
            if (res) {
              indexRoot = DEFAULT_STATIC_FALLBACK_INDEX;
            } else {
              console.log(`fetching ${u} timed out`);
            }
          } catch (e) {
            console.log(`fetching ${u} failed:`, e);
          }
        }
        if (res && res.ok && res.status === 200) {
          url = ipfs[i];
          break;
        }
      }
      if (url) {
        this.storage = new btree.IPFSGatewayStorage(url);
      } else {
        throw `Could not load index via given ipfs gateways`;
      }
    } else if (typeof ipfs === `object`) {
      this.storage = new btree.IPFSStorage(ipfs);
      this.ipfs = ipfs;
    } else {
      throw `ipfs param must be a gateway url, array of urls or a js-ipfs object`;
    }
    const root = await this.storage.get(indexRoot);
    let rootObj;
    try {
      rootObj = JSON.parse(root);
    } catch (e) {
      console.log(`Old format index root`);
    }
    if (rootObj) {
      this.identitiesByTrustDistance = await btree.MerkleBTree.getByHash(rootObj.identitiesByTrustDistance, this.storage, IPFS_INDEX_WIDTH);
      this.identitiesBySearchKey = await btree.MerkleBTree.getByHash(rootObj.identitiesBySearchKey, this.storage, IPFS_INDEX_WIDTH);
      this.messagesByTimestamp = await btree.MerkleBTree.getByHash(rootObj.messagesByTimestamp, this.storage, IPFS_INDEX_WIDTH);
      this.messagesByDistance = await btree.MerkleBTree.getByHash(rootObj.messagesByDistance, this.storage, IPFS_INDEX_WIDTH);
      this.viewpoint = rootObj.viewpoint;
    } else {
      this.identitiesByTrustDistance = await btree.MerkleBTree.getByHash(`${indexRoot}/identities_by_distance`, this.storage, IPFS_INDEX_WIDTH);
      this.identitiesBySearchKey = await btree.MerkleBTree.getByHash(`${indexRoot}/identities_by_searchkey`, this.storage, IPFS_INDEX_WIDTH);
      this.messagesByTimestamp = await btree.MerkleBTree.getByHash(`${indexRoot}/messages_by_timestamp`, this.storage, IPFS_INDEX_WIDTH);
      this.messagesByDistance = await btree.MerkleBTree.getByHash(`${indexRoot}/messages_by_distance`, this.storage, IPFS_INDEX_WIDTH);
    }
    if (!this.viewpoint) {
      const vp = await this.getViewpoint();
      this.viewpoint = vp.mostVerifiedAttributes.keyID.attribute.val;
    }
    return true;
  }

  async save() {
    try {
      let r = await this.ipfs.files.add([
        {path: `messagesByDistance`, content: new Buffer(this.messagesByDistance.rootNode.serialize(), `utf8`)},
        {path: `messagesByTimestamp`, content: new Buffer(this.messagesByTimestamp.rootNode.serialize(), `utf8`)},
        {path: `identitiesBySearchKey`, content: new Buffer(this.identitiesBySearchKey.rootNode.serialize(), `utf8`)},
        {path: `identitiesByTrustDistance`, content: new Buffer(this.identitiesByTrustDistance.rootNode.serialize(), `utf8`)},
      ]);
      const root = {viewpoint: this.viewpoint};
      for (let i = 0;i < r.length;i += 1) {
        root[r[i].path] = r[i].hash;
      }
      r = await this.ipfs.files.add(new Buffer(JSON.stringify(root), `utf8`));
      const rootHash = r[0].hash;
      if (this.ipfs.name) {
        console.log(`publishing index`, rootHash);
        const n = await this.ipfs.name.publish(rootHash, {});
        console.log(`published index`, n);
      }
      return rootHash;
    } catch (e) {
      console.log(`error publishing index`, e);
    }
  }

  async _setSentRcvdIndexes(id) {
    if (!id.sentIndex) {
      if (id.data.sent) {
        id.sentIndex = await btree.MerkleBTree.getByHash(id.data.sent, this.storage, IPFS_INDEX_WIDTH);
      } else {
        id.sentIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      }
    }
    if (!id.receivedIndex) {
      if (id.data.received) {
        id.receivedIndex = await btree.MerkleBTree.getByHash(id.data.received, this.storage, IPFS_INDEX_WIDTH);
      } else {
        id.receivedIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      }
    }
  }

  async getViewpoint() {
    const r = await this.identitiesByTrustDistance.searchText(`00`, 1);
    if (r.length) {
      const p = await this.storage.get(r[0].value);
      const vp = new Identity(JSON.parse(p));
      await this._setSentRcvdIndexes(vp);
      return vp;
    }
  }

  /*
  Get an identity referenced by an identifier.
  If type is undefined, tries to guess it.
  */
  async get(value, type) {
    if (typeof value === `undefined`) {
      throw `Value is undefined`;
    }
    if (typeof type === `undefined`) {
      type = Attribute.guessTypeOf(value);
    }

    const profileUri = await this.identitiesBySearchKey.get(`${encodeURIComponent(value)}:${encodeURIComponent(type)}`);
    if (profileUri) {
      const p = await this.storage.get(profileUri);
      const id = new Identity(JSON.parse(p));
      id.ipfsHash = profileUri;
      await this._setSentRcvdIndexes(id);
      return id;
    }
  }

  async _getMsgs(msgIndex, limit, cursor) {
    const rawMsgs = await msgIndex.searchText(``, limit, cursor, true);
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

  async _saveIdentityToIpfs(id: Identity) {
    const buffer = new this.ipfs.types.Buffer(JSON.stringify(id.data));
    const r = await this.ipfs.files.add(buffer);
    const hash = r.length ? r[0].hash : ``;
    id.ipfsHash = hash;
    return hash;
  }

  async _removeIdentityFromIndexes(id: Identity) {
    let hash = id.ipfsHash;
    if (!hash) {
      hash = await this._saveIdentityToIpfs(id);
    }
    const indexKeys = Index.getIdentityIndexKeys(id, hash.substr(2));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`deleting key ${key}`);
      await this.identitiesByTrustDistance.delete(key);
      await this.identitiesBySearchKey.delete(key.substr(key.indexOf(`:`) + 1));
    }
  }

  async _addIdentityToIndexes(id: Identity) {
    if (id.sentIndex && id.receivedIndex) {
      if (id.sentIndex.rootNode.hash && id.receivedIndex.rootNode.hash) {
        id.data.sent = id.sentIndex.rootNode.hash;
        id.data.received = id.receivedIndex.rootNode.hash;
      } else {
        const s = await this.ipfs.files.add(new Buffer(id.sentIndex.rootNode.serialize(), `utf8`));
        id.data.sent = s[0].hash;
        const r = await this.ipfs.files.add(new Buffer(id.receivedIndex.rootNode.serialize(), `utf8`));
        id.data.received = r[0].hash;
      }
    }
    const hash = await this._saveIdentityToIpfs(id);
    const indexKeys = Index.getIdentityIndexKeys(id, hash.substr(2));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
      console.log(`adding key ${key}`);
      await this.identitiesByTrustDistance.put(key, hash);
      await this.identitiesBySearchKey.put(key.substr(key.indexOf(`:`) + 1), hash);
    }
    return {hash};
  }

  async getSentMsgs(identity, limit, cursor = ``) {
    if (!identity.sentIndex) {
      identity.sentIndex = await btree.MerkleBTree.getByHash(identity.data.sent, this.storage, IPFS_INDEX_WIDTH);
    }
    return this._getMsgs(identity.sentIndex, limit, cursor);
  }

  async getReceivedMsgs(identity, limit, cursor = ``) {
    if (!identity.receivedIndex) {
      identity.receivedIndex = await btree.MerkleBTree.getByHash(identity.data.received, this.storage, IPFS_INDEX_WIDTH);
    }
    return this._getMsgs(identity.receivedIndex, limit, cursor);
  }

  async getAttributeTrustDistance(a) {
    if (!Attribute.isUniqueType(a.name)) {
      return;
    }
    const id = await this.get(a.val, a.name);
    return id && id.data && id.data.trustDistance;
  }

  async getMsgTrustDistance(msg) {
    let shortestDistance = 1000;
    const signer = await this.get(msg.getSignerKeyID(), `keyID`);
    if (!signer) {
      return;
    }
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = new Attribute(msg.signedData.author[i]);
      if (Attribute.equals(a, this.viewpoint)) {
        return 0;
      } else {
        const d = await this.getAttributeTrustDistance(a);
        if (d < shortestDistance) {
          shortestDistance = d;
        }
      }
    }
    return shortestDistance < 1000 ? shortestDistance : undefined;
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
      const id = new Identity({attrs});
      id.sentIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      id.receivedIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      // TODO: take msg author trust into account
      await this._saveIdentityToIpfs(id);
      recipientIdentities[id.ipfsHash] = id;
    }
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    const ids = Object.values(Object.assign({}, authorIdentities, recipientIdentities));
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
            id.data.attrs.push({name: a1[0], val: a1[1], conf: 1, ref: 0});
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
        await id.receivedIndex.put(msgIndexKey, msg);
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
        await id.sentIndex.put(msgIndexKey, msg);
      }
      await this._addIdentityToIndexes(id);
    }
  }

  /*
    Add a list of messages to the index.
    Useful for example when adding a new WoT dataset that contains previously
    unknown authors.

    Iteratively performs sorted merge joins on previously known identities and
    new msgs authors, until all messages from within the WoT have been added.

    Msgs can be either a merkle-btree or an array of messages.
  */
  async addMessages(msgs) {
    let msgsByAuthor;
    if (Array.isArray(msgs)) {
      msgsByAuthor = new btree.MerkleBTree(this.storage, 1000);
      for (let i = 0;i < msgs.length;i ++) {
        for (let j = 0;j < msgs[i].signedData.author.length;j ++) {
          const id = msgs[i].signedData.author[j];
          if (Attribute.isUniqueType(id[0])) {
            const key = `${encodeURIComponent(id[1])}:${encodeURIComponent(id[0])}`;
            await msgsByAuthor.put(key, msgs[i]);
          }
        }
      }
    } else if (msgs instanceof btree.MerkleBTree) {
      msgsByAuthor = msgs;
    } else {
      throw `msgs param must be an array or MerkleBTree`;
    }
    let messagesAdded = true;
    while (messagesAdded) {
      messagesAdded = false;
      let leftCursor, rightCursor;
      let leftRes = await this.identitiesBySearchKey.searchText(``, 1, leftCursor);
      let rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
      // sort-merge join identitiesBySearchKey and msgsByAuthor
      while (leftRes.length && rightRes.length) {
        leftCursor = leftRes[0].key;
        rightCursor = rightRes[0].key;
        console.log(leftCursor, rightCursor);
        if (leftRes[0].key === rightRes[0].key) {
          console.log(`adding msg by`, rightRes[0].key);
          await this.addMessage(Message.fromJws(rightRes[0].value.jws));
          leftRes = await this.identitiesBySearchKey.searchText(``, 1, leftCursor);
          rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
          messagesAdded = true;
        } else if (leftRes[0].key < rightRes[0].key) {
          leftRes = await this.identitiesBySearchKey.searchText(``, 1, leftCursor);
        } else {
          rightRes = await msgsByAuthor.searchText(``, 1, rightCursor);
        }
      }
    }
    return true;
  }

  /* Add message to index */
  async addMessage(msg: Message, updateIdentityIndexes = true) {
    if (this.ipfs) {
      msg.distance = await this.getMsgTrustDistance(msg);
      if (msg.distance === undefined) {
        return; // do not save messages from untrusted author
      }
      let indexKey = Index.getMsgIndexKey(msg);
      await this.messagesByDistance.put(indexKey, msg);
      indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
      const h = await this.messagesByTimestamp.put(indexKey, msg);
      if (updateIdentityIndexes) {
        await this._updateIdentityIndexesByMsg(msg);
      }
      // save() ?
      return h;
    }
  }

  /* Save message to ipfs and announce it on ipfs pubsub */
  async publishMessage(msg: Message, addToIndex = true) {
    const r = {};
    if (this.ipfs) {
      const hash = await this.ipfs.files.add(new Buffer(msg.jws, `utf8`));
      r.hash = hash;
      await this.ipfs.pubsub.publish(`identifi`, new Buffer(hash, `utf8`));
      if (addToIndex) {
        r.indexUri = await this.addMessage(msg);
      }
    } else { // No IPFS, post to identi.fi
      const body = JSON.stringify({jws: msg.jws, hash: msg.getHash()});
      const res = await fetch(`https://identi.fi/api/messages`, {
        method: `POST`,
        headers: {'Content-Type': `application/json`},
        body,
      });
      if (res.status && res.status === 201) {
        const t = JSON.parse(await res.text());
        r.hash = t.ipfs_hash;
      }
    }
    return r;
  }

  async search(value, type, limit = 5, cursor, depth = 20) { // TODO: param 'exact'
    const identitiesByHash = {};
    const initialDepth = cursor ? Number.parseInt(cursor.substring(0, cursor.indexOf(`:`))) : 0;
    for (let d = initialDepth;d <= depth;d ++) {
      const useCursor = d === initialDepth;
      const paddedDistance = (`00${d}`).substring(d.toString().length);
      //console.log(`${paddedDistance}:${encodeURIComponent(value)}`, limit, useCursor ? cursor : undefined);
      let r = await this.identitiesByTrustDistance.searchText(`${paddedDistance}:${encodeURIComponent(value)}`, limit, useCursor ? cursor : undefined);
      //console.log(`r`, r);
      while (r && r.length && Object.keys(identitiesByHash).length < limit) {
        for (let i = 0;i < r.length && Object.keys(identitiesByHash).length < limit;i ++) {
          if (r[i].value && !identitiesByHash.hasOwnProperty(r[i].value)) {
            try {
              const d = JSON.parse(await this.storage.get(`/ipfs/${r[i].value}`));
              const id = new Identity(d);
              id.ipfsHash = r[i].value;
              id.cursor = r[i].key;
              identitiesByHash[r[i].value] = id;
            } catch (e) {
              console.error(e);
            }
          }
        }
        //console.log(`${paddedDistance}:${encodeURIComponent(value)}`, limit, r[r.length - 1].key);
        r = await this.identitiesBySearchKey.searchText(`${paddedDistance}:${encodeURIComponent(value)}`, limit, r[r.length - 1].key);
        //console.log(`r`, r);
      }
    }
    return Object.values(identitiesByHash);
  }
}

export default Index;
