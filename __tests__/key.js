const identifi = require('../cjs/index.js');
const fs = require(`fs`);

jest.setTimeout(30000);

beforeAll(() => {
  if (fs.existsSync('./private.key')) {
    const f = fs.unlinkSync('./private.key');
  }
});
test('Generate key', async () => {
  const i = await identifi.Key.generate();
  expect(i).toBeDefined();
});
test('Serialize and deserialize a key', async () => {
  const i = await identifi.Key.generate();
  const serialized = identifi.Key.toJwk(i);
  expect(typeof serialized).toBe('string');
  const deserialized = identifi.Key.fromJwk(serialized);
  expect(typeof deserialized).toBe('object')
  expect(i).toBeDefined();
});
test('Get default key and sign a message with it', async () => {
  const i = await identifi.Key.getDefault('.');
  expect(i).toBeDefined();
  const j = await identifi.Key.getDefault('.');
  expect(i).toEqual(j);
  const msg = await identifi.Message.createRating({
    author: [['email', 'alice@example.com']],
    recipient: [['email', 'bob@example.com']],
    rating: 5,
    comment: 'Good guy'
  });
  await msg.sign(i);
  console.log(i, msg);
  expect(await msg.verify()).toBe(true);
});
afterAll(() => {
  if (fs.existsSync('./private.key')) {
    const f = fs.unlinkSync('./private.key');
  }
});
