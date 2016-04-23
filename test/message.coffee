###global describe, it, after, before ###

'use strict'
Message = require('../message.js')
keyutil = require('../keyutil.js')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use chaiAsPromised
describe 'Message', ->
  msg = undefined
  key = keyutil.generate()
  anotherKey = keyutil.generate()
  describe 'createRating method', ->
    before ->
      msg = Message.createRating
        author: [['email', 'alice@example.com']]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
        context: 'identifi'
    it 'should create a message', ->
      msg.should.have.deep.property 'signedData.timestamp'
  describe 'Validate method', ->
    it 'should not accept a message without signedData', ->
      data = signedData: {}
      f = ->
        Message.validate JSON.stringify(data)
      f.should.throw Error
  describe 'Message signature', ->
    before ->
      msg = Message.createRating
        author: [['email', 'alice@example.com']]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
        context: 'identifi'
    it 'should be created with sign()', ->
      Message.sign msg, key.private.pem, key.public.hex
      msg.should.have.property 'jws'
      msg.should.have.property 'jwsHeader'
      msg.should.have.property 'hash'
    it 'should be accepted by verify()', ->
      Message.verify msg
    it 'should verify should not accept an invalid signature', ->
      Message.sign msg, key.private.pem, anotherKey.public.hex
      f = ->
        Message.verify msg
      f.should.throw Error
    it 'should allow keyID author if same as signing key', ->
      msg = Message.createRating
        author: [['keyID', key.hash]]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
        context: 'identifi'
      Message.sign msg, key.private.pem, key.public.hex
      Message.validate msg
    it 'should fail if keyID author and signing key are different', ->
      msg = Message.createRating
        author: [['keyID', key.hash]]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
        context: 'identifi'
      Message.sign msg, anotherKey.private.pem, anotherKey.public.hex
      f = ->
        Message.validate msg
      f.should.throw Error
  describe 'Deserialize method', ->
    it 'should not accept invalid data', ->
      jws = 'asdf'

      f = ->
        Message.deserialize jws

      f.should.throw Error
  describe 'Decode method', ->
    it 'should successfully decode signedData from jws', ->
      msg = Message.createRating
        author: [['email', 'alice@example.com']]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
        context: 'identifi'
      Message.sign msg, key.private.pem, key.public.hex
      newMessage = { jws: msg.jws }
      Message.decode(newMessage)
      newMessage.signedData.should.not.be.empty
