# iris-lib

![Node](https://img.shields.io/node/v/iris-lib.svg?style=flat-square)
[![NPM](https://img.shields.io/npm/v/iris-lib.svg?style=flat-square)](https://www.npmjs.com/package/iris-lib)
[![Travis](https://img.shields.io/travis/irislib/iris-lib/master.svg?style=flat-square)](https://travis-ci.org/irislib/iris-lib)
[![David](https://img.shields.io/david/irislib/iris-lib.svg?style=flat-square)](https://david-dm.org/irislib/iris-lib)
[![Coverage Status](https://img.shields.io/coveralls/irislib/iris-lib.svg?style=flat-square)](https://coveralls.io/github/irislib/iris-lib)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

### Description
Iris-lib provides the [Iris API](http://docs.iris.to/) for reading, writing, indexing and searching Messages and Identities - the fundamental objects of Iris.

The task of data storage and networking is outsourced to [GUN](https://github.com/amark/gun), which manages the synchronization of data between different storages (memory, localstorage, GUN websocket server, WebRTC peers, IPFS, S3, whatever).

GUN enables subscription to data changes, so message feeds and identity profiles just update real-time without having to hit f5 or writing complex update logic.

### Usage

```js
iris = require('iris-lib');
Gun = require('gun'); // github.com/amark/gun is needed
require('gun/sea');

gun = new Gun(['https://gun-us.herokuapp.com/gun', 'https://gun-eu.herokuapp.com/gun']);
defaultIndexID = 'b8ByaYNBDCMLNdZqMdas5oUFLCxBf2VH3-NjUulDaTo.DVzINErRVs6m5tyjAux6fcNfndadcgZVN5hLSwYTCLc';
user = gun.user(defaultIndexID);

index = new iris.Index(user.get('iris'));
profile = index.get('sirius@iki.fi');
profile.gun.get('attrs').then(console.log);
profile.verified('name').then(console.log);

```

### Installation

Install via [yarn](https://github.com/yarnpkg/yarn)

	yarn add iris-lib (--dev)

or npm

	npm install iris-lib (--save-dev)

### Examples

See [`example`](example/script.js) folder or the [runkit](https://runkit.com/irislib/iris-lib) example.

### Builds

If you don't use a package manager, you can [access `iris-lib` via unpkg (CDN)](https://unpkg.com/iris-lib/), download the source, or point your package manager to the url.

`iris-lib` is compiled as a collection of [CommonJS](http://webpack.github.io/docs/commonjs.html) modules & [ES2015 modules](http://www.2ality.com/2014/0
  -9/es6-modules-final.html) for bundlers that support the `jsnext:main` or `module` field in package.json (Rollup, Webpack 2)

The `iris-lib` package includes precompiled production and development [UMD](https://github.com/umdjs/umd) builds in the [`dist` folder](https://unpkg.com/iris-lib/dist/). They can be used directly without a bundler and are thus compatible with many popular JavaScript module loaders and environments. You can drop a UMD build as a [`<script>` tag](https://unpkg.com/iris-lib) on your page. The UMD builds make `iris-lib` available as a `window.irisLib` global variable.

### License

The code is available under the [MIT](LICENSE) license.

### Contributing

Please do **integrate** iris-lib with your existing application or with a test application and **create Github issues** for the bugs and other problems you may encounter. Your help is much appreciated!

TODO list is also available on [Trello](https://trello.com/b/8qUutkmP/iris).

### Misc

This module was created using [generator-module-boilerplate](https://github.com/duivvv/generator-module-boilerplate).
