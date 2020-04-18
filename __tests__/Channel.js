const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const radix = require(`gun/lib/radix`); // Require before instantiating Gun, if running in jsdom mode
const SEA = require(`gun/sea`);

const gun = new GUN({radisk: false});

test(`We say hi`, async (done) => {
  const myself = await iris.Key.generate();
  const friend = await iris.Key.generate();
  const friendsChannel = new iris.Channel({ gun: gun, key: friend, participants: myself.pub });
  const myChannel = new iris.Channel({
    gun: gun,
    key: myself,
    participants: friend.pub
  });
  myChannel.getMessages((msg, info) => {
    expect(msg.text).toEqual(`hi`);
    expect(info.selfAuthored).toBe(true);
    done();
  });
  myChannel.send(`hi`);
});
test(`Set and get msgsLastSeenTime`, async (done) => {
  const myself = await iris.Key.generate();
  const myChannel = new iris.Channel({
    gun: gun,
    key: myself,
    participants: myself.pub
  });
  const t = new Date();
  myChannel.setMyMsgsLastSeenTime();
  myChannel.getMyMsgsLastSeenTime(time => {
    expect(time).toBeDefined();
    expect(new Date(time).getTime()).toBeGreaterThanOrEqual(t.getTime());
    done();
  });
});

test(`Friend says hi`, async (done) => {
  const myself = await iris.Key.generate();
  const friend = await iris.Key.generate();
  const myChannel = new iris.Channel({
    gun: gun,
    key: myself,
    participants: friend.pub,
  });

  const friendsChannel = new iris.Channel({ gun: gun, key: friend, participants: myself.pub });
  friendsChannel.send(`hi`);
  myChannel.getMessages((msg) => {
    if (msg.text === `hi`) {
      done();
    }
  });
});

test(`Friends say hi in a group chat`, async (done) => {
  const myself = await iris.Key.generate();
  const friend1 = await iris.Key.generate();
  const friend2 = await iris.Key.generate();
  const myChannel = new iris.Channel({
    gun: gun,
    key: myself,
    participants: [friend1.pub, friend2.pub],
    newGroup: true
  });
  myChannel.send('1')

  const friend1Channel = new iris.Channel({ gun: gun, key: friend1, participants: [myself.pub, friend2.pub], uuid: myChannel.uuid });
  friend1Channel.send('2');
  const friend2Channel = new iris.Channel({ gun: gun, key: friend2, participants: [myself.pub, friend1.pub], uuid: myChannel.uuid });
  friend2Channel.send('3');
  const r = [];
  myChannel.getMessages((msg) => {
    console.log('got msg', msg.text);
    r.push(msg.text);
    if (r.indexOf('1') >= 0 &&  r.indexOf('3') >= 0) {
      done();
    }
  });
});
