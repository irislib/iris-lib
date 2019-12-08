const iris = require(`index.js`);
const util = iris.util;
const Gun = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const radix = require(`gun/lib/radix`); // Require before instantiating Gun, if running in jsdom mode
const SEA = require(`gun/sea`);
//SEA.throw = true;

const waitForValue = function(gunNode, timeout = 100) {
  let value;
  gunNode.on(r => value = r);
  return new Promise(resolve => {
    setTimeout(() => { resolve(value); }, timeout);
  });
}

function timedCallbackPromise(target = 1, timeout = 300, validator = undefined) {
  const meta = {
    count: 0,
    resolve: null,
    reject: null,
  };

  if (target < 0) { throw 'Invalid target value?'; }

  const promise = new Promise((resolve, reject) => {
    meta.resolve = resolve;
    meta.reject = reject;

    setTimeout(() => {
      if (target > 0) {
        reject(`TIMEOUT after going past ${timeout}ms, calls recorded: ${meta.count} / ${target}.`);
        return;
      }
      // Special case: resolveAt <= 0 means that we resolve on timeout if NO calls are made, otherwise reject
      resolve(0);
    }, timeout);
  });

  // Expose for external reference, but don't allow change of values
  promise.target = target;
  promise.timeout = timeout;

  // For debugging purposes
  promise.meta = meta;

  // Call counter, with possible call validation support
  promise.callback = data => {
    if (validator && !validator(data)) { return; }
    //console.log(`Called for ${timeout}ms: ${meta.count} / ${target}.`);
    if (target > 0) {
      if (++meta.count === target) {
        meta.resolve(meta.count);
      }
    } else {
      meta.reject(`UNEXPECTED CALLBACK, invoked within the ${timeout}ms time frame!`);
    }
  };
  return promise;
}

jest.setTimeout(15000);
const nets = new util.GunNets();

afterAll(() => {
  console.log('Closing GunNets.');
  return nets.close();
});

describe(`Multinode connections`, async() => {
  test(`TimedCallbackPromise does what it is meant to do`, async () => {
    const p1 = timedCallbackPromise(1, 1000);
    const p3 = timedCallbackPromise(3, 500);
    const p0y = timedCallbackPromise(0, 100); // Not triggered before @timeout -> resolve(); no effect, if called too late
    const p0n = timedCallbackPromise(0, 200); // Triggered before @timeout -> reject()s automatically
    const timeout = timedCallbackPromise(1, 500);

    // In jest, if any promise rejection is triggered without being caught at that moment, it fails the entire test.
    // Thus, we need to define expect() clauses first, before actually setting up the calls (particularly the p0n one).
    const expectations = [
      expect(p1).resolves.toBe(1),
      expect(p3).resolves.toBe(3),  // Triggered once, at 3, not incremented further
      expect(p0y).resolves.toBe(0),

      // Anticipated rejections
      expect(timeout).rejects.toMatch('TIMEOUT'),
      expect(p0n).rejects.toMatch('UNEXPECTED'),
    ]

    // Time/trigger calls
    setTimeout(p1.callback, 50);
    setTimeout(p3.callback, 40);
    setTimeout(p3.callback, 70);
    setTimeout(p0n.callback, 100);  // Too early -> Fail
    setTimeout(p3.callback, 120);
    setTimeout(p3.callback, 130);  // One too many -> more than @resolveAt calls do nothing
    setTimeout(p0y.callback, 150);  // After timeout -> OK
    setTimeout(timeout.callback, 550);  // Too late -> Fail

    await Promise.all(expectations);
  });

  test(`GunNets functional / basic syncing`, async () => {
    // Create Gun node groups:
    // A
    // B <- C
    // D <- E,F
    let A, B, C, D, E, F;

    [A] = nets.spawnNodes(1);
    [B, C] = nets.spawnNodes(2);
    [D, E, F] = nets.spawnNodes(3);

    const TEST_ROOT = 'iris-multinode-tests';

    console.log('Gun networks created:\n' + nets.describe());

    [[A, 'A'], [B, 'B'], [C, 'C'], [D, 'D'], [E, 'E'], [F, 'F']].forEach(([node, name]) => node.name = name);

    expect(A.netId).toBeDefined();
    expect(B.netId).toBeDefined();
    expect(C.netId).toBeDefined();

    expect(C.netId).toBe(B.netId);
    expect(C.netId).not.toBe(A.netId);
    expect(C.netId).not.toBe(D.netId);

    // Init Iris indexes on one node on each net
    await Promise.all([A, B, C, D, E, F].map(gun => {
      const index = new iris.SocialNetwork({gun: gun});
      return index.ready.then(() => {
        console.log(`Node index ready: ${gun.name}:${gun.netPort}`);
        const name = gun.name;
        const port = gun.netPort;
        gun.index = index;
        // A, D triggered
      });
    }));

    // Try adding something to all nets, then see if propagation works as expected
    const vpa = A.index.getViewpoint();
    const vpb = B.index.getViewpoint();
    const vpd = D.index.getViewpoint();
    const vpe = E.index.getViewpoint();
    const vpf = F.index.getViewpoint();

    /*[A,B,C,D,E,F].map(gun => {
      console.log(gun.name, gun._.opt.peers, gun._.stats.peers);
    })*/
    /*
    function readWriteTest(gun1, gun2, key, value, timeout=3000, writeAcks=1) {
      const counter = timedCallbackPromise(writeAcks, timeout, ack => !ack.err);
      const ex = expect(counter).resolves.toBe(writeAcks);
      const p1 = gun1.get(TEST_ROOT).get(key).put(value, r => counter.callback(r) || r).then();
      const p2 = gun2.get(TEST_ROOT).get(key).get(value).once().then();
      return Promise.all([
        ex,
        expect(p1).resolves.toBeDefined(),
        expect(p2).resolves.toBe(value),
      ]);
    }
    await readWriteTest(C, B, 'xyz', 'zyx');
    */


    // Minimal put->get tests. Single instance:
    await A.get(TEST_ROOT).put({'t1': 't1'}, r => console.log('RESULT?', r) || r).then();
    await expect(A.get(TEST_ROOT).get('t1').once().then()).resolves.toBe('t1');

    // B and C connected:
    await B.get(TEST_ROOT).put({'t2': 't2'}, r => console.log('RESULT?', r) || r).then();
    await expect(C.get(TEST_ROOT).get('t2').once().then()).resolves.toBe('t2');

    // E, F connected to D
    await E.get(TEST_ROOT).put({'E1': 'E1'}, r => console.log('RESULT?', r) || r).then();
    await expect(D.get(TEST_ROOT).get('E1').once().then()).resolves.toBe('E1');
    await expect(F.get(TEST_ROOT).get('E1').once().then()).resolves.toBe('E1');


    /*
    await Promise.all([
      {acks: 1, gun: A},
      // B and C form one net
      {acks: 2, gun: B},
      // E and F both peer with D
      {acks: 3, gun: D},
      {acks: 2, gun: E},
      {acks: 2, gun: F},
    ].map(p => {
      //const action = p.gun.get(TEST_ROOT).put({[p.gun.name]: p.gun.name + '-value'}, ack => {
      const counter = timedCallbackPromise(p.acks, 3000, ack => !ack.err);
      const exp = expect(counter).resolves.toBe(p.acks);
      const action = p.gun.get(TEST_ROOT).get(p.gun.name).put(p.gun.name + '-value', ack => {
        console.log('ACK:', p.gun.name, ack);
        counter.callback(ack);
      }).then();
      return Promise.all([
        expect(action).resolves.toBeDefined(),
        exp,
      ]);
    }));
    */

    /*
    // Join A and B,C networks, test whether they are connected
    nets.joinNets(A, B);

    // Now A points to (and peers with) B. All the previously added nodes should be available everywhere.
    await expect(B.get(TEST_ROOT).get('t1').once().then()).resolves.toBe('t1');
    await expect(C.get(TEST_ROOT).get('t1').once().then()).resolves.toBe('t1');
    await expect(A.get(TEST_ROOT).get('t2').once().then()).resolves.toBe('t2');

    // Add node to C, see if it propagates to A
    await C.get(TEST_ROOT).put({'t2c': 't2c'}, r => console.log('RESULT?', r) || r).then();
    await expect(A.get(TEST_ROOT).get('t2c').once().then()).resolves.toBe('t2c');
    */

    
    /* FIXME: ACKs seem to be somewhat unreliable? Look into this. Maybe should just test propagation by get()ting objects on other nodes instead?
    // Count ACKs on normal put operations
    await Promise.all([
      {acks: 1, gun: A},
      // B and C form one net
      {acks: 2, gun: B},
      // E and F both peer with D
      {acks: 3, gun: D},
      {acks: 2, gun: E},
      {acks: 2, gun: F},
    ].map(p => {
      const counter = timedCallbackPromise(p.acks, 3000, ack => !ack.err);
      const ex = expect(counter).resolves.toBe(p.acks);
      const t = new Date();
      const promise = p.gun.get(TEST_ROOT).get(p.gun.name).put(p.gun.name + '-value', ack => {
        console.log('ACK', p.gun.name, ack, new Date() - t);
        if (ack.err) {
          console.warn(`${p.name} counter triggered with error!\n${ack.err}`);
          return false;
        }
        return counter.callback(ack);
      }).then().then((d) => {
        console.log('Value recorded on node', p.gun.name, d);
      });
      return Promise.all([
        ex.then(() => {console.log('HOWDY!', p.gun.name); return true;}),
        expect(promise.then()).resolves.toBeDefined(),
      ]);
    }));
    */



    /*
    nets.joinNets(A, B);
    await Promise.all([
      A, B, C
    ].map(gun => Promise.all([
      expect(gun.get(TEST_ROOT).get('A').once().then()).resolves.toBe('A-value'),
      expect(gun.get(TEST_ROOT).get('B').once().then()).resolves.toBe('B-value'),
      expect(gun.get(TEST_ROOT).get('C').once().then()).resolves.toBe('C-value'),
    ])));
    // Can't read same values from D/E/F, though
    await Promise.all([D, E, F].map(gun => [
      expect(gun.get(TEST_ROOT).get('A').once().then().then(data => {console.log('GOT!!!', data); return data})).rejects.toBe(123),
    ]));
    */

    /*
    await Promise.all([
      {vp: vpb, key: 'A-data', vpname: 'B'},
      {vp: vpa, key: 'B-data', vpname: 'A'},
      {vp: vpa, key: 'C-data', vpname: 'A'}
    ].map(p => {
      const promise = timedCallbackPromise(1, 300, ack => (console.log(`${p.vpname} sees ${p.key}`) || true)).catch((err) => {
        console.error(`Failed to read key "${p.key}" from node "${p.vpname}". Err: ${err}`);
        return null;
      });
      p.vp.gun.get(p.key).once().on(promise.callback);
      return expect(promise).resolves.toBe(1);
    }));*/

  });
});
