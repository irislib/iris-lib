/**
 * Get a public space where only the specified user (public key) can write. Others can read.
 * @param pub The public key string or keypair object of the user. Defaults to the current user from session.
 * @returns {Node} The user space.
 */
export default function (pub?: any): any;
