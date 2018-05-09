import btree from 'merkle-btree';
import util from './util';
import Message from './message';
import Identity from './identity';
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

class Index {
  static create() { // TODO: make it work with js-ipfs && IPFSStorage
    this.storage = new btree.RAMStorage();
    this.identitiesBySearchKey = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
    this.messagesByTimestamp = new btree.MerkleBTree(this.storage, IPFS_INDEX_WIDTH);
    return true;
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
    this.identitiesBySearchKey = await btree.MerkleBTree.getByHash(`${indexRoot}/identities_by_searchkey`, this.storage, IPFS_INDEX_WIDTH);
    this.messagesByTimestamp = await btree.MerkleBTree.getByHash(`${indexRoot}/messages_by_timestamp`, this.storage, IPFS_INDEX_WIDTH);
    return true;
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

  /* Add message to index */
  async addMessage(msg: Message) {
    if (this.ipfs) {
      return this.messagesByTimestamp.put(`key`, msg.jws);
      // TODO: update ipns entry to point to new index root
    }
  }

  async search(value, type, limit = 5) { // TODO: param 'exact'
    const identitiesByHash = {};
    let r = await this.identitiesBySearchKey.searchText(encodeURIComponent(value), limit);
    while (r && r.length && Object.keys(identitiesByHash).length < limit) {
      for (let i = 0;i < r.length && Object.keys(identitiesByHash).length < limit;i ++) {
        if (r[i].value) {
          try {
            const d = JSON.parse(await this.storage.get(`/ipfs/${r[i].value}`));
            identitiesByHash[r[i].value] = new Identity(d);
          } catch (e) {
            console.error(e);
          }
        }
      }
      r = await this.identitiesBySearchKey.searchText(encodeURIComponent(value), limit, r[r.length - 1].key);
    }
    return Object.values(identitiesByHash);
  }
}

export default Index;
