// @ts-nocheck
import util from './util';
import Fuse from "fuse.js";
import localforage from 'localforage';
import local from './local';
import user from './public';
import privateState from './private';
import Key from './key';

let key: any;
let onlineTimeout: any;
let ourActivity: any;
let noFollows: boolean;
let noFollowers: boolean;
let searchIndex: any;
let initCalled: boolean;
const searchableItems: any = {};

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
    /*
    setTimeout(() => {
      local().get('block').map(() => {
        this.updateSearchIndex();
      });
      this.updateSearchIndex();
    });
     */
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

  updateSearchIndex: util.throttle(() => {
    const options = {keys: ['name', 'display_name'], includeScore: true, includeMatches: true, threshold: 0.3};
    const values = Object.values(_.omit(searchableItems, Object.keys(blockedUsers())));
    searchIndex = new Fuse(values, options);
    local().set('searchIndexUpdated', true);
  }, 2000, {leading:true}),

  saveSearchResult: util.throttle(k => {
      local().set(`contacts/${k}`, {followDistance: searchableItems[k].followDistance,followerCount: searchableItems[k].followers.size});
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
          local().set(`contacts/${k}/name`, name);
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

  updateNoFollows: util.throttle(() => {
    const v = Object.keys(searchableItems).length <= 1;
    if (v !== noFollows) {
      noFollows = v;
      local().set('noFollows', noFollows);
    }
  }, 1000, {leading:true}),

  updateNoFollowers: util.throttle(() => {
    const v = !(searchableItems[key.pub] && (searchableItems[key.pub].followers.size > 0));
    if (v !== noFollowers) {
      noFollowers = v;
      local().set('noFollowers', noFollowers);
    }
  }, 1000, {leading:true}),

  getSearchIndex() {
    return searchIndex;
  },

  setOurOnlineStatus() {
    const activeRoute = window.location.hash;
    Channel.setActivity(ourActivity = 'active');
    const setActive = util.debounce(() => {
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

  /**
   * Log in with a private key.
   * @param key
   */
  async login(k: any, opts = {}) {
    const shouldRefresh = !!key;
    // TODO accept old format iris/gun keys, migrate to new format
    key = await Key.addSecp256k1KeyPair(k);
    localStorage.setItem('iris.myKey', JSON.stringify(key));

    notifications.subscribeToWebPush();
    notifications.getWebPushSubscriptions();
    notifications.subscribeToIrisNotifications();

    notifications.init();
    local().set('loggedIn', true);
    /*
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
     */
    if (shouldRefresh) {
      location.reload();
    }
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
    });
  },

  /**
   * Log out the current user.
   * @returns {Promise<void>}
   */
  async logOut() {
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
};
