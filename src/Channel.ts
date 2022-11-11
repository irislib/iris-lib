// @ts-nocheck

import util from './util';
import Attribute from './Attribute';
import session from './session';
import publicState from './global';
import userState from './public';
import Key from './Key';

// TODO: extract Group channels into their own class

const DEFAULT_PERMISSIONS = {read: true, write: true, admin: false};

/**
* Private communication channel between two or more participants ([Gun](https://github.com/amark/gun) public keys). Can be used independently of other Iris stuff.
*
* Used as a core element of [iris-messenger](https://github.com/irislib/iris-messenger).
*
* You can use iris.private(pub) to always use the same Channel object for a given pub.
*
* ---
*
* #### Key-value API
* `channel.put(key, value)` and `channel.on(key, callback)`.
*
* Note that each participant has their own versions of each key-value — they don't overwrite each other. `channel.on()` callback returns them all by default and has a parameter that indicates whose value you got.
*
* While values are encrypted, encryption of keys is not implemented yet.
*
* #### Message API
* `channel.send()` and `channel.getMessages()` for timestamp-indexed chat-style messaging.
*
* Message data is encrypted, but timestamps are public so that peers can return your messages in a sequential order.
*
* ---
*
* You can open a channel with yourself for a private key-value space or a "note to self" type chat with yourself.
*
* **Privacy disclaimer:** Channel ids, data values and messages are encrypted, but message timestamps are unencrypted so that peers can return them to you in a sequential order. By looking at the unencrypted timestamps (or Gun subscriptions), it is possible to guess who are communicating with each other. This could be improved by indexing messages by *day* only, so making the guess would be more difficult, while you could still return them in a semi-sequential order.
*
* @param {Object} options
* @param {string} options.key your keypair
* @param {Object} options.gun [gun](https://github.com/amark/gun) instance
* @param options.participants (optional) string or string array or permissions object ({'pub1':{read:true,write:true,admin:false},'pub2'...}) of participant public keys (your own key is included by default)
* @param {string} options.chatLink (optional) chat link instead of participants list
* @param {string} options.uuid (group channels only) unique channel identifier. Leave out for new channel.
* @param {string} options.name (group channels only) channel name
* @example
* // Copy & paste this to console at https://iris.to or other page that has gun, sea and iris-lib
* // Due to an unsolved bug, someoneElse's messages only start showing up after a reload
*
* var gun1 = new Gun('https://gun-us.herokuapp.com/gun');
* var gun2 = new Gun('https://gun-us.herokuapp.com/gun');
* var myKey = await Key.getDefault();
* var someoneElse = localStorage.getItem('someoneElsesKey');
* if (someoneElse) {
*  someoneElse = JSON.parse(someoneElse);
* } else {
*  someoneElse = await Key.generate();
*  localStorage.setItem('someoneElsesKey', JSON.stringify(someoneElse));
* }
*
* iris.Channel.initUser(gun1, myKey); // saves myKey.epub to gun.user().get('epub')
* iris.Channel.initUser(gun2, someoneElse);
*
* var ourChannel = new iris.Channel({key: myKey, gun: gun1, participants: someoneElse.pub});
* var theirChannel = new iris.Channel({key: someoneElse, gun: gun2, participants: myKey.pub});
*
* var myChannels = {}; // you can list them in a user interface
* function printMessage(msg, info) {
*  console.log(`[${new Date(msg.time).toLocaleString()}] ${info.from.slice(0,8)}: ${msg.text}`)
* }
* iris.Channel.getChannels(gun1, myKey, channel => {
*  var pub = channel.getCurrentParticipants()[0];
*  gun1.user(pub).get('profile').get('name').on(name => channel.name = name);
*  myChannels[pub] = channel;
*  channel.getMessages(printMessage);
*  channel.on('mood', (mood, from) => console.log(from.slice(0,8) + ' is feeling ' + mood));
* });
*
* // you can play with these in the console:
* ourChannel.send('message from myKey');
* theirChannel.send('message from someoneElse');
*
* ourChannel.put('mood', 'blessed');
* theirChannel.put('mood', 'happy');
*
* @example https://github.com/irislib/iris-lib/blob/master/__tests__/Channel.js
*/
class Channel {
   // TODO: these should be done in a cleaner way
  latestTime: any;
  theirMsgsLastSeenDate: any;
  myLastSeenTime: any;
  theirMsgsLastSeenTime: any;
  notificationSetting: any;
  messageIds: any; // this is used from session.processMessage
  latest: any;
  uuid: any;
  name: any;
  attachments: any;

  theirSecretUuids = {};
  theirGroupSecrets = {};
  secrets = {};
  ourSecretChannelIds = {};
  theirSecretChannelIds = {};
  messages = {};
  chatLinks = {};
  groupSubscriptions = {};
  directSubscriptions = {};
  getParticipantsCallbacks = {};
  myGroupSecret: any;
  participants: any;

  constructor(options: any) {
    this.myGroupSecret = options.myGroupSecret;

    if (options.chatLink) {
      this.useChatLink(options);
    }

    if (typeof options.participants === `string`) {
      this.addParticipant(options.participants, options.save);
    } else if (Array.isArray(options.participants)) {
      const o = {};
      options.participants.forEach(p => o[p] = Object.assign({}, DEFAULT_PERMISSIONS));
      options.participants = o;
    }
    if (typeof options.participants === `object`) { // it's a group channel
      const keys = Object.keys(options.participants);
      keys.forEach(k => {
        if (k !== session.getKey().pub) {
          this.addParticipant(k, options.save, Object.assign({}, DEFAULT_PERMISSIONS, options.participants[k]));
        }
      });
      options.participants[session.getKey().pub] = options.participants[session.getKey().pub] || Object.assign({}, DEFAULT_PERMISSIONS);
      if (options.uuid) {
        this.uuid = options.uuid;
        this.name = options.name;
      } else {
        options.uuid = Attribute.getUuid().value;
        this.uuid = options.uuid;
        options.participants[session.getKey().pub].admin = true;
        options.participants[session.getKey().pub].founder = true;
      }
      this.getChatLinks({subscribe: true});
    }
    this.participants = options.participants;
    if (options.uuid) { // It's a group channel
      // share secret uuid with other participants. since secret is already non-deterministic, maybe uuid could also be?
      // generate channel-specific secret and share it with other participants
      // put() keys should be encrypted first? so you could do put(uuid, secret)
      // what if you join the channel with 2 unconnected devices? on reconnect, the older secret would be overwritten and messages unreadable. maybe participants should store each others' old keys? or maybe you should store them and re-encrypt old stuff when key changes? return them with map() instead?
      this.putDirect(`S${this.uuid}`, this.getMyGroupSecret());
      this.getMySecretUuid().then(s => {
        this.putDirect(this.uuid, s); // TODO: encrypt keys in put()
      });
      this.onTheirDirect(this.uuid, (s, k, from) => {
        this.theirSecretUuids[from] = s;
      });
      this.onTheirDirect(`S${this.uuid}`, (s, k, from) => {
        this.theirGroupSecrets[from] = s;
      });
      // need to make put(), on(), send() and getMessages() behave differently when it's a group and retain the old versions for mutual signaling
    }
    this.onTheir(`participants`, (participants, k, from) => {
      let hasAdmin = false;
      const keys = Object.keys(this.participants);
      for (let i = 0; i < keys.length; i++) {
        if (this.participants[keys[i]].admin || this.participants[keys[i]].inviter) {
          hasAdmin = true;
          break;
        }
      }
      if (!hasAdmin) {
        keys.forEach(k => this.participants[k].admin = true); // if no admins, make everyone admin
      }
      if (this.participants[from] && (this.participants[from].admin || this.participants[from].inviter)) {
        if (typeof participants === `object`) {
          if (JSON.stringify(this.participants) === JSON.stringify(participants)) { return; }
          this.participants = participants;
          delete this.participants[from].inviter;
          Object.keys(participants).forEach(k => {
            if (k !== session.getKey().pub) {
              this.addParticipant(k, true, Object.assign({}, DEFAULT_PERMISSIONS, participants[k]), true);
            }
          });
          this.participantsChanged();
          options.saved = true;
        }
      }
    });
    if (!options.saved && (options.save === undefined || options.save === true)) {
      this.save();
    }
  }

  useChatLink(options) {
    const s = options.chatLink.split('?');
    if (s.length === 2) {
      const chatWith = util.getUrlParameter('chatWith', s[1]);
      const channelId = util.getUrlParameter('channelId', s[1]);
      const inviter = util.getUrlParameter('inviter', s[1]);
      const pub = inviter || chatWith;
      if (chatWith) {
        options.participants = pub;
      } else if (channelId && inviter && inviter !== session.getKey().pub) { // TODO! initializing it twice breaks things - new secret is generated
        options.uuid = channelId;
        options.participants = {};
        options.participants[inviter] = Object.assign({inviter: true}, DEFAULT_PERMISSIONS);
      }
      if (pub !== session.getKey().pub) {
        const sharedSecret = util.getUrlParameter('s', s[1]);
        const linkId = util.getUrlParameter('k', s[1]);
        if (sharedSecret && linkId) {
          this.save(); // save the channel first so it's there before inviter subscribes to it
          options.saved = true;
          publicState().user(pub).get('chatLinks').get(linkId).get('encryptedSharedKey').on(async encrypted => {
            const sharedKey = await Key.decrypt(encrypted, sharedSecret);
            const encryptedChatRequest = await Key.encrypt(session.getKey().pub, sharedSecret); // TODO encrypt is not deterministic, it uses salt
            const channelRequestId = await util.getHash(encryptedChatRequest);
            publicState(sharedKey).get('chatRequests').get(channelRequestId.slice(0, 12)).put(encryptedChatRequest);
          });
        }
      }
    }
  }

  getTheirSecretUuid(pub) {
    return new Promise(resolve => {
      if (!this.theirSecretUuids[pub]) {
        this.onTheirDirect(this.uuid, s => {
          this.theirSecretUuids[pub] = s;
          resolve(this.theirSecretUuids[pub]);
        }, pub);
      } else {
        resolve(this.theirSecretUuids[pub]);
      }
    });
  }

  getTheirGroupSecret(pub) {
    if (pub === session.getKey().pub) { return this.getMyGroupSecret(); }
    return new Promise(resolve => {
      if (!this.theirGroupSecrets[pub]) {
        this.onTheirDirect(`S${this.uuid}`, s => {
          this.theirGroupSecrets[pub] = s;
          resolve(this.theirGroupSecrets[pub]);
        }, pub);
      } else {
        resolve(this.theirGroupSecrets[pub]);
      }
    });
  }

  changeMyGroupSecret() {
    this.myGroupSecret = Key.random(32).toString('base64');
    // TODO: secret should be archived and probably messages should include the encryption key id so past messages don't become unreadable
    this.putDirect(`S${this.uuid}`, this.myGroupSecret);
  }

  /**
  * Unsubscribe messages from a channel participants
  *
  * @param {string} participant public key
  */
  async mute(participant) {
    publicState().user(participant).get(this.theirSecretUuids[participant]).off();
    // TODO: persist
  }

  /**
  * Mute user and prevent them from seeing your further (and maybe past) messages
  *
  * @param {string} participant public key
  */
  async block(participant) {
    this.mute(participant);
    this.putDirect(this.uuid, null);
    this.putDirect(`S${this.uuid}`, null);
    delete this.secrets[participant];
    delete this.ourSecretChannelIds[participant];
    delete this.theirSecretChannelIds[participant];
    this.changeMyGroupSecret();
  }

  async getMySecretUuid() {
    if (!this.mySecretUuid) {
      const mySecret = await Key.secret(session.getKey().epub, session.getKey());
      const mySecretHash = await util.getHash(mySecret);
      this.mySecretUuid = await util.getHash(mySecretHash + this.uuid);
    }
    return this.mySecretUuid;
  }

  /**
  * List participants of the channel (other than you)
  */
  getCurrentParticipants() {
    return Object.keys(this.secrets);
  }

  /**
  * Subscribe to the changing list of participants by channel admins
  */
  getParticipants(callback) {
    if (this.getParticipantsCallbackId) {
      this.getParticipantsCallbackId++;
    } else {
      this.getParticipantsCallbackId = 1;
    }
    this.getParticipantsCallbacks[this.getParticipantsCallbackId] = callback;
    if (this.participants) {
      callback(this.participants);
    }
  }

  participantsChanged() {
    Object.keys(this.getParticipantsCallbacks).forEach(id => {
      this.getParticipantsCallbacks[id](this.participants);
    });
  }

  /**
  * Returns either the uuid of a group channel or the public key of a direct channel.
  */
  getId() {
    return this.uuid || this.getCurrentParticipants()[0];
  }

  async getSecret(pub) {
    if (!this.secrets[pub]) {
      const epub = await util.gunOnceDefined(publicState().user(pub).get(`epub`));
      this.secrets[pub] = await Key.secret(epub, session.getKey());
    }
    return this.secrets[pub];
  }

  /**
  *
  */
  static async getOurSecretChannelId(pub, pair) {
    const epub = await util.gunOnceDefined(publicState().user(pub).get(`epub`));
    const secret = await Key.secret(epub, pair);
    return util.getHash(secret + pub);
  }

  /**
  *
  */
  static async getTheirSecretChannelId(pub, pair) {
    const epub = await util.gunOnceDefined(publicState().user(pub).get(`epub`));
    const secret = await Key.secret(epub, pair);
    return util.getHash(secret + pair.pub);
  }

  /**
  * Calls back with Channels that you have initiated or written to.
  * @param {Object} keypair Key keypair that the gun instance is authenticated with
  * @param callback callback function that is called for each public key you have a channel with
  */
  static async getChannels(callback, listenToChatLinks = true) {
    const keypair = session.getKey();
    const mySecret = await Key.secret(keypair.epub, keypair);
    if (listenToChatLinks) {
      Channel.getMyChatLinks( undefined, undefined, true);
    }
    const seen = {};

    const handleChannel = async (value, ourSecretChannelId) => {
      if (value && !seen[ourSecretChannelId]) {
        seen[ourSecretChannelId] = true;
        if (ourSecretChannelId.length > 44) {
          publicState().user().get(`chats`).get(ourSecretChannelId).put(null);
          return;
        }
        const encryptedChatId = await util.gunOnceDefined(publicState().user().get(`chats`).get(ourSecretChannelId).get(`pub`));
        const chatId = await Key.decrypt(encryptedChatId, mySecret);
        if (!chatId) {
          return;
        }
        if (chatId.pub || typeof chatId === `string`) {
          callback(new Channel({
            key: keypair,
            participants: chatId.pub || chatId,
            save: false
          }));
        } else if (chatId.uuid && chatId.participants && chatId.myGroupSecret) {
          callback(new Channel({
            key: keypair,
            participants: chatId.participants,
            uuid: chatId.uuid,
            myGroupSecret: chatId.myGroupSecret,
            save: false
          }));
        }
      }
    };

    publicState().user().get(`chats`).map(handleChannel);
  }

  getMyGroupSecret() { // group secret could be deterministic: hash(encryptToSelf(uuid + iterator))
    if (!this.myGroupSecret) {
      this.changeMyGroupSecret();
    }
    return this.myGroupSecret;
  }

  async getOurSecretChannelId(pub) {
    if (!this.ourSecretChannelIds[pub]) {
      const secret = await this.getSecret(pub);
      this.ourSecretChannelIds[pub] = await util.getHash(secret + pub);
    }
    return this.ourSecretChannelIds[pub];
  }

  async getTheirSecretChannelId(pub) {
    if (!this.theirSecretChannelIds[pub]) {
      const secret = await this.getSecret(pub);
      this.theirSecretChannelIds[pub] = await util.getHash(secret + session.getKey().pub);
    }
    return this.theirSecretChannelIds[pub];
  }

  /**
  * Get messages from the channel
  */
  async getMessages(callback) { // TODO: save callback and apply it when new participants are added to channel
    this.getCurrentParticipants().forEach(async pub => {
      if (pub !== session.getKey().pub) {
        // Subscribe to their messages
        let theirSecretChannelId;
        if (this.uuid) {
          theirSecretChannelId = await this.getTheirSecretUuid(pub);
        } else {
          theirSecretChannelId = await this.getTheirSecretChannelId(pub);
        }
        // TODO map().once
        publicState().user(pub).get(`chats`).get(theirSecretChannelId).get(`msgs`).map((data, key) => {this.messageReceived(callback, data, this.uuid || pub, false, key, pub);});
      }
      if (!this.uuid) {
        // Subscribe to our messages
        const ourSecretChannelId = await this.getOurSecretChannelId(pub);
        // TODO map().once
        userState().get(`chats`).get(ourSecretChannelId).get(`msgs`).map((data, key) => {this.messageReceived(callback, data, pub, true, key, session.getKey().pub);});
      }
    });
    if (this.uuid) {
      // Subscribe to our messages
      const mySecretUuid = await this.getMySecretUuid();
      // TODO map().once
      userState().get(`chats`).get(mySecretUuid).get(`msgs`).map((data, key) => {this.messageReceived(callback, data, this.uuid, true, key, session.getKey().pub);});
    }
  }

  async messageReceived(callback, data, channelId, selfAuthored, key, from) {
    if (this.messages[key] || !data) {
      return;
    }
    const secret = this.uuid ? (await this.getTheirGroupSecret(from)) : (await this.getSecret(channelId));
    const decrypted = await Key.decrypt(data, secret);
    if (typeof decrypted !== `object`) {
      return;
    }
    const info = {selfAuthored, channelId, from};
    this.messages[key] = decrypted;
    callback(decrypted, info);
  }

  /**
  * Get latest message in this channel. Useful for channel listing.
  */
  async getLatestMsg(callback) {
    const callbackIfLatest = async (msg, info) => {
      if (!this.latest) {
        this.latest = msg;
        callback(msg, info);
      } else {
        const t = (typeof this.latest.time === `string` ? this.latest.time : this.latest.time.toISOString());
        if (t < msg.time) {
          this.latest = msg;
          callback(msg, info);
        }
      }
    };
    this.onMy('latestMsg', msg => callbackIfLatest(msg, {selfAuthored: true, from: session.getKey().pub}));
    this.onTheir('latestMsg', (msg, k, from) => callbackIfLatest(msg, {selfAuthored: false, from}));
  }

  /**
  * Useful for notifications
  * @param {integer} time last seen msg time (default: now)
  */
  async setMyMsgsLastSeenTime(time?: string) {
    time = time || new Date().toISOString();
    return this.put(`msgsLastSeenTime`, time);
  }

  /**
  * Useful for notifications
  */
  async getMyMsgsLastSeenTime(callback) {
    this.onMy(`msgsLastSeenTime`, time => {
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
    this.onTheir(`msgsLastSeenTime`, time => {
      this.theirMsgsLastSeenTime = time;
      if (callback) {
        callback(this.theirMsgsLastSeenTime);
      }
    });
  }

  async removeParticipant(pub) {
    this.addParticipant(pub, true, {read: false, write: false});
  }

  /**
  * Add a public key to the channel or update its permissions
  * @param {string} pub
  */
  async addParticipant(pub: string, save = true, permissions?: any, subscribe?: boolean) {
    if (this.uuid) {
      return;
    }
    if (permissions === undefined) {
      permissions = DEFAULT_PERMISSIONS;
    }
    if (this.secrets[pub] && JSON.stringify(this.secrets[pub]) === JSON.stringify(permissions)) { // TODO: should be this.participants[pub]
      return;
    }
    this.secrets[pub] = null;
    this.getSecret(pub);
    const ourSecretChannelId = await this.getOurSecretChannelId(pub);
    if (save) {
      // Save their public key in encrypted format, so in channel listing we know who we are channeling with
      const mySecret = await Key.secret(session.getKey().epub, session.getKey());
      publicState().user().get(`chats`).get(ourSecretChannelId).get(`pub`).put(await Key.encrypt({pub}, mySecret));
    }
    if (this.uuid) {
      this.participants[pub] = permissions;
      if (save) {
        this.putDirect(`S${this.uuid}`, this.getMyGroupSecret());
        this.getMySecretUuid().then(s => {
          this.putDirect(this.uuid, s); // TODO: encrypt keys in put()
        });
        this.onTheirDirect(this.uuid, (s, k, from) => {
          this.theirSecretUuids[from] = s;
        });
        this.onTheirDirect(`S${this.uuid}`, (s, k, from) => {
          this.theirGroupSecrets[from] = s;
        });
        this.save();
      }
    }
    if (subscribe) {
      Object.values(this.directSubscriptions).forEach(arr => {
        arr.forEach(o => {
          if (!o.from || o.from === pub) {
            this._onTheirDirectFromUser(pub, o.key, o.callback);
          }
        });
      });
      Object.values(this.groupSubscriptions).forEach(arr => {
        arr.forEach(o => {
          if (o.from && o.from !== pub) { return; }
          if (permissions.write) {
            this._onTheirGroupFromUser(pub, o.key, o.callback);
          } else { // unsubscribe
            o.event && o.event.off();
          }
        });
      });
    }
  }

  /**
  * Send a message to the channel
  * @param msg string or {time, text, ...} object
  */
  async send(msg) {
    if (typeof msg === `string`) {
      msg = msg.trim();
      if (msg.length === 0) {
        return;
      }
      msg = {
        time: (new Date()).toISOString(),
        text: msg
      };
    } else if (typeof msg === `object`) {
      msg.time = msg.time || (new Date()).toISOString();
    } else {
      throw new Error(`msg param must be a string or an object`);
    }
    //publicState().user().get('message').set(temp);
    if (this.uuid) {
      const encrypted = await Key.encrypt(JSON.stringify(msg), this.getMyGroupSecret());
      const mySecretUuid = await this.getMySecretUuid();
      userState().get(`chats`).get(mySecretUuid).get(`msgs`).get(`${msg.time}`).put(encrypted);
      userState().get(`chats`).get(mySecretUuid).get(`latestMsg`).put(encrypted);
    } else {
      const keys = this.getCurrentParticipants();
      for (let i = 0;i < keys.length;i++) {
        const encrypted = await Key.encrypt(JSON.stringify(msg), (await this.getSecret(keys[i])));
        const ourSecretChannelId = await this.getOurSecretChannelId(keys[i]);
        userState().get(`chats`).get(ourSecretChannelId).get(`msgs`).get(`${msg.time}`).put(encrypted);
        userState().get(`chats`).get(ourSecretChannelId).get(`latestMsg`).put(encrypted);
      }
    }
  }

  /**
  * Save the channel to our channels list without sending a message
  */
  async save() {
    if (this.uuid) {
      const mySecretUuid = await this.getMySecretUuid();
      userState().get(`chats`).get(mySecretUuid).get('msgs').get('a').put(null);
      this.put(`participants`, this.participants); // public participants list
      const mySecret = await Key.secret(session.getKey().epub, session.getKey());
      userState().get(`chats`).get(mySecretUuid).get(`pub`).put(await Key.encrypt({
        uuid: this.uuid,
        myGroupSecret: this.getMyGroupSecret(),
        participants: this.participants // private participants list
      }, mySecret));
      this.participantsChanged();
    } else {
      const keys = this.getCurrentParticipants();
      for (let i = 0;i < keys.length;i++) {
        const ourSecretChannelId = await this.getOurSecretChannelId(keys[i]);
        userState().get(`chats`).get(ourSecretChannelId).get('msgs').get('a').put(null);
      }
    }
  }

  /**
  * Save a key-value pair, encrypt value. Each participant in the Channel writes to their own version of the key-value pair — they don't overwrite the same one.
  * @param {string} key
  * @param value
  */
  async put(key, value) {
    return (this.uuid ? this.putGroup : this.putDirect).call(this, key, value);
  }

  async putGroup(key, value) {
    if (key === `msgs`) { throw new Error(`Sorry, you can't overwrite the msgs field which is used for .send()`); }
    const encrypted = await Key.encrypt(JSON.stringify(value), this.getMyGroupSecret());
    const mySecretUuid = await this.getMySecretUuid();
    userState().get(`chats`).get(mySecretUuid).get(key).put(encrypted);
  }

  async putDirect(key, value) {
    if (key === `msgs`) { throw new Error(`Sorry, you can't overwrite the msgs field which is used for .send()`); }
    const keys = this.getCurrentParticipants();
    for (let i = 0;i < keys.length;i++) {
      const encrypted = await Key.encrypt(JSON.stringify(value), (await this.getSecret(keys[i])));
      const ourSecretChannelId = await this.getOurSecretChannelId(keys[i]);
      userState().get(`chats`).get(ourSecretChannelId).get(key).put(encrypted);
    }
  }

  /**
  * Subscribe to a key-value pair. Callback returns every participant's value unless you limit it with *from* param.
  * @param {string} key
  * @param {function} callback
  * @param {string} from public key whose value you want, or *"me"* for your value only, or *"them"* for the value of others only
  */
  async on(key: string, callback: Function, from?: string) {
    return (this.uuid ? this.onGroup : this.onDirect).call(this, key, callback, from);
  }

  async onDirect(key: string, callback: Function, from?: string) {
    if (!from || from === `me` || from === session.getKey().pub) {
      this.onMy(key, (val: any) => callback(val, session.getKey().pub));
    }
    if (!from || (from !== `me` && from !== session.getKey().pub)) {
      this.onTheir(key, (val: any, k: string, pub: string) => callback(val, pub));
    }
  }

  async onGroup(key: string, callback: Function, from?: string) {
    if (!from || from === `me` || from === session.getKey().pub) {
      this.onMyGroup(key, val => callback(val, session.getKey().pub));
    }
    if (!from || (from !== `me` && from !== session.getKey().pub)) {
      this.onTheirGroup(key, (val, k, pub) => callback(val, pub));
    }
  }

  async onMy(key: string, callback: Function) {
    return (this.uuid ? this.onMyGroup : this.onMyDirect).call(this, key, callback);
  }

  async onMyDirect(key: string, callback: Function) {
    if (typeof callback !== 'function') {
      throw new Error(`onMy callback must be a function, got ${typeof callback}`);
    }
    const keys = this.getCurrentParticipants();
    for (let i = 0;i < keys.length;i++) {
      const ourSecretChannelId = await this.getOurSecretChannelId(keys[i]);
      publicState().user().get(`chats`).get(ourSecretChannelId).get(key).on(async (data: any) => {
        const decrypted = await Key.decrypt(data, (await this.getSecret(keys[i])));
        if (decrypted) {
          callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key);
        }
      });
      break;
    }
  }

  async onMyGroup(key, callback) {
    if (typeof callback !== 'function') {
      throw new Error(`onMy callback must be a function, got ${typeof callback}`);
    }
    const mySecretUuid = await this.getMySecretUuid();
    const mySecret = await this.getMyGroupSecret();
    publicState().user().get(`chats`).get(mySecretUuid).get(key).on(async data => {
      const decrypted = await Key.decrypt(data, mySecret);
      if (decrypted) {
        callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key, session.getKey().pub);
      }
    });
  }

  async onTheir(key: string, callback: Function, from: string) {
    return (this.uuid ? this.onTheirGroup : this.onTheirDirect).call(this, key, callback, from);
  }

  async _onTheirDirectFromUser(key: string, callback: Function, pub: string) {
    if (!this.hasWritePermission(pub)) { return; }
    const theirSecretChannelId = await this.getTheirSecretChannelId(pub);
    publicState().user(pub).get(`chats`).get(theirSecretChannelId).get(key).on(async (data: any) => {
      if (!this.hasWritePermission(pub)) { return; }
      const decrypted = await Key.decrypt(data, (await this.getSecret(pub)));
      if (decrypted) {
        callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key, pub);
      }
    });
  }

  async onTheirDirect(key: string, callback: Function, from: string) { // TODO: subscribe to new channel participants
    if (typeof callback !== 'function') {
      throw new Error(`onTheir callback must be a function, got ${typeof callback}`);
    }
    if (!Object.prototype.hasOwnProperty.call(this.directSubscriptions, key)) {
      this.directSubscriptions[key] = [];
    }
    this.directSubscriptions[key].push({key, callback, from});
    const participants = this.getCurrentParticipants();
    participants.forEach(async pub => {
      if (from && pub !== from) { return; }
      this._onTheirDirectFromUser(pub, key, callback);
    });
  }

  hasWritePermission(pub) {
    return !this.uuid || (this.participants && this.participants[pub] && this.participants[pub].write);
  }

  async _onTheirGroupFromUser(pub: string, key: string, callback: Function, subscription: any) {
    if (!this.hasWritePermission(pub)) { return; }
    const theirSecretUuid = await this.getTheirSecretUuid(pub);
    publicState().user(pub).get(`chats`).get(theirSecretUuid).get(key).on(async (data: any, _a: any, _b: any, e: Event) => {
      if (subscription) { subscription.event = e; }
      if (!this.hasWritePermission(pub)) { return; }
      const decrypted = await Key.decrypt(data, (await this.getTheirGroupSecret(pub)));
      if (decrypted) {
        callback(typeof decrypted.v !== `undefined` ? decrypted.v : decrypted, key, pub);
      }
    });
  }

  async onTheirGroup(key, callback, from) {
    if (typeof callback !== 'function') {
      throw new Error(`onTheir callback must be a function, got ${typeof callback}`);
    }
    if (!Object.prototype.hasOwnProperty.call(this.groupSubscriptions, key)) {
      this.groupSubscriptions[key] = [];
    }
    const subscription = {key, callback, from};
    this.groupSubscriptions[key].push(subscription);

    this.getParticipants(participants => {
      Object.keys(participants).forEach(async pub => {
        if (from && pub !== from) { return; }
        if (!(participants[pub] && participants[pub].write)) { return; }
        this._onTheirGroupFromUser(pub, key, callback, subscription);
      });
    });
  }

  /**
  * Set typing status
  */
  setTyping(isTyping, timeout = 5) {
    isTyping = typeof isTyping === `undefined` ? true : isTyping;
    timeout = timeout * 1000;
    this.put(`typing`, isTyping ? new Date().toISOString() : new Date(0).toISOString());
    clearTimeout(this.setTypingTimeout);
    this.setTypingTimeout = setTimeout(() => this.put(`typing`, false), timeout);
  }

  /**
  * Get typing status
  */
  getTyping(callback, timeout = 5) { // TODO callback not called on setTyping(false), at least for self chat
    timeout = timeout * 1000;
    this.onTheir(`typing`, (typing, key, pub) => {
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
  * Get a simple link that points to the channel.
  *
  * Direct channel: both users need to give their simple links. Use createChatLink() to get a two-way link that needs to be given by one user only.
  *
  * Group channel: Works only if the link recipient has been already added onto the channel participants list.
  */
  getSimpleLink(urlRoot = 'https://iris.to/') {
    if (this.uuid) {
      return `${urlRoot}?channelId=${this.uuid}&inviter=${session.getKey().pub}`;
    }
    return `${urlRoot}?chatWith=${this.getCurrentParticipants()[0]}`;
  }

  /**
  *
  */
  async getChatLinks(opts: any = {}) {
    let {callback, urlRoot, subscribe} = opts;
    urlRoot = urlRoot || 'https://iris.to/';
    if (!this.uuid) { throw new Error('Only group channels may have chat links'); }
    const chatLinks: any[] = [];
    const chatLinkSubscriptions = {};
    this.on('chatLinks', (links: any, from: string) => {
      // TODO: check admin permissions
      if (!links || typeof links !== 'object') { return; }
      Object.keys(links).forEach(linkId => {
        const link = links[linkId];
        if (link === null) {
          chatLinkSubscriptions[linkId] && chatLinkSubscriptions[linkId].off(); // unsubscribe removed chat link
          delete chatLinkSubscriptions[linkId];
          callback && callback({id: linkId, url: null});
          return;
        }
        if (chatLinks.indexOf(linkId) !== -1) { return; }
        const channels = [];
        chatLinks.push(linkId);
        const url = Channel.formatChatLink({urlRoot, inviter: from, channelId: this.uuid, sharedSecret: link.sharedSecret, linkId});
        callback && callback({url, id: linkId});
        if (subscribe) {
          publicState().user(link.sharedKey.pub).get('chatRequests').map(async (encPub, requestId, a, e) => {
            if (!encPub || typeof encPub !== 'string' || encPub.length < 10) { return; }
            chatLinkSubscriptions[linkId] = e;
            const s = JSON.stringify(encPub);
            if (channels.indexOf(s) === -1) {
              channels.push(s);
              const pub = await Key.decrypt(encPub, link.sharedSecret);
              this.addParticipant(pub, undefined, undefined, true);
            }
          });
        }
      });
    });
  }

  async createChatLink(urlRoot = 'https://iris.to/') {
    const sharedKey = await Key.generate();
    const sharedKeyString = JSON.stringify(sharedKey);
    const sharedSecret = await Key.secret(sharedKey.epub, sharedKey);
    const encryptedSharedKey = await Key.encrypt(sharedKeyString, sharedSecret);
    const ownerSecret = await Key.secret(session.getKey().epub, session.getKey());
    const ownerEncryptedSharedKey = await Key.encrypt(sharedKeyString, ownerSecret);
    let linkId = await util.getHash(encryptedSharedKey);
    linkId = linkId.slice(0, 12);

    // User has to exist, in order for .get(chatRequests).on() to be ever triggered
    publicState(sharedKey).get('chatRequests').put({a: 1});

    this.chatLinks[linkId] = {sharedKey, sharedSecret};
    this.put('chatLinks', this.chatLinks);
    userState().get('chatLinks').get(linkId).put({encryptedSharedKey, ownerEncryptedSharedKey});

    return Channel.formatChatLink({urlRoot, channelId: this.uuid, inviter: session.getKey().pub, sharedSecret, linkId});
  }

  /**
  * Set the user's online/active status
  * @param {string} activity string: set the activity status every 3 seconds, null/false: stop updating
  */
  static setActivity(activity) {
    if (publicState().irisActivityStatus === activity) { return; }
    publicState().irisActivityStatus = activity;
    clearTimeout(publicState().setActivityTimeout);
    const update = () => {
      publicState().user().get(`activity`).put({status: activity, time: new Date().toISOString()});
    };
    update();
    function timerUpdate() {
      update();
      publicState().setActivityTimeout = setTimeout(timerUpdate, 3000);
    }
    if (activity) {
      timerUpdate();
    }
  }

  /**
  * Get the online status of a user.
  *
  * @param {string} pubKey public key of the user
  * @param {boolean} callback receives a boolean each time the user's online status changes
  */
  static getActivity(pubKey, callback) {
    let timeout;
    publicState().user(pubKey).get(`activity`).on(activity => {
      if (!activity || !(activity.time && activity.status)) { return; }
      clearTimeout(timeout);
      const now = new Date();
      const activityDate = new Date(activity.time);
      const isActive = activityDate > new Date(now.getTime() - 10 * 1000) && activityDate < new Date(now.getTime() + 30 * 1000);
      callback({isActive, lastActive: activity.time, status: activity.status});
      if (isActive) {
        timeout = setTimeout(() => callback({isOnline: false, lastActive: activity.time}), 10000);
      }
    });
  }

  static formatChatLink({urlRoot, chatWith, channelId, inviter, sharedSecret, linkId}) {
    const enc = encodeURIComponent;
    if (channelId && inviter) {
      return `${urlRoot}?channelId=${enc(channelId)}&inviter=${enc(inviter)}&s=${enc(sharedSecret)}&k=${enc(linkId)}`;
    }
    return `${urlRoot}?chatWith=${enc(chatWith)}&s=${enc(sharedSecret)}&k=${enc(linkId)}`;
  }

  /**
  * Creates a channel link that can be used for two-way communication, i.e. only one link needs to be exchanged.
  */
  static async createChatLink(urlRoot = 'https://iris.to/') {
    const user = publicState().user();
    const key = session.getKey();

    // We create a new Gun user whose private key is shared with the chat link recipients.
    // Chat link recipients can contact you by writing their public key to the shared key's user space.
    const sharedKey = await Key.generate();
    const sharedKeyString = JSON.stringify(sharedKey);
    const sharedSecret = await Key.secret(sharedKey.epub, sharedKey);
    const encryptedSharedKey = await Key.encrypt(sharedKeyString, sharedSecret);
    const ownerSecret = await Key.secret(key.epub, key);
    const ownerEncryptedSharedKey = await Key.encrypt(sharedKeyString, ownerSecret);
    let linkId = await util.getHash(encryptedSharedKey);
    linkId = linkId.slice(0, 12);

    // User has to exist, in order for .get(chatRequests).on() to be ever triggered
    publicState(sharedKey).get('chatRequests').put({a: 1}).get('chatRequests').put({a: 1});

    user.get('chatLinks').get(linkId).put({encryptedSharedKey, ownerEncryptedSharedKey});

    return Channel.formatChatLink({urlRoot, chatWith: key.pub, sharedSecret, linkId});
  }

  /**
  *
  */
  static async getMyChatLinks(urlRoot = 'https://iris.to/', callback: Function, subscribe = false) {
    const key = session.getKey();
    const user = publicState().user();
    const mySecret = await Key.secret(key.epub, key);
    const chatLinks = [];
    user.get('chatLinks').map((data, linkId) => {
      if (!data || chatLinks.indexOf(linkId) !== -1) { return; }
      const channels = [];
      user.get('chatLinks').get(linkId).get('ownerEncryptedSharedKey').on(async enc => {
        if (!enc || chatLinks.indexOf(linkId) !== -1) { return; }
        chatLinks.push(linkId);
        const sharedKey = await Key.decrypt(enc, mySecret);
        const sharedSecret = await Key.secret(sharedKey.epub, sharedKey);
        const url = Channel.formatChatLink({urlRoot, chatWith: key.pub, sharedSecret, linkId});
        if (callback) {
          callback({url, id: linkId});
        }
        if (subscribe) {
          publicState().user(sharedKey.pub).get('chatRequests').map(async (encPub, requestId) => {
            if (!encPub) { return; }
            const s = JSON.stringify(encPub);
            if (channels.indexOf(s) === -1) {
              channels.push(s);
              const pub = await Key.decrypt(encPub, sharedSecret);
              const channel = new Channel({key, participants: pub});
              channel.save();
            }
            publicState(sharedKey).get('chatRequests').get(requestId).put(null);
          });
        }
      });
    });
  }

  /**
  *
  */
  removeGroupChatLink(linkId) {
    this.chatLinks[linkId] = null;
    this.put('chatLinks', this.chatLinks);
    publicState().user().get('chatLinks').get(linkId).put(null);
  }

  /**
  *
  */
  static removePrivateChatLink(key, linkId) {
    publicState().user().auth(key);
    publicState().user().get('chatLinks').get(linkId).put(null);
  }

  /**
  *
  */
  static async deleteChannel(key, pub) {
    publicState().user().auth(key);
    const channelId = await Channel.getOurSecretChannelId(pub, key);
    publicState().user().get('channels').get(channelId).put(null);
    publicState().user().get('channels').get(channelId).off();
  }

  /**
  *
  */
  static async deleteGroup(key, uuid) {
    const mySecret = await Key.secret(key.epub, key);
    const mySecretHash = await util.getHash(mySecret);
    const mySecretUuid = await util.getHash(mySecretHash + uuid);
    publicState().user().auth(key);
    publicState().user().get('channels').get(mySecretUuid).put(null);
    publicState().user().get('channels').get(mySecretUuid).off();
  }
}

export default Channel;
