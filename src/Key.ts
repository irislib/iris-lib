/*eslint no-useless-escape: "off", camelcase: "off" */

import util from './util';
// eslint-disable-line no-unused-vars

let myKey: any;

export default {
  async getActiveKey(datadir = `.`, keyfile = `iris.key`, fs?: any) {
    if (myKey) {
      return myKey;
    }
    if (fs) {
      const privKeyFile = `${datadir}/${keyfile}`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        myKey = this.fromString(f);
      } else {
        const newKey = await this.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        fs.writeFileSync(privKeyFile, this.toString(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check ${datadir}/${keyfile}`);
      }
    } else {
      const str = window.localStorage.getItem(`iris.myKey`);
      if (str) {
        myKey = this.fromString(str);
      } else {
        const newKey = await this.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        window.localStorage.setItem(`iris.myKey`, this.toString(myKey));
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check localStorage iris.myKey`);
      }
    }
    return myKey;
  },

  getDefault(datadir = `.`, keyfile = `iris.key`) {
    return this.getActiveKey(datadir, keyfile);
  },

  async getActivePub(datadir = `.`, keyfile = `iris.key`) {
    const key = await this.getActiveKey(datadir, keyfile);
    return key.pub;
  },

  setActiveKey(key: any, save = true, datadir = `.`, keyfile = `iris.key`, fs: any) {
    myKey = key;
    if (!save) return;
    if (util.isNode) {
      const privKeyFile = `${datadir}/${keyfile}`;
      fs.writeFileSync(privKeyFile, this.toString(myKey));
      fs.chmodSync(privKeyFile, 400);
    } else {
      window.localStorage.setItem(`iris.myKey`, this.toString(myKey));
    }
  },

  toString(key: any) {
    return JSON.stringify(key);
  },

  getId(key: any) {
    if (!(key && key.pub)) {
      throw new Error(`missing param`);
    }
    return key.pub; // hack until GUN supports lookups by keyID
    //return util.getHash(key.pub);
  },

  fromString(str: string) {
    return JSON.parse(str);
  },

  // copied from Gun.SEA
  async generate() {
    try {
      var ecdhSubtle = window.crypto.subtle;
      // First: ECDSA keys for signing/verifying...
      var sa = await ecdhSubtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, ['sign', 'verify'])
        .then(async (keys) => {
          // privateKey scope doesn't leak out from here!
          //const { d: priv } = await shim.subtle.exportKey('jwk', keys.privateKey)
          var key: any = {};
          key.priv = (await ecdhSubtle.exportKey('jwk', keys.privateKey)).d;
          var pub = await ecdhSubtle.exportKey('jwk', keys.publicKey);
          //const pub = Buff.from([ x, y ].join(':')).toString('base64') // old
          key.pub = pub.x + '.' + pub.y; // new
          // x and y are already base64
          // pub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
          // but split on a non-base64 letter.
          return key;
        })

      // To include PGPv4 kind of keyId:
      // const pubId = await SEA.keyid(keys.pub)
      // Next: ECDH keys for encryption/decryption...

      try {
        var dh = await ecdhSubtle.generateKey({name: 'ECDH', namedCurve: 'P-256'}, true, ['deriveKey'])
          .then(async (keys) => {
            // privateKey scope doesn't leak out from here!
            var key: any = {};
            key.epriv = (await ecdhSubtle.exportKey('jwk', keys.privateKey)).d;
            var pub = await ecdhSubtle.exportKey('jwk', keys.publicKey);
            //const epub = Buff.from([ ex, ey ].join(':')).toString('base64') // old
            key.epub = pub.x + '.' + pub.y; // new
            // ex and ey are already base64
            // epub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
            // but split on a non-base64 letter.
            return key;
          })
      } catch (e) {
        if (e == 'Error: ECDH is not a supported algorithm') {
          console.log('Ignoring ECDH...')
        } else {
          throw e
        }
      }
      dh = dh || {};

      var r = {pub: sa.pub, priv: sa.priv, /* pubId, */ epub: dh.epub, epriv: dh.epriv}
      return r;
    } catch (e) {
      console.log(e);
      throw e;
      return;
    }
  },

  keyToJwk(key: any): JsonWebKey {
    if (typeof key === 'string') {
      key = { pub: key };
    }
    const jwk: JsonWebKey = {
      kty: 'EC',
      crv: 'P-256',
      x: key.pub.split('.')[0],
      y: key.pub.split('.')[1],
      ext: true,
    };
    jwk.key_ops = key.priv ? ['sign'] : ['verify'];
    if (key.priv) {
      jwk.d = key.priv
    }
    return jwk;
  },

  async sign(data: any, pair: any, cb?: Function, opt: any = {}) {
    if(undefined === data){ throw '`undefined` not allowed.' }
    const text = JSON.stringify(data);
    var jwk = this.keyToJwk(pair);
    var hash = await util.getHash(text, 'buffer') as Buffer;
    var sig = await window.crypto.subtle.importKey('jwk', jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign'])
    .then((key) =>
      window.crypto.subtle.sign({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, hash)
    ) // privateKey scope doesn't leak out from here!
    var r: any = {m: text, s: Buffer.from(sig).toString(opt.encode || 'base64')}
    if(!opt.raw){ r = 'aSEA' + JSON.stringify(r) }

    if(cb){ try{ cb(r) }catch(e){console.log(e)} }
    return r;
  },

  async verify(data: any, pair: any, cb?: Function, opt: any = {}) {
    try {
      if (typeof data === 'string') {
        if (data.slice(0, 4) === 'aSEA') {
          data = JSON.parse(data.slice(4));
        } else {
          data = JSON.parse(data);
        }
      }
      var pub = pair.pub || pair;
      var jwk = this.keyToJwk(pub);
      var key = await crypto.subtle.importKey('jwk', jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);

      var text = (typeof data.m === 'string')? data.m : JSON.stringify(data.m);
      let hash = await util.getHash(text, 'buffer') as Buffer;
      var buf, sig, isValid;
      buf = Buffer.from(data.s, opt.encode || 'base64');
      sig = new Uint8Array(buf);
      isValid = await crypto.subtle.verify({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, sig, hash);
      var r = isValid? JSON.parse(data.m) : undefined;
      if (r === undefined) {
        //console.log('invalid', data, pair, hash);
      }

      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch (e) {
      console.log(e);
      return undefined;
    }
  },

  async secret(key: any, pair: any) {
    var keysToEcdhJwk = (pub: any, d?: any): any => { // d === priv
      //var [ x, y ] = shim.Buffer.from(pub, 'base64').toString('utf8').split(':') // old
      var [ x, y ] = pub.split('.') // new
      const jwk: JsonWebKey = Object.assign(
        d ? { d } : {},
        { x: x, y: y, kty: 'EC', crv: 'P-256', ext: true }
      );
      return jwk;
    }

    var pub = key.epub || key;
    var epub = pair.epub;
    var epriv = pair.epriv;
    var pubJwk = keysToEcdhJwk(pub);
    var props = Object.assign({
      public: await crypto.subtle.importKey('jwk', pubJwk, {name: 'ECDH', namedCurve: 'P-256'}, true, [])
    },{name: 'ECDH', namedCurve: 'P-256'});
    var privJwk = keysToEcdhJwk(epub, epriv);
    return crypto.subtle.importKey('jwk', privJwk, {name: 'ECDH', namedCurve: 'P-256'}, false, ['deriveBits'])
    .then(async (privKey) => {
      var derivedBits = await crypto.subtle.deriveBits(props, privKey, 256);
      var rawBits = new Uint8Array(derivedBits);
      var derivedKey = await crypto.subtle.importKey('raw', rawBits,{ name: 'AES-GCM', length: 256 }, true, [ 'encrypt', 'decrypt' ]);
      return crypto.subtle.exportKey('jwk', derivedKey).then(({ k }) => k);
    });
  },

  async aeskey(key: any, salt?: Buffer) {
    const combo = key + (salt || this.random(8)).toString('utf8'); // new
    let hash: any = await crypto.subtle.digest({name: 'SHA-256'}, new TextEncoder().encode(combo));
    hash = Buffer.from(hash, 'binary');

    const keyB64 = hash.toString('base64');
    const k = keyB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');

    const jwkKey = { kty: 'oct', k: k, ext: false, alg: 'A256GCM' };
    return await crypto.subtle.importKey('jwk', jwkKey, {name:'AES-GCM'}, false, ['encrypt', 'decrypt'])
  },

  random(len: number) {
    return Buffer.from(crypto.getRandomValues(new Uint8Array(len)));
  },

  async encrypt(data: any, pair: any, cb?: Function, opt: any = {}) {
    var key = pair.epriv || pair;
    if(undefined === data){ throw '`undefined` not allowed.' }
    var msg = (typeof data == 'string')? data : JSON.stringify(data);
    var rand = {s: this.random(9), iv: this.random(15)}; // consider making this 9 and 15 or 18 or 12 to reduce == padding.
    var ct = await this.aeskey(key, rand.s).then((aes) => crypto.subtle.encrypt({ // Keeping the AES key scope as private as possible...
      name: opt.name || 'AES-GCM', iv: new Uint8Array(rand.iv)
    }, aes, new TextEncoder().encode(msg)));
    var r: any = {
      // @ts-ignore
      ct: Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
      iv: rand.iv.toString(opt.encode || 'base64'),
      s: rand.s.toString(opt.encode || 'base64')
    }
    if(!opt.raw){ r = 'SEA' + JSON.stringify(r) }

    if(cb){ try{ cb(r) }catch(e){console.log(e)} }
    return r;
  },

  async decrypt(data: any, pair: any, cb?: Function, opt: any = {}) {
    var key = pair.epriv || pair;
    let json;
    try { data = JSON.parse(data); } catch (e) {}
    if (data.indexOf('SEA{') === 0) {
      json = JSON.parse(data.slice(3));
    } else {
      json = JSON.parse(data);
    }
    if (!json.ct || !json.iv || !json.s) {
      throw 'Invalid ciphertext ' + json;
    }
    var buf: Buffer, bufiv: Buffer, bufct: Buffer;
    buf = Buffer.from(json.s, opt.encode || 'base64');
    bufiv = Buffer.from(json.iv, opt.encode || 'base64');
    bufct = Buffer.from(json.ct, opt.encode || 'base64');
    var ct = await this.aeskey(key, buf).then((aes) => crypto.subtle.decrypt({  // Keeping aesKey scope as private as possible...
      name: opt.name || 'AES-GCM', iv: new Uint8Array(bufiv), tagLength: 128
    }, aes, new Uint8Array(bufct)));
    const text = new TextDecoder('utf8').decode(ct);
    var r = text;
    try { r = JSON.parse(text); } catch (_e) {}
    if(cb){ try{ cb(r) }catch(e){console.log(e)} }
    return r;
  }
}