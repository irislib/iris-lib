var identifi = require("./index");


var url = "https://www.facebook.com/mmalmi"
var email = "sirius@bitcointalk.org";

console.log("Fetching data for", url)

identifi
  .get_connections("url", url)
  .then(function(connections) {
    console.log("Total connections", connections.length);
  }, function(error) {
    console.log("Error in connections", error);
  });

identifi
  .get_overview("url", url)
  .then(function(overview) {
    console.log("Overview", overview);
  }, function(error) {
    console.log("Error in overview", error);
  });


identifi
  .get_sent("url", url)
  .then(function(sent) {
    console.log("Total sent", sent.length);
  }, function(error) {
    console.log("Error in sent", error);
  });


identifi
  .get_received("url", url)
  .then(function(received) {
    console.log("Total received", received.length);
  }, function(error) {
    console.log("Error in received", error);
  });

identifi
  .get_name("url", url)
  .then(function(user) {
    console.log("Name of the user from url", user.name);
  }, function(error) {
    console.log("Error in received", error);
  });

identifi
  .get_name("email", email)
  .then(function(user) {
    console.log("Name of the user from email", user.name);
  }, function(error) {
    console.log("Error in received", error);
  });


var trustpaths_options = {
  viewpointName: "Identi.fi",
  viewpointType: "keyID",
  viewpointValue: "1DqrzTcimQp3Ye88oHgxdU7DBTsM2TRYFj"
};

identifi
  .get_trustpaths("url", url, trustpaths_options)
  .then(function(trustpaths) {
    console.log("Trustpaths", trustpaths);
  }, function(error) {
    console.log("Error in trustpaths", error);
  });

identifi
  .search("sirius")
  .then(function(results) {
    console.log("Search", results);
  }, function(error) {
    console.log("Error in search", error);
  });

