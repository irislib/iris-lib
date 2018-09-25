/*eslint no-useless-escape: "off", camelcase: "off" */

import Gun from 'gun';
import sea from 'gun/sea';

let isNode = false;
try {
  isNode = Object.prototype.toString.call(global.process) === `[object process]`;
} catch (e) { null; }

export default {
  sea: (Gun.SEA || window.Gun.SEA),

  async getHash(str, format = `base64`) {
    if (!str) {
      return undefined;
    }
    const hash = await this.sea.work(str, null, null, {name: 'SHA-256'});
    return Buffer.from(hash).toString(format);
  },

  timeoutPromise(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((resolve => {
        setTimeout(() => {
          resolve();
        }, timeout);
      })),
    ]);
  },

  isNode,
};
