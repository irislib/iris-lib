let index, msg, key;

const loadIdentifi = window.identifiLib.Index.create(); // <--- Create identifi index

loadIdentifi.then(async (index_) => {
  index = index_;
  document.getElementById('searchResults').textContent = 'Searching...';
  document.getElementById('profileResults').textContent = 'Searching...';
  await search(index);
  await getProfile(index);
  document.getElementById('query').addEventListener('change', search);
  document.getElementById('profileQuery').addEventListener('change', getProfile);
  document.getElementById('signMsg').addEventListener('click', signMsg);
  document.getElementById('publishMsg').addEventListener('click', publishMsg);
  document.getElementById('runIndexExample').addEventListener('click', runIndexExample);
  const searchWidget = document.getElementById('searchWidget');
  window.identifiLib.Identity.appendSearchWidget(searchWidget, index);
});

async function search() {
  const query = document.getElementById('query').value;

  let r = await index.search(query); // <--- Search identities from identifi

  let text = `Search results for "${query}":\n`;
  document.getElementById('searchResults').textContent = text;
  r.sort((a, b) => {return a.trustDistance - b.trustDistance;});
  r.forEach(i => {
    document.getElementById('searchResults').appendChild(i.profileCard());
  });
}

async function getProfile() {
  const profileQuery = document.getElementById('profileQuery').value;
  const identiconParent = document.getElementById('identicon');
  const verifiedAttributeEl = document.getElementById('verifiedAttribute');

  i = await index.get(profileQuery); // <--- Get an identity from identifi

  let text = `Identity profile for ${profileQuery}:\n`;
  if (i) {
    text += JSON.stringify(i, null, 2);
    const verifiedName = i.verified('name'); // <--- Get a verified name of an identity
    verifiedAttributeEl.textContent = verifiedName;

    const identicon = i.identicon(100); // <--- Generate an identity icon as a DOM element, width 100px
    identiconParent.innerHTML = '';
    identiconParent.appendChild(identicon);
  } else {
    identiconParent.innerHTML = '';
    verifiedAttributeEl.innerHTML = '-';
    text += 'Profile not found'
  }
  document.getElementById('profileResults').textContent = text;
}

function signMsg() {
  const d = document.getElementById('ratingMsg').value;
  const msgData = JSON.parse(d);
  window.message = window.identifiLib.Message.createRating(msgData); // <--- Create an Identifi message
  key = window.identifiLib.Key.getDefault(); // <--- Get or generate local key
  window.message.sign(key); // <--- Sign message with the key
  document.getElementById('signMsgResult').textContent = JSON.stringify(window.message, null, 2);
}

async function publishMsg() {
  const r = await index.publishMessage(window.message);
  document.getElementById('publishMsgResult').textContent = JSON.stringify(r);
  if (r && r.hash) {
    const link = `https://ipfs.io/ipfs/${r.hash}`;
    const el = document.getElementById('publishMsgResultLink');
    el.className = `alert alert-info`;
    el.innerHTML = `Link to the newly published JWT serialized identifi message on IPFS: <a href="${link}">${link}</a>`;
  }
}

async function runIndexExample() {
  el = document.getElementById('runIndexExampleResult');
  el.innerHTML = '';

  ipfs = new window.Ipfs();
  await new Promise((resolve, reject) => {
    ipfs.on('ready', () => {
      console.log('ipfs ready');
      resolve();
    });
    ipfs.on('error', error => {
      console.error(error.message);
      reject();
    });
  });
  index = await window.identifiLib.Index.create(ipfs);
  myKey = window.identifiLib.Key.getDefault('.');
  msg = window.identifiLib.Message.createVerification({
    recipient: [['keyID', myKey.keyID], ['name', 'Alice Example']],
    comment: 'add name'
  }, myKey);
  await index.addMessage(msg);
  msg2 = window.identifiLib.Message.createRating({
    recipient: [['email', 'bob@example.com']],
    rating: 5
  }, myKey);
  await index.addMessage(msg2);
  identities = await index.search('');
  el.innerHTML += 'Identities in index:\n'
  el.innerHTML += JSON.stringify(identities, null, 2);
  uri = await index.save();
  el.innerHTML += '\nSaved index URI: ' + uri
}
