# Identifi Lib [![Build Status](https://secure.travis-ci.org/identifi/identifi-lib.png?branch=master)](http://travis-ci.org/identifi/identifi-lib)

Check [example.js](https://github.com/identifi/identifi-lib/blob/master/example.js) for examples

Github repo: [https://github.com/identifi/identifi-lib](https://github.com/identifi/identifi-lib)

NPM: [https://www.npmjs.com/package/identifi-lib](https://www.npmjs.com/package/identifi-lib)


## Install

`npm install identifi-lib --save`

## Members

Host

`identifi.host`

Unique id types and their validators

`identifi.UNIQUE_ID_VALIDATORS`

Version number

`identifi.VERSION`

## Methods

Get id connections

`identifi.get_connections(id_type, id_value, options)`

Get id stats

`identifi.get_stats(id_type, id_value, options)`

`identifi.get_sent(id_type, id_value, options)`

`identifi.get_received(id_type, id_value, options)`

`identifi.get_trustpaths(id_type, id_value, options)`

Get id name

`identifi.get_name(id_type, id_value, options)`

Search for ids
`identifi.search(query, options)`
