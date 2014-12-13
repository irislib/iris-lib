# Identifi Lib


Check [example.js](https://github.com/identifi/identifi-lib/blob/master/example.js) for examples


Github repo: [https://github.com/identifi/identifi-lib](https://github.com/identifi/identifi-lib)

NPM: [https://www.npmjs.com/package/identifi-lib](https://www.npmjs.com/package/identifi-lib)


## Install

`npm install identifi-lib --save`

## Methods

Get supported id types

`identifi.valid_id_types()`


Get user/url connections

`identifi.get_connections(user, id_type, options)`


Get user/url overview

`identifi.get_overview(user, id_type, options)`


`identifi.get_sent(user, id_type, options)`


`identifi.get_received(user, id_type, options)`


`identifi.get_trustpaths(user, id_type, options)`


Get user/url name

`identifi.get_name(user, id_type, options)`
