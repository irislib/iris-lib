# identifi-lib

![Node](https://img.shields.io/node/v/identifi-lib.svg?style=flat-square)
[![NPM](https://img.shields.io/npm/v/identifi-lib.svg?style=flat-square)](https://www.npmjs.com/package/identifi-lib)
[![Travis](https://img.shields.io/travis/mmalmi/identifi-lib/master.svg?style=flat-square)](https://travis-ci.org/mmalmi/identifi-lib)
[![David](https://img.shields.io/david/mmalmi/identifi-lib.svg?style=flat-square)](https://david-dm.org/mmalmi/identifi-lib)
[![Coverage Status](https://img.shields.io/coveralls/mmalmi/identifi-lib.svg?style=flat-square)](https://coveralls.io/github/mmalmi/identifi-lib)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

> Basic tools for reading and writing Identifi messages and identities.

### Usage

```js
const identifi = require('identifi-lib');

Index.load().then(async (index) => {
  const profile = await index.get('martti@moni.com');
  const name = await profile.verified('name');
  console.log(`Verified name for martti@moni.com: ${name}`);
});
```

See [`plnkr.co example`](http://plnkr.co/edit/mVOyr2?p=preview) for more.

### Installation

Install via [yarn](https://github.com/yarnpkg/yarn)

	yarn add identifi-lib (--dev)

or npm

	npm install identifi-lib (--save-dev)


### configuration

You can pass in extra options as a configuration object (➕ required, ➖ optional, ✏️ default).

```js
import identifiLib from 'identifi-lib';

```

➖ **property** ( type ) ` ✏️ default `
<br/> 📝 description
<br/> ❗️ warning
<br/> ℹ️ info
<br/> 💡 example

### methods

#### #name

```js
identifiLib

```

### Examples

See [`example`](example/script.js) folder or the [runkit](https://runkit.com/mmalmi/identifi-lib) example.

### Builds

If you don't use a package manager, you can [access `identifi-lib` via unpkg (CDN)](https://unpkg.com/identifi-lib/), download the source, or point your package manager to the url.

`identifi-lib` is compiled as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules & [ES2015 modules](http://www.2ality.com/2014/0
  -9/es6-modules-final.html) for bundlers that support the `jsnext:main` or `module` field in package.json (Rollup, Webpack 2)

The `identifi-lib` package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/identifi-lib/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. You can drop a UMD build as a [`<script>` tag](https://unpkg.com/identifi-lib) on your page. The UMD builds make `identifi-lib` available as a `window.identifiLib` global variable.

### License

The code is available under the [MIT](LICENSE) license.

### Contributing

We are open to contributions, see [CONTRIBUTING.md](CONTRIBUTING.md) for more info.

### Misc

This module was created using [generator-module-boilerplate](https://github.com/duivvv/generator-module-boilerplate).
