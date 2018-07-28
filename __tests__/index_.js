const identifi = require('../cjs/index.js');
const IPFS = require('ipfs');
const fs = require('fs');

let key, ipfsNode;

jest.setTimeout(30000);

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

beforeAll(async () => {
  key = identifi.util.getDefaultKey();
  ipfsNode = new IPFS({repo: './ipfs_repo'});
  await new Promise((resolve, reject) => {
    ipfsNode.on('ready', () => {
      console.log('ipfs ready');
      resolve();
    });
    ipfsNode.on('error', error => {
      console.error(error.message);
      reject();
    });
  });
  return true;
});

describe('local index', async () => {
  let i, h;
  test('create new Index', async () => {
    i = await identifi.Index.create(ipfsNode);
    expect(i).toBeInstanceOf(identifi.Index);
  });
  let p;
  describe('create and fetch an identity using identifi messages', async () => {
    test('add trust rating to bob', async () => {
      const msg = identifi.Message.createRating({recipient:[['email', 'bob@example.com']], rating:10}, key);
      const r = await i.addMessage(msg);
      expect(typeof r).toBe('string');
    });
    test('get added identity', async () => {
      p = await i.get('bob@example.com');
      expect(p).toBeInstanceOf(identifi.Identity);
      expect(p.data.trustDistance).toBe(1);
      expect(p.data.receivedPositive).toBe(1);
      expect(p.data.receivedNeutral).toBe(0);
      expect(p.data.receivedNegative).toBe(0);
    });
    test('get messages received by bob', async () => {
      const r = await i.getReceivedMsgs(p);
      expect(r.length).toBe(1);
    });
    test('get messages sent by bob', async () => {
      const r = await i.getSentMsgs(p);
      expect(r.length).toBe(0);
    });
    test('get messages sent by self', async () => {
      const viewpoint = await i.getViewpoint();
      expect(viewpoint).toBeInstanceOf(identifi.Identity);
      const r = await i.getSentMsgs(viewpoint);
      expect(r.length).toBe(1);
    });
  });
  describe('add more identities', async () => {
    test('bob -> carl', async () => {
      let msg = identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'carl@example.com']], rating:10}, key);
      await i.addMessage(msg);
      msg = identifi.Message.createRating({author: [['email', 'carl@example.com']], recipient: [['email', 'david@example.com']], rating:10}, key);
      await i.addMessage(msg);
      p = await i.get('david@example.com');
      expect(p.data.trustDistance).toBe(3);
    });
    test('add a collection of messages using addMessages', async () => {
      const msgs = [];
      let msg = identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'bob1@example.com']], rating:10}, key);
      msgs.push(msg);
      for (let i = 0;i < 4;i++) {
        msg = identifi.Message.createRating({author: [['email', `bob${i}@example.com`]], recipient: [['email', `bob${i+1}@example.com`]], rating:10}, key);
        msgs.push(msg);
      }
      msg = identifi.Message.createRating({author: [['email', 'bert@example.com']], recipient: [['email', 'chris@example.com']], rating:10}, key);
      msgs.push(msg);
      await i.addMessages(shuffle(msgs));
      p = await i.get('bob4@example.com');
      expect(p).toBeDefined();
      expect(p.data.trustDistance).toBe(5);
      p = await i.get('bert@example.com');
      expect(p).toBeUndefined();
      p = await i.get('chris@example.com');
      expect(p).toBeUndefined();
    });
  });
  describe ('untrusted key', async () => {
    const u = identifi.util.generateKey();
    test('should not create new identity', async () => {
      let msg = identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'angus@example.com']], rating:10}, u);
      await i.addMessage(msg);
      p = await i.get('angus@example.com');
      expect(p).toBeUndefined();
    });
    test('should not affect scores', async () => {
      p = await i.get('david@example.com');
      const pos = p.data.receivedPositive;
      let msg = identifi.Message.createRating({author: [['email', 'bob@example.com']], recipient: [['email', 'david@example.com']], rating:10}, u);
      await i.addMessage(msg);
      p = await i.get('david@example.com');
      expect(p.data.receivedPositive).toEqual(pos);
    });
  });
  describe('adding attributes to an identity', async () => {
    let c;
    test('get identity count', async () => {
      const r = await i.search('');
      c = r.length;
      expect(r.length).toBeGreaterThan(1);
    });
    test('add name to self identity', async () => {
      let viewpoint = await i.getViewpoint();
      expect(viewpoint).toBeInstanceOf(identifi.Identity);
      const recipient = [['name', 'Alice']];
      viewpoint.data.attrs.forEach(a => {
        recipient.push([a.name, a.val]);
      });
      const msg = identifi.Message.createVerification({recipient}, key);
      const r = await i.addMessage(msg);
      viewpoint = await i.getViewpoint();
      expect(viewpoint.data.attrs.length).toBe(2);
      expect(viewpoint.mostVerifiedAttributes.name.attribute.val).toBe('Alice');
    });
    test('identity count should remain the same', async () => {
      const r = await i.search('');
      expect(r.length).toEqual(c);
    });
  });
  test('get viewpoint identity by searching the default keyID', async () => {
    const defaultKey = identifi.util.getDefaultKey();
    p = await i.get(defaultKey.keyID, 'keyID');
    expect(p).toBeInstanceOf(identifi.Identity);
    expect(p.data.trustDistance).toBe(0);
    expect(p.data.sentPositive).toBe(1);
  });
  describe('save & load', async () => {
    test('save index', async () => {
      h = await i.save();
      expect(typeof h).toBe('string');
      expect(h.length).toBeGreaterThan(0);
    });
    test('load saved index', async () => {
      i = await identifi.Index.load(h, ipfsNode);
      expect(i).toBeInstanceOf(identifi.Index);
    });
  });
});

/*
describe('remote index via ipfs gateway', async () => {
  let i, p;
  test('load default Index from default remote', async () => {
    i = await identifi.Index.load();
    expect(i).toBeInstanceOf(identifi.Index);
  });
  test('initialize index and get identity', async () => {
    p = await i.get('martti@moni.com');
    expect(p).toBeInstanceOf(identifi.Identity);
  });
  test('get a verified attribute', async () => {
    const r = await p.verified('name');
    expect(typeof r).toBe('string');
    expect(r.length).toBeGreaterThan(0);
  });
  test('get messages sent by identity', async () => {
    const r = await i.getSentMsgs(p);
    expect(r).toBeInstanceOf(Array);
    expect(r.length).toBeGreaterThan(0);
    expect(r[0]).toBeInstanceOf(identifi.Message);
  });
  test('get messages received by identity', async () => {
    const r = await i.getReceivedMsgs(p);
    expect(r).toBeInstanceOf(Array);
    expect(r.length).toBeGreaterThan(0);
    expect(r[0]).toBeInstanceOf(identifi.Message);
  });
  test('search identities', async () => {
    const r = await i.search('ma');
    expect(typeof r).toBe('object');
    expect(r.length).toBeGreaterThan(1);
  });
  test('search identities "a"', async () => {
    const r = await i.search('a');
    expect(typeof r).toBe('object');
    expect(r.length).toBeGreaterThan(1);
  });
  test('publish message', async () => {
    const m = identifi.Message.createVerification({
      author: [['name', 'Alice'], ['email', 'alice@example.com']],
      recipient: [['name', 'Bob Marley'], ['email', 'bob@example.com']]
    });
    const key = identifi.util.generateKey();
    m.sign(key);
    m.verify(m);
    const r = await i.publishMessage(m);
    expect(typeof r).toBe('object');
    expect(r.hash).toBeDefined();
  });
});
*/

afterAll(async () => {
  await ipfsNode.stop();
});
