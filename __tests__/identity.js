const iris = require('index.js');
const Identity = iris.Identity;

const GUN = require(`gun`);
const load = require(`gun/lib/load`);
const then = require(`gun/lib/then`);
const SEA = require(`gun/sea`);
const gun = new GUN({radisk: false});
const $ = require(`jquery`);

const logger = function()
{
  let oldConsoleLog = null;
  const pub = {};

  pub.enable =  function enable()
  {
    if (oldConsoleLog == null)
      return;

    window[`console`][`log`] = oldConsoleLog;
  };

  pub.disable = function disable()
  {
    oldConsoleLog = console.log;
    window[`console`][`log`] = function() {};
  };

  return pub;
}();

// get them from index, actually?
let index, vp;
beforeAll(async () => {
  logger.disable();
  index = new iris.Index({gun});
  await index.ready;
  vp = index.getViewpoint();
});

describe(`Identity`, () => {
  test(`verified()`, () => {
    //expect(vp.verified(`email`)).toBe(undefined);
    //expect(typeof vp.verified(`keyID`)).toBe(`string`);
  });
  test(`identicon()`, () => {
    const identicon = vp.identicon(50);
    expect(identicon.constructor.name).toBe(`HTMLDivElement`);
  });
  test(`profileCard()`, () => {
    const profileCard = vp.profileCard();
    expect(profileCard.constructor.name).toBe(`HTMLDivElement`);
  });
  test(`appendSearchWidget()`, () => {
    const parent = document.createElement(`div`); // index param
    const widget = Identity.appendSearchWidget(parent);
    expect(parent.hasChildNodes()).toBe(true);
    const input = $(widget).find(`input`).first();
    const results = $(widget).find(`div`).first();
    expect(input.constructor.name).toBe(`jQuery`);
    expect(results.constructor.name).toBe(`jQuery`);
    input.val(`Al`);
    input.keyup();
  });
});
