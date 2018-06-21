/*eslint no-useless-escape: "off", camelcase: "off" */

const UNIQUE_ID_VALIDATORS = {
  email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
  bitcoin: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
  bitcoin_address: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
  ip: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/,
  ipv6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/,
  gpg_fingerprint: null,
  gpg_keyid: null,
  google_oauth2: null,
  tel: /^\d{7,}$/,
  phone: /^\d{7,}$/,
  keyID: null,
  url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
  account: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
};

class Attribute {
  constructor(data) {
    if (data.hasOwnProperty(`val`)) {
      this.val = data.val;
      if (data.hasOwnProperty(`name`)) {
        this.name = data.name;
      } else {
        const n = Attribute.guessTypeOf(this.val);
        if (n) {
          this.name = n;
        } else {
          throw new Error(`Type of attribute was omitted and could not be guessed`);
        }
      }
    }
    else if (Array.isArray(data)) {
      if (data.length !== 2) {
        throw new Error(`Invalid Attribute`);
      }
      this.name = data[0];
      this.val = data[1];
    }
  }

  static getUniqueIdValidators() {
    return UNIQUE_ID_VALIDATORS;
  }

  static isUniqueType(type) {
    return Object.keys(UNIQUE_ID_VALIDATORS).indexOf(type) > - 1;
  }

  static guessTypeOf(value) {
    for (const key in UNIQUE_ID_VALIDATORS) {
      if (value.match(UNIQUE_ID_VALIDATORS[key])) {
        return key;
      }
    }
  }

  toArray() {
    return [this.name, this.val];
  }

  equals(a) {
    return this.name === a.name && this.val === a.val;
  }
}

export default Attribute;
