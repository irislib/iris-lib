var rp = require('request-promise');
var jws = require('jws');

var client = {
  apiRoot: 'http://127.0.0.1:4944/api',
  request: function(options) {
    options.json = options.json !== undefined ? options.json : true;
    options.uri = options.uri !== undefined ? options.uri : this.apiRoot;
    if (options.apiMethod)  { options.uri += '/' + options.apiMethod; }
    if (options.apiIdType)  { options.uri += '/' + encodeURIComponent(options.apiIdType); }
    if (options.apiId)      { options.uri += '/' + encodeURIComponent(options.apiId); }
    if (options.apiAction)  { options.uri += '/' + options.apiAction; }
    return rp(options);
  },
  getSocket: function(opts) {
    opts = Object.assign({ url: this.apiRoot, options: {} }, opts);
    if (opts.isPeer) {
      opts.options.extraHeaders = {
        'X-Accept-Incoming-Connections': true
      };
    }
    return require('socket.io-client')(opts.url, opts.options);
  },
  getJwt: function(signingKeyPem, payload) {
    var exp = Math.floor(Date.now() / 1000) + 60;
    payload = Object.assign({ sub: 'admin', exp: exp }, payload);
    return jws.sign({
      header: { typ: 'JWT', alg: 'ES256' },
      payload: payload,
      privateKey: signingKeyPem
    });
  }
};

module.exports = client;
