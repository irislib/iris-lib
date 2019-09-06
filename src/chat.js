import Gun from 'gun';

/**
* Private communication channel between two or more participants. Can be used
* independently of other Iris stuff.
*
* Messages are encrypted, but currently anyone can see which public keys
* are communicating with each other. This will change in later versions.
*
* @param {Object} options {key, gun, onMessage, participants}
*/
class Chat {
  constructor(options) {
    this.key = options.key;
    this.gun = options.gun;
    this.user = this.gun.user();
    this.user.auth(this.key);
    this.user.put({epub: this.key.epub});
    this.secrets = {}; // maps participant public key to shared secret
    this.onMessage = options.onMessage;

    if (typeof options.participants === `string`) {
      this.addPub(options.participants);
    } else if (Array.isArray(options.participants)) {
      for (let i = 0;i < options.participants.length;i ++) {
        if (typeof options.participants[i] === `string`) {
          this.addPub(options.participants[i]);
        } else {
          console.log(`participant public key must be string, got`, typeof options.participants[i], options.participants[i]);
        }
      }
    }
  }

  async getSecret(pub) {
    if (!this.secrets[pub]) {
      const epub = await this.gun.user(pub).get(`epub`).once().then();
      this.secrets[pub] = await Gun.SEA.secret(epub, this.key);
    }
    return this.secrets[pub];
  }

  async messageReceived(data, pub, selfAuthored) {
    const decrypted = await Gun.SEA.decrypt(data, (await this.getSecret(pub)));
    if (this.onMessage) {
      this.onMessage(decrypted, {selfAuthored});
    } else {
      console.log(`chat message received`, decrypted);
    }
  }

  /**
  * Add a public key to the chat
  * @param {string} pub
  */
  addPub(pub) {
    this.secrets[pub] = null;
    this.getSecret(pub);
    // Subscribe to their messages
    this.gun.user(pub).get(`chat`).get(this.key.pub).map().once(data => {this.messageReceived(data, pub);});
    // Subscribe to our messages
    this.user.get(`chat`).get(pub).map().once(data => {this.messageReceived(data, pub, true);});
  }

  /**
  * Send a message to the chat
  * @param msg string or {time, author, text} object
  */
  async send(msg) {
    if (typeof msg === `string`) {
      msg = {
        time: new Date().getTime(),
        author: `anonymous`,
        text: msg
      };
    }
    //this.gun.user().get('message').set(temp);
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i ++) {
      const pub = keys[i];
      const encrypted = await Gun.SEA.encrypt(JSON.stringify(msg), (await this.getSecret(pub)));
      this.user.get(`chat`).get(pub).set(encrypted);
    }
  }

  /**
  * Set the user's online status
  * @param {object} gun
  * @param {boolean} isOnline true: update the user's lastActive time every 3 seconds, false: stop updating
  */
  static setOnline(gun, isOnline) {
    if (isOnline) {
      const update = () => {
        gun.user().get(`lastActive`).put(Math.round(Gun.state() / 1000));
      };
      update();
      gun.setOnlineInterval = setInterval(update, 3000);
    } else {
      clearInterval(gun.setOnlineInterval);
    }
  }

  /**
  * Get the online status of a user.
  *
  * @param {object} gun
  * @param {string} pubKey public key of the user
  * @param {boolean} callback receives a boolean each time the user's online status changes
  */
  static getOnline(gun, pubKey, callback) {
    let timeout;
    gun.user(pubKey).get(`lastActive`).on(lastActive => {
      clearTimeout(timeout);
      const now = Math.round(Gun.state() / 1000);
      const isOnline = lastActive > now - 6 && lastActive < now + 30;
      callback(isOnline);
      if (isOnline) {
        timeout = setTimeout(() => callback(false), 6000);
      }
    });
  }
}

export default Chat;
