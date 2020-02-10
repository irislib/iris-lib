/* eslint no-useless-escape: "off", camelcase: "off" */

import createHash from 'create-hash';
import Gun from 'gun';
import http from 'http';

let isNode = false;
try {
  isNode = Object.prototype.toString.call(global.process) === `[object process]`;
} catch (e) { null; }

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = (userAgent && userAgent.indexOf(' electron/') > -1);

const isMobile = (function() {
  if (isElectron) { return false; }
  let check = false;
  (function(a) {if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;})(navigator.userAgent || navigator.vendor || window.opera);
  return check;
})();

function gunAsAnotherUser(gun, key, f) { // Hacky way to use multiple users with gun
  const gun2 = new Gun({peers: Object.keys(gun._.opt.peers)});
  const user = gun2.user();
  user.auth(key);
  setTimeout(() => {
    const peers = Object.values(gun2.back('opt.peers'));
    peers.forEach(peer => {
      gun2.on('bye', peer);
    });
  }, 20000);
  return f(user);
}

function gunOnceDefined(node) {
  return new Promise(resolve => {
    node.on((val, k, a, eve) => {
      if (val !== undefined) {
        eve.off();
        resolve(val);
      }
    });
  });
}

async function loadGunDepth(chain, maxDepth = 2, opts = {}) {
  opts.maxBreadth = opts.maxBreadth || 50;
  opts.cache = opts.cache || {};

  return chain.then().then(layer => {

    // Depth limit reached, or non-object, or array value returned
    if (maxDepth < 1 || !layer || typeof layer !== 'object' || layer.constructor === Array) {
      return layer;
    }

    let bcount = 0;
    const promises = Object.keys(layer).map(key => {
      // Only fetch links & restrict total search queries to maxBreadth ^ maxDepth requests
      if (!Gun.val.link.is(layer[key]) || ++bcount >= opts.maxBreadth) {
        return;
      }

      // During one recursive lookup, don't fetch the same key multiple times
      if (opts.cache[key]) {
        return opts.cache[key].then(data => {
          layer[key] = data;
        });
      }

      return opts.cache[key] = loadGunDepth(chain.get(key), maxDepth - 1, opts).then(data => {
        layer[key] = data;
      });
    });

    return Promise.all(promises).then(() => layer);
  });
}

/*
 * Helper for managing pools of Gun nodes. Primarily meant to simplify toplogy tracking in Iris tests.
 * For reference, here's a run-through by example. Under each call, is  an explanation of what happens.
 *
 * Instances can be identified by the port they're listening on, which is saved under .netPort for reference.
 *
 * const nets = GunNets();
 *
 * nets.spawnNodes(2):   * net ID: 1, A root, B points to A
 *   - returns [A, B]
 *   - B peers with A
 *   - netId is 1 for both
 *
 * nets.spawnNodes(1):
 *   - returns [C]
 *   - C has no peers
 *   - netId is 2
 *
 * nets.spawnNodes(2, C.netId)
 *   - returns  [D, E]
 *   - D, E both peer with C
 *   - netId is 2
 *
 * nets.spawnNodes(1, E.netId)
 *   - returns [F]
 *   - F peers with C
 *   - netId is 2
 *
 * nets.spawnNodes(2, 'test')
 *   - returns [G, H]
 *   - H peers with G
 *   - netId is 'test'
 *
 * nets.joinNets(B, H)
 *   - A peers with G (and B by proxy), G is root, so peering goes like:
 *      B -> A -> G
 *      H -> G
 *   - All nodes now have G.netID, so 'test' as .netID
 *
 * nets.joinNets(D, H)
 *   - D,E,F still point to C, which now peers with G, meaning:
 *     B -> A -> G
 *     H -> G
 *     D,E,F -> C -> G
 *   - All share netId 'test'
 *
 * @param fromPort
 * @param ip
 * @constructor
 */
function GunNets(fromPort = 12500, ip = '127.0.0.1') {
  const gunNets = {};
  let nextNetId = 1;
  let nextPort = fromPort;


  // Small internal helper function. Just adds a new peer to the given gun instance.
  function addPeer(gun, ip, port) {
    //const oldPeers = gun.opt()['_'].opt.peers;
    return gun.opt({peers: [`http: *${ip}:${port}/gun`]});   // Should these be linked both ways?
  }

  async function dropPeer(gun, peerUrl) {
    // If peerUrl not specified -> drop all
    if (!peerUrl) {
      return await Promise.all(Object.keys(gun._.opt.peers).map(key => dropPeer(gun, key)));
    }

    const peer = gun._.opt.peers[peerUrl];
    if (peer.wire) {
      peer.url = peer.id = null; // Prevent reconnecting to URL
      if (peer.wire) {
        await peer.wire.close(); // Websocket, if open
      }
    }

    delete gun._.opt.peers[peerUrl];
  }

  /*
   * When called, creates a number of Gun nodes, all having the root node as their peer. If netId is not given,
   * next sequential number is used. If netId of an existing net is provided, will use its root node as the
   * target and add new nodes to the same net.
   *
   * Returns the list of newly created nodes.
   *
   * @param number
   * @param netId
   *
   */
  this.spawnNodes = (number = 1, netId = null) => {
    if (!netId) {
      netId = nextNetId++;
    }

    const ports = [];
    for (let i = 0; i < number; ++i) {
      ports.push(nextPort++);
    }

    // Spawn guns, connect them to each other
    const newGuns = ports.map(port => {
      const server = http.createServer(Gun.serve).listen(port, ip);
      const g = new Gun({
        radisk: false,
        port: port,
        multicast: false,
        peers: {},
        // file: `${configDir}/${gunDBName}.${port}`,
        web: server,
      });
      g.netPort = port;
      g.netId = netId;
      return g;
    });

    // Connect root node to other peers, if applicable
    const root = gunNets[netId] || newGuns[0];
    newGuns.forEach(gun => {
      // Don't connect to itself, if root is newGuns[0]
      if (gun.netPort === root.netPort) {
        return;
      }
      addPeer(gun, ip, root.netPort);
      addPeer(root, ip, gun.netPort);
    });

    // Store in gunNets
    if (!gunNets[netId]) {
      gunNets[netId] = newGuns;
    } else {
      gunNets[netId].push(...newGuns);
    }

    return newGuns;
  };

  /*
   * Peer-connects childMember's root node to parentMember's root.
   *
   * All childMember's nodes are re-tagged with parentMember's netId and the old child netId ceases to exist.
   * If netId was already the same between groups, nothing happens.
   *
   * @param parentMember
   * @param childMember
   * @returns {*}
   */
  this.joinNets = (childMember, parentMember) => {
    // If already in the same net, just return the full list of nodes
    if (parentMember.netId === childMember.netId) {
      return gunNets[parentMember.netId];
    }

    // Move child net under parent
    const root = gunNets[parentMember.netId][0];
    const subChain = gunNets[childMember.netId];
    if (!root || !subChain) {
      throw new Error('What are you feeding me??? Either of the gun instances does not seem to be known to us!');
    }

    delete gunNets[childMember.netId];
    addPeer(subChain[0], ip, root.netPort);
    subChain.forEach(gun => {
      gun.netId = root.netId;
    });

    gunNets[root.netId].push(...subChain);

    return gunNets[root.netId];
  };

  this.describe = () => {
    const mapping = Object.keys(gunNets).map(key => {
      const rows = gunNets[key].map(gun => {
        const peers = Object.keys(gun._.opt.peers).filter(key => key.length > 2).join(' ');
        return `  :${gun.netPort} ${peers}`;
      }).join('\n');
      return `${key} ->\n${rows}`;
    }).join('\n');
    return (`== Net mapping / <NetId> -> [:<port> [<peers>, ...], ...] ==\n${  mapping}`);
  };

  this.close = () => {
    this.nets = null;
    return Promise.all(Object.values(gunNets).map(net => {
      return Promise.all(net.map(async gun => {
        await dropPeer(gun);  // Drops all peers
        await gun._.opt.web.close();  // And closes the web instance
      }));
    }));
  };

  this.nets = gunNets;  // Purely for convenience
}

export default {
  loadGunDepth: loadGunDepth,

  gunOnceDefined: gunOnceDefined,

  gunAsAnotherUser: gunAsAnotherUser,

  GunNets: GunNets,

  getHash: function(str, format = `base64`) {
    if (!str) {
      return undefined;
    }
    const hash = createHash(`sha256`);
    hash.update(str);
    return hash.digest(format);
  },

  timeoutPromise(promise, timeout) {
    return Promise.race([
      promise,
      new Promise((resolve => {
        setTimeout(() => {
          resolve();
        }, timeout);
      })),
    ]);
  },

  getCaret(el) {
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();
      const r = document.selection.createRange();
      if (r == null) {
        return 0;
      }
      const re = el.createTextRange(), rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);
      return rc.text.length;
    }
    return 0;
  },

  injectCss() {
    const elementId = `irisStyle`;
    if (document.getElementById(elementId)) {
      return;
    }
    const sheet = document.createElement(`style`);
    sheet.id = elementId;
    sheet.innerHTML = `
      .iris-identicon * {
        box-sizing: border-box;
      }

      .iris-identicon {
        vertical-align: middle;
        border-radius: 50%;
        text-align: center;
        display: inline-block;
        position: relative;
        max-width: 100%;
      }

      .iris-distance {
        z-index: 2;
        position: absolute;
        left:0%;
        top:2px;
        width: 100%;
        text-align: right;
        color: #fff;
        text-shadow: 0 0 1px #000;
        font-size: 75%;
        line-height: 75%;
        font-weight: bold;
      }

      .iris-pie {
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: 0px 0px 0px 0px #82FF84;
        padding-bottom: 100%;
        max-width: 100%;
        -webkit-transition: all 0.2s ease-in-out;
        -moz-transition: all 0.2s ease-in-out;
        transition: all 0.2s ease-in-out;
      }

      .iris-card {
        padding: 10px;
        background-color: #f7f7f7;
        color: #777;
        border: 1px solid #ddd;
        display: flex;
        flex-direction: row;
        overflow: hidden;
      }

      .iris-card a {
        -webkit-transition: color 150ms;
        transition: color 150ms;
        text-decoration: none;
        color: #337ab7;
      }

      .iris-card a:hover, .iris-card a:active {
        text-decoration: underline;
        color: #23527c;
      }

      .iris-pos {
        color: #3c763d;
      }

      .iris-neg {
        color: #a94442;
      }

      .iris-identicon img {
        position: absolute;
        top: 0;
        left: 0;
        max-width: 100%;
        border-radius: 50%;
        border-color: transparent;
        border-style: solid;
      }

      .iris-chat-box {
        position: fixed;
        bottom: 0.5rem;
        right: 0.5rem;
        border-radius: 8px;
        background-color: #fff;
        max-height: 25rem;
        box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);
        height: calc(100% - 44px);
        display: flex;
        flex-direction: column;
        width: 320px;
        font-family: system-ui;
        font-size: 15px;
        color: rgb(38, 38, 38);
      }

      .iris-chat-header {
        background-color: #1e1e1e;
        height: 44px;
        color: #fff;
        border-radius: 8px 8px 0 0;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: none;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      .iris-online-indicator {
        color: #bfbfbf;
        margin-right: 5px;
        font-size: 12px;
        user-select: none;
      }

      .iris-online-indicator.yes {
        color: #80bf5f;
      }

      .iris-typing-indicator {
        display: none;
        background-color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
        padding: 2px;
        color: #777;
      }

      .iris-typing-indicator.yes {
        display: block;
      }

      .iris-chat-messages {
        flex: 1;
        padding: 15px;
        overflow-y: scroll;
      }

      .iris-chat-input-wrapper {
        flex: none;
        padding: 15px;
        background-color: #efefef;
        display: flex;
        flex-direction: row;
        border-radius: 0 0 8px 8px;
      }

      .iris-chat-input-wrapper textarea {
        padding: 15px 8px;
        border-radius: 4px;
        border: 1px solid rgba(0,0,0,0);
        width: auto;
        font-size: 15px;
        resize: none;
        flex: 1;
      }

      .iris-chat-input-wrapper textarea:focus {
        outline: none;
        border: 1px solid #6dd0ed;
      }

      .iris-chat-input-wrapper button svg {
        display: inline-block;
        font-size: inherit;
        height: 1em;
        width: 1em;
        overflow: visible;
        vertical-align: -0.125em;
      }

      .iris-chat-input-wrapper button, .iris-chat-input-wrapper button:hover, .iris-chat-input-wrapper button:active, .iris-chat-input-wrapper button:focus {
        flex: none;
        color: #999;
        background-color: transparent;
        font-size: 30px;
        padding: 5px;
        border: 1px solid rgba(0,0,0,0);
        border-radius: 4px;
        margin-left: 5px;
      }

      .iris-chat-input-wrapper button:active, .iris-chat-input-wrapper button:focus {
        outline: none;
        border: 1px solid #6dd0ed;
      }

      .iris-chat-message {
        display: flex;
        flex-direction: column;
        margin-bottom: 2px;
        overflow-wrap: break-word;
      }

      .iris-msg-content {
        background-color: #efefef;
        padding: 6px 10px;
        border-radius: 8px;
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
        flex: none;
        max-width: 75%;
      }

      .emoji {
        font-size: 1.3em;
        line-height: 1em;
      }

      .iris-chat-message .emoji-only {
        font-size: 3em;
        text-align: center;
      }

      .seen {
        color: rgba(0, 0, 0, 0.45);
        user-select: none;
      }

      .seen.yes {
        color: #4fc3f7;
      }

      .seen svg {
        width: 18px;
      }

      .iris-delivered-checkmark {
        display: none;
      }

      .delivered .iris-delivered-checkmark {
        display: initial;
      }

      .iris-chat-message.their {
        align-items: flex-start;
      }

      .iris-chat-message.their + .iris-chat-message.our .iris-msg-content, .day-separator + .iris-chat-message.our .iris-msg-content {
        margin-top: 15px;
        border-radius: 8px 0px 8px 8px;
      }

      .iris-chat-message.their:first-of-type .iris-msg-content {
        border-radius: 0px 8px 8px 8px;
      }

      .iris-chat-message.our:first-of-type .iris-msg-content {
        border-radius: 8px 0px 8px 8px;
      }

      .iris-chat-message.our + .iris-chat-message.their .iris-msg-content, .day-separator + .iris-chat-message.their .iris-msg-content {
        margin-top: 15px;
        border-radius: 0px 8px 8px 8px;
      }

      .iris-chat-message.our {
        align-items: flex-end;
      }

      .iris-chat-message.our .iris-msg-content {
        background-color: #c5ecf7;
      }

      .iris-chat-message .time {
        text-align: right;
        font-size: 12px;
        color: rgba(0, 0, 0, 0.45);
      }

      .day-separator {
        display: inline-block;
        border-radius: 8px;
        background-color: rgba(227, 249, 255, 0.91);
        padding: 6px 10px;
        margin-top: 15px;
        margin-left: auto;
        margin-right: auto;
        text-transform: uppercase;
        font-size: 13px;
        color: rgba(74, 74, 74, 0.88);
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
        user-select: none;
      }

      .day-separator:first-of-type {
        margin-top: 0;
      }
      `;
    document.head.prepend(sheet);
  },

  getUrlParameter(sParam, sParams) {
    const sPageURL = sParams || window.location.search.substring(1);
    const sURLVariables = sPageURL.split('&');
    let sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
      }
    }
  },

  formatTime(date) {
    const t = date.toLocaleTimeString(undefined, {timeStyle: 'short'});
    const s = t.split(':');
    if (s.length === 3) { // safari tries to display seconds
      return `${s[0]  }:${  s[1]  }${s[2].slice(2)}`;
    }
    return t;
  },

  formatDate(date) {
    const t = date.toLocaleString(undefined, {dateStyle: 'short', timeStyle: 'short'});
    const s = t.split(':');
    if (s.length === 3) { // safari tries to display seconds
      return `${s[0]  }:${  s[1]  }${s[2].slice(2)}`;
    }
    return t;
  },

  getDaySeparatorText(date, dateStr, now, nowStr) {
    if (!now) {
      now = new Date();
      nowStr = now.toLocaleDateString({dateStyle: 'short'});
    }
    if (dateStr === nowStr) {
      return 'today';
    }
    const dayDifference = Math.round((now - date) / (1000 * 60 * 60 * 24));
    if (dayDifference <= 1) {
      return 'yesterday';
    }
    if (dayDifference <= 5) {
      return date.toLocaleDateString(undefined, {weekday: 'long'});
    }
    return dateStr;
  },

  isNode,
  isElectron,
  isMobile
};
