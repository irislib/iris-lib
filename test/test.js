/*jshint unused:false*/
/*jshint -W030 */
/*global describe, it */
'use strict';
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

var example = require('../example.js');
var identifi = require('../index.js');

var testId = { type: 'email', value: 'sirius@iki.fi'};

describe('identifi-lib node module', function () {
  it('Should run the example', function () { 
    example();
  });

  it('Should display version number', function () {
    identifi.VERSION.should.equal("0.0.4");
  });
});

describe('methods', function() {
  this.timeout(10000);
  it('Should return connections', function (done) {
    var connections = identifi.get_connections(testId.type, testId.value);
    connections.should.eventually.not.be.empty.notify(done);
  });

  it('Should return overview', function (done) {
    var overview = identifi.get_overview(testId.type, testId.value);
    overview.should.eventually.not.be.empty.notify(done);
  });

  it('Should return received', function (done) {
    var received = identifi.get_received(testId.type, testId.value);
    received.should.eventually.not.be.empty.notify(done);
  });

  it('Should return sent', function (done) {
    var sent = identifi.get_sent(testId.type, testId.value);
    sent.should.eventually.not.be.empty.notify(done);
  });
});
