import Gun from 'gun';
import util from './util';

/**
* Private communication channel between two or more participants. Can be used
* independently of other Iris stuff.
*
* Messages are encrypted and chat ids obfuscated, but it is possible to guess
* who are communicating with each other by looking at Gun timestamps and subscriptions.
*
* options.onMessage callback is not guaranteed to receive messages ordered by timestamp.
* You should sort them in the presentation layer.
*
* @param {Object} options {key, gun, chatLink, onMessage, participants}
* @example https://github.com/irislib/iris-lib/blob/master/__tests__/chat.js
*/
class Chat {
  constructor(options) {
    this.key = options.key;
    this.gun = options.gun;
    this.user = this.gun.user();
    this.user.auth(this.key);
    this.user.put({epub: this.key.epub});
    this.secrets = {}; // maps participant public key to shared secret
    this.ourSecretChatIds = {}; // maps participant public key to our secret chat id
    this.theirSecretChatIds = {}; // maps participant public key to their secret chat id
    this.onMessage = [];
    if (options.onMessage) {
      this.onMessage.push(options.onMessage);
    }
    this.messages = {};

    let saved;
    if (options.chatLink) {
      const s = options.chatLink.split('?');
      if (s.length === 2) {
        const pub = util.getUrlParameter('chatWith', s[1]);
        options.participants = pub;
        if (pub !== this.key.pub) {
          const sharedSecret = util.getUrlParameter('s', s[1]);
          const linkId = util.getUrlParameter('k', s[1]);
          if (sharedSecret && linkId) {
            this.save(); // save the chat first so it's there before inviter subscribes to it
            saved = true;
            this.gun.user(pub).get('chatLinks').get(linkId).get('encryptedSharedKey').on(async encrypted => {
              const sharedKey = await Gun.SEA.decrypt(encrypted, sharedSecret);
              const encryptedChatRequest = await Gun.SEA.encrypt(this.key.pub, sharedSecret);
              const chatRequestId = await Gun.SEA.work(encryptedChatRequest, null, null, {name: 'SHA-256'});
              util.gunAsAnotherUser(this.gun, sharedKey, user => {
                user.get('chatRequests').get(chatRequestId.slice(0, 12)).put(encryptedChatRequest);
              });
            });
          }
        }
      }
    }

    if (typeof options.participants === `string`) {
      this.addPub(options.participants);
    } else if (Array.isArray(options.participants)) {
      for (let i = 0;i < options.participants.length;i++) {
        if (typeof options.participants[i] === `string`) {
          this.addPub(options.participants[i]);
        } else {
          console.log(`participant public key must be string, got`, typeof options.participants[i], options.participants[i]);
        }
      }
    }
    if (!saved) {
      this.save();
    }
  }

  async getSecret(pub) {
    if (!this.secrets[pub]) {
      const epub = await util.gunOnceDefined(this.gun.user(pub).get(`epub`));
      this.secrets[pub] = await Gun.SEA.secret(epub, this.key);
    }
    return this.secrets[pub];
  }

  /**
  *
  */
  static async getOurSecretChatId(gun, pub, pair) {
    const epub = await util.gunOnceDefined(gun.user(pub).get(`epub`));
    const secret = await Gun.SEA.secret(epub, pair);
    return Gun.SEA.work(secret + pub, null, null, {name: 'SHA-256'});
  }

  /**
  *
  */
  static async getTheirSecretChatId(gun, pub, pair) {
    const epub = await util.gunOnceDefined(gun.user(pub).get(`epub`));
    const secret = await Gun.SEA.secret(epub, pair);
    return Gun.SEA.work(secret + pair.pub, null, null, {name: 'SHA-256'});
  }

  /**
  * Return a list of public keys that you have initiated a chat with or replied to.
  * (Chats that are initiated by others and unreplied by you don't show up, because
  * this method doesn't know where to look for them. Use socialNetwork.getChats() to listen to new chats from friends. Or create chat invite links with Chat.createChatLink(). )
  * @param {Object} gun user.authed gun instance
  * @param {Object} keypair SEA keypair that the gun instance is authenticated with
  * @param callback callback function that is called for each public key you have a chat with
  */
  static async getChats(gun, keypair, callback) {
    const chats = {};
    const mySecret = await Gun.SEA.secret(keypair.epub, keypair);
    gun.user().get(`chats`).map().on(async (value, ourSecretChatId) => {
      if (value) {
        const encryptedPub = await util.gunOnceDefined(gun.user().get(`chats`).get(ourSecretChatId).get(`pub`));
        const pub = await Gun.SEA.decrypt(encryptedPub, mySecret);
        chats[pub] = {};
        callback(pub);
      }
    });
    return chats;
  }

  async getOurSecretChatId(pub) {
    if (!this.ourSecretChatIds[pub]) {
      const secret = await this.getSecret(pub);
      this.ourSecretChatIds[pub] = await Gun.SEA.work(secret + pub, null, null, {name: 'SHA-256'});
    }
    return this.ourSecretChatIds[pub];
  }

  async getTheirSecretChatId(pub) {
    if (!this.theirSecretChatIds[pub]) {
      const secret = await this.getSecret(pub);
      this.theirSecretChatIds[pub] = await Gun.SEA.work(secret + this.key.pub, null, null, {name: 'SHA-256'});
    }
    return this.theirSecretChatIds[pub];
  }

  async messageReceived(data, pub, selfAuthored, key) {
    if (this.messages[key]) {
      return;
    }
    if (this.onMessage.length) {
      const decrypted = await Gun.SEA.decrypt(data, (await this.getSecret(pub)));
      if (typeof decrypted !== `object`) {
        // console.log(`chat data received`, decrypted);
        return;
      }
      decrypted._info = {selfAuthored, pub};
      this.messages[key] = decrypted;
      this.onMessage.forEach(f => f(decrypted, decrypted._info));
    } else {
      // console.log(`chat message received`, decrypted);
    }
  }

  /**
  * Get latest message in this chat. Useful for chat listing.
  */
  async getLatestMsg(callback) {
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i++) {
      const ourSecretChatId = await this.getOurSecretChatId(keys[i]);
      this.user.get(`chats`).get(ourSecretChatId).get(`latestMsg`).on(async data => {
        const decrypted = await Gun.SEA.decrypt(data, (await this.getSecret(keys[i])));
        if (typeof decrypted !== `object`) {
          // console.log(`chat data received`, decrypted);
          return;
        }
        callback(decrypted, {});
      });
    }
  }

  /**
  * Useful for notifications
  * @param {integer} time last seen msg time (default: now)
  */
  async setMyMsgsLastSeenTime(time) {
    time = time || new Date().toISOString();
    return this.putEncrypted(`msgsLastSeenTime`, time);
  }

  /**
  * Useful for notifications
  */
  async getMyMsgsLastSeenTime(callback) {
    this.onMyEncrypted(`msgsLastSeenTime`, time => {
      this.myMsgsLastSeenTime = time;
      if (callback) {
        callback(this.myMsgsLastSeenTime);
      }
    });
  }

  /**
  * For "seen" status indicator
  */
  async getTheirMsgsLastSeenTime(callback) {
    this.onTheirEncrypted(`msgsLastSeenTime`, time => {
      this.theirMsgsLastSeenTime = time;
      if (callback) {
        callback(this.theirMsgsLastSeenTime);
      }
    });
  }

  /**
  * Add a public key to the chat
  * @param {string} pub
  */
  async addPub(pub) {
    this.secrets[pub] = null;
    this.getSecret(pub);
    // Save their public key in encrypted format, so in chat listing we know who we are chatting with
    const ourSecretChatId = await this.getOurSecretChatId(pub);
    const mySecret = await Gun.SEA.secret(this.key.epub, this.key);
    this.gun.user().get(`chats`).get(ourSecretChatId).get(`pub`).put(await Gun.SEA.encrypt(pub, mySecret));
    if (this.messageReceived) {
      if (pub !== this.key.pub) {
        // Subscribe to their messages
        const theirSecretChatId = await this.getTheirSecretChatId(pub);
        this.gun.user(pub).get(`chats`).get(theirSecretChatId).get(`msgs`).map().once((data, key) => {this.messageReceived(data, pub, false, key);});
      }
      // Subscribe to our messages
      this.user.get(`chats`).get(ourSecretChatId).get(`msgs`).map().once((data, key) => {this.messageReceived(data, pub, true, key);});
    }
  }

  /**
  * Send a message to the chat
  * @param msg string or {time, author, text} object
  */
  async send(msg) {
    if (typeof msg === `string`) {
      msg = msg.trim();
      if (msg.length === 0) {
        return;
      }
      msg = {
        time: (new Date()).toISOString(),
        author: `anonymous`,
        text: msg
      };
    }
    //this.gun.user().get('message').set(temp);
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i++) {
      const encrypted = await Gun.SEA.encrypt(JSON.stringify(msg), (await this.getSecret(keys[i])));
      const ourSecretChatId = await this.getOurSecretChatId(keys[i]);
      this.user.get(`chats`).get(ourSecretChatId).get(`msgs`).get(`${msg.time}`).put(encrypted);
      this.user.get(`chats`).get(ourSecretChatId).get(`latestMsg`).put(encrypted);
    }
  }

  /**
  * Save the chat to our chats list without sending a message
  */
  async save() {
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i++) {
      const ourSecretChatId = await this.getOurSecretChatId(keys[i]);
      this.user.get(`chats`).get(ourSecretChatId).get('msgs').get('a').put(null);
    }
  }

  /**
  * Save a key-value pair, encrypt value
  */
  async putEncrypted(key, value, salt) {
    const keys = Object.keys(this.secrets);
    salt = salt || Gun.SEA.random(32).toString();
    const obj = {v: value, s: salt};
    for (let i = 0;i < keys.length;i++) {
      const encrypted = await Gun.SEA.encrypt(JSON.stringify(obj), (await this.getSecret(keys[i])));
      const ourSecretChatId = await this.getOurSecretChatId(keys[i]);
      this.user.get(`chats`).get(ourSecretChatId).get(key).put(encrypted);
    }
  }

  /**
  * Subscribe to key from us, decrypt value
  */
  async onMyEncrypted(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`onMyEncrypted callback must be a function, got ${typeof callback}`);
    }
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i++) {
      const ourSecretChatId = await this.getOurSecretChatId(keys[i]);
      this.gun.user().get(`chats`).get(ourSecretChatId).get(key).on(async data => {
        const decrypted = await Gun.SEA.decrypt(data, (await this.getSecret(keys[i])));
        if (decrypted) {
          callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key);
        }
      });
      break;
    }
  }

  /**
  * Subscribe to key from other participants, decrypt value
  */
  async onTheirEncrypted(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`onTheirEncrypted callback must be a function, got ${typeof callback}`);
    }
    const keys = Object.keys(this.secrets);
    for (let i = 0;i < keys.length;i++) {
      const theirSecretChatId = await this.getTheirSecretChatId(keys[i]);
      this.gun.user(keys[i]).get(`chats`).get(theirSecretChatId).get(key).on(async data => {
        const decrypted = await Gun.SEA.decrypt(data, (await this.getSecret(keys[i])));
        if (decrypted) {
          callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key);
        }
      });
    }
  }

  /**
  * Set typing status
  */
  setTyping(isTyping, timeout = 5) {
    isTyping = typeof isTyping === `undefined` ? true : isTyping;
    timeout = timeout * 1000;
    this.putEncrypted(`typing`, isTyping ? new Date().toISOString() : false);
    clearTimeout(this.setTypingTimeout);
    this.setTypingTimeout = setTimeout(() => this.putEncrypted(`isTyping`, false), timeout);
  }

  /**
  * Get typing status
  */
  getTyping(callback, timeout = 5) {
    timeout = timeout * 1000;
    this.onTheirEncrypted(`typing`, (typing, key, pub) => {
      if (callback) {
        const isTyping = typing && new Date() - new Date(typing) <= timeout;
        callback(isTyping, pub);
        this.getTypingTimeouts = this.getTypingTimeouts || {};
        clearTimeout(this.getTypingTimeouts[pub]);
        if (isTyping) {
          this.getTypingTimeouts[pub] = setTimeout(() => callback(false, pub), timeout);
        }
      }
    });
  }

  /**
  * Get a chat box element that you can add to your page
  */
  getChatBox() {
    util.injectCss();
    let minimized = false;

    function createElement(type, cls, parent) {
      const el = document.createElement(type);
      if (cls) {
        el.setAttribute('class', cls);
      }
      if (parent) {
        parent.appendChild(el);
      }
      return el;
    }

    const chatBox = createElement('div', 'iris-chat-box');
    const header = createElement('div', 'iris-chat-header', chatBox);
    const minimize = createElement('span', 'iris-chat-minimize', header);
    minimize.innerText = '—';
    minimize.addEventListener('click', e => {
      e.stopPropagation();
      chatBox.setAttribute('class', 'iris-chat-box minimized');
      minimized = true;
    });
    const headerText = createElement('div', 'iris-chat-header-text', header);
    const onlineIndicator = createElement('span', 'iris-online-indicator', headerText);
    onlineIndicator.innerHTML = '&#x25cf;';
    const nameEl = createElement('span', undefined, headerText);
    header.addEventListener('click', () => {
      if (minimized) {
        chatBox.setAttribute('class', 'iris-chat-box');
        minimized = false;
      }
    });

    const messages = createElement('div', 'iris-chat-messages', chatBox);

    const typingIndicator = createElement('div', 'iris-typing-indicator', chatBox);
    typingIndicator.innerText = 'typing...';
    this.getTyping(isTyping => {
      typingIndicator.setAttribute('class', `iris-typing-indicator${  isTyping ? ' yes' : ''}`);
    });

    const inputWrapper = createElement('div', 'iris-chat-input-wrapper', chatBox);
    const textArea = createElement('textarea', undefined, inputWrapper);
    textArea.setAttribute('rows', '1');
    textArea.setAttribute('placeholder', 'Type a message');
    if (util.isMobile) {
      const sendBtn = createElement('button', undefined, inputWrapper);
      sendBtn.innerHTML = `
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 486.736 486.736" style="enable-background:new 0 0 486.736 486.736;" xml:space="preserve" width="100px" height="100px" fill="#000000" stroke="#000000" stroke-width="0"><path fill="currentColor" d="M481.883,61.238l-474.3,171.4c-8.8,3.2-10.3,15-2.6,20.2l70.9,48.4l321.8-169.7l-272.4,203.4v82.4c0,5.6,6.3,9,11,5.9 l60-39.8l59.1,40.3c5.4,3.7,12.8,2.1,16.3-3.5l214.5-353.7C487.983,63.638,485.083,60.038,481.883,61.238z"></path></svg>
      `;
      sendBtn.addEventListener('click', () => {
        this.send(textArea.value);
        textArea.value = '';
        this.setTyping(false);
      });
    }

    const participants = Object.keys(this.secrets);
    if (participants.length) {
      const pub = participants[0];
      this.gun.user(pub).get('profile').get('name').on(name => nameEl.innerText = name);
      Chat.getOnline(this.gun, pub, status => {
        const cls = `iris-online-indicator${  status.isOnline ? ' yes' : ''}`;
        onlineIndicator.setAttribute('class', cls);
        const undelivered = messages.querySelectorAll('.iris-chat-message:not(.delivered)');
        undelivered.forEach(msg => {
          if (msg.getAttribute('data-time') <= status.lastActive) {
            const c = msg.getAttribute('class');
            msg.setAttribute('class', `${c  } delivered`);
          }
        });
      });
    }

    this.getTheirMsgsLastSeenTime(time => {
      const unseen = messages.querySelectorAll('.seen:not(.yes)');
      unseen.forEach(indicator => {
        const msgEl = indicator.parentElement.parentElement.parentElement;
        if (msgEl.getAttribute('data-time') <= time) {
          const msgClass = msgEl.getAttribute('class');
          if (msgClass.indexOf('delivered') === -1) {
            msgEl.setAttribute('class', `${msgClass  } delivered`);
          }
          indicator.setAttribute('class', 'seen yes');
        }
      });
    });

    this.onMessage.push((msg, info) => {
      const msgContent = createElement('div', 'iris-msg-content');
      msgContent.innerText = msg.text;
      const time = createElement('div', 'time', msgContent);
      time.innerText = util.formatTime(new Date(msg.time));
      if (info.selfAuthored) {
        const cls = this.theirMsgsLastSeenTime >= msg.time ? 'seen yes' : 'seen';
        const seenIndicator = createElement('span', cls, time);
        seenIndicator.innerHTML = ' <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 42"><polygon fill="currentColor" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"></polygon><polygon class="iris-delivered-checkmark" fill="currentColor" points="55.6,12.1 32,35.7 29.4,33.1 26.6,36 32,41.3 58.4,14.9"></polygon></svg>';
      }
      msgContent.innerHTML = msgContent.innerHTML.replace(/\n/g, '<br>\n');

      const msgEl = createElement('div', `${info.selfAuthored ? 'our' : 'their'} iris-chat-message`);
      msgEl.appendChild(msgContent);
      msgEl.setAttribute('data-time', msg.time);
      for (let i = messages.children.length; i >= 0; i--) {
        if (i === 0) {
          messages.insertBefore(msgEl, messages.firstChild);
        } else {
          const t = messages.children[i - 1].getAttribute('data-time');
          if (t && t < msg.time) {
            messages.children[i - 1].insertAdjacentElement('afterend', msgEl);
            break;
          }
        }
      }
      messages.scrollTop = messages.scrollHeight;
    });

    textArea.addEventListener('keyup', event => {
      Chat.setOnline(this.gun, true); // TODO
      this.setMyMsgsLastSeenTime(); // TODO
      if (event.keyCode === 13) {
        event.preventDefault();
        const content = textArea.value;
        const caret = util.getCaret(textArea);
        if (event.shiftKey) {
          textArea.value = `${content.substring(0, caret - 1)  }\n${  content.substring(caret, content.length)}`;
        } else {
          textArea.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
          this.send(textArea.value);
          textArea.value = '';
          this.setTyping(false);
        }
      } else {
        this.setTyping(!!textArea.value.length);
      }
    });

    return chatBox;
  }

  /**
  * Set the user's online status
  * @param {object} gun
  * @param {boolean} isOnline true: update the user's lastActive time every 3 seconds, false: stop updating
  */
  static setOnline(gun, isOnline) {
    if (isOnline) {
      if (gun.setOnlineInterval) { return; }
      const update = () => {
        gun.user().get(`lastActive`).put(new Date(Gun.state()).toISOString());
      };
      update();
      gun.setOnlineInterval = setInterval(update, 3000);
    } else {
      clearInterval(gun.setOnlineInterval);
      gun.setOnlineInterval = undefined;
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
      const now = new Date(Gun.state());
      let lastActiveDate = new Date(lastActive);
      if (lastActiveDate.getFullYear() === 1970) { // lol, format changed from seconds to iso string
        lastActiveDate = new Date(lastActiveDate.getTime() * 1000);
        lastActive = lastActiveDate.toISOString();
      }
      const isOnline = lastActiveDate > now - 10 * 1000 && lastActive < now + 30 * 1000;
      callback({isOnline, lastActive});
      if (isOnline) {
        timeout = setTimeout(() => callback({isOnline: false, lastActive}), 10000);
      }
    });
  }

  /**
  * In order to receive messages from others, this method must be called for newly created
  * users that have not started a chat with an existing user yet.
  *
  * It saves the user's key.epub (public key for encryption) into their gun user space,
  * so others can find it and write encrypted messages to them.
  *
  * If you start a chat with an existing user, key.epub is saved automatically and you don't need
  * to call this method.
  */
  static initUser(gun, key) {
    const user = gun.user();
    user.auth(key);
    user.put({epub: key.epub});
  }

  static formatChatLink(urlRoot, pub, sharedSecret, linkId) {
    return `${urlRoot}?chatWith=${encodeURIComponent(pub)}&s=${encodeURIComponent(sharedSecret)}&k=${encodeURIComponent(linkId)}`;
  }

  /**
  * Creates a chat link that can be used for two-way communication, i.e. only one link needs to be exchanged.
  */
  static async createChatLink(gun, key, urlRoot = 'https://iris.to/') {
    const user = gun.user();
    user.auth(key);

    const sharedKey = await Gun.SEA.pair();
    const sharedKeyString = JSON.stringify(sharedKey);
    const sharedSecret = await Gun.SEA.secret(sharedKey.epub, sharedKey);
    const encryptedSharedKey = await Gun.SEA.encrypt(sharedKeyString, sharedSecret);
    const ownerSecret = await Gun.SEA.secret(key.epub, key);
    const ownerEncryptedSharedKey = await Gun.SEA.encrypt(sharedKeyString, ownerSecret);
    let linkId = await Gun.SEA.work(encryptedSharedKey, undefined, undefined, {name: `SHA-256`});
    linkId = linkId.slice(0, 12);

    // User has to exist, in order for .get(chatRequests).on() to be ever triggered
    await util.gunAsAnotherUser(gun, sharedKey, user => {
      return user.get('chatRequests').put({a: 1}).then();
    });

    user.get('chatLinks').get(linkId).put({encryptedSharedKey, ownerEncryptedSharedKey});

    return Chat.formatChatLink(urlRoot, key.pub, sharedSecret, linkId);
  }

  static async getMyChatLinks(gun, key, urlRoot = 'https://iris.to/', callback, subscribe = true) {
    const user = gun.user();
    user.auth(key);
    const mySecret = await Gun.SEA.secret(key.epub, key);
    const chatLinks = [];
    user.get('chatLinks').map().on((data, linkId) => {
      if (!data || chatLinks.indexOf(linkId) !== -1) { return; }
      const chats = [];
      user.get('chatLinks').get(linkId).get('ownerEncryptedSharedKey').on(async enc => {
        if (!enc || chatLinks.indexOf(linkId) !== -1) { return; }
        chatLinks.push(linkId);
        const sharedKey = await Gun.SEA.decrypt(enc, mySecret);
        const sharedSecret = await Gun.SEA.secret(sharedKey.epub, sharedKey);
        const url = Chat.formatChatLink(urlRoot, key.pub, sharedSecret, linkId);
        if (callback) {
          callback({url, id: linkId});
        }
        if (subscribe) {
          gun.user(sharedKey.pub).get('chatRequests').map().on(async (encPub, requestId) => {
            if (!encPub) { return; }
            const s = JSON.stringify(encPub);
            if (chats.indexOf(s) === -1) {
              chats.push(s);
              const pub = await Gun.SEA.decrypt(encPub, sharedSecret);
              const chat = new Chat({gun, key, participants: pub});
              chat.save();
            }
            util.gunAsAnotherUser(gun, sharedKey, user => { // remove the chat request after reading
              user.get('chatRequests').get(requestId).put(null);
            });
          });
        }
      });
    });
  }

  /**
  *
  */
  static removeChatLink(gun, key, linkId) {
    gun.user().auth(key);
    gun.user().get('chatLinks').get(linkId).put(null);
  }

  /**
  *
  */
  static async deleteChat(gun, key, pub) {
    gun.user().auth(key);
    const chatId = await Chat.getOurSecretChatId(gun, pub, key);
    gun.user().get('chats').get(chatId).put(null);
    gun.user().get('chats').get(chatId).off();
  }
}

export default Chat;
