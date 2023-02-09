import session from './session';
import relaypool from './relaypool';
import { Path } from './path';
import { Event, Filter } from 'nostr-tools';

const subscribe = (filters: Filter[], cb: (event: Event) => void) => {
  relaypool.subscribe(filters, cb);
  return '';
}

const publish = async (event: Partial<Event>) => {
  await relaypool.publish(event);
  return event as Event;
}

/**
 * Get a public space where only the specified users (public keys) can write. Others can read.
 * @param pub The public key of the user. Defaults to the current user from session.
 * @returns {Path} The user space.
 */
export default function(authors = [session.getPubKey()]) {
  return new Path(publish, subscribe, relaypool.unsubscribe, { authors });
}
