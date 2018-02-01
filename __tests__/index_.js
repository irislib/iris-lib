const identifi = require('../cjs/index.js');

let i, p;
test('instantiate Index', async () => {
  i = new identifi.Index();
  expect(i).toBeInstanceOf(identifi.Index);
});
test('initialize index and get identity', async () => {
  await i.init();
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
