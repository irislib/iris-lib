/*eslint no-useless-escape: "off", camelcase: "off" */

import util from './util';
// eslint-disable-line no-unused-vars

let myKey: any;

class Key {
  static async getActiveKey(datadir = `.`, keyfile = `iris.key`, fs?: any) {
    if (myKey) {
      return myKey;
    }
    if (fs) {
      const privKeyFile = `${datadir}/${keyfile}`;
      if (fs.existsSync(privKeyFile)) {
        const f = fs.readFileSync(privKeyFile, `utf8`);
        myKey = Key.fromString(f);
      } else {
        const newKey = await Key.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        fs.writeFileSync(privKeyFile, Key.toString(myKey));
        fs.chmodSync(privKeyFile, 400);
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check ${datadir}/${keyfile}`);
      }
    } else {
      const str = window.localStorage.getItem(`iris.myKey`);
      if (str) {
        myKey = Key.fromString(str);
      } else {
        const newKey = await Key.generate();
        myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
        window.localStorage.setItem(`iris.myKey`, Key.toString(myKey));
      }
      if (!myKey) {
        throw new Error(`loading default key failed - check localStorage iris.myKey`);
      }
    }
    return myKey;
  }

  static getDefault(datadir = `.`, keyfile = `iris.key`) {
    return Key.getActiveKey(datadir, keyfile);
  }

  static async getActivePub(datadir = `.`, keyfile = `iris.key`) {
    const key = await Key.getActiveKey(datadir, keyfile);
    return key.pub;
  }

  static setActiveKey(key: any, save = true, datadir = `.`, keyfile = `iris.key`, fs: any) {
    myKey = key;
    if (!save) return;
    if (util.isNode) {
      const privKeyFile = `${datadir}/${keyfile}`;
      fs.writeFileSync(privKeyFile, Key.toString(myKey));
      fs.chmodSync(privKeyFile, 400);
    } else {
      window.localStorage.setItem(`iris.myKey`, Key.toString(myKey));
    }
  }

  static toString(key: any) {
    return JSON.stringify(key);
  }

  static getId(key: any) {
    if (!(key && key.pub)) {
      throw new Error(`missing param`);
    }
    return key.pub; // hack until GUN supports lookups by keyID
    //return util.getHash(key.pub);
  }

  static fromString(str: string) {
    return JSON.parse(str);
  }

  // copied from Gun.SEA
  static async generate() {
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
  }

  static async sign(_data: any, _pair: any, _cb?: Function, _opt = {}) {
  /*
    try {
      if(undefined === data){ throw '`undefined` not allowed.' }
      var json = await JSON.parse(data);
      var pub = pair.pub;
      var priv = pair.priv;
      var jwk = S.jwk(pub, priv);
      var hash = await sha(json);
      var sig = await window.crypto.subtle.importKey('jwk', jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign'])
      .then((key) => window.crypto.subtle.sign({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, new Uint8Array(hash))) // privateKey scope doesn't leak out from here!
      var r = {m: json, s: shim.Buffer.from(sig, 'binary').toString(opt.encode || 'base64')}
      if(!opt.raw){ r = 'SEA' + await shim.stringify(r) }

      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch(e) {
      console.log(e);
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }     */
    return `asdf{"m":${JSON.stringify(_data)},"s":"asdf"}`;
  }

  static async secret(_pub: any, _pair: any) {
    return 'asdf';
    /*
    // ecdh secret

    pub = pub.split('.');
    const x = pub[0], y = pub[1];
    const jwk: any = {kty: "EC", crv: "P-256", x: x, y: y, ext: true};
    jwk.key_ops = pair.epriv ? ['sign'] : ['verify'];
    if(pair.epriv){ jwk.d = pair.epriv; }

    try {
      var secret = await window.crypto.subtle.importKey('jwk', jwk, {name: 'ECDH', namedCurve: 'P-256'}, false, ['deriveKey'])
        .then((key) => window.crypto.subtle.deriveKey({name: 'ECDH', public: key}, pair.priv, {name: 'AES-GCM', length: 256}, false, ['encrypt', 'decrypt']))
      var r = await window.crypto.subtle.exportKey('raw', secret);
      return r;
    } catch(e) {
      throw(e);
    }

     */
  }

  static async encrypt(_data: any, _pair: any, _cb?: Function, _opt = {}) {
    /*
    try {
      opt = opt || {};
      var key = (pair||opt).epriv || pair;
      if(u === data){ throw '`undefined` not allowed.' }
      if(!key){
        if(!SEA.I){ throw 'No encryption key.' }
        pair = await SEA.I(null, {what: data, how: 'encrypt', why: opt.why});
        key = pair.epriv || pair;
      }
      var msg = (typeof data == 'string')? data : await shim.stringify(data);
      var rand = {s: shim.random(9), iv: shim.random(15)}; // consider making this 9 and 15 or 18 or 12 to reduce == padding.
      var ct = await aeskey(key, rand.s, opt).then((aes) => (shim.subtle).encrypt({ // Keeping the AES key scope as private as possible...
        name: opt.name || 'AES-GCM', iv: new Uint8Array(rand.iv)
      }, aes, new shim.TextEncoder().encode(msg)));
      var r = {
        ct: shim.Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
        iv: rand.iv.toString(opt.encode || 'base64'),
        s: rand.s.toString(opt.encode || 'base64')
      }
      if(!opt.raw){ r = 'SEA' + await shim.stringify(r) }

      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch(e) {
      console.log(e);
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }
    */
    return '';
  }

  static async decrypt(_data: any, _pair: any, _cb?: Function, _opt = {}) {
    return 'asdf';
    /*
    try {
      opt = opt || {};
      var key = (pair||opt).epriv || pair;
      if(!key){
        if(!SEA.I){ throw 'No decryption key.' }
        pair = await SEA.I(null, {what: data, how: 'decrypt', why: opt.why});
        key = pair.epriv || pair;
      }
      var json = await S.parse(data);
      var buf, bufiv, bufct; try{
        buf = shim.Buffer.from(json.s, opt.encode || 'base64');
        bufiv = shim.Buffer.from(json.iv, opt.encode || 'base64');
        bufct = shim.Buffer.from(json.ct, opt.encode || 'base64');
        var ct = await aeskey(key, buf, opt).then((aes) => (shim.subtle).decrypt({  // Keeping aesKey scope as private as possible...
          name: opt.name || 'AES-GCM', iv: new Uint8Array(bufiv), tagLength: 128
        }, aes, new Uint8Array(bufct)));
      }catch(e){
        if('utf8' === opt.encode){ throw "Could not decrypt" }
        if(SEA.opt.fallback){
          opt.encode = 'utf8';
          return await SEA.decrypt(data, pair, cb, opt);
        }
      }
      var r = await S.parse(new shim.TextDecoder('utf8').decode(ct));
      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch(e) {
      console.log(e);
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }
    */
  }

  static verify(_msg: any, _pubKey: any) {
    return true;
    /*

    (data, pair, cb, opt) => { try {
      var json = await S.parse(data);
      if(false === pair){ // don't verify!
        var raw = await S.parse(json.m);
        if(cb){ try{ cb(raw) }catch(e){console.log(e)} }
        return raw;
      }
      opt = opt || {};
      // SEA.I // verify is free! Requires no user permission.
      var pub = pair.pub || pair;
      var key = SEA.opt.slow_leak? await SEA.opt.slow_leak(pub) : await (shim.ossl || shim.subtle).importKey('jwk', S.jwk(pub), {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);
      var hash = await sha(json.m);
      var buf, sig, check, tmp; try{
        buf = shim.Buffer.from(json.s, opt.encode || 'base64'); // NEW DEFAULT!
        sig = new Uint8Array(buf);
        check = await (shim.ossl || shim.subtle).verify({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, sig, new Uint8Array(hash));
        if(!check){ throw "Signature did not match." }
      }catch(e){
        if(SEA.opt.fallback){
          return await SEA.opt.fall_verify(data, pair, cb, opt);
        }
      }
      var r = check? await S.parse(json.m) : u;

      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch(e) {
      console.log(e); // mismatched owner FOR MARTTI
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }}

     */
  }
}

export default Key;
