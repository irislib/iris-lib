const iris = require(`../cjs/index.js`);

let chat;

test(`Say hi`, (done) => {
  const onMessage = (msg) => {
    console.log(1);
    expect(msg.text).toEqual(`hi`);
    done();
  }
  chat = new iris.Chat({ onMessage });
  chat.send(`hi`);
});
