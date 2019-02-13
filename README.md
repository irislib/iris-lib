# identifi-lib

![Node](https://img.shields.io/node/v/identifi-lib.svg?style=flat-square)
[![NPM](https://img.shields.io/npm/v/identifi-lib.svg?style=flat-square)](https://www.npmjs.com/package/identifi-lib)
[![Travis](https://img.shields.io/travis/identifi/identifi-lib/master.svg?style=flat-square)](https://travis-ci.org/identifi/identifi-lib)
[![David](https://img.shields.io/david/identifi/identifi-lib.svg?style=flat-square)](https://david-dm.org/identifi/identifi-lib)
[![Coverage Status](https://img.shields.io/coveralls/identifi/identifi-lib.svg?style=flat-square)](https://coveralls.io/github/identifi/identifi-lib)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

> Basic tools for reading, writing, indexing and searching Identifi messages and identities.

### Usage

```js
identifi = require('identifi-lib');
Gun = require('gun'); // github.com/amark/gun is needed
require('gun/sea');

gun = new Gun(['https://identifi.herokuapp.com/gun', 'https://identifi2.herokuapp.com/gun']);
defaultIndexID = 'b8ByaYNBDCMLNdZqMdas5oUFLCxBf2VH3-NjUulDaTo.DVzINErRVs6m5tyjAux6fcNfndadcgZVN5hLSwYTCLc';
user = gun.user(defaultIndexID);

index = new identifi.Index(user.get('identifi'));
profile = index.get('sirius@iki.fi');
profile.gun.get('attrs').then(console.log);
profile.verified('name').then(console.log);

```

See [`plnkr.co example`](http://plnkr.co/edit/jA6oPo?p=preview) for more.


### Documentation

See the [docs](https://rawgit.com/identifi/identifi-lib/master/docs/index.html) directory.

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

See [`example`](example/script.js) folder or the [runkit](https://runkit.com/identifi/identifi-lib) example.

### Builds

If you don't use a package manager, you can [access `identifi-lib` via unpkg (CDN)](https://unpkg.com/identifi-lib/), download the source, or point your package manager to the url.

`identifi-lib` is compiled as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules & [ES2015 modules](http://www.2ality.com/2014/0
  -9/es6-modules-final.html) for bundlers that support the `jsnext:main` or `module` field in package.json (Rollup, Webpack 2)

The `identifi-lib` package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/identifi-lib/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. You can drop a UMD build as a [`<script>` tag](https://unpkg.com/identifi-lib) on your page. The UMD builds make `identifi-lib` available as a `window.identifiLib` global variable.

### License

The code is available under the [MIT](LICENSE) license.

### Contributing

Please do **integrate** identifi-lib with your existing application or with a test application and **create Github issues** for the bugs and other problems you may encounter. Your help is much appreciated!

### Misc

This module was created using [generator-module-boilerplate](https://github.com/duivvv/generator-module-boilerplate).
