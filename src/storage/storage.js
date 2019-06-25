/**
* Abstract class - instantiate child classes GunStorage or IpfsStorage instead.
*
* Iris does not concern itself with underlying data storage and networking. Instead, the problem can be outsourced to storage adapters.
*
* Since message authenticity is guaranteed by digital signatures, peer-to-peer storage such as GUN or IPFS can be used.
*/
class Storage {
  /**
  * Insert a value for a key.
  */
  put(key, value, callback) {

  }

  /**
  * Callback function receives the current value for a key.
  */
  once(key, callback) {

  }

  /**
  * Callback function receives the current value for a key and subscribes to its future changes. If subscription is not available, works similarly to once().
  */
  on(key, callback) {

  }

  /**
  * Remove the key-value pair.
  */
  delete(key, callback) {

  }

  /**
  * Opts.callback function is called for each key matching the search terms in opts.
  */
  search(options, callback) {

  }
}
