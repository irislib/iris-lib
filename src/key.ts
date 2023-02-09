import session from './session';
import { nip04, signEvent, Event } from 'nostr-tools';

export default {
  decryptedMessages: new Map<string, string>(),
  windowNostrQueue: [],
  isProcessingQueue: false,
  encrypt: async function (data: string, pub?: string): Promise<string> {
    const k = session.getKey().secp256k1;
    pub = pub || k.rpub;
    if (k.priv) {
      return nip04.encrypt(k.priv, pub, data);
    } else if (window.nostr) {
      return new Promise((resolve) => {
        this.processWindowNostr({ op: 'encrypt', data, pub, callback: resolve });
      });
    } else {
      return Promise.reject('no private key');
    }
  },
  decrypt: async function (data: string, pub?: string): Promise<string> {
    const k = session.getKey().secp256k1;
    pub = pub || k.rpub;
    if (k.priv) {
      return nip04.decrypt(k.priv, pub, data);
    } else if (window.nostr) {
      return new Promise((resolve) => {
        this.processWindowNostr({ op: 'decrypt', data, pub, callback: resolve });
      });
    } else {
      return Promise.reject('no private key');
    }
  },
  sign: async function (event: Event) {
    const priv = session.getKey().secp256k1.priv;
    if (priv) {
      return signEvent(event, priv);
    } else if (window.nostr) {
      return new Promise((resolve) => {
        this.processWindowNostr({ op: 'sign', data: event, callback: resolve });
      });
    } else {
      return Promise.reject('no private key');
    }
  },
  processWindowNostr(item: any) {
    this.windowNostrQueue.push(item);
    if (!this.isProcessingQueue) {
      this.processWindowNostrQueue();
    }
  },
  async processWindowNostrQueue() {
    if (!this.windowNostrQueue.length) {
      this.isProcessingQueue = false;
      return;
    }
    this.isProcessingQueue = true;
    const { op, data, pub, callback } = this.windowNostrQueue[0];

    let fn = Promise.resolve();
    if (op === 'decrypt') {
      fn = this.handlePromise(window.nostr.nip04.decrypt(pub, data), callback);
    } else if (op === 'encrypt') {
      fn = this.handlePromise(window.nostr.nip04.encrypt(pub, data), callback);
    } else if (op === 'sign') {
      fn = this.handlePromise(window.nostr.signEvent(data), (signed) => callback(signed.sig));
    }
    await fn;
    this.windowNostrQueue.shift();
    this.processWindowNostrQueue();
  },
  handlePromise(promise, callback) {
    return promise
      .then((result) => {
        callback(result);
      })
      .catch((error) => {
        console.error(error);
      });
  },
}