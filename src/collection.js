/**
* Gun object collection that provides tools for indexing and search. Decentralize everything!
*
* If opt.class is passed, object.serialize() and opt.class.deserialize() must be defined.
*
* Supports search from multiple indexes.
* For example, retrieve message feed from your own index and your friends' indexes.
*
* TODO: aggregation
* TODO: example
* TODO: scrollable and stretchable "search result window"
* @param {Object} opt {gun, class, indexes = [], askPeers = true, name = class.name}
*/
class Collection {
  constructor(opt = {}) {
    if (!opt.gun) {
      throw new Error(`Missing opt.gun`);
    }
    if (!(opt.class || opt.name)) {
      throw new Error(`You must supply either opt.name or opt.class`);
    }
    this.class = opt.class;
    if (this.class && !this.class.deserialize) {
      throw new Error(`opt.class must have deserialize() method`);
    }
    this.name = opt.name || opt.class.name;
    this.gun = opt.gun;
    this.indexes = opt.indexes || [];
    this.askPeers = typeof opt.askPeers === `undefined` ? true : opt.askPeers;
  }

  /**
  * @return {String} id of added object, which can be used for collection.get(id)
  */
  put(object) {
    let data = object;
    if (this.class) {
      data = object.serialize();
    }
    // TODO: optionally use gun hash table
    let node;
    if (data.id) {
      node = this.gun.get(this.name).get(`id`).get(data.id).put(data); // TODO: use .top()
    } else {
      node = this.gun.get(this.name).get(`id`).set(data);
    }
    this._addToIndexes(data, node);
    return data.id || Gun.node.soul(node) || node._.link;
  }

  _addToIndexes(serializedObject, node) {
    for (let i = 0;i < this.indexes.length; i++) {
      if (Object.prototype.hasOwnProperty.call(serializedObject, this.indexes[i])) {
        const indexName = this.indexes[i];
        this.gun.get(this.name).get(indexName).get(serializedObject[indexName]).put(node);
      }
    }
  }


  // TODO: method for terminating the query
  // TODO: query ttl. https://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html
  /**
  * @param {Object} opt {callback, id, selector, limit, orderBy}
  */
  get(opt = {}) {
    if (!opt.callback) { return; }
    let results = 0;
    const matcher = data => {
      if (!data) { return; }
      if (opt.limit && results++ >= opt.limit) {
        return; // TODO: terminate query
      }
      if (opt.selector) { // TODO: deep compare selector object?
        const keys = Object.keys(opt.selector);
        for (let i = 0;i < keys.length;i++) {
          const key = keys[i];
          if (!Object.prototype.hasOwnProperty.call(data, key)) { return; }
          let v1, v2;
          if (opt.caseSensitive === false) {
            v1 = data[key].toLowerCase();
            v2 = opt.selector[key].toLowerCase();
          } else {
            v1 = data[key];
            v2 = opt.selector[key];
          }
          if (v1 !== v2) { return; }
        }
      }
      if (opt.query) { // TODO: use gun.get() lt / gt operators
        const keys = Object.keys(opt.query);
        for (let i = 0;i < keys.length;i++) {
          const key = keys[i];
          if (!Object.prototype.hasOwnProperty.call(data, key)) { return; }
          let v1, v2;
          if (opt.caseSensitive === false) {
            v1 = data[key].toLowerCase();
            v2 = opt.query[key].toLowerCase();
          } else {
            v1 = data[key];
            v2 = opt.query[key];
          }
          if (v1.indexOf(v2) !== 0) { return; }
        }
      }
      if (this.class) {
        opt.callback(this.class.deserialize(data));
      } else {
        opt.callback(data);
      }
    };

    if (opt.id) {
      opt.limit = 1;
      this.gun.get(this.name).get(`id`).get(opt.id).on(matcher);
      return;
    }

    let indexName = `id`;
    if (opt.orderBy && this.indexes.indexOf(opt.orderBy) > -1) {
      indexName = opt.orderBy;
    }

    // TODO: query from indexes
    this.gun.get(this.name).get(indexName).map().on(matcher); // TODO: limit .open recursion
    if (this.askPeers) {
      this.gun.get(`trustedIndexes`).on((val, key) => {
        this.gun.user(key).get(this.name).get(indexName).map().on(matcher);
      });
    }
  }

  delete(opt = {}) {
    // gun.unset()
  }
}

export default Collection;
