const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const SEA = require(`gun/sea`);
//SEA.throw = true;

//let ipfsNode = new IPFS({repo: './ipfs_repo'});
const gun = new GUN({radisk: false});

const logger = function()
{
  let oldConsoleLog = null;
  const pub = {};

  pub.enable =  function enable()
  {
    if (oldConsoleLog == null)
      return;

    window[`console`][`log`] = oldConsoleLog;
  };

  pub.disable = function disable()
  {
    oldConsoleLog = console.log;
    window[`console`][`log`] = function() {};
  };

  return pub;
}();

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
}

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

beforeAll(() => {
  logger.disable();
});

describe(`local index`, async () => {
  let i, r, h, key, keyID;
  beforeAll(async () => {
    key = await iris.Key.getDefault();
    keyID = iris.Key.getId(key);
    i = new iris.Index({gun, keypair: key, self: {name: `Alice`}, debug: false});
    r = new iris.Index({gun, pubKey: key.pub, debug: false}); // read-only
    await i.ready;
    await new Promise(r => setTimeout(r, 3000));
  });
  test(`create new Index`, async () => {
    expect(i).toBeInstanceOf(iris.Index);
    expect(r).toBeInstanceOf(iris.Index);
    expect(i.writable).toBe(true);
    expect(r.writable).not.toBe(true);
    const viewpoint = i.getViewpoint();
    expect(viewpoint).toBeInstanceOf(iris.Identity);
    const data = await new Promise(resolve => {
      viewpoint.gun.load(r => {
        resolve(r);
      });
    });
    expect(Object.keys(data.attrs).length).toBe(2);
    expect(data.mostVerifiedAttributes.name.attribute.value).toBe(`Alice`);
  });
  let p;
  describe(`create and fetch an identity using iris messages`, async () => {
    test(`add trust rating to bob`, async () => {
      const msg = await iris.Message.createRating({recipient: {email: `bob@example.com`}, rating: 10}, key);
      h = msg.getHash();
      const r = await i.addMessage(msg);
      expect(r).toBe(true);
    });
    test(`get added msg by hash`, async () => {
      let msg = await i.getMessageByHash(h);
      expect(msg.signedData.recipient.email).toEqual(`bob@example.com`);
      msg = await r.getMessageByHash(h);
      expect(msg.signedData.recipient.email).toEqual(`bob@example.com`);
    });
    test(`get added identity`, async () => {
      p = i.get(`bob@example.com`); // ,true
      const data = await p.gun.once().then();
      //expect(q).toBeInstanceOf(iris.Identity);
      expect(data.trustDistance).toBe(1);
      expect(data.receivedPositive).toBe(1);
      expect(data.receivedNeutral).toBe(0);
      expect(data.receivedNegative).toBe(0);
    });
    test(`get messages received by bob`, async () => {
      const results = [];
      p.received({callback: result => results.push(result)});
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(1);
    });
    test(`get messages sent by bob`, async () => {
      const results = [];
      p.sent({callback: result => results.push(result)});
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(0);
    });
    test(`get messages sent by self`, async () => {
      const viewpoint = i.getViewpoint();
      expect(viewpoint).toBeInstanceOf(iris.Identity);
      const results = [];
      viewpoint.sent({callback: result => results.push(result)});
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBe(2);
    });
  });
  test(`verify first, then rate`, async () => {
    let msg = await iris.Message.createVerification({recipient: {name: `Fabio`, email: `fabio@example.com`}}, key);
    let r = await i.addMessage(msg);
    expect(r).toBe(true);
    p = i.get(`fabio@example.com`);
    let data = await p.gun.once().then();
    expect(data.trustDistance).toBe(false);
    msg = await iris.Message.createRating({recipient: {email: `fabio@example.com`}, rating: 10}, key);
    r = await i.addMessage(msg);
    p = i.get(`fabio@example.com`);
    data = await p.gun.once().then();
    expect(data.trustDistance).toBe(1);
  });
  describe(`add more identities`, async () => {
    test(`bob -> carl`, async () => {
      let msg = await iris.Message.createRating({author: {email: `bob@example.com`}, recipient: {email: `carl@example.com`}, rating: 10}, key);
      await i.addMessage(msg);
      msg = await iris.Message.createRating({author: {email: `carl@example.com`}, recipient: {email: `david@example.com`}, rating: 10}, key);
      await i.addMessage(msg);
      p = i.get(`david@example.com`);
      const data = await p.gun.once().then();
      expect(data.trustDistance).toBe(3);
    });
    test(`add a collection of messages using addMessages`, async () => {
      const msgs = [];
      let msg = await iris.Message.createRating({author: {email: `bob@example.com`}, recipient: {email: `bob1@example.com`}, rating: 10}, key);
      msgs.push(msg);
      for (let i = 0;i < 4;i ++) {
        msg = await iris.Message.createRating({author: {email: `bob${i}@example.com`}, recipient: {email: `bob${i + 1}@example.com`}, rating: 10}, key);
        msgs.push(msg);
      }
      msg = await iris.Message.createRating({author: {email: `bert@example.com`}, recipient: {email: `chris@example.com`}, rating: 10}, key);
      msgs.push(msg);
      await i.addMessages(shuffle(msgs));
      p = i.get(`bob4@example.com`);
      expect(p).toBeDefined();
      p = await i.get(`bert@example.com`).gun.then();
      expect(p).toBeUndefined();
      p = await i.get(`chris@example.com`).gun.then();
      expect(p).toBeUndefined();
    });
  });
  describe(`downvote`, async () => {
    test(`up & down`, async () => {
      let msg = await iris.Message.createRating({recipient: {email: `orwell@example.com`}, rating: 1}, key);
      await i.addMessage(msg);
      p = i.get(`orwell@example.com`);
      let data = await p.gun.once().then();
      expect(data.trustDistance).toBe(1);
      msg = await iris.Message.createRating({recipient: {email: `orwell@example.com`}, rating: - 1}, key);
      await i.addMessage(msg);
      data = await p.gun.once().then();
      expect(data.trustDistance).toBe(false);
    });
  });
  describe (`untrusted key`, async () => {
    let u;
    test(`should not create new identity`, async () => {
      u = await iris.Key.generate();
      const msg = await iris.Message.createRating({author: {email: `bob@example.com`}, recipient: {email: `angus@example.com`}, rating: 10}, u);
      await i.addMessage(msg);
      p = await i.get(`angus@example.com`).gun.then();
      expect(p).toBeUndefined();
    });
    test(`should not affect scores`, async () => {
      p = i.get(`david@example.com`);
      const pos = await p.gun.get(`receivedPositive`).once().then();
      const msg = await iris.Message.createRating({author: {email: `bob@example.com`}, recipient: {email: `david@example.com`}, rating: 10}, u);
      await i.addMessage(msg);
      p = i.get(`david@example.com`);
      const pos2 = await p.gun.get(`receivedPositive`).once().then();
      expect(pos2).toEqual(pos);
    });
  });
  describe(`adding attributes to an identity`, async () => {
    let c;
    test(`get identity count`, async () => {
      let results = [];
      i.search(``, null, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      c = results.length;
      expect(results.length).toBeGreaterThan(1);
      results = [];
      r.search(``, null, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toBeGreaterThan(1);
    });
    test(`add name to Bob`, async () => {
      let bob = await i.get(`bob@example.com`);
      expect(bob).toBeInstanceOf(iris.Identity);
      const msg = await iris.Message.createVerification({recipient: {email: `bob@example.com`, name: `Bob`}}, key);
      await i.addMessage(msg);
      bob = await i.get(`bob@example.com`);
      const data = await new Promise(resolve => {
        bob.gun.load(r => {
          resolve(r);
        });
      });
      expect(Object.keys(data.attrs).length).toBe(2);
      expect(data.mostVerifiedAttributes.name.attribute.value).toBe(`Bob`);
    });
    test(`identity count should remain the same`, async () => {
      const results = [];
      i.search(``, null, result => results.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));
      expect(results.length).toEqual(c);
    });
    test(`there should be only one identity with distance 0`, async () => {
      const r = [];
      i.search(``, null, result => r.push(result));
      await new Promise(resolve => setTimeout(resolve, 200));

      let viewpoints = 0;
      for (let j = 0;j < r.length;j ++) {
        const id = await r[j].gun.then();
        if (id && id.trustDistance === 0) {
          //console.log(r[j]);
          viewpoints ++;
        }
      }
      expect(viewpoints).toEqual(1);
    });
  });
  /* TODO: needs GUN fix
  describe(`paging`, async () => {
    test(`add a lot of messages and retrieve with getMessagesByTimestamp`, async () => {
      const msgs = [];
      for (let i = 0;i < 15;i ++) {
        const msg = await iris.Message.createRating({recipient: {email: `bob${i + 1}@example.com`}, rating: 10}, key);
        msgs.push(msg);
      }
      const firstMsg = msgs[0];
      const lastMsg = msgs[msgs.length - 1];
      await i.addMessages(shuffle(msgs));

      let results = [];
      const limit = 5;
      logger.enable();
      await new Promise(resolve => {
        i.getMessagesByTimestamp(r => {
          results.push(r);
        }, limit);
        if (results.length === limit) {
          resolve();
        }
        setTimeout(resolve, 5000);
      });
      expect(results.length).toBe(limit);
      results.sort((a, b) => {
        if (a.cursor > b.cursor) return -1;
        else if (a.cursor < b.cursor) return 1;
        else return 0;
      });
      expect(results[0].signedData.timestamp).toEqual(lastMsg.signedData.timestamp);
      expect(lastMsg.getHash()).toEqual(results[0].getHash());

      const last = results[results.length - 1];
      results = [];
      await new Promise(resolve => {
        i.getMessagesByTimestamp(r => {
          results.push(r);
        }, limit, last.cursor);
        if (results.length === limit) {
          resolve();
        }
        setTimeout(resolve, 5000);
      });
      results.sort((a, b) => {
        if (a.cursor > b.cursor) return -1;
        else if (a.cursor < b.cursor) return 1;
        else return 0;
      });
      logger.disable();
      expect(results.length).toBe(limit);
    }, 30000);
  });*/
  describe(`trusted verifier`, async () => {
    let verifierKey, verifierKeyID;
    beforeAll(async () => {
      verifierKey = await iris.Key.generate();
      verifierKeyID = iris.Key.getId(verifierKey);
    });
    test(`create verifier`, async () => {
      const msg = await iris.Message.createRating({recipient: {keyID: verifierKeyID}, rating: 10, context: `verifier`}, key);
      await i.addMessage(msg);
      const verifier = i.get(`keyID`, verifierKeyID);
      const scores = await new Promise(resolve => {
        verifier.gun.get(`scores`).load(r => {
          resolve(r);
        });
      });
      expect(scores.verifier.score).toBe(10);
    });
    test(`verifier status should not disappear when the identity is changed`, async () => {
      msg = await iris.Message.createRating({recipient: {keyID: verifierKeyID}, rating: 10, context: `iris`}, key);
      await i.addMessage(msg);
      let msg = await iris.Message.createVerification({recipient: {keyID: verifierKeyID, name: `VerifyBot`, email: `VerifyBot@example.com`}}, key);
      await i.addMessage(msg);
      const verifier = i.get(`keyID`, verifierKeyID);
      const scores = await new Promise(resolve => {
        verifier.gun.get(`scores`).load(r => {
          resolve(r);
        });
      });
      expect(scores.verifier.score).toBe(10);
    });
    test(`create trusted verification`, async () => {
      const msg = await iris.Message.createVerification({recipient: {email: `david@example.com`, name: `David Attenborough`}}, verifierKey);
      await i.addMessage(msg);
      p = i.get(`david@example.com`);
      const attrs = await new Promise(resolve => {
        p.gun.get(`attrs`).load(r => {
          resolve(r);
        });
      });
      Object.keys(attrs).forEach(key => {
        expect(attrs[key].wellVerified).toBe(true);
      });
    });
  });
  describe(`trusted indexes`, async () => {
    test(`create a new index that is linked to the previous`, async () => {
      const k2 = await iris.Key.generate();
      const i2 = new iris.Index({gun, keypair: k2, debug: false});
      await i2.ready;
      let m = await iris.Message.createRating({recipient: {keyID}, rating: 10}, k2);
      await i2.addMessage(m);
      const trustedIndexes = await i2.gun.get(`trustedIndexes`).once();
      expect(trustedIndexes[keyID]).toBe(true);

      m = await iris.Message.create({type: `post`, recipient: {keyID}, comment: `hello world`}, key);
      await i.addMessage(m);
      return; // TODO

      console.log(`looking for message ${m.getHash()}`);
      const m2 = await i2.getMessageByHash(m.getHash());

      expect(typeof m2).toBe(`object`);
      expect(m2.getHash()).toEqual(m.getHash());

      const identity = i2.get(`keyID`, keyID);
      const m3 = await new Promise(resolve => {
        i2.getReceivedMsgs(identity, msg => {
          console.log(`found msg`, msg.getHash(), msg);
          if (msg.getHash() === m.getHash()) {
            resolve(msg);
          }
        });
        setTimeout(() => resolve(), 5000);
      });
      expect(typeof m3).toBe(`object`); // TODO
      expect(m3.getHash()).toEqual(m.getHash());
    });
    /*
    test('get identity from linked index', async () => {
      p = i2.get('bob@example.com');
      const data = await p.gun.once().then();
      //expect(q).toBeInstanceOf(iris.Identity);
      expect(data.trustDistance).toBe(1);
      expect(data.receivedPositive).toBe(1);
      expect(data.receivedNeutral).toBe(0);
      expect(data.receivedNegative).toBe(0);
    });
    */
  });
  test(`get viewpoint identity by searching the default keyID`, async () => {
    const defaultKey = await iris.Key.getDefault();
    p = i.get(`keyID`, iris.Key.getId(defaultKey));
    const data = await p.gun.once().then();
    expect(p).toBeInstanceOf(iris.Identity);
    expect(data.trustDistance).toBe(0);
    expect(data.sentPositive).toBeGreaterThan(4);
  });
  test(`get messages by timestamp`, async () => {
    const k2 = await iris.Key.generate();
    const i2 = new iris.Index({gun, keypair: k2, debug: false});
    await i2.ready;
    for (let i = 0;i < 5;i ++) {
      const m = await iris.Message.createRating({recipient: {uuid: `something`}, rating: 10}, k2);
      await i2.addMessage(m);
    }
    const results = [];
    await new Promise(resolve => {
      setTimeout(resolve, 5000);
      i2.getMessagesByTimestamp(result => {
        console.log(`got result`);
        results.push(result);
        if (results.length > 3) {
          resolve();
        }
      });
    });
    expect(results.length).toBeGreaterThan(3);
  }, 20000);
  /* TODO: disabled because it fails...
  test('like & unlike', async () => {
    let msg = await iris.Message.create({type: 'post', recipient: {email:'bob@example.com'}, comment: 'I don\'t want to set the world on fire. I just want to start a flame in your heart.'}, key);
    const added = await i.addMessage(msg);
    expect(added).toBe(true);
    i.setReaction(msg, 'like');
    const shit = await i.gun.get('messagesByHash').then();
    let msgReactions = await i.gun.get('messagesByHash').get(msg.getHash()).get('reactions').then();
    let myReaction = await i.gun.get('reactions').get(msg.getHash()).then();
    expect(Object.keys(msgReactions).length).toBe(1);
    expect(msgReactions[i.viewpoint.value]).toBe('like');
    expect(myReaction).toBe('like');
    i.setReaction(msg, null);
    msgReactions = await i.gun.get('messagesByHash').get(msg.getHash()).get('reactions').once().then();
    myReaction = await i.gun.get('reactions').get(msg.getHash()).once().then();
    expect(Object.keys(msgReactions).length).toBe(1);
    expect(myReaction).toBe(null);
    expect(msgReactions[i.viewpoint.value]).toBe(null);
  });*/
});

afterAll(() => {
  logger.enable();
  //return ipfsNode.stop();
});
