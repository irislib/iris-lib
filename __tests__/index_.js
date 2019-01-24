const identifi = require('../cjs/index.js');
const fs = require('fs');
const GUN = require('gun');
const load = require('gun/lib/load');
const then = require('gun/lib/then');
const SEA = require('gun/sea');
//SEA.throw = true;

let key;
//let ipfsNode = new IPFS({repo: './ipfs_repo'});
const gun = new GUN({radisk: false});

jest.setTimeout(15000);

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

/*
beforeAll(() => {
  return new Promise((resolve, reject) => {
    ipfsNode.on('ready', () => {
      console.log('ipfs ready');
      resolve();
    });
    ipfsNode.on('error', error => {
      console.error(error.message);
      reject();
    });
  });
});
*/

describe('local index', async () => {
  let i, h;
  test('create new Index', async () => {
    key = await identifi.Key.getDefault();
    i = await identifi.Index.create(gun);
    expect(i).toBeInstanceOf(identifi.Index);
  });
  let p;
  describe('create and fetch an identity using identifi messages', async () => {
    test('add trust rating to bob', async () => {
      const msg = await identifi.Message.createRating({recipient:[['email', 'bob@example.com']], rating:10}, key);
      const r = await i.addMessage(msg);
      expect(r).toBe(true);
    });
    test('get added identity', async () => {
      p = i.get('bob@example.com');
      const data = await p.gun.once().then();
      //expect(q).toBeInstanceOf(identifi.Identity);
      expect(data.trustDistance).toBe(1);
      expect(data.receivedPositive).toBe(1);
      expect(data.receivedNeutral).toBe(0);
      expect(data.receivedNegative).toBe(0);
    });
    test('get messages received by bob', async () => {
      const results = [];
      i.getReceivedMsgs(p, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(1);
    });
    test('get messages sent by bob', async () => {
      const results = [];
      i.getSentMsgs(p, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(0);
    });
    test('get messages sent by self', async () => {
      const viewpoint = await i.getViewpoint();
      expect(viewpoint).toBeInstanceOf(identifi.Identity);
      const results = [];
      i.getSentMsgs(viewpoint, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(1);
    });
  });
  test('verify first, then rate', async () => {
    let msg = await identifi.Message.createVerification({recipient:[['name', 'Fabio'], ['email', 'fabio@example.com']]}, key);
    let r = await i.addMessage(msg);
    expect(r).toBe(true);
    p = i.get('fabio@example.com');
    let data = await p.gun.once().then();
    expect(data.trustDistance).toBe(99);
    msg = await identifi.Message.createRating({recipient:[['email', 'fabio@example.com']], rating:10}, key);
    r = await i.addMessage(msg);
    p = i.get('fabio@example.com');
    data = await p.gun.once().then();
    expect(data.trustDistance).toBe(1);
  });
  describe('add more identities', async () => {
    test('bob -> carl', async () => {
      let msg = await identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'carl@example.com']], rating:10}, key);
      await i.addMessage(msg);
      msg = await identifi.Message.createRating({author: [['email', 'carl@example.com']], recipient: [['email', 'david@example.com']], rating:10}, key);
      await i.addMessage(msg);
      p = i.get('david@example.com');
      const data = await p.gun.once().then();
      expect(data.trustDistance).toBe(3);
    });
    test('add a collection of messages using addMessages', async () => {
      const msgs = [];
      let msg = await identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'bob1@example.com']], rating:10}, key);
      msgs.push(msg);
      for (let i = 0;i < 4;i++) {
        msg = await identifi.Message.createRating({author: [['email', `bob${i}@example.com`]], recipient: [['email', `bob${i+1}@example.com`]], rating:10}, key);
        msgs.push(msg);
      }
      msg = await identifi.Message.createRating({author: [['email', 'bert@example.com']], recipient: [['email', 'chris@example.com']], rating:10}, key);
      msgs.push(msg);
      await i.addMessages(shuffle(msgs));
      p = i.get('bob4@example.com');
      expect(p).toBeDefined();
      const trustDistance = p.gun.get(`trustDistance`);
      p = await i.get('bert@example.com').gun.then();
      expect(p).toBeUndefined();
      p = await i.get('chris@example.com').gun.then();
      expect(p).toBeUndefined();
    });
  });
  describe ('untrusted key', async () => {
    let u;
    test('should not create new identity', async () => {
      u = await identifi.Key.generate();
      let msg = await identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'angus@example.com']], rating:10}, u);
      await i.addMessage(msg);
      p = await i.get('angus@example.com').gun.then();
      expect(p).toBeUndefined();
    });
    test('should not affect scores', async () => {
      p = i.get('david@example.com');
      const pos = await p.gun.get(`receivedPositive`).once().then();
      let msg = await identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'david@example.com']], rating:10}, u);
      await i.addMessage(msg);
      p = i.get('david@example.com');
      const pos2 = await p.gun.get(`receivedPositive`).once().then();
      expect(pos2).toEqual(pos);
    });
  });
  describe('adding attributes to an identity', async () => {
    let c;
    test('get identity count', async () => {
      const results = [];
      i.search('', null, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      c = results.length;
      expect(results.length).toBeGreaterThan(1);
    });
    test('add name to self identity', async () => {
      let viewpoint = await i.getViewpoint();
      expect(viewpoint).toBeInstanceOf(identifi.Identity);
      const recipient = [['name', 'Alice']];
      await new Promise(resolve => {
        viewpoint.gun.load(r => {
          Object.keys(r.attrs).forEach(key => {
            recipient.push([r.attrs[key].name, r.attrs[key].val]);
          });
          resolve();
        });
      });
      const msg = await identifi.Message.createVerification({recipient}, key);
      const r = await i.addMessage(msg);
      viewpoint = await i.getViewpoint();
      const data = await new Promise(resolve => {
        viewpoint.gun.load(r => {
          resolve(r);
        });
      });
      expect(Object.keys(data.attrs).length).toBe(2);
      expect(data.mostVerifiedAttributes.name.attribute.val).toBe('Alice');
    });
    test('identity count should remain the same', async () => {
      const results = [];
      i.search('', null, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toEqual(c);
    });
    test('there should be only one identity with distance 0', async () => {
      const r = [];
      i.search('', null, result => r.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      
      let viewpoints = 0;
      for (let j = 0; j < r.length; j++) {
        const id = await r[j].gun.then();
        if (id && id.trustDistance === 0) {
          //console.log(r[j]);
          viewpoints++;
        }
      }
      expect(viewpoints).toEqual(1);
    });
  });
  describe('trusted verifier', async () => {
    let verifierKey, verifierKeyID;
    test('create verifier', async () => {
      verifierKey = await identifi.Key.generate();
      verifierKeyID = identifi.Key.getId(verifierKey);
      let msg = await identifi.Message.createRating({recipient: [['keyID', verifierKeyID]], rating:10, context: 'verifier'}, key);
      await i.addMessage(msg);
      const verifier = i.get(verifierKeyID, 'keyID');
      const scores = await new Promise(resolve => {
        verifier.gun.get('scores').load(r => {
          resolve(r);
        });
      });
      expect(scores.verifier.score).toBe(10);
    });
    test('verifier status should not disappear when the identity is changed', async () => {
      msg = await identifi.Message.createRating({recipient: [['keyID', verifierKeyID]], rating:10, context: 'identifi'}, key);
      await i.addMessage(msg);
      let msg = await identifi.Message.createVerification({recipient: [['keyID', verifierKeyID], ['name','VerifyBot'], ['email','VerifyBot@example.com']]}, key);
      await i.addMessage(msg);
      const verifier = i.get(verifierKeyID, 'keyID');
      const scores = await new Promise(resolve => {
        verifier.gun.get('scores').load(r => {
          resolve(r);
        });
      });
      expect(scores.verifier.score).toBe(10);
    });
    test('create trusted verification', async () => {
      let msg = await identifi.Message.createVerification({recipient: [['email', 'david@example.com'], ['name', 'David Attenborough']]}, verifierKey);
      await i.addMessage(msg);
      p = i.get('david@example.com');
      const attrs = await new Promise(resolve => {
        p.gun.get('attrs').load(r => {
          resolve(r);
        });
      });
      Object.keys(attrs).forEach(key => {
        expect(attrs[key].verified).toBe(true);
      });
    });
  });
  describe('trusted indexes', async () => {
    let i2, k2;
    test('create a new index that is linked to the previous', async () => {
      k2 = await identifi.Key.generate();
      const keyID = identifi.Key.getId(k2);
      console.log('keyID', keyID);
      i2 = await identifi.Index.create(gun, k2);
      let m = await identifi.Message.createRating({recipient:[['keyID', 'identifi']], rating: 10}, k2);
      await i2.addMessage(m);
    });
    /*
    test('get identity from linked index', async () => {
      p = i2.get('bob@example.com');
      const data = await p.gun.once().then();
      //expect(q).toBeInstanceOf(identifi.Identity);
      expect(data.trustDistance).toBe(1);
      expect(data.receivedPositive).toBe(1);
      expect(data.receivedNeutral).toBe(0);
      expect(data.receivedNegative).toBe(0);
    });
    */
  });
  test('get viewpoint identity by searching the default keyID', async () => {
    const defaultKey = await identifi.Key.getDefault();
    p = i.get(identifi.Key.getId(defaultKey), 'keyID');
    const data = await p.gun.once().then();
    expect(p).toBeInstanceOf(identifi.Identity);
    expect(data.trustDistance).toBe(0);
    expect(data.sentPositive).toBe(4);
  });
  test('get messages by timestamp', async () => {
    const results = [];
    i.getMessagesByTimestamp(result => results.push(result));
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(results.length).toBeGreaterThan(5);
  });
});

/*
afterAll(() => {
  return ipfsNode.stop();
});
*/
