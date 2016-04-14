###global describe, it, after, before ###

'use strict'
crypto = require('crypto')
Message = require('../message.js')
keyutil = require('../keyutil.js')
chai = require('chai')
chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use chaiAsPromised
describe 'Message', ->
  msg = undefined
  describe 'createRating method', ->
    before ->
      msg = Message.createRating
        author: [['email', 'alice@example.com']]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
    it 'should create a message', ->
      msg.should.have.deep.property 'signedData.timestamp'
  describe 'Validate method', ->
    it 'should not accept a message without signedData', ->
      data = signedData: {}

      f = ->
        Message.validate JSON.stringify(data)

      f.should.throw Error
  describe 'Message signature', ->
    msg = undefined
    key = undefined
    before ->
      msg = Message.createRating
        author: [['email', 'alice@example.com']]
        recipient: [['email', 'bob@example.com']]
        rating: 5
        comment: 'Good guy'
      key = keyutil.generate()
    it 'should be created with sign()', ->
      Message.sign msg, key.private.pem, key.public.hex
      msg.should.have.property 'jws'
      msg.should.have.property 'jwsHeader'
      msg.should.have.property 'hash'
    it 'should be accepted by verify()', ->
      Message.verify msg
    it 'should verify should not accept an invalid signature', ->
      anotherKey = keyutil.generate()
      Message.sign msg, key.private.pem, anotherKey.public.hex
      f = ->
        Message.verify msg
      f.should.throw Error
  describe 'Deserialize method', ->
    it 'should not accept invalid data', ->
      jws = 'asdf'

      f = ->
        Message.deserialize jws

      f.should.throw Error
  describe 'Decode method', ->
    it 'should successfully decode signedData from jws', ->
      newMessage = { jws: msg.jws }
      Message.decode(newMessage)
      newMessage.signedData.should.not.be.empty
