// @ts-nocheck
import Gun from 'gun';
import notifications from './notifications';
import Channel from './Channel';
import util from './util';
import _ from './lodash';
import Fuse from "fuse.js";
import localforage from 'localforage';
import local from './local';
import electron from './electron';
import user from './public';
import privateState from './private';
import blockedUsers from './blockedUsers';
import Key from './Key';

let key: any;
let myName: string;
let latestChatLink: string;
let onlineTimeout: any;
let ourActivity: any;
let noFollows: boolean;
let noFollowers: boolean;
let searchIndex: any;
let initCalled: boolean;
const searchableItems: any = {};
const getExtendedFollowsCalled = new Map<string, number>();

const DEFAULT_FOLLOW = 'hyECQHwSo7fgr2MVfPyakvayPeixxsaAWVtZ-vbaiSc.TXIp8MnCtrnW6n2MrYquWPcc-DTmZzMBmc2yaGv9gIU';

const DEFAULT_SETTINGS = {
  electron: {
    openAtLogin: true,
    minimizeOnClose: true
  },
  local: {
    enableWebtorrent: true,
    enablePublicPeerDiscovery: true,
    autoplayWebtorrent: true,
    maxConnectedPeers: util.isElectron ? 2 : 1
  }
}

/**
 * User session management utilities.
 */
export default {
  /**
   * Log in with a key from localStorage.
   *
   * If no key is found and options.autologin is not false, a new user will be created.
   *
   * If options.autofollow is not false, the default follow will be added.
   * @param options
   */
  init(options: any = {}) {
    if (initCalled) { return; }
    initCalled = true;
    let localStorageKey = localStorage.getItem('iris.myKey');
    if (!localStorageKey) {
      localStorageKey = localStorage.getItem('chatKeyPair');
    }
    if (localStorageKey) {
      this.login(JSON.parse(localStorageKey), options);
    } else if (options.autologin !== false) {
      this.loginAsNewUser(options);
    } else {
      this.clearIndexedDB();
    }
    setTimeout(() => {
      local().get('block').map(() => {
        this.updateSearchIndex();
      });
      this.updateSearchIndex();
    });
    setInterval(() => {
      if (this.taskQueue.length) {
        //console.log('this.taskQueue', this.taskQueue.length);
        const t = this.taskQueue.shift();
        t && t();
      }
    }, 10);
  },

  DEFAULT_SETTINGS,
  DEFAULT_FOLLOW,

  taskQueue: [] as any[],

  updateSearchIndex: _.throttle(() => {
    const options = {keys: ['name', 'display_name'], includeScore: true, includeMatches: true, threshold: 0.3};
    const values = Object.values(_.omit(searchableItems, Object.keys(blockedUsers())));
    searchIndex = new Fuse(values, options);
    local().get('searchIndexUpdated').put(true);
  }, 2000, {leading:true}),

  saveSearchResult: _.throttle(k => {
      local().get('contacts').get(k).put({followDistance: searchableItems[k].followDistance,followerCount: searchableItems[k].followers.size});
  }, 1000, {leading:true}),

  addFollow(callback: Function, k: string, followDistance: number, follower?: string) {
    if (searchableItems[k]) {
      if (searchableItems[k].followDistance > followDistance) {
        searchableItems[k].followDistance = followDistance;
      }
      follower && searchableItems[k].followers?.add(follower);
    } else {
      searchableItems[k] = {key: k, followDistance, followers: new Set(follower && [follower])};
      this.taskQueue.push(() => {
        user(k).get('profile').get('name').on((name: string) => {
          searchableItems[k].name = name;
          local().get('contacts').get(k).get('name').put(name);
          callback && callback(k, searchableItems[k]);
        });
      });
    }
    this.saveSearchResult(k);
    callback && callback(k, searchableItems[k]);
    this.updateSearchIndex();
    this.updateNoFollows();
    this.updateNoFollowers();
  },

  addToSearchIndex(key: string, item: any) {
    searchableItems[key] = item;
    this.updateSearchIndex();
  },

  removeFollow(k: string, followDistance: number, follower: string) {
    if (followDistance === 1) {
      local().get('contacts').get(k).put(false);
      local().get('groups').get('follows').get(k).put(false);
      if (searchableItems[k]) {
        searchableItems[k].followers.delete(follower);
        this.updateNoFollows();
        this.updateNoFollowers();
      }
    }
    //console.log('removeFollow', k, followDistance, follower);
    if (searchableItems[k] && searchableItems[k].followers.size === 0) {
      delete searchableItems[k];
      local().get('contacts').get(k).put(false);
      local().get('groups').get('everyone').get(k).put(false);
    }
  },

  getExtendedFollows(callback: Function, k = key.pub, maxDepth = 3, currentDepth = 1) {
    const called = getExtendedFollowsCalled.get(k);
    if (called && called <= currentDepth) {
      return;
    }
    getExtendedFollowsCalled.set(k, currentDepth);

    this.addFollow(callback, k, currentDepth - 1);

    user(k).get('follow').map().on((isFollowing: boolean, followedKey: string) => { // TODO: unfollow
      if (isFollowing) {
        this.addFollow(callback, followedKey, currentDepth, k);
        if (currentDepth < maxDepth) {
          this.taskQueue.push(() => this.getExtendedFollows(callback, followedKey, maxDepth, currentDepth + 1));
        }
      } else {
        this.removeFollow(followedKey, currentDepth, k);
      }
    });

    return searchableItems;
  },

  updateNoFollows: _.throttle(() => {
    const v = Object.keys(searchableItems).length <= 1;
    if (v !== noFollows) {
      noFollows = v;
      local().get('noFollows').put(noFollows);
    }
  }, 1000, {leading:true}),

  updateNoFollowers: _.throttle(() => {
    const v = !(searchableItems[key.pub] && (searchableItems[key.pub].followers.size > 0));
    if (v !== noFollowers) {
      noFollowers = v;
      local().get('noFollowers').put(noFollowers);
    }
  }, 1000, {leading:true}),

  getSearchIndex() {
    return searchIndex;
  },

  setOurOnlineStatus() {
    const activeRoute = window.location.hash;
    Channel.setActivity(ourActivity = 'active');
    const setActive = _.debounce(() => {
      const chatId = activeRoute && activeRoute.replace('#/profile/','').replace('#/chat/','');
      const chat = privateState(chatId);
      if (chat && !ourActivity) {
        chat.setMyMsgsLastSeenTime();
      }
      Channel.setActivity(ourActivity = 'active');
      clearTimeout(onlineTimeout);
      onlineTimeout = setTimeout(() => Channel.setActivity(ourActivity = 'online'), 30000);
    }, 1000);
    document.addEventListener("touchmove", setActive);
    document.addEventListener("mousemove", setActive);
    document.addEventListener("keypress", setActive);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === 'visible') {
        Channel.setActivity(ourActivity = 'active');
        const chatId = location.pathname.slice(1).replace('chat/','');
        const chat = activeRoute && privateState(chatId);
        if (chat) {
          chat.setMyMsgsLastSeenTime();
          notifications.changeChatUnseenCount(chatId, 0);
        }
      } else {
        Channel.setActivity(ourActivity = 'online');
      }
    });
    setActive();
    window.addEventListener("beforeunload", () => {
      Channel.setActivity(ourActivity = null);
    });
  },

  updateGroups() {
    this.getExtendedFollows((k: string, info: any) => {
      if (info.followDistance <= 1) {
        local().get('groups').get('follows').get(k).put(true);
      }
      local().get('groups').get('everyone').get(k).put(true);
      if (k === this.getPubKey()) {
        this.updateNoFollowers();
      }
    });
  },

  /**
   * Log in with a private key.
   * @param key
   */
  async login(k: any, opts = {}) {
    const shouldRefresh = !!key;
    key = await Key.addSecp256k1KeyPair(k);
    localStorage.setItem('iris.myKey', JSON.stringify(key));
    user().auth(key);
    user().put({epub: key.epub});
    user().get('likes').put({a:null}); // gun bug?
    user().get('msgs').put({a:null}); // gun bug?
    user().get('replies').put({a:null}); // gun bug?

    if (key.secp256k1.priv) {
      const sig = await Key.schnorrSign(key.pub, key.secp256k1.priv);
      const proof = JSON.stringify({pub: key.pub, rpub: key.secp256k1.rpub, sig});
      user().get('profile').get('nostr').put(proof);
    }

    notifications.subscribeToWebPush();
    notifications.getWebPushSubscriptions();
    notifications.subscribeToIrisNotifications();
    if (opts.initChannels) {
      Channel.getMyChatLinks( undefined, (chatLink: any) => {
        local().get('chatLinks').get(chatLink.id).put(chatLink.url);
        latestChatLink = chatLink.url;
      });
      Channel.getChannels( (c: Channel) => this.addChannel(c));
    }
    user().get('profile').get('name').on((name: any) => {
      if (name && typeof name === 'string') {
        myName = name;
      }
    });
    this.setOurOnlineStatus();
    notifications.init();
    local().get('loggedIn').put(true);
    local().get('settings').once().then(settings => {
      if (!settings) {
        local().get('settings').put(DEFAULT_SETTINGS.local);
      } else if (settings.enableWebtorrent === undefined || settings.autoplayWebtorrent === undefined) {
        local().get('settings').get('enableWebtorrent').put(DEFAULT_SETTINGS.local.enableWebtorrent);
        local().get('settings').get('autoplayWebtorrent').put(DEFAULT_SETTINGS.local.autoplayWebtorrent);
      }
    });
    user().get('block').map().on((isBlocked: boolean, user: string) => {
      local().get('block').get(user).put(isBlocked);
      if (isBlocked) {
        delete searchableItems[user];
      }
    });
    this.updateGroups();
    if (shouldRefresh) {
      location.reload();
    }
    if (electron) {
      electron.get('settings').on(electron => {
        local().get('settings').get('electron').put(electron);
      });
      electron.get('user').put(key.pub);
    }
    local().get('filters').get('group').once().then(v => {
      if (!v) {
        local().get('filters').get('group').put('follows');
      }
    });
  },

  /**
   * Create a new user account and log in.
   * @param options {Object} - Options for the new account.
   * @returns {Promise<*>}
   */
  loginAsNewUser(options: any = {}) {
    const name = options.name || util.generateName();
    console.log('loginAsNewUser name', name);
    return Gun.SEA.pair().then(async k => {
      await this.login(k, options);
      user().get('profile').put({a:null});
      user().get('profile').get('name').put(name);
      local().get('filters').put({a:null});
      local().get('filters').get('group').put('follows');
      Channel.createChatLink().then(l => latestChatLink = l);
      setTimeout(() => {
        if (options.autofollow !== false) {
          console.log('autofollowing', DEFAULT_FOLLOW);
          user().get('follow').get(DEFAULT_FOLLOW).put(true);
        }
      }, 1000); // maybe wait for login return instead
    });
  },

  /**
   * Log out the current user.
   * @returns {Promise<void>}
   */
  async logOut() {
    if (electron) {
      electron.get('user').put(null);
    }
    // TODO: remove subscription from your channels
    if (navigator.serviceWorker) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && reg.pushManager) {
        reg.active?.postMessage({key: null});
        const sub = await reg.pushManager.getSubscription();
        if (sub) {
          const hash = await util.getHash(JSON.stringify(sub));
          notifications.removeSubscription(hash);
          sub.unsubscribe && sub.unsubscribe();
        }
      }
    }
    this.clearIndexedDB();
    localStorage.clear(); // TODO clear only iris data
    localforage.clear().then(() => {
      window.location.hash = '';
      window.location.href = '/';
      location.reload();
    });
  },

  clearIndexedDB() {
    return new Promise(resolve => {
      const r1 = window.indexedDB.deleteDatabase('local()');
      const r2 = window.indexedDB.deleteDatabase('radata');
      let r1done = false;
      let r2done = false;
      const check = () => {
        r1done && r2done && resolve(undefined);
      }
      r1.onerror = r2.onerror = e => console.error(e);
      //r1.onblocked = r2.onblocked = e => console.error('blocked', e);
      r1.onsuccess = () => {
        r1done = true;
        check();
      }
      r2.onsuccess = () => {
        r2done = true;
        check();
      }
    });
  },

  getMyChatLink() {
    return latestChatLink || util.getProfileLink(key.pub);
  },

  /**
   * Get the keypair of the logged in user.
   * @returns {*}
   */
  getKey() { return key; },

  /**
   * Get the public key of the logged in user.
   * @returns {*}
   */
  getPubKey() {
    return key && key.pub;
  },

  /**
   * Get the name of the logged in user.
   * @returns {*}
   */
  getMyName() { return myName; }, // TODO maybe remove and use iris.user().get('profile').get('name') instead?

  myPeerUrl: (ip: string) => `http://${ip}:8767/gun`,

  async shareMyPeerUrl(channel: Channel) {
    const myIp = await local().get('settings').get('electron').get('publicIp').once();
    myIp && channel.put && channel.put('my_peer', this.myPeerUrl(myIp));
  },

  newChannel(pub: string, chatLink?: string) {
    if (!pub || this.channelIds.has(pub)) {
      return;
    }
    const chat = privateState(pub, chatLink);
    this.addChannel(chat);
    return chat;
  },

  addChannel(chat: Channel) {
    this.taskQueue.push(() => {
      let pub = chat.getId();
      if (this.channelIds.has(pub)) { return; }
      this.channelIds.add(pub);
      const chatNode = local().get('channels').get(pub);
      chatNode.get('latestTime').on((t: string) => {
        if (t && (!chat.latestTime || t > chat.latestTime)) {
          chat.latestTime = t;
        } else {
          // chatNode.get('latestTime').put(chat.latestTime); // omg recursion
        }
      });
      chatNode.get('theirMsgsLastSeenTime').on((t: string) => {
        if (!t) { return; }
        const d = new Date(t);
        if (!chat.theirMsgsLastSeenDate || chat.theirMsgsLastSeenDate < d) {
          chat.theirMsgsLastSeenDate = d;
        }
      });
      chat.getLatestMsg && chat.getLatestMsg((latest: any, info: any) => {
        this.processMessage(pub, latest, info);
      });
      notifications.changeChatUnseenCount(pub, 0);
      chat.notificationSetting = 'all';
      chat.onMy('notificationSetting', (val: any) => {
        chat.notificationSetting = val;
      });
      //$(".chat-list").append(el);
      chat.theirMsgsLastSeenTime = '';
      chat.getTheirMsgsLastSeenTime((time: any) => {
        if (chat && time && time >= chat.theirMsgsLastSeenTime) {
          chat.theirMsgsLastSeenTime = time;
          chatNode.get('theirMsgsLastSeenTime').put(time);
        }
      });
      chat.getMyMsgsLastSeenTime((time: any) => {
        chat.myLastSeenTime = new Date(time);
        if (chat.latest && chat.myLastSeenTime >= chat.latest.time) {
          notifications.changeChatUnseenCount(pub, 0);
        }
      });
      chat.isTyping = false;
      chat.getTyping(isTyping => {
        chat.isTyping = isTyping;
        local().get('channels').get(pub).get('isTyping').put(isTyping);
      });
      chat.online = {};
      Channel.getActivity(pub, (activity) => {
        if (chat) {
          chatNode.put({theirLastActiveTime: activity && activity.lastActive, activity: activity && activity.isActive && activity.status});
          chat.activity = activity;
        }
      });
      if (chat.uuid) {
        let isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        chat.participantProfiles = {};
        chat.on('name', v => {
          chat.name = v;
          searchableItems[chat.uuid] = {name: v, uuid: chat.uuid};
          local().get('channels').get(chat.uuid).get('name').put(v);
        });
        chat.on('photo', v => {
          searchableItems[chat.uuid] = searchableItems[chat.uuid] || {};
          searchableItems[chat.uuid].photo = v;
          local().get('channels').get(chat.uuid).get('photo').put(v)
        });
        chat.on('about', v => local().get('channels').get(chat.uuid).get('about').put(v));
        chat.getParticipants(participants => {
          delete participants.undefined; // TODO fix where it comes from
          if (typeof participants === 'object') {
            let keys = Object.keys(participants);
            keys.forEach((k, i) => {
              let hue = 360 / Math.max(keys.length, 2) * i; // TODO use css filter brightness
              chat.participantProfiles[k] = {permissions: participants[k], color: `hsl(${hue}, 98%, ${isDarkMode ? 80 : 33}%)`};
              user(k).get('profile').get('name').on(name => {
                chat.participantProfiles[k].name = name;
              });
            });
          }
          local().get('channels').get(chat.uuid).get('participants').put(participants);
        });
        chat.inviteLinks = {};
        chat.getChatLinks({callback: ({url, id}) => {
          console.log('got chat link', id, url);
          chat.inviteLinks[id] = url; // TODO use State
          local().get('inviteLinksChanged').put(true);
        }});
      } else {
        // TODO do we want this?
        user(pub).get('profile').get('name').on(v => local().get('channels').get(pub).get('name').put(v))
      }
      if (chat.put) {
        chat.onTheir('webPushSubscriptions', (s, k, from) => {
          if (!Array.isArray(s)) { return; }
          chat.webPushSubscriptions = chat.webPushSubscriptions || {};
          chat.webPushSubscriptions[from || pub] = s;
        });
        const arr = Object.values(notifications.webPushSubscriptions);
        setTimeout(() => chat.put('webPushSubscriptions', arr), 5000);
        this.shareMyPeerUrl(chat);
      }
      chat.onTheir('call', call => {
        local().get('call').put({pub, call});
      });
      local().get('channels').get(pub).put({enabled:true});
      /* Disable private peer discovery, since they're not connecting anyway
      if (chat.onTheir) {
        chat.onTheir('my_peer', (url, k, from) => {
          console.log('Got private peer url', url, 'from', from);
          peers.addPeer({url, from})
        });
      }
       */

    });
  },

  // TODO: should perhaps be in Channel
  processMessage(chatId: string, msg: any, info: any, onClickNotification?: Function) {
    const chat = privateState(chatId);
    chat.messageIds = chat.messageIds || {};
    if (chat.messageIds[msg.time + info.from]) return;
    chat.messageIds[msg.time + info.from] = true;
    if (info) {
      msg = Object.assign(msg, info);
    }
    if (msg.invite) {
      const chatLink = `https://iris.to/?channelId=${msg.invite.group}&inviter=${chatId}`;
      this.newChannel(msg.invite.group, chatLink);
      return;
    }
    msg.selfAuthored = info.selfAuthored;
    local().get('channels').get(chatId).get('msgs').get(msg.time + (msg.from && msg.from.slice(0, 10))).put(JSON.stringify(msg));
    msg.timeObj = new Date(msg.time);
    if (!info.selfAuthored && msg.timeObj > chat.myLastSeenTime) {
      if (window.location.hash !== `#/chat/${  chatId}` || document.visibilityState !== 'visible') {
        notifications.changeChatUnseenCount(chatId, 1);
      } else if (ourActivity === 'active') {
          chat.setMyMsgsLastSeenTime();
        }
    }
    if (!info.selfAuthored && msg.time > chat.theirMsgsLastSeenTime) {
      local().get('channels').get(chatId).get('theirMsgsLastSeenTime').put(msg.time);
    }
    if (!chat.latestTime || (msg.time > chat.latestTime)) {
      local().get('channels').get(chatId).put({
        latestTime: msg.time,
        latest: {time: msg.time, text: msg.text, selfAuthored: info.selfAuthored}
      });
    }
    // TODO: onclickNotification should do       route(`/chat/${  pub}`);
    notifications.notifyMsg(msg, info, chatId, onClickNotification);
  },

  subscribeToMsgs(pub) {
    const c = privateState(pub);
    if (c.subscribed) { return; }
    c.subscribed = true;
    c.getMessages((msg, info) => {
      this.processMessage(pub, msg, info);
    });
  },

  /**
   * Known private channels with other users
   */
  channelIds: new Set(),
};
