/*global describe, it, after, before */
const crypto = require('crypto');
const Message = require('../cjs/message.js');
const Identity = require('../cjs/identity.js');
const util = require('../cjs/util.js');

jest.setTimeout(30000);

describe('Message', function() {
  let msg;
  msg = void 0;
  describe('createRating method', function() {
    test('should create a rating message', function() {
      msg = Message.createRating({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
      expect(msg).toHaveProperty('signedData.timestamp');
      expect(msg.signedData.type).toEqual('rating');
    });
    test('should get message author and recipient', function() {
      expect(msg.getAuthor()).toBeInstanceOf(Identity);
      expect(msg.getRecipient()).toBeInstanceOf(Identity);
    });
    test('should use signing key as author if not defined', function() {
      msg = Message.createRating({
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
      const defaultKey = util.getDefaultKey('.');
      expect(msg).toHaveProperty('signedData.author');
      expect(JSON.stringify(msg.signedData.author)).toEqual('[["keyID","' + defaultKey.keyID + '"]]');
    });
  });
  describe('createVerification method', function() {
    test('should create a verification message', function() {
      msg = Message.createVerification({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        comment: 'Good guy'
      });
      expect(msg).toHaveProperty('signedData.timestamp');
      expect(msg.signedData.type).toEqual('verification');
    });
  });
  describe('Validation', function() {
    test('should not accept a message without signedData', function() {
      const f = function() {
        new Message({});
      };
      expect(f).toThrow(Error);
    });
  });
  describe('Message signature', function() {
    let key;
    msg = void 0;
    beforeAll(function() {
      msg = Message.createRating({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
      key = util.generateKey();
    });
    test('should be signed with sign()', function() {
      msg.sign(key);
      expect(msg).toHaveProperty('jws');
      expect(msg).toHaveProperty('jwsHeader');
      expect(msg).toHaveProperty('hash');
    });
    test('should be verified with verify()', function() {
      expect(msg.verify()).toBe(true);
    });
  });
  describe('fromJws method', function() {
    test('should successfully create a message from jws', function() {
      const newMessage = Message.fromJws(msg.jws);
      expect(newMessage).toHaveProperty('signedData');
    });
    test('should successfully create a message from jws', function() {
      const newMessage = Message.fromJws('eyJhbGciOiJFUzI1NiIsImtleSI6IjMwNTkzMDEzMDYwNzJhODY0OGNlM2QwMjAxMDYwODJhODY0OGNlM2QwMzAxMDcwMzQyMDAwNGFlZjYxY2Q0YzM2ZWFhZjM0N2IzMDI3NTZiYzgwM2QyOTFmOGY2ODdiOWIyNzExNjhlMzI2ZWM4MzA0ZjYxZjJiY2JkOGMyNzY0OGJmMjEzY2M2NDk2NTQ4YjJkNWE3MzY1MDA2MzNiMDE2MTA2MGU3MGI4YWY1YTExMmFiZDIxIn0.eyJhdXRob3IiOltbImVtYWlsIiwiYWxpY2VAZXhhbXBsZS5jb20iXV0sInJlY2lwaWVudCI6W1siZW1haWwiLCJib2JAZXhhbXBsZS5jb20iXV0sInJhdGluZyI6NSwiY29tbWVudCI6Ikdvb2QgZ3V5IiwidHlwZSI6InJhdGluZyIsIm1heFJhdGluZyI6MTAsIm1pblJhdGluZyI6LTEwLCJ0aW1lc3RhbXAiOiIyMDE4LTA0LTIwVDA5OjI0OjE5LjM4MVoiLCJjb250ZXh0IjoiaWRlbnRpZmkifQ.dpQlogs0XG68tM3PzLoJgphYSCIZSYThs7dTEt0p9RxtQomNV4Ikm8lD5xSCk9qYxwNFHCQsKd4pbSP4SFNmtQ');
      expect(newMessage).toHaveProperty('signedData');
      expect(newMessage.verify()).toBe(true);
    });
  });
});
