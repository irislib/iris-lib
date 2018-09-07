/*eslint no-useless-escape: "off", camelcase: "off" */

import Message from './message';
import Identity from './identity';
import Attribute from './attribute';
import util from './util';
import Index from './index_';
import Key from './key';
import {version} from '../package.json';

export default {
  VERSION: version,
  Message,
  Identity,
  Attribute,
  Index,
  Key,
  util,
};
