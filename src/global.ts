import peers from "./peers";
import Node from "./db/Node";

let global: any;

export default function(opts: any = {}) {
  if (!global) {
    const myOpts = Object.assign({ peers: (opts.peers || peers.random()), localStorage: false, retry:Infinity }, opts);
    if (opts.peers) {
      opts.peers.forEach((url: string) => peers.add({url}));
    }
    peers.init();
    global = new Node('global', myOpts);
  }
  return global;
}