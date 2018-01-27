const identifi = require('../src/index.js');

describe('identifi-lib', () => {
  let i;
  test('instantiate IdentifiIndex', async () => {
    i = new identifi.IdentifiIndex();
    expect(i).toBeInstanceOf(identifi.IdentifiIndex);
  });
  test('initialize and get identity profile', async () => {
    await i.init();
    const r = await i.get('martti@moni.com');
    console.log('r', r);
    expect(r).toBeDefined();
  });
});
