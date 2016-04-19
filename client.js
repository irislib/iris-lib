var rp = require('request-promise');

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
  }
};

module.exports = client;
