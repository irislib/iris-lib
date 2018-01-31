import btree from 'merkle-btree';
import util from './util';
import Message from './message';
import Identity from './identity';
import rp from 'request-promise';

const DEFAULT_INDEX_ROOT = `/ipns/Qmbb1DRwd75rZk5TotTXJYzDSJL6BaNT1DAQ6VbKcKLhbs`;
const DEFAULT_IPFS_PROXIES = [`https://identi.fi`, `https://ipfs.io`];
const IPFS_INDEX_WIDTH = 200;

class Index {
  async init(indexRoot = DEFAULT_INDEX_ROOT, ipfs = DEFAULT_IPFS_PROXIES) {
    if (typeof ipfs === `string`) {
      this.storage = new btree.IPFSGatewayStorage(ipfs);
    } else if (Array.isArray(ipfs)) {
      this.storage = new btree.IPFSGatewayStorage(ipfs[0]);
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

  /* Save msg to index and broadcast to pubsub */
  async put(msg: Message) {
    const r = {};
    if (this.ipfs) {
      const buffer = new this.ipfs.types.Buffer(msg.jws);
      r.hash = await this.ipfs.files.add(buffer);
      r.indexUri = await this.messagesByTimestamp.put(`key`, msg.jws);
      await this.ipfs.pubsub.publish(`identifi`, buffer);
    } else {
      r.hash = await rp({
        method: `POST`,
        json: true,
        body: msg.jws,
        uri: `https://identi.fi/api/messages`,
      });
    }
    return r;
  }

  async search(value, type, limit = 5) { // TODO: param 'exact'
    return this.identitiesBySearchKey.searchText(encodeURIComponent(value), limit);
  }
}

export default Index;
