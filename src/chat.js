import Gun from 'gun'; // eslint-disable-line no-unused-vars

/**
* Private communication channel between two or more participants.
*
* Messages are encrypted, but currently anyone can see which public keys
* are communicating with each other. This will change in later versions.
*
* @param {Object} options {key, gun, onMessage}
*/
class Chat {
  constructor(options) {
    this.key = options.key;
    this.gun = options.gun;
    this.user = this.gun.user();
    this.user.auth(this.key);
    this.user.put({epub: this.key.epub});
    this.participants = [];
    this.addPub(this.key.pub);
    this.onMessage = options.onMessage;
  }

  addChat(data, pub) {
    console.log(`data received`);
    console.log(data);
    this.gun.user(pub).get(`epub`).once(this.step.bind(this, data));
  }

  step(data, epub) {
    console.log(`this.step`);
    console.log(epub, data);
    Gun.SEA.secret(epub, this.user._.sea, this.step2.bind(this, data));
  }

  step2(data, key) {
    console.log(`decrypt`);
    Gun.SEA.decrypt(data, key, this.decrypted.bind(this));
  }

  decrypted(data) {
    console.log(`this.decrypted`, data, this.onMessage);
    if (this.onMessage) {
      this.onMessage(data);
    } else {
      console.log(`no onMessage handler`);
    }
  }

  /**
  * Add a public key to the chat
  */
  addPub(pub) {
    this.participants.push(pub);
    this.gun.user(pub).get(`chat`).get(this.key.pub).on(data => {this.addChat(data, pub);});
  }

  /**
  * Send a message to the chat
  * @param msg string or {time, author, text} object
  */
  send(msg) {
    let temp;
    if (typeof msg === `string`) {
      temp = {};
      temp.date = (new Date()).toString();
      temp.author = `anonymous`;
      temp.text = msg;
    } else {
      temp = msg;
    }
    //this.gun.user().get('message').set(temp);
    let i = 0;
    const l = this.participants.length;
    for (i;i < l;i ++) {
      this.gun.user(this.participants[i]).once(this.setup.bind(this, this.participants[i], temp));
    }
  }

  //add another this.step for key retrieval to avoid calling this.gun.user().pair()
  setup(pub, message, userObj) {
    if (!userObj) {
      console.log(`userObj undefined`);
      return;
    }
    console.log(pub, message, userObj);
    console.log(`setup`);
    this.gun.user(pub).once(this.secret.bind(this, userObj, message, pub));
  }

  secret(userObj, message, pub, person) {
    if (!person) {
      console.log(`person undefined`);
      return;
    }
    console.log(userObj, message, person);
    console.log(`secret`);
    Gun.SEA.secret(person.epub, this.user._.sea, this.encrypt.bind(this, message, pub));
  }

  encrypt(message, pub, key) {
    console.log(`encrypt`, key);
    const stringified = JSON.stringify(message);
    Gun.SEA.encrypt(stringified, key, this.sendEncrypt.bind(this, pub));
  }

  sendEncrypt(pub, encr) {
    console.log(encr, pub);
    this.gun.user().get(`chat`).get(pub).put(encr);
  }
}

export default Chat;
