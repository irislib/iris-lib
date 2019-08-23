import Gun from 'gun';

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

  async messageReceived(data, pub) {
    console.log(`data received`);
    const epub = await this.gun.user(pub).get(`epub`).once().then();
    const secret = await Gun.SEA.secret(epub, this.user._.sea);
    const decrypted = await Gun.SEA.decrypt(data, secret);
    console.log(`decrypted`, decrypted);
    if (this.onMessage) {
      this.onMessage(decrypted);
    } else {
      console.log(`no onMessage handler`);
    }
  }

  /**
  * Add a public key to the chat
  * @param {string} pub
  */
  addPub(pub) {
    this.participants.push(pub);
    this.gun.user(pub).get(`chat`).get(this.key.pub).on(data => {this.messageReceived(data, pub);});
  }

  /**
  * Send a message to the chat
  * @param msg string or {time, author, text} object
  */
  async send(msg) {
    if (typeof msg === `string`) {
      msg = {
        date: new Date().getTime(),
        author: `anonymous`,
        text: msg
      };
    }
    //this.gun.user().get('message').set(temp);
    const l = this.participants.length;
    for (let i = 0;i < l;i ++) {
      const pub = this.participants[i];
      const userObj = await this.gun.user(pub).once().then();
      const secret = await Gun.SEA.secret(userObj.epub, this.user._.sea);
      const encrypted = await Gun.SEA.encrypt(JSON.stringify(msg), secret);
      this.gun.user().get(`chat`).get(pub).put(encrypted);
    }
  }
}

export default Chat;
