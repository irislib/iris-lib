const identifi = require('../cjs/index.js');

let i, p;

jest.setTimeout(30000);

test('instantiate Index', async () => {
  i = await identifi.Index.load();
  expect(i).toBeInstanceOf(identifi.Index);
});
test('initialize index and get identity', async () => {
  p = await i.get('martti@moni.com');
  expect(p).toBeInstanceOf(identifi.Identity);
});
test('get a verified attribute', async () => {
  const r = await p.verified('name');
  expect(typeof r).toBe('string');
  expect(r.length).toBeGreaterThan(0);
});
test('search identities', async () => {
  const r = await i.search('ma');
  expect(typeof r).toBe('object');
  expect(r.length).toBeGreaterThan(1);
});
