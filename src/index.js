/*eslint no-useless-escape: "off", camelcase: "off" */

import Collection from './Collection';
import SignedMessage from './SignedMessage';
import Contact from './Contact';
import Attribute from './Attribute';
import util from './util';
import SocialNetwork from './SocialNetwork';
import Key from './Key';
import Channel from './Channel';
import {version} from '../package.json';

export default {
  VERSION: version,
  Collection,
  SignedMessage,
  Contact,
  Attribute,
  SocialNetwork,
  Key,
  Channel,
  util,
};
