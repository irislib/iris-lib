/*eslint no-useless-escape: "off", camelcase: "off" */

import Message from './message';
import Contact from './contact';
import Attribute from './attribute';
import util from './util';
import SocialNetwork from './socialNetwork';
import Key from './key';
import Chat from './chat';
import {version} from '../package.json';

export default {
  VERSION: version,
  Message,
  Contact,
  Attribute,
  SocialNetwork,
  Key,
  Chat,
  util,
};
