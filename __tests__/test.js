const identifi = require('../src/index.js');

describe('identifi-lib', () => {
  let i, p;
  test('instantiate IdentifiIndex', async () => {
    i = new identifi.IdentifiIndex();
    expect(i).toBeInstanceOf(identifi.IdentifiIndex);
  });
  test('initialize and get identity profile', async () => {
    await i.init();
    p = await i.get('martti@moni.com');
    expect(p).toBeInstanceOf(Object);
  });
  test('get a verified attribute', async () => {
    const r = await p.verified('name');
    expect(typeof r).toBe('string');
  });
});
