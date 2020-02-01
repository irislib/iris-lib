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
  const friendsChat = new iris.Chat({ gun, key: friend, participants: myself.pub });
  const myChat = new iris.Chat({
    gun,
    key: myself,
    participants: friend.pub,
    onMessage: (msg, info) => {
      expect(msg.text).toEqual(`hi`);
      expect(info.selfAuthored).toBe(true);
      done();
    }
  });
  myChat.send(`hi`);
});
test(`Set and get msgsLastSeenTime`, async (done) => {
  const myself = await iris.Key.generate();
  const myChat = new iris.Chat({
    gun,
    key: myself,
    participants: myself.pub
  });
  const t = new Date();
  myChat.setMyMsgsLastSeenTime();
  myChat.getMyMsgsLastSeenTime(time => {
    expect(time).toBeDefined();
    expect(new Date(time).getTime()).toBeGreaterThanOrEqual(t.getTime());
    done();
  });
});
/* probably fails because chats use the same gun
test(`Friend says hi`, async (done) => {
  const myself = await iris.Key.generate();
  const friend = await iris.Key.generate();
  const friendsChat = new iris.Chat({ gun, key: friend, participants: myself.pub });
  const myChat = new iris.Chat({
    gun,
    key: myself,
    participants: friend.pub,
    onMessage: (msg) => {
      expect(msg.text).toEqual(`hi`);
      done();
    }
  });
  friendsChat.send(`hi`);
});
*/
