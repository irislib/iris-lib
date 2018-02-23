const identifi = require('../cjs/index.js');

let i, p;

jest.setTimeout(30000);

test('Generate key', async () => {
  i = await identifi.util.getDefaultKey('.');
  expect(i).toBeDefined();
});
