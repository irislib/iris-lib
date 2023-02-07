import session from './session';
import { Path } from './path';
import { Event, Filter } from 'nostr-tools';

// Placeholders — local state isn't sent anywhere
const publish = async (event: Partial<Event>) => event as Event;
const subscribe = (_filters: Filter[]) => '';
const unsubscribe = (_id: string) => {};

/**
 * Get a public space where only the specified users (public keys) can write. Others can read.
 * @param pub The public key of the user. Defaults to the current user from session.
 * @returns {Path} The user space.
 */
export default function(authors = [session.getPubKey()]) {
  return new Path(publish, subscribe, unsubscribe, { authors });
}
