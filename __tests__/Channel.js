const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const radix = require(`gun/lib/radix`); // Require before instantiating Gun, if running in jsdom mode
const SEA = require(`gun/sea`);

const gun = new GUN({radisk: false, multicast: false});

test(`User1 says hi`, async (done) => {
  const user1 = await iris.Key.generate();
  const user2 = await iris.Key.generate();
  const user2Channel = new iris.Channel({ gun: gun, key: user2, participants: user1.pub });
  const user1Channel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: user2.pub
  });
  user1Channel.getMessages((msg, info) => {
    expect(msg.text).toEqual(`hi`);
    expect(info.selfAuthored).toBe(true);
    done();
  });
  user1Channel.send(`hi`);
});
test(`Set and get msgsLastSeenTime`, async (done) => {
  const user1 = await iris.Key.generate();
  const user1Channel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: user1.pub
  });
  const t = new Date();
  user1Channel.setMyMsgsLastSeenTime();
  user1Channel.getMyMsgsLastSeenTime(time => {
    expect(time).toBeDefined();
    expect(new Date(time).getTime()).toBeGreaterThanOrEqual(t.getTime());
    done();
  });
});

test(`User2 says hi`, async (done) => {
  const user1 = await iris.Key.generate();
  const user2 = await iris.Key.generate();
  const user1Channel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: user2.pub,
  });

  const user2Channel = new iris.Channel({ gun: gun, key: user2, participants: user1.pub });
  user2Channel.send(`hi`);
  user1Channel.getMessages((msg) => {
    if (msg.text === `hi`) {
      done();
    }
  });
});

test(`3 users send and receive messages on a group channel`, async (done) => {
  const user1 = await iris.Key.generate();
  const user2 = await iris.Key.generate();
  const user3 = await iris.Key.generate();
  iris.Channel.initUser(gun, user1);
  iris.Channel.initUser(gun, user2);
  iris.Channel.initUser(gun, user3);

  const user1Channel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: [user2.pub, user3.pub]
  });
  expect(typeof user1Channel.uuid).toBe('string');
  expect(typeof user1Channel.myGroupSecret).toBe('string');
  expect(user1Channel.uuid.length).toBe(36);
  user1Channel.send('1')

  const r1 = [];
  const r2 = [];
  const r3 = [];
  let user1ChannelDone, user2ChannelDone, user3ChannelDone;
  function checkDone() {
    if (user1ChannelDone && user2ChannelDone && user3ChannelDone) {
      done();
    }
  }
  user1Channel.getMessages((msg) => {
    console.log('got msg', msg.text);
    r1.push(msg.text);
    if (r1.indexOf('1') >= 0 && r1.indexOf('2') >= 0 && r1.indexOf('3') >= 0) {
      user1ChannelDone = true;
      console.log('user1ChannelDone');
      checkDone();
    }
  });

  setTimeout(() => { // with separate gun instances would work without timeout?
    const user2Channel = new iris.Channel({ gun: gun, key: user2, participants: [user1.pub, user3.pub], uuid: user1Channel.uuid });
    user2Channel.send('2');
    expect(user2Channel.uuid).toEqual(user1Channel.uuid);
    expect(typeof user2Channel.myGroupSecret).toBe('string');
    user2Channel.getMessages((msg) => {
      console.log('got msg', msg.text);
      r2.push(msg.text);
      if (r2.indexOf('1') >= 0 && r2.indexOf('2') >= 0 && r2.indexOf('3') >= 0) {
        user2ChannelDone = true;
        console.log('user2ChannelDone');
        checkDone();
      }
    });
  }, 500);

  setTimeout(() => {
    const user3Channel = new iris.Channel({ gun: gun, key: user3, participants: [user1.pub, user2.pub], uuid: user1Channel.uuid });
    user3Channel.send('3');
    expect(user3Channel.uuid).toEqual(user1Channel.uuid);
    expect(typeof user3Channel.myGroupSecret).toBe('string');
    user3Channel.getMessages((msg) => {
      console.log('got msg', msg.text);
      r3.push(msg.text);
      if (r3.indexOf('1') >= 0 && r3.indexOf('2') >= 0 && r3.indexOf('3') >= 0) {
        user3ChannelDone = true;
        console.log('user3ChannelDone');
        checkDone();
      }
    });
  }, 1000);
});

test(`Save and retrieve direct and group channels`, async (done) => {
  const user1 = await iris.Key.generate();
  const user2 = await iris.Key.generate();
  iris.Channel.initUser(gun, user2); // TODO direct chat is not saved unless the other guy's epub is found
  const user3 = await iris.Key.generate();
  const directChannel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: user2.pub
  });
  const groupChannel = new iris.Channel({
    gun: gun,
    key: user1,
    participants: [user2.pub, user3.pub]
  });
  let direct, group;
  iris.Channel.getChannels(gun, user1, channel => {
    if (channel.uuid) {
      group = channel;
    } else {
      direct = channel;
    }
    if (group && direct) {
      expect(direct.getId()).toBe(user2.pub);
      expect(group.getId()).toBe(groupChannel.uuid);
      expect(groupChannel.getParticipants().length).toBe(2);
      expect(group.getParticipants().length).toBe(2);
      done();
    }
  });
});
