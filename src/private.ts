import session from './session';
import relaypool from './relaypool';
import key from './key';
import { Path } from './path';
import {Event, Filter} from "nostr-tools";

const subscribe = (filters: Filter[], cb: (event: Event) => void) => {
  relaypool.subscribe(filters, cb);
  return '';
}

/**
 * Get a private space where only you and the specified user (public key) can read and write.
 * @param pub The public key of the user. If not specified, it's a private space for the current user.
 * @returns {Path} The user space.
 */
export default function(authors = [session.getPubKey()]) {
  return new Path(relaypool.publish, subscribe, relaypool.unsubscribe, { authors }, key.encrypt, key.decrypt);
}
