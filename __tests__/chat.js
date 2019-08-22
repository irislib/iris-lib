const iris = require(`../cjs/index.js`);
const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const SEA = require(`gun/sea`);

let chat;
const gun = new GUN({radisk: false});

test(`Say hi`, (done) => {
  iris.Key.generate().then(key => {
    const onMessage = (msg) => {
      expect(msg.text).toEqual(`hi`);
      done();
    };
    chat = new iris.Chat({ onMessage, gun, key });
    chat.send(`hi`);
  });
});
