import Gun from 'gun'; // eslint-disable-line no-unused-vars

/**
* Private communication channel between two or more participants
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

  /*
  createUser () {
    const uName = document.getElementById(`username`).value;
    const passP = document.getElementById(`passphrase`).value;
    console.log(`Called user create`);
    user.create(uName, passP, console.log);
  }

  signIn () {
    const uName = document.getElementById(`username`).value;
    name = uName;
    document.getElementById(`name`).innerHTML = name;
    document.getElementById(`username`).value = ``;
    const passP = document.getElementById(`passphrase`).value;
    document.getElementById(`passphrase`).value = ``;
    console.log(`Called user signin`);
    user.auth(uName, passP, function(ack) {
      console.log(ack);
      this.gun.user().once(function(data, key) {
        console.log(data);
        const epub = document.getElementById(`epub`);
        epub.value = data.pub; // <-- change all epub to pub in UI and ids
      });
    });
  }
  */

  addPub(pub) {
    this.participants.push(pub);
    this.gun.user(pub).get(`chat`).get(this.key.pub).on(data => {this.addChat(data, pub);});
  }

  send(msg) {
    const temp = {};
    temp.date = (new Date()).toString();
    temp.name = `name`;
    temp.text = msg;
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
