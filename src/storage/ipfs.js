/**
* https://ipfs.io
* https://github.com/mmalmi/merkle-btree
* @param {Object} options {tree: merkleBtree}
*/
class IpfsStorage extends Storage {
  constructor(options) {
    super();
    this.tree = options.tree;
  }

  put(key, value, cb) {
    const obj = {};
    obj[key] = value;
    this.tree.put(obj).then(hash => cb(hash));
  }

  once(key, cb) {
    this.tree.get(key, data => cb(data));
  }

  on(key, cb) {
    this.tree.get(key, data => cb(data));
  }

  delete(key, cb) {
    this.tree.delete(key).then(res => cb(res));
  }

  search(o, cb) {
    // merkle-btree
  }
}
