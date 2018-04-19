/*global describe, it, after, before */
const crypto = require('crypto');
const Message = require('../cjs/message.js');
const util = require('../cjs/util.js');

jest.setTimeout(30000);

describe('Message', function() {
  let msg;
  msg = void 0;
  describe('createRating method', function() {
    beforeAll(function() {
      return msg = Message.createRating({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
    });
    test('should create a message', function() {
      expect(msg).toHaveProperty('signedData.timestamp');
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
      const newMessage = Message.fromJws('eyJhbGciOiJFUzI1NiIsImtleSI6IjMwNTYzMDEwMDYwNzJhODY0OGNlM2QwMjAxMDYwNTJiODEwNDAwMGEwMzQyMDAwNGI5ZjEzZmMxZDE3YzUzNzBkOTZkZDMyZTkzYmJkMDQ3MjJiOTk4ZmMwNWEyNzMzYTUxMWQ5NmY5NDQ5ZjQyN2IxYTBkYmM4NDJiOGQzMTE3M2RlOGY4ZjM0MmVmMWU4NjNlYWVkYWYwYWE0NDI1N2UzNDRkODJhZmY5YTM5OGE5In0.eyJhdXRob3IiOltbIm5hbWUiLCJBbGljZSJdLFsiZW1haWwiLCJhbGljZUBleGFtcGxlLmNvbSJdXSwicmVjaXBpZW50IjpbWyJuYW1lIiwiQm9iIE1hcmxleSJdLFsiZW1haWwiLCJib2JAZXhhbXBsZS5jb20iXV0sInR5cGUiOiJ2ZXJpZmljYXRpb24iLCJ0aW1lc3RhbXAiOiIyMDE4LTA0LTE5VDA1OjM2OjUxLjQ1MFoiLCJjb250ZXh0IjoiaWRlbnRpZmkifQ.v8EhAU3NjddPXwGbuQvKrbuwFWTBeab3Js40JVWEg723fiYUNcm2cv1wk8X9QidBX4ucY4M9vlYexQibLYm36A');
      expect(newMessage).toHaveProperty('signedData');
      console.log('newMessage', newMessage);
      expect(newMessage.verify()).toBe(true);
    });
  });
});
