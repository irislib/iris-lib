var client = require('./client')
var message = require('./message')

function isValidPhonenumber(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
}

var identifi = {
  VERSION: '0.0.5',
  UNIQUE_ID_VALIDATORS: {
      url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
      account: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      bitcoin: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
      bitcoin_address: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
      ip: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/,
      ipv6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/,
      gpg_fingerprint: null,
      gpg_keyid: null,
      google_oauth2: null,
      phone: isValidPhonenumber,
      tel: isValidPhonenumber,
      keyID: null,
  },
  client: client,
  message: message
};

module.exports = identifi;
