import publicState from './global';
import session from './session';

let currentUser: any;

/**
 * Get a public space where only the specified user (public key) can write. Others can read.
 * @param pub The public key of the user. Defaults to the current user from session.
 * @returns {Node} The user space.
 */
export default function(pub: string = session.getKey().pub) {
  return pub ? publicState().user(pub) : currentUser;
}
