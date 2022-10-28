import peers from "./peers";
import Node from "./db/Node";

let globalState: any;

export default function(opts: any = {}) {
  if (!globalState) {
    peers.init();
    const webSocketPeers = (opts.peers || peers.random());
    console.log('webSocketPeers', webSocketPeers);
    const myOpts = Object.assign({ webSocketPeers, localStorage: false, retry:Infinity }, opts);
    if (opts.peers) {
      console.log('adding peers', opts.peers);
      opts.peers.forEach((url: string) => peers.add({url}));
    }
    globalState = new Node('global', myOpts);
  }
  return globalState;
}