/*eslint no-useless-escape: "off", camelcase: "off" */

import APIClient from './client';
import Message from './message';
import Identity from './identity';
import util from './util';
import Index from './index_';
const pkg = require(`../package.json`);

export default {
  VERSION: pkg.version,
  APIClient,
  Message,
  Identity,
  Index,
  util,
};
