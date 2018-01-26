import btree from 'merkle-btree';
import util from './util';

class IdentifiIndex {
  async init(indexRoot, ipfs) {
    this.storage = new btree.IPFSStorage(ipfs);
    this.index = await btree.getByHash(`${indexRoot}/identities_by_searchkey`, this.storage);
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

    const res = await this.index.searchText(`${encodeURIComponent(value)}:${encodeURIComponent(type)}:`, 2);
    if (res.length > 1) { // TODO: make it smarter
      throw `Found multiple matches`;
    }
    if (res.length === 1) {
      return res[0];
    }
    return undefined;
  }

  async search(value, type, limit = 5) { // TODO: param 'exact'
    return this.index.searchText(encodeURIComponent(value), limit);
  }
}

export default IdentifiIndex;
