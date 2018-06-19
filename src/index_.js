import btree from 'merkle-btree';
import util from './util';
import Message from './message';
import Identity from './identity';
import fetch from 'node-fetch';
import dagPB from 'ipld-dag-pb';

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
        this.viewpoint = viewpoint;
      } else {
        this.viewpoint = [`keyID`, util.getDefaultKey().keyID];
      }
      const vp = new Identity({attrs: [this.viewpoint]});
      vp.sentIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      vp.receivedIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      vp.data.trustDistance = 0;
      vp.trustDistance = 0;
      this._addIdentityToIndexes(vp);
    }
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
      let distance = identity.trustDistance || parseInt(attrs[j].dist);
      distance = Number.isNaN(distance) ? 99 : distance;
      distance = (`00${distance}`).substring(distance.toString().length); // pad with zeros
      const v = attrs[j].val || attrs[j][1];
      const n = attrs[j].name || attrs[j][0];
      const value = encodeURIComponent(v);
      const lowerCaseValue = encodeURIComponent(v.toLowerCase());
      const name = encodeURIComponent(n);
      const key = `${distance}:${value}:${name}`;
      const lowerCaseKey = `${distance}:${lowerCaseValue}:${name}`;
      // TODO: add  + ':' + hash.substr(0, 9) to non-unique identifiers, to allow for duplicates
      indexKeys.push(key);
      if (key !== lowerCaseKey) {
        indexKeys.push(lowerCaseKey);
      }
      if (v.indexOf(` `) > - 1) {
        const words = v.toLowerCase().split(` `);
        for (let l = 0;l < words.length;l += 1) {
          const k = `${distance}:${encodeURIComponent(words[l])}:${name}:${hash.substr(0, 9)}`;
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
    this.identitiesByTrustDistance = await btree.MerkleBTree.getByHash(`${indexRoot}/identities_by_distance`, this.storage, IPFS_INDEX_WIDTH);
    this.identitiesBySearchKey = await btree.MerkleBTree.getByHash(`${indexRoot}/identities_by_searchkey`, this.storage, IPFS_INDEX_WIDTH);
    this.messagesByTimestamp = await btree.MerkleBTree.getByHash(`${indexRoot}/messages_by_timestamp`, this.storage, IPFS_INDEX_WIDTH);
    return true;
  }

  async save() {
    try {
      let indexRoot;
      let res = await this.ipfs.files.add([
        {path: `messages_by_distance`, content: Buffer.from(this.messagesByDistance.rootNode.serialize())},
        {path: `messages_by_timestamp`, content: Buffer.from(this.messagesByTimestamp.rootNode.serialize())},
        {path: `identities_by_searchkey`, content: Buffer.from(this.identitiesBySearchKey.rootNode.serialize())},
        {path: `identities_by_distance`, content: Buffer.from(this.identitiesByTrustDistance.rootNode.serialize())},
      ]);
      const links = [];
      for (let i = 0;i < res.length;i += 1) {
        links.push({Name: res[i].path, Hash: res[i].hash, Size: res[i].size});
      }
      // TODO: remove dagPB dependency - has too many subdependencies
      res = await new Promise(((resolve, reject) => {
        dagPB.DAGNode.create(Buffer.from(`\u0008\u0001`), links, (err, dag) => {
          if (err) {
            reject(err);
          }
          resolve(this.ipfs.object.put(dag));
        });
      }));
      if (res._json.multihash) {
        indexRoot = res._json.multihash;
        if (this.ipfs.name) {
          console.log(`publishing index`, indexRoot);
          const r = await this.ipfs.name.publish(indexRoot, {});
          console.log(`published index`, r);
        }
      }
      return indexRoot;
    } catch (e) {
      console.log(`error publishing index`, e);
    }
  }

  async getViewpoint() {
    const r = await this.identitiesByTrustDistance.searchText('00', 1);
    if (r.length) {
      const p = await this.storage.get(r[0].value);
      return new Identity(JSON.parse(p));
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
      type = util.guessTypeOf(value);
    }

    const profileUri = await this.identitiesBySearchKey.get(`${encodeURIComponent(value)}:${encodeURIComponent(type)}`);
    if (profileUri) {
      const p = await this.storage.get(profileUri);
      return new Identity(JSON.parse(p));
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
      console.log(id.data.sent, id.data.received);
    }
    const buffer = new this.ipfs.types.Buffer(JSON.stringify(id.data));
    const r = await this.ipfs.files.add(buffer);
    const hash = r.length ? r[0].hash : ``;
    const indexKeys = Index.getIdentityIndexKeys(id, hash.substr(2));
    for (let i = 0;i < indexKeys.length;i ++) {
      const key = indexKeys[i];
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

  /* Save message to ipfs and announce it on ipfs pubsub */
  async publishMessage(msg: Message, addToIndex = true) {
    const r = {};
    if (this.ipfs) {
      const buffer = new this.ipfs.types.Buffer(msg.jws);
      const hash = await this.ipfs.files.add(buffer);
      r.hash = hash;
      await this.ipfs.pubsub.publish(`identifi`, hash);
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

  async getAttributeTrustDistance(a) {
    if (!util.isUniqueType(a[0])) {
      return 99;
    }
    const id = await this.get(a[1], a[0]);
    return id && id.trustDistance ? id.trustDistance : 99;
  }

  async getMsgTrustDistance(msg) {
    let shortestDistance = 99;
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      if (util.attributeEquals(msg.signedData.author[i], this.viewpoint)) {
        return 0;
      } else {
        const d = await this.getAttributeTrustDistance(msg.signedData.author[i]);
        if (d < shortestDistance) {
          shortestDistance = d;
        }
      }
    }
    return shortestDistance;
  }

  async _updateIdentityIndexesByMsg(msg) {
    const recipientIdentities = [];
    const authorIdentities = [];
    for (let i = 0;i < msg.signedData.recipient.length;i ++) {
      const a = msg.signedData.recipient[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        recipientIdentities.push(id);
      }
    }
    for (let i = 0;i < msg.signedData.author.length;i ++) {
      const a = msg.signedData.author[i];
      const id = await this.get(a[1], a[0]);
      if (id) {
        authorIdentities.push(id);
      }
    }
    if (recipientIdentities.length) {
      // TODO: add new identifiers to existing identity and update identity stats
      // TODO: update sent/rcvd msg indexes
    } else {
      const id = new Identity({attrs: msg.signedData.recipient});
      id.sentIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      id.receivedIndex = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
      // TODO: take msg author trust into account
      if (msg.isPositive()) {
        id.data.trustDistance = msg.distance + 1;
      }
      recipientIdentities.push(id);
    }
    let msgIndexKey = Index.getMsgIndexKey(msg);
    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(`:`) + 1);
    for (let i = 0;i < recipientIdentities.length;i ++) {
      const id = recipientIdentities[i];
      await id.receivedIndex.put(msgIndexKey, msg);
      await this._addIdentityToIndexes(id);
    }
    for (let i = 0;i < authorIdentities.length;i ++) {
      const id = authorIdentities[i];
      await id.sentIndex.put(msgIndexKey, msg);
      await this._addIdentityToIndexes(id);
    }
  }

  /* Add message to index */
  async addMessage(msg: Message, updateIdentityIndexes = true) {
    if (this.ipfs) {
      msg.distance = await this.getMsgTrustDistance(msg);
      if (msg.distance === 99) {
        return; // do not save messages from untrusted author
      }
      let indexKey = Index.getMsgIndexKey(msg);
      await this.messagesByDistance.put(indexKey, msg);
      indexKey = indexKey.substr(indexKey.indexOf(`:`) + 1); // remove distance from key
      const h = await this.messagesByTimestamp.put(indexKey, msg);
      if (updateIdentityIndexes) {
        await this._updateIdentityIndexesByMsg(msg);
      }
      // TODO: update ipns entry to point to new index root
      return h;
    }
  }

  async search(value, type, limit = 5, cursor, depth = 20) { // TODO: param 'exact'
    const identitiesByHash = {};
    const initialDepth = cursor ? Number.parseInt(cursor.substring(0, cursor.indexOf(`:`))) : 0;
    for (let d = initialDepth;d <= depth;d ++) {
      const useCursor = d === initialDepth;
      const paddedDistance = (`00${d}`).substring(d.toString().length);
      console.log(`${paddedDistance}:${encodeURIComponent(value)}`, limit, useCursor ? cursor : undefined);
      let r = await this.identitiesBySearchKey.searchText(`${paddedDistance}:${encodeURIComponent(value)}`, limit, cursor : undefined);
      console.log(`r`, r);
      while (r && r.length && Object.keys(identitiesByHash).length < limit) {
        for (let i = 0;i < r.length && Object.keys(identitiesByHash).length < limit;i ++) {
          if (r[i].value && !identitiesByHash.hasOwnProperty(r[i].value)) {
            try {
              const d = JSON.parse(await this.storage.get(`/ipfs/${r[i].value}`));
              const id = new Identity(d);
              id.cursor = r[i].key;
              identitiesByHash[r[i].value] = id;
            } catch (e) {
              console.error(e);
            }
          }
        }
        console.log(`${paddedDistance}:${encodeURIComponent(value)}`, limit, r[r.length - 1].key);
        r = await this.identitiesBySearchKey.searchText(`${paddedDistance}:${encodeURIComponent(value)}`, limit, r[r.length - 1].key);
        console.log(`r`, r);
      }
    }
    return Object.values(identitiesByHash);
  }
}

export default Index;
