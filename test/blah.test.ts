require("fake-indexeddb/auto");
import iris from '..'; // can we test directly from ../src directory? requires some jest config, but would enable testing without building

/*
process.env.PORT = "8767";
//@ts-ignore
import Gun from 'gun/examples/http';
console.log('Gun', Gun);
 */

describe('iris', () => {
  describe('global', () => {
    it('first put then on', (done) => {
      iris.global().get('profile').get('name').put('Caleb');
      iris.global().get('profile').get('name').on((name: any) => {
        expect(name).toBe('Caleb');
        done();
      });
    });
    it('first on then put', (done) => {
      iris.global().get('profile').get('age').on((age: any) => {
        expect(age).toBe(42);
        done();
      });
      iris.global().get('profile').get('age').put(42);
    });
    it('map & on same keys and values returned', (done) => {
      iris.global().get('numbers').get('pi').put(3.14);
      iris.global().get('numbers').get('e').put(2.71);
      let onResult: any;
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
      iris.global().get('numbers').on((numbers: any) => {
        onResult = numbers;
        checkDone();
      });
      iris.global().get('numbers').map((value: any, key: string) => {
        map.set(key, value);
        checkDone();
      });
      iris.global().get('numbers').get('phi').put(1.618);
    });
  });
});
