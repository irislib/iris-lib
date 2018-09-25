/*global describe, it, after, before */
const crypto = require('crypto');
const Attribute = require('../cjs/attribute.js');
const Message = require('../cjs/message.js');
const Identity = require('../cjs/identity.js');
const Key = require('../cjs/key.js');

jest.setTimeout(30000);

describe('Message', async () => {
  let msg;
  msg = void 0;
  describe('createRating method', async () => {
    test('should create a rating message', async () => {
      msg = await Message.createRating({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
      expect(msg).toHaveProperty('signedData.timestamp');
      expect(msg.signedData.type).toEqual('rating');
    });
    /*
    test('should get message author and recipient', async () => {
      expect(msg.getAuthor()).toBeInstanceOf(Identity);
      expect(msg.getRecipient()).toBeInstanceOf(Identity);
    });
    */
    test('should use signing key as author if not defined', async () => {
      const defaultKey = await Key.getDefault('.');
      msg = await Message.createRating({
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      }, defaultKey);
      expect(msg).toHaveProperty('signedData.author');
      expect(JSON.stringify(msg.signedData.author)).toEqual('[["keyID","' + await Key.getId(defaultKey) + '"]]');
    });
  });
  describe('createVerification method', async () => {
    test('should create a verification message', async () => {
      msg = await Message.createVerification({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        comment: 'Good guy'
      });
      expect(msg).toHaveProperty('signedData.timestamp');
      expect(msg.signedData.type).toEqual('verification');
    });
  });
  describe('Validation', async () => {
    test('should not accept a message without signedData', async () => {
      const f = () => {
        new Message({});
      };
      expect(f).toThrow(Error);
    });
  });
  describe('Message signature', async () => {
    let key;
    msg = void 0;
    beforeAll(async () => {
      msg = await Message.createRating({
        author: [['email', 'alice@example.com']],
        recipient: [['email', 'bob@example.com']],
        rating: 5,
        comment: 'Good guy'
      });
      key = await Key.generate();
    });
    test('should be signed with sign()', async () => {
      await msg.sign(key);
      expect(msg).toHaveProperty('sig');
      expect(msg).toHaveProperty('pubKey');
      expect(msg).toHaveProperty('hash');
    });
    test('should be verified with verify()', async () => {
      expect(await msg.verify()).toBe(true);
    });
  });
});
