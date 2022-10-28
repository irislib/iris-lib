import util from "./util";
import Node from "./db/Node";

// TODO config {peers: ['http://localhost:8768/gun'], file: 'State.electron', multicast:false, localStorage: false}
const electron = util.isElectron ? new Node('electron').get('state') : null;

export default electron;