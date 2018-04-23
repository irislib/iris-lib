/*eslint no-useless-escape: "off", camelcase: "off" */

import APIClient from './client';
import Message from './message';
import Identity from './identity';
import util from './util';
import Index from './index_';
import {version} from '../package.json';

export default {
  VERSION: version,
  APIClient,
  Message,
  Identity,
  Index,
  util,
};
