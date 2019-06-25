/**
* https://github.com/amark/gun
* @param {Object} options {gun: merkleBtreeInstance}
*/
class GunStorage extends Storage {
  constructor(options) {
    super();
    this.gun = options.gun;
  }

  put(key, value, cb) {
    this.gun.get(key).put(value);
    cb();
  }

  once(key, cb) {
    this.gun.get(key).once(v => cb(v));
  }

  on(key, cb) {
    this.gun.get(key).on(v => cb(v));
  }

  search(o, cb) {
    const seen = {};
    const q = {'-': o.desc};
    if (o.cursor) {
      if (o.desc) {
        q[`<`] = o.cursor;
      } else {
        q[`>`] = o.cursor;
      }
    }
    o.node.get({'.': q, '%': 20 * 1000}).once().map().on((value, key) => {
      if (key.indexOf(o.query) === 0) {
        if (typeof o.limit === `number` && Object.keys(seen).length >= o.limit) {
          return;
        }
        if (seen.hasOwnProperty(key)) {
          return;
        }
        if (value && Object.keys(value).length > 1) {
          seen[key] = true; // TODO: make sure no memory leak?
          cb({value, key});
        }
      }
    });
  }
}
