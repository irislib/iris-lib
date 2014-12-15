var request = require('request');
var Q = require("q");
var querystring = require("querystring");

var host = "http://identi.fi/api/";

var add_url_params = function(url, options) {
  var params = querystring.stringify(options);
  if (params) {
     url += "?" + params;
  }

  return url;
};

var build_id_url = function(id_type, id_value, method, options) {
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



var identifi = {
  valid_id_types: function() {
    return [
      'url',
      'account',
      'email',
      'bitcoin',
      'bitcoin_address',
      'keyID',
      'gpg_fingerprint',
      'gpg_keyid',
      'phone',
      'tel',
      'google_oauth2'
    ];
  },
  get_connections: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "connections", options);
    return make_request(url);
  },
  get_overview: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "overview", options);
    return make_request(url);
  },
  get_sent: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "sent", options);
    return make_request(url);
  },
  get_received: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "received", options);
    return make_request(url);
  },
  get_trustpaths: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "trustpaths", options);
    return make_request(url);
  },
  get_name: function(id_type, id_value, options) {
    var url = build_id_url(id_type, id_value, "getname", options);
    return make_request(url);
  },
  search: function(query, options) {
    var url = host + 'id/' + query;
    url = add_url_params(url, options);
    return make_request(url);
  }
};


module.exports = identifi;

