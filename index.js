var request = require('request');
var Q = require("q");
var querystring = require("querystring")

var build_url = function(user, method, id_type, options) {
  if(!user || !id_type) {
    return false;
  }

  // Maybe this should be on every call?
  if(id_type === "url" || id_type === "email" || id_type === "account") {
    user = encodeURIComponent(user);
  }

  var url = "http://identi.fi/api/id/" + id_type + "/" + user + "/" + method;

  var params = querystring.stringify(options);
  if(params) {
     url += "?" + params;
  }

  return url;
};

var make_request = function(url) {
  var deferred = Q.defer();

  if(!url) {
    deferred.reject({error: "Url can't be made with given data"});
  }

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
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
    ]
  },
  get_connections: function(user, id_type, options) {
    var url = build_url(user, "connections", id_type, options);
    return make_request(url);
  },
  get_overview: function(user, id_type, options) {
    var url = build_url(user, "overview", id_type, options);
    return make_request(url);
  },
  get_sent: function(user, id_type, options) {
    var url = build_url(user, "sent", id_type, options);
    return make_request(url);
  },
  get_received: function(user, id_type, options) {
    var url = build_url(user, "received", id_type, options);
    return make_request(url);
  },
  get_trustpaths: function(user, id_type, options) {
    var url = build_url(user, "trustpaths", id_type, options);
    return make_request(url);
  },
  get_name: function(user, id_type, options) {
    var url = build_url(user, "getname", id_type, options);
    return make_request(url);
  }
};


module.exports = identifi;