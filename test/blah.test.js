const crypto = require('crypto');

Object.defineProperty(global.self, "crypto", {
  value: {
    subtle: crypto.webcrypto.subtle,
  },
});

const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

// TODO: gun causes unnecessary modules like aws-sdk to be loaded and the tests won't run
require("fake-indexeddb/auto");
const iris = require('../dist/iris.umd.development.js').default; // can we test directly from ../src directory? requires some jest config, but would enable testing without building

/*
process.env.PORT = "8767";
//@ts-ignore
import Gun from 'gun/examples/http';
console.log('Gun', Gun);
 */

describe('iris', () => {
  describe('key', () => {
    it('should generate a key', async () => {
      const key = await iris.Key.generate();
      expect(key).toBeDefined();
    });
    it('should not verify with a bad signature', async () => {
      const key = await iris.Key.generate();
      const signedMsg = 'bad message';
      const notVerified = await iris.Key.verify(signedMsg, key);
      expect(notVerified).toBe(undefined);
    });
    it('should sign and verify', async () => {
      const key = await iris.Key.generate();
      const msg = 'hello';
      const signedMsg = await iris.Key.sign(msg, key);
      console.log('signedMsg', signedMsg);
      const verified = await iris.Key.verify(signedMsg, key);
      expect(verified).toBe(msg);
    });
  });

  describe('global', () => {
    it('first put then on', (done) => {
      iris.global().get('profile').get('name').put('Caleb');
      iris.global().get('profile').get('name').on((name) => {
        expect(name).toBe('Caleb');
        done();
      });
    });
    it('first on then put', (done) => {
      iris.global().get('profile').get('age').on((age) => {
        expect(age).toBe(42);
        done();
      });
      iris.global().get('profile').get('age').put(42);
    });
    it('map & on same keys and values returned', (done) => {
      iris.global().get('numbers').get('pi').put(3.14);
      iris.global().get('numbers').get('e').put(2.71);
      let onResult;
      const map = new Map();
      function checkDone() {
        if (map.size === 3 && onResult && Object.keys(onResult).length === 3) {
          expect(map.get('pi')).toBe(3.14);
          expect(map.get('e')).toBe(2.71);
          expect(map.get('phi')).toBe(1.618);
          expect(onResult.pi).toBe(3.14);
          expect(onResult.e).toBe(2.71);
          expect(onResult.phi).toBe(1.618);
          done();
        }
      }
      iris.global().get('numbers').on((numbers) => {
        onResult = numbers;
        checkDone();
      });
      iris.global().get('numbers').map((value, key) => {
        map.set(key, value);
        checkDone();
      });
      iris.global().get('numbers').get('phi').put(1.618);
    });
  });
});
