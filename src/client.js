import fetch from 'node-fetch';
import jws from 'jws';

export default {
  apiRoot: `http://127.0.0.1:4944/api`,
  request: function(options) {
    options.headers = options.headers !== undefined ? options.json : {'Content-Type': `application/json`};
    options.method = `POST`;
    const uri = options.uri !== undefined ? options.uri : this.apiRoot;
    if (options.apiMethod)  { options.uri += `/${options.apiMethod}`; }
    if (options.apiIdType)  { options.uri += `/${encodeURIComponent(options.apiIdType)}`; }
    if (options.apiId)      { options.uri += `/${encodeURIComponent(options.apiId)}`; }
    if (options.apiAction)  { options.uri += `/${options.apiAction}`; }
    return fetch(uri, options);
  },
  getJwt: function(signingKeyPem, payload) {
    const exp = Math.floor(Date.now() / 1000) + 60;
    payload = Object.assign({exp: exp}, payload);
    return jws.sign({
      header: {typ: `JWT`, alg: `ES256`},
      payload: payload,
      privateKey: signingKeyPem
    });
  }
};
