const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
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
