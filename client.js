var rp = require('request-promise');

var client = {
  apiRoot: 'http://localhost:4944/api',
  request: function(options) {
    options.json = options.json !== undefined ? options.json : true;
    options.uri = options.uri !== undefined ? options.uri : this.apiRoot;
    if (options.apiMethod)  { options.uri += '/' + options.apiMethod; }
    if (options.apiIdType)  { options.uri += '/' + encodeURIComponent(options.apiIdType); }
    if (options.apiId)      { options.uri += '/' + encodeURIComponent(options.apiId); }
    if (options.apiAction)  { options.uri += '/' + options.apiAction; }
    return rp(options);
  },
};

module.exports = client;
