const identifi = require('../cjs/index.js');
const IPFS = require('ipfs');
const fs = require('fs');

let i, p, h, key, ipfsNode;

jest.setTimeout(30000);

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
  test('create new Index', async () => {
    i = await identifi.Index.create(ipfsNode);
    expect(i).toBeInstanceOf(identifi.Index);
  });
  test('add trust rating to bob', async () => {
    const msg = identifi.Message.createRating({recipient:[['email', 'bob@example.com']], rating:10}, key);
    const r = await i.addMessage(msg);
    expect(typeof r).toEqual('string');
  });
  test('get added identity', async () => {
    p = await i.get('bob@example.com');
    expect(p).toBeInstanceOf(identifi.Identity);
  });
  test('get messages received by bob', async () => {
    const r = await i.getReceivedMsgs(p);
    expect(r.length).toEqual(1);
  });
  test('get messages sent by bob', async () => {
    const r = await i.getSentMsgs(p);
    expect(r.length).toEqual(0);
  });
  test('get messages sent by self', async () => {
    const viewpoint = await i.getViewpoint();
    expect(viewpoint).toBeInstanceOf(identifi.Identity);
    const r = await i.getSentMsgs(viewpoint);
    expect(r.length).toEqual(1);
  });
  test('get viewpoint identity by searching the default keyID', async () => {
    const defaultKey = identifi.util.getDefaultKey();
    p = await i.get(defaultKey.keyID, 'keyID');
    expect(p).toBeInstanceOf(identifi.Identity);
  });
  test('save index', async () => {
    h = await i.save();
    expect(typeof h).toEqual('string');
    expect(h.length).toBeGreaterThan(0);
  });
  test('load saved index', async () => {
    i = await identifi.Index.load(h, ipfsNode);
    expect(i).toBeInstanceOf(identifi.Index);
  });
});

describe('remote index via ipfs gateway', async () => {
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

afterAll(async () => {
  await ipfsNode.stop();
});
