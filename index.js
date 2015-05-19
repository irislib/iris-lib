var request = require('request');
var Q = require("q");
var querystring = require("querystring");

var add_url_params = function(url, options) {
  var params = querystring.stringify(options);
  if (params) {
     url += "?" + params;
  }

  return url;
};

var build_id_url = function(host, id_type, id_value, method, options) {
  if (!id_value || (!id_type && method !== 'search')) {
    return false;
  }

  id_value = encodeURIComponent(id_value);

  var url = host + "id/" + id_type + "/" + id_value + "/" + method;
  url = add_url_params(url, options);

  return url;
};

var make_request = function(url) {
  var deferred = Q.defer();

  if (!url) {
    deferred.reject({error: "Url can't be made with given data"});
  }

  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if(!body) {
        deferred.reject({error: "API returned empty result"});
      } else {
        deferred.resolve(JSON.parse(body));
      }

    } else if(!error && response.statusCode > 400) {
      deferred.reject({error: "Server returned 4xx error", statusCode: response.statusCode});
    } else if(error) {
      deferred.reject(error);
    }
  });

  return deferred.promise;
};

function isValidPhonenumber(value) {
    return (/^\d{7,}$/).test(value.replace(/[\s()+\-\.]|ext/gi, ''));
}

var identifi = {
  host: 'http://localhost:8080/api/',
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
  get_info: function() {
    return make_request(this.host + "info");
  },
  get_peers: function() {
    return make_request(this.host + "peers");
  },
  get_connections: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "connections", options);
    return make_request(url);
  },
  get_overview: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "", options);
    return make_request(url);
  },
  get_sent: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "sent", options);
    return make_request(url);
  },
  get_received: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "received", options);
    return make_request(url);
  },
  get_trustpaths: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "trustpaths", options);
    return make_request(url);
  },
  get_name: function(id_type, id_value, options) {
    var url = build_id_url(this.host, id_type, id_value, "getname", options);
    return make_request(url);
  },
  search: function(query, options) {
    var url = this.host + 'id/' + query;
    url = add_url_params(url, options);
    return make_request(url);
  }
};


module.exports = identifi;
