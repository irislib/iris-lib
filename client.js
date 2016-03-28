var rp = require('request-promise');

function encodeId(id) {
  if (id.type || id.value) {
    return encodeURIComponent(id.type || '') + '/' + encodeURIComponent(id.value || '');
  }

  return encodeURIComponent(id);
}

var client = {
  apiRoot: 'http://localhost:8080/api',
  request: function(options) {
    options.json = true;
    options.uri = this.apiRoot;
    if (options.apiMethod) options.uri += '/' + options.apiMethod;
    if (options.apiId) options.uri += '/' + encodeId(options.apiId);
    if (options.apiAction) options.uri += '/' + options.apiAction;
    options.uri += '/';
    return rp(options);
  },
};

module.exports = client;
