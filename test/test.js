/*global describe, it */
'use strict';
var expect = require('expect.js');
var example = require('../example.js');
var identifi = require('../index.js');

describe('identifi-lib node module', function () {
  it('Should run the example', function () {
    example();
  });

  it('Should display version number', function () {
    expect(identifi.VERSION).to.equal("0.0.3");
  });
});
