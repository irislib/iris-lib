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

function guessTypeOf(value) {
  for (const key in UNIQUE_ID_VALIDATORS) {
    if (value.match(UNIQUE_ID_VALIDATORS[key])) {
      return key;
    }
  }
}

export default {
  UNIQUE_ID_VALIDATORS,
  guessTypeOf,
};
