const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const radix = require(`gun/lib/radix`); // Require before instantiating Gun, if running in jsdom mode
const SEA = require(`gun/sea`);

const gun = new GUN({radisk: false});

test(`Say hi`, async (done) => {
  const key = await iris.Key.generate();
  const onMessage = (msg) => {
    expect(msg.text).toEqual(`hi`);
    done();
  };
  const chat = new iris.Chat({ onMessage, gun, key });
  chat.send(`hi`);
});
test(`Friend says hi`, async (done) => {
  const myself = await iris.Key.generate();
  const friend = await iris.Key.generate();
  const friendsChat = new iris.Chat({ gun, key: friend });
  friendsChat.addPub(myself.pub);
  const onMessage = (msg) => {
    expect(msg.text).toEqual(`hi`);
    done();
  };
  const myChat = new iris.Chat({ onMessage, gun, key: myself });
  friendsChat.send(`hi`);
});
