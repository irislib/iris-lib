/* eslint no-useless-escape: "off", camelcase: "off" */

import createHash from 'create-hash';
import Gun from 'gun';
import http from 'http';

let isNode = false;
try {
  isNode = Object.prototype.toString.call(global.process) === `[object process]`;
} catch (e) { null; }

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
      }`;
    document.body.appendChild(sheet);
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

  isNode,
};
