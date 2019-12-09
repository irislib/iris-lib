/**
* Gun object collection that provides tools for indexing and search. Decentralize everything!
*
* If opt.class is passed, object.serialize() and opt.class.deserialize() must be defined.
*
* Supports search from multiple indexes.
* For example, retrieve message feed from your own index and your friends' indexes.
*
* TODO: aggregation
* @param {Object} opt {gun, class, name, indexes = [], askPeers = true}
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
    this.name = opt.name || opt.class.constructor.name;
    this.gun = opt.gun;
    this.opt.indexes = this.opt.indexes || [];
    this.opt.askPeers = typeof this.opt.askPeers === `undefined` ? true : this.opt.askPeers;
  }

  /**
  *
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
  }

  _addToIndexes(serializedObject, node) {
    for (let i = 0;i < this.indexes.length; i++) {
      if (Object.prototype.hasOwnProperty.call(serializedObject, this.indexes[i])) {
        const indexName = this.indexes[i];
        this.gun.get(this.name).get(indexName).get(serializedObject[this.indexes[i]]).put(node);
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
      if (opt.limit && results++ >= opt.limit) {
        return; // TODO: terminate query
      }
      if (opt.selector) { // TODO: deep compare selector object?
        const keys = Object.keys(opt.selector);
        for (let i = 0;i < keys.length;i++) {
          if (!Object.prototype.hasOwnproperty.call(data, keys[i])) { return; }
          if (data[keys[i]] !== opt.selector[keys[i]]) { return; }
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
    }

    let indexName = this.name;
    if (opt.orderBy && this.opt.indexes.indexOf(opt.orderBy) > -1) {
      indexName = opt.orderBy;
    }

    // TODO: query from indexes
    this.gun.get(indexName).map().open(matcher); // TODO: limit .open recursion
    if (this.opt.askPeers) {
      this.gun.get(`trustedIndexes`).on((val, key) => {
        this.gun.user(key).get(indexName).map().open(matcher);
      });
    }
  }
}

export default Collection;
