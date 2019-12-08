/* jshint esversion: 9 */

/*
 * Stand-alone iris node service wrapper. If NODE_ENV is 'production', uses
 * ../dist/irisLib.js, else uses the version in src or cjs directly. Development version
 * assumes that it is running directly under the checked-out source tree from git,
 * or in an `irisnode-dev` container, built with `docker-compose build irisnode`.
 *
 * Run with:
 *   NODE_ENV='production' yarn serve
 * or
 *   NODE_ENV='development' yarn build:run
 * or (for running tests + server)
 *   NODE_ENV='development' yarn dev
 *
 * Special environment variables:
 *   IRIS_GUN_PEERS - colon-separated peers that gun should try to connect to.
 *     Example: "http://localhost:123/gun/;http://1.2.3.4:5678/gun/"
 */

import {exists, mkdir, readFile} from 'fs';
import {promisify} from 'util';

import Gun from 'gun';
//require('gun/sea');

// Iris import depends on whether we're in dev mode or not
let Iris;
if (process.env.NODE_ENV === `production`) {
  console.log(`Loading irisLib.js!`);
  Iris = require(`../dist/irisLib.js`);
} else {
  console.log(`Loading src as Iris!`);
  Iris = require(`./index.js`);
}

// Explicit check for node-webcrypto-ossl, 'cause it just breaks sometimes
try {
  require('node-webcrypto-ossl');
}
catch (err) {
  console.error('(^_^)> This is a passive-aggressive warning that node-webcrypto-ossl has spontaneously self-destructed, again.');
  process.exit(1);
}

// Debug output?
const debug = (process.env.IRIS_VERBOSE ? console.log : console.debug);

const fsExists = promisify(exists);
const fsMkdir = promisify(mkdir);
const fsReadFile = promisify(readFile);

const configDir = `./.iris`;
const keyFileName = `iris.default.key`;
const gunDBName = `iris.db.radix`;
const ipfsRepo = 'ipfs';

let configFile = `${configDir}/config.json`;

/* Environment variables:
- GUN_PEERS http://localhost:6765/gun/;http://.../
- GUN_FILE iris.db.radix
*/

(async () => {
  // If config/data directory is missing, create it
  if (!await fsExists(configDir)) {
    console.info(`Config/data directory ${configDir} missing. Creating it.`);
    await fsMkdir(configDir);
  }

  // Load config file
  if (!await fsExists(configFile)) {
    configFile = `config.default.json`;
    console.warn(`Config file missing, using ${configFile} instead.`);
  }
  const config = JSON.parse(await fsReadFile(configFile));

  // Read-in keyfile, or generate (and store) a new key pair
  const key = Iris.Key.getDefault(configDir, keyFileName);
  debug(`Key!`, key);

  // TODO: If executed with --gen-keys => just generate keys, save, output to stdout, exit

  // Gun specific options (defaults)
  const gunConfig = {
    peers: {'http://localhost:8765/gun': {}},
    port: 8765,
    file: `${configDir}/${gunDBName}`,
    radisk: true,
    //web: 'server',
    //localStorage: true,
  };

  // IRIS_GUN_PEERS format: "http://localhost:123/gun/;http://1.2.3.4:5678/gun/"
  if (process.env.IRIS_GUN_PEERS) {
    gunConfig.peers = process.env.IRIS_GUN_PEERS
      .split(`;`)
      .reduce((obj, item) => {
        obj[item] = ``;
        return obj;
      }, {});
  }

  // Create an IPFS node - if js-ipfs exists, and unless flagged otherwise
  if (!process.env.IRIS_NO_IPFS) {
    let IPFS = null;
    try {
      IPFS = require('js-ipfs');
    }
    catch (err) {
      console.warn('IRIS_NO_IPFS not set, and `js-ipfs` library not found! Local IPFS node NOT instantiated.');
    }
    if (IPFS) {
      await IPFS.create({repo: `${configDir}/${ipfsRepo}`});
    }
  }

  // Instantiate gun
  debug(gunConfig);
  const gun = new Gun(gunConfig);

  // Load default Iris index with given configuration
  config.gun = gun;
  const index = new Iris.SocialNetwork(config);
  debug(`index!`, index);

  //await index.create(); // Create an index, if one does not exist
  console.info(`Iris is up and running!`);
})().catch(e => {
  console.error(e);
  process.exit(1);
});
