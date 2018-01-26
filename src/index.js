/*eslint no-useless-escape: "off", camelcase: "off" */

import APIClient from './client';
import Message from './message';
import keyutil from './keyutil';
import IdentifiIndex from './identifi_index';
import util from './util';
const pkg = require(`../package.json`);

export default {
  VERSION: pkg.version,
  UNIQUE_ID_VALIDATORS: util.UNIQUE_ID_VALIDATORS,
  guessTypeOf: util.guessTypeOf,
  APIClient,
  Message,
  keyutil,
  IdentifiIndex,
};
