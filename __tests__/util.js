const identifi = require('../cjs/index.js');

jest.setTimeout(30000);

test('Generate key', async () => {
  const i = await identifi.util.generateKey('.');
  expect(i).toBeDefined();
});
test('Get default key', async () => {
  const i = await identifi.util.getDefaultKey('.');
  console.log('priv', i);
  expect(i).toBeDefined();
  const j = await identifi.util.getDefaultKey('.');
  expect(i).toEqual(j);
  const msg = identifi.Message.createRating({
    author: [['email', 'alice@example.com']],
    recipient: [['email', 'bob@example.com']],
    rating: 5,
    comment: 'Good guy'
  });
  msg.sign(i);
  expect(msg.verify()).toBe(true);
});
