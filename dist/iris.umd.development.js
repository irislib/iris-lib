(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('fs'), require('path'), require('aws-sdk'), require('url'), require('events'), require('https'), require('http'), require('net'), require('tls'), require('crypto'), require('stream'), require('zlib'), require('bufferutil'), require('utf-8-validate'), require('dgram'), require('os'), require('child_process')) :
	typeof define === 'function' && define.amd ? define(['exports', 'fs', 'path', 'aws-sdk', 'url', 'events', 'https', 'http', 'net', 'tls', 'crypto', 'stream', 'zlib', 'bufferutil', 'utf-8-validate', 'dgram', 'os', 'child_process'], factory) :
	(global = global || self, factory(global.iris = {}, global.fs, global.path$1, global.awsSdk, global.url, global.events, global.https, global.http, global.net, global.tls, global.crypto$1, global.stream$1, global.zlib, global.bufferutil, global.utf8Validate, global.dgram, global.os, global.child_process));
}(this, (function (exports, fs, path$1, awsSdk, url, events, https, http, net, tls, crypto$1, stream$1, zlib, bufferutil, utf8Validate, dgram, os, child_process) { 'use strict';

	fs = fs && Object.prototype.hasOwnProperty.call(fs, 'default') ? fs['default'] : fs;
	path$1 = path$1 && Object.prototype.hasOwnProperty.call(path$1, 'default') ? path$1['default'] : path$1;
	awsSdk = awsSdk && Object.prototype.hasOwnProperty.call(awsSdk, 'default') ? awsSdk['default'] : awsSdk;
	url = url && Object.prototype.hasOwnProperty.call(url, 'default') ? url['default'] : url;
	events = events && Object.prototype.hasOwnProperty.call(events, 'default') ? events['default'] : events;
	https = https && Object.prototype.hasOwnProperty.call(https, 'default') ? https['default'] : https;
	http = http && Object.prototype.hasOwnProperty.call(http, 'default') ? http['default'] : http;
	net = net && Object.prototype.hasOwnProperty.call(net, 'default') ? net['default'] : net;
	tls = tls && Object.prototype.hasOwnProperty.call(tls, 'default') ? tls['default'] : tls;
	crypto$1 = crypto$1 && Object.prototype.hasOwnProperty.call(crypto$1, 'default') ? crypto$1['default'] : crypto$1;
	stream$1 = stream$1 && Object.prototype.hasOwnProperty.call(stream$1, 'default') ? stream$1['default'] : stream$1;
	zlib = zlib && Object.prototype.hasOwnProperty.call(zlib, 'default') ? zlib['default'] : zlib;
	bufferutil = bufferutil && Object.prototype.hasOwnProperty.call(bufferutil, 'default') ? bufferutil['default'] : bufferutil;
	utf8Validate = utf8Validate && Object.prototype.hasOwnProperty.call(utf8Validate, 'default') ? utf8Validate['default'] : utf8Validate;
	dgram = dgram && Object.prototype.hasOwnProperty.call(dgram, 'default') ? dgram['default'] : dgram;
	os = os && Object.prototype.hasOwnProperty.call(os, 'default') ? os['default'] : os;
	child_process = child_process && Object.prototype.hasOwnProperty.call(child_process, 'default') ? child_process['default'] : child_process;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
	}

	var yson = createCommonjsModule(function (module) {
	(function(){
	// JSON: JavaScript Object Notation
	// YSON: Yielding javaScript Object Notation
	var yson = {}, u, sI = setTimeout.turn || (typeof setImmediate != ''+u && setImmediate) || setTimeout;

	yson.parseAsync = function(text, done, revive, M){
		if('string' != typeof text){ try{ done(u,JSON.parse(text)); }catch(e){ done(e); } return }
		var ctx = {i: 0, text: text, done: done, l: text.length, up: []};
		//M = 1024 * 1024 * 100;
		//M = M || 1024 * 64;
		M = M || 1024 * 32;
		parse();
		function parse(){
			//var S = +new Date;
			var s = ctx.text;
			var i = ctx.i, l = ctx.l, j = 0;
			var w = ctx.w, b, tmp;
			while(j++ < M){
				var c = s[i++];
				if(i > l){
					ctx.end = true;
					break;
				}
				if(w){
					i = s.indexOf('"', i-1); c = s[i];
					tmp = 0; while('\\' == s[i-(++tmp)]){} tmp = !(tmp % 2);//tmp = ('\\' == s[i-1]); // json is stupid
					b = b || tmp;
					if('"' == c && !tmp){
						w = u;
						tmp = ctx.s;
						if(ctx.a){
							tmp = s.slice(ctx.sl, i);
							if(b || (1+tmp.indexOf('\\'))){ tmp = JSON.parse('"'+tmp+'"'); } // escape + unicode :( handling
							if(ctx.at instanceof Array){
								ctx.at.push(ctx.s = tmp);
							} else {
								if(!ctx.at){ ctx.end = j = M; tmp = u; }
								(ctx.at||{})[ctx.s] = ctx.s = tmp;
							}
							ctx.s = u;
						} else {
							ctx.s = s.slice(ctx.sl, i);
							if(b || (1+ctx.s.indexOf('\\'))){ ctx.s = JSON.parse('"'+ctx.s+'"'); } // escape + unicode :( handling
						}
						ctx.a = b = u;
					}
					++i;
				} else {
					switch(c){
					case '"':
						ctx.sl = i;
						w = true;
						break;
					case ':':
						ctx.ai = i;
						ctx.a = true;
						break;
					case ',':
						if(ctx.a || ctx.at instanceof Array){
							if(tmp = s.slice(ctx.ai, i-1)){
								if(u !== (tmp = value(tmp))){
									if(ctx.at instanceof Array){
										ctx.at.push(tmp);
									} else {
										ctx.at[ctx.s] = tmp;
									}
								}
							}
						}
						ctx.a = u;
						if(ctx.at instanceof Array){
							ctx.a = true;
							ctx.ai = i;
						}
						break;
					case '{':
						ctx.up.push(ctx.at||(ctx.at = {}));
						if(ctx.at instanceof Array){
							ctx.at.push(ctx.at = {});
						} else
						if(u !== (tmp = ctx.s)){
							ctx.at[tmp] = ctx.at = {};
						}
						ctx.a = u;
						break;
					case '}':
						if(ctx.a){
							if(tmp = s.slice(ctx.ai, i-1)){
								if(u !== (tmp = value(tmp))){
									if(ctx.at instanceof Array){
										ctx.at.push(tmp);
									} else {
										if(!ctx.at){ ctx.end = j = M; tmp = u; }
										(ctx.at||{})[ctx.s] = tmp;
									}
								}
							}
						}
						ctx.a = u;
						ctx.at = ctx.up.pop();
						break;
					case '[':
						if(u !== (tmp = ctx.s)){
							ctx.up.push(ctx.at);
							ctx.at[tmp] = ctx.at = [];
						} else
						if(!ctx.at){
							ctx.up.push(ctx.at = []);
						}
						ctx.a = true;
						ctx.ai = i;
						break;
					case ']':
						if(ctx.a){
							if(tmp = s.slice(ctx.ai, i-1)){
								if(u !== (tmp = value(tmp))){
									if(ctx.at instanceof Array){
										ctx.at.push(tmp);
									} else {
										ctx.at[ctx.s] = tmp;
									}
								}
							}
						}
						ctx.a = u;
						ctx.at = ctx.up.pop();
						break;
					}
				}
			}
			ctx.s = u;
			ctx.i = i;
			ctx.w = w;
			if(ctx.end){
				tmp = ctx.at;
				if(u === tmp){
					try{ tmp = JSON.parse(text);
					}catch(e){ return ctx.done(e) }
				}
				ctx.done(u, tmp);
			} else {
				sI(parse);
			}
		}
	};
	function value(s){
		var n = parseFloat(s);
		if(!isNaN(n)){
			return n;
		}
		s = s.trim();
		if('true' == s){
			return true;
		}
		if('false' == s){
			return false;
		}
		if('null' == s){
			return null;
		}
	}

	yson.stringifyAsync = function(data, done, replacer, space, ctx){
		//try{done(u, JSON.stringify(data, replacer, space))}catch(e){done(e)}return;
		ctx = ctx || {};
		ctx.text = ctx.text || "";
		ctx.up = [ctx.at = {d: data}];
		ctx.done = done;
		ctx.i = 0;
		var j = 0;
		ify();
		function ify(){
			var at = ctx.at, data = at.d, add = '', tmp;
			if(at.i && (at.i - at.j) > 0){ add += ','; }
			if(u !== (tmp = at.k)){ add += JSON.stringify(tmp) + ':'; } //'"'+tmp+'":' } // only if backslash
			switch(typeof data){
			case 'boolean':
				add += ''+data;
				break;
			case 'string':
				add += JSON.stringify(data); //ctx.text += '"'+data+'"';//JSON.stringify(data); // only if backslash
				break;
			case 'number':
				add += (isNaN(data)? 'null' : data);
				break;
			case 'object':
				if(!data){
					add += 'null';
					break;
				}
				if(data instanceof Array){	
					add += '[';
					at = {i: -1, as: data, up: at, j: 0};
					at.l = data.length;
					ctx.up.push(ctx.at = at);
					break;
				}
				if('function' != typeof (data||'').toJSON){
					add += '{';
					at = {i: -1, ok: Object.keys(data).sort(), as: data, up: at, j: 0};
					at.l = at.ok.length;
					ctx.up.push(ctx.at = at);
					break;
				}
				if(tmp = data.toJSON()){
					add += tmp;
					break;
				}
				// let this & below pass into default case...
			case 'function':
				if(at.as instanceof Array){
					add += 'null';
					break;
				}
			default: // handle wrongly added leading `,` if previous item not JSON-able.
				add = '';
				at.j++;
			}
			ctx.text += add;
			while(1+at.i >= at.l){
				ctx.text += (at.ok? '}' : ']');
				at = ctx.at = at.up;
			}
			if(++at.i < at.l){
				if(tmp = at.ok){
					at.d = at.as[at.k = tmp[at.i]];
				} else {
					at.d = at.as[at.i];
				}
				if(++j < 9){ return ify() } else { j = 0; }
				sI(ify);
				return;
			}
			ctx.done(u, ctx.text);
		}
	};
	if(typeof window != ''+u){ window.YSON = yson; }
	try{ if('object' != ''+u){ module.exports = yson; } }catch(e){}
	if(typeof JSON != ''+u){
		JSON.parseAsync = yson.parseAsync;
		JSON.stringifyAsync = yson.stringifyAsync;
	}

	}());
	});

	var gun = createCommonjsModule(function (module) {
	(function(){

	  /* UNBUILD */
	  function USE(arg, req){
	    return req? commonjsRequire() : arg.slice? USE[R(arg)] : function(mod, path){
	      arg(mod = {exports: {}});
	      USE[R(path)] = mod.exports;
	    }
	    function R(p){
	      return p.split('/').slice(-1).toString().replace('.js','');
	    }
	  }
	  { var MODULE = module; }
	USE(function(module){
			// Shim for generic javascript utilities.
			String.random = function(l, c){
				var s = '';
				l = l || 24; // you are not going to make a 0 length random number, so no need to check type
				c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
				while(l-- > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); }
				return s;
			};
			String.match = function(t, o){ var tmp, u;
				if('string' !== typeof t){ return false }
				if('string' == typeof o){ o = {'=': o}; }
				o = o || {};
				tmp = (o['='] || o['*'] || o['>'] || o['<']);
				if(t === tmp){ return true }
				if(u !== o['=']){ return false }
				tmp = (o['*'] || o['>']);
				if(t.slice(0, (tmp||'').length) === tmp){ return true }
				if(u !== o['*']){ return false }
				if(u !== o['>'] && u !== o['<']){
					return (t >= o['>'] && t <= o['<'])? true : false;
				}
				if(u !== o['>'] && t >= o['>']){ return true }
				if(u !== o['<'] && t <= o['<']){ return true }
				return false;
			};
			String.hash = function(s, c){ // via SO
				if(typeof s !== 'string'){ return }
		    c = c || 0; // CPU schedule hashing by
		    if(!s.length){ return c }
		    for(var i=0,l=s.length,n; i<l; ++i){
		      n = s.charCodeAt(i);
		      c = ((c<<5)-c)+n;
		      c |= 0;
		    }
		    return c;
		  };
			var has = Object.prototype.hasOwnProperty;
			Object.plain = function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false };
			Object.empty = function(o, n){
				for(var k in o){ if(has.call(o, k) && (!n || -1==n.indexOf(k))){ return false } }
				return true;
			};
			Object.keys = Object.keys || function(o){
				var l = [];
				for(var k in o){ if(has.call(o, k)){ l.push(k); } }
				return l;
			}
			;(function(){
				var u, sT = setTimeout, l = 0, c = 0
				, sI = (typeof setImmediate !== ''+u && setImmediate) || (function(c,f){
					if(typeof MessageChannel == ''+u){ return sT }
					(c = new MessageChannel()).port1.onmessage = function(e){ ''==e.data && f(); };
					return function(q){ f=q;c.port2.postMessage(''); }
				}()), check = sT.check = sT.check || (typeof performance !== ''+u && performance)
				|| {now: function(){ return +new Date }};
				sT.hold = sT.hold || 9; // half a frame benchmarks faster than < 1ms?
				sT.poll = sT.poll || function(f){
					if((sT.hold >= (check.now() - l)) && c++ < 3333){ f(); return }
					sI(function(){ l = check.now(); f(); },c=0);
				};
			}());
	(function(){ // Too many polls block, this "threads" them in turns over a single thread in time.
				var sT = setTimeout, t = sT.turn = sT.turn || function(f){ 1 == s.push(f) && p(T); }
				, s = t.s = [], p = sT.poll, i = 0, f, T = function(){
					if(f = s[i++]){ f(); }
					if(i == s.length || 99 == i){
						s = t.s = s.slice(i);
						i = 0;
					}
					if(s.length){ p(T); }
				};
			}());
	(function(){
				var u, sT = setTimeout, T = sT.turn;
				(sT.each = sT.each || function(l,f,e,S){ S = S || 9; (function t(s,L,r){
				  if(L = (s = (l||[]).splice(0,S)).length){
				  	for(var i = 0; i < L; i++){
				  		if(u !== (r = f(s[i]))){ break }
				  	}
				  	if(u === r){ T(t); return }
				  } e && e(r);
				}());})();
			}());
		})(USE, './shim');
	USE(function(module){
			// On event emitter generic javascript utility.
			module.exports = function onto(tag, arg, as){
				if(!tag){ return {to: onto} }
				var u, f = 'function' == typeof arg, tag = (this.tag || (this.tag = {}))[tag] || f && (
					this.tag[tag] = {tag: tag, to: onto._ = { next: function(arg){ var tmp;
						if(tmp = this.to){ tmp.next(arg); }
				}}});
				if(f){
					var be = {
						off: onto.off ||
						(onto.off = function(){
							if(this.next === onto._.next){ return !0 }
							if(this === this.the.last){
								this.the.last = this.back;
							}
							this.to.back = this.back;
							this.next = onto._.next;
							this.back.to = this.to;
							if(this.the.last === this.the){
								delete this.on.tag[this.the.tag];
							}
						}),
						to: onto._,
						next: arg,
						the: tag,
						on: this,
						as: as,
					};
					(be.back = tag.last || tag).to = be;
					return tag.last = be;
				}
				if((tag = tag.to) && u !== arg){ tag.next(arg); }
				return tag;
			};
		})(USE, './onto');
	USE(function(module){
			// Valid values are a subset of JSON: null, binary, number (!Infinity), text,
			// or a soul relation. Arrays need special algorithms to handle concurrency,
			// so they are not supported directly. Use an extension that supports them if
			// needed but research their problems first.
			module.exports = function (v) {
			  // "deletes", nulling out keys.
			  return v === null ||
				"string" === typeof v ||
				"boolean" === typeof v ||
				// we want +/- Infinity to be, but JSON does not support it, sad face.
				// can you guess what v === v checks for? ;)
				("number" === typeof v && v != Infinity && v != -Infinity && v === v) ||
				(!!v && "string" == typeof v["#"] && Object.keys(v).length === 1 && v["#"]);
			};
		})(USE, './valid');
	USE(function(module){
			USE('./shim');
			function State(){
				var t = +new Date;
				if(last < t){
					return N = 0, last = t + State.drift;
				}
				return last = t + ((N += 1) / D) + State.drift;
			}
			State.drift = 0;
			var NI = -Infinity, N = 0, D = 999, last = NI, u; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
			State.is = function(n, k, o){ // convenience function to get the state on a key on a node and return it.
				var tmp = (k && n && n._ && n._['>']) || o;
				if(!tmp){ return }
				return ('number' == typeof (tmp = tmp[k]))? tmp : NI;
			};
			State.ify = function(n, k, s, v, soul){ // put a key's state on a node.
				(n = n || {})._ = n._ || {}; // safety check or init.
				if(soul){ n._['#'] = soul; } // set a soul if specified.
				var tmp = n._['>'] || (n._['>'] = {}); // grab the states data.
				if(u !== k && k !== '_'){
					if('number' == typeof s){ tmp[k] = s; } // add the valid state.
					if(u !== v){ n[k] = v; } // Note: Not its job to check for valid values!
				}
				return n;
			};
			module.exports = State;
		})(USE, './state');
	USE(function(module){
			USE('./shim');
			function Dup(opt){
				var dup = {s:{}}, s = dup.s;
				opt = opt || {max: 999, age: 1000 * 9};//*/ 1000 * 9 * 3};
				dup.check = function(id){
					if(!s[id]){ return false }
					return dt(id);
				};
				var dt = dup.track = function(id){
					var it = s[id] || (s[id] = {});
					it.was = dup.now = +new Date;
					if(!dup.to){ dup.to = setTimeout(dup.drop, opt.age + 9); }
					if(dt.ed){ dt.ed(id); }
					return it;
				};
				dup.drop = function(age){
					dup.to = null;
					dup.now = +new Date;
					var l = Object.keys(s);
					console.STAT && console.STAT(dup.now, +new Date - dup.now, 'dup drop keys'); // prev ~20% CPU 7% RAM 300MB // now ~25% CPU 7% RAM 500MB
					setTimeout.each(l, function(id){ var it = s[id]; // TODO: .keys( is slow?
						if(it && (age || opt.age) > (dup.now - it.was)){ return }
						delete s[id];
					},0,99);
				};
				return dup;
			}
			module.exports = Dup;
		})(USE, './dup');
	USE(function(module){
			// request / response module, for asking and acking messages.
			USE('./onto'); // depends upon onto!
			module.exports = function ask(cb, as){
				if(!this.on){ return }
				var lack = (this.opt||{}).lack || 9000;
				if(!('function' == typeof cb)){
					if(!cb){ return }
					var id = cb['#'] || cb, tmp = (this.tag||'')[id];
					if(!tmp){ return }
					if(as){
						tmp = this.on(id, as);
						clearTimeout(tmp.err);
						tmp.err = setTimeout(function(){ tmp.off(); }, lack);
					}
					return true;
				}
				var id = (as && as['#']) || random(9);
				if(!cb){ return id }
				var to = this.on(id, cb, as);
				to.err = to.err || setTimeout(function(){ to.off();
					to.next({err: "Error: No ACK yet.", lack: true});
				}, lack);
				return id;
			};
			var random = String.random || function(){ return Math.random().toString(36).slice(2) };
		})(USE, './ask');
	USE(function(module){

			function Gun(o){
				if(o instanceof Gun){ return (this._ = {$: this}).$ }
				if(!(this instanceof Gun)){ return new Gun(o) }
				return Gun.create(this._ = {$: this, opt: o});
			}

			Gun.is = function($){ return ($ instanceof Gun) || ($ && $._ && ($ === $._.$)) || false };

			Gun.version = 0.2020;

			Gun.chain = Gun.prototype;
			Gun.chain.toJSON = function(){};

			USE('./shim');
			Gun.valid = USE('./valid');
			Gun.state = USE('./state');
			Gun.on = USE('./onto');
			Gun.dup = USE('./dup');
			Gun.ask = USE('./ask');
	(function(){
				Gun.create = function(at){
					at.root = at.root || at;
					at.graph = at.graph || {};
					at.on = at.on || Gun.on;
					at.ask = at.ask || Gun.ask;
					at.dup = at.dup || Gun.dup();
					var gun = at.$.opt(at.opt);
					if(!at.once){
						at.on('in', universe, at);
						at.on('out', universe, at);
						at.on('put', map, at);
						Gun.on('create', at);
						at.on('create', at);
					}
					at.once = 1;
					return gun;
				};
				function universe(msg){
					// TODO: BUG! msg.out = null being set!
					//if(!F){ var eve = this; setTimeout(function(){ universe.call(eve, msg,1) },Math.random() * 100);return; } // ADD F TO PARAMS!
					if(!msg){ return }
					if(msg.out === universe){ this.to.next(msg); return }
					var eve = this, as = eve.as, at = as.at || as, gun = at.$, dup = at.dup, tmp, DBG = msg.DBG;
					(tmp = msg['#']) || (tmp = msg['#'] = text_rand(9));
					if(dup.check(tmp)){ return } dup.track(tmp);
					tmp = msg._; msg._ = ('function' == typeof tmp)? tmp : function(){};
					(msg.$ && (msg.$ === (msg.$._||'').$)) || (msg.$ = gun);
					if(msg['@'] && !msg.put){ ack(msg); }
					if(!at.ask(msg['@'], msg)){ // is this machine listening for an ack?
						DBG && (DBG.u = +new Date);
						if(msg.put){ put(msg); return } else
						if(msg.get){ Gun.on.get(msg, gun); }
					}
					DBG && (DBG.uc = +new Date);
					eve.to.next(msg);
					DBG && (DBG.ua = +new Date);
					if(msg.nts || msg.NTS){ return } // TODO: This shouldn't be in core, but fast way to prevent NTS spread. Delete this line after all peers have upgraded to newer versions.
					msg.out = universe; at.on('out', msg);
					DBG && (DBG.ue = +new Date);
				}
				function put(msg){
					if(!msg){ return }
					var ctx = msg._||'', root = ctx.root = ((ctx.$ = msg.$||'')._||'').root;
					if(msg['@'] && ctx.faith && !ctx.miss){ // TODO: AXE may split/route based on 'put' what should we do here? Detect @ in AXE? I think we don't have to worry, as DAM will route it on @.
						msg.out = universe;
						root.on('out', msg);
						return;
					}
					ctx.latch = root.hatch; ctx.match = root.hatch = [];
					var put = msg.put;
					var DBG = ctx.DBG = msg.DBG, S = +new Date; CT = CT || S;
					if(put['#'] && put['.']){ /*root && root.on('put', msg);*/ return } // TODO: BUG! This needs to call HAM instead.
					DBG && (DBG.p = S);
					ctx['#'] = msg['#'];
					ctx.msg = msg;
					ctx.all = 0;
					ctx.stun = 1;
					var nl = Object.keys(put);//.sort(); // TODO: This is unbounded operation, large graphs will be slower. Write our own CPU scheduled sort? Or somehow do it in below? Keys itself is not O(1) either, create ES5 shim over ?weak map? or custom which is constant.
					console.STAT && console.STAT(S, ((DBG||ctx).pk = +new Date) - S, 'put sort');
					var ni = 0, nj, kl, soul, node, states, err, tmp;
					(function pop(o){
						if(nj != ni){ nj = ni;
							if(!(soul = nl[ni])){
								console.STAT && console.STAT(S, ((DBG||ctx).pd = +new Date) - S, 'put');
								fire(ctx);
								return;
							}
							if(!(node = put[soul])){ err = ERR+cut(soul)+"no node."; } else
							if(!(tmp = node._)){ err = ERR+cut(soul)+"no meta."; } else
							if(soul !== tmp['#']){ err = ERR+cut(soul)+"soul not same."; } else
							if(!(states = tmp['>'])){ err = ERR+cut(soul)+"no state."; }
							kl = Object.keys(node||{}); // TODO: .keys( is slow
						}
						if(err){
							msg.err = ctx.err = err; // invalid data should error and stun the message.
							fire(ctx);
							//console.log("handle error!", err) // handle!
							return;
						}
						var i = 0, key; o = o || 0;
						while(o++ < 9 && (key = kl[i++])){
							if('_' === key){ continue }
							var val = node[key], state = states[key];
							if(u === state){ err = ERR+cut(key)+"on"+cut(soul)+"no state."; break }
							if(!valid(val)){ err = ERR+cut(key)+"on"+cut(soul)+"bad "+(typeof val)+cut(val); break }
							//ctx.all++; //ctx.ack[soul+key] = '';
							ham(val, key, soul, state, msg);
							++C; // courtesy count;
						}
						if((kl = kl.slice(i)).length){ turn(pop); return }
						++ni; kl = null; pop(o);
					}());
				} Gun.on.put = put;
				// TODO: MARK!!! clock below, reconnect sync, SEA certify wire merge, User.auth taking multiple times, // msg put, put, say ack, hear loop...
				// WASIS BUG! local peer not ack. .off other people: .open
				function ham(val, key, soul, state, msg){
					var ctx = msg._||'', root = ctx.root, graph = root.graph, tmp;
					var vertex = graph[soul] || empty, was = state_is(vertex, key, 1), known = vertex[key];
					
					var DBG = ctx.DBG; if(tmp = console.STAT){ if(!graph[soul] || !known){ tmp.has = (tmp.has || 0) + 1; } }

					var now = State();
					if(state > now){
						setTimeout(function(){ ham(val, key, soul, state, msg); }, (tmp = state - now) > MD? MD : tmp); // Max Defer 32bit. :(
						console.STAT && console.STAT(((DBG||ctx).Hf = +new Date), tmp, 'future');
						return;
					}
					if(state < was){ /*old;*/ { return } } // but some chains have a cache miss that need to re-fire. // TODO: Improve in future. // for AXE this would reduce rebroadcast, but GUN does it on message forwarding. // TURNS OUT CACHE MISS WAS NOT NEEDED FOR NEW CHAINS ANYMORE!!! DANGER DANGER DANGER, ALWAYS RETURN! (or am I missing something?)
					if(!ctx.faith){ // TODO: BUG? Can this be used for cache miss as well? // Yes this was a bug, need to check cache miss for RAD tests, but should we care about the faith check now? Probably not.
						if(state === was && (val === known || L(val) <= L(known))){ /*console.log("same");*/ /*same;*/ if(!ctx.miss){ return } } // same
					}
					ctx.stun++; // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
					var aid = msg['#']+ctx.all++, id = {toString: function(){ return aid }, _: ctx}; id.toJSON = id.toString; // this *trick* makes it compatible between old & new versions.
					root.dup.track(id)['#'] = msg['#']; // fixes new OK acks for RPC like RTC.
					DBG && (DBG.ph = DBG.ph || +new Date);
					root.on('put', {'#': id, '@': msg['@'], put: {'#': soul, '.': key, ':': val, '>': state}, ok: msg.ok, _: ctx});
				}
				function map(msg){
					var DBG; if(DBG = (msg._||'').DBG){ DBG.pa = +new Date; DBG.pm = DBG.pm || +new Date;}
	      	var eve = this, root = eve.as, graph = root.graph, ctx = msg._, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>'], tmp;
	      	if((tmp = ctx.msg) && (tmp = tmp.put) && (tmp = tmp[soul])){ state_ify(tmp, key, state, val, soul); } // necessary! or else out messages do not get SEA transforms.
	      	//var bytes = ((graph[soul]||'')[key]||'').length||1;
					graph[soul] = state_ify(graph[soul], key, state, val, soul);
					if(tmp = (root.next||'')[soul]){
						//tmp.bytes = (tmp.bytes||0) + ((val||'').length||1) - bytes;
						//if(tmp.bytes > 2**13){ Gun.log.once('byte-limit', "Note: In the future, GUN peers will enforce a ~4KB query limit. Please see https://gun.eco/docs/Page") }
						tmp.on('in', msg);
					}
					fire(ctx);
					eve.to.next(msg);
				}
				function fire(ctx, msg){ var root;
					if(ctx.stop){ return }
					if(!ctx.err && 0 < --ctx.stun){ return } // TODO: 'forget' feature in SEA tied to this, bad approach, but hacked in for now. Any changes here must update there.
					ctx.stop = 1;
					if(!(root = ctx.root)){ return }
					var tmp = ctx.match; tmp.end = 1;
					if(tmp === root.hatch){ if(!(tmp = ctx.latch) || tmp.end){ delete root.hatch; } else { root.hatch = tmp; } }
					ctx.hatch && ctx.hatch(); // TODO: rename/rework how put & this interact.
					setTimeout.each(ctx.match, function(cb){cb && cb();}); 
					if(!(msg = ctx.msg) || ctx.err || msg.err){ return }
					msg.out = universe;
					ctx.root.on('out', msg);

					CF(); // courtesy check;
				}
				function ack(msg){ // aggregate ACKs.
					var id = msg['@'] || '', ctx;
					if(!(ctx = id._)){
						var dup = (dup = msg.$) && (dup = dup._) && (dup = dup.root) && (dup = dup.dup);
						if(!(dup = dup.check(id))){ return }
						msg['@'] = dup['#'] || msg['@']; // This doesn't do anything anymore, backtrack it to something else?
						return;
					}
					ctx.acks = (ctx.acks||0) + 1;
					if(ctx.err = msg.err){
						msg['@'] = ctx['#'];
						fire(ctx); // TODO: BUG? How it skips/stops propagation of msg if any 1 item is error, this would assume a whole batch/resync has same malicious intent.
					}
					ctx.ok = msg.ok || ctx.ok;
					if(!ctx.stop && !ctx.crack){ ctx.crack = ctx.match && ctx.match.push(function(){back(ctx);}); } // handle synchronous acks. NOTE: If a storage peer ACKs synchronously then the PUT loop has not even counted up how many items need to be processed, so ctx.STOP flags this and adds only 1 callback to the end of the PUT loop.
					back(ctx);
				}
				function back(ctx){
					if(!ctx || !ctx.root){ return }
					if(ctx.stun || ctx.acks !== ctx.all){ return }
					ctx.root.on('in', {'@': ctx['#'], err: ctx.err, ok: ctx.err? u : ctx.ok || {'':1}});
				}

				var ERR = "Error: Invalid graph!";
				var cut = function(s){ return " '"+(''+s).slice(0,9)+"...' " };
				var L = JSON.stringify, MD = 2147483647, State = Gun.state;
				var C = 0, CT, CF = function(){if(C>999 && (C/-(CT - (CT = +new Date))>1)){Gun.window && console.log("Warning: You're syncing 1K+ records a second, faster than DOM can update - consider limiting query.");CF=function(){C=0;};}};

			}());
	(function(){
				Gun.on.get = function(msg, gun){
					var root = gun._, get = msg.get, soul = get['#'], node = root.graph[soul], has = get['.'];
					var next = root.next || (root.next = {}), at = next[soul];

					// TODO: Azarattum bug, what is in graph is not same as what is in next. Fix!

					// queue concurrent GETs?
					// TODO: consider tagging original message into dup for DAM.
					// TODO: ^ above? In chat app, 12 messages resulted in same peer asking for `#user.pub` 12 times. (same with #user GET too, yipes!) // DAM note: This also resulted in 12 replies from 1 peer which all had same ##hash but none of them deduped because each get was different.
					// TODO: Moving quick hacks fixing these things to axe for now.
					// TODO: a lot of GET #foo then GET #foo."" happening, why?
					// TODO: DAM's ## hash check, on same get ACK, producing multiple replies still, maybe JSON vs YSON?
					// TMP note for now: viMZq1slG was chat LEX query #.
					/*if(gun !== (tmp = msg.$) && (tmp = (tmp||'')._)){
						if(tmp.Q){ tmp.Q[msg['#']] = ''; return } // chain does not need to ask for it again.
						tmp.Q = {};
					}*/
					/*if(u === has){
						if(at.Q){
							//at.Q[msg['#']] = '';
							//return;
						}
						at.Q = {};
					}*/
					var ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
					DBG && (DBG.g = +new Date);
					//console.log("GET:", get, node, has);
					if(!node){ return root.on('get', msg) }
					if(has){
						if('string' != typeof has || u === node[has]){
							if(!((at||'').next||'')[has]){ root.on('get', msg); return }
						}
						node = state_ify({}, has, state_is(node, has), node[has], soul);
						// If we have a key in-memory, do we really need to fetch?
						// Maybe... in case the in-memory key we have is a local write
						// we still need to trigger a pull/merge from peers.
					}
					//Gun.window? Gun.obj.copy(node) : node; // HNPERF: If !browser bump Performance? Is this too dangerous to reference root graph? Copy / shallow copy too expensive for big nodes. Gun.obj.to(node); // 1 layer deep copy // Gun.obj.copy(node); // too slow on big nodes
					node && ack(msg, node);
					root.on('get', msg); // send GET to storage adapters.
				};
				function ack(msg, node){
					var S = +new Date, ctx = msg._||{}, DBG = ctx.DBG = msg.DBG;
					var to = msg['#'], id = text_rand(9), keys = Object.keys(node||'').sort(), soul = ((node||'')._||'')['#'], root = msg.$._.root, F = (node === root.graph[soul]);
					console.STAT && console.STAT(S, ((DBG||ctx).gk = +new Date) - S, 'got keys');
					// PERF: Consider commenting this out to force disk-only reads for perf testing? // TODO: .keys( is slow
					node && (function go(){
						S = +new Date;
						var i = 0, k, put = {}, tmp;
						while(i < 9 && (k = keys[i++])){
							state_ify(put, k, state_is(node, k), node[k], soul);
						}
						keys = keys.slice(i);
						(tmp = {})[soul] = put; put = tmp;
						var faith; if(F){ faith = function(){}; faith.ram = faith.faith = true; } // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
						tmp = keys.length;
						console.STAT && console.STAT(S, -(S - (S = +new Date)), 'got copied some');
						DBG && (DBG.ga = +new Date);
						root.on('in', {'@': to, '#': id, put: put, '%': (tmp? (id = text_rand(9)) : u), $: root.$, _: faith, DBG: DBG, FOO: 1});
						console.STAT && console.STAT(S, +new Date - S, 'got in');
						if(!tmp){ return }
						setTimeout.turn(go);
					}());
					if(!node){ root.on('in', {'@': msg['#']}); } // TODO: I don't think I like this, the default lS adapter uses this but "not found" is a sensitive issue, so should probably be handled more carefully/individually.
				} Gun.on.get.ack = ack;
			}());
	(function(){
				Gun.chain.opt = function(opt){
					opt = opt || {};
					var gun = this, at = gun._, tmp = opt.peers || opt;
					if(!Object.plain(opt)){ opt = {}; }
					if(!Object.plain(at.opt)){ at.opt = opt; }
					if('string' == typeof tmp){ tmp = [tmp]; }
					if(!Object.plain(at.opt.peers)){ at.opt.peers = {};}
					if(tmp instanceof Array){
						opt.peers = {};
						tmp.forEach(function(url){
							var p = {}; p.id = p.url = url;
							opt.peers[url] = at.opt.peers[url] = at.opt.peers[url] || p;
						});
					}
					obj_each(opt, function each(k){ var v = this[k];
						if((this && this.hasOwnProperty(k)) || 'string' == typeof v || Object.empty(v)){ this[k] = v; return }
						if(v && v.constructor !== Object && !(v instanceof Array)){ return }
						obj_each(v, each);
					});
					at.opt.from = opt;
					Gun.on('opt', at);
					at.opt.uuid = at.opt.uuid || function uuid(l){ return Gun.state().toString(36).replace('.','') + String.random(l||12) };
					return gun;
				};
			}());

			var obj_each = function(o,f){ Object.keys(o).forEach(f,o); }, text_rand = String.random, turn = setTimeout.turn, valid = Gun.valid, state_is = Gun.state.is, state_ify = Gun.state.ify, u, empty = {}, C;

			Gun.log = function(){ return (!Gun.log.off && C.log.apply(C, arguments)), [].slice.call(arguments).join(' ') };
			Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) };

			if(typeof window !== "undefined"){ (window.GUN = window.Gun = Gun).window = window; }
			try{ if(typeof MODULE !== "undefined"){ MODULE.exports = Gun; } }catch(e){}
			module.exports = Gun;
			
			(Gun.window||{}).console = (Gun.window||{}).console || {log: function(){}};
			(C = console).only = function(i, s){ return (C.only.i && i === C.only.i && C.only.i++) && (C.log.apply(C, arguments) || s) };
			Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, please ask for help on http://chat.gun.eco if anything takes you longer than 5min to figure out!");
		})(USE, './root');
	USE(function(module){
			var Gun = USE('./root');
			Gun.chain.back = function(n, opt){ var tmp;
				n = n || 1;
				if(-1 === n || Infinity === n){
					return this._.root.$;
				} else
				if(1 === n){
					return (this._.back || this._).$;
				}
				var gun = this, at = gun._;
				if(typeof n === 'string'){
					n = n.split('.');
				}
				if(n instanceof Array){
					var i = 0, l = n.length, tmp = at;
					for(i; i < l; i++){
						tmp = (tmp||empty)[n[i]];
					}
					if(u !== tmp){
						return opt? gun : tmp;
					} else
					if((tmp = at.back)){
						return tmp.$.back(n, opt);
					}
					return;
				}
				if('function' == typeof n){
					var yes, tmp = {back: at};
					while((tmp = tmp.back)
					&& u === (yes = n(tmp, opt))){}
					return yes;
				}
				if('number' == typeof n){
					return (at.back || at).$.back(n - 1);
				}
				return this;
			};
			var empty = {}, u;
		})(USE, './back');
	USE(function(module){
			// WARNING: GUN is very simple, but the JavaScript chaining API around GUN
			// is complicated and was extremely hard to build. If you port GUN to another
			// language, consider implementing an easier API to build.
			var Gun = USE('./root');
			Gun.chain.chain = function(sub){
				var gun = this, at = gun._, chain = new (sub || gun).constructor(gun), cat = chain._, root;
				cat.root = root = at.root;
				cat.id = ++root.once;
				cat.back = gun._;
				cat.on = Gun.on;
				cat.on('in', Gun.on.in, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
				cat.on('out', Gun.on.out, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
				return chain;
			};

			function output(msg){
				var get, at = this.as, back = at.back, root = at.root, tmp;
				if(!msg.$){ msg.$ = at.$; }
				this.to.next(msg);
				if(at.err){ at.on('in', {put: at.put = u, $: at.$}); return }
				if(get = msg.get){
					/*if(u !== at.put){
						at.on('in', at);
						return;
					}*/
					if(root.pass){ root.pass[at.id] = at; } // will this make for buggy behavior elsewhere?
					if(at.lex){ Object.keys(at.lex).forEach(function(k){ tmp[k] = at.lex[k]; }, tmp = msg.get = msg.get || {}); }
					if(get['#'] || at.soul){
						get['#'] = get['#'] || at.soul;
						//root.graph[get['#']] = root.graph[get['#']] || {_:{'#':get['#'],'>':{}}};
						msg['#'] || (msg['#'] = text_rand(9)); // A3120 ?
						back = (root.$.get(get['#'])._);
						if(!(get = get['.'])){ // soul
							tmp = back.ask && back.ask['']; // check if we have already asked for the full node
							(back.ask || (back.ask = {}))[''] = back; // add a flag that we are now.
							if(u !== back.put){ // if we already have data,
								back.on('in', back); // send what is cached down the chain
								if(tmp){ return } // and don't ask for it again.
							}
							msg.$ = back.$;
						} else
						if(obj_has(back.put, get)){ // TODO: support #LEX !
							tmp = back.ask && back.ask[get];
							(back.ask || (back.ask = {}))[get] = back.$.get(get)._;
							back.on('in', {get: get, put: {'#': back.soul, '.': get, ':': back.put[get], '>': state_is(root.graph[back.soul], get)}});
							if(tmp){ return }
						}
							/*put = (back.$.get(get)._);
							if(!(tmp = put.ack)){ put.ack = -1 }
							back.on('in', {
								$: back.$,
								put: Gun.state.ify({}, get, Gun.state(back.put, get), back.put[get]),
								get: back.get
							});
							if(tmp){ return }
						} else
						if('string' != typeof get){
							var put = {}, meta = (back.put||{})._;
							Gun.obj.map(back.put, function(v,k){
								if(!Gun.text.match(k, get)){ return }
								put[k] = v;
							})
							if(!Gun.obj.empty(put)){
								put._ = meta;
								back.on('in', {$: back.$, put: put, get: back.get})
							}
							if(tmp = at.lex){
								tmp = (tmp._) || (tmp._ = function(){});
								if(back.ack < tmp.ask){ tmp.ask = back.ack }
								if(tmp.ask){ return }
								tmp.ask = 1;
							}
						}
						*/
						root.ask(ack, msg); // A3120 ?
						return root.on('in', msg);
					}
					//if(root.now){ root.now[at.id] = root.now[at.id] || true; at.pass = {} }
					if(get['.']){
						if(at.get){
							msg = {get: {'.': at.get}, $: at.$};
							(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
							return back.on('out', msg);
						}
						msg = {get: at.lex? msg.get : {}, $: at.$};
						return back.on('out', msg);
					}
					(at.ask || (at.ask = {}))[''] = at;	 //at.ack = at.ack || -1;
					if(at.get){
						get['.'] = at.get;
						(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
						return back.on('out', msg);
					}
				}
				return back.on('out', msg);
			} Gun.on.out = output;

			function input(msg, cat){ cat = cat || this.as; // TODO: V8 may not be able to optimize functions with different parameter calls, so try to do benchmark to see if there is any actual difference.
				var root = cat.root, gun = msg.$ || (msg.$ = cat.$), at = (gun||'')._ || empty, tmp = msg.put||'', soul = tmp['#'], key = tmp['.'], change = (u !== tmp['='])? tmp['='] : tmp[':'], state = tmp['>'] || -Infinity, sat; // eve = event, at = data at, cat = chain at, sat = sub at (children chains).
				if(u !== msg.put && (u === tmp['#'] || u === tmp['.'] || (u === tmp[':'] && u === tmp['=']) || u === tmp['>'])){ // convert from old format
					if(!valid(tmp)){
						if(!(soul = ((tmp||'')._||'')['#'])){ console.log("chain not yet supported for", tmp, '...', msg, cat); return; }
						gun = cat.root.$.get(soul);
						return setTimeout.each(Object.keys(tmp).sort(), function(k){ // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
							if('_' == k || u === (state = state_is(tmp, k))){ return }
							cat.on('in', {$: gun, put: {'#': soul, '.': k, '=': tmp[k], '>': state}, VIA: msg});
						});
					}
					cat.on('in', {$: at.back.$, put: {'#': soul = at.back.soul, '.': key = at.has || at.get, '=': tmp, '>': state_is(at.back.put, key)}, via: msg}); // TODO: This could be buggy! It assumes/approxes data, other stuff could have corrupted it.
					return;
				}
				if((msg.seen||'')[cat.id]){ return } (msg.seen || (msg.seen = function(){}))[cat.id] = cat; // help stop some infinite loops

				if(cat !== at){ // don't worry about this when first understanding the code, it handles changing contexts on a message. A soul chain will never have a different context.
					Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; }, tmp = {}); // make copy of message
					tmp.get = cat.get || tmp.get;
					if(!cat.soul && !cat.has){ // if we do not recognize the chain type
						tmp.$$$ = tmp.$$$ || cat.$; // make a reference to wherever it came from.
					} else
					if(at.soul){ // a has (property) chain will have a different context sometimes if it is linked (to a soul chain). Anything that is not a soul or has chain, will always have different contexts.
						tmp.$ = cat.$;
						tmp.$$ = tmp.$$ || at.$;
					}
					msg = tmp; // use the message with the new context instead;
				}
				unlink(msg, cat);

				if(((cat.soul/* && (cat.ask||'')['']*/) || msg.$$) && state >= state_is(root.graph[soul], key)){ // The root has an in-memory cache of the graph, but if our peer has asked for the data then we want a per deduplicated chain copy of the data that might have local edits on it.
					(tmp = root.$.get(soul)._).put = state_ify(tmp.put, key, state, change, soul);
				}
				if(!at.soul /*&& (at.ask||'')['']*/ && state >= state_is(root.graph[soul], key) && (sat = (root.$.get(soul)._.next||'')[key])){ // Same as above here, but for other types of chains. // TODO: Improve perf by preventing echoes recaching.
					sat.put = change; // update cache
					if('string' == typeof (tmp = valid(change))){
						sat.put = root.$.get(tmp)._.put || change; // share same cache as what we're linked to.
					}
				}

				this.to && this.to.next(msg); // 1st API job is to call all chain listeners.
				// TODO: Make input more reusable by only doing these (some?) calls if we are a chain we recognize? This means each input listener would be responsible for when listeners need to be called, which makes sense, as they might want to filter.
				cat.any && setTimeout.each(Object.keys(cat.any), function(any){ (any = cat.any[any]) && any(msg); },0,99); // 1st API job is to call all chain listeners. // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.
				cat.echo && setTimeout.each(Object.keys(cat.echo), function(lat){ (lat = cat.echo[lat]) && lat.on('in', msg); },0,99); // & linked at chains // TODO: .keys( is slow // BUG: Some re-in logic may depend on this being sync.

				if(((msg.$$||'')._||at).soul){ // comments are linear, but this line of code is non-linear, so if I were to comment what it does, you'd have to read 42 other comments first... but you can't read any of those comments until you first read this comment. What!? // shouldn't this match link's check?
					// is there cases where it is a $$ that we do NOT want to do the following? 
					if((sat = cat.next) && (sat = sat[key])){ // TODO: possible trick? Maybe have `ionmap` code set a sat? // TODO: Maybe we should do `cat.ask` instead? I guess does not matter.
						tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; });
						tmp.$ = (msg.$$||msg.$).get(tmp.get = key); delete tmp.$$; delete tmp.$$$;
						sat.on('in', tmp);
					}
				}

				link(msg, cat);
			} Gun.on.in = input;

			function link(msg, cat){ cat = cat || this.as || msg.$._;
				if(msg.$$ && this !== Gun.on){ return } // $$ means we came from a link, so we are at the wrong level, thus ignore it unless overruled manually by being called directly.
				if(!msg.put || cat.soul){ return } // But you cannot overrule being linked to nothing, or trying to link a soul chain - that must never happen.
				var put = msg.put||'', link = put['=']||put[':'], tmp;
				var root = cat.root, tat = root.$.get(put['#']).get(put['.'])._;
				if('string' != typeof (link = valid(link))){
					if(this === Gun.on){ (tat.echo || (tat.echo = {}))[cat.id] = cat; } // allow some chain to explicitly force linking to simple data.
					return; // by default do not link to data that is not a link.
				}
				if((tat.echo || (tat.echo = {}))[cat.id] // we've already linked ourselves so we do not need to do it again. Except... (annoying implementation details)
					&& !(root.pass||'')[cat.id]){ return } // if a new event listener was added, we need to make a pass through for it. The pass will be on the chain, not always the chain passed down. 
				if(tmp = root.pass){ if(tmp[link+cat.id]){ return } tmp[link+cat.id] = 1; } // But the above edge case may "pass through" on a circular graph causing infinite passes, so we hackily add a temporary check for that.

				(tat.echo||(tat.echo={}))[cat.id] = cat; // set ourself up for the echo! // TODO: BUG? Echo to self no longer causes problems? Confirm.

				if(cat.has){ cat.link = link; }
				var sat = root.$.get(tat.link = link)._; // grab what we're linking to.
				(sat.echo || (sat.echo = {}))[tat.id] = tat; // link it.
				var tmp = cat.ask||''; // ask the chain for what needs to be loaded next!
				if(tmp[''] || cat.lex){ // we might need to load the whole thing // TODO: cat.lex probably has edge case bugs to it, need more test coverage.
					sat.on('out', {get: {'#': link}});
				}
				setTimeout.each(Object.keys(tmp), function(get, sat){ // if sub chains are asking for data. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync?
					if(!get || !(sat = tmp[get])){ return }
					sat.on('out', {get: {'#': link, '.': get}}); // go get it.
				},0,99);
			} Gun.on.link = link;

			function unlink(msg, cat){ // ugh, so much code for seemingly edge case behavior.
				var put = msg.put||'', change = (u !== put['='])? put['='] : put[':'], root = cat.root, link, tmp;
				if(u === change){ // 1st edge case: If we have a brand new database, no data will be found.
					// TODO: BUG! because emptying cache could be async from below, make sure we are not emptying a newer cache. So maybe pass an Async ID to check against?
					// TODO: BUG! What if this is a map? // Warning! Clearing things out needs to be robust against sync/async ops, or else you'll see `map val get put` test catastrophically fail because map attempts to link when parent graph is streamed before child value gets set. Need to differentiate between lack acks and force clearing.
					if(cat.soul && u !== cat.put){ return } // data may not be found on a soul, but if a soul already has data, then nothing can clear the soul as a whole.
					//if(!cat.has){ return }
					tmp = (msg.$$||msg.$||'')._||'';
					if(msg['@'] && (u !== tmp.put || u !== cat.put)){ return } // a "not found" from other peers should not clear out data if we have already found it.
					//if(cat.has && u === cat.put && !(root.pass||'')[cat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
					if(link = cat.link || msg.linked){
						delete (root.$.get(link)._.echo||'')[cat.id];
					}
					if(cat.has){ // TODO: Empty out links, maps, echos, acks/asks, etc.?
						cat.link = null;
					}
					cat.put = u; // empty out the cache if, for example, alice's car's color no longer exists (relative to alice) if alice no longer has a car.
					// TODO: BUG! For maps, proxy this so the individual sub is triggered, not all subs.
					setTimeout.each(Object.keys(cat.next||''), function(get, sat){ // empty out all sub chains. // TODO: .keys( is slow // BUG? ?Some re-in logic may depend on this being sync? // TODO: BUG? This will trigger deeper put first, does put logic depend on nested order? // TODO: BUG! For map, this needs to be the isolated child, not all of them.
						if(!(sat = cat.next[get])){ return }
						//if(cat.has && u === sat.put && !(root.pass||'')[sat.id]){ return } // if we are already unlinked, do not call again, unless edge case. // TODO: BUG! This line should be deleted for "unlink deeply nested".
						if(link){ delete (root.$.get(link).get(get)._.echo||'')[sat.id]; }
						sat.on('in', {get: get, put: u, $: sat.$}); // TODO: BUG? Add recursive seen check?
					},0,99);
					return;
				}
				if(cat.soul){ return } // a soul cannot unlink itself.
				if(msg.$$){ return } // a linked chain does not do the unlinking, the sub chain does. // TODO: BUG? Will this cancel maps?
				link = valid(change); // need to unlink anytime we are not the same link, though only do this once per unlink (and not on init).
				tmp = msg.$._||'';
				if(link === tmp.link || (cat.has && !tmp.link)){
					if((root.pass||'')[cat.id] && 'string' !== typeof link); else {
						return;
					}
				}
				delete (tmp.echo||'')[cat.id];
				unlink({get: cat.get, put: u, $: msg.$, linked: msg.linked = msg.linked || tmp.link}, cat); // unlink our sub chains.
			} Gun.on.unlink = unlink;

			function ack(msg, ev){
				//if(!msg['%'] && (this||'').off){ this.off() } // do NOT memory leak, turn off listeners! Now handled by .ask itself
				// manhattan:
				var as = this.as, at = as.$._, get = as.get||'', tmp = (msg.put||'')[get['#']]||'';
				if(!msg.put || ('string' == typeof get['.'] && u === tmp[get['.']])){
					if(u !== at.put){ return }
					if(!at.soul && !at.has){ return } // TODO: BUG? For now, only core-chains will handle not-founds, because bugs creep in if non-core chains are used as $ but we can revisit this later for more powerful extensions.
					at.ack = (at.ack || 0) + 1;
					at.on('in', {
						get: at.get,
						put: at.put = u,
						$: at.$,
						'@': msg['@']
					});
					/*(tmp = at.Q) && setTimeout.each(Object.keys(tmp), function(id){ // TODO: Temporary testing, not integrated or being used, probably delete.
						Object.keys(msg).forEach(function(k){ tmp[k] = msg[k] }, tmp = {}); tmp['@'] = id; // copy message
						root.on('in', tmp);
					}); delete at.Q;*/
					return;
				}
				(msg._||{}).miss = 1;
				Gun.on.put(msg);
				return; // eom
			}

			var empty = {}, u, text_rand = String.random, valid = Gun.valid, obj_has = function(o, k){ return o && Object.prototype.hasOwnProperty.call(o, k) }, state = Gun.state, state_is = state.is, state_ify = state.ify;
		})(USE, './chain');
	USE(function(module){
			var Gun = USE('./root');
			Gun.chain.get = function(key, cb, as){
				var gun, tmp;
				if(typeof key === 'string'){
					if(key.length == 0) {	
						(gun = this.chain())._.err = {err: Gun.log('0 length key!', key)};
						if(cb){ cb.call(gun, gun._.err); }
						return gun;
					}
					var back = this, cat = back._;
					var next = cat.next || empty;
					if(!(gun = next[key])){
						gun = key && cache(key, back);
					}
					gun = gun && gun.$;
				} else
				if('function' == typeof key){
					if(true === cb){ return soul(this, key, cb, as), this }
					gun = this;
					var cat = gun._, opt = cb || {}, root = cat.root, id;
					opt.at = cat;
					opt.ok = key;
					var wait = {}; // can we assign this to the at instead, like in once?
					//var path = []; cat.$.back(at => { at.get && path.push(at.get.slice(0,9))}); path = path.reverse().join('.');
					function any(msg, eve, f){
						if(any.stun){ return }
						if((tmp = root.pass) && !tmp[id]){ return }
						var at = msg.$._, sat = (msg.$$||'')._, data = (sat||at).put, odd = (!at.has && !at.soul), test = {}, link, tmp;
						if(odd || u === data){ // handles non-core
							data = (u === ((tmp = msg.put)||'')['='])? (u === (tmp||'')[':'])? tmp : tmp[':'] : tmp['='];
						}
						if(link = ('string' == typeof (tmp = Gun.valid(data)))){
							data = (u === (tmp = root.$.get(tmp)._.put))? opt.not? u : data : tmp;
						}
						if(opt.not && u === data){ return }
						if(u === opt.stun){
							if((tmp = root.stun) && tmp.on){
								cat.$.back(function(a){ // our chain stunned?
									tmp.on(''+a.id, test = {});
									if((test.run || 0) < any.id){ return test } // if there is an earlier stun on gapless parents/self.
								});
								!test.run && tmp.on(''+at.id, test = {}); // this node stunned?
								!test.run && sat && tmp.on(''+sat.id, test = {}); // linked node stunned?
								if(any.id > test.run){
									if(!test.stun || test.stun.end){
										test.stun = tmp.on('stun');
										test.stun = test.stun && test.stun.last;
									}
									if(test.stun && !test.stun.end){
										//if(odd && u === data){ return }
										//if(u === msg.put){ return } // "not found" acks will be found if there is stun, so ignore these.
										(test.stun.add || (test.stun.add = {}))[id] = function(){ any(msg,eve,1); }; // add ourself to the stun callback list that is called at end of the write.
										return;
									}
								}
							}
							if(/*odd &&*/ u === data){ f = 0; } // if data not found, keep waiting/trying.
							/*if(f && u === data){
								cat.on('out', opt.out);
								return;
							}*/
							if((tmp = root.hatch) && !tmp.end && u === opt.hatch && !f){ // quick hack! // What's going on here? Because data is streamed, we get things one by one, but a lot of developers would rather get a callback after each batch instead, so this does that by creating a wait list per chain id that is then called at the end of the batch by the hatch code in the root put listener.
								if(wait[at.$._.id]){ return } wait[at.$._.id] = 1;
								tmp.push(function(){any(msg,eve,1);});
								return;
							} wait = {}; // end quick hack.
						}
						// call:
						if(root.pass){ if(root.pass[id+at.id]){ return } root.pass[id+at.id] = 1; }
						if(opt.on){ opt.ok.call(at.$, data, at.get, msg, eve || any); return } // TODO: Also consider breaking `this` since a lot of people do `=>` these days and `.call(` has slower performance.
						if(opt.v2020){ opt.ok(msg, eve || any); return }
						Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; }, tmp = {}); msg = tmp; msg.put = data; // 2019 COMPATIBILITY! TODO: GET RID OF THIS!
						opt.ok.call(opt.as, msg, eve || any); // is this the right
					}				any.at = cat;
					//(cat.any||(cat.any=function(msg){ setTimeout.each(Object.keys(cat.any||''), function(act){ (act = cat.any[act]) && act(msg) },0,99) }))[id = String.random(7)] = any; // maybe switch to this in future?
					(cat.any||(cat.any={}))[id = String.random(7)] = any;
					any.off = function(){ any.stun = 1; if(!cat.any){ return } delete cat.any[id]; };
					any.rid = rid; // logic from old version, can we clean it up now?
					any.id = opt.run || ++root.once; // used in callback to check if we are earlier than a write. // will this ever cause an integer overflow?
					tmp = root.pass; (root.pass = {})[id] = 1; // Explanation: test trade-offs want to prevent recursion so we add/remove pass flag as it gets fulfilled to not repeat, however map map needs many pass flags - how do we reconcile?
					opt.out = opt.out || {get: {}};
					cat.on('out', opt.out);
					root.pass = tmp;
					return gun;
				} else
				if('number' == typeof key){
					return this.get(''+key, cb, as);
				} else
				if('string' == typeof (tmp = valid(key))){
					return this.get(tmp, cb, as);
				} else
				if(tmp = this.get.next){
					gun = tmp(this, key);
				}
				if(!gun){
					(gun = this.chain())._.err = {err: Gun.log('Invalid get request!', key)}; // CLEAN UP
					if(cb){ cb.call(gun, gun._.err); }
					return gun;
				}
				if(cb && 'function' == typeof cb){
					gun.get(cb, as);
				}
				return gun;
			};
			function cache(key, back){
				var cat = back._, next = cat.next, gun = back.chain(), at = gun._;
				if(!next){ next = cat.next = {}; }
				next[at.get = key] = at;
				if(back === cat.root.$){
					at.soul = key;
					//at.put = {};
				} else
				if(cat.soul || cat.has){
					at.has = key;
					//if(obj_has(cat.put, key)){
						//at.put = cat.put[key];
					//}
				}
				return at;
			}
			function soul(gun, cb, opt, as){
				var cat = gun._, acks = 0, tmp;
				if(tmp = cat.soul || cat.link){ return cb(tmp, as, cat) }
				if(cat.jam){ return cat.jam.push([cb, as]) }
				cat.jam = [[cb,as]];
				gun.get(function go(msg, eve){
					if(u === msg.put && !cat.root.opt.super && (tmp = Object.keys(cat.root.opt.peers).length) && ++acks <= tmp){ // TODO: super should not be in core code, bring AXE up into core instead to fix? // TODO: .keys( is slow
						return;
					}
					eve.rid(msg);
					var at = ((at = msg.$) && at._) || {}, i = 0, as;
					tmp = cat.jam; delete cat.jam; // tmp = cat.jam.splice(0, 100);
					//if(tmp.length){ process.nextTick(function(){ go(msg, eve) }) }
					while(as = tmp[i++]){ //Gun.obj.map(tmp, function(as, cb){
						var cb = as[0], id; as = as[1];
						cb && cb(id = at.link || at.soul || Gun.valid(msg.put) || ((msg.put||{})._||{})['#'], as, msg, eve);
					} //);
				}, {out: {get: {'.':true}}});
				return gun;
			}
			function rid(at){
				var cat = this.at || this.on;
				if(!at || cat.soul || cat.has){ return this.off() }
				if(!(at = (at = (at = at.$ || at)._ || at).id)){ return }
				var tmp, seen;
				//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
				if(tmp = (seen = this.seen || (this.seen = {}))[at]){ return true }
				seen[at] = true;
				return;
			}
			var empty = {}, valid = Gun.valid, u;
		})(USE, './get');
	USE(function(module){
			var Gun = USE('./root');
			Gun.chain.put = function(data, cb, as){ // I rewrote it :)
				var gun = this, at = gun._, root = at.root;
				as = as || {};
				as.root = at.root;
				as.run || (as.run = root.once);
				stun(as, at.id); // set a flag for reads to check if this chain is writing.
				as.ack = as.ack || cb;
				as.via = as.via || gun;
				as.data = as.data || data;
				as.soul || (as.soul = at.soul || ('string' == typeof cb && cb));
				var s = as.state = as.state || Gun.state();
				if('function' == typeof data){ data(function(d){ as.data = d; gun.put(u,u,as); }); return gun }
				if(!as.soul){ return get(as), gun }
				as.$ = root.$.get(as.soul); // TODO: This may not allow user chaining and similar?
				as.todo = [{it: as.data, ref: as.$}];
				as.turn = as.turn || turn;
				as.ran = as.ran || ran;
				//var path = []; as.via.back(at => { at.get && path.push(at.get.slice(0,9)) }); path = path.reverse().join('.');
				// TODO: Perf! We only need to stun chains that are being modified, not necessarily written to.
				(function walk(){
					var to = as.todo, at = to.pop(), d = at.it, v, k, cat, tmp, g;
					stun(as, at.ref);
					if(tmp = at.todo){
						k = tmp.pop(); d = d[k];
						if(tmp.length){ to.push(at); }
					}
					k && (to.path || (to.path = [])).push(k);
					if(!(v = valid(d)) && !(g = Gun.is(d))){
						if(!Object.plain(d)){ ran.err(as, "Invalid data: "+ check(d) +" at " + (as.via.back(function(at){at.get && tmp.push(at.get);}, tmp = []) || tmp.join('.'))+'.'+(to.path||[]).join('.')); return }
						var seen = as.seen || (as.seen = []), i = seen.length;
						while(i--){ if(d === (tmp = seen[i]).it){ v = d = tmp.link; break } }
					}
					if(k && v){ at.node = state_ify(at.node, k, s, d); } // handle soul later.
					else {
						if(!as.seen){ ran.err(as, "Data at root of graph must be a node (an object)."); return }
						as.seen.push(cat = {it: d, link: {}, todo: g? [] : Object.keys(d).sort().reverse(), path: (to.path||[]).slice(), up: at}); // Any perf reasons to CPU schedule this .keys( ?
						at.node = state_ify(at.node, k, s, cat.link);
						!g && cat.todo.length && to.push(cat);
						// ---------------
						var id = as.seen.length;
						(as.wait || (as.wait = {}))[id] = '';
						tmp = (cat.ref = (g? d : k? at.ref.get(k) : at.ref))._;
						(tmp = (d && (d._||'')['#']) || tmp.soul || tmp.link)? resolve({soul: tmp}) : cat.ref.get(resolve, {run: as.run, /*hatch: 0,*/ v2020:1, out:{get:{'.':' '}}}); // TODO: BUG! This should be resolve ONLY soul to prevent full data from being loaded. // Fixed now?
						//setTimeout(function(){ if(F){ return } console.log("I HAVE NOT BEEN CALLED!", path, id, cat.ref._.id, k) }, 9000); var F; // MAKE SURE TO ADD F = 1 below!
						function resolve(msg, eve){
							var end = cat.link['#'];
							if(eve){ eve.off(); eve.rid(msg); } // TODO: Too early! Check all peers ack not found.
							// TODO: BUG maybe? Make sure this does not pick up a link change wipe, that it uses the changign link instead.
							var soul = end || msg.soul || (tmp = (msg.$$||msg.$)._||'').soul || tmp.link || ((tmp = tmp.put||'')._||'')['#'] || tmp['#'] || (((tmp = msg.put||'') && msg.$$)? tmp['#'] : (tmp['=']||tmp[':']||'')['#']);
							!end && stun(as, msg.$);
							if(!soul && !at.link['#']){ // check soul link above us
								(at.wait || (at.wait = [])).push(function(){ resolve(msg, eve); }); // wait
								return;
							}
							if(!soul){
								soul = [];
								(msg.$$||msg.$).back(function(at){
									if(tmp = at.soul || at.link){ return soul.push(tmp) }
									soul.push(at.get);
								});
								soul = soul.reverse().join('/');
							}
							cat.link['#'] = soul;
							!g && (((as.graph || (as.graph = {}))[soul] = (cat.node || (cat.node = {_:{}})))._['#'] = soul);
							delete as.wait[id];
							cat.wait && setTimeout.each(cat.wait, function(cb){ cb && cb(); });
							as.ran(as);
						}					// ---------------
					}
					if(!to.length){ return as.ran(as) }
					as.turn(walk);
				}());
				return gun;
			};

			function stun(as, id){
				if(!id){ return } id = (id._||'').id||id;
				var run = as.root.stun || (as.root.stun = {on: Gun.on}), test = {}, tmp;
				as.stun || (as.stun = run.on('stun', function(){ }));
				if(tmp = run.on(''+id)){ tmp.the.last.next(test); }
				if(test.run >= as.run){ return }
				run.on(''+id, function(test){
					if(as.stun.end){
						this.off();
						this.to.next(test);
						return;
					}
					test.run = test.run || as.run;
					test.stun = test.stun || as.stun; return;
				});
			}

			function ran(as){
				if(as.err){ ran.end(as.stun, as.root); return } // move log handle here.
				if(as.todo.length || as.end || !Object.empty(as.wait)){ return } as.end = 1;
				//(as.retry = function(){ as.acks = 0;
				var cat = (as.$.back(-1)._), root = cat.root, ask = cat.ask(function(ack){
					root.on('ack', ack);
					if(ack.err && !ack.lack){ Gun.log(ack); }
					if(++acks > (as.acks || 0)){ this.off(); } // Adjustable ACKs! Only 1 by default.
					if(!as.ack){ return }
					as.ack(ack, this);
				}, as.opt), acks = 0, stun = as.stun, tmp;
				(tmp = function(){ // this is not official yet, but quick solution to hack in for now.
					if(!stun){ return }
					ran.end(stun, root);
					setTimeout.each(Object.keys(stun = stun.add||''), function(cb){ if(cb = stun[cb]){cb();} }); // resume the stunned reads // Any perf reasons to CPU schedule this .keys( ?
				}).hatch = tmp; // this is not official yet ^
				//console.log(1, "PUT", as.run, as.graph);
				if(as.ack && !as.ok){ as.ok = as.acks || 9; } // TODO: In future! Remove this! This is just old API support.
				(as.via._).on('out', {put: as.out = as.graph, ok: as.ok && {'@': as.ok+1}, opt: as.opt, '#': ask, _: tmp});
				//})();
			} ran.end = function(stun,root){
				stun.end = noop; // like with the earlier id, cheaper to make this flag a function so below callbacks do not have to do an extra type check.
				if(stun.the.to === stun && stun === stun.the.last){ delete root.stun; }
				stun.off();
			}; ran.err = function(as, err){
				(as.ack||noop).call(as, as.out = { err: as.err = Gun.log(err) });
				as.ran(as);
			};

			function get(as){
				var at = as.via._, tmp;
				as.via = as.via.back(function(at){
					if(at.soul || !at.get){ return at.$ }
					tmp = as.data; (as.data = {})[at.get] = tmp;
				});
				if(!as.via || !as.via._.soul){
					as.via = at.root.$.get(((as.data||'')._||'')['#'] || at.$.back('opt.uuid')());
				}
				as.via.put(as.data, as.ack, as);
				

				return;
			}
			function check(d, tmp){ return ((d && (tmp = d.constructor) && tmp.name) || typeof d) }

			var u, noop = function(){}, turn = setTimeout.turn, valid = Gun.valid, state_ify = Gun.state.ify;
		})(USE, './put');
	USE(function(module){
			var Gun = USE('./root');
			USE('./chain');
			USE('./back');
			USE('./put');
			USE('./get');
			module.exports = Gun;
		})(USE, './index');
	USE(function(module){
			var Gun = USE('./index');
			Gun.chain.on = function(tag, arg, eas, as){ // don't rewrite!
				var gun = this, cat = gun._, act;
				if(typeof tag === 'string'){
					if(!arg){ return cat.on(tag) }
					act = cat.on(tag, arg, eas || cat, as);
					if(eas && eas.$){
						(eas.subs || (eas.subs = [])).push(act);
					}
					return gun;
				}
				var opt = arg;
				(opt = (true === opt)? {change: true} : opt || {}).not = 1; opt.on = 1;
				gun.get(tag, opt);
				/*gun.get(function on(data,key,msg,eve){ var $ = this;
					if(tmp = root.hatch){ // quick hack!
						if(wait[$._.id]){ return } wait[$._.id] = 1;
						tmp.push(function(){on.call($, data,key,msg,eve)});
						return;
					}; wait = {}; // end quick hack.
					tag.call($, data,key,msg,eve);
				}, opt); // TODO: PERF! Event listener leak!!!?*/
				/*
				function one(msg, eve){
					if(one.stun){ return }
					var at = msg.$._, data = at.put, tmp;
					if(tmp = at.link){ data = root.$.get(tmp)._.put }
					if(opt.not===u && u === data){ return }
					if(opt.stun===u && (tmp = root.stun) && (tmp = tmp[at.id] || tmp[at.back.id]) && !tmp.end){ // Remember! If you port this into `.get(cb` make sure you allow stun:0 skip option for `.put(`.
						tmp[id] = function(){one(msg,eve)};
						return;
					}
					//tmp = one.wait || (one.wait = {}); console.log(tmp[at.id] === ''); if(tmp[at.id] !== ''){ tmp[at.id] = tmp[at.id] || setTimeout(function(){tmp[at.id]='';one(msg,eve)},1); return } delete tmp[at.id];
					// call:
					if(opt.as){
						opt.ok.call(opt.as, msg, eve || one);
					} else {
						opt.ok.call(at.$, data, msg.get || at.get, msg, eve || one);
					}
				};
				one.at = cat;
				(cat.act||(cat.act={}))[id = String.random(7)] = one;
				one.off = function(){ one.stun = 1; if(!cat.act){ return } delete cat.act[id] }
				cat.on('out', {get: {}});*/
				return gun;
			};
			// Rules:
			// 1. If cached, should be fast, but not read while write.
			// 2. Should not retrigger other listeners, should get triggered even if nothing found.
			// 3. If the same callback passed to many different once chains, each should resolve - an unsubscribe from the same callback should not effect the state of the other resolving chains, if you do want to cancel them all early you should mutate the callback itself with a flag & check for it at top of callback
			Gun.chain.once = function(cb, opt){ opt = opt || {}; // avoid rewriting
				if(!cb){ return none(this) }
				var gun = this, cat = gun._, root = cat.root, id = String.random(7), tmp;
				gun.get(function(data,key,msg,eve){
					var $ = this, at = $._, one = (at.one||(at.one={}));
					if(eve.stun){ return } if('' === one[id]){ return }
					if(true === (tmp = Gun.valid(data))){ once(); return }
					if('string' == typeof tmp){ return } // TODO: BUG? Will this always load?
					clearTimeout((cat.one||'')[id]); // clear "not found" since they only get set on cat.
					clearTimeout(one[id]); one[id] = setTimeout(once, opt.wait||99); // TODO: Bug? This doesn't handle plural chains.
					function once(f){
						if(!at.has && !at.soul){ at = {put: data, get: key}; } // handles non-core messages.
						if(u === (tmp = at.put)){ tmp = ((msg.$$||'')._||'').put; }
						if('string' == typeof Gun.valid(tmp)){
							tmp = root.$.get(tmp)._.put;
							if(tmp === u && !f){
								one[id] = setTimeout(function(){ once(1); }, opt.wait||99); // TODO: Quick fix. Maybe use ack count for more predictable control?
								return
							}
						}
						//console.log("AND VANISHED", data);
						if(eve.stun){ return } if('' === one[id]){ return } one[id] = '';
						if(cat.soul || cat.has){ eve.off(); } // TODO: Plural chains? // else { ?.off() } // better than one check?
						cb.call($, tmp, at.get);
						clearTimeout(one[id]); // clear "not found" since they only get set on cat. // TODO: This was hackily added, is it necessary or important? Probably not, in future try removing this. Was added just as a safety for the `&& !f` check.
					}			}, {on: 1});
				return gun;
			};
			function none(gun,opt,chain){
				Gun.log.once("valonce", "Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
				(chain = gun.chain())._.nix = gun.once(function(data, key){ chain._.on('in', this._); });
				chain._.lex = gun._.lex; // TODO: Better approach in future? This is quick for now.
				return chain;
			}

			Gun.chain.off = function(){
				// make off more aggressive. Warning, it might backfire!
				var gun = this, at = gun._, tmp;
				var cat = at.back;
				if(!cat){ return }
				at.ack = 0; // so can resubscribe.
				if(tmp = cat.next){
					if(tmp[at.get]){
						delete tmp[at.get];
					}
				}
				// TODO: delete cat.one[map.id]?
				if(tmp = cat.ask){
					delete tmp[at.get];
				}
				if(tmp = cat.put){
					delete tmp[at.get];
				}
				if(tmp = at.soul){
					delete cat.root.graph[tmp];
				}
				if(tmp = at.map){
					Object.keys(tmp).forEach(function(i,at){ at = tmp[i]; //obj_map(tmp, function(at){
						if(at.link){
							cat.root.$.get(at.link).off();
						}
					});
				}
				if(tmp = at.next){
					Object.keys(tmp).forEach(function(i,neat){ neat = tmp[i]; //obj_map(tmp, function(neat){
						neat.$.off();
					});
				}
				at.on('off', {});
				return gun;
			};
			var u;
		})(USE, './on');
	USE(function(module){
			var Gun = USE('./index'), next = Gun.chain.get.next;
			Gun.chain.get.next = function(gun, lex){ var tmp;
				if(!Object.plain(lex)){ return (next||noop)(gun, lex) }
				if(tmp = ((tmp = lex['#'])||'')['='] || tmp){ return gun.get(tmp) }
				(tmp = gun.chain()._).lex = lex; // LEX!
				gun.on('in', function(eve){
					if(String.match(eve.get|| (eve.put||'')['.'], lex['.'] || lex['#'] || lex)){
						tmp.on('in', eve);
					}
					this.to.next(eve);
				});
				return tmp.$;
			};
			Gun.chain.map = function(cb, opt, t){
				var gun = this, cat = gun._, lex, chain;
				if(Object.plain(cb)){ lex = cb['.']? cb : {'.': cb}; cb = u; }
				if(!cb){
					if(chain = cat.each){ return chain }
					(cat.each = chain = gun.chain())._.lex = lex || chain._.lex || cat.lex;
					chain._.nix = gun.back('nix');
					gun.on('in', map, chain._);
					return chain;
				}
				Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
				chain = gun.chain();
				gun.map().on(function(data, key, msg, eve){
					var next = (cb||noop).call(this, data, key, msg, eve);
					if(u === next){ return }
					if(data === next){ return chain._.on('in', msg) }
					if(Gun.is(next)){ return chain._.on('in', next._) }
					var tmp = {}; Object.keys(msg.put).forEach(function(k){ tmp[k] = msg.put[k]; }, tmp); tmp['='] = next; 
					chain._.on('in', {get: key, put: tmp});
				});
				return chain;
			};
			function map(msg){ this.to.next(msg);
				var cat = this.as, gun = msg.$, at = gun._, put = msg.put, tmp;
				if(!at.soul && !msg.$$){ return } // this line took hundreds of tries to figure out. It only works if core checks to filter out above chains during link tho. This says "only bother to map on a node" for this layer of the chain. If something is not a node, map should not work.
				if((tmp = cat.lex) && !String.match(msg.get|| (put||'')['.'], tmp['.'] || tmp['#'] || tmp)){ return }
				Gun.on.link(msg, cat);
			}
			var noop = function(){}, u;
		})(USE, './map');
	USE(function(module){
			var Gun = USE('./index');
			Gun.chain.set = function(item, cb, opt){
				var gun = this, root = gun.back(-1), soul, tmp;
				cb = cb || function(){};
				opt = opt || {}; opt.item = opt.item || item;
				if(soul = ((item||'')._||'')['#']){ (item = {})['#'] = soul; } // check if node, make link.
				if('string' == typeof (tmp = Gun.valid(item))){ return gun.get(soul = tmp).put(item, cb, opt) } // check if link
				if(!Gun.is(item)){
					if(Object.plain(item)){
						item = root.get(soul = gun.back('opt.uuid')()).put(item);
					}
					return gun.get(soul || root.back('opt.uuid')(7)).put(item, cb, opt);
				}
				gun.put(function(go){
					item.get(function(soul, o, msg){ // TODO: BUG! We no longer have this option? & go error not handled?
						if(!soul){ return cb.call(gun, {err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!')}) }
						(tmp = {})[soul] = {'#': soul}; go(tmp);
					},true);
				});
				return item;
			};
		})(USE, './set');
	USE(function(module){
			USE('./shim');

			var noop = function(){};
			var parse = JSON.parseAsync || function(t,cb,r){ var u, d = +new Date; try{ cb(u, JSON.parse(t,r), json.sucks(+new Date - d)); }catch(e){ cb(e); } };
			var json = JSON.stringifyAsync || function(v,cb,r,s){ var u, d = +new Date; try{ cb(u, JSON.stringify(v,r,s), json.sucks(+new Date - d)); }catch(e){ cb(e); } };
			json.sucks = function(d){ if(d > 99){ console.log("Warning: JSON blocking CPU detected. Add `gun/lib/yson.js` to fix."); json.sucks = noop; } };

			function Mesh(root){
				var mesh = function(){};
				var opt = root.opt || {};
				opt.log = opt.log || console.log;
				opt.gap = opt.gap || opt.wait || 0;
				opt.max = opt.max || (opt.memory? (opt.memory * 999 * 999) : 300000000) * 0.3;
				opt.pack = opt.pack || (opt.max * 0.01 * 0.01);
				opt.puff = opt.puff || 9; // IDEA: do a start/end benchmark, divide ops/result.
				var puff = setTimeout.turn || setTimeout;

				var dup = root.dup, dup_check = dup.check, dup_track = dup.track;

				var hear = mesh.hear = function(raw, peer){
					if(!raw){ return }
					if(opt.max <= raw.length){ return mesh.say({dam: '!', err: "Message too big!"}, peer) }
					if(mesh === this){
						/*if('string' == typeof raw){ try{
							var stat = console.STAT || {};
							//console.log('HEAR:', peer.id, (raw||'').slice(0,250), ((raw||'').length / 1024 / 1024).toFixed(4));
							
							//console.log(setTimeout.turn.s.length, 'stacks', parseFloat((-(LT - (LT = +new Date))/1000).toFixed(3)), 'sec', parseFloat(((LT-ST)/1000 / 60).toFixed(1)), 'up', stat.peers||0, 'peers', stat.has||0, 'has', stat.memhused||0, stat.memused||0, stat.memax||0, 'heap mem max');
						}catch(e){ console.log('DBG err', e) }}*/
						hear.d += raw.length||0 ; ++hear.c; } // STATS!
					var S = peer.SH = +new Date;
					var tmp = raw[0], msg;
					//raw && raw.slice && console.log("hear:", ((peer.wire||'').headers||'').origin, raw.length, raw.slice && raw.slice(0,50)); //tc-iamunique-tc-package-ds1
					if('[' === tmp){
						parse(raw, function(err, msg){
							if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
							console.STAT && console.STAT(+new Date, msg.length, '# on hear batch');
							var P = opt.puff;
							(function go(){
								var S = +new Date;
								var i = 0, m; while(i < P && (m = msg[i++])){ mesh.hear(m, peer); }
								msg = msg.slice(i); // slicing after is faster than shifting during.
								console.STAT && console.STAT(S, +new Date - S, 'hear loop');
								flush(peer); // force send all synchronously batched acks.
								if(!msg.length){ return }
								puff(go, 0);
							}());
						});
						raw = ''; // 
						return;
					}
					if('{' === tmp || ((raw['#'] || Object.plain(raw)) && (msg = raw))){
						if(msg){ return hear.one(msg, peer, S) }
						parse(raw, function(err, msg){
							if(err || !msg){ return mesh.say({dam: '!', err: "DAM JSON parse error."}, peer) }
							hear.one(msg, peer, S);
						});
						return;
					}
				};
				hear.one = function(msg, peer, S){ // S here is temporary! Undo.
					var id, hash, tmp, ash, DBG;
					if(msg.DBG){ msg.DBG = DBG = {DBG: msg.DBG}; }
					DBG && (DBG.h = S);
					DBG && (DBG.hp = +new Date);
					if(!(id = msg['#'])){ id = msg['#'] = String.random(9); }
					if(tmp = dup_check(id)){ return }
					// DAM logic:
					if(!(hash = msg['##']) && false && u !== msg.put); // disable hashing for now // TODO: impose warning/penalty instead (?)
					if(hash && (tmp = msg['@'] || (msg.get && id)) && dup.check(ash = tmp+hash)){ return } // Imagine A <-> B <=> (C & D), C & D reply with same ACK but have different IDs, B can use hash to dedup. Or if a GET has a hash already, we shouldn't ACK if same.
					(msg._ = function(){}).via = mesh.leap = peer;
					if((tmp = msg['><']) && 'string' == typeof tmp){ tmp.slice(0,99).split(',').forEach(function(k){ this[k] = 1; }, (msg._).yo = {}); } // Peers already sent to, do not resend.
					// DAM ^
					if(tmp = msg.dam){
						if(tmp = mesh.hear[tmp]){
							tmp(msg, peer, root);
						}
						dup_track(id);
						return;
					}
					if(tmp = msg.ok){ msg._.near = tmp['/']; }
					var S = +new Date;
					DBG && (DBG.is = S); peer.SI = id;
					dup_track.ed = function(d){
						if(id !== d){ return }
						dup_track.ed = 0;
						if(!(d = dup.s[id])){ return }
						d.via = peer;
						if(msg.get){ d.it = msg; }
					};
					root.on('in', mesh.last = msg);
					DBG && (DBG.hd = +new Date);
					console.STAT && console.STAT(S, +new Date - S, msg.get? 'msg get' : msg.put? 'msg put' : 'msg');
					dup_track(id); // in case 'in' does not call track.
					if(ash){ dup_track(ash); } //dup.track(tmp+hash, true).it = it(msg);
					mesh.leap = mesh.last = null; // warning! mesh.leap could be buggy.
				};
				hear.c = hear.d = 0;
	(function(){
					var SMIA = 0;
					var loop;
					mesh.hash = function(msg, peer){ var h, s, t;
						var S = +new Date;
						json(msg.put, function hash(err, text){
							var ss = (s || (s = t = text||'')).slice(0, 32768); // 1024 * 32
						  h = String.hash(ss, h); s = s.slice(32768);
						  if(s){ puff(hash, 0); return }
							console.STAT && console.STAT(S, +new Date - S, 'say json+hash');
						  msg._.$put = t;
						  msg['##'] = h;
						  mesh.say(msg, peer);
						  delete msg._.$put;
						}, sort);
					};
					function sort(k, v){ var tmp;
						if(!(v instanceof Object)){ return v }
						Object.keys(v).sort().forEach(sorta, {to: tmp = {}, on: v});
						return tmp;
					} function sorta(k){ this.to[k] = this.on[k]; }

					var say = mesh.say = function(msg, peer){ var tmp;
						if((tmp = this) && (tmp = tmp.to) && tmp.next){ tmp.next(msg); } // compatible with middleware adapters.
						if(!msg){ return false }
						var id, hash, raw, ack = msg['@'];
	//if(opt.super && (!ack || !msg.put)){ return } // TODO: MANHATTAN STUB //OBVIOUSLY BUG! But squelch relay. // :( get only is 100%+ CPU usage :(
						var meta = msg._||(msg._=function(){});
						var DBG = msg.DBG, S = +new Date; meta.y = meta.y || S; if(!peer){ DBG && (DBG.y = S); }
						if(!(id = msg['#'])){ id = msg['#'] = String.random(9); }
						!loop && dup_track(id);//.it = it(msg); // track for 9 seconds, default. Earth<->Mars would need more! // always track, maybe move this to the 'after' logic if we split function.
						//if(msg.put && (msg.err || (dup.s[id]||'').err)){ return false } // TODO: in theory we should not be able to stun a message, but for now going to check if it can help network performance preventing invalid data to relay.
						if(!(hash = msg['##']) && u !== msg.put && !meta.via && ack){ mesh.hash(msg, peer); return } // TODO: Should broadcasts be hashed?
						if(!peer && ack){ peer = ((tmp = dup.s[ack]) && (tmp.via || ((tmp = tmp.it) && (tmp = tmp._) && tmp.via))) || ((tmp = mesh.last) && ack === tmp['#'] && mesh.leap); } // warning! mesh.leap could be buggy! mesh last check reduces this. // TODO: CLEAN UP THIS LINE NOW? `.it` should be reliable.
						if(!peer && ack){ // still no peer, then ack daisy chain 'tunnel' got lost.
							if(dup.s[ack]){ return } // in dups but no peer hints that this was ack to ourself, ignore.
							console.STAT && console.STAT(+new Date, ++SMIA, 'total no peer to ack to'); // TODO: Delete this now. Dropping lost ACKs is protocol fine now.
							return false;
						} // TODO: Temporary? If ack via trace has been lost, acks will go to all peers, which trashes browser bandwidth. Not relaying the ack will force sender to ask for ack again. Note, this is technically wrong for mesh behavior.
						if(ack && !msg.put && !hash && ((dup.s[ack]||'').it||'')['##']){ return false } // If we're saying 'not found' but a relay had data, do not bother sending our not found. // Is this correct, return false? // NOTE: ADD PANIC TEST FOR THIS!
						if(!peer && mesh.way){ return mesh.way(msg) }
						DBG && (DBG.yh = +new Date);
						if(!(raw = meta.raw)){ mesh.raw(msg, peer); return }
						DBG && (DBG.yr = +new Date);
						if(!peer || !peer.id){
							if(!Object.plain(peer || opt.peers)){ return false }
							var S = +new Date;
							var ps = opt.peers, pl = Object.keys(peer || opt.peers || {}); // TODO: .keys( is slow
							console.STAT && console.STAT(S, +new Date - S, 'peer keys');
	(function go(){
								var S = +new Date;
								//Type.obj.map(peer || opt.peers, each); // in case peer is a peer list.
								loop = 1; var wr = meta.raw; meta.raw = raw; // quick perf hack
								var i = 0, p; while(i < 9 && (p = (pl||'')[i++])){
									if(!(p = ps[p] || (peer||'')[p])){ continue }
									mesh.say(msg, p);
								}
								meta.raw = wr; loop = 0;
								pl = pl.slice(i); // slicing after is faster than shifting during.
								console.STAT && console.STAT(S, +new Date - S, 'say loop');
								if(!pl.length){ return }
								puff(go, 0);
								ack && dup_track(ack); // keep for later
							}());
							return;
						}
						// TODO: PERF: consider splitting function here, so say loops do less work.
						if(!peer.wire && mesh.wire){ mesh.wire(peer); }
						if(id === peer.last){ return } peer.last = id;  // was it just sent?
						if(peer === meta.via){ return false } // don't send back to self.
						if((tmp = meta.yo) && (tmp[peer.url] || tmp[peer.pid] || tmp[peer.id]) /*&& !o*/){ return false }
						console.STAT && console.STAT(S, ((DBG||meta).yp = +new Date) - (meta.y || S), 'say prep');
						!loop && ack && dup_track(ack); // streaming long responses needs to keep alive the ack.
						if(peer.batch){
							peer.tail = (tmp = peer.tail || 0) + raw.length;
							if(peer.tail <= opt.pack){
								peer.batch += (tmp?',':'')+raw;
								return;
							}
							flush(peer);
						}
						peer.batch = '['; // Prevents double JSON!
						var ST = +new Date;
						setTimeout(function(){
							console.STAT && console.STAT(ST, +new Date - ST, '0ms TO');
							flush(peer);
						}, opt.gap); // TODO: queuing/batching might be bad for low-latency video game performance! Allow opt out?
						send(raw, peer);
						console.STAT && (ack === peer.SI) && console.STAT(S, +new Date - peer.SH, 'say ack');
					};
					mesh.say.c = mesh.say.d = 0;
					// TODO: this caused a out-of-memory crash!
					mesh.raw = function(msg, peer){ // TODO: Clean this up / delete it / move logic out!
						if(!msg){ return '' }
						var meta = (msg._) || {}, put, tmp;
						if(tmp = meta.raw){ return tmp }
						if('string' == typeof msg){ return msg }
						var hash = msg['##'], ack = msg['@'];
						if(hash && ack){
							if(!meta.via && dup_check(ack+hash)){ return false } // for our own out messages, memory & storage may ack the same thing, so dedup that. Tho if via another peer, we already tracked it upon hearing, so this will always trigger false positives, so don't do that!
							if(tmp = (dup.s[ack]||'').it){
								if(hash === tmp['##']){ return false } // if ask has a matching hash, acking is optional.
								if(!tmp['##']){ tmp['##'] = hash; } // if none, add our hash to ask so anyone we relay to can dedup. // NOTE: May only check against 1st ack chunk, 2nd+ won't know and still stream back to relaying peers which may then dedup. Any way to fix this wasted bandwidth? I guess force rate limiting breaking change, that asking peer has to ask for next lexical chunk.
							}
						}
						if(!msg.dam && !msg['@']){
							var i = 0, to = []; tmp = opt.peers;
							for(var k in tmp){ var p = tmp[k]; // TODO: Make it up peers instead!
								to.push(p.url || p.pid || p.id);
								if(++i > 6){ break }
							}
							if(i > 1){ msg['><'] = to.join(); } // TODO: BUG! This gets set regardless of peers sent to! Detect?
						}
						if(msg.put && (tmp = msg.ok)){ msg.ok = {'@':(tmp['@']||1)-1, '/': (tmp['/']==msg._.near)? mesh.near : tmp['/']}; }
						if(put = meta.$put){
							tmp = {}; Object.keys(msg).forEach(function(k){ tmp[k] = msg[k]; });
							tmp.put = ':])([:';
							json(tmp, function(err, raw){
								if(err){ return } // TODO: Handle!!
								var S = +new Date;
								tmp = raw.indexOf('"put":":])([:"');
								res(u, raw = raw.slice(0, tmp+6) + put + raw.slice(tmp + 14));
								console.STAT && console.STAT(S, +new Date - S, 'say slice');
							});
							return;
						}
						json(msg, res);
						function res(err, raw){
							if(err){ return } // TODO: Handle!!
							meta.raw = raw; //if(meta && (raw||'').length < (999 * 99)){ meta.raw = raw } // HNPERF: If string too big, don't keep in memory.
							mesh.say(msg, peer);
						}
					};
				}());

				function flush(peer){
					var tmp = peer.batch, t = 'string' == typeof tmp;
					if(t){ tmp += ']'; }// TODO: Prevent double JSON!
					peer.batch = peer.tail = null;
					if(!tmp){ return }
					if(t? 3 > tmp.length : !tmp.length){ return } // TODO: ^
					if(!t){try{tmp = (1 === tmp.length? tmp[0] : JSON.stringify(tmp));
					}catch(e){return opt.log('DAM JSON stringify error', e)}}
					if(!tmp){ return }
					send(tmp, peer);
				}
				// for now - find better place later.
				function send(raw, peer){ try{
					var wire = peer.wire;
					if(peer.say){
						peer.say(raw);
					} else
					if(wire.send){
						wire.send(raw);
					}
					mesh.say.d += raw.length||0; ++mesh.say.c; // STATS!
				}catch(e){
					(peer.queue = peer.queue || []).push(raw);
				}}

				mesh.near = 0;
				mesh.hi = function(peer){
					var wire = peer.wire, tmp;
					if(!wire){ mesh.wire((peer.length && {url: peer, id: peer}) || peer); return }
					if(peer.id){
						opt.peers[peer.url || peer.id] = peer;
					} else {
						tmp = peer.id = peer.id || peer.url || String.random(9);
						mesh.say({dam: '?', pid: root.opt.pid}, opt.peers[tmp] = peer);
						delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
					}
					if(!peer.met){
						mesh.near++;
						peer.met = +(new Date);
						root.on('hi', peer);
					}
					// @rogowski I need this here by default for now to fix go1dfish's bug
					tmp = peer.queue; peer.queue = [];
					setTimeout.each(tmp||[],function(msg){
						send(msg, peer);
					},0,9);
					//Type.obj.native && Type.obj.native(); // dirty place to check if other JS polluted.
				};
				mesh.bye = function(peer){
					peer.met && --mesh.near;
					delete peer.met;
					root.on('bye', peer);
					var tmp = +(new Date); tmp = (tmp - (peer.met||tmp));
					mesh.bye.time = ((mesh.bye.time || tmp) + tmp) / 2;
				};
				mesh.hear['!'] = function(msg, peer){ opt.log('Error:', msg.err); };
				mesh.hear['?'] = function(msg, peer){
					if(msg.pid){
						if(!peer.pid){ peer.pid = msg.pid; }
						if(msg['@']){ return }
					}
					mesh.say({dam: '?', pid: opt.pid, '@': msg['#']}, peer);
					delete dup.s[peer.last]; // IMPORTANT: see https://gun.eco/docs/DAM#self
				};
				mesh.hear['mob'] = function(msg, peer){ // NOTE: AXE will overload this with better logic.
					if(!msg.peers){ return }
					var peers = Object.keys(msg.peers), one = peers[(Math.random()*peers.length) >> 0];
					if(!one){ return }
					mesh.bye(peer);
					mesh.hi(one);
				};

				root.on('create', function(root){
					root.opt.pid = root.opt.pid || String.random(9);
					this.to.next(root);
					root.on('out', mesh.say);
				});

				root.on('bye', function(peer, tmp){
					peer = opt.peers[peer.id || peer] || peer;
					this.to.next(peer);
					peer.bye? peer.bye() : (tmp = peer.wire) && tmp.close && tmp.close();
					delete opt.peers[peer.id];
					peer.wire = null;
				});
				root.on('bye', function(peer, tmp){ this.to.next(peer);
					if(tmp = console.STAT){ tmp.peers = mesh.near; }
					if(!(tmp = peer.url)){ return }				setTimeout(function(){ },opt.lack || 9000);
				});
				root.on('hi', function(peer, tmp){ this.to.next(peer);
					if(tmp = console.STAT){ tmp.peers = mesh.near; }
					if(opt.super){ return } // temporary (?) until we have better fix/solution?
					var souls = Object.keys(root.next||''); // TODO: .keys( is slow
					if(souls.length > 9999 && !console.SUBS){ console.log(console.SUBS = "Warning: You have more than 10K live GETs, which might use more bandwidth than your screen can show - consider `.off()`."); }
					setTimeout.each(souls, function(soul){ var node = root.next[soul];
						if(opt.super || (node.ask||'')['']){ mesh.say({get: {'#': soul}}, peer); return }
						setTimeout.each(Object.keys(node.ask||''), function(key){ if(!key){ return }
							// is the lack of ## a !onion hint?
							mesh.say({'##': String.hash((root.graph[soul]||'')[key]), get: {'#': soul, '.': key}}, peer);
							// TODO: Switch this so Book could route?
						});
					});
				});

				return mesh;
			}
		  var u;

		  try{ module.exports = Mesh; }catch(e){}

		})(USE, './mesh');
	USE(function(module){
			var Gun = USE('./index');
			Gun.Mesh = USE('./mesh');

			// TODO: resync upon reconnect online/offline
			//window.ononline = window.onoffline = function(){ console.log('online?', navigator.onLine) }

			Gun.on('opt', function(root){
				this.to.next(root);
				if(root.once){ return }
				var opt = root.opt;
				if(false === opt.WebSocket){ return }

				var env = Gun.window || {};
				var websocket = opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
				if(!websocket){ return }
				opt.WebSocket = websocket;

				var mesh = opt.mesh = opt.mesh || Gun.Mesh(root);
				mesh.wire = opt.wire = open;
				function open(peer){ try{
					if(!peer || !peer.url){ return wire && wire(peer) }
					var url = peer.url.replace(/^http/, 'ws');
					var wire = peer.wire = new opt.WebSocket(url);
					wire.onclose = function(){
						reconnect(peer);
						opt.mesh.bye(peer);
					};
					wire.onerror = function(err){
						reconnect(peer);
					};
					wire.onopen = function(){
						opt.mesh.hi(peer);
					};
					wire.onmessage = function(msg){
						if(!msg){ return }
						opt.mesh.hear(msg.data || msg, peer);
					};
					return wire;
				}catch(e){ opt.mesh.bye(peer); }}

				setTimeout(function(){ !opt.super && root.on('out', {dam:'hi'}); },1); // it can take a while to open a socket, so maybe no longer lazy load for perf reasons?

				var wait = 2 * 999;
				function reconnect(peer){
					clearTimeout(peer.defer);
					if(!opt.peers[peer.url]){ return }
					if(doc && peer.retry <= 0){ return }
					peer.retry = (peer.retry || opt.retry+1 || 60) - ((-peer.tried + (peer.tried = +new Date) < wait*4)?1:0);
					peer.defer = setTimeout(function to(){
						if(doc && doc.hidden){ return setTimeout(to,wait) }
						open(peer);
					}, wait);
				}
				var doc = (''+u !== typeof document) && document;
			});
			var u;
		})(USE, './websocket');
	USE(function(module){
			if(typeof Gun === 'undefined'){ return }

			var noop = function(){}, store;
			try{store = (Gun.window||noop).localStorage;}catch(e){}
			if(!store){
				Gun.log("Warning: No localStorage exists to persist data to!");
				store = {setItem: function(k,v){this[k]=v;}, removeItem: function(k){delete this[k];}, getItem: function(k){return this[k]}};
			}
			var json = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)); }catch(e){ cb(e); } };

			Gun.on('create', function lg(root){
				this.to.next(root);
				var opt = root.opt, acks = [], disk, to, size, stop;
				if(false === opt.localStorage){ return }
				opt.prefix = opt.file || 'gun/';
				try{ disk = lg[opt.prefix] = lg[opt.prefix] || JSON.parse(size = store.getItem(opt.prefix)) || {}; // TODO: Perf! This will block, should we care, since limited to 5MB anyways?
				}catch(e){ disk = lg[opt.prefix] = {}; }
				size = (size||'').length;

				root.on('get', function(msg){
					this.to.next(msg);
					var lex = msg.get, soul, data, tmp, u;
					if(!lex || !(soul = lex['#'])){ return }
					data = disk[soul] || u;
					if(data && (tmp = lex['.']) && !Object.plain(tmp)){ // pluck!
						data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
					}
					//if(data){ (tmp = {})[soul] = data } // back into a graph.
					//setTimeout(function(){
					Gun.on.get.ack(msg, data); //root.on('in', {'@': msg['#'], put: tmp, lS:1});// || root.$});
					//}, Math.random() * 10); // FOR TESTING PURPOSES!
				});

				root.on('put', function(msg){
					this.to.next(msg); // remember to call next middleware adapter
					var put = msg.put, soul = put['#'], key = put['.'], id = msg['#'], ok = msg.ok||''; // pull data off wire envelope
					disk[soul] = Gun.state.ify(disk[soul], key, put['>'], put[':'], soul); // merge into disk object
					if(stop && size > (4999880)){ root.on('in', {'@': id, err: "localStorage max!"}); return; }
					//if(!msg['@']){ acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
					if(!msg['@'] && (!msg._.via || Math.random() < (ok['@'] / ok['/']))){ acks.push(id); } // then ack any non-ack write. // TODO: use batch id.
					if(to){ return }
					to = setTimeout(flush, 9+(size / 333)); // 0.1MB = 0.3s, 5MB = 15s 
				});
				function flush(){
					if(!acks.length && ((setTimeout.turn||'').s||'').length){ setTimeout(flush,99); return; } // defer if "busy" && no saves.
					var ack = acks; clearTimeout(to); to = false; acks = [];
					json(disk, function(err, tmp){
						try{!err && store.setItem(opt.prefix, tmp);
						}catch(e){ err = stop = e || "localStorage failure"; }
						if(err){
							Gun.log(err + " Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install");
							root.on('localStorage:error', {err: err, get: opt.prefix, put: disk});
						}
						size = tmp.length;

						//if(!err && !Object.empty(opt.peers)){ return } // only ack if there are no peers. // Switch this to probabilistic mode
						setTimeout.each(ack, function(id){
							root.on('in', {'@': id, err: err, ok: 0}); // localStorage isn't reliable, so make its `ok` code be a low number.
						},0,99);
					});
				}
			
			});
		})(USE, './localStorage');

	}());
	(function(){
		var u;
		if(''+u == typeof Gun){ return }
		var DEP = function(n){ console.warn("Warning! Deprecated internal utility will break in next version:", n); };
		// Generic javascript utilities.
		var Type = Gun;
		//Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
		Type.fn = Type.fn || {is: function(fn){ DEP('fn'); return (!!fn && 'function' == typeof fn) }};
		Type.bi = Type.bi || {is: function(b){ DEP('bi');return (b instanceof Boolean || typeof b == 'boolean') }};
		Type.num = Type.num || {is: function(n){ DEP('num'); return !list_is(n) && ((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }};
		Type.text = Type.text || {is: function(t){ DEP('text'); return (typeof t == 'string') }};
		Type.text.ify = Type.text.ify || function(t){ DEP('text.ify');
			if(Type.text.is(t)){ return t }
			if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
			return (t && t.toString)? t.toString() : t;
		};
		Type.text.random = Type.text.random || function(l, c){ DEP('text.random');
			var s = '';
			l = l || 24; // you are not going to make a 0 length random number, so no need to check type
			c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
			while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l--; }
			return s;
		};
		Type.text.match = Type.text.match || function(t, o){ var tmp, u; DEP('text.match');
			if('string' !== typeof t){ return false }
			if('string' == typeof o){ o = {'=': o}; }
			o = o || {};
			tmp = (o['='] || o['*'] || o['>'] || o['<']);
			if(t === tmp){ return true }
			if(u !== o['=']){ return false }
			tmp = (o['*'] || o['>'] || o['<']);
			if(t.slice(0, (tmp||'').length) === tmp){ return true }
			if(u !== o['*']){ return false }
			if(u !== o['>'] && u !== o['<']){
				return (t >= o['>'] && t <= o['<'])? true : false;
			}
			if(u !== o['>'] && t >= o['>']){ return true }
			if(u !== o['<'] && t <= o['<']){ return true }
			return false;
		};
		Type.text.hash = Type.text.hash || function(s, c){ // via SO
			DEP('text.hash');
			if(typeof s !== 'string'){ return }
		  c = c || 0;
		  if(!s.length){ return c }
		  for(var i=0,l=s.length,n; i<l; ++i){
		    n = s.charCodeAt(i);
		    c = ((c<<5)-c)+n;
		    c |= 0;
		  }
		  return c;
		};
		Type.list = Type.list || {is: function(l){ DEP('list'); return (l instanceof Array) }};
		Type.list.slit = Type.list.slit || Array.prototype.slice;
		Type.list.sort = Type.list.sort || function(k){ // creates a new sort function based off some key
			DEP('list.sort');
			return function(A,B){
				if(!A || !B){ return 0 } A = A[k]; B = B[k];
				if(A < B){ return -1 }else if(A > B){ return 1 }
				else { return 0 }
			}
		};
		Type.list.map = Type.list.map || function(l, c, _){ DEP('list.map'); return obj_map(l, c, _) };
		Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
		Type.obj = Type.boj || {is: function(o){ DEP('obj'); return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }};
		Type.obj.put = Type.obj.put || function(o, k, v){ DEP('obj.put'); return (o||{})[k] = v, o };
		Type.obj.has = Type.obj.has || function(o, k){ DEP('obj.has'); return o && Object.prototype.hasOwnProperty.call(o, k) };
		Type.obj.del = Type.obj.del || function(o, k){ DEP('obj.del'); 
			if(!o){ return }
			o[k] = null;
			delete o[k];
			return o;
		};
		Type.obj.as = Type.obj.as || function(o, k, v, u){ DEP('obj.as'); return o[k] = o[k] || (u === v? {} : v) };
		Type.obj.ify = Type.obj.ify || function(o){ DEP('obj.ify'); 
			if(obj_is(o)){ return o }
			try{o = JSON.parse(o);
			}catch(e){o={};}		return o;
		}
		;(function(){ var u;
			function map(v,k){
				if(obj_has(this,k) && u !== this[k]){ return }
				this[k] = v;
			}
			Type.obj.to = Type.obj.to || function(from, to){ DEP('obj.to'); 
				to = to || {};
				obj_map(from, map, to);
				return to;
			};
		}());
		Type.obj.copy = Type.obj.copy || function(o){ DEP('obj.copy'); // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
			return !o? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
		}
		;(function(){
			function empty(v,i){ var n = this.n, u;
				if(n && (i === n || (obj_is(n) && obj_has(n, i)))){ return }
				if(u !== i){ return true }
			}
			Type.obj.empty = Type.obj.empty || function(o, n){ DEP('obj.empty'); 
				if(!o){ return true }
				return obj_map(o,empty,{n:n})? false : true;
			};
		}());
	(function(){
			function t(k,v){
				if(2 === arguments.length){
					t.r = t.r || {};
					t.r[k] = v;
					return;
				} t.r = t.r || [];
				t.r.push(k);
			}		var keys = Object.keys, map;
			Object.keys = Object.keys || function(o){ return map(o, function(v,k,t){t(k);}) };
			Type.obj.map = map = Type.obj.map || function(l, c, _){ DEP('obj.map'); 
				var u, i = 0, x, r, ll, lle, f = 'function' == typeof c;
				t.r = u;
				if(keys && obj_is(l)){
					ll = keys(l); lle = true;
				}
				_ = _ || {};
				if(list_is(l) || ll){
					x = (ll || l).length;
					for(;i < x; i++){
						var ii = (i + Type.list.index);
						if(f){
							r = lle? c.call(_, l[ll[i]], ll[i], t) : c.call(_, l[i], ii, t);
							if(r !== u){ return r }
						} else {
							//if(Type.test.is(c,l[i])){ return ii } // should implement deep equality testing!
							if(c === l[lle? ll[i] : i]){ return ll? ll[i] : ii } // use this for now
						}
					}
				} else {
					for(i in l){
						if(f){
							if(obj_has(l,i)){
								r = _? c.call(_, l[i], i, t) : c(l[i], i, t);
								if(r !== u){ return r }
							}
						} else {
							//if(a.test.is(c,l[i])){ return i } // should implement deep equality testing!
							if(c === l[i]){ return i } // use this for now
						}
					}
				}
				return f? t.r : Type.list.index? 0 : -1;
			};
		}());
		Type.time = Type.time || {};
		Type.time.is = Type.time.is || function(t){ DEP('time'); return t? t instanceof Date : (+new Date().getTime()) };

		var fn_is = Type.fn.is;
		var list_is = Type.list.is;
		var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_map = obj.map;

		var Val = {};
		Val.is = function(v){ DEP('val.is'); // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
			if(v === u){ return false }
			if(v === null){ return true } // "deletes", nulling out keys.
			if(v === Infinity){ return false } // we want this to be, but JSON does not support it, sad face.
			if(text_is(v) // by "text" we mean strings.
			|| bi_is(v) // by "binary" we mean boolean.
			|| num_is(v)){ // by "number" we mean integers or decimals.
				return true; // simple values are valid.
			}
			return Val.link.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
		};
		Val.link = Val.rel = {_: '#'};
	(function(){
			Val.link.is = function(v){ DEP('val.link.is'); // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
				if(v && v[rel_] && !v._ && obj_is(v)){ // must be an object.
					var o = {};
					obj_map(v, map, o);
					if(o.id){ // a valid id was found.
						return o.id; // yay! Return it.
					}
				}
				return false; // the value was not a valid soul relation.
			};
			function map(s, k){ var o = this; // map over the object...
				if(o.id){ return o.id = false } // if ID is already defined AND we're still looping through the object, it is considered invalid.
				if(k == rel_ && text_is(s)){ // the key should be '#' and have a text value.
					o.id = s; // we found the soul!
				} else {
					return o.id = false; // if there exists anything else on the object that isn't the soul, then it is considered invalid.
				}
			}
		}());
		Val.link.ify = function(t){ DEP('val.link.ify'); return obj_put({}, rel_, t) }; // convert a soul into a relation and return it.
		Type.obj.has._ = '.';
		var rel_ = Val.link._, u;
		var bi_is = Type.bi.is;
		var num_is = Type.num.is;
		var text_is = Type.text.is;
		var obj = Type.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map;

		Type.val = Type.val || Val;

		var Node = {_: '_'};
		Node.soul = function(n, o){ DEP('node.soul'); return (n && n._ && n._[o || soul_]) }; // convenience function to check to see if there is a soul on a node and return it.
		Node.soul.ify = function(n, o){ DEP('node.soul.ify'); // put a soul on an object.
			o = (typeof o === 'string')? {soul: o} : o || {};
			n = n || {}; // make sure it exists.
			n._ = n._ || {}; // make sure meta exists.
			n._[soul_] = o.soul || n._[soul_] || text_random(); // put the soul on it.
			return n;
		};
		Node.soul._ = Val.link._;
	(function(){
			Node.is = function(n, cb, as){ DEP('node.is'); var s; // checks to see if an object is a valid node.
				if(!obj_is(n)){ return false } // must be an object.
				if(s = Node.soul(n)){ // must have a soul on it.
					return !obj_map(n, map, {as:as,cb:cb,s:s,n:n});
				}
				return false; // nope! This was not a valid node.
			};
			function map(v, k){ // we invert this because the way we check for this is via a negation.
				if(k === Node._){ return } // skip over the metadata.
				if(!Val.is(v)){ return true } // it is true that this is an invalid node.
				if(this.cb){ this.cb.call(this.as, v, k, this.n, this.s); } // optionally callback each key/value.
			}
		}());
	(function(){
			Node.ify = function(obj, o, as){ DEP('node.ify'); // returns a node from a shallow object.
				if(!o){ o = {}; }
				else if(typeof o === 'string'){ o = {soul: o}; }
				else if('function' == typeof o){ o = {map: o}; }
				if(o.map){ o.node = o.map.call(as, obj, u, o.node || {}); }
				if(o.node = Node.soul.ify(o.node || {}, o)){
					obj_map(obj, map, {o:o,as:as});
				}
				return o.node; // This will only be a valid node if the object wasn't already deep!
			};
			function map(v, k){ var o = this.o, tmp, u; // iterate over each key/value.
				if(o.map){
					tmp = o.map.call(this.as, v, ''+k, o.node);
					if(u === tmp){
						obj_del(o.node, k);
					} else
					if(o.node){ o.node[k] = tmp; }
					return;
				}
				if(Val.is(v)){
					o.node[k] = v;
				}
			}
		}());
		var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_map = obj.map;
		var text = Type.text, text_random = text.random;
		var soul_ = Node.soul._;
		var u;
		Type.node = Type.node || Node;

		var State = Type.state;
		State.lex = function(){ DEP('state.lex'); return State().toString(36).replace('.','') };
		State.to = function(from, k, to){ DEP('state.to'); 
			var val = (from||{})[k];
			if(obj_is(val)){
				val = obj_copy(val);
			}
			return State.ify(to, k, State.is(from, k), val, Node.soul(from));
		}
		;(function(){
			State.map = function(cb, s, as){ DEP('state.map'); var u; // for use with Node.ify
				var o = obj_is(o = cb || s)? o : null;
				cb = fn_is(cb = cb || s)? cb : null;
				if(o && !cb){
					s = num_is(s)? s : State();
					o[N_] = o[N_] || {};
					obj_map(o, map, {o:o,s:s});
					return o;
				}
				as = as || obj_is(s)? s : u;
				s = num_is(s)? s : State();
				return function(v, k, o, opt){
					if(!cb){
						map.call({o: o, s: s}, v,k);
						return v;
					}
					cb.call(as || this || {}, v, k, o, opt);
					if(obj_has(o,k) && u === o[k]){ return }
					map.call({o: o, s: s}, v,k);
				}
			};
			function map(v,k){
				if(N_ === k){ return }
				State.ify(this.o, k, this.s) ;
			}
		}());
		var obj = Type.obj, obj_has = obj.has, obj_is = obj.is, obj_map = obj.map, obj_copy = obj.copy;
		var num = Type.num, num_is = num.is;
		var fn = Type.fn, fn_is = fn.is;
		var N_ = Node._, u;

		var Graph = {};
	(function(){
			Graph.is = function(g, cb, fn, as){ DEP('graph.is'); // checks to see if an object is a valid graph.
				if(!g || !obj_is(g) || obj_empty(g)){ return false } // must be an object.
				return !obj_map(g, map, {cb:cb,fn:fn,as:as}); // makes sure it wasn't an empty object.
			};
			function map(n, s){ // we invert this because the way'? we check for this is via a negation.
				if(!n || s !== Node.soul(n) || !Node.is(n, this.fn, this.as)){ return true } // it is true that this is an invalid graph.
				if(!this.cb){ return }
				nf.n = n; nf.as = this.as; // sequential race conditions aren't races.
				this.cb.call(nf.as, n, s, nf);
			}
			function nf(fn){ // optional callback for each node.
				if(fn){ Node.is(nf.n, fn, nf.as); } // where we then have an optional callback for each key/value.
			}
		}());
	(function(){
			Graph.ify = function(obj, env, as){ DEP('graph.ify'); 
				var at = {path: [], obj: obj};
				if(!env){
					env = {};
				} else
				if(typeof env === 'string'){
					env = {soul: env};
				} else
				if('function' == typeof env){
					env.map = env;
				}
				if(typeof as === 'string'){
					env.soul = env.soul || as;
					as = u;
				}
				if(env.soul){
					at.link = Val.link.ify(env.soul);
				}
				env.shell = (as||{}).shell;
				env.graph = env.graph || {};
				env.seen = env.seen || [];
				env.as = env.as || as;
				node(env, at);
				env.root = at.node;
				return env.graph;
			};
			function node(env, at){ var tmp;
				if(tmp = seen(env, at)){ return tmp }
				at.env = env;
				at.soul = soul;
				if(Node.ify(at.obj, map, at)){
					at.link = at.link || Val.link.ify(Node.soul(at.node));
					if(at.obj !== env.shell){
						env.graph[Val.link.is(at.link)] = at.node;
					}
				}
				return at;
			}
			function map(v,k,n){
				var at = this, env = at.env, is, tmp;
				if(Node._ === k && obj_has(v,Val.link._)){
					return n._; // TODO: Bug?
				}
				if(!(is = valid(v,k,n, at,env))){ return }
				if(!k){
					at.node = at.node || n || {};
					if(obj_has(v, Node._) && Node.soul(v)){ // ? for safety ?
						at.node._ = obj_copy(v._);
					}
					at.node = Node.soul.ify(at.node, Val.link.is(at.link));
					at.link = at.link || Val.link.ify(Node.soul(at.node));
				}
				if(tmp = env.map){
					tmp.call(env.as || {}, v,k,n, at);
					if(obj_has(n,k)){
						v = n[k];
						if(u === v){
							obj_del(n, k);
							return;
						}
						if(!(is = valid(v,k,n, at,env))){ return }
					}
				}
				if(!k){ return at.node }
				if(true === is){
					return v;
				}
				tmp = node(env, {obj: v, path: at.path.concat(k)});
				if(!tmp.node){ return }
				return tmp.link; //{'#': Node.soul(tmp.node)};
			}
			function soul(id){ var at = this;
				var prev = Val.link.is(at.link), graph = at.env.graph;
				at.link = at.link || Val.link.ify(id);
				at.link[Val.link._] = id;
				if(at.node && at.node[Node._]){
					at.node[Node._][Val.link._] = id;
				}
				if(obj_has(graph, prev)){
					graph[id] = graph[prev];
					obj_del(graph, prev);
				}
			}
			function valid(v,k,n, at,env){ var tmp;
				if(Val.is(v)){ return true }
				if(obj_is(v)){ return 1 }
				if(tmp = env.invalid){
					v = tmp.call(env.as || {}, v,k,n);
					return valid(v,k,n, at,env);
				}
				env.err = "Invalid value at '" + at.path.concat(k).join('.') + "'!";
				if(Type.list.is(v)){ env.err += " Use `.set(item)` instead of an Array."; }
			}
			function seen(env, at){
				var arr = env.seen, i = arr.length, has;
				while(i--){ has = arr[i];
					if(at.obj === has.obj){ return has }
				}
				arr.push(at);
			}
		}());
		Graph.node = function(node){ DEP('graph.node'); 
			var soul = Node.soul(node);
			if(!soul){ return }
			return obj_put({}, soul, node);
		}
		;(function(){
			Graph.to = function(graph, root, opt){ DEP('graph.to'); 
				if(!graph){ return }
				var obj = {};
				opt = opt || {seen: {}};
				obj_map(graph[root], map, {obj:obj, graph: graph, opt: opt});
				return obj;
			};
			function map(v,k){ var tmp, obj;
				if(Node._ === k){
					if(obj_empty(v, Val.link._)){
						return;
					}
					this.obj[k] = obj_copy(v);
					return;
				}
				if(!(tmp = Val.link.is(v))){
					this.obj[k] = v;
					return;
				}
				if(obj = this.opt.seen[tmp]){
					this.obj[k] = obj;
					return;
				}
				this.obj[k] = this.opt.seen[tmp] = Graph.to(this.graph, tmp, this.opt);
			}
		}());
		var fn_is = Type.fn.is;
		var obj = Type.obj, obj_is = obj.is, obj_del = obj.del, obj_has = obj.has, obj_empty = obj.empty, obj_put = obj.put, obj_map = obj.map, obj_copy = obj.copy;
		var u;
		Type.graph = Type.graph || Graph;
	}());
	});

	var dot = /\.\.+/g;
	var slash = /\/\/+/g;

	function CDN(dir){
		return function(req, res){
			req.url = (req.url||'').replace(dot,'').replace(slash,'/');
			if(serve(req, res)){ return } // filters GUN requests!
			if (req.url.slice(-3) === '.js') {
				res.writeHead(200, {'Content-Type': 'text/javascript'});
			}
			fs.createReadStream(path$1.join(dir, req.url)).on('error',function(tmp){ // static files!
				fs.readFile(path$1.join(dir, 'index.html'), function(err, tmp){
					try{ res.writeHead(200, {'Content-Type': 'text/html'});
					res.end(tmp+''); }catch(e){} // or default to index
			});}).pipe(res); // stream
		}
	}

	function serve(req, res, next){ var tmp;
		if(typeof req === 'string'){
			return CDN(req);
		}
		if(!req || !res){ return false }
		next = next || serve;
		if(!req.url){ return next() }
		if(res.setHeader){ res.setHeader('Access-Control-Allow-Origin', '*'); }
		if(0 <= req.url.indexOf('gun.js')){
			res.writeHead(200, {'Content-Type': 'text/javascript'});
			res.end(serve.js = serve.js || fs.readFileSync(__dirname + '/../gun.js'));
			return true;
		}
		if(0 <= req.url.indexOf('gun/')){
			var path = __dirname + '/../' + req.url.split('/').slice(2).join('/');
			if('/' === path.slice(-1)){
				fs.readdir(path, function(err, dir){ res.end((dir || (err && 404))+''); });
				return true;
			}
			var S = +new Date;
			var rs = fs.createReadStream(path);
			rs.on('open', function(){ console.STAT && console.STAT(S, +new Date - S, 'serve file open'); rs.pipe(res); });
			rs.on('error', function(err){ res.end(404+''); });
			rs.on('end', function(){ console.STAT && console.STAT(S, +new Date - S, 'serve file end'); });
			return true;
		}
		if((tmp = req.socket) && (tmp = tmp.server) && (tmp = tmp.route)){		if(tmp = tmp[(((req.url||'').slice(1)).split('/')[0]||'').split('.')[0]]){
				try{ return tmp(req, res, next) }catch(e){ console.log(req.url+' crashed with '+e); }
			}
		}
		return next();
	}

	var serve_1 = serve;

	var radix = createCommonjsModule(function (module) {
	(function(){

		function Radix(){
			var radix = function(key, val, t){
				radix.unit = 0;
				if(!t && u !== val){ 
					radix.last = (''+key < radix.last)? radix.last : ''+key;
					delete (radix.$||{})[_];
				}
				t = t || radix.$ || (radix.$ = {});
				if(!key && Object.keys(t).length){ return t }
				key = ''+key;
				var i = 0, l = key.length-1, k = key[i], at, tmp;
				while(!(at = t[k]) && i < l){
					k += key[++i];
				}
				if(!at){
					if(!each(t, function(r, s){
						var ii = 0, kk = '';
						if((s||'').length){ while(s[ii] == key[ii]){
							kk += s[ii++];
						} }
						if(kk){
							if(u === val){
								if(ii <= l){ return }
								(tmp || (tmp = {}))[s.slice(ii)] = r;
								//(tmp[_] = function $(){ $.sort = Object.keys(tmp).sort(); return $ }()); // get rid of this one, cause it is on read?
								return r;
							}
							var __ = {};
							__[s.slice(ii)] = r;
							ii = key.slice(ii);
							('' === ii)? (__[''] = val) : ((__[ii] = {})[''] = val);
							//(__[_] = function $(){ $.sort = Object.keys(__).sort(); return $ }());
							t[kk] = __;
							if(Radix.debug && 'undefined' === ''+kk){ console.log(0, kk); debugger }
							delete t[s];
							//(t[_] = function $(){ $.sort = Object.keys(t).sort(); return $ }());
							return true;
						}
					})){
						if(u === val){ return; }
						(t[k] || (t[k] = {}))[''] = val;
						if(Radix.debug && 'undefined' === ''+k){ console.log(1, k); debugger }
						//(t[_] = function $(){ $.sort = Object.keys(t).sort(); return $ }());
					}
					if(u === val){
						return tmp;
					}
				} else 
				if(i == l){
					//if(u === val){ return (u === (tmp = at['']))? at : tmp } // THIS CODE IS CORRECT, below is
					if(u === val){ return (u === (tmp = at['']))? at : ((radix.unit = 1) && tmp) } // temporary help??
					at[''] = val;
					//(at[_] = function $(){ $.sort = Object.keys(at).sort(); return $ }());
				} else {
					if(u !== val){ delete at[_]; }
					//at && (at[_] = function $(){ $.sort = Object.keys(at).sort(); return $ }());
					return radix(key.slice(++i), val, at || (at = {}));
				}
			};
			return radix;
		}
		Radix.map = function rap(radix, cb, opt, pre){
			try {
				pre = pre || []; // TODO: BUG: most out-of-memory crashes come from here.
				var t = ('function' == typeof radix)? radix.$ || {} : radix;
				//!opt && console.log("WHAT IS T?", JSON.stringify(t).length);
				if(!t){ return }
				if('string' == typeof t){ if(Radix.debug){ throw ['BUG:', radix, cb, opt, pre] } return; }
				var keys = (t[_]||no).sort || (t[_] = function $(){ $.sort = Object.keys(t).sort(); return $ }()).sort, rev; // ONLY 17% of ops are pre-sorted!
				//var keys = Object.keys(t).sort();
				opt = (true === opt)? {branch: true} : (opt || {});
				if(rev = opt.reverse){ keys = keys.slice(0).reverse(); }
				var start = opt.start, end = opt.end, END = '\uffff';
				var i = 0, l = keys.length;
				for(;i < l; i++){ var key = keys[i], tree = t[key], tmp, p, pt;
					if(!tree || '' === key || _ === key || 'undefined' === key){ continue }
					p = pre.slice(0); p.push(key);
					pt = p.join('');
					if(u !== start && pt < (start||'').slice(0,pt.length)){ continue }
					if(u !== end && (end || END) < pt){ continue }
					if(rev){ // children must be checked first when going in reverse.
						tmp = rap(tree, cb, opt, p);
						if(u !== tmp){ return tmp }
					}
					if(u !== (tmp = tree[''])){
						var yes = 1;
						if(u !== start && pt < (start||'')){ yes = 0; }
						if(u !== end && pt > (end || END)){ yes = 0; }
						if(yes){
							tmp = cb(tmp, pt, key, pre);
							if(u !== tmp){ return tmp }
						}
					} else
					if(opt.branch){
						tmp = cb(u, pt, key, pre);
						if(u !== tmp){ return tmp }
					}
					pre = p;
					if(!rev){
						tmp = rap(tree, cb, opt, pre);
						if(u !== tmp){ return tmp }
					}
					pre.pop();
				}
			} catch (e) { console.error(e); }
		};

		if(typeof window !== "undefined"){
		  window.Radix = Radix;
		} else { 
			try{ module.exports = Radix; }catch(e){}
		}
		var each = Radix.object = function(o, f, r){
			for(var k in o){
				if(!o.hasOwnProperty(k)){ continue }
				if((r = f(o[k], k)) !== u){ return r }
			}
		}, no = {}, u;
		var _ = String.fromCharCode(24);
		
	}());
	});

	var radmigtmp = function(r){
		var Radix = radix;
		r.find('a', function(){
			var l = [];
			Radix.map(r.list, function(v,f){
				if(!(f.indexOf('%1B') + 1)){ return }
				if(!v){ return }
				l.push([f,v]);
			});
			if(l.length){
				console.log("\n! ! ! WARNING ! ! !\nRAD v0.2020.x has detected OLD v0.2019.x data & automatically migrating. Automatic migration will be turned OFF in future versions! If you are just developing/testing, we recommend you reset your data. Please contact us if you have any concerns.\nThis message should only log once.");
			}
			var f, v;
			l.forEach(function(a){
				f = a[0]; v = a[1];
				r.list(decodeURIComponent(f), v);
				r.list(f, 0);
			});
			if(!f){ return }
			r.find.bad(f);
		});
	};

	var radisk = createCommonjsModule(function (module) {
	(function(){

		function Radisk(opt){

			opt = opt || {};
			opt.log = opt.log || console.log;
			opt.file = String(opt.file || 'radata');
			var has = (Radisk.has || (Radisk.has = {}))[opt.file];
			if(has){ return has }

			opt.max = opt.max || (opt.memory? (opt.memory * 999 * 999) : 300000000) * 0.3;
			opt.until = opt.until || opt.wait || 250;
			opt.batch = opt.batch || (10 * 1000);
			opt.chunk = opt.chunk || (1024 * 1024 * 1); // 1MB
			opt.code = opt.code || {};
			opt.code.from = opt.code.from || '!';
			opt.jsonify = true;


			function ename(t){ return encodeURIComponent(t).replace(/\*/g, '%2A') } // TODO: Hash this also, but allow migration!
			function atomic(v){ return u !== v && (!v || 'object' != typeof v) }
			var timediate = (''+u === typeof setImmediate)? setTimeout : setImmediate;
			var puff = setTimeout.turn || timediate, u;
			var map = Radix.object;
			var ST = 0;

			if(!opt.store){
				return opt.log("ERROR: Radisk needs `opt.store` interface with `{get: fn, put: fn (, list: fn)}`!");
			}
			if(!opt.store.put){
				return opt.log("ERROR: Radisk needs `store.put` interface with `(file, data, cb)`!");
			}
			if(!opt.store.get){
				return opt.log("ERROR: Radisk needs `store.get` interface with `(file, cb)`!");
			}
			var parse = JSON.parseAsync || function(t,cb,r){ var u; try{ cb(u, JSON.parse(t,r)); }catch(e){ cb(e); } };
			/*
				Any and all storage adapters should...
				1. Because writing to disk takes time, we should batch data to disk. This improves performance, and reduces potential disk corruption.
				2. If a batch exceeds a certain number of writes, we should immediately write to disk when physically possible. This caps total performance, but reduces potential loss.
			*/
			var r = function(key, data, cb, tag, DBG){
				if('function' === typeof data){
					var o = cb || {};
					cb = data;
					r.read(key, cb, o, DBG || tag);
					return;
				}
				//var tmp = (tmp = r.batch = r.batch || {})[key] = tmp[key] || {};
				//var tmp = (tmp = r.batch = r.batch || {})[key] = data;
				r.save(key, data, cb, tag, DBG);
			};
			r.save = function(key, data, cb, tag, DBG){
				var s = {key: key}, tags, f, d, q;
				s.find = function(file){ var tmp;
					s.file = file || (file = opt.code.from);
					DBG && (DBG = DBG[file] = DBG[file] || {});
					DBG && (DBG.sf = DBG.sf || +new Date);
					//console.only.i && console.log('found', file);
					if(tmp = r.disk[file]){ s.mix(u, tmp); return }
					r.parse(file, s.mix, u, DBG);
				};
				s.mix = function(err, disk){
					DBG && (DBG.sml = +new Date);
					DBG && (DBG.sm = DBG.sm || +new Date);
					if(s.err = err || s.err){ cb(err); return } // TODO: HANDLE BATCH EMIT
					var file = s.file = (disk||'').file || s.file, tmp;
					if(!disk && file !== opt.code.from){ // corrupt file?
						r.find.bad(file); // remove from dir list
						r.save(key, data, cb, tag); // try again
						return;
					}
					(disk = r.disk[file] || (r.disk[file] = disk || Radix())).file || (disk.file = file);
					if(opt.compare){
						data = opt.compare(disk(key), data, key, file);
						if(u === data){ cb(err, -1); return } // TODO: HANDLE BATCH EMIT
					}
					(s.disk = disk)(key, data);
					if(tag){
						(tmp = (tmp = disk.tags || (disk.tags = {}))[tag] || (tmp[tag] = r.tags[tag] || (r.tags[tag] = {})))[file] || (tmp[file] = r.one[tag] || (r.one[tag] = cb));
						cb = null;
					}
					DBG && (DBG.st = DBG.st || +new Date);
					//console.only.i && console.log('mix', disk.Q);
					if(disk.Q){ cb && disk.Q.push(cb); return } disk.Q = (cb? [cb] : []);
					disk.to = setTimeout(s.write, opt.until);
				};
				s.write = function(){
					DBG && (DBG.sto = DBG.sto || +new Date);
					var file = f = s.file, disk = d = s.disk;
					q = s.q = disk.Q;
					tags = s.tags = disk.tags;
					delete disk.Q;
					delete r.disk[file];
					delete disk.tags;
					//console.only.i && console.log('write', file, disk, 'was saving:', key, data);
					r.write(file, disk, s.ack, u, DBG);
				};
				s.ack = function(err, ok){
					DBG && (DBG.sa = DBG.sa || +new Date);
					DBG && (DBG.sal = q.length);
					var ack, tmp;
					// TODO!!!! CHANGE THIS INTO PUFF!!!!!!!!!!!!!!!!
					for(var id in r.tags){
						if(!r.tags.hasOwnProperty(id)){ continue } var tag = r.tags[id];
						if((tmp = r.disk[f]) && (tmp = tmp.tags) && tmp[tag]){ continue }
						ack = tag[f];
						delete tag[f];
						var ne; for(var k in tag){ if(tag.hasOwnProperty(k)){ ne = true; break } } // is not empty?
						if(ne){ continue } //if(!obj_empty(tag)){ continue }
						delete r.tags[tag];
						ack && ack(err, ok);
					}
					!q && (q = '');
					var l = q.length, i = 0;
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					// TODO: PERF: Why is acks so slow, what work do they do??? CHECK THIS!!
					var S = +new Date;
					for(;i < l; i++){ (ack = q[i]) && ack(err, ok); }
					console.STAT && console.STAT(S, +new Date - S, 'rad acks', ename(s.file));
					console.STAT && console.STAT(S, q.length, 'rad acks #', ename(s.file));
				};
				cb || (cb = function(err, ok){ // test delete!
					if(!err){ return }
				});
				//console.only.i && console.log('save', key);
				r.find(key, s.find);
	    };
	    r.disk = {};
	    r.one = {};
	    r.tags = {};

			/*
				Any storage engine at some point will have to do a read in order to write.
				This is true of even systems that use an append only log, if they support updates.
				Therefore it is unavoidable that a read will have to happen,
				the question is just how long you delay it.
			*/
			var RWC = 0;
			r.write = function(file, rad, cb, o, DBG){
				if(!rad){ cb('No radix!'); return }
				o = ('object' == typeof o)? o : {force: o};
				var f = function Fractal(){}, a, b;
				f.text = '';
				f.file = file = rad.file || (rad.file = file);
				if(!file){ cb('What file?'); return }
				f.write = function(){
					var text = rad.raw = f.text;
					r.disk[file = rad.file || f.file || file] = rad;
					var S = +new Date;
					DBG && (DBG.wd = S);
					//console.only.i && console.log('add', file);
					r.find.add(file, function add(err){
						DBG && (DBG.wa = +new Date);
						if(err){ cb(err); return }
						//console.only.i && console.log('disk', file, text);
						opt.store.put(ename(file), text, function safe(err, ok){
							DBG && (DBG.wp = +new Date);
							console.STAT && console.STAT(S, ST = +new Date - S, "wrote disk", JSON.stringify(file), ++RWC, 'total all writes.');
							//console.only.i && console.log('done', err, ok || 1, cb);
							cb(err, ok || 1);
							if(!rad.Q){ delete r.disk[file]; } // VERY IMPORTANT! Clean up memory, but not if there is already queued writes on it!
						});
					});
				};
				f.split = function(){
					var S = +new Date;
					DBG && (DBG.wf = S);
					f.text = '';
					if(!f.count){ f.count = 0;
						Radix.map(rad, function count(){ f.count++; }); // TODO: Perf? Any faster way to get total length?
					}
					DBG && (DBG.wfc = f.count);
					f.limit = Math.ceil(f.count/2);
					var SC = f.count;
					f.count = 0;
					DBG && (DBG.wf1 = +new Date);
					f.sub = Radix();
					Radix.map(rad, f.slice, {reverse: 1}); // IMPORTANT: DO THIS IN REVERSE, SO LAST HALF OF DATA MOVED TO NEW FILE BEFORE DROPPING FROM CURRENT FILE.
					DBG && (DBG.wf2 = +new Date);
					r.write(f.end, f.sub, f.both, o);
					DBG && (DBG.wf3 = +new Date);
					f.hub = Radix();
					Radix.map(rad, f.stop);
					DBG && (DBG.wf4 = +new Date);
					r.write(rad.file, f.hub, f.both, o);
					DBG && (DBG.wf5 = +new Date);
					console.STAT && console.STAT(S, +new Date - S, "rad split", ename(rad.file), SC);
					return true;
				};
				f.slice = function(val, key){
					f.sub(f.end = key, val);
					if(f.limit <= (++f.count)){ return true }
				};
				f.stop = function(val, key){
					if(key >= f.end){ return true }
					f.hub(key, val);
				};
				f.both = function(err, ok){
					DBG && (DBG.wfd = +new Date);
					if(b){ cb(err || b); return }
					if(a){ cb(err, ok); return }
					a = true;
					b = err;
				};
				f.each = function(val, key, k, pre){
					if(u !== val){ f.count++; }
					if(opt.max <= (val||'').length){ return cb("Data too big!"), true }
					var enc = Radisk.encode(pre.length) +'#'+ Radisk.encode(k) + (u === val? '' : ':'+ Radisk.encode(val)) +'\n';
					if((opt.chunk < f.text.length + enc.length) && (1 < f.count) && !o.force){
						return f.split();
					}
					f.text += enc;
				};
				//console.only.i && console.log('writing');
				if(opt.jsonify){ r.write.jsonify(f, rad, cb, o, DBG); return } // temporary testing idea
				if(!Radix.map(rad, f.each, true)){ f.write(); }
			};

			r.write.jsonify = function(f, rad, cb, o, DBG){
				var raw;
				var S = +new Date;
				DBG && (DBG.w = S);
				try{raw = JSON.stringify(rad.$);
				}catch(e){ cb("Cannot radisk!"); return }
				DBG && (DBG.ws = +new Date);
				console.STAT && console.STAT(S, +new Date - S, "rad stringified JSON");
				if(opt.chunk < raw.length && !o.force){
					var c = 0;
					Radix.map(rad, function(){
						if(c++){ return true } // more than 1 item
					});
					if(c > 1){
						return f.split();
					}
				}
				f.text = raw;
				f.write();
			};

			r.range = function(tree, o){
				if(!tree || !o){ return }
				if(u === o.start && u === o.end){ return tree }
				if(atomic(tree)){ return tree }
				var sub = Radix();
				Radix.map(tree, function(v,k){ sub(k,v); }, o); // ONLY PLACE THAT TAKES TREE, maybe reduce API for better perf?
				return sub('');
			}

			;(function(){
				r.read = function(key, cb, o, DBG){
					o = o || {};
					var g = {key: key};
					g.find = function(file){ var tmp;
						g.file = file || (file = opt.code.from);
						DBG && (DBG = DBG[file] = DBG[file] || {});
						DBG && (DBG.rf = DBG.rf || +new Date);
						if(tmp = r.disk[g.file = file]){ g.check(u, tmp); return }
						r.parse(file, g.check, u, DBG);
					};
					g.get = function(err, disk, info){
						DBG && (DBG.rgl = +new Date);
						DBG && (DBG.rg = DBG.rg || +new Date);
						if(g.err = err || g.err){ cb(err); return }
						var file = g.file = (disk||'').file || g.file;
						if(!disk && file !== opt.code.from){ // corrupt file?
							r.find.bad(file); // remove from dir list
							r.read(key, cb, o); // try again
							return;
						}
						disk = r.disk[file] || (r.disk[file] = disk);
						if(!disk){ cb(file === opt.code.from? u : "No file!"); return }
						disk.file || (disk.file = file);
						var data = r.range(disk(key), o);
						DBG && (DBG.rr = +new Date);
						o.unit = disk.unit;
						o.chunks = (o.chunks || 0) + 1;
						o.parsed = (o.parsed || 0) + ((info||'').parsed||(o.chunks*opt.chunk));
						o.more = 1;
						o.next = u;
						Radix.map(r.list, function next(v,f){
							if(!v || file === f){ return }
							o.next = f;
							return 1;
						}, o.reverse? {reverse: 1, end: file} : {start: file});
						DBG && (DBG.rl = +new Date);
						if(!o.next){ o.more = 0; }
						if(o.next){
							if(!o.reverse && ((key < o.next && 0 != o.next.indexOf(key)) || (u !== o.end && (o.end || '\uffff') < o.next))){ o.more = 0; }
							if(o.reverse && ((key > o.next && 0 != key.indexOf(o.next)) || ((u !== o.start && (o.start || '') > o.next && file <= o.start)))){ o.more = 0; }
						}
						//console.log(5, process.memoryUsage().heapUsed);
						if(!o.more){ cb(g.err, data, o); return }
						if(data){ cb(g.err, data, o); }
						if(o.parsed >= o.limit){ return }
						var S = +new Date;
						DBG && (DBG.rm = S);
						var next = o.next;
						timediate(function(){
							console.STAT && console.STAT(S, +new Date - S, 'rad more');
							r.parse(next, g.check);
						},0);
					};
					g.check = function(err, disk, info){
						//console.log(4, process.memoryUsage().heapUsed);
						g.get(err, disk, info);
						if(!disk || disk.check){ return } disk.check = 1;
						var S = +new Date;
						(info || (info = {})).file || (info.file = g.file);
						Radix.map(disk, function(val, key){
							// assume in memory for now, since both write/read already call r.find which will init it.
							r.find(key, function(file){
								if((file || (file = opt.code.from)) === info.file){ return }
								var id = (''+Math.random()).slice(-3);
								puff(function(){
								r.save(key, val, function ack(err, ok){
									if(err){ r.save(key, val, ack); return } // ad infinitum???
									// TODO: NOTE!!! Mislocated data could be because of a synchronous `put` from the `g.get(` other than perf shouldn't we do the check first before acking?
									console.STAT && console.STAT("MISLOCATED DATA CORRECTED", id, ename(key), ename(info.file), ename(file));
								});
								},0);
							});
						});
						console.STAT && console.STAT(S, +new Date - S, "rad check");
					};
					r.find(key || (o.reverse? (o.end||'') : (o.start||'')), g.find); 
				};
			}());
	(function(){
				/*
					Let us start by assuming we are the only process that is
					changing the directory or bucket. Not because we do not want
					to be multi-process/machine, but because we want to experiment
					with how much performance and scale we can get out of only one.
					Then we can work on the harder problem of being multi-process.
				*/
				var RPC = 0;
				var Q = {}, s = String.fromCharCode(31);
				r.parse = function(file, cb, raw, DBG){ var q;
					if(!file){ return cb(); }
					if(q = Q[file]){ q.push(cb); return } q = Q[file] = [cb];
					var p = function Parse(){}, info = {file: file};
					(p.disk = Radix()).file = file;
					p.read = function(err, data){					DBG && (DBG.rpg = +new Date);
						console.STAT && console.STAT(S, +new Date - S, 'read disk', JSON.stringify(file), ++RPC, 'total all parses.');
						//console.log(2, process.memoryUsage().heapUsed);
						if((p.err = err) || (p.not = !data)){
							delete Q[file];
							p.map(q, p.ack);
							return;
						}
						if('string' !== typeof data){
							try{
								if(opt.max <= data.length){
									p.err = "Chunk too big!";
								} else {
									data = data.toString(); // If it crashes, it crashes here. How!?? We check size first!
								}
							}catch(e){ p.err = e; }
							if(p.err){
								delete Q[file];
								p.map(q, p.ack);
								return;
							}
						}
						info.parsed = data.length;
						DBG && (DBG.rpl = info.parsed);
						DBG && (DBG.rpa = q.length);
						S = +new Date;
						if(!(opt.jsonify || '{' === data[0])){
							p.radec(err, data);
							return;
						}
						parse(data, function(err, tree){
							//console.log(3, process.memoryUsage().heapUsed);
							if(!err){
								delete Q[file];
								p.disk.$ = tree;
								console.STAT && (ST = +new Date - S) > 9 && console.STAT(S, ST, 'rad parsed JSON');
								DBG && (DBG.rpd = +new Date);
								p.map(q, p.ack); // hmmm, v8 profiler can't see into this cause of try/catch?
								return;
							}
							if('{' === data[0]){
								delete Q[file];
								p.err =  "JSON error!";
								p.map(q, p.ack);
								return;
							}
							p.radec(err, data);
						});
					};
					p.map = function(){ // switch to setTimeout.each now?
						if(!q || !q.length){ return }
						//var i = 0, l = q.length, ack;
						var S = +new Date;
						var err = p.err, data = p.not? u : p.disk;
						var i = 0, ack; while(i < 9 && (ack = q[i++])){ ack(err, data, info); } // too much?
						console.STAT && console.STAT(S, +new Date - S, 'rad packs', ename(file));
						console.STAT && console.STAT(S, i, 'rad packs #', ename(file)); 
						if(!(q = q.slice(i)).length){ return }
						puff(p.map, 0);
					};
					p.ack = function(cb){
						if(!cb){ return }
						if(p.err || p.not){
							cb(p.err, u, info);
							return;
						}
						cb(u, p.disk, info);
					};
					p.radec = function(err, data){
						delete Q[file];
						S = +new Date;
						var tmp = p.split(data), pre = [], i, k, v;
						if(!tmp || 0 !== tmp[1]){
							p.err = "File '"+file+"' does not have root radix! ";
							p.map(q, p.ack);
							return; 
						}
						while(tmp){
							k = v = u;
							i = tmp[1];
							tmp = p.split(tmp[2])||'';
							if('#' == tmp[0]){
								k = tmp[1];
								pre = pre.slice(0,i);
								if(i <= pre.length){
									pre.push(k);
								}
							}
							tmp = p.split(tmp[2])||'';
							if('\n' == tmp[0]){ continue }
							if('=' == tmp[0] || ':' == tmp[0]){ v = tmp[1]; }
							if(u !== k && u !== v){ p.disk(pre.join(''), v); }
							tmp = p.split(tmp[2]);
						}
						console.STAT && console.STAT(S, +new Date - S, 'parsed RAD');
						p.map(q, p.ack);
					};
					p.split = function(t){
						if(!t){ return }
						var l = [], o = {}, i = -1, a = '', b;
						i = t.indexOf(s);
						if(!t[i]){ return }
						a = t.slice(0, i);
						l[0] = a;
						l[1] = b = Radisk.decode(t.slice(i), o);
						l[2] = t.slice(i + o.i);
						return l;
					};
					if(r.disk){ raw || (raw = (r.disk[file]||'').raw); }
					var S = +new Date;
					DBG && (DBG.rp = S);
					if(raw){ return puff(function(){ p.read(u, raw); }, 0) }
					opt.store.get(ename(file), p.read);
					// TODO: What if memory disk gets filled with updates, and we get an old one back?
				};
			}());
	(function(){
				var dir, f = String.fromCharCode(28), Q;
				r.find = function(key, cb){
					if(!dir){
						if(Q){ Q.push([key, cb]); return } Q = [[key, cb]];
						r.parse(f, init);
						return;
					}
					Radix.map(r.list = dir, function(val, key){
						if(!val){ return }
						return cb(key) || true;
					}, {reverse: 1, end: key}) || cb(opt.code.from);
				};
				r.find.add = function(file, cb){
					var has = dir(file);
					if(has || file === f){ cb(u, 1); return }
					dir(file, 1);
					cb.found = (cb.found || 0) + 1;
					r.write(f, dir, function(err, ok){
						if(err){ cb(err); return }
						cb.found = (cb.found || 0) - 1;
						if(0 !== cb.found){ return }
						cb(u, 1);
					}, true);
				};
				r.find.bad = function(file, cb){
					dir(file, 0);
					r.write(f, dir, cb||noop);
				};
				function init(err, disk){
					if(err){
						opt.log('list', err);
						setTimeout(function(){ r.parse(f, init); }, 1000);
						return;
					}
					if(disk){ drain(disk); return }
					dir = dir || disk || Radix();
					if(!opt.store.list){ drain(dir); return }
					// import directory.
					opt.store.list(function(file){
						if(!file){ drain(dir); return }
						r.find.add(file, noop);
					});
				}
				function drain(rad, tmp){
					dir = dir || rad;
					dir.file = f;
					tmp = Q; Q = null;
					map(tmp, function(arg){
						r.find(arg[0], arg[1]);
					});
				}
			}());

			try{ !Gun.window && radmigtmp(r); }catch(e){}

			var noop = function(){}, u;
			Radisk.has[opt.file] = r;
			return r;
		}
	(function(){
			var _ = String.fromCharCode(31);
			Radisk.encode = function(d, o, s){ s = s || _;
				var t = s, tmp;
				if(typeof d == 'string'){
					var i = d.indexOf(s);
					while(i != -1){ t += s; i = d.indexOf(s, i+1); }
					return t + '"' + d + s;
				} else
				if(d && d['#'] && 1 == Object.keys(d).length){
					return t + '#' + tmp + t;
				} else
				if('number' == typeof d){
					return t + '+' + (d||0) + t;
				} else
				if(null === d){
					return t + ' ' + t;
				} else
				if(true === d){
					return t + '+' + t;
				} else
				if(false === d){
					return t + '-' + t;
				}// else
				//if(binary){}
			};
			Radisk.decode = function(t, o, s){ s = s || _;
				var d = '', i = -1, n = 0, c, p;
				if(s !== t[0]){ return }
				while(s === t[++i]){ ++n; }
				p = t[c = n] || true;
				while(--n >= 0){ i = t.indexOf(s, i+1); }
				if(i == -1){ i = t.length; }
				d = t.slice(c+1, i);
				if(o){ o.i = i+1; }
				if('"' === p){
					return d;
				} else
				if('#' === p){
					return {'#':d};
				} else
				if('+' === p){
					if(0 === d.length){
						return true;
					}
					return parseFloat(d);
				} else
				if(' ' === p){
					return null;
				} else
				if('-' === p){
					return false;
				}
			};
		}());

		if(typeof window !== "undefined"){
		  var Gun = window.Gun;
		  var Radix = window.Radix;
		  window.Radisk = Radisk;
		} else { 
		  var Gun = gun;
			var Radix = radix;
			//var Radix = require('./radix2'); Radisk = require('./radisk2');
			try{ module.exports = Radisk; }catch(e){}
		}

		Radisk.Radix = Radix;

	}());
	});

	var Gun$1 = (typeof window !== "undefined")? window.Gun : gun;

	Gun$1.on('create', function(root){
	    if(Gun$1.TESTING){ root.opt.file = 'radatatest'; }
	    this.to.next(root);
	    var opt = root.opt, u;
	    if(false === opt.rad || false === opt.radisk){ return }
	    if((u+'' != typeof process) && 'false' === ''+(process.env||'').RAD){ return }
	    var Radisk = (Gun$1.window && Gun$1.window.Radisk) || radisk;
	    var Radix = Radisk.Radix;
	    var dare = Radisk(opt), esc = String.fromCharCode(27);
	    var ST = 0;
	 
	    root.on('put', function(msg){
	        this.to.next(msg);
	        if((msg._||'').rad){ return } // don't save what just came from a read.
	        //if(msg['@']){ return } // WHY DID I NOT ADD THIS?
	        var id = msg['#'], put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>'];
	        var DBG = (msg._||'').DBG; DBG && (DBG.sp = DBG.sp || +new Date);
	        //var lot = (msg._||'').lot||''; count[id] = (count[id] || 0) + 1; 
	        var S = (msg._||'').RPS || ((msg._||'').RPS = +new Date);
	        //console.log("PUT ------->>>", soul,key, val, state);
	        //dare(soul+esc+key, {':': val, '>': state}, dare.one[id] || function(err, ok){
	        dare(soul+esc+key, {':': val, '>': state}, function(err, ok){
	            //console.log("<<<------- PAT", soul,key, val, state, 'in', +new Date - S);
	            DBG && (DBG.spd = DBG.spd || +new Date);
	            console.STAT && console.STAT(S, +new Date - S, 'put');
	            //if(!err && count[id] !== lot.s){ console.log(err = "Disk count not same as ram count."); console.STAT && console.STAT(+new Date, lot.s - count[id], 'put ack != count') } delete count[id];
	            if(err){ root.on('in', {'@': id, err: err, DBG: DBG}); return }
	            root.on('in', {'@': id, ok: ok, DBG: DBG});
	        //}, id, DBG && (DBG.r = DBG.r || {}));
	        }, false , DBG && (DBG.r = DBG.r || {}));
	        DBG && (DBG.sps = DBG.sps || +new Date);
	    });
	 
	    root.on('get', function(msg){
	        this.to.next(msg);
	        var ctx = msg._||'', DBG = ctx.DBG = msg.DBG; DBG && (DBG.sg = +new Date);
	        var id = msg['#'], get = msg.get, soul = msg.get['#'], has = msg.get['.']||'', o = {}, graph, key, tmp, force;
	        if('string' == typeof soul){
	            key = soul;
	        } else 
	        if(soul){
	            if(u !== (tmp = soul['*'])){ o.limit = force = 1; }
	            if(u !== soul['>']){ o.start = soul['>']; }
	            if(u !== soul['<']){ o.end = soul['<']; }
	            key = force? (''+tmp) : tmp || soul['='];
	            force = null;
	        }
	        if(key && !o.limit){ // a soul.has must be on a soul, and not during soul*
	            if('string' == typeof has){
	                key = key+esc+(o.atom = has);
	            } else 
	            if(has){
	                if(u !== has['>']){ o.start = has['>']; o.limit = 1; }
	                if(u !== has['<']){ o.end = has['<']; o.limit = 1; }
	                if(u !== (tmp = has['*'])){ o.limit = force = 1; }
	                if(key){ key = key+esc + (force? (''+(tmp||'')) : tmp || (o.atom = has['='] || '')); }
	            }
	        }
	        if((tmp = get['%']) || o.limit){
	            o.limit = (tmp <= (o.pack || (1000 * 100)))? tmp : 1;
	        }
	        if(has['-'] || (soul||{})['-'] || get['-']){ o.reverse = true; }
	        if((tmp = (root.next||'')[soul]) && tmp.put){
	            if(o.atom){
	                tmp = (tmp.next||'')[o.atom] ;
	                if(tmp && tmp.rad){ return }
	            } else
	            if(tmp && tmp.rad){ return }
	        }
	        var now = Gun$1.state();
	        var S = (+new Date), C = 0; // STATS!
	        DBG && (DBG.sgm = S);
	        //var GID = String.random(3); console.log("GET ------->>>", GID, key, o, '?', get);
	        dare(key||'', function(err, data, info){
	            //console.log("<<<------- GOT", GID, +new Date - S, err, data);
	            DBG && (DBG.sgr = +new Date);
	            DBG && (DBG.sgi = info);
	            try{opt.store.stats.get.time[statg % 50] = (+new Date) - S; ++statg;
	                opt.store.stats.get.count++;
	                if(err){ opt.store.stats.get.err = err; }
	            }catch(e){} // STATS!
	            //if(u === data && info.chunks > 1){ return } // if we already sent a chunk, ignore ending empty responses. // this causes tests to fail.
	            console.STAT && console.STAT(S, +new Date - S, 'got', JSON.stringify(key)); S = +new Date;
	            info = info || '';
	            var va, ve;
	            if(info.unit && data && u !== (va = data[':']) && u !== (ve = data['>'])){ // new format
	                var tmp = key.split(esc), so = tmp[0], ha = tmp[1];
	                (graph = graph || {})[so] = Gun$1.state.ify(graph[so], ha, ve, va, so);
	                root.$.get(so).get(ha)._.rad = now;
	                // REMEMBER TO ADD _rad TO NODE/SOUL QUERY!
	            } else
	            if(data){ // old code path
	                if(typeof data !== 'string'){
	                    if(o.atom){
	                        data = u;
	                    } else {
	                        Radix.map(data, each, o); // IS A RADIX TREE, NOT FUNCTION!
	                    }
	                }
	                if(!graph && data){ each(data, ''); }
	                // TODO: !has what about soul lookups?
	                if(!o.atom && !has & 'string' == typeof soul && !o.limit && !o.more){
	                    root.$.get(soul)._.rad = now;
	                }
	            }
	            DBG && (DBG.sgp = +new Date);
	            // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
	            // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
	            // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
	            // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
	            // TODO: PERF NOTES! This is like 0.2s, but for each ack, or all? Can you cache these preps?
	            // Or benchmark by reusing first start date.
	            if(console.STAT && (ST = +new Date - S) > 9){ console.STAT(S, ST, 'got prep time'); console.STAT(S, C, 'got prep #'); } C = 0; S = +new Date;
	            var faith = function(){}; faith.faith = true; faith.rad = get; // HNPERF: We're testing performance improvement by skipping going through security again, but this should be audited.
	            root.on('in', {'@': id, put: graph, '%': info.more? 1 : u, err: err? err : u, _: faith, DBG: DBG});
	            console.STAT && (ST = +new Date - S) > 9 && console.STAT(S, ST, 'got emit', Object.keys(graph||{}).length);
	            graph = u; // each is outside our scope, we have to reset graph to nothing!
	        }, o, DBG && (DBG.r = DBG.r || {}));
	        DBG && (DBG.sgd = +new Date);
	        console.STAT && (ST = +new Date - S) > 9 && console.STAT(S, ST, 'get call'); // TODO: Perf: this was half a second??????
	        function each(val, has, a,b){ // TODO: THIS CODE NEEDS TO BE FASTER!!!!
	            C++;
	            if(!val){ return }
	            has = (key+has).split(esc);
	            var soul = has.slice(0,1)[0];
	            has = has.slice(-1)[0];
	            if(o.limit && o.limit <= o.count){ return true }
	            var va, ve, so = soul, ha = has;
	            //if(u !== (va = val[':']) && u !== (ve = val['>'])){ // THIS HANDLES NEW CODE!
	            if('string' != typeof val){ // THIS HANDLES NEW CODE!
	                va = val[':']; ve = val['>'];
	                (graph = graph || {})[so] = Gun$1.state.ify(graph[so], ha, ve, va, so);
	                //root.$.get(so).get(ha)._.rad = now;
	                o.count = (o.count || 0) + ((va||'').length || 9);
	                return;
	            }
	            o.count = (o.count || 0) + val.length;
	            var tmp = val.lastIndexOf('>');
	            var state = Radisk.decode(val.slice(tmp+1), null, esc);
	            val = Radisk.decode(val.slice(0,tmp), null, esc);
	            (graph = graph || {})[soul] = Gun$1.state.ify(graph[soul], has, state, val, soul);
	        }
	    });
	    (opt.store||{}).stats = {get:{time:{}, count:0}, put: {time:{}, count:0}}; // STATS!
	    var statg = 0; // STATS!
	});

	function Store(opt){
		opt = opt || {};
		opt.log = opt.log || console.log;
		opt.file = String(opt.file || 'radata');
		var fs$1 = fs, u;

		var store = function Store(){};
		if(Store[opt.file]){
			console.log("Warning: reusing same fs store and options as 1st.");
			return Store[opt.file];
		}
		Store[opt.file] = store;
		var puts = {};

		// TODO!!! ADD ZLIB INFLATE / DEFLATE COMPRESSION!
		store.put = function(file, data, cb){
			var random = Math.random().toString(36).slice(-3);
			puts[file] = {id: random, data: data};
			var tmp = opt.file+'-'+file+'-'+random+'.tmp';
			fs$1.writeFile(tmp, data, function(err, ok){
				if(err){
					if(random === (puts[file]||'').id){ delete puts[file]; }
					return cb(err);
				}
				move(tmp, opt.file+'/'+file, function(err, ok){
					if(random === (puts[file]||'').id){ delete puts[file]; }
					cb(err, ok || !err);
				});
			});
		};
		store.get = function(file, cb){ var tmp; // this took 3s+?
			if(tmp = puts[file]){ cb(u, tmp.data); return }
			fs$1.readFile(opt.file+'/'+file, function(err, data){
				if(err){
					if('ENOENT' === (err.code||'').toUpperCase()){
						return cb();
					}
					opt.log("ERROR:", err);
				}
				cb(err, data);
			});
		};

		if(!fs$1.existsSync(opt.file)){ fs$1.mkdirSync(opt.file); }

		function move(oldPath, newPath, cb) {
			fs$1.rename(oldPath, newPath, function (err) {
				if (err) {
					if (err.code === 'EXDEV') {
						var readStream = fs$1.createReadStream(oldPath);
						var writeStream = fs$1.createWriteStream(newPath);

						readStream.on('error', cb);
						writeStream.on('error', cb);

						readStream.on('close', function () {
							fs$1.unlink(oldPath, cb);
						});

						readStream.pipe(writeStream);
					} else {
						cb(err);
					}
				} else {
					cb();
				}
			});
		}
		store.list = function(cb, match, params, cbs){
			var dir = fs$1.readdirSync(opt.file);
			dir.forEach(function(file){
				cb(file);
			});
			cb();
		};
		
		return store;
	}

	var Gun$2 = (typeof window !== "undefined")? window.Gun : gun;
	Gun$2.on('create', function(root){
		this.to.next(root);
		var opt = root.opt;
		if(opt.rfs === false){ return }
		opt.store = opt.store || (!Gun$2.window && Store(opt));
	});

	var rfs = Store;

	var rfsmix = function(opt, store){
		var rfs$1 = rfs(opt);
		var p = store.put;
		var g = store.get;
		store.put = function(file, data, cb){
			var a, b, c = function(err, ok){
				if(b){ return cb(err || b) }
				if(a){ return cb(err, ok) }
				a = true;
				b = err;
			};
			p(file, data, c); // parallel
			rfs$1.put(file, data, c); // parallel
		};
		store.get = function(file, cb){
			rfs$1.get(file, function(err, data){
				//console.log("rfs3 hijacked", file);
				if(data){ return cb(err, data) }
				g(file, cb);
			});
		};
		return store;
	};

	var u, AWS;

	gun.on('create', function(root){
		this.to.next(root);
		var opt = root.opt;
		if(!opt.s3 && !process.env.AWS_S3_BUCKET){ return }
		//opt.batch = opt.batch || (1000 * 10);
		//opt.until = opt.until || (1000 * 3); // ignoring these now, cause perf > cost
		//opt.chunk = opt.chunk || (1024 * 1024 * 10); // 10MB // when cost only cents

		try{AWS = awsSdk;
		}catch(e){
			console.log("Please `npm install aws-sdk` or add it to your package.json !");
			AWS_SDK_NOT_INSTALLED;
		}

		var opts = opt.s3 || (opt.s3 = {});
		opts.bucket = opts.bucket || process.env.AWS_S3_BUCKET;
		opts.region = opts.region || process.env.AWS_REGION || "us-east-1";
		opts.accessKeyId = opts.key = opts.key || opts.accessKeyId || process.env.AWS_ACCESS_KEY_ID;
		opts.secretAccessKey = opts.secret = opts.secret || opts.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY;

		if(opt.fakes3 = opt.fakes3 || process.env.fakes3){
			opts.endpoint = opt.fakes3;
			opts.sslEnabled = false;
			opts.bucket = opts.bucket.replace('.','p');
		}

		opts.config = new AWS.Config(opts);
		opts.s3 = opts.s3 || new AWS.S3(opts.config);

		opt.store = Object.keys(opts.s3).length === 0 ? opt.store : Store$1(opt);
	});

	function Store$1(opt){
		opt = opt || {};
		opt.file = String(opt.file || 'radata');
		var opts = opt.s3, s3 = opts.s3;
		var c = {p: {}, g: {}, l: {}};
		
		var store = function Store(){};
		if(Store$1[opt.file]){
			console.log("Warning: reusing same S3 store and options as 1st.");
			return Store$1[opt.file];
		}
		Store$1[opt.file] = store;

		store.put = function(file, data, cb){
			var params = {Bucket: opts.bucket, Key: file, Body: data};
			//console.log("RS3 PUT ---->", (data||"").slice(0,20));
			c.p[file] = data;
			delete c.g[file];//Gun.obj.del(c.g, file);
			delete c.l[1];//Gun.obj.del(c.l, 1);
	    s3.putObject(params, function(err, ok){
	    	delete c.p[file];
	    	cb(err, 's3');
	    });
		};
		store.get = function(file, cb){ var tmp;
			if(tmp = c.p[file]){ cb(u, tmp); return }
			if(tmp = c.g[file]){ tmp.push(cb); return }
			var cbs = c.g[file] = [cb];
			var params = {Bucket: opts.bucket, Key: file||''};
			//console.log("RS3 GET ---->", file);
			s3.getObject(params, function got(err, ack){
				if(err && 'NoSuchKey' === err.code){ err = u; }
				//console.log("RS3 GOT <----", err, file, cbs.length, ((ack||{}).Body||'').length);//.toString().slice(0,20));
				delete c.g[file];//Gun.obj.del(c.g, file);
				var data, data = (ack||'').Body;
				//console.log(1, process.memoryUsage().heapUsed);
				var i = 0, cba; while(cba = cbs[i++]){ cba && cba(err, data); }//Gun.obj.map(cbs, cbe);
			});
		};
		store.list = function(cb, match, params, cbs){
			if(!cbs){
				if(c.l[1]){ return c.l[1].push(cb) }
				cbs = c.l[1] = [cb];
			}
			params = params || {Bucket: opts.bucket};
			//console.log("RS3 LIST --->");
			s3.listObjectsV2(params, function(err, data){
				//console.log("RS3 LIST <---", err, data, cbs.length);
				if(err){ return gun.log(err, err.stack) }
				var IT = data.IsTruncated;
				// Gun.obj.map(cbs, cbe); // lets see if fixes heroku
				if(!IT){ delete c.l[1]; return }
		    params.ContinuationToken = data.NextContinuationToken;
		  	store.list(cb, match, params, cbs);
	    });
		};
		//store.list(function(){ return true });
		if(false !== opt.rfs){ rfsmix(opt, store); } // ugly, but gotta move fast for now.
		return store;
	}

	var constants = {
	  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  EMPTY_BUFFER: Buffer.alloc(0),
	  NOOP: () => {}
	};

	var bufferUtil = createCommonjsModule(function (module) {

	const { EMPTY_BUFFER } = constants;

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) return target.slice(0, offset);

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
	  const length = buffer.length;
	  for (let i = 0; i < length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.byteLength === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = Buffer.from(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	try {
	  const bufferUtil = bufferutil;
	  const bu = bufferUtil.BufferUtil || bufferUtil;

	  module.exports = {
	    concat,
	    mask(source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bu.mask(source, mask, output, offset, length);
	    },
	    toArrayBuffer,
	    toBuffer,
	    unmask(buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bu.unmask(buffer, mask);
	    }
	  };
	} catch (e) /* istanbul ignore next */ {
	  module.exports = {
	    concat,
	    mask: _mask,
	    toArrayBuffer,
	    toBuffer,
	    unmask: _unmask
	  };
	}
	});

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	var limiter = Limiter;

	const { kStatusCode, NOOP } = constants;

	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {Buffer} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      //
	      // An `'error'` event is emitted, only on Node.js < 10.0.0, if the
	      // `zlib.DeflateRaw` instance is closed while data is being processed.
	      // This can happen if `PerMessageDeflate#cleanup()` is called at the wrong
	      // time due to an abnormal WebSocket closure.
	      //
	      this._deflate.on('error', NOOP);
	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) data = data.slice(0, data.length - 4);

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	var permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;
	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}

	var validation = createCommonjsModule(function (module) {

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	try {
	  let isValidUTF8 = utf8Validate;

	  /* istanbul ignore if */
	  if (typeof isValidUTF8 === 'object') {
	    isValidUTF8 = isValidUTF8.Validation.isValidUTF8; // utf-8-validate@<3.0.0
	  }

	  module.exports = {
	    isValidStatusCode,
	    isValidUTF8(buf) {
	      return buf.length < 150 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    }
	  };
	} catch (e) /* istanbul ignore next */ {
	  module.exports = {
	    isValidStatusCode,
	    isValidUTF8: _isValidUTF8
	  };
	}
	});

	const { Writable } = stream$1;


	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode: kStatusCode$1,
	  kWebSocket
	} = constants;
	const { concat, toArrayBuffer, unmask } = bufferUtil;
	const { isValidStatusCode, isValidUTF8 } = validation;

	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {String} [binaryType=nodebuffer] The type for binary data
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Boolean} [isServer=false] Specifies whether to operate in client or
	   *     server mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(binaryType, extensions, isServer, maxPayload) {
	    super();

	    this._binaryType = binaryType || BINARY_TYPES[0];
	    this[kWebSocket] = undefined;
	    this._extensions = extensions || {};
	    this._isServer = !!isServer;
	    this._maxPayload = maxPayload | 0;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._state = GET_INFO;
	    this._loop = false;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = buf.slice(n);
	      return buf.slice(0, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = buf.slice(n);
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    let err;
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          err = this.getInfo();
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          err = this.getPayloadLength16();
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          err = this.getPayloadLength64();
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          err = this.getData(cb);
	          break;
	        default:
	          // `INFLATING`
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    cb(err);
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getInfo() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[permessageDeflate.extensionName]) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (!this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );
	      }

	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (this._payloadLength > 0x7d) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      }
	    } else {
	      this._loop = false;
	      return error(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );
	      }
	    } else if (this._masked) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength16() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength64() {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    return this.haveLength();
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  haveLength() {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);
	      if (this._masked) unmask(data, this._mask);
	    }

	    if (this._opcode > 0x07) return this.controlMessage(data);

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its lenght is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    return this.dataMessage();
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          return cb(
	            error(
	              RangeError,
	              'Max payload size exceeded',
	              false,
	              1009,
	              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	            )
	          );
	        }

	        this._fragments.push(buf);
	      }

	      const er = this.dataMessage();
	      if (er) return cb(er);

	      this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @return {(Error|undefined)} A possible error
	   * @private
	   */
	  dataMessage() {
	    if (this._fin) {
	      const messageLength = this._messageLength;
	      const fragments = this._fragments;

	      this._totalPayloadLength = 0;
	      this._messageLength = 0;
	      this._fragmented = 0;
	      this._fragments = [];

	      if (this._opcode === 2) {
	        let data;

	        if (this._binaryType === 'nodebuffer') {
	          data = concat(fragments, messageLength);
	        } else if (this._binaryType === 'arraybuffer') {
	          data = toArrayBuffer(concat(fragments, messageLength));
	        } else {
	          data = fragments;
	        }

	        this.emit('message', data);
	      } else {
	        const buf = concat(fragments, messageLength);

	        if (!isValidUTF8(buf)) {
	          this._loop = false;
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('message', buf.toString());
	      }
	    }

	    this._state = GET_INFO;
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data) {
	    if (this._opcode === 0x08) {
	      this._loop = false;

	      if (data.length === 0) {
	        this.emit('conclude', 1005, '');
	        this.end();
	      } else if (data.length === 1) {
	        return error(
	          RangeError,
	          'invalid payload length 1',
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          return error(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );
	        }

	        const buf = data.slice(2);

	        if (!isValidUTF8(buf)) {
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('conclude', code, buf.toString());
	        this.end();
	      }
	    } else if (this._opcode === 0x09) {
	      this.emit('ping', data);
	    } else {
	      this.emit('pong', data);
	    }

	    this._state = GET_INFO;
	  }
	}

	var receiver = Receiver;

	/**
	 * Builds an error object.
	 *
	 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	 * @param {String} message The error message
	 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	 *     `message`
	 * @param {Number} statusCode The status code
	 * @param {String} errorCode The exposed error code
	 * @return {(Error|RangeError)} The error
	 * @private
	 */
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
	  const err = new ErrorCtor(
	    prefix ? `Invalid WebSocket frame: ${message}` : message
	  );

	  Error.captureStackTrace(err, error);
	  err.code = errorCode;
	  err[kStatusCode$1] = statusCode;
	  return err;
	}

	const { randomFillSync } = crypto$1;


	const { EMPTY_BUFFER: EMPTY_BUFFER$1 } = constants;
	const { isValidStatusCode: isValidStatusCode$1 } = validation;
	const { mask: applyMask, toBuffer } = bufferUtil;

	const mask = Buffer.alloc(4);

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   */
	  constructor(socket, extensions) {
	    this._extensions = extensions || {};
	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._deflating = false;
	    this._queue = [];
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {Buffer} data The data to frame
	   * @param {Object} options Options object
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {Buffer[]} The framed data as a list of `Buffer` instances
	   * @public
	   */
	  static frame(data, options) {
	    const merge = options.mask && options.readOnly;
	    let offset = options.mask ? 6 : 2;
	    let payloadLength = data.length;

	    if (data.length >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (data.length > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? data.length + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(data.length, 2);
	    } else if (payloadLength === 127) {
	      target.writeUInt32BE(0, 2);
	      target.writeUInt32BE(data.length, 6);
	    }

	    if (!options.mask) return [target, data];

	    randomFillSync(mask, 0, 4);

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (merge) {
	      applyMask(data, mask, target, offset, data.length);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, data.length);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {String} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER$1;
	    } else if (typeof code !== 'number' || !isValidStatusCode$1(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || data === '') {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);
	      buf.write(data, 2);
	    }

	    if (this._deflating) {
	      this.enqueue([this.doClose, buf, mask, cb]);
	    } else {
	      this.doClose(buf, mask, cb);
	    }
	  }

	  /**
	   * Frames and sends a close message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doClose(data, mask, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x08,
	        mask,
	        readOnly: false
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    const buf = toBuffer(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPing, buf, mask, toBuffer.readOnly, cb]);
	    } else {
	      this.doPing(buf, mask, toBuffer.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a ping message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPing(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x09,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    const buf = toBuffer(data);

	    if (buf.length > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    if (this._deflating) {
	      this.enqueue([this.doPong, buf, mask, toBuffer.readOnly, cb]);
	    } else {
	      this.doPong(buf, mask, toBuffer.readOnly, cb);
	    }
	  }

	  /**
	   * Frames and sends a pong message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Boolean} [readOnly=false] Specifies whether `data` can be modified
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  doPong(data, mask, readOnly, cb) {
	    this.sendFrame(
	      Sender.frame(data, {
	        fin: true,
	        rsv1: false,
	        opcode: 0x0a,
	        mask,
	        readOnly
	      }),
	      cb
	    );
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const buf = toBuffer(data);
	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (rsv1 && perMessageDeflate) {
	        rsv1 = buf.length >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    if (perMessageDeflate) {
	      const opts = {
	        fin: options.fin,
	        rsv1,
	        opcode,
	        mask: options.mask,
	        readOnly: toBuffer.readOnly
	      };

	      if (this._deflating) {
	        this.enqueue([this.dispatch, buf, this._compress, opts, cb]);
	      } else {
	        this.dispatch(buf, this._compress, opts, cb);
	      }
	    } else {
	      this.sendFrame(
	        Sender.frame(buf, {
	          fin: options.fin,
	          rsv1: false,
	          opcode,
	          mask: options.mask,
	          readOnly: toBuffer.readOnly
	        }),
	        cb
	      );
	    }
	  }

	  /**
	   * Dispatches a data message.
	   *
	   * @param {Buffer} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[permessageDeflate.extensionName];

	    this._bufferedBytes += data.length;
	    this._deflating = true;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        if (typeof cb === 'function') cb(err);

	        for (let i = 0; i < this._queue.length; i++) {
	          const callback = this._queue[i][4];

	          if (typeof callback === 'function') callback(err);
	        }

	        return;
	      }

	      this._bufferedBytes -= data.length;
	      this._deflating = false;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (!this._deflating && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[1].length;
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[1].length;
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {Buffer[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	var sender = Sender;

	/**
	 * Class representing an event.
	 *
	 * @private
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(type, target) {
	    this.target = target;
	    this.type = type;
	  }
	}

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 * @private
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The received data
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(data, target) {
	    super('message', target);

	    this.data = data;
	  }
	}

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 * @private
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {Number} code The status code explaining why the connection is being
	   *     closed
	   * @param {String} reason A human-readable string explaining why the
	   *     connection is closing
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(code, reason, target) {
	    super('close', target);

	    this.wasClean = target._closeFrameReceived && target._closeFrameSent;
	    this.reason = reason;
	    this.code = code;
	  }
	}

	/**
	 * Class representing an open event.
	 *
	 * @extends Event
	 * @private
	 */
	class OpenEvent extends Event {
	  /**
	   * Create a new `OpenEvent`.
	   *
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(target) {
	    super('open', target);
	  }
	}

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 * @private
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {Object} error The error that generated this event
	   * @param {WebSocket} target A reference to the target to which the event was
	   *     dispatched
	   */
	  constructor(error, target) {
	    super('error', target);

	    this.message = error.message;
	    this.error = error;
	  }
	}

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {Function} listener The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean`` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, listener, options) {
	    if (typeof listener !== 'function') return;

	    function onMessage(data) {
	      listener.call(this, new MessageEvent(data, this));
	    }

	    function onClose(code, message) {
	      listener.call(this, new CloseEvent(code, message, this));
	    }

	    function onError(error) {
	      listener.call(this, new ErrorEvent(error, this));
	    }

	    function onOpen() {
	      listener.call(this, new OpenEvent(this));
	    }

	    const method = options && options.once ? 'once' : 'on';

	    if (type === 'message') {
	      onMessage._listener = listener;
	      this[method](type, onMessage);
	    } else if (type === 'close') {
	      onClose._listener = listener;
	      this[method](type, onClose);
	    } else if (type === 'error') {
	      onError._listener = listener;
	      this[method](type, onError);
	    } else if (type === 'open') {
	      onOpen._listener = listener;
	      this[method](type, onOpen);
	    } else {
	      this[method](type, listener);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {Function} listener The listener to remove
	   * @public
	   */
	  removeEventListener(type, listener) {
	    const listeners = this.listeners(type);

	    for (let i = 0; i < listeners.length; i++) {
	      if (listeners[i] === listener || listeners[i]._listener === listener) {
	        this.removeListener(type, listeners[i]);
	      }
	    }
	  }
	};

	var eventTarget = EventTarget;

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);

	  if (header === undefined || header === '') return offers;

	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 /* ' ' */ || code === 0x09 /* '\t' */) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	var extension = { format, parse };

	const { randomBytes, createHash } = crypto$1;
	const { URL } = url;




	const {
	  BINARY_TYPES: BINARY_TYPES$1,
	  EMPTY_BUFFER: EMPTY_BUFFER$2,
	  GUID,
	  kStatusCode: kStatusCode$2,
	  kWebSocket: kWebSocket$1,
	  NOOP: NOOP$1
	} = constants;
	const { addEventListener, removeEventListener } = eventTarget;
	const { format: format$1, parse: parse$1 } = extension;
	const { toBuffer: toBuffer$1 } = bufferUtil;

	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const protocolVersions = [8, 13];
	const closeTimeout = 30 * 1000;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends events {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES$1[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = '';
	    this._closeTimer = null;
	    this._extensions = {};
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (Array.isArray(protocols)) {
	        protocols = protocols.join(', ');
	      } else if (typeof protocols === 'object' && protocols !== null) {
	        options = protocols;
	        protocols = undefined;
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._isServer = true;
	    }
	  }

	  /**
	   * This deviates from the WHATWG interface since ws doesn't support the
	   * required default "blob" type (instead we define a custom "nodebuffer"
	   * type).
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES$1.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onclose(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onerror(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onopen(listener) {}

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return undefined;
	  }

	  /* istanbul ignore next */
	  set onmessage(listener) {}

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Number} [maxPayload=0] The maximum allowed message size
	   * @private
	   */
	  setSocket(socket, head, maxPayload) {
	    const receiver$1 = new receiver(
	      this.binaryType,
	      this._extensions,
	      this._isServer,
	      maxPayload
	    );

	    this._sender = new sender(socket, this._extensions);
	    this._receiver = receiver$1;
	    this._socket = socket;

	    receiver$1[kWebSocket$1] = this;
	    socket[kWebSocket$1] = this;

	    receiver$1.on('conclude', receiverOnConclude);
	    receiver$1.on('drain', receiverOnDrain);
	    receiver$1.on('error', receiverOnError);
	    receiver$1.on('message', receiverOnMessage);
	    receiver$1.on('ping', receiverOnPing);
	    receiver$1.on('pong', receiverOnPong);

	    socket.setTimeout(0);
	    socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[permessageDeflate.extensionName]) {
	      this._extensions[permessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {String} [data] A string explaining why the connection is closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake(this, this._req, msg);
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    //
	    // Specify a timeout for the closing handshake to complete.
	    //
	    this._closeTimer = setTimeout(
	      this._socket.destroy.bind(this._socket),
	      closeTimeout
	    );
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER$2, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER$2, mask, cb);
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[permessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER$2, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      return abortHandshake(this, this._req, msg);
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      const listeners = this.listeners(method);
	      for (let i = 0; i < listeners.length; i++) {
	        if (listeners[i]._listener) return listeners[i]._listener;
	      }

	      return undefined;
	    },
	    set(listener) {
	      const listeners = this.listeners(method);
	      for (let i = 0; i < listeners.length; i++) {
	        //
	        // Remove only the listeners added via `addEventListener`.
	        //
	        if (listeners[i]._listener) this.removeListener(method, listeners[i]);
	      }
	      this.addEventListener(method, listener);
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	var websocket = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {String} [protocols] The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    createConnection: undefined,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: undefined,
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	    websocket._url = address.href;
	  } else {
	    parsedUrl = new URL(address);
	    websocket._url = address;
	  }

	  const isUnixSocket = parsedUrl.protocol === 'ws+unix:';

	  if (!parsedUrl.host && (!isUnixSocket || !parsedUrl.pathname)) {
	    const err = new Error(`Invalid URL: ${websocket.url}`);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const isSecure =
	    parsedUrl.protocol === 'wss:' || parsedUrl.protocol === 'https:';
	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const get = isSecure ? https.get : http.get;
	  let perMessageDeflate;

	  opts.createConnection = isSecure ? tlsConnect : netConnect;
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket',
	    ...opts.headers
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new permessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format$1({
	      [permessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols) {
	    opts.headers['Sec-WebSocket-Protocol'] = protocols;
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isUnixSocket) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalUnixSocket = isUnixSocket;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isUnixSocket
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else {
	      const isSameHost = isUnixSocket
	        ? websocket._originalUnixSocket
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalUnixSocket
	        ? false
	        : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }
	  }

	  let req = (websocket._req = get(opts));

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req.aborted) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (err) {
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the `upgrade`
	    // event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    if (res.headers.upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    const protList = (protocols || '').split(/, */);
	    let protError;

	    if (!protocols && serverProt) {
	      protError = 'Server sent a subprotocol but none was requested';
	    } else if (protocols && !serverProt) {
	      protError = 'Server sent no subprotocol';
	    } else if (serverProt && !protList.includes(serverProt)) {
	      protError = 'Server sent an invalid subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse$1(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (extensionNames.length) {
	        if (
	          extensionNames.length !== 1 ||
	          extensionNames[0] !== permessageDeflate.extensionName
	        ) {
	          const message =
	            'Server indicated an extension that was not requested';
	          abortHandshake(websocket, socket, message);
	          return;
	        }

	        try {
	          perMessageDeflate.accept(extensions[permessageDeflate.extensionName]);
	        } catch (err) {
	          const message = 'Invalid Sec-WebSocket-Extensions header';
	          abortHandshake(websocket, socket, message);
	          return;
	        }

	        websocket._extensions[permessageDeflate.extensionName] =
	          perMessageDeflate;
	      }
	    }

	    websocket.setSocket(socket, head, opts.maxPayload);
	  });
	}

	/**
	 * Emit the `'error'` and `'close'` event.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    stream.once('abort', websocket.emitClose.bind(websocket));
	    websocket.emit('error', err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = toBuffer$1(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    cb(err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {String} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket$1];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket$1] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  this[kWebSocket$1]._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket$1];

	  if (websocket._socket[kWebSocket$1] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode$2]);
	  }

	  websocket.emit('error', err);
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket$1].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {(String|Buffer|ArrayBuffer|Buffer[])} data The message
	 * @private
	 */
	function receiverOnMessage(data) {
	  this[kWebSocket$1].emit('message', data);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket$1];

	  websocket.pong(data, !websocket._isServer, NOOP$1);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket$1].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The listener of the `net.Socket` `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket$1];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket$1] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the `net.Socket` `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket$1]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the `net.Socket` `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket$1];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the `net.Socket` `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket$1];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP$1);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}

	const { Duplex } = stream$1;

	/**
	 * Emits the `'close'` event on a stream.
	 *
	 * @param {Duplex} stream The stream.
	 * @private
	 */
	function emitClose(stream) {
	  stream.emit('close');
	}

	/**
	 * The listener of the `'end'` event.
	 *
	 * @private
	 */
	function duplexOnEnd() {
	  if (!this.destroyed && this._writableState.finished) {
	    this.destroy();
	  }
	}

	/**
	 * The listener of the `'error'` event.
	 *
	 * @param {Error} err The error
	 * @private
	 */
	function duplexOnError(err) {
	  this.removeListener('error', duplexOnError);
	  this.destroy();
	  if (this.listenerCount('error') === 0) {
	    // Do not suppress the throwing behavior.
	    this.emit('error', err);
	  }
	}

	/**
	 * Wraps a `WebSocket` in a duplex stream.
	 *
	 * @param {WebSocket} ws The `WebSocket` to wrap
	 * @param {Object} [options] The options for the `Duplex` constructor
	 * @return {Duplex} The duplex stream
	 * @public
	 */
	function createWebSocketStream(ws, options) {
	  let resumeOnReceiverDrain = true;
	  let terminateOnDestroy = true;

	  function receiverOnDrain() {
	    if (resumeOnReceiverDrain) ws._socket.resume();
	  }

	  if (ws.readyState === ws.CONNECTING) {
	    ws.once('open', function open() {
	      ws._receiver.removeAllListeners('drain');
	      ws._receiver.on('drain', receiverOnDrain);
	    });
	  } else {
	    ws._receiver.removeAllListeners('drain');
	    ws._receiver.on('drain', receiverOnDrain);
	  }

	  const duplex = new Duplex({
	    ...options,
	    autoDestroy: false,
	    emitClose: false,
	    objectMode: false,
	    writableObjectMode: false
	  });

	  ws.on('message', function message(msg) {
	    if (!duplex.push(msg)) {
	      resumeOnReceiverDrain = false;
	      ws._socket.pause();
	    }
	  });

	  ws.once('error', function error(err) {
	    if (duplex.destroyed) return;

	    // Prevent `ws.terminate()` from being called by `duplex._destroy()`.
	    //
	    // - If the `'error'` event is emitted before the `'open'` event, then
	    //   `ws.terminate()` is a noop as no socket is assigned.
	    // - Otherwise, the error is re-emitted by the listener of the `'error'`
	    //   event of the `Receiver` object. The listener already closes the
	    //   connection by calling `ws.close()`. This allows a close frame to be
	    //   sent to the other peer. If `ws.terminate()` is called right after this,
	    //   then the close frame might not be sent.
	    terminateOnDestroy = false;
	    duplex.destroy(err);
	  });

	  ws.once('close', function close() {
	    if (duplex.destroyed) return;

	    duplex.push(null);
	  });

	  duplex._destroy = function (err, callback) {
	    if (ws.readyState === ws.CLOSED) {
	      callback(err);
	      process.nextTick(emitClose, duplex);
	      return;
	    }

	    let called = false;

	    ws.once('error', function error(err) {
	      called = true;
	      callback(err);
	    });

	    ws.once('close', function close() {
	      if (!called) callback(err);
	      process.nextTick(emitClose, duplex);
	    });

	    if (terminateOnDestroy) ws.terminate();
	  };

	  duplex._final = function (callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._final(callback);
	      });
	      return;
	    }

	    // If the value of the `_socket` property is `null` it means that `ws` is a
	    // client websocket and the handshake failed. In fact, when this happens, a
	    // socket is never assigned to the websocket. Wait for the `'error'` event
	    // that will be emitted by the websocket.
	    if (ws._socket === null) return;

	    if (ws._socket._writableState.finished) {
	      callback();
	      if (duplex._readableState.endEmitted) duplex.destroy();
	    } else {
	      ws._socket.once('finish', function finish() {
	        // `duplex` is not destroyed here because the `'end'` event will be
	        // emitted on `duplex` after this `'finish'` event. The EOF signaling
	        // `null` chunk is, in fact, pushed when the websocket emits `'close'`.
	        callback();
	      });
	      ws.close();
	    }
	  };

	  duplex._read = function () {
	    if (
	      (ws.readyState === ws.OPEN || ws.readyState === ws.CLOSING) &&
	      !resumeOnReceiverDrain
	    ) {
	      resumeOnReceiverDrain = true;
	      if (!ws._receiver._writableState.needDrain) ws._socket.resume();
	    }
	  };

	  duplex._write = function (chunk, encoding, callback) {
	    if (ws.readyState === ws.CONNECTING) {
	      ws.once('open', function open() {
	        duplex._write(chunk, encoding, callback);
	      });
	      return;
	    }

	    ws.send(chunk, callback);
	  };

	  duplex.on('end', duplexOnEnd);
	  duplex.on('error', duplexOnError);
	  return duplex;
	}

	var stream = createWebSocketStream;

	const { createHash: createHash$1 } = crypto$1;



	const { format: format$2, parse: parse$2 } = extension;
	const { GUID: GUID$1, kWebSocket: kWebSocket$2 } = constants;

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends events {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      maxPayload: 100 * 1024 * 1024,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) this.clients = new Set();
	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Close the server.
	   *
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(cb) {
	    if (cb) this.once('close', cb);

	    if (this._state === CLOSED) {
	      process.nextTick(emitClose$1, this);
	      return;
	    }

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    //
	    // Terminate all associated clients.
	    //
	    if (this.clients) {
	      for (const client of this.clients) client.terminate();
	    }

	    const server = this._server;

	    if (server) {
	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // Close the http server if it was internally created.
	      //
	      if (this.options.port != null) {
	        server.close(emitClose$1.bind(undefined, this));
	        return;
	      }
	    }

	    process.nextTick(emitClose$1, this);
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError$1);

	    const key =
	      req.headers['sec-websocket-key'] !== undefined
	        ? req.headers['sec-websocket-key'].trim()
	        : false;
	    const version = +req.headers['sec-websocket-version'];
	    const extensions = {};

	    if (
	      req.method !== 'GET' ||
	      req.headers.upgrade.toLowerCase() !== 'websocket' ||
	      !key ||
	      !keyRegex.test(key) ||
	      (version !== 8 && version !== 13) ||
	      !this.shouldHandle(req)
	    ) {
	      return abortHandshake$1(socket, 400);
	    }

	    if (this.options.perMessageDeflate) {
	      const perMessageDeflate = new permessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = parse$2(req.headers['sec-websocket-extensions']);

	        if (offers[permessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[permessageDeflate.extensionName]);
	          extensions[permessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        return abortHandshake$1(socket, 400);
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake$1(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(key, extensions, req, socket, head, cb);
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake$1(socket, 401);
	    }

	    this.completeUpgrade(key, extensions, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Object} extensions The accepted extensions
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(key, extensions, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket$2]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake$1(socket, 503);

	    const digest = createHash$1('sha1')
	      .update(key + GUID$1)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new websocket(null);
	    let protocol = req.headers['sec-websocket-protocol'];

	    if (protocol) {
	      protocol = protocol.split(',').map(trim);

	      //
	      // Optionally call external protocol selection handler.
	      //
	      if (this.options.handleProtocols) {
	        protocol = this.options.handleProtocols(protocol, req);
	      } else {
	        protocol = protocol[0];
	      }

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[permessageDeflate.extensionName]) {
	      const params = extensions[permessageDeflate.extensionName].params;
	      const value = format$2({
	        [permessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError$1);

	    ws.setSocket(socket, head, this.options.maxPayload);

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => this.clients.delete(ws));
	    }

	    cb(ws, req);
	  }
	}

	var websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose$1(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle premature socket errors.
	 *
	 * @private
	 */
	function socketOnError$1() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake$1(socket, code, message, headers) {
	  if (socket.writable) {
	    message = message || http.STATUS_CODES[code];
	    headers = {
	      Connection: 'close',
	      'Content-Type': 'text/html',
	      'Content-Length': Buffer.byteLength(message),
	      ...headers
	    };

	    socket.write(
	      `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	        Object.keys(headers)
	          .map((h) => `${h}: ${headers[h]}`)
	          .join('\r\n') +
	        '\r\n\r\n' +
	        message
	    );
	  }

	  socket.removeListener('error', socketOnError$1);
	  socket.destroy();
	}

	/**
	 * Remove whitespace characters from both ends of a string.
	 *
	 * @param {String} str The string
	 * @return {String} A new string representing `str` stripped of whitespace
	 *     characters from both its beginning and end
	 * @private
	 */
	function trim(str) {
	  return str.trim();
	}

	websocket.createWebSocketStream = stream;
	websocket.Server = websocketServer;
	websocket.Receiver = receiver;
	websocket.Sender = sender;

	var ws = websocket;

	/*
		An Ad-Hoc Mesh-Network Daisy-Chain
		should work even if humans are
		communicating with each other blind.

		To prevent infinite broadcast loops,
		we use a deduplication process
		based on the message's identifier.
		This is currently implemented in core.

		However, because this still creates a
		N*2 (where N is the number of connections)
		flood, it is not scalable for traditional
		services that have a hub network topology.

		Does this mean we have to abandon mesh
		algorithms? No, we can simply layer more
		efficient optimizations in based on constraints.
		If these constraints exist, it automatically
		upgrades, but if not, it falls back to the
		brute-force mesh based robust algorithm.
		A simple example is to limit peer connections
		and rely upon daisy chaining to relay messages.

		Another example, is if peers are willing to
		identify themselves, then we can improve the
		efficiency of the network by having each peer
		include the names of peers it is connected in
		each message. Then each subsequent peer will
		not relay it to them, since it is unnecessary.
		This should create N (where N is the number of
		peers) messages (or possibly N+ if there is a
		common peer of uncommon peers that receives it
		and relays at exact latency timings), which is
		optimal.

		Since computer networks aren't actually blind,
		we will implement the above method to improve
		the performance of the ad-hoc mesh network.

		But why not have every message contain the
		whole history of peers that it relayed through?
		Because in sufficiently large enough networks,
		with extensive daisy chaining, this will cause
		the message to become prohibitively slow and
		increase indefinitely in size.

	*/

	gun.on('opt', function(root){
		var opt = root.opt;
		if(false === opt.ws || opt.once){
			this.to.next(root);
			return;
		}	
		opt.mesh = opt.mesh || gun.Mesh(root);
		opt.WebSocket = opt.WebSocket || ws;
		var ws$1 = opt.ws = opt.ws || {};
		ws$1.path = ws$1.path || '/gun';
		// if we DO need an HTTP server, then choose ws specific one or GUN default one.
		if(!ws$1.noServer){
			ws$1.server = ws$1.server || opt.web;
			if(!ws$1.server){ this.to.next(root); return } // ugh, bug fix for @jamierez & unstoppable ryan.
		}
		ws$1.web = ws$1.web || new opt.WebSocket.Server(ws$1); // we still need a WS server.
		ws$1.web.on('connection', function(wire, req){ var peer;
			wire.headers = wire.headers || (req||'').headers || '';
			console.STAT && ((console.STAT.sites || (console.STAT.sites = {}))[wire.headers.origin] = 1);
			opt.mesh.hi(peer = {wire: wire});
			wire.on('message', function(msg){
				opt.mesh.hear(msg.data || msg, peer);
			});
			wire.on('close', function(){
				opt.mesh.bye(peer);
			});
			wire.on('error', function(e){});
			setTimeout(function heart(){ if(!opt.peers[peer.id]){ return } try{ wire.send("[]"); }catch(e){}setTimeout(heart, 1000 * 20); }, 1000 * 20); // Some systems, like Heroku, require heartbeats to not time out. // TODO: Make this configurable? // TODO: PERF: Find better approach than try/timeouts?
		});
		this.to.next(root);
	});

	var sea = createCommonjsModule(function (module) {
	(function(){

	  var window = this || self || window;

	  /* UNBUILD */
	  function USE(arg, req){
	    return req? commonjsRequire() : arg.slice? USE[R(arg)] : function(mod, path){
	      arg(mod = {exports: {}});
	      USE[R(path)] = mod.exports;
	    }
	    function R(p){
	      return p.split('/').slice(-1).toString().replace('.js','');
	    }
	  }
	  { var MODULE = module; }
	USE(function(module){
	    // Security, Encryption, and Authorization: SEA.js
	    // MANDATORY READING: https://gun.eco/explainers/data/security.html
	    // IT IS IMPLEMENTED IN A POLYFILL/SHIM APPROACH.
	    // THIS IS AN EARLY ALPHA!

	    if(typeof window !== "undefined"){ module.window = window; }

	    var tmp = module.window || module, u;
	    var SEA = tmp.SEA || {};

	    if(SEA.window = module.window){ SEA.window.SEA = SEA; }

	    try{ if(u+'' !== typeof MODULE){ MODULE.exports = SEA; } }catch(e){}
	    module.exports = SEA;
	  })(USE, './root');
	USE(function(module){
	    var SEA = USE('./root');
	    try{ if(SEA.window){
	      if(location.protocol.indexOf('s') < 0
	      && location.host.indexOf('localhost') < 0
	      && ! /^127\.\d+\.\d+\.\d+$/.test(location.hostname)
	      && location.protocol.indexOf('file:') < 0){
	        console.warn('HTTPS needed for WebCrypto in SEA, redirecting...');
	        location.protocol = 'https:'; // WebCrypto does NOT work without HTTPS!
	      }
	    } }catch(e){}
	  })(USE, './https');
	USE(function(module){
	    var u;
	    if(u+''== typeof btoa){
	      if(u+'' == typeof Buffer){
	        try{ commonjsGlobal.Buffer = USE("buffer", 1).Buffer; }catch(e){ console.log("Please `npm install buffer` or add it to your package.json !"); }
	      }
	      commonjsGlobal.btoa = function(data){ return Buffer.from(data, "binary").toString("base64") };
	      commonjsGlobal.atob = function(data){ return Buffer.from(data, "base64").toString("binary") };
	    }
	  })(USE, './base64');
	USE(function(module){
	    USE('./base64');
	    // This is Array extended to have .toString(['utf8'|'hex'|'base64'])
	    function SeaArray() {}
	    Object.assign(SeaArray, { from: Array.from });
	    SeaArray.prototype = Object.create(Array.prototype);
	    SeaArray.prototype.toString = function(enc, start, end) { enc = enc || 'utf8'; start = start || 0;
	      const length = this.length;
	      if (enc === 'hex') {
	        const buf = new Uint8Array(this);
	        return [ ...Array(((end && (end + 1)) || length) - start).keys()]
	        .map((i) => buf[ i + start ].toString(16).padStart(2, '0')).join('')
	      }
	      if (enc === 'utf8') {
	        return Array.from(
	          { length: (end || length) - start },
	          (_, i) => String.fromCharCode(this[ i + start])
	        ).join('')
	      }
	      if (enc === 'base64') {
	        return btoa(this)
	      }
	    };
	    module.exports = SeaArray;
	  })(USE, './array');
	USE(function(module){
	    USE('./base64');
	    // This is Buffer implementation used in SEA. Functionality is mostly
	    // compatible with NodeJS 'safe-buffer' and is used for encoding conversions
	    // between binary and 'hex' | 'utf8' | 'base64'
	    // See documentation and validation for safe implementation in:
	    // https://github.com/feross/safe-buffer#update
	    var SeaArray = USE('./array');
	    function SafeBuffer(...props) {
	      console.warn('new SafeBuffer() is depreciated, please use SafeBuffer.from()');
	      return SafeBuffer.from(...props)
	    }
	    SafeBuffer.prototype = Object.create(Array.prototype);
	    Object.assign(SafeBuffer, {
	      // (data, enc) where typeof data === 'string' then enc === 'utf8'|'hex'|'base64'
	      from() {
	        if (!Object.keys(arguments).length || arguments[0]==null) {
	          throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	        }
	        const input = arguments[0];
	        let buf;
	        if (typeof input === 'string') {
	          const enc = arguments[1] || 'utf8';
	          if (enc === 'hex') {
	            const bytes = input.match(/([\da-fA-F]{2})/g)
	            .map((byte) => parseInt(byte, 16));
	            if (!bytes || !bytes.length) {
	              throw new TypeError('Invalid first argument for type \'hex\'.')
	            }
	            buf = SeaArray.from(bytes);
	          } else if (enc === 'utf8' || 'binary' === enc) { // EDIT BY MARK: I think this is safe, tested it against a couple "binary" strings. This lets SafeBuffer match NodeJS Buffer behavior more where it safely btoas regular strings.
	            const length = input.length;
	            const words = new Uint16Array(length);
	            buf = SeaArray.from(words);
	          } else if (enc === 'base64') {
	            const dec = atob(input);
	            const length = dec.length;
	            const bytes = new Uint8Array(length);
	            buf = SeaArray.from(bytes);
	          } else if (enc === 'binary') { // deprecated by above comment
	            buf = SeaArray.from(input); // some btoas were mishandled.
	          } else {
	            console.info('SafeBuffer.from unknown encoding: '+enc);
	          }
	          return buf
	        }
	        const length = input.byteLength ? input.byteLength : input.length;
	        if (length) {
	          let buf;
	          if (input instanceof ArrayBuffer) {
	            buf = new Uint8Array(input);
	          }
	          return SeaArray.from(buf || input)
	        }
	      },
	      // This is 'safe-buffer.alloc' sans encoding support
	      alloc(length, fill = 0 /*, enc*/ ) {
	        return SeaArray.from(new Uint8Array(Array.from({ length: length }, () => fill)))
	      },
	      // This is normal UNSAFE 'buffer.alloc' or 'new Buffer(length)' - don't use!
	      allocUnsafe(length) {
	        return SeaArray.from(new Uint8Array(Array.from({ length : length })))
	      },
	      // This puts together array of array like members
	      concat(arr) { // octet array
	        if (!Array.isArray(arr)) {
	          throw new TypeError('First argument must be Array containing ArrayBuffer or Uint8Array instances.')
	        }
	        return SeaArray.from(arr.reduce((ret, item) => ret.concat(Array.from(item)), []))
	      }
	    });
	    SafeBuffer.prototype.from = SafeBuffer.from;
	    SafeBuffer.prototype.toString = SeaArray.prototype.toString;

	    module.exports = SafeBuffer;
	  })(USE, './buffer');
	USE(function(module){
	    const SEA = USE('./root');
	    const api = {Buffer: USE('./buffer')};
	    var o = {}, u;

	    // ideally we can move away from JSON entirely? unlikely due to compatibility issues... oh well.
	    JSON.parseAsync = JSON.parseAsync || function(t,cb,r){ var u; try{ cb(u, JSON.parse(t,r)); }catch(e){ cb(e); } };
	    JSON.stringifyAsync = JSON.stringifyAsync || function(v,cb,r,s){ var u; try{ cb(u, JSON.stringify(v,r,s)); }catch(e){ cb(e); } };

	    api.parse = function(t,r){ return new Promise(function(res, rej){
	      JSON.parseAsync(t,function(err, raw){ err? rej(err) : res(raw); },r);
	    })};
	    api.stringify = function(v,r,s){ return new Promise(function(res, rej){
	      JSON.stringifyAsync(v,function(err, raw){ err? rej(err) : res(raw); },r,s);
	    })};

	    if(SEA.window){
	      api.crypto = window.crypto || window.msCrypto;
	      api.subtle = (api.crypto||o).subtle || (api.crypto||o).webkitSubtle;
	      api.TextEncoder = window.TextEncoder;
	      api.TextDecoder = window.TextDecoder;
	      api.random = (len) => api.Buffer.from(api.crypto.getRandomValues(new Uint8Array(api.Buffer.alloc(len))));
	    }
	    if(!api.TextDecoder)
	    {
	      const { TextEncoder, TextDecoder } = USE((u+'' == typeof MODULE?'.':'')+'./lib/text-encoding', 1);
	      api.TextDecoder = TextDecoder;
	      api.TextEncoder = TextEncoder;
	    }
	    if(!api.crypto)
	    {
	      try
	      {
	      var crypto = USE('crypto', 1);
	      Object.assign(api, {
	        crypto,
	        random: (len) => api.Buffer.from(crypto.randomBytes(len))
	      });      
	      const { Crypto: WebCrypto } = USE('@peculiar/webcrypto', 1);
	      api.ossl = api.subtle = new WebCrypto({directory: 'ossl'}).subtle; // ECDH
	    }
	    catch(e){
	      console.log("Please `npm install @peculiar/webcrypto` or add it to your package.json !");
	    }}

	    module.exports = api;
	  })(USE, './shim');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var s = {};
	    s.pbkdf2 = {hash: {name : 'SHA-256'}, iter: 100000, ks: 64};
	    s.ecdsa = {
	      pair: {name: 'ECDSA', namedCurve: 'P-256'},
	      sign: {name: 'ECDSA', hash: {name: 'SHA-256'}}
	    };
	    s.ecdh = {name: 'ECDH', namedCurve: 'P-256'};

	    // This creates Web Cryptography API compliant JWK for sign/verify purposes
	    s.jwk = function(pub, d){  // d === priv
	      pub = pub.split('.');
	      var x = pub[0], y = pub[1];
	      var jwk = {kty: "EC", crv: "P-256", x: x, y: y, ext: true};
	      jwk.key_ops = d ? ['sign'] : ['verify'];
	      if(d){ jwk.d = d; }
	      return jwk;
	    };
	    
	    s.keyToJwk = function(keyBytes) {
	      const keyB64 = keyBytes.toString('base64');
	      const k = keyB64.replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
	      return { kty: 'oct', k: k, ext: false, alg: 'A256GCM' };
	    };

	    s.recall = {
	      validity: 12 * 60 * 60, // internally in seconds : 12 hours
	      hook: function(props){ return props } // { iat, exp, alias, remember } // or return new Promise((resolve, reject) => resolve(props)
	    };

	    s.check = function(t){ return (typeof t == 'string') && ('SEA{' === t.slice(0,4)) };
	    s.parse = async function p(t){ try {
	      var yes = (typeof t == 'string');
	      if(yes && 'SEA{' === t.slice(0,4)){ t = t.slice(3); }
	      return yes ? await shim.parse(t) : t;
	      } catch (e) {}
	      return t;
	    };

	    SEA.opt = s;
	    module.exports = s;
	  })(USE, './settings');
	USE(function(module){
	    var shim = USE('./shim');
	    module.exports = async function(d, o){
	      var t = (typeof d == 'string')? d : await shim.stringify(d);
	      var hash = await shim.subtle.digest({name: o||'SHA-256'}, new shim.TextEncoder().encode(t));
	      return shim.Buffer.from(hash);
	    };
	  })(USE, './sha256');
	USE(function(module){
	    // This internal func returns SHA-1 hashed data for KeyID generation
	    const __shim = USE('./shim');
	    const subtle = __shim.subtle;
	    const ossl = __shim.ossl ? __shim.ossl : subtle;
	    const sha1hash = (b) => ossl.digest({name: 'SHA-1'}, new ArrayBuffer(b));
	    module.exports = sha1hash;
	  })(USE, './sha1');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var sha = USE('./sha256');
	    var u;

	    SEA.work = SEA.work || (async (data, pair, cb, opt) => { try { // used to be named `proof`
	      var salt = (pair||{}).epub || pair; // epub not recommended, salt should be random!
	      opt = opt || {};
	      if(salt instanceof Function){
	        cb = salt;
	        salt = u;
	      }
	      data = (typeof data == 'string')? data : await shim.stringify(data);
	      if('sha' === (opt.name||'').toLowerCase().slice(0,3)){
	        var rsha = shim.Buffer.from(await sha(data, opt.name), 'binary').toString(opt.encode || 'base64');
	        if(cb){ try{ cb(rsha); }catch(e){console.log(e);} }
	        return rsha;
	      }
	      salt = salt || shim.random(9);
	      var key = await (shim.ossl || shim.subtle).importKey('raw', new shim.TextEncoder().encode(data), {name: opt.name || 'PBKDF2'}, false, ['deriveBits']);
	      var work = await (shim.ossl || shim.subtle).deriveBits({
	        name: opt.name || 'PBKDF2',
	        iterations: opt.iterations || S.pbkdf2.iter,
	        salt: new shim.TextEncoder().encode(opt.salt || salt),
	        hash: opt.hash || S.pbkdf2.hash,
	      }, key, opt.length || (S.pbkdf2.ks * 8));
	      data = shim.random(data.length);  // Erase data in case of passphrase
	      var r = shim.Buffer.from(work, 'binary').toString(opt.encode || 'base64');
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) { 
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.work;
	  })(USE, './work');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');

	    SEA.name = SEA.name || (async (cb, opt) => { try {
	      if(cb){ try{ cb(); }catch(e){console.log(e);} }
	      return;
	    } catch(e) {
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    //SEA.pair = async (data, proof, cb) => { try {
	    SEA.pair = SEA.pair || (async (cb, opt) => { try {

	      var ecdhSubtle = shim.ossl || shim.subtle;
	      // First: ECDSA keys for signing/verifying...
	      var sa = await shim.subtle.generateKey({name: 'ECDSA', namedCurve: 'P-256'}, true, [ 'sign', 'verify' ])
	      .then(async (keys) => {
	        // privateKey scope doesn't leak out from here!
	        //const { d: priv } = await shim.subtle.exportKey('jwk', keys.privateKey)
	        var key = {};
	        key.priv = (await shim.subtle.exportKey('jwk', keys.privateKey)).d;
	        var pub = await shim.subtle.exportKey('jwk', keys.publicKey);
	        //const pub = Buff.from([ x, y ].join(':')).toString('base64') // old
	        key.pub = pub.x+'.'+pub.y; // new
	        // x and y are already base64
	        // pub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
	        // but split on a non-base64 letter.
	        return key;
	      });
	      
	      // To include PGPv4 kind of keyId:
	      // const pubId = await SEA.keyid(keys.pub)
	      // Next: ECDH keys for encryption/decryption...

	      try{
	      var dh = await ecdhSubtle.generateKey({name: 'ECDH', namedCurve: 'P-256'}, true, ['deriveKey'])
	      .then(async (keys) => {
	        // privateKey scope doesn't leak out from here!
	        var key = {};
	        key.epriv = (await ecdhSubtle.exportKey('jwk', keys.privateKey)).d;
	        var pub = await ecdhSubtle.exportKey('jwk', keys.publicKey);
	        //const epub = Buff.from([ ex, ey ].join(':')).toString('base64') // old
	        key.epub = pub.x+'.'+pub.y; // new
	        // ex and ey are already base64
	        // epub is UTF8 but filename/URL safe (https://www.ietf.org/rfc/rfc3986.txt)
	        // but split on a non-base64 letter.
	        return key;
	      });
	      }catch(e){
	        if(SEA.window){ throw e }
	        if(e == 'Error: ECDH is not a supported algorithm'){ console.log('Ignoring ECDH...'); }
	        else { throw e }
	      } dh = dh || {};

	      var r = { pub: sa.pub, priv: sa.priv, /* pubId, */ epub: dh.epub, epriv: dh.epriv };
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) {
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.pair;
	  })(USE, './pair');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var sha = USE('./sha256');
	    var u;

	    SEA.sign = SEA.sign || (async (data, pair, cb, opt) => { try {
	      opt = opt || {};
	      if(!(pair||opt).priv){
	        if(!SEA.I){ throw 'No signing key.' }
	        pair = await SEA.I(null, {what: data, how: 'sign', why: opt.why});
	      }
	      if(u === data){ throw '`undefined` not allowed.' }
	      var json = await S.parse(data);
	      var check = opt.check = opt.check || json;
	      if(SEA.verify && (SEA.opt.check(check) || (check && check.s && check.m))
	      && u !== await SEA.verify(check, pair)){ // don't sign if we already signed it.
	        var r = await S.parse(check);
	        if(!opt.raw){ r = 'SEA' + await shim.stringify(r); }
	        if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	        return r;
	      }
	      var pub = pair.pub;
	      var priv = pair.priv;
	      var jwk = S.jwk(pub, priv);
	      var hash = await sha(json);
	      var sig = await (shim.ossl || shim.subtle).importKey('jwk', jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ['sign'])
	      .then((key) => (shim.ossl || shim.subtle).sign({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, new Uint8Array(hash))); // privateKey scope doesn't leak out from here!
	      var r = {m: json, s: shim.Buffer.from(sig, 'binary').toString(opt.encode || 'base64')};
	      if(!opt.raw){ r = 'SEA' + await shim.stringify(r); }

	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) {
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.sign;
	  })(USE, './sign');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var sha = USE('./sha256');
	    var u;

	    SEA.verify = SEA.verify || (async (data, pair, cb, opt) => { try {
	      var json = await S.parse(data);
	      if(false === pair){ // don't verify!
	        var raw = await S.parse(json.m);
	        if(cb){ try{ cb(raw); }catch(e){console.log(e);} }
	        return raw;
	      }
	      opt = opt || {};
	      // SEA.I // verify is free! Requires no user permission.
	      var pub = pair.pub || pair;
	      var key = SEA.opt.slow_leak? await SEA.opt.slow_leak(pub) : await (shim.ossl || shim.subtle).importKey('jwk', S.jwk(pub), {name: 'ECDSA', namedCurve: 'P-256'}, false, ['verify']);
	      var hash = await sha(json.m);
	      var buf, sig, check, tmp; try{
	        buf = shim.Buffer.from(json.s, opt.encode || 'base64'); // NEW DEFAULT!
	        sig = new Uint8Array(buf);
	        check = await (shim.ossl || shim.subtle).verify({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, sig, new Uint8Array(hash));
	        if(!check){ throw "Signature did not match." }
	      }catch(e){
	        if(SEA.opt.fallback){
	          return await SEA.opt.fall_verify(data, pair, cb, opt);
	        }
	      }
	      var r = check? await S.parse(json.m) : u;

	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) {
	      console.log(e); // mismatched owner FOR MARTTI
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.verify;
	    // legacy & ossl memory leak mitigation:

	    var knownKeys = {};
	    var keyForPair = SEA.opt.slow_leak = pair => {
	      if (knownKeys[pair]) return knownKeys[pair];
	      var jwk = S.jwk(pair);
	      knownKeys[pair] = (shim.ossl || shim.subtle).importKey("jwk", jwk, {name: 'ECDSA', namedCurve: 'P-256'}, false, ["verify"]);
	      return knownKeys[pair];
	    };

	    var O = SEA.opt;
	    SEA.opt.fall_verify = async function(data, pair, cb, opt, f){
	      if(f === SEA.opt.fallback){ throw "Signature did not match" } f = f || 1;
	      var tmp = data||'';
	      data = SEA.opt.unpack(data) || data;
	      var json = await S.parse(data), pub = pair.pub || pair, key = await SEA.opt.slow_leak(pub);
	      var hash = (f <= SEA.opt.fallback)? shim.Buffer.from(await shim.subtle.digest({name: 'SHA-256'}, new shim.TextEncoder().encode(await S.parse(json.m)))) : await sha(json.m); // this line is old bad buggy code but necessary for old compatibility.
	      var buf; var sig; var check; try{
	        buf = shim.Buffer.from(json.s, opt.encode || 'base64'); // NEW DEFAULT!
	        sig = new Uint8Array(buf);
	        check = await (shim.ossl || shim.subtle).verify({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, sig, new Uint8Array(hash));
	        if(!check){ throw "Signature did not match." }
	      }catch(e){ try{
	        buf = shim.Buffer.from(json.s, 'utf8'); // AUTO BACKWARD OLD UTF8 DATA!
	        sig = new Uint8Array(buf);
	        check = await (shim.ossl || shim.subtle).verify({name: 'ECDSA', hash: {name: 'SHA-256'}}, key, sig, new Uint8Array(hash));
	        }catch(e){
	        if(!check){ throw "Signature did not match." }
	        }
	      }
	      var r = check? await S.parse(json.m) : u;
	      O.fall_soul = tmp['#']; O.fall_key = tmp['.']; O.fall_val = data; O.fall_state = tmp['>'];
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    };
	    SEA.opt.fallback = 2;

	  })(USE, './verify');
	USE(function(module){
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var sha256hash = USE('./sha256');

	    const importGen = async (key, salt, opt) => {
	      const combo = key + (salt || shim.random(8)).toString('utf8'); // new
	      const hash = shim.Buffer.from(await sha256hash(combo), 'binary');
	      
	      const jwkKey = S.keyToJwk(hash);      
	      return await shim.subtle.importKey('jwk', jwkKey, {name:'AES-GCM'}, false, ['encrypt', 'decrypt'])
	    };
	    module.exports = importGen;
	  })(USE, './aeskey');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var aeskey = USE('./aeskey');
	    var u;

	    SEA.encrypt = SEA.encrypt || (async (data, pair, cb, opt) => { try {
	      opt = opt || {};
	      var key = (pair||opt).epriv || pair;
	      if(u === data){ throw '`undefined` not allowed.' }
	      if(!key){
	        if(!SEA.I){ throw 'No encryption key.' }
	        pair = await SEA.I(null, {what: data, how: 'encrypt', why: opt.why});
	        key = pair.epriv || pair;
	      }
	      var msg = (typeof data == 'string')? data : await shim.stringify(data);
	      var rand = {s: shim.random(9), iv: shim.random(15)}; // consider making this 9 and 15 or 18 or 12 to reduce == padding.
	      var ct = await aeskey(key, rand.s, opt).then((aes) => (/*shim.ossl ||*/ shim.subtle).encrypt({ // Keeping the AES key scope as private as possible...
	        name: opt.name || 'AES-GCM', iv: new Uint8Array(rand.iv)
	      }, aes, new shim.TextEncoder().encode(msg)));
	      var r = {
	        ct: shim.Buffer.from(ct, 'binary').toString(opt.encode || 'base64'),
	        iv: rand.iv.toString(opt.encode || 'base64'),
	        s: rand.s.toString(opt.encode || 'base64')
	      };
	      if(!opt.raw){ r = 'SEA' + await shim.stringify(r); }

	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) { 
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.encrypt;
	  })(USE, './encrypt');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    var aeskey = USE('./aeskey');

	    SEA.decrypt = SEA.decrypt || (async (data, pair, cb, opt) => { try {
	      opt = opt || {};
	      var key = (pair||opt).epriv || pair;
	      if(!key){
	        if(!SEA.I){ throw 'No decryption key.' }
	        pair = await SEA.I(null, {what: data, how: 'decrypt', why: opt.why});
	        key = pair.epriv || pair;
	      }
	      var json = await S.parse(data);
	      var buf, bufiv, bufct; try{
	        buf = shim.Buffer.from(json.s, opt.encode || 'base64');
	        bufiv = shim.Buffer.from(json.iv, opt.encode || 'base64');
	        bufct = shim.Buffer.from(json.ct, opt.encode || 'base64');
	        var ct = await aeskey(key, buf, opt).then((aes) => (/*shim.ossl ||*/ shim.subtle).decrypt({  // Keeping aesKey scope as private as possible...
	          name: opt.name || 'AES-GCM', iv: new Uint8Array(bufiv), tagLength: 128
	        }, aes, new Uint8Array(bufct)));
	      }catch(e){
	        if('utf8' === opt.encode){ throw "Could not decrypt" }
	        if(SEA.opt.fallback){
	          opt.encode = 'utf8';
	          return await SEA.decrypt(data, pair, cb, opt);
	        }
	      }
	      var r = await S.parse(new shim.TextDecoder('utf8').decode(ct));
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) { 
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.decrypt;
	  })(USE, './decrypt');
	USE(function(module){
	    var SEA = USE('./root');
	    var shim = USE('./shim');
	    var S = USE('./settings');
	    // Derive shared secret from other's pub and my epub/epriv 
	    SEA.secret = SEA.secret || (async (key, pair, cb, opt) => { try {
	      opt = opt || {};
	      if(!pair || !pair.epriv || !pair.epub){
	        if(!SEA.I){ throw 'No secret mix.' }
	        pair = await SEA.I(null, {what: key, how: 'secret', why: opt.why});
	      }
	      var pub = key.epub || key;
	      var epub = pair.epub;
	      var epriv = pair.epriv;
	      var ecdhSubtle = shim.ossl || shim.subtle;
	      var pubKeyData = keysToEcdhJwk(pub);
	      var props = Object.assign({ public: await ecdhSubtle.importKey(...pubKeyData, true, []) },{name: 'ECDH', namedCurve: 'P-256'}); // Thanks to @sirpy !
	      var privKeyData = keysToEcdhJwk(epub, epriv);
	      var derived = await ecdhSubtle.importKey(...privKeyData, false, ['deriveBits']).then(async (privKey) => {
	        // privateKey scope doesn't leak out from here!
	        var derivedBits = await ecdhSubtle.deriveBits(props, privKey, 256);
	        var rawBits = new Uint8Array(derivedBits);
	        var derivedKey = await ecdhSubtle.importKey('raw', rawBits,{ name: 'AES-GCM', length: 256 }, true, [ 'encrypt', 'decrypt' ]);
	        return ecdhSubtle.exportKey('jwk', derivedKey).then(({ k }) => k);
	      });
	      var r = derived;
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) {
	      console.log(e);
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    // can this be replaced with settings.jwk?
	    var keysToEcdhJwk = (pub, d) => { // d === priv
	      //var [ x, y ] = shim.Buffer.from(pub, 'base64').toString('utf8').split(':') // old
	      var [ x, y ] = pub.split('.'); // new
	      var jwk = d ? { d: d } : {};
	      return [  // Use with spread returned value...
	        'jwk',
	        Object.assign(
	          jwk,
	          { x: x, y: y, kty: 'EC', crv: 'P-256', ext: true }
	        ), // ??? refactor
	        {name: 'ECDH', namedCurve: 'P-256'}
	      ]
	    };

	    module.exports = SEA.secret;
	  })(USE, './secret');
	USE(function(module){
	    var SEA = USE('./root');
	    // This is to certify that a group of "certificants" can "put" anything at a group of matched "paths" to the certificate authority's graph
	    SEA.certify = SEA.certify || (async (certificants, policy = {}, authority, cb, opt = {}) => { try {
	      /*
	      The Certify Protocol was made out of love by a Vietnamese code enthusiast. Vietnamese people around the world deserve respect!
	      IMPORTANT: A Certificate is like a Signature. No one knows who (authority) created/signed a cert until you put it into their graph.
	      "certificants": '*' or a String (Bob.pub) || an Object that contains "pub" as a key || an array of [object || string]. These people will have the rights.
	      "policy": A string ('inbox'), or a RAD/LEX object {'*': 'inbox'}, or an Array of RAD/LEX objects or strings. RAD/LEX object can contain key "?" with indexOf("*") > -1 to force key equals certificant pub. This rule is used to check against soul+'/'+key using Gun.text.match or String.match.
	      "authority": Key pair or priv of the certificate authority.
	      "cb": A callback function after all things are done.
	      "opt": If opt.expiry (a timestamp) is set, SEA won't sync data after opt.expiry. If opt.block is set, SEA will look for block before syncing.
	      */
	      console.log('SEA.certify() is an early experimental community supported method that may change API behavior without warning in any future version.');

	      certificants = (() => {
	        var data = [];
	        if (certificants) {
	          if ((typeof certificants === 'string' || Array.isArray(certificants)) && certificants.indexOf('*') > -1) return '*'
	          if (typeof certificants === 'string') return certificants
	          if (Array.isArray(certificants)) {
	            if (certificants.length === 1 && certificants[0]) return typeof certificants[0] === 'object' && certificants[0].pub ? certificants[0].pub : typeof certificants[0] === 'string' ? certificants[0] : null
	            certificants.map(certificant => {
	              if (typeof certificant ==='string') data.push(certificant);
	              else if (typeof certificant === 'object' && certificant.pub) data.push(certificant.pub);
	            });
	          }

	          if (typeof certificants === 'object' && certificants.pub) return certificants.pub
	          return data.length > 0 ? data : null
	        }
	        return
	      })();

	      if (!certificants) return console.log("No certificant found.")

	      const expiry = opt.expiry && (typeof opt.expiry === 'number' || typeof opt.expiry === 'string') ? parseFloat(opt.expiry) : null;
	      const readPolicy = (policy || {}).read ? policy.read : null;
	      const writePolicy = (policy || {}).write ? policy.write : typeof policy === 'string' || Array.isArray(policy) || policy["+"] || policy["#"] || policy["."] || policy["="] || policy["*"] || policy[">"] || policy["<"] ? policy : null;
	      // The "blacklist" feature is now renamed to "block". Why ? BECAUSE BLACK LIVES MATTER!
	      // We can now use 3 keys: block, blacklist, ban
	      const block = (opt || {}).block || (opt || {}).blacklist || (opt || {}).ban || {};
	      const readBlock = block.read && (typeof block.read === 'string' || (block.read || {})['#']) ? block.read : null;
	      const writeBlock = typeof block === 'string' ? block : block.write && (typeof block.write === 'string' || block.write['#']) ? block.write : null;

	      if (!readPolicy && !writePolicy) return console.log("No policy found.")

	      // reserved keys: c, e, r, w, rb, wb
	      const data = JSON.stringify({
	        c: certificants,
	        ...(expiry ? {e: expiry} : {}), // inject expiry if possible
	        ...(readPolicy ? {r: readPolicy }  : {}), // "r" stands for read, which means read permission.
	        ...(writePolicy ? {w: writePolicy} : {}), // "w" stands for write, which means write permission.
	        ...(readBlock ? {rb: readBlock} : {}), // inject READ block if possible
	        ...(writeBlock ? {wb: writeBlock} : {}), // inject WRITE block if possible
	      });

	      const certificate = await SEA.sign(data, authority, null, {raw:1});

	      var r = certificate;
	      if(!opt.raw){ r = 'SEA'+JSON.stringify(r); }
	      if(cb){ try{ cb(r); }catch(e){console.log(e);} }
	      return r;
	    } catch(e) {
	      SEA.err = e;
	      if(SEA.throw){ throw e }
	      if(cb){ cb(); }
	      return;
	    }});

	    module.exports = SEA.certify;
	  })(USE, './certify');
	USE(function(module){
	    var shim = USE('./shim');
	    // Practical examples about usage found in tests.
	    var SEA = USE('./root');
	    SEA.work = USE('./work');
	    SEA.sign = USE('./sign');
	    SEA.verify = USE('./verify');
	    SEA.encrypt = USE('./encrypt');
	    SEA.decrypt = USE('./decrypt');
	    SEA.certify = USE('./certify');
	    //SEA.opt.aeskey = USE('./aeskey'); // not official! // this causes problems in latest WebCrypto.

	    SEA.random = SEA.random || shim.random;

	    // This is Buffer used in SEA and usable from Gun/SEA application also.
	    // For documentation see https://nodejs.org/api/buffer.html
	    SEA.Buffer = SEA.Buffer || USE('./buffer');

	    // These SEA functions support now ony Promises or
	    // async/await (compatible) code, use those like Promises.
	    //
	    // Creates a wrapper library around Web Crypto API
	    // for various AES, ECDSA, PBKDF2 functions we called above.
	    // Calculate public key KeyID aka PGPv4 (result: 8 bytes as hex string)
	    SEA.keyid = SEA.keyid || (async (pub) => {
	      try {
	        // base64('base64(x):base64(y)') => shim.Buffer(xy)
	        const pb = shim.Buffer.concat(
	          pub.replace(/-/g, '+').replace(/_/g, '/').split('.')
	          .map((t) => shim.Buffer.from(t, 'base64'))
	        );
	        // id is PGPv4 compliant raw key
	        const id = shim.Buffer.concat([
	          shim.Buffer.from([0x99, pb.length / 0x100, pb.length % 0x100]), pb
	        ]);
	        const sha1 = await sha1hash(id);
	        const hash = shim.Buffer.from(sha1, 'binary');
	        return hash.toString('hex', hash.length - 8)  // 16-bit ID as hex
	      } catch (e) {
	        console.log(e);
	        throw e
	      }
	    });
	    // all done!
	    // Obviously it is missing MANY necessary features. This is only an alpha release.
	    // Please experiment with it, audit what I've done so far, and complain about what needs to be added.
	    // SEA should be a full suite that is easy and seamless to use.
	    // Again, scroll naer the top, where I provide an EXAMPLE of how to create a user and sign in.
	    // Once logged in, the rest of the code you just read handled automatically signing/validating data.
	    // But all other behavior needs to be equally easy, like opinionated ways of
	    // Adding friends (trusted public keys), sending private messages, etc.
	    // Cheers! Tell me what you think.
	    ((SEA.window||{}).GUN||{}).SEA = SEA;

	    module.exports = SEA;
	    // -------------- END SEA MODULES --------------------
	    // -- BEGIN SEA+GUN MODULES: BUNDLED BY DEFAULT UNTIL OTHERS USE SEA ON OWN -------
	  })(USE, './sea');
	USE(function(module){
	    var SEA = USE('./sea'), Gun, u;
	    if(SEA.window){
	      Gun = SEA.window.GUN || {chain:{}};
	    } else {
	      Gun = USE((u+'' == typeof MODULE?'.':'')+'./gun', 1);
	    }
	    SEA.GUN = Gun;

	    function User(root){ 
	      this._ = {$: this};
	    }
	    User.prototype = (function(){ function F(){} F.prototype = Gun.chain; return new F() }()); // Object.create polyfill
	    User.prototype.constructor = User;

	    // let's extend the gun chain with a `user` function.
	    // only one user can be logged in at a time, per gun instance.
	    Gun.chain.user = function(pub){
	      var gun = this, root = gun.back(-1), user;
	      if(pub){
	        pub = SEA.opt.pub((pub._||'')['#']) || pub;
	        return root.get('~'+pub);
	      }
	      if(user = root.back('user')){ return user }
	      var root = (root._), at = root, uuid = at.opt.uuid || lex;
	      (at = (user = at.user = gun.chain(new User))._).opt = {};
	      at.opt.uuid = function(cb){
	        var id = uuid(), pub = root.user;
	        if(!pub || !(pub = pub.is) || !(pub = pub.pub)){ return id }
	        id = '~' + pub + '/' + id;
	        if(cb && cb.call){ cb(null, id); }
	        return id;
	      };
	      return user;
	    };
	    function lex(){ return Gun.state().toString(36).replace('.','') }
	    Gun.User = User;
	    User.GUN = Gun;
	    User.SEA = Gun.SEA = SEA;
	    module.exports = User;
	  })(USE, './user');
	USE(function(module){
	    var u, Gun = (''+u != typeof window)? (window.Gun||{chain:{}}) : USE((''+u === typeof MODULE?'.':'')+'./gun', 1);
	    Gun.chain.then = function(cb, opt){
	      var gun = this, p = (new Promise(function(res, rej){
	        gun.once(res, opt);
	      }));
	      return cb? p.then(cb) : p;
	    };
	  })(USE, './then');
	USE(function(module){
	    var User = USE('./user'), SEA = User.SEA, Gun = User.GUN, noop = function(){};

	    // Well first we have to actually create a user. That is what this function does.
	    User.prototype.create = function(...args){
	      var pair = typeof args[0] === 'object' && (args[0].pub || args[0].epub) ? args[0] : typeof args[1] === 'object' && (args[1].pub || args[1].epub) ? args[1] : null;
	      var alias = pair && (pair.pub || pair.epub) ? pair.pub : typeof args[0] === 'string' ? args[0] : null;
	      var pass = pair && (pair.pub || pair.epub) ? pair : alias && typeof args[1] === 'string' ? args[1] : null;
	      var cb = args.filter(arg => typeof arg === 'function')[0] || null; // cb now can stand anywhere, after alias/pass or pair
	      var opt = args && args.length > 1 && typeof args[args.length-1] === 'object' ? args[args.length-1] : {}; // opt is always the last parameter which typeof === 'object' and stands after cb
	      
	      var gun = this, cat = (gun._), root = gun.back(-1);
	      cb = cb || noop;
	      opt = opt || {};
	      if(false !== opt.check){
	        var err;
	        if(!alias){ err = "No user."; }
	        if((pass||'').length < 8){ err = "Password too short!"; }
	        if(err){
	          cb({err: Gun.log(err)});
	          return gun;
	        }
	      }
	      if(cat.ing){
	        (cb || noop)({err: Gun.log("User is already being created or authenticated!"), wait: true});
	        return gun;
	      }
	      cat.ing = true;
	      var act = {};
	      act.a = function(pubs){
	        act.pubs = pubs;
	        if(pubs && !opt.already){
	          // If we can enforce that a user name is already taken, it might be nice to try, but this is not guaranteed.
	          var ack = {err: Gun.log('User already created!')};
	          cat.ing = false;
	          (cb || noop)(ack);
	          gun.leave();
	          return;
	        }
	        act.salt = String.random(64); // pseudo-randomly create a salt, then use PBKDF2 function to extend the password with it.
	        SEA.work(pass, act.salt, act.b); // this will take some short amount of time to produce a proof, which slows brute force attacks.
	      };
	      act.b = function(proof){
	        act.proof = proof;
	        pair ? act.c(pair) : SEA.pair(act.c); // generate a brand new key pair or use the existing.
	      };
	      act.c = function(pair){
	        var tmp;
	        act.pair = pair || {};
	        if(tmp = cat.root.user){
	          tmp._.sea = pair;
	          tmp.is = {pub: pair.pub, epub: pair.epub, alias: alias};
	        }
	        // the user's public key doesn't need to be signed. But everything else needs to be signed with it! // we have now automated it! clean up these extra steps now!
	        act.data = {pub: pair.pub};
	        act.d();
	      };
	      act.d = function(){
	        act.data.alias = alias;
	        act.e();
	      };
	      act.e = function(){
	        act.data.epub = act.pair.epub; 
	        SEA.encrypt({priv: act.pair.priv, epriv: act.pair.epriv}, act.proof, act.f, {raw:1}); // to keep the private key safe, we AES encrypt it with the proof of work!
	      };
	      act.f = function(auth){
	        act.data.auth = JSON.stringify({ek: auth, s: act.salt}); 
	        act.g(act.data.auth);
	      };
	      act.g = function(auth){ var tmp;
	        act.data.auth = act.data.auth || auth;
	        root.get(tmp = '~'+act.pair.pub).put(act.data).on(act.h); // awesome, now we can actually save the user with their public key as their ID.
	        var link = {}; link[tmp] = {'#': tmp}; root.get('~@'+alias).put(link).get(tmp).on(act.i); // next up, we want to associate the alias with the public key. So we add it to the alias list.
	      };
	      act.h = function(data, key, msg, eve){
	        eve.off(); act.h.ok = 1; act.i();
	      };
	      act.i = function(data, key, msg, eve){
	        if(eve){ act.i.ok = 1; eve.off(); }
	        if(!act.h.ok || !act.i.ok){ return }
	        cat.ing = false;
	        cb({ok: 0, pub: act.pair.pub}); // callback that the user has been created. (Note: ok = 0 because we didn't wait for disk to ack)
	        if(noop === cb){ pair ? gun.auth(pair) : gun.auth(alias, pass); } // if no callback is passed, auto-login after signing up.
	      };
	      root.get('~@'+alias).once(act.a);
	      return gun;
	    };
	    User.prototype.leave = function(opt, cb){
	      var gun = this, user = (gun.back(-1)._).user;
	      if(user){
	        delete user.is;
	        delete user._.is;
	        delete user._.sea;
	      }
	      if(SEA.window){
	        try{var sS = {};
	        sS = window.sessionStorage;
	        delete sS.recall;
	        delete sS.pair;
	        }catch(e){}      }
	      return gun;
	    };
	  })(USE, './create');
	USE(function(module){
	    var User = USE('./user'), SEA = User.SEA, Gun = User.GUN, noop = function(){};
	    // now that we have created a user, we want to authenticate them!
	    User.prototype.auth = function(...args){ // TODO: this PR with arguments need to be cleaned up / refactored.
	      var pair = typeof args[0] === 'object' && (args[0].pub || args[0].epub) ? args[0] : typeof args[1] === 'object' && (args[1].pub || args[1].epub) ? args[1] : null;
	      var alias = !pair && typeof args[0] === 'string' ? args[0] : null;
	      var pass = (alias || (pair && !(pair.priv && pair.epriv))) && typeof args[1] === 'string' ? args[1] : null;
	      var cb = args.filter(arg => typeof arg === 'function')[0] || null; // cb now can stand anywhere, after alias/pass or pair
	      var opt = args && args.length > 1 && typeof args[args.length-1] === 'object' ? args[args.length-1] : {}; // opt is always the last parameter which typeof === 'object' and stands after cb
	      
	      var gun = this, cat = (gun._), root = gun.back(-1);
	      
	      if(cat.ing){
	        (cb || noop)({err: Gun.log("User is already being created or authenticated!"), wait: true});
	        return gun;
	      }
	      cat.ing = true;
	      
	      var act = {}, u, tries = 9;
	      act.a = function(data){
	        if(!data){ return act.b() }
	        if(!data.pub){
	          var tmp = []; Object.keys(data).forEach(function(k){ if('_'==k){ return } tmp.push(data[k]); });
	          return act.b(tmp);
	        }
	        if(act.name){ return act.f(data) }
	        act.c((act.data = data).auth);
	      };
	      act.b = function(list){
	        var get = (act.list = (act.list||[]).concat(list||[])).shift();
	        if(u === get){
	          if(act.name){ return act.err('Your user account is not published for dApps to access, please consider syncing it online, or allowing local access by adding your device as a peer.') }
	          if(alias && tries--){
	            root.get('~@'+alias).once(act.a);
	            return;
	          }
	          return act.err('Wrong user or password.') 
	        }
	        root.get(get).once(act.a);
	      };
	      act.c = function(auth){
	        if(u === auth){ return act.b() }
	        if('string' == typeof auth){ return act.c(obj_ify(auth)) } // in case of legacy
	        SEA.work(pass, (act.auth = auth).s, act.d, act.enc); // the proof of work is evidence that we've spent some time/effort trying to log in, this slows brute force.
	      };
	      act.d = function(proof){
	        SEA.decrypt(act.auth.ek, proof, act.e, act.enc);
	      };
	      act.e = function(half){
	        if(u === half){
	          if(!act.enc){ // try old format
	            act.enc = {encode: 'utf8'};
	            return act.c(act.auth);
	          } act.enc = null; // end backwards
	          return act.b();
	        }
	        act.half = half;
	        act.f(act.data);
	      };
	      act.f = function(pair){
	        var half = act.half || {}, data = act.data || {};
	        act.g(act.lol = {pub: pair.pub || data.pub, epub: pair.epub || data.epub, priv: pair.priv || half.priv, epriv: pair.epriv || half.epriv});
	      };
	      act.g = function(pair){
	        if(!pair || !pair.pub || !pair.epub){ return act.b() }
	        act.pair = pair;
	        var user = (root._).user, at = (user._);
	        var upt = at.opt;
	        at = user._ = root.get('~'+pair.pub)._;
	        at.opt = upt;
	        // add our credentials in-memory only to our root user instance
	        user.is = {pub: pair.pub, epub: pair.epub, alias: alias || pair.pub};
	        at.sea = act.pair;
	        cat.ing = false;
	        try{if(pass && u == (obj_ify(cat.root.graph['~'+pair.pub].auth)||'')[':']){ opt.shuffle = opt.change = pass; } }catch(e){} // migrate UTF8 & Shuffle!
	        opt.change? act.z() : (cb || noop)(at);
	        if(SEA.window && ((gun.back('user')._).opt||opt).remember){
	          // TODO: this needs to be modular.
	          try{var sS = {};
	          sS = window.sessionStorage; // TODO: FIX BUG putting on `.is`!
	          sS.recall = true;
	          sS.pair = JSON.stringify(pair); // auth using pair is more reliable than alias/pass
	          }catch(e){}
	        }
	        try{
	          if(root._.tag.auth){ // auth handle might not be registered yet
	          (root._).on('auth', at); // TODO: Deprecate this, emit on user instead! Update docs when you do.
	          } else { setTimeout(function(){ (root._).on('auth', at); },1); } // if not, hackily add a timeout.
	          //at.on('auth', at) // Arrgh, this doesn't work without event "merge" code, but "merge" code causes stack overflow and crashes after logging in & trying to write data.
	        }catch(e){
	          Gun.log("Your 'auth' callback crashed with:", e);
	        }
	      };
	      act.h = function(data){
	        if(!data){ return act.b() }
	        alias = data.alias;
	        if(!alias)
	          alias = data.alias = "~" + pair.pub;        
	        if(!data.auth){
	          return act.g(pair);
	        }
	        pair = null;
	        act.c((act.data = data).auth);
	      };
	      act.z = function(){
	        // password update so encrypt private key using new pwd + salt
	        act.salt = String.random(64); // pseudo-random
	        SEA.work(opt.change, act.salt, act.y);
	      };
	      act.y = function(proof){
	        SEA.encrypt({priv: act.pair.priv, epriv: act.pair.epriv}, proof, act.x, {raw:1});
	      };
	      act.x = function(auth){
	        act.w(JSON.stringify({ek: auth, s: act.salt}));
	      };
	      act.w = function(auth){
	        if(opt.shuffle){ // delete in future!
	          console.log('migrate core account from UTF8 & shuffle');
	          var tmp = {}; Object.keys(act.data).forEach(function(k){ tmp[k] = act.data[k]; });
	          delete tmp._;
	          tmp.auth = auth;
	          root.get('~'+act.pair.pub).put(tmp);
	        } // end delete
	        root.get('~'+act.pair.pub).get('auth').put(auth, cb || noop);
	      };
	      act.err = function(e){
	        var ack = {err: Gun.log(e || 'User cannot be found!')};
	        cat.ing = false;
	        (cb || noop)(ack);
	      };
	      act.plugin = function(name){
	        if(!(act.name = name)){ return act.err() }
	        var tmp = [name];
	        if('~' !== name[0]){
	          tmp[1] = '~'+name;
	          tmp[2] = '~@'+name;
	        }
	        act.b(tmp);
	      };
	      if(pair){
	        if(pair.priv && pair.epriv)
	          act.g(pair);
	        else
	          root.get('~'+pair.pub).once(act.h);
	      } else
	      if(alias){
	        root.get('~@'+alias).once(act.a);
	      } else
	      if(!alias && !pass){
	        SEA.name(act.plugin);
	      }
	      return gun;
	    };
	    function obj_ify(o){
	      if('string' != typeof o){ return o }
	      try{o = JSON.parse(o);
	      }catch(e){o={};}      return o;
	    }
	  })(USE, './auth');
	USE(function(module){
	    var User = USE('./user'), SEA = User.SEA;
	    User.prototype.recall = function(opt, cb){
	      var gun = this, root = gun.back(-1);
	      opt = opt || {};
	      if(opt && opt.sessionStorage){
	        if(SEA.window){
	          try{
	            var sS = {};
	            sS = window.sessionStorage; // TODO: FIX BUG putting on `.is`!
	            if(sS){
	              (root._).opt.remember = true;
	              ((gun.back('user')._).opt||opt).remember = true;
	              if(sS.recall || sS.pair) root.user().auth(JSON.parse(sS.pair), cb); // pair is more reliable than alias/pass
	            }
	          }catch(e){}
	        }
	        return gun;
	      }
	      /*
	        TODO: copy mhelander's expiry code back in.
	        Although, we should check with community,
	        should expiry be core or a plugin?
	      */
	      return gun;
	    };
	  })(USE, './recall');
	USE(function(module){
	    var User = USE('./user'), SEA = User.SEA, Gun = User.GUN, noop = function(){};
	    User.prototype.pair = function(){
	      var user = this, proxy; // undeprecated, hiding with proxies.
	      try{ proxy = new Proxy({DANGER:'\u2620'}, {get: function(t,p,r){
	        if(!user.is || !(user._||'').sea){ return }
	        return user._.sea[p];
	      }});}catch(e){}
	      return proxy;
	    };
	    // If authenticated user wants to delete his/her account, let's support it!
	    User.prototype.delete = async function(alias, pass, cb){
	      console.log("user.delete() IS DEPRECATED AND WILL BE MOVED TO A MODULE!!!");
	      var gun = this, root = gun.back(-1), user = gun.back('user');
	      try {
	        user.auth(alias, pass, function(ack){
	          var pub = (user.is||{}).pub;
	          // Delete user data
	          user.map().once(function(){ this.put(null); });
	          // Wipe user data from memory
	          user.leave();
	          (cb || noop)({ok: 0});
	        });
	      } catch (e) {
	        Gun.log('User.delete failed! Error:', e);
	      }
	      return gun;
	    };
	    User.prototype.alive = async function(){
	      console.log("user.alive() IS DEPRECATED!!!");
	      const gunRoot = this.back(-1);
	      try {
	        // All is good. Should we do something more with actual recalled data?
	        await authRecall(gunRoot);
	        return gunRoot._.user._
	      } catch (e) {
	        const err = 'No session!';
	        Gun.log(err);
	        throw { err }
	      }
	    };
	    User.prototype.trust = async function(user){
	      console.log("`.trust` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!");
	      // TODO: BUG!!! SEA `node` read listener needs to be async, which means core needs to be async too.
	      //gun.get('alice').get('age').trust(bob);
	      if (Gun.is(user)) {
	        user.get('pub').get((ctx, ev) => {
	          console.log(ctx, ev);
	        });
	      }
	      user.get('trust').get(path).put(theirPubkey);

	      // do a lookup on this gun chain directly (that gets bob's copy of the data)
	      // do a lookup on the metadata trust table for this path (that gets all the pubkeys allowed to write on this path)
	      // do a lookup on each of those pubKeys ON the path (to get the collab data "layers")
	      // THEN you perform Jachen's mix operation
	      // and return the result of that to...
	    };
	    User.prototype.grant = function(to, cb){
	      console.log("`.grant` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!");
	      var gun = this, user = gun.back(-1).user(), pair = user._.sea, path = '';
	      gun.back(function(at){ if(at.is){ return } path += (at.get||''); });
	      (async function(){
	      var enc, sec = await user.get('grant').get(pair.pub).get(path).then();
	      sec = await SEA.decrypt(sec, pair);
	      if(!sec){
	        sec = SEA.random(16).toString();
	        enc = await SEA.encrypt(sec, pair);
	        user.get('grant').get(pair.pub).get(path).put(enc);
	      }
	      var pub = to.get('pub').then();
	      var epub = to.get('epub').then();
	      pub = await pub; epub = await epub;
	      var dh = await SEA.secret(epub, pair);
	      enc = await SEA.encrypt(sec, dh);
	      user.get('grant').get(pub).get(path).put(enc, cb);
	      }());
	      return gun;
	    };
	    User.prototype.secret = function(data, cb){
	      console.log("`.secret` API MAY BE DELETED OR CHANGED OR RENAMED, DO NOT USE!");
	      var gun = this, user = gun.back(-1).user(), pair = user.pair(), path = '';
	      gun.back(function(at){ if(at.is){ return } path += (at.get||''); });
	      (async function(){
	      var enc, sec = await user.get('trust').get(pair.pub).get(path).then();
	      sec = await SEA.decrypt(sec, pair);
	      if(!sec){
	        sec = SEA.random(16).toString();
	        enc = await SEA.encrypt(sec, pair);
	        user.get('trust').get(pair.pub).get(path).put(enc);
	      }
	      enc = await SEA.encrypt(data, sec);
	      gun.put(enc, cb);
	      }());
	      return gun;
	    };

	    /**
	     * returns the decrypted value, encrypted by secret
	     * @returns {Promise<any>}
	     // Mark needs to review 1st before officially supported
	    User.prototype.decrypt = function(cb) {
	      let gun = this,
	        path = ''
	      gun.back(function(at) {
	        if (at.is) {
	          return
	        }
	        path += at.get || ''
	      })
	      return gun
	        .then(async data => {
	          if (data == null) {
	            return
	          }
	          const user = gun.back(-1).user()
	          const pair = user.pair()
	          let sec = await user
	            .get('trust')
	            .get(pair.pub)
	            .get(path)
	          sec = await SEA.decrypt(sec, pair)
	          if (!sec) {
	            return data
	          }
	          let decrypted = await SEA.decrypt(data, sec)
	          return decrypted
	        })
	        .then(res => {
	          cb && cb(res)
	          return res
	        })
	    }
	    */
	    module.exports = User;
	  })(USE, './share');
	USE(function(module){
	    var SEA = USE('./sea'), S = USE('./settings'), noop = function() {}, u;
	    var Gun = (''+u != typeof window)? (window.Gun||{on:noop}) : USE((''+u === typeof MODULE?'.':'')+'./gun', 1);
	    // After we have a GUN extension to make user registration/login easy, we then need to handle everything else.

	    // We do this with a GUN adapter, we first listen to when a gun instance is created (and when its options change)
	    Gun.on('opt', function(at){
	      if(!at.sea){ // only add SEA once per instance, on the "at" context.
	        at.sea = {own: {}};
	        at.on('put', check, at); // SEA now runs its firewall on HAM diffs, not all i/o.
	      }
	      this.to.next(at); // make sure to call the "next" middleware adapter.
	    });

	    // Alright, this next adapter gets run at the per node level in the graph database.
	    // correction: 2020 it gets run on each key/value pair in a node upon a HAM diff.
	    // This will let us verify that every property on a node has a value signed by a public key we trust.
	    // If the signature does not match, the data is just `undefined` so it doesn't get passed on.
	    // If it does match, then we transform the in-memory "view" of the data into its plain value (without the signature).
	    // Now NOTE! Some data is "system" data, not user data. Example: List of public keys, aliases, etc.
	    // This data is self-enforced (the value can only match its ID), but that is handled in the `security` function.
	    // From the self-enforced data, we can see all the edges in the graph that belong to a public key.
	    // Example: ~ASDF is the ID of a node with ASDF as its public key, signed alias and salt, and
	    // its encrypted private key, but it might also have other signed values on it like `profile = <ID>` edge.
	    // Using that directed edge's ID, we can then track (in memory) which IDs belong to which keys.
	    // Here is a problem: Multiple public keys can "claim" any node's ID, so this is dangerous!
	    // This means we should ONLY trust our "friends" (our key ring) public keys, not any ones.
	    // I have not yet added that to SEA yet in this alpha release. That is coming soon, but beware in the meanwhile!

	    function check(msg){ // REVISE / IMPROVE, NO NEED TO PASS MSG/EVE EACH SUB?
	      var eve = this, at = eve.as, put = msg.put, soul = put['#'], key = put['.'], val = put[':'], state = put['>'], id = msg['#'], tmp;
	      if(!soul || !key){ return }
	      if((msg._||'').faith && (at.opt||'').faith && 'function' == typeof msg._){
	        SEA.opt.pack(put, function(raw){
	        SEA.verify(raw, false, function(data){ // this is synchronous if false
	          put['='] = SEA.opt.unpack(data);
	          eve.to.next(msg);
	        });});
	        return 
	      }
	      var no = function(why){ at.on('in', {'@': id, err: msg.err = why}); }; // exploit internal relay stun for now, maybe violates spec, but testing for now. // Note: this may be only the sharded message, not original batch.
	      //var no = function(why){ msg.ack(why) };
	      (msg._||'').DBG && ((msg._||'').DBG.c = +new Date);
	      if(0 <= soul.indexOf('<?')){ // special case for "do not sync data X old" forget
	        // 'a~pub.key/b<?9'
	        tmp = parseFloat(soul.split('<?')[1]||'');
	        if(tmp && (state < (Gun.state() - (tmp * 1000)))){ // sec to ms
	          (tmp = msg._) && (tmp.stun) && (tmp.stun--); // THIS IS BAD CODE! It assumes GUN internals do something that will probably change in future, but hacking in now.
	          return; // omit!
	        }
	      }
	      
	      if('~@' === soul){  // special case for shared system data, the list of aliases.
	        check.alias(eve, msg, val, key, soul, at, no); return;
	      }
	      if('~@' === soul.slice(0,2)){ // special case for shared system data, the list of public keys for an alias.
	        check.pubs(eve, msg, val, key, soul, at, no); return;
	      }
	      //if('~' === soul.slice(0,1) && 2 === (tmp = soul.slice(1)).split('.').length){ // special case, account data for a public key.
	      if(tmp = SEA.opt.pub(soul)){ // special case, account data for a public key.
	        check.pub(eve, msg, val, key, soul, at, no, at.user||'', tmp); return;
	      }
	      if(0 <= soul.indexOf('#')){ // special case for content addressing immutable hashed data.
	        check.hash(eve, msg, val, key, soul, at, no); return;
	      } 
	      check.any(eve, msg, val, key, soul, at, no, at.user||''); return;
	    }
	    check.hash = function(eve, msg, val, key, soul, at, no){ // mark unbuilt @i001962 's epic hex contrib!
	      SEA.work(val, null, function(data){
	        function hexToBase64(hexStr) {
	          let base64 = "";
	          for(let i = 0; i < hexStr.length; i++) {
	            base64 += !(i - 1 & 1) ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16)) : "";}
	          return btoa(base64);}  
	        if(data && data === key.split('#').slice(-1)[0]){ return eve.to.next(msg) }
	          else if (data && data === hexToBase64(key.split('#').slice(-1)[0])){ 
	          return eve.to.next(msg) }
	        no("Data hash not same as hash!");
	      }, {name: 'SHA-256'});
	    };
	    check.alias = function(eve, msg, val, key, soul, at, no){ // Example: {_:#~@, ~@alice: {#~@alice}}
	      if(!val){ return no("Data must exist!") } // data MUST exist
	      if('~@'+key === link_is(val)){ return eve.to.next(msg) } // in fact, it must be EXACTLY equal to itself
	      no("Alias not same!"); // if it isn't, reject.
	    };
	    check.pubs = function(eve, msg, val, key, soul, at, no){ // Example: {_:#~@alice, ~asdf: {#~asdf}}
	      if(!val){ return no("Alias must exist!") } // data MUST exist
	      if(key === link_is(val)){ return eve.to.next(msg) } // and the ID must be EXACTLY equal to its property
	      no("Alias not same!"); // that way nobody can tamper with the list of public keys.
	    };
	    check.pub = async function(eve, msg, val, key, soul, at, no, user, pub){ var tmp; // Example: {_:#~asdf, hello:'world'~fdsa}}
	      const raw = await S.parse(val) || {};
	      const verify = (certificate, certificant, cb) => {
	        if (certificate.m && certificate.s && certificant && pub)
	          // now verify certificate
	          return SEA.verify(certificate, pub, data => { // check if "pub" (of the graph owner) really issued this cert
	            if (u !== data && u !== data.e && msg.put['>'] && msg.put['>'] > parseFloat(data.e)) return no("Certificate expired.") // certificate expired
	            // "data.c" = a list of certificants/certified users
	            // "data.w" = lex WRITE permission, in the future, there will be "data.r" which means lex READ permission
	            if (u !== data && data.c && data.w && (data.c === certificant || data.c.indexOf('*' ) > -1)) {
	              // ok, now "certificant" is in the "certificants" list, but is "path" allowed? Check path
	              let path = soul.indexOf('/') > -1 ? soul.replace(soul.substring(0, soul.indexOf('/') + 1), '') : '';
	              String.match = String.match || Gun.text.match;
	              const w = Array.isArray(data.w) ? data.w : typeof data.w === 'object' || typeof data.w === 'string' ? [data.w] : [];
	              for (const lex of w) {
	                if ((String.match(path, lex['#']) && String.match(key, lex['.'])) || (!lex['.'] && String.match(path, lex['#'])) || (!lex['#'] && String.match(key, lex['.'])) || String.match((path ? path + '/' + key : key), lex['#'] || lex)) {
	                  // is Certificant forced to present in Path
	                  if (lex['+'] && lex['+'].indexOf('*') > -1 && path && path.indexOf(certificant) == -1 && key.indexOf(certificant) == -1) return no(`Path "${path}" or key "${key}" must contain string "${certificant}".`)
	                  // path is allowed, but is there any WRITE block? Check it out
	                  if (data.wb && (typeof data.wb === 'string' || ((data.wb || {})['#']))) { // "data.wb" = path to the WRITE block
	                    var root = eve.as.root.$.back(-1);
	                    if (typeof data.wb === 'string' && '~' !== data.wb.slice(0, 1)) root = root.get('~' + pub);
	                    return root.get(data.wb).get(certificant).once(value => { // TODO: INTENT TO DEPRECATE.
	                      if (value && (value === 1 || value === true)) return no(`Certificant ${certificant} blocked.`)
	                      return cb(data)
	                    })
	                  }
	                  return cb(data)
	                }
	              }
	              return no("Certificate verification fail.")
	            }
	          })
	        return
	      };
	      
	      if ('pub' === key && '~' + pub === soul) {
	        if (val === pub) return eve.to.next(msg) // the account MUST match `pub` property that equals the ID of the public key.
	        return no("Account not same!")
	      }

	      if ((tmp = user.is) && tmp.pub && !raw['*'] && !raw['+'] && (pub === tmp.pub || (pub !== tmp.pub && ((msg._.msg || {}).opt || {}).cert))){
	        SEA.opt.pack(msg.put, packed => {
	          SEA.sign(packed, (user._).sea, async function(data) {
	            if (u === data) return no(SEA.err || 'Signature fail.')
	            msg.put[':'] = {':': tmp = SEA.opt.unpack(data.m), '~': data.s};
	            msg.put['='] = tmp;
	  
	            // if writing to own graph, just allow it
	            if (pub === user.is.pub) {
	              if (tmp = link_is(val)) (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1;
	              JSON.stringifyAsync(msg.put[':'], function(err,s){
	                if(err){ return no(err || "Stringify error.") }
	                msg.put[':'] = s;
	                return eve.to.next(msg);
	              });
	              return
	            }
	  
	            // if writing to other's graph, check if cert exists then try to inject cert into put, also inject self pub so that everyone can verify the put
	            if (pub !== user.is.pub && ((msg._.msg || {}).opt || {}).cert) {
	              const cert = await S.parse(msg._.msg.opt.cert);
	              // even if cert exists, we must verify it
	              if (cert && cert.m && cert.s)
	                verify(cert, user.is.pub, _ => {
	                  msg.put[':']['+'] = cert; // '+' is a certificate
	                  msg.put[':']['*'] = user.is.pub; // '*' is pub of the user who puts
	                  JSON.stringifyAsync(msg.put[':'], function(err,s){
	                    if(err){ return no(err || "Stringify error.") }
	                    msg.put[':'] = s;
	                    return eve.to.next(msg);
	                  });
	                  return
	                });
	            }
	          }, {raw: 1});
	        });
	        return;
	      }

	      SEA.opt.pack(msg.put, packed => {
	        SEA.verify(packed, raw['*'] || pub, function(data){ var tmp;
	          data = SEA.opt.unpack(data);
	          if (u === data) return no("Unverified data.") // make sure the signature matches the account it claims to be on. // reject any updates that are signed with a mismatched account.
	          if ((tmp = link_is(data)) && pub === SEA.opt.pub(tmp)) (at.sea.own[tmp] = at.sea.own[tmp] || {})[pub] = 1;
	          
	          // check if cert ('+') and putter's pub ('*') exist
	          if (raw['+'] && raw['+']['m'] && raw['+']['s'] && raw['*'])
	            // now verify certificate
	            verify(raw['+'], raw['*'], _ => {
	              msg.put['='] = data;
	              return eve.to.next(msg);
	            });
	          else {
	            msg.put['='] = data;
	            return eve.to.next(msg);
	          }
	        });
	      });
	      return
	    };
	    check.any = function(eve, msg, val, key, soul, at, no, user){      if(at.opt.secure){ return no("Soul missing public key at '" + key + "'.") }
	      // TODO: Ask community if should auto-sign non user-graph data.
	      at.on('secure', function(msg){ this.off();
	        if(!at.opt.secure){ return eve.to.next(msg) }
	        no("Data cannot be changed.");
	      }).on.on('secure', msg);
	      return;
	    };

	    var valid = Gun.valid, link_is = function(d,l){ return 'string' == typeof (l = valid(d)) && l };

	    var pubcut = /[^\w_-]/; // anything not alphanumeric or _ -
	    SEA.opt.pub = function(s){
	      if(!s){ return }
	      s = s.split('~');
	      if(!s || !(s = s[1])){ return }
	      s = s.split(pubcut).slice(0,2);
	      if(!s || 2 != s.length){ return }
	      if('@' === (s[0]||'')[0]){ return }
	      s = s.slice(0,2).join('.');
	      return s;
	    };
	    SEA.opt.stringy = function(t){
	      // TODO: encrypt etc. need to check string primitive. Make as breaking change.
	    };
	    SEA.opt.pack = function(d,cb,k, n,s){ var tmp, f; // pack for verifying
	      if(SEA.opt.check(d)){ return cb(d) }
	      if(d && d['#'] && d['.'] && d['>']){ tmp = d[':']; f = 1; }
	      JSON.parseAsync(f? tmp : d, function(err, meta){
	        var sig = ((u !== (meta||'')[':']) && (meta||'')['~']); // or just ~ check?
	        if(!sig){ cb(d); return }
	        cb({m: {'#':s||d['#'],'.':k||d['.'],':':(meta||'')[':'],'>':d['>']||Gun.state.is(n, k)}, s: sig});
	      });
	    };
	    var O = SEA.opt;
	    SEA.opt.unpack = function(d, k, n){ var tmp;
	      if(u === d){ return }
	      if(d && (u !== (tmp = d[':']))){ return tmp }
	      k = k || O.fall_key; if(!n && O.fall_val){ n = {}; n[k] = O.fall_val; }
	      if(!k || !n){ return }
	      if(d === n[k]){ return d }
	      if(!SEA.opt.check(n[k])){ return d }
	      var soul = (n && n._ && n._['#']) || O.fall_soul, s = Gun.state.is(n, k) || O.fall_state;
	      if(d && 4 === d.length && soul === d[0] && k === d[1] && fl(s) === fl(d[3])){
	        return d[2];
	      }
	      if(s < SEA.opt.shuffle_attack){
	        return d;
	      }
	    };
	    SEA.opt.shuffle_attack = 1546329600000; // Jan 1, 2019
	    var fl = Math.floor; // TODO: Still need to fix inconsistent state issue.
	    // TODO: Potential bug? If pub/priv key starts with `-`? IDK how possible.

	  })(USE, './index');
	}());
	});

	// I don't quite know where this should go yet, so putting it here
	// what will probably wind up happening is that minimal AXE logic added to end of gun.js
	// and then rest of AXE logic (here) will be moved back to gun/axe.js
	// but for now... I gotta rush this out!
	var Gun$3 = (typeof window !== "undefined")? window.Gun : gun, u$1;
	Gun$3.on('opt', function(at){ start(at); this.to.next(at); }); // make sure to call the "next" middleware adapter.
	// TODO: BUG: panic test/panic/1 & test/panic/3 fail when AXE is on.
	function start(root){
		if(root.axe){ return }
		var opt = root.opt;
		if(false === opt.axe){ return }
		if((typeof process !== "undefined") && 'false' === ''+(process.env||'').AXE){ return }
		Gun$3.log.once("AXE", "AXE relay enabled!");
		var axe = root.axe = {};
		var mesh = opt.mesh = opt.mesh || Gun$3.Mesh(root); // DAM!
		var dup = root.dup;

		mesh.way = function(msg){
			if(!msg){ return }
			//relayUp(msg); // TEMPORARY!!!
			if(msg.get){ return GET(msg) }
			if(msg.put){ return }
			fall(msg);
		};

		function GET(msg){
			if(!msg){ return }
			var via = (msg._||'').via, ref;
			if(!via || !via.id){ return fall(msg) }
			// SUBSCRIPTION LOGIC MOVED TO GET'S ACK REPLY.
			if(!(ref = REF(msg)._)){ return fall(msg) }
			ref.asked = +new Date;
			GET.turn(msg, ref.route, 0);
		}
		GET.turn = function(msg, route, turn){
			var tmp = msg['#'], tag = dup.s[tmp], next; 
			if(!tmp || !tag){ return } // message timed out, GUN may require us to relay, tho AXE does not like that. Rethink?
			// TOOD: BUG! Handle edge case where live updates occur while these turn hashes are being checked (they'll never be consistent), but we don't want to degrade to O(N), if we know the via asking peer got an update, then we should do something like cancel these turns asking for data.
			// Ideas: Save a random seed that sorts the route, store it and the index. // Or indexing on lowest latency is probably better.
			clearTimeout(tag.lack);
			if(tag.ack && (tmp = tag['##']) && msg['##'] === tmp){ return } // hashes match, stop asking other peers!
			next = (Object.maps(route||opt.peers)).slice(turn = turn || 0);
			if(!next.length){
				if(!route){ return } // asked all peers, stop asking!
				GET.turn(msg, u$1, 0); // asked all subs, now now ask any peers. (not always the best idea, but stays )
				return;
			}
			setTimeout.each(next, function(id){
				var peer = opt.peers[id]; turn++;
				if(!peer || !peer.wire){ route && route.delete(id); return } // bye! // TODO: CHECK IF 0 OTHER PEERS & UNSUBSCRIBE
				if(mesh.say(msg, peer) === false){ return } // was self
				if(0 == (turn % 3)){ return 1 }
			}, function(){
				tag['##'] = msg['##']; // should probably set this in a more clever manner, do live `in` checks ++ --, etc. but being lazy for now. // TODO: Yes, see `in` TODO, currently this might match against only in-mem cause no other peers reply, which is "fine", but could cause a false positive.
				tag.lack = setTimeout(function(){ GET.turn(msg, route, turn); }, 25);
			}, 3);
		};
		function fall(msg){ mesh.say(msg, opt.peers); }
		function REF(msg){
			var ref = '', soul;
			if(!msg || !msg.get){ return ref }
			if('string' == typeof (soul = msg.get['#'])){ ref = root.$.get(soul); }
			return ref;
		}
		function LEX(lex){ return (lex = lex || '')['='] || lex['*'] || lex['>'] || lex }
		
		root.on('in', function(msg){ var to = this.to, tmp;
			if((tmp = msg['@']) && (tmp = dup.s[tmp])){
				tmp.ack = (tmp.ack || 0) + 1; // count remote ACKs to GET. // TODO: If mismatch, should trigger next asks.
				if(tmp.it && tmp.it.get && msg.put){ // WHEN SEEING A PUT REPLY TO A GET...
					var get = tmp.it.get||'', ref = REF(tmp.it)._, via = (tmp.it._||'').via||'', sub;
					if(via && ref){ // SUBSCRIBE THE PEER WHO ASKED VIA FOR IT:
						//console.log("SUBSCRIBING", Object.maps(ref.route||''), "to", LEX(get['#']));
						via.id && (ref.route || (ref.route = new Object.Map)).set(via.id, via);
						sub = (via.sub || (via.sub = new Object.Map));
						ref && (sub.get(LEX(get['#'])) || (sub.set(LEX(get['#']), sub = new Object.Map) && sub)).set(LEX(get['.']), 1); // {soul: {'':1, has: 1}}

						via = (msg._||'').via||'';
						if(via){ // BIDIRECTIONAL SUBSCRIBE: REPLIER IS NOW SUBSCRIBED. DO WE WANT THIS?
							via.id && (ref.route || (ref.route = new Object.Map)).set(via.id, via);
							sub = (via.sub || (via.sub = new Object.Map));
							if(ref){
								var soul = LEX(get['#']), sift = sub.get(soul), has = LEX(get['.']);
								if(has){
									(sift || (sub.set(soul, sift = new Object.Map) && sift)).set(has, 1);
								} else
								if(!sift){
									sub.set(soul, sift = new Object.Map);
									sift.set('', 1);
								}
							}
						}
					}
				}
				if((tmp = tmp.back)){ // backtrack OKs since AXE splits PUTs up.
					setTimeout.each(Object.keys(tmp), function(id){
						to.next({'#': msg['#'], '@': id, ok: msg.ok});
					});
					return;
				}
			}
			to.next(msg);
		});

		root.on('create', function(root){
			this.to.next(root);
			root.on('put', function(msg){
				var eve = this, put = msg.put, soul = put['#'], has = put['.'], val = put[':'], state = put['>'];
				eve.to.next(msg);
				if(msg['@']){ return } // acks send existing data, not updates, so no need to resend to others.
				if(!soul || !has){ return }
				var ref = root.$.get(soul)._, route = (ref||'').route;
				if(!route){ return }
				if(ref.skip){ ref.skip.now = msg['#']; return }
				(ref.skip = {now: msg['#']}).to = setTimeout(function(){
				setTimeout.each(Object.maps(route), function(pid){ var peer, tmp;
					var skip = ref.skip||''; ref.skip = null;
					if(!(peer = route.get(pid))){ return }
					if(!peer.wire){ route.delete(pid); return } // bye!
					var sub = (peer.sub || (peer.sub = new Object.Map)).get(soul);
					if(!sub){ return }
					if(!sub.get(has) && !sub.get('')){ return }
					var put = peer.put || (peer.put = {});
					var node = root.graph[soul], tmp;
					if(node && u$1 !== (tmp = node[has])){
						state = state_is(node, has);
						val = tmp;
					}
					put[soul] = state_ify(put[soul], has, state, val, soul);
					tmp = dup.track(peer.next = peer.next || String.random(9));
					(tmp.back || (tmp.back = {}))[''+skip.now||msg['#']] = 1;
					if(peer.to){ return }
					peer.to = setTimeout(function(){ flush(peer); }, opt.gap);
				}); }, 9);
			});
		});

		function flush(peer){
			var msg = {'#': peer.next, put: peer.put, ok: {'@': 3, '/': mesh.near}}; // BUG: TODO: sub count!
			// TODO: what about DAM's >< dedup? Current thinking is, don't use it, however, you could store first msg# & latest msg#, and if here... latest === first then likely it is the same >< thing, so if(firstMsg['><'][peer.id]){ return } don't send.
			peer.next = peer.put = peer.to = null;
			mesh.say(msg, peer);
		}
		var state_ify = Gun$3.state.ify, state_is = Gun$3.state.is;
	(function(){ // THIS IS THE UP MODULE;
			axe.up = {};
			var hi = mesh.hear['?']; // lower-level integration with DAM! This is abnormal but helps performance.
			mesh.hear['?'] = function(msg, peer){ var p; // deduplicate unnecessary connections:
				hi(msg, peer);
				if(!peer.pid){ return }
				if(peer.pid === opt.pid){ mesh.bye(peer); return } // if I connected to myself, drop.
				if(p = axe.up[peer.pid]){ // if we both connected to each other...
					if(p === peer){ return } // do nothing if no conflict,
					if(opt.pid > peer.pid){ // else deterministically sort
						p = peer; // so we will wind up choosing the same to keep
						peer = axe.up[p.pid]; // and the same to drop.
					}
					p.url = p.url || peer.url; // copy if not
					mesh.bye(peer); // drop
					axe.up[p.pid] = p; // update same to be same.
					return;
				}
				if(!peer.url){ return }
				axe.up[peer.pid] = peer;
				if(axe.stay){ axe.stay(); }
			};

			mesh.hear['opt'] = function(msg, peer){
				if(msg.ok){ return }
				var tmp = msg.opt;
				if(!tmp){ return }
				tmp = tmp.peers;
				if(!tmp || 'string' != typeof tmp){ return }
				if(99 <= Object.keys(axe.up).length){ return } // 99 TEMPORARILY UNTIL BENCHMARKED!
				mesh.hi({id: tmp, url: tmp, retry: 9});
				if(peer){ mesh.say({dam: 'opt', ok: 1, '@': msg['#']}, peer); }
			};

			axe.stay = function(){
				clearTimeout(axe.stay.to);
				axe.stay.to = setTimeout(function(tmp, urls){
					if(!(tmp = root.stats && root.stats.stay)){ return }
					urls = {}; Object.keys(axe.up||'').forEach(function(p){
						p = (axe.up||'')[p]; if(p.url){ urls[p.url] = {}; }
					});
					(tmp.axe = tmp.axe || {}).up = urls;
				}, 1000 * 9);//1000 * 60);
			};
			setTimeout(function(tmp){
				if(!(tmp = root.stats && root.stats.stay && root.stats.stay.axe)){ return }
				if(!(tmp = tmp.up)){ return }
				if(!(tmp instanceof Array)){ tmp = Object.keys(tmp); }
				setTimeout.each(tmp||[], function(url){ mesh.hear.opt({opt: {peers: url}}); });
			},1000);
		}());
	(function(){ // THIS IS THE MOB MODULE;
			//return; // WORK IN PROGRESS, TEST FINALIZED, NEED TO MAKE STABLE.
			/*
				AXE should have a couple of threshold items...
				let's pretend there is a variable max peers connected
				mob = 10000
				if we get more peers than that...
				we should start sending those peers a remote command
				that they should connect to this or that other peer
				and then once they (or before they do?) drop them from us.
				sake of the test... gonna set that peer number to 1.
				The mob threshold might be determined by other factors,
				like how much RAM or CPU stress we have.
			*/
			opt.mob = opt.mob || 9900; // should be based on ulimit, some clouds as low as 10K.

			// handle rebalancing a mob of peers:
			root.on('hi', function(peer){
				this.to.next(peer);
				if(peer.url){ return } // I am assuming that if we are wanting to make an outbound connection to them, that we don't ever want to drop them unless our actual config settings change.
				var count = /*Object.keys(opt.peers).length ||*/ mesh.near; // TODO: BUG! This is slow, use .near, but near is buggy right now, fix in DAM.
				//console.log("are we mobbed?", opt.mob, Object.keys(opt.peers).length, mesh.near);
				if(opt.mob >= count){ return }  // TODO: Make dynamic based on RAM/CPU also. Or possibly even weird stuff like opt.mob / axe.up length?
				var peers = {};Object.keys(axe.up).forEach(function(p){ p = axe.up[p]; p.url && (peers[p.url]={}); });
				// TODO: BUG!!! Infinite reconnection loop happens if not enough relays, or if some are missing. For instance, :8766 says to connect to :8767 which then says to connect to :8766. To not DDoS when system overload, figure clever way to tell peers to retry later, that network does not have enough capacity?
				mesh.say({dam: 'mob', mob: count, peers: peers}, peer);
				setTimeout(function(){ mesh.bye(peer); }, 9); // something with better perf?
			});
			root.on('bye', function(peer){
				this.to.next(peer);
			});

		}());
	}
	(function(){
		var from = Array.from;
		Object.maps = function(o){
			if(from && o instanceof Map){ return from(o.keys()) }
			if(o instanceof Object.Map){ o = o.s; }
			return Object.keys(o);
		};
		if(from){ return Object.Map = Map }
		(Object.Map = function(){ this.s = {}; }).prototype = {set:function(k,v){this.s[k]=v;return this},get:function(k){return this.s[k]},delete:function(k){delete this.s[k];}};
	}());

	var axe = createCommonjsModule(function (module) {
	(function(){

		var sT = setTimeout || {}, u;
	  if(typeof window !== ''+u){ sT.window = window; }
		var AXE = (sT.window||'').AXE || function(){};
	  if(AXE.window = sT.window){ AXE.window.AXE = AXE; }

		var Gun = (AXE.window||'').GUN || gun;
		(Gun.AXE = AXE).GUN = AXE.Gun = Gun;

		Gun.on('opt', function(at){ start(at) ; this.to.next(at); }); // make sure to call the "next" middleware adapter.

		function start(root){
			if(root.axe){ return }
			var opt = root.opt, peers = opt.peers;
			if(false === opt.axe){ return }
			if(!Gun.window){ return } // handled by ^ lib/axe.js
			var w = Gun.window, lS = w.localStorage || opt.localStorage || {}, loc = w.location || opt.location || {}, nav = w.navigator || opt.navigator || {};
			var axe = root.axe = {}, tmp, id;
			var mesh = opt.mesh = opt.mesh || Gun.Mesh(root); // DAM!

			tmp = peers[id = loc.origin + '/gun'] = peers[id] || {};
			tmp.id = tmp.url = id; tmp.retry = tmp.retry || 0;
			tmp = peers[id = 'http://localhost:8765/gun'] = peers[id] || {};
			tmp.id = tmp.url = id; tmp.retry = tmp.retry || 0;
			Gun.log.once("AXE", "AXE enabled: Trying to find network via (1) local peer (2) last used peers (3) a URL parameter, and last (4) hard coded peers.");
			Gun.log.once("AXEWarn", "Warning: AXE is in alpha, use only for testing!");
			var last = lS.peers || ''; if(last){ last += ' '; }
			last += ((loc.search||'').split('peers=')[1]||'').split('&')[0];

			root.on('bye', function(peer){
				this.to.next(peer);
				if(!peer.url){ return } // ignore WebRTC disconnects for now.
				if(!nav.onLine){ peer.retry = 1; }
				if(peer.retry){ return }
				if(axe.fall){ delete axe.fall[peer.url || peer.id]; }
				(function next(){
					if(!axe.fall){ setTimeout(next, 9); return } // not found yet
					var fall = Object.keys(axe.fall||''), one = fall[(Math.random()*fall.length) >> 0];
					if(!fall.length){ lS.peers = ''; one = 'https://gunjs.herokuapp.com/gun'; } // out of peers
					if(peers[one]){ next(); return } // already choose
					mesh.hi(one);
				}());
			});

			root.on('hi', function(peer){ // TEMPORARY! Try to connect all peers.
				this.to.next(peer);
				if(!peer.url){ return } // ignore WebRTC disconnects for now.
				return; // DO NOT COMMIT THIS FEATURE YET! KEEP TESTING NETWORK PERFORMANCE FIRST!
			});

			function found(text){

				axe.fall = {};
				((text||'').match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/ig)||[]).forEach(function(url){
					axe.fall[url] = {url: url, id: url, retry: 0}; // RETRY
				});
				
				return;
			}

			if(last){ found(last); return }
			try{ fetch(((loc.search||'').split('axe=')[1]||'').split('&')[0] || loc.axe || 'https://raw.githubusercontent.com/wiki/amark/gun/volunteer.dht.md').then(function(res){
		  	return res.text()
		  }).then(function(text){
		  	found(lS.peers = text);
		  }).catch(function(){
		  	found(); // nothing
		  });}catch(e){found();}
		}
	  try{ if('object' != ''+u){ module.exports = AXE; } }catch(e){}
	}());
	});

	var Gun$4 = (typeof window !== "undefined")? window.Gun : gun;

	Gun$4.on('create', function(root){
		this.to.next(root);
		var opt = root.opt;
	  if(false === opt.multicast){ return }
	  if((typeof process !== "undefined") && 'false' === ''+(process.env||{}).MULTICAST){ return }
		//if(true !== opt.multicast){ return } // disable multicast by default for now.

	  var udp = opt.multicast = opt.multicast || {};
	  udp.address = udp.address || '233.255.255.255';
	  udp.pack = udp.pack || 50000; // UDP messages limited to 65KB.
	  udp.port  = udp.port || 8765;

	  var noop = function(){};
	  var pid = '2'+Math.random().toString().slice(-8);
	  var mesh = opt.mesh = opt.mesh || Gun$4.Mesh(root);
	  var dgram$1;

	  try{ dgram$1 = dgram; }catch(e){ return }
	  var socket = dgram$1.createSocket({type: "udp4", reuseAddr: true});
	  socket.bind({port: udp.port, exclusive: true}, function(){
	    socket.setBroadcast(true);
	    socket.setMulticastTTL(128);
	  });

	  socket.on("listening", function(){
	    try { socket.addMembership(udp.address); }catch(e){ console.error(e); return; }
	    udp.peer = {id: udp.address + ':' + udp.port, wire: socket};

	    udp.peer.say = function(raw){
	      var buf = Buffer.from(raw, 'utf8');
	      if(udp.pack <= buf.length){ // message too big!!!
	        return;
	      }
	      socket.send(buf, 0, buf.length, udp.port, udp.address, noop);
	    };
	    //opt.mesh.hi(udp.peer);

	    Gun$4.log.once('multi', 'Multicast on '+udp.peer.id);
	    return; // below code only needed for when WebSocket connections desired!
	  });

	  socket.on("message", function(raw, info) { try {
	    if(!raw){ return }
	    raw = raw.toString('utf8');
	    if('2'===raw[0]){ return check(raw, info) }
	    opt.mesh.hear(raw, udp.peer);

	    return; // below code only needed for when WebSocket connections desired!
	    var message;
	    message = JSON.parse(raw.toString('utf8'));

	    if(opt.pid === message.id){ return } // ignore self

	    var url = 'http://' + info.address + ':' + (port || (opt.web && opt.web.address()||{}).port) + '/gun';
	    if(root.opt.peers[url]){ return }

	    //console.log('discovered', url, message, info);
	    root.$.opt(url);

	  } catch(e){
	    //console.log('multicast error', e, raw);
	    return;
	  } });

	  function say(msg){
	    this.to.next(msg);
	    if(!udp.peer){ return }
	    mesh.say(msg, udp.peer);
	  }

	  function check(id, info){ var tmp;
	    if(!udp.peer){ return }
	    if(!id){
	      id = check.id = check.id || Buffer.from(pid, 'utf8');
	      socket.send(id, 0, id.length, udp.port, udp.address, noop);
	      return;
	    }
	    if((tmp = root.stats) && (tmp = tmp.gap) && info){ (tmp.near || (tmp.near = {}))[info.address] = info.port || 1; } // STATS!
	    if(check.on || id === pid){ return }
	    root.on('out', check.on = say); // TODO: MULTICAST NEEDS TO BE CHECKED FOR NEW CODE SYSTEM!!!!!!!!!! // TODO: This approach seems interferes with other relays, below does not but...
	    //opt.mesh.hi(udp.peer); //  IS THIS CORRECT?
	  }

	  setInterval(check, 1000 * 1);

	});

	var Gun$5 = (typeof window !== "undefined")? window.Gun : gun;

	Gun$5.on('opt', function(root){
		this.to.next(root);
		if(root.once){ return }
		if(typeof process === 'undefined'){ return }
		if(typeof commonjsRequire === 'undefined'){ return }
		if(false === root.opt.stats){ return }
		var path = path$1 || {};
		var file = root.opt.file ? path.resolve(root.opt.file).split(path.sep).slice(-1)[0] : 'radata';
		var noop = function(){};
		var os$1 = os || {};
		var fs$1 = fs || {};
		fs$1.existsSync = fs$1.existsSync || path.existsSync;
		if(!fs$1.existsSync){ return }
		if(!process){ return }
		process.uptime = process.uptime || noop;
		process.cpuUsage = process.cpuUsage || noop;
		process.memoryUsage = process.memoryUsage || noop;
		os$1.totalmem = os$1.totalmem || noop;
		os$1.freemem = os$1.freemem || noop;
		os$1.loadavg = os$1.loadavg || noop;
		os$1.cpus = os$1.cpus || noop;
		var S = +new Date, W;
		var obj_ify = function(o){try{o = JSON.parse(o);}catch(e){o={};}return o;};
		setTimeout(function(){
			root.stats = obj_ify((fs$1.existsSync(__dirname+'/../stats.'+file) && fs$1.readFileSync(__dirname+'/../stats.'+file).toString())) || {};
			root.stats.up = root.stats.up || {};
			root.stats.up.start = root.stats.up.start || +(new Date);
			root.stats.up.count = (root.stats.up.count || 0) + 1;
			root.stats.stay = root.stats.stay || {};
			root.stats.over = +new Date;
		},1);
		setInterval(function(){
			if(!root.stats){ root.stats = {}; }
			if(W){ return }
			var stats = root.stats;
			stats.over = -(S - (S = +new Date));
			(stats.up||{}).time = process.uptime();
			stats.memory = process.memoryUsage() || {};
			stats.memory.totalmem = os$1.totalmem();
			stats.memory.freemem = os$1.freemem();
			stats.cpu = process.cpuUsage() || {};
			stats.cpu.loadavg = os$1.loadavg();
			stats.cpu.stack = (((setTimeout||'').turn||'').s||'').length;
			stats.peers = {};

			stats.peers.count = console.STAT.peers || Object.keys(root.opt.peers||{}).length; // TODO: .keys( is slow
			stats.node = {};
			stats.node.count = Object.keys(root.graph||{}).length; // TODO: .keys( is slow
			stats.all = all;
			stats.sites = console.STAT.sites;
			all = {}; // will this cause missing stats?
			var dam = root.opt.mesh;
			if(dam){
				stats.dam = {'in': {count: dam.hear.c, done: dam.hear.d}, 'out': {count: dam.say.c, done: dam.say.d}};
				dam.hear.c = dam.hear.d = dam.say.c = dam.say.d = 0; // reset
				stats.peers.time = dam.bye.time || 0;
			}
			var rad = root.opt.store; rad = rad && rad.stats;
			if(rad){
				stats.rad = rad;
				root.opt.store.stats = {get:{time:{}, count:0}, put: {time:{}, count:0}}; // reset
			}
			JSON.stringifyAsync(stats, function(err, raw){ if(err){ return } W = true;
				fs$1.writeFile(__dirname+'/../stats.'+file, raw, function(err){ W = false; err && console.log(console.STAT.err = err); console.STAT && console.STAT(S, +new Date - S, 'stats stash'); });
			});

			//exec("top -b -n 1", function(err, out){ out && fs.writeFile(__dirname+'/../stats.top.'+file, out, noop) }); // was it really seriously actually this?
		//}, 1000 * 15);
		}, 1000 * 5);
	});


	var log = Gun$5.log, all = {}, max = 1000;
	console.STAT = function(a,b,c,d){
		if('number' == typeof a && 'number' == typeof b && 'string' == typeof c){
			var tmp = (all[c] || (all[c] = []));
			if(max < tmp.push([a,b])){ all[c] = []; } // reset
			//return;
		}
		if(!console.LOG || log.off){ return a }
		return log.apply(Gun$5, arguments);
	};

	var server = createCommonjsModule(function (module) {
	(function(){
		
		var Gun = gun, u;
		Gun.serve = serve_1;
		//process.env.GUN_ENV = process.env.GUN_ENV || 'debug';
		//console.LOG = {}; // only do this for dev.
		Gun.on('opt', function(root){
			if(u === root.opt.super){ root.opt.super = true; }
			if(u === root.opt.faith){ root.opt.faith = true; } // HNPERF: This should probably be off, but we're testing performance improvements, please audit.
			root.opt.log = root.opt.log || Gun.log;
			this.to.next(root);
		});
		//require('./file');
		//require('./evict');
		
		
		module.exports = Gun;
	}());
	});

	var gun$1 = server;

	function _regeneratorRuntime() {
	  _regeneratorRuntime = function () {
	    return exports;
	  };
	  var exports = {},
	    Op = Object.prototype,
	    hasOwn = Op.hasOwnProperty,
	    $Symbol = "function" == typeof Symbol ? Symbol : {},
	    iteratorSymbol = $Symbol.iterator || "@@iterator",
	    asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
	    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
	  function define(obj, key, value) {
	    return Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: !0,
	      configurable: !0,
	      writable: !0
	    }), obj[key];
	  }
	  try {
	    define({}, "");
	  } catch (err) {
	    define = function (obj, key, value) {
	      return obj[key] = value;
	    };
	  }
	  function wrap(innerFn, outerFn, self, tryLocsList) {
	    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
	      generator = Object.create(protoGenerator.prototype),
	      context = new Context(tryLocsList || []);
	    return generator._invoke = function (innerFn, self, context) {
	      var state = "suspendedStart";
	      return function (method, arg) {
	        if ("executing" === state) throw new Error("Generator is already running");
	        if ("completed" === state) {
	          if ("throw" === method) throw arg;
	          return doneResult();
	        }
	        for (context.method = method, context.arg = arg;;) {
	          var delegate = context.delegate;
	          if (delegate) {
	            var delegateResult = maybeInvokeDelegate(delegate, context);
	            if (delegateResult) {
	              if (delegateResult === ContinueSentinel) continue;
	              return delegateResult;
	            }
	          }
	          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
	            if ("suspendedStart" === state) throw state = "completed", context.arg;
	            context.dispatchException(context.arg);
	          } else "return" === context.method && context.abrupt("return", context.arg);
	          state = "executing";
	          var record = tryCatch(innerFn, self, context);
	          if ("normal" === record.type) {
	            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
	            return {
	              value: record.arg,
	              done: context.done
	            };
	          }
	          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
	        }
	      };
	    }(innerFn, self, context), generator;
	  }
	  function tryCatch(fn, obj, arg) {
	    try {
	      return {
	        type: "normal",
	        arg: fn.call(obj, arg)
	      };
	    } catch (err) {
	      return {
	        type: "throw",
	        arg: err
	      };
	    }
	  }
	  exports.wrap = wrap;
	  var ContinueSentinel = {};
	  function Generator() {}
	  function GeneratorFunction() {}
	  function GeneratorFunctionPrototype() {}
	  var IteratorPrototype = {};
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });
	  var getProto = Object.getPrototypeOf,
	    NativeIteratorPrototype = getProto && getProto(getProto(values([])));
	  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
	  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function (method) {
	      define(prototype, method, function (arg) {
	        return this._invoke(method, arg);
	      });
	    });
	  }
	  function AsyncIterator(generator, PromiseImpl) {
	    function invoke(method, arg, resolve, reject) {
	      var record = tryCatch(generator[method], generator, arg);
	      if ("throw" !== record.type) {
	        var result = record.arg,
	          value = result.value;
	        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
	          invoke("next", value, resolve, reject);
	        }, function (err) {
	          invoke("throw", err, resolve, reject);
	        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
	          result.value = unwrapped, resolve(result);
	        }, function (error) {
	          return invoke("throw", error, resolve, reject);
	        });
	      }
	      reject(record.arg);
	    }
	    var previousPromise;
	    this._invoke = function (method, arg) {
	      function callInvokeWithMethodAndArg() {
	        return new PromiseImpl(function (resolve, reject) {
	          invoke(method, arg, resolve, reject);
	        });
	      }
	      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
	    };
	  }
	  function maybeInvokeDelegate(delegate, context) {
	    var method = delegate.iterator[context.method];
	    if (undefined === method) {
	      if (context.delegate = null, "throw" === context.method) {
	        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
	        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
	      }
	      return ContinueSentinel;
	    }
	    var record = tryCatch(method, delegate.iterator, context.arg);
	    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
	    var info = record.arg;
	    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
	  }
	  function pushTryEntry(locs) {
	    var entry = {
	      tryLoc: locs[0]
	    };
	    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
	  }
	  function resetTryEntry(entry) {
	    var record = entry.completion || {};
	    record.type = "normal", delete record.arg, entry.completion = record;
	  }
	  function Context(tryLocsList) {
	    this.tryEntries = [{
	      tryLoc: "root"
	    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
	  }
	  function values(iterable) {
	    if (iterable) {
	      var iteratorMethod = iterable[iteratorSymbol];
	      if (iteratorMethod) return iteratorMethod.call(iterable);
	      if ("function" == typeof iterable.next) return iterable;
	      if (!isNaN(iterable.length)) {
	        var i = -1,
	          next = function next() {
	            for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;
	            return next.value = undefined, next.done = !0, next;
	          };
	        return next.next = next;
	      }
	    }
	    return {
	      next: doneResult
	    };
	  }
	  function doneResult() {
	    return {
	      value: undefined,
	      done: !0
	    };
	  }
	  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
	    var ctor = "function" == typeof genFun && genFun.constructor;
	    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
	  }, exports.mark = function (genFun) {
	    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
	  }, exports.awrap = function (arg) {
	    return {
	      __await: arg
	    };
	  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
	    void 0 === PromiseImpl && (PromiseImpl = Promise);
	    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
	    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
	      return result.done ? result.value : iter.next();
	    });
	  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
	    return this;
	  }), define(Gp, "toString", function () {
	    return "[object Generator]";
	  }), exports.keys = function (object) {
	    var keys = [];
	    for (var key in object) keys.push(key);
	    return keys.reverse(), function next() {
	      for (; keys.length;) {
	        var key = keys.pop();
	        if (key in object) return next.value = key, next.done = !1, next;
	      }
	      return next.done = !0, next;
	    };
	  }, exports.values = values, Context.prototype = {
	    constructor: Context,
	    reset: function (skipTempReset) {
	      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
	    },
	    stop: function () {
	      this.done = !0;
	      var rootRecord = this.tryEntries[0].completion;
	      if ("throw" === rootRecord.type) throw rootRecord.arg;
	      return this.rval;
	    },
	    dispatchException: function (exception) {
	      if (this.done) throw exception;
	      var context = this;
	      function handle(loc, caught) {
	        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
	      }
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i],
	          record = entry.completion;
	        if ("root" === entry.tryLoc) return handle("end");
	        if (entry.tryLoc <= this.prev) {
	          var hasCatch = hasOwn.call(entry, "catchLoc"),
	            hasFinally = hasOwn.call(entry, "finallyLoc");
	          if (hasCatch && hasFinally) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          } else if (hasCatch) {
	            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
	          } else {
	            if (!hasFinally) throw new Error("try statement without catch or finally");
	            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
	          }
	        }
	      }
	    },
	    abrupt: function (type, arg) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
	          var finallyEntry = entry;
	          break;
	        }
	      }
	      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
	      var record = finallyEntry ? finallyEntry.completion : {};
	      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
	    },
	    complete: function (record, afterLoc) {
	      if ("throw" === record.type) throw record.arg;
	      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
	    },
	    finish: function (finallyLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
	      }
	    },
	    catch: function (tryLoc) {
	      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
	        var entry = this.tryEntries[i];
	        if (entry.tryLoc === tryLoc) {
	          var record = entry.completion;
	          if ("throw" === record.type) {
	            var thrown = record.arg;
	            resetTryEntry(entry);
	          }
	          return thrown;
	        }
	      }
	      throw new Error("illegal catch attempt");
	    },
	    delegateYield: function (iterable, resultName, nextLoc) {
	      return this.delegate = {
	        iterator: values(iterable),
	        resultName: resultName,
	        nextLoc: nextLoc
	      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
	    }
	  }, exports;
	}
	function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
	  try {
	    var info = gen[key](arg);
	    var value = info.value;
	  } catch (error) {
	    reject(error);
	    return;
	  }
	  if (info.done) {
	    resolve(value);
	  } else {
	    Promise.resolve(value).then(_next, _throw);
	  }
	}
	function _asyncToGenerator(fn) {
	  return function () {
	    var self = this,
	      args = arguments;
	    return new Promise(function (resolve, reject) {
	      var gen = fn.apply(self, args);
	      function _next(value) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
	      }
	      function _throw(err) {
	        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
	      }
	      _next(undefined);
	    });
	  };
	}
	function _inheritsLoose(subClass, superClass) {
	  subClass.prototype = Object.create(superClass.prototype);
	  subClass.prototype.constructor = subClass;
	  _setPrototypeOf(subClass, superClass);
	}
	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}
	function _setPrototypeOf(o, p) {
	  _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
	    o.__proto__ = p;
	    return o;
	  };
	  return _setPrototypeOf(o, p);
	}
	function _isNativeReflectConstruct() {
	  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
	  if (Reflect.construct.sham) return false;
	  if (typeof Proxy === "function") return true;
	  try {
	    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
	    return true;
	  } catch (e) {
	    return false;
	  }
	}
	function _construct(Parent, args, Class) {
	  if (_isNativeReflectConstruct()) {
	    _construct = Reflect.construct.bind();
	  } else {
	    _construct = function _construct(Parent, args, Class) {
	      var a = [null];
	      a.push.apply(a, args);
	      var Constructor = Function.bind.apply(Parent, a);
	      var instance = new Constructor();
	      if (Class) _setPrototypeOf(instance, Class.prototype);
	      return instance;
	    };
	  }
	  return _construct.apply(null, arguments);
	}
	function _isNativeFunction(fn) {
	  return Function.toString.call(fn).indexOf("[native code]") !== -1;
	}
	function _wrapNativeSuper(Class) {
	  var _cache = typeof Map === "function" ? new Map() : undefined;
	  _wrapNativeSuper = function _wrapNativeSuper(Class) {
	    if (Class === null || !_isNativeFunction(Class)) return Class;
	    if (typeof Class !== "function") {
	      throw new TypeError("Super expression must either be null or a function");
	    }
	    if (typeof _cache !== "undefined") {
	      if (_cache.has(Class)) return _cache.get(Class);
	      _cache.set(Class, Wrapper);
	    }
	    function Wrapper() {
	      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
	    }
	    Wrapper.prototype = Object.create(Class.prototype, {
	      constructor: {
	        value: Wrapper,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	    return _setPrototypeOf(Wrapper, Class);
	  };
	  return _wrapNativeSuper(Class);
	}
	function _unsupportedIterableToArray(o, minLen) {
	  if (!o) return;
	  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	  var n = Object.prototype.toString.call(o).slice(8, -1);
	  if (n === "Object" && o.constructor) n = o.constructor.name;
	  if (n === "Map" || n === "Set") return Array.from(o);
	  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
	}
	function _arrayLikeToArray(arr, len) {
	  if (len == null || len > arr.length) len = arr.length;
	  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	  return arr2;
	}
	function _createForOfIteratorHelperLoose(o, allowArrayLike) {
	  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
	  if (it) return (it = it.call(o)).next.bind(it);
	  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
	    if (it) o = it;
	    var i = 0;
	    return function () {
	      if (i >= o.length) return {
	        done: true
	      };
	      return {
	        done: false,
	        value: o[i++]
	      };
	    };
	  }
	  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
	}

	// @ts-nocheck
	var _ = {
	  throttle: function throttle(func, limit) {
	    var inThrottle;
	    return function () {
	      var args = arguments;
	      var context = this;
	      if (!inThrottle) {
	        func.apply(context, args);
	        inThrottle = true;
	        setTimeout(function () {
	          return inThrottle = false;
	        }, limit);
	      }
	    };
	  },
	  debounce: function debounce(func, limit) {
	    var inDebounce;
	    return function () {
	      var args = arguments;
	      var context = this;
	      clearTimeout(inDebounce);
	      inDebounce = setTimeout(function () {
	        return func.apply(context, args);
	      }, limit);
	    };
	  },
	  sample: function sample(arr) {
	    return arr[Math.floor(Math.random() * arr.length)];
	  },
	  sampleSize: function sampleSize(arr, size) {
	    var shuffled = arr.slice(0);
	    var i = arr.length;
	    var min = i - size;
	    var temp;
	    var index;
	    while (i-- > min) {
	      index = Math.floor((i + 1) * Math.random());
	      temp = shuffled[index];
	      shuffled[index] = shuffled[i];
	      shuffled[i] = temp;
	    }
	    return shuffled.slice(min);
	  },
	  defer: function defer(func) {
	    return setTimeout(func, 0);
	  },
	  once: function once(func) {
	    var called = false;
	    return function () {
	      if (called) {
	        return;
	      }
	      called = true;
	      func.apply(this, arguments);
	    };
	  },
	  omit: function omit(obj, keys) {
	    var newObj = {};
	    Object.keys(obj).forEach(function (key) {
	      if (!keys.includes(key)) {
	        newObj[key] = obj[key];
	      }
	    });
	    return newObj;
	  },
	  defaults: function defaults(obj, _defaults) {
	    Object.keys(_defaults).forEach(function (key) {
	      if (obj[key] === undefined) {
	        obj[key] = _defaults[key];
	      }
	    });
	    return obj;
	  },
	  pickBy: function pickBy(obj, predicate) {
	    var newObj = {};
	    Object.keys(obj).forEach(function (key) {
	      if (predicate(obj[key])) {
	        newObj[key] = obj[key];
	      }
	    });
	    return newObj;
	  }
	};

	// eslint-disable-line no-unused-vars
	var isNode = false;
	try {
	  isNode = /*#__PURE__*/Object.prototype.toString.call(global.process) === "[object process]";
	} catch (e) {
	}
	var userAgent = !isNode && navigator && navigator.userAgent && /*#__PURE__*/navigator.userAgent.toLowerCase();
	var isElectron = userAgent && /*#__PURE__*/userAgent.indexOf(' electron/') > -1;
	var isMobile = !isNode && /*#__PURE__*/function () {
	  if (isElectron) {
	    return false;
	  }
	  var check = false;
	  (function (a) {
	    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
	  })(navigator.userAgent || navigator.vendor || '');
	  return check;
	}();
	function gunAsAnotherUser(gun, key, f) {
	  var gun2 = new gun$1({
	    radisk: false,
	    peers: Object.keys(gun._.opt.peers)
	  }); // TODO: copy other options too
	  var user = gun2.user();
	  user.auth(key);
	  setTimeout(function () {
	    // @ts-ignore
	    var peers = Object.values(gun2.back('opt.peers'));
	    peers.forEach(function (peer) {
	      // @ts-ignore
	      gun2.on('bye', peer);
	    });
	  }, 20000);
	  return f(user);
	}
	function gunOnceDefined(node) {
	  return new Promise(function (resolve) {
	    node.on(function (val, _k, _a, eve) {
	      if (val !== undefined) {
	        eve.off();
	        resolve(val);
	      }
	    });
	  });
	}
	var animals = ['canidae', 'felidae', 'cat', 'cattle', 'dog', 'donkey', 'goat', 'horse', 'pig', 'rabbit', 'aardvark', 'aardwolf', 'albatross', 'alligator', 'alpaca', 'amphibian', 'anaconda', 'angelfish', 'anglerfish', 'ant', 'anteater', 'antelope', 'antlion', 'ape', 'aphid', 'armadillo', 'asp', 'baboon', 'badger', 'bandicoot', 'barnacle', 'barracuda', 'basilisk', 'bass', 'bat', 'bear', 'beaver', 'bedbug', 'bee', 'beetle', 'bird', 'bison', 'blackbird', 'boa', 'boar', 'bobcat', 'bobolink', 'bonobo', 'booby', 'bovid', 'bug', 'butterfly', 'buzzard', 'camel', 'canid', 'capybara', 'cardinal', 'caribou', 'carp', 'cat', 'catshark', 'caterpillar', 'catfish', 'cattle', 'centipede', 'cephalopod', 'chameleon', 'cheetah', 'chickadee', 'chicken', 'chimpanzee', 'chinchilla', 'chipmunk', 'clam', 'clownfish', 'cobra', 'cockroach', 'cod', 'condor', 'constrictor', 'coral', 'cougar', 'cow', 'coyote', 'crab', 'crane', 'crawdad', 'crayfish', 'cricket', 'crocodile', 'crow', 'cuckoo', 'cicada', 'damselfly', 'deer', 'dingo', 'dinosaur', 'dog', 'dolphin', 'donkey', 'dormouse', 'dove', 'dragonfly', 'dragon', 'duck', 'eagle', 'earthworm', 'earwig', 'echidna', 'eel', 'egret', 'elephant', 'elk', 'emu', 'ermine', 'falcon', 'ferret', 'finch', 'firefly', 'fish', 'flamingo', 'flea', 'fly', 'flyingfish', 'fowl', 'fox', 'frog', 'gamefowl', 'galliform', 'gazelle', 'gecko', 'gerbil', 'gibbon', 'giraffe', 'goat', 'goldfish', 'goose', 'gopher', 'gorilla', 'grasshopper', 'grouse', 'guan', 'guanaco', 'guineafowl', 'gull', 'guppy', 'haddock', 'halibut', 'hamster', 'hare', 'harrier', 'hawk', 'hedgehog', 'heron', 'herring', 'hippopotamus', 'hookworm', 'hornet', 'horse', 'hoverfly', 'hummingbird', 'hyena', 'iguana', 'impala', 'jackal', 'jaguar', 'jay', 'jellyfish', 'junglefowl', 'kangaroo', 'kingfisher', 'kite', 'kiwi', 'koala', 'koi', 'krill', 'ladybug', 'lamprey', 'landfowl', 'lark', 'leech', 'lemming', 'lemur', 'leopard', 'leopon', 'limpet', 'lion', 'lizard', 'llama', 'lobster', 'locust', 'loon', 'louse', 'lungfish', 'lynx', 'macaw', 'mackerel', 'magpie', 'mammal', 'manatee', 'mandrill', 'marlin', 'marmoset', 'marmot', 'marsupial', 'marten', 'mastodon', 'meadowlark', 'meerkat', 'mink', 'minnow', 'mite', 'mockingbird', 'mole', 'mollusk', 'mongoose', 'monkey', 'moose', 'mosquito', 'moth', 'mouse', 'mule', 'muskox', 'narwhal', 'newt', 'nightingale', 'ocelot', 'octopus', 'opossum', 'orangutan', 'orca', 'ostrich', 'otter', 'owl', 'ox', 'panda', 'panther', 'parakeet', 'parrot', 'parrotfish', 'partridge', 'peacock', 'peafowl', 'pelican', 'penguin', 'perch', 'pheasant', 'pig', 'pigeon', 'pike', 'pinniped', 'piranha', 'planarian', 'platypus', 'pony', 'porcupine', 'porpoise', 'possum', 'prawn', 'primate', 'ptarmigan', 'puffin', 'puma', 'python', 'quail', 'quelea', 'quokka', 'rabbit', 'raccoon', 'rat', 'rattlesnake', 'raven', 'reindeer', 'reptile', 'rhinoceros', 'roadrunner', 'rodent', 'rook', 'rooster', 'roundworm', 'sailfish', 'salamander', 'salmon', 'sawfish', 'scallop', 'scorpion', 'seahorse', 'shark', 'sheep', 'shrew', 'shrimp', 'silkworm', 'silverfish', 'skink', 'skunk', 'sloth', 'slug', 'smelt', 'snail', 'snake', 'snipe', 'sole', 'sparrow', 'spider', 'spoonbill', 'squid', 'squirrel', 'starfish', 'stingray', 'stoat', 'stork', 'sturgeon', 'swallow', 'swan', 'swift', 'swordfish', 'swordtail', 'tahr', 'takin', 'tapir', 'tarantula', 'tarsier', 'termite', 'tern', 'thrush', 'tick', 'tiger', 'tiglon', 'toad', 'tortoise', 'toucan', 'trout', 'tuna', 'turkey', 'turtle', 'tyrannosaurus', 'urial', 'vicuna', 'viper', 'vole', 'vulture', 'wallaby', 'walrus', 'wasp', 'warbler', 'weasel', 'whale', 'whippet', 'whitefish', 'wildcat', 'wildebeest', 'wildfowl', 'wolf', 'wolverine', 'wombat', 'woodpecker', 'worm', 'wren', 'xerinae', 'yak', 'zebra', 'alpaca', 'cat', 'cattle', 'chicken', 'dog', 'donkey', 'ferret', 'gayal', 'goldfish', 'guppy', 'horse', 'koi', 'llama', 'sheep', 'yak', 'unicorn'];
	var adjectives = ['average', 'big', 'colossal', 'fat', 'giant', 'gigantic', 'great', 'huge', 'immense', 'large', 'little', 'long', 'mammoth', 'massive', 'miniature', 'petite', 'puny', 'short', 'small', 'tall', 'tiny', 'boiling', 'breezy', 'broken', 'bumpy', 'chilly', 'cold', 'cool', 'creepy', 'crooked', 'cuddly', 'curly', 'damaged', 'damp', 'dirty', 'dry', 'dusty', 'filthy', 'flaky', 'fluffy', 'wet', 'broad', 'chubby', 'crooked', 'curved', 'deep', 'flat', 'high', 'hollow', 'low', 'narrow', 'round', 'shallow', 'skinny', 'square', 'steep', 'straight', 'wide', 'ancient', 'brief', 'early', 'fast', 'late', 'long', 'modern', 'old', 'quick', 'rapid', 'short', 'slow', 'swift', 'young', 'abundant', 'empty', 'few', 'heavy', 'light', 'many', 'numerous', 'Sound', 'cooing', 'deafening', 'faint', 'harsh', 'hissing', 'hushed', 'husky', 'loud', 'melodic', 'moaning', 'mute', 'noisy', 'purring', 'quiet', 'raspy', 'resonant', 'screeching', 'shrill', 'silent', 'soft', 'squealing', 'thundering', 'voiceless', 'whispering', 'bitter', 'delicious', 'fresh', 'juicy', 'ripe', 'rotten', 'salty', 'sour', 'spicy', 'stale', 'sticky', 'strong', 'sweet', 'tasteless', 'tasty', 'thirsty', 'fluttering', 'fuzzy', 'greasy', 'grubby', 'hard', 'hot', 'icy', 'loose', 'melted', 'plastic', 'prickly', 'rainy', 'rough', 'scattered', 'shaggy', 'shaky', 'sharp', 'shivering', 'silky', 'slimy', 'slippery', 'smooth', 'soft', 'solid', 'steady', 'sticky', 'tender', 'tight', 'uneven', 'weak', 'wet', 'wooden', 'afraid', 'angry', 'annoyed', 'anxious', 'arrogant', 'ashamed', 'awful', 'bad', 'bewildered', 'bored', 'combative', 'condemned', 'confused', 'creepy', 'cruel', 'dangerous', 'defeated', 'defiant', 'depressed', 'disgusted', 'disturbed', 'eerie', 'embarrassed', 'envious', 'evil', 'fierce', 'foolish', 'frantic', 'frightened', 'grieving', 'helpless', 'homeless', 'hungry', 'hurt', 'ill', 'jealous', 'lonely', 'mysterious', 'naughty', 'nervous', 'obnoxious', 'outrageous', 'panicky', 'repulsive', 'scary', 'scornful', 'selfish', 'sore', 'tense', 'terrible', 'thoughtless', 'tired', 'troubled', 'upset', 'uptight', 'weary', 'wicked', 'worried', 'agreeable', 'amused', 'brave', 'calm', 'charming', 'cheerful', 'comfortable', 'cooperative', 'courageous', 'delightful', 'determined', 'eager', 'elated', 'enchanting', 'encouraging', 'energetic', 'enthusiastic', 'excited', 'exuberant', 'fair', 'faithful', 'fantastic', 'fine', 'friendly', 'funny', 'gentle', 'glorious', 'good', 'happy', 'healthy', 'helpful', 'hilarious', 'jolly', 'joyous', 'kind', 'lively', 'lovely', 'lucky', 'obedient', 'perfect', 'pleasant', 'proud', 'relieved', 'silly', 'smiling', 'splendid', 'successful', 'thoughtful', 'victorious', 'vivacious', 'witty', 'wonderful', 'zealous', 'zany', 'other', 'good', 'new', 'old', 'great', 'high', 'small', 'different', 'large', 'local', 'social', 'important', 'long', 'young', 'national', 'british', 'right', 'early', 'possible', 'big', 'little', 'political', 'able', 'late', 'general', 'full', 'far', 'low', 'public', 'available', 'bad', 'main', 'sure', 'clear', 'major', 'economic', 'only', 'likely', 'real', 'black', 'particular', 'international', 'special', 'difficult', 'certain', 'open', 'whole', 'white', 'free', 'short', 'easy', 'strong', 'european', 'central', 'similar', 'human', 'common', 'necessary', 'single', 'personal', 'hard', 'private', 'poor', 'financial', 'wide', 'foreign', 'simple', 'recent', 'concerned', 'american', 'various', 'close', 'fine', 'english', 'wrong', 'present', 'royal', 'natural', 'individual', 'nice', 'french', 'nihilist', 'solipsist', 'materialist', 'surrealist', 'heroic', 'awesome', 'hedonist', 'absurd', 'current', 'modern', 'labour', 'legal', 'happy', 'final', 'red', 'normal', 'serious', 'previous', 'total', 'prime', 'significant', 'industrial', 'sorry', 'dead', 'specific', 'appropriate', 'top', 'soviet', 'basic', 'military', 'original', 'successful', 'aware', 'hon', 'popular', 'heavy', 'professional', 'direct', 'dark', 'cold', 'ready', 'green', 'useful', 'effective', 'western', 'traditional', 'scottish', 'german', 'independent', 'deep', 'interesting', 'considerable', 'involved', 'physical', 'hot', 'existing', 'responsible', 'complete', 'medical', 'blue', 'extra', 'past', 'male', 'interested', 'fair', 'essential', 'beautiful', 'civil', 'primary', 'obvious', 'future', 'environmental', 'positive', 'senior', 'nuclear', 'annual', 'relevant', 'huge', 'rich', 'commercial', 'safe', 'regional', 'practical', 'official', 'separate', 'key', 'chief', 'regular', 'due', 'additional', 'active', 'powerful', 'complex', 'standard', 'impossible', 'light', 'warm', 'middle', 'fresh', 'sexual', 'front', 'domestic', 'actual', 'united', 'technical', 'ordinary', 'cheap', 'strange', 'internal', 'excellent', 'quiet', 'soft', 'potential', 'northern', 'religious', 'quick', 'very', 'famous', 'cultural', 'proper', 'broad', 'joint', 'formal', 'limited', 'conservative', 'lovely', 'usual', 'ltd', 'unable', 'rural', 'initial', 'substantial', 'bright', 'average', 'leading', 'reasonable', 'immediate', 'suitable', 'equal', 'detailed', 'working', 'overall', 'female', 'afraid', 'democratic', 'growing', 'sufficient', 'scientific', 'eastern', 'correct', 'inc', 'irish', 'expensive', 'educational', 'mental', 'dangerous', 'critical', 'increased', 'familiar', 'unlikely', 'double', 'perfect', 'slow', 'tiny', 'dry', 'historical', 'thin', 'daily', 'southern', 'increasing', 'wild', 'alone', 'urban', 'empty', 'married', 'narrow', 'liberal', 'supposed', 'upper', 'apparent', 'tall', 'busy', 'bloody', 'prepared', 'russian', 'moral', 'careful', 'clean', 'attractive', 'japanese', 'vital', 'thick', 'alternative', 'fast', 'ancient', 'elderly', 'rare', 'external', 'capable', 'brief', 'wonderful', 'grand', 'typical', 'entire', 'grey', 'constant', 'vast', 'surprised', 'ideal', 'terrible', 'academic', 'funny', 'minor', 'pleased', 'severe', 'ill', 'corporate', 'negative', 'permanent', 'weak', 'brown', 'fundamental', 'odd', 'crucial', 'inner', 'used', 'criminal', 'contemporary', 'sharp', 'sick', 'near', 'roman', 'massive', 'unique', 'secondary', 'parliamentary', 'african', 'unknown', 'subsequent', 'angry', 'alive', 'guilty', 'lucky', 'enormous', 'well', 'yellow', 'unusual', 'net', 'tough', 'dear', 'extensive', 'glad', 'remaining', 'agricultural', 'alright', 'healthy', 'italian', 'principal', 'tired', 'efficient', 'comfortable', 'chinese', 'relative', 'friendly', 'conventional', 'willing', 'sudden', 'proposed', 'voluntary', 'slight', 'valuable', 'dramatic', 'golden', 'temporary', 'federal', 'keen', 'flat', 'silent', 'indian', 'worried', 'pale', 'statutory', 'welsh', 'dependent', 'firm', 'wet', 'competitive', 'armed', 'radical', 'outside', 'acceptable', 'sensitive', 'living', 'pure', 'global', 'emotional', 'sad', 'secret', 'rapid', 'adequate', 'fixed', 'sweet', 'administrative', 'wooden', 'remarkable', 'comprehensive', 'surprising', 'solid', 'rough', 'mere', 'mass', 'brilliant', 'maximum', 'absolute', 'electronic', 'visual', 'electric', 'cool', 'spanish', 'literary', 'continuing', 'supreme', 'chemical', 'genuine', 'exciting', 'written', 'advanced', 'extreme', 'classical', 'fit', 'favourite', 'widespread', 'confident', 'straight', 'proud', 'numerous', 'opposite', 'distinct', 'mad', 'helpful', 'given', 'disabled', 'consistent', 'anxious', 'nervous', 'awful', 'stable', 'constitutional', 'satisfied', 'conscious', 'developing', 'strategic', 'holy', 'smooth', 'dominant', 'remote', 'theoretical', 'outstanding', 'pink', 'pretty', 'clinical', 'minimum', 'honest', 'impressive', 'related', 'residential', 'extraordinary', 'plain', 'visible', 'accurate', 'distant', 'still', 'greek', 'complicated', 'musical', 'precise', 'gentle', 'broken', 'live', 'silly', 'fat', 'tight', 'monetary', 'round', 'psychological', 'violent', 'unemployed', 'inevitable', 'junior', 'sensible', 'grateful', 'pleasant', 'dirty', 'structural', 'welcome', 'deaf', 'above', 'continuous', 'blind', 'overseas', 'mean', 'entitled', 'delighted', 'loose', 'occasional', 'evident', 'desperate', 'fellow', 'universal', 'square', 'steady', 'classic', 'equivalent', 'intellectual', 'victorian', 'level', 'ultimate', 'creative', 'lost', 'medieval', 'clever', 'linguistic', 'convinced', 'judicial', 'raw', 'sophisticated', 'asleep', 'vulnerable', 'illegal', 'outer', 'revolutionary', 'bitter', 'changing', 'australian', 'native', 'imperial', 'strict', 'wise', 'informal', 'flexible', 'collective', 'frequent', 'experimental', 'spiritual', 'intense', 'rational', 'generous', 'inadequate', 'prominent', 'logical', 'bare', 'historic', 'modest', 'dutch', 'acute', 'electrical', 'valid', 'weekly', 'gross', 'automatic', 'loud', 'reliable', 'mutual', 'liable', 'multiple', 'ruling', 'curious', 'sole', 'managing', 'pregnant', 'latin', 'nearby', 'exact', 'underlying', 'identical', 'satisfactory', 'marginal', 'distinctive', 'electoral', 'urgent', 'presidential', 'controversial', 'everyday', 'encouraging', 'organic', 'continued', 'expected', 'statistical', 'desirable', 'innocent', 'improved', 'exclusive', 'marked', 'experienced', 'unexpected', 'superb', 'sheer', 'disappointed', 'frightened', 'gastric', 'romantic', 'naked', 'reluctant', 'magnificent', 'convenient', 'established', 'closed', 'uncertain', 'artificial', 'diplomatic', 'tremendous', 'marine', 'mechanical', 'retail', 'institutional', 'mixed', 'required', 'biological', 'known', 'functional', 'straightforward', 'superior', 'digital', 'spectacular', 'unhappy', 'confused', 'unfair', 'aggressive', 'spare', 'painful', 'abstract', 'asian', 'associated', 'legislative', 'monthly', 'intelligent', 'hungry', 'explicit', 'nasty', 'just', 'faint', 'coloured', 'ridiculous', 'amazing', 'comparable', 'successive', 'realistic', 'back', 'decent', 'decentralized', 'bitcoin', 'cypherpunk', 'unnecessary', 'flying', 'random', 'influential', 'dull', 'genetic', 'neat', 'marvellous', 'crazy', 'damp', 'giant', 'secure', 'bottom', 'skilled', 'subtle', 'elegant', 'brave', 'lesser', 'parallel', 'steep', 'intensive', 'casual', 'tropical', 'lonely', 'partial', 'preliminary', 'concrete', 'alleged', 'assistant', 'vertical', 'upset', 'delicate', 'mild', 'occupational', 'excessive', 'progressive', 'exceptional', 'integrated', 'striking', 'continental', 'okay', 'harsh', 'combined', 'fierce', 'handsome', 'characteristic', 'chronic', 'compulsory', 'interim', 'objective', 'splendid', 'magic', 'systematic', 'obliged', 'payable', 'fun', 'horrible', 'primitive', 'fascinating', 'ideological', 'metropolitan', 'surrounding', 'estimated', 'peaceful', 'premier', 'operational', 'technological', 'kind', 'advisory', 'hostile', 'precious', 'accessible', 'determined', 'excited', 'impressed', 'provincial', 'smart', 'endless', 'isolated', 'drunk', 'geographical', 'like', 'dynamic', 'boring', 'forthcoming', 'unfortunate', 'definite', 'super', 'notable', 'indirect', 'stiff', 'wealthy', 'awkward', 'lively', 'neutral', 'artistic', 'content', 'mature', 'colonial', 'ambitious', 'evil', 'magnetic', 'verbal', 'legitimate', 'sympathetic', 'empirical', 'head', 'shallow', 'vague', 'naval', 'depressed', 'shared', 'added', 'shocked', 'mid', 'worthwhile', 'qualified', 'missing', 'blank', 'absent', 'favourable', 'polish', 'israeli', 'developed', 'profound', 'representative', 'enthusiastic', 'dreadful', 'rigid', 'reduced', 'cruel', 'coastal', 'peculiar', 'swiss', 'crude', 'extended', 'selected', 'eager', 'canadian', 'bold', 'relaxed', 'corresponding', 'running', 'planned', 'applicable', 'immense', 'allied', 'comparative', 'uncomfortable', 'conservation', 'productive', 'beneficial', 'bored', 'charming', 'minimal', 'mobile', 'turkish', 'orange', 'rear', 'passive', 'suspicious', 'overwhelming', 'fatal', 'resulting', 'symbolic', 'registered', 'neighbouring', 'calm', 'irrelevant', 'patient', 'compact', 'profitable', 'rival', 'loyal', 'moderate', 'distinguished', 'interior', 'noble', 'insufficient', 'eligible', 'mysterious', 'varying', 'managerial', 'molecular', 'olympic', 'linear', 'prospective', 'printed', 'parental', 'diverse', 'elaborate', 'furious', 'fiscal', 'burning', 'useless', 'semantic', 'embarrassed', 'inherent', 'philosophical', 'deliberate', 'awake', 'variable', 'promising', 'unpleasant', 'varied', 'sacred', 'selective', 'inclined', 'tender', 'hidden', 'worthy', 'intermediate', 'sound', 'protective', 'fortunate', 'slim', 'defensive', 'divine', 'stuck', 'driving', 'invisible', 'misleading', 'circular', 'mathematical', 'inappropriate', 'liquid', 'persistent', 'solar', 'doubtful', 'manual', 'architectural', 'intact', 'incredible', 'devoted', 'prior', 'tragic', 'respectable', 'optimistic', 'convincing', 'unacceptable', 'decisive', 'competent', 'spatial', 'respective', 'binding', 'relieved', 'nursing', 'toxic', 'select', 'redundant', 'integral', 'then', 'probable', 'amateur', 'fond', 'passing', 'specified', 'territorial', 'horizontal', 'inland', 'cognitive', 'regulatory', 'miserable', 'resident', 'polite', 'scared', 'gothic', 'civilian', 'instant', 'lengthy', 'adverse', 'korean', 'unconscious', 'anonymous', 'aesthetic', 'orthodox', 'static', 'unaware', 'costly', 'fantastic', 'foolish', 'fashionable', 'causal', 'compatible', 'wee', 'implicit', 'dual', 'ok', 'cheerful', 'subjective', 'forward', 'surviving', 'exotic', 'purple', 'cautious', 'visiting', 'aggregate', 'ethical', 'teenage', 'dying', 'disastrous', 'delicious', 'confidential', 'underground', 'thorough', 'grim', 'autonomous', 'atomic', 'frozen', 'colourful', 'injured', 'uniform', 'ashamed', 'glorious', 'wicked', 'coherent', 'rising', 'shy', 'novel', 'balanced', 'delightful', 'arbitrary', 'adjacent', 'worrying', 'weird', 'unchanged', 'rolling', 'evolutionary', 'intimate', 'sporting', 'disciplinary', 'formidable', 'lexical', 'noisy', 'gradual', 'accused', 'homeless', 'supporting', 'coming', 'renewed', 'excess', 'retired', 'rubber', 'chosen', 'outdoor', 'embarrassing', 'preferred', 'bizarre', 'appalling', 'agreed', 'imaginative', 'governing', 'accepted', 'vocational', 'mighty', 'puzzled', 'worldwide', 'organisational', 'sunny', 'eldest', 'eventual', 'spontaneous', 'vivid', 'rude', 'faithful', 'ministerial', 'innovative', 'controlled', 'conceptual', 'unwilling', 'civic', 'meaningful', 'alive', 'brainy', 'breakable', 'busy', 'careful', 'cautious', 'clever', 'concerned', 'crazy', 'curious', 'dead', 'different', 'difficult', 'doubtful', 'easy', 'famous', 'fragile', 'helpful', 'helpless', 'important', 'impossible', 'innocent', 'inquisitive', 'modern', 'open', 'outstanding', 'poor', 'powerful', 'puzzled', 'real', 'rich', 'shy', 'sleepy', 'super', 'tame', 'uninterested', 'wandering', 'wild', 'wrong', 'adorable', 'alert', 'average', 'beautiful', 'blonde', 'bloody', 'blushing', 'bright', 'clean', 'clear', 'cloudy', 'colorful', 'crowded', 'cute', 'dark', 'drab', 'distinct', 'dull', 'elegant', 'fancy', 'filthy', 'glamorous', 'gleaming', 'graceful', 'grotesque', 'homely', 'light', 'misty', 'motionless', 'muddy', 'plain', 'poised', 'quaint', 'shiny', 'smoggy', 'sparkling', 'spotless', 'stormy', 'strange', 'ugly', 'unsightly', 'unusual', 'bad', 'better', 'beautiful', 'big', 'black', 'blue', 'bright', 'clumsy', 'crazy', 'dizzy', 'dull', 'fat', 'frail', 'friendly', 'funny', 'great', 'green', 'gigantic', 'gorgeous', 'grumpy', 'handsome', 'happy', 'horrible', 'itchy', 'jittery', 'jolly', 'kind', 'long', 'lazy', 'magnificent', 'magenta', 'many', 'mighty', 'mushy', 'nasty', 'new', 'nice', 'nosy', 'nutty', 'nutritious', 'odd', 'orange', 'ordinary', 'pretty', 'precious', 'prickly', 'purple', 'quaint', 'quiet', 'quick', 'quickest', 'rainy', 'rare', 'ratty', 'red', 'roasted', 'robust', 'round', 'sad', 'scary', 'scrawny', 'short', 'silly', 'stingy', 'strange', 'striped', 'spotty', 'tart', 'tall', 'tame', 'tan', 'tender', 'testy', 'tricky', 'tough', 'ugly', 'ugliest', 'vast', 'watery', 'wasteful', 'wonderful', 'yellow', 'yummy', 'zany'];
	var util = {
	  gunOnceDefined: gunOnceDefined,
	  gunAsAnotherUser: gunAsAnotherUser,
	  getHash: function getHash(str, format) {
	    var _this = this;
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var hash;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (format === void 0) {
	                format = "base64";
	              }
	              if (str) {
	                _context.next = 3;
	                break;
	              }
	              return _context.abrupt("return", undefined);
	            case 3:
	              _context.next = 5;
	              return gun$1.SEA.work(str, undefined, undefined, {
	                name: "SHA-256"
	              });
	            case 5:
	              hash = _context.sent;
	              if (hash) {
	                _context.next = 8;
	                break;
	              }
	              throw new Error("Gun.SEA.work failed for " + str);
	            case 8:
	              if (!(hash.length > 44)) {
	                _context.next = 10;
	                break;
	              }
	              throw new Error("Gun.SEA.work returned an invalid SHA-256 hash longer than 44 chars: " + hash + ". This is probably due to a sea.js bug on Safari.");
	            case 10:
	              if (!(format === "hex")) {
	                _context.next = 12;
	                break;
	              }
	              return _context.abrupt("return", _this.base64ToHex(hash));
	            case 12:
	              return _context.abrupt("return", hash);
	            case 13:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }))();
	  },
	  capitalize: function capitalize(s) {
	    return s.charAt(0).toUpperCase() + s.slice(1);
	  },
	  generateName: function generateName() {
	    return this.capitalize(_.sample(adjectives)) + " " + this.capitalize(_.sample(animals));
	  },
	  animals: animals,
	  adjectives: adjectives,
	  base64ToHex: function base64ToHex(str) {
	    var raw = atob(str);
	    var result = '';
	    for (var i = 0; i < raw.length; i++) {
	      var hex = raw.charCodeAt(i).toString(16);
	      result += hex.length === 2 ? hex : "0" + hex;
	    }
	    return result;
	  },
	  getCaret: function getCaret(el) {
	    if (el.selectionStart) {
	      return el.selectionStart;
	    } else {
	      // @ts-ignore
	      if (document.selection) {
	        el.focus();
	        // @ts-ignore
	        var r = document.selection.createRange();
	        if (r === null) {
	          return 0;
	        }
	        // @ts-ignore
	        var re = el.createTextRange(),
	          rc = re.duplicate();
	        re.moveToBookmark(r.getBookmark());
	        rc.setEndPoint('EndToStart', re);
	        return rc.text.length;
	      }
	    }
	    return 0;
	  },
	  injectCss: function injectCss() {
	    var elementId = "irisStyle";
	    if (document.getElementById(elementId)) {
	      return;
	    }
	    var sheet = document.createElement("style");
	    sheet.id = elementId;
	    sheet.innerHTML = "\n      .iris-follow-button .hover {\n        display: none;\n      }\n\n      .iris-follow-button.following:hover .hover {\n        display: inline;\n      }\n\n      .iris-follow-button.following:hover .nonhover {\n        display: none;\n      }\n\n      .iris-identicon * {\n        box-sizing: border-box;\n      }\n\n      .iris-identicon {\n        vertical-align: middle;\n        border-radius: 50%;\n        text-align: center;\n        display: inline-block;\n        position: relative;\n        max-width: 100%;\n      }\n\n      .iris-distance {\n        z-index: 2;\n        position: absolute;\n        left:0%;\n        top:2px;\n        width: 100%;\n        text-align: right;\n        color: #fff;\n        text-shadow: 0 0 1px #000;\n        font-size: 75%;\n        line-height: 75%;\n        font-weight: bold;\n      }\n\n      .iris-pie {\n        border-radius: 50%;\n        position: absolute;\n        top: 0;\n        left: 0;\n        box-shadow: 0px 0px 0px 0px #82FF84;\n        padding-bottom: 100%;\n        max-width: 100%;\n        -webkit-transition: all 0.2s ease-in-out;\n        -moz-transition: all 0.2s ease-in-out;\n        transition: all 0.2s ease-in-out;\n      }\n\n      .iris-card {\n        padding: 10px;\n        background-color: #f7f7f7;\n        color: #777;\n        border: 1px solid #ddd;\n        display: flex;\n        flex-direction: row;\n        overflow: hidden;\n      }\n\n      .iris-card a {\n        -webkit-transition: color 150ms;\n        transition: color 150ms;\n        text-decoration: none;\n        color: #337ab7;\n      }\n\n      .iris-card a:hover, .iris-card a:active {\n        text-decoration: underline;\n        color: #23527c;\n      }\n\n      .iris-pos {\n        color: #3c763d;\n      }\n\n      .iris-neg {\n        color: #a94442;\n      }\n\n      .iris-identicon img {\n        position: absolute;\n        top: 0;\n        left: 0;\n        max-width: 100%;\n        border-radius: 50%;\n        border-color: transparent;\n        border-style: solid;\n      }\n\n      .iris-chat-open-button {\n        background-color: #1e1e1e;\n        color: #fff;\n        padding: 15px;\n        cursor: pointer;\n        user-select: none;\n      }\n\n      .iris-chat-open-button svg {\n        width: 1em;\n      }\n\n      .iris-chat-open-button, .iris-chat-box {\n        position: fixed;\n        bottom: 0.5rem;\n        right: 0.5rem;\n        border-radius: 8px;\n        font-family: system-ui;\n        font-size: 15px;\n      }\n\n      .iris-chat-box {\n        background-color: #fff;\n        max-height: 25rem;\n        box-shadow: 2px 2px 20px rgba(0, 0, 0, 0.2);\n        height: calc(100% - 44px);\n        display: flex;\n        flex-direction: column;\n        width: 320px;\n        color: rgb(38, 38, 38);\n      }\n\n      .iris-chat-box.minimized {\n        height: auto;\n      }\n\n      .iris-chat-box.minimized .iris-chat-header {\n        border-radius: 8px;\n        cursor: pointer;\n      }\n\n      .iris-chat-box.minimized .iris-chat-messages, .iris-chat-box.minimized .iris-typing-indicator, .iris-chat-box.minimized .iris-chat-input-wrapper, .iris-chat-box.minimized .iris-chat-minimize, .iris-chat-box.minimized .iris-chat-close {\n        display: none;\n      }\n\n      .iris-chat-header {\n        background-color: #1e1e1e;\n        height: 44px;\n        color: #fff;\n        border-radius: 8px 8px 0 0;\n        text-align: center;\n        display: flex;\n        flex-direction: row;\n        justify-content: center;\n        align-items: center;\n        flex: none;\n        white-space: nowrap;\n        text-overflow: ellipsis;\n        overflow: hidden;\n      }\n\n      .iris-chat-header-text {\n        flex: 1;\n      }\n\n      .iris-online-indicator {\n        color: #bfbfbf;\n        margin-right: 5px;\n        font-size: 12px;\n        user-select: none;\n        flex: none;\n      }\n\n      .iris-online-indicator.yes {\n        color: #80bf5f;\n      }\n\n      .iris-typing-indicator {\n        display: none;\n        background-color: rgba(255, 255, 255, 0.5);\n        font-size: 12px;\n        padding: 2px;\n        color: #777;\n      }\n\n      .iris-typing-indicator.yes {\n        display: block;\n      }\n\n      .iris-chat-messages {\n        flex: 1;\n        padding: 15px;\n        overflow-y: scroll;\n      }\n\n      .iris-chat-input-wrapper {\n        flex: none;\n        padding: 15px;\n        background-color: #efefef;\n        display: flex;\n        flex-direction: row;\n        border-radius: 0 0 8px 8px;\n      }\n\n      .iris-chat-input-wrapper textarea {\n        padding: 15px 8px;\n        border-radius: 4px;\n        border: 1px solid rgba(0,0,0,0);\n        width: auto;\n        font-size: 15px;\n        resize: none;\n        flex: 1;\n      }\n\n      .iris-chat-input-wrapper textarea:focus {\n        outline: none;\n        border: 1px solid #6dd0ed;\n      }\n\n      .iris-chat-input-wrapper button svg {\n        display: inline-block;\n        font-size: inherit;\n        height: 1em;\n        width: 1em;\n        overflow: visible;\n        vertical-align: -0.125em;\n      }\n\n      .iris-chat-input-wrapper button, .iris-chat-input-wrapper button:hover, .iris-chat-input-wrapper button:active, .iris-chat-input-wrapper button:focus {\n        flex: none;\n        color: #999;\n        background-color: transparent;\n        font-size: 30px;\n        padding: 5px;\n        border: 1px solid rgba(0,0,0,0);\n        border-radius: 4px;\n        margin-left: 5px;\n      }\n\n      .iris-chat-input-wrapper button:active, .iris-chat-input-wrapper button:focus {\n        outline: none;\n        border: 1px solid #6dd0ed;\n      }\n\n      .iris-chat-message {\n        display: flex;\n        flex-direction: column;\n        margin-bottom: 2px;\n        overflow-wrap: break-word;\n      }\n\n      .iris-msg-content {\n        background-color: #efefef;\n        padding: 6px 10px;\n        border-radius: 8px;\n        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);\n        flex: none;\n        max-width: 75%;\n      }\n\n      .emoji {\n        font-size: 1.3em;\n        line-height: 1em;\n      }\n\n      .iris-chat-message .emoji-only {\n        font-size: 3em;\n        text-align: center;\n      }\n\n      .iris-seen {\n        color: rgba(0, 0, 0, 0.45);\n        user-select: none;\n      }\n\n      .iris-seen.yes {\n        color: #4fc3f7;\n      }\n\n      .iris-seen svg {\n        width: 18px;\n      }\n\n      .iris-delivered-checkmark {\n        display: none;\n      }\n\n      .delivered .iris-delivered-checkmark {\n        display: initial;\n      }\n\n      .iris-chat-minimize, .iris-chat-close {\n        user-select: none;\n        cursor: pointer;\n        width: 45px;\n        line-height: 44px;\n      }\n\n      .iris-chat-message.their {\n        align-items: flex-start;\n      }\n\n      .iris-chat-message.their + .iris-chat-message.our .iris-msg-content, .day-separator + .iris-chat-message.our .iris-msg-content {\n        margin-top: 15px;\n        border-radius: 8px 0px 8px 8px;\n      }\n\n      .iris-chat-message.their:first-of-type .iris-msg-content {\n        border-radius: 0px 8px 8px 8px;\n      }\n\n      .iris-chat-message.our:first-of-type .iris-msg-content {\n        border-radius: 8px 0px 8px 8px;\n      }\n\n      .iris-chat-message.our + .iris-chat-message.their .iris-msg-content, .day-separator + .iris-chat-message.their .iris-msg-content {\n        margin-top: 15px;\n        border-radius: 0px 8px 8px 8px;\n      }\n\n      .iris-chat-message.our {\n        align-items: flex-end;\n      }\n\n      .iris-chat-message.our .iris-msg-content {\n        background-color: #c5ecf7;\n      }\n\n      .iris-chat-message .time {\n        text-align: right;\n        font-size: 12px;\n        color: rgba(0, 0, 0, 0.45);\n      }\n\n      .iris-non-string {\n        color: blue;\n      }\n\n      .day-separator {\n        display: inline-block;\n        border-radius: 8px;\n        background-color: rgba(227, 249, 255, 0.91);\n        padding: 6px 10px;\n        margin-top: 15px;\n        margin-left: auto;\n        margin-right: auto;\n        text-transform: uppercase;\n        font-size: 13px;\n        color: rgba(74, 74, 74, 0.88);\n        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);\n        user-select: none;\n      }\n\n      .day-separator:first-of-type {\n        margin-top: 0;\n      }\n\n      *[contenteditable=\"true\"]:not(:focus) {\n        cursor: pointer;\n      }\n\n      *[contenteditable=\"true\"] {\n        outline: none;\n      }\n\n      [placeholder]:empty:before {\n        content: attr(placeholder);\n        color: #999;\n      }\n\n      [placeholder]:empty:focus {\n        cursor: text;\n      }\n      ";
	    document.head.prepend(sheet);
	  },
	  getUrlParameter: function getUrlParameter(sParam, sParams) {
	    var sPageURL = sParams || window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    var sParameterName, i;
	    for (i = 0; i < sURLVariables.length; i++) {
	      sParameterName = sURLVariables[i].split('=');
	      if (sParameterName[0] === sParam) {
	        return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
	      }
	    }
	    return;
	  },
	  formatTime: function formatTime(date) {
	    // @ts-ignore
	    var t = date.toLocaleTimeString(undefined, {
	      timeStyle: 'short'
	    });
	    var s = t.split(':');
	    if (s.length === 3) {
	      // safari tries to display seconds
	      return s[0] + ":" + s[1] + s[2].slice(2);
	    }
	    return t;
	  },
	  formatDate: function formatDate(date) {
	    var t = date.toLocaleString(undefined, {
	      dateStyle: 'short',
	      timeStyle: 'short'
	    });
	    var s = t.split(':');
	    if (s.length === 3) {
	      // safari tries to display seconds
	      return s[0] + ":" + s[1] + s[2].slice(2);
	    }
	    return t;
	  },
	  getDaySeparatorText: function getDaySeparatorText(date, dateStr, now, nowStr) {
	    if (!now) {
	      now = new Date();
	      // @ts-ignore
	      nowStr = now.toLocaleDateString({
	        dateStyle: 'short'
	      });
	    }
	    if (dateStr === nowStr) {
	      return 'today';
	    }
	    var dayDifference = Math.round((now - date) / (1000 * 60 * 60 * 24));
	    if (dayDifference === 0) {
	      return 'today';
	    }
	    if (dayDifference === 1) {
	      return 'yesterday';
	    }
	    if (dayDifference <= 5) {
	      return date.toLocaleDateString(undefined, {
	        weekday: 'long'
	      });
	    }
	    return dateStr;
	  },
	  getProfileLink: function getProfileLink(pub) {
	    return window.location.origin + "/#/profile/" + encodeURIComponent(pub);
	  },
	  truncateString: function truncateString(s, length) {
	    if (length === void 0) {
	      length = 30;
	    }
	    return s.length > length ? s.slice(0, length) + "..." : s;
	  },
	  createElement: function createElement(type, cls, parent) {
	    var el = document.createElement(type);
	    if (cls) {
	      el.setAttribute('class', cls);
	    }
	    if (parent) {
	      parent.appendChild(el);
	    }
	    return el;
	  },
	  isNode: isNode,
	  isElectron: isElectron,
	  isMobile: isMobile,
	  throttle: function throttle(func, limit) {
	    var inThrottle;
	    return function () {
	      var args = arguments;
	      var context = this;
	      if (!inThrottle) {
	        func.apply(context, args);
	        inThrottle = true;
	        setTimeout(function () {
	          return inThrottle = false;
	        }, limit);
	      }
	    };
	  },
	  debounce: function debounce(func, delay) {
	    var inDebounce;
	    return function () {
	      var context = this;
	      var args = arguments;
	      clearTimeout(inDebounce);
	      inDebounce = setTimeout(function () {
	        return func.apply(context, args);
	      }, delay);
	    };
	  },
	  sample: function sample(arr) {
	    return arr[Math.floor(Math.random() * arr.length)];
	  },
	  sampleSize: function sampleSize(arr, size) {
	    var shuffled = arr.slice(0);
	    var i = arr.length;
	    var min = i - size;
	    var temp;
	    var index;
	    while (i-- > min) {
	      index = Math.floor((i + 1) * Math.random());
	      temp = shuffled[index];
	      shuffled[index] = shuffled[i];
	      shuffled[i] = temp;
	    }
	    return shuffled.slice(min);
	  },
	  defer: function defer(func) {
	    return setTimeout(func, 0);
	  },
	  once: function once(func) {
	    var called = false;
	    return function () {
	      if (called) {
	        return;
	      }
	      called = true;
	      func.apply(this, arguments);
	    };
	  },
	  omit: function omit(obj, keys) {
	    var newObj = {};
	    Object.keys(obj).forEach(function (key) {
	      if (!keys.includes(key)) {
	        newObj[key] = obj[key];
	      }
	    });
	    return newObj;
	  }
	};

	var rindexed = createCommonjsModule(function (module) {
	(function(){
	/* // from @jabis
	if (navigator.storage && navigator.storage.estimate) {
	  const quota = await navigator.storage.estimate();
	  // quota.usage -> Number of bytes used.
	  // quota.quota -> Maximum number of bytes available.
	  const percentageUsed = (quota.usage / quota.quota) * 100;
	  console.log(`You've used ${percentageUsed}% of the available storage.`);
	  const remaining = quota.quota - quota.usage;
	  console.log(`You can write up to ${remaining} more bytes.`);
	}
	*/
	  function Store(opt){
	    opt = opt || {};
	    opt.file = String(opt.file || 'radata');
	    var store = Store[opt.file], db = null, u;

	    if(store){
	      console.log("Warning: reusing same IndexedDB store and options as 1st.");
	      return Store[opt.file];
	    }
	    store = Store[opt.file] = function(){};

	    try{opt.indexedDB = opt.indexedDB || Store.indexedDB || indexedDB;}catch(e){}
	    try{if(!opt.indexedDB || 'file:' == location.protocol){
	      var s = store.d || (store.d = {});
	      store.put = function(f, d, cb){ s[f] = d; setTimeout(function(){ cb(null, 1); },250); };
	      store.get = function(f, cb){ setTimeout(function(){ cb(null, s[f] || u); },5); };
	      console.log('Warning: No indexedDB exists to persist data to!');
	      return store;
	    }}catch(e){}
	    

	    store.start = function(){
	      var o = indexedDB.open(opt.file, 1);
	      o.onupgradeneeded = function(eve){ (eve.target.result).createObjectStore(opt.file); };
	      o.onsuccess = function(){ db = o.result; };
	      o.onerror = function(eve){ console.log(eve||1); };
	    }; store.start();

	    store.put = function(key, data, cb){
	      if(!db){ setTimeout(function(){ store.put(key, data, cb); },1); return }
	      var tx = db.transaction([opt.file], 'readwrite');
	      var obj = tx.objectStore(opt.file);
	      var req = obj.put(data, ''+key);
	      req.onsuccess = obj.onsuccess = tx.onsuccess = function(){ cb(null, 1); };
	      req.onabort = obj.onabort = tx.onabort = function(eve){ cb(eve||'put.tx.abort'); };
	      req.onerror = obj.onerror = tx.onerror = function(eve){ cb(eve||'put.tx.error'); };
	    };

	    store.get = function(key, cb){
	      if(!db){ setTimeout(function(){ store.get(key, cb); },9); return }
	      var tx = db.transaction([opt.file], 'readonly');
	      var obj = tx.objectStore(opt.file);
	      var req = obj.get(''+key);
	      req.onsuccess = function(){ cb(null, req.result); };
	      req.onabort = function(eve){ cb(eve||4); };
	      req.onerror = function(eve){ cb(eve||5); };
	    };
	    setInterval(function(){ db && db.close(); db = null; store.start(); }, 1000 * 15); // reset webkit bug?
	    return store;
	  }

	  if(typeof window !== "undefined"){
	    (Store.window = window).RindexedDB = Store;
	    Store.indexedDB = window.indexedDB; // safari bug
	  } else {
	    try{ module.exports = Store; }catch(e){}
	  }

	  try{
	    var Gun = Store.window.Gun || gun;
	    Gun.on('create', function(root){
	      this.to.next(root);
	      root.opt.store = root.opt.store || Store(root.opt);
	    });
	  }catch(e){}

	}());
	});

	var ELECTRON_GUN_URL = 'http://localhost:8767/gun';
	var maxConnectedPeers = 2;
	var DEFAULT_PEERS = {
	  'https://gun-rs.iris.to/gun': {}
	};
	var loc = window.location;
	var host = loc.host;
	var is_localhost_but_not_dev = /*#__PURE__*/host.startsWith('localhost') && host !== 'localhost:8080';
	if (loc.hostname.endsWith('herokuapp.com') || is_localhost_but_not_dev) {
	  Object.keys(DEFAULT_PEERS).forEach(function (url) {
	    return DEFAULT_PEERS[url].enabled = false;
	  });
	  DEFAULT_PEERS[loc.origin + "/gun"] = {
	    enabled: true
	  };
	}
	/**
	 * Networking and peer management utilities
	 */
	var peers = {
	  known: {},
	  /** */add: function add(peer) {
	    var _this = this;
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var url, secret, encryptedUrl, encryptedUrlHash;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (peer.from) {
	                Object.keys(_this.known).forEach(function (k) {
	                  if (_this.known[k].from === peer.from) {
	                    // remove previous peer url from the same user
	                    delete _this.known[k];
	                  }
	                });
	              }
	              url = peer.url || '';
	              _this.known[url] = _this.known[url] || _.omit(peer, ['url']);
	              if (!(peer.visibility === 'public')) {
	                _context.next = 17;
	                break;
	              }
	              _context.next = 6;
	              return gun$1.SEA.secret(session.getKey().epub, session.getKey());
	            case 6:
	              _context.t0 = _context.sent;
	              if (_context.t0) {
	                _context.next = 9;
	                break;
	              }
	              _context.t0 = '';
	            case 9:
	              secret = _context.t0;
	              _context.next = 12;
	              return gun$1.SEA.encrypt(peer.url, secret);
	            case 12:
	              encryptedUrl = _context.sent;
	              _context.next = 15;
	              return gun$1.SEA.work(encryptedUrl, null, null, {
	                name: 'SHA-256'
	              });
	            case 15:
	              encryptedUrlHash = _context.sent;
	              global$2().user().get('peers').get(encryptedUrlHash).put({
	                url: peer.url,
	                lastSeen: new Date().toISOString()
	              });
	            case 17:
	              if (peer.enabled !== false) {
	                peer.url && _this.connect(peer.url); // this calls savePeers()
	              } else {
	                _this.save();
	              }
	            case 18:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }))();
	  },
	  /** */remove: function remove(url) {
	    delete this.known[url];
	    this.save();
	  },
	  /** */disconnect: function disconnect(peerFromGun) {
	    global$2().on('bye', peerFromGun);
	    peerFromGun.url = '';
	  },
	  save: function save() {
	    localStorage.setItem('gunPeers', JSON.stringify(this.known));
	  },
	  getSaved: function getSaved() {
	    var p = localStorage.getItem('gunPeers');
	    if (p && p !== 'undefined') {
	      p = JSON.parse(p);
	    } else {
	      p = DEFAULT_PEERS;
	    }
	    if (util.isElectron) {
	      p[ELECTRON_GUN_URL] = {};
	    }
	    Object.keys(p).forEach(function (k) {
	      return _.defaults(p[k], {
	        enabled: true
	      });
	    });
	    return p;
	  },
	  /** */reset: function reset() {
	    localStorage.setItem('gunPeers', '');
	    this.known = this.getSaved();
	  },
	  /** */connect: function connect(url) {
	    if (this.isMixedContent(url)) {
	      return;
	    }
	    if (this.known[url]) {
	      this.known[url].enabled = true;
	      global$2().opt({
	        peers: [url]
	      });
	      this.save();
	    } else {
	      this.add({
	        url: url
	      });
	    }
	  },
	  /** */disable: function disable(url, peerFromGun) {
	    this.known[url].enabled = false;
	    if (peerFromGun) {
	      this.disconnect(peerFromGun);
	    }
	    this.save();
	  },
	  isMixedContent: function isMixedContent(url) {
	    return window.location.protocol === 'https:' && url.indexOf('http:') === 0;
	  },
	  random: function random() {
	    var _this2 = this;
	    var connectToLocalElectron = util.isElectron && this.known[ELECTRON_GUN_URL] && this.known[ELECTRON_GUN_URL].enabled !== false;
	    var sampleSize = connectToLocalElectron ? Math.max(maxConnectedPeers - 1, 1) : maxConnectedPeers;
	    var sample = _.sampleSize(Object.keys(_.pickBy(this.known, function (peer, url) {
	      return !_this2.isMixedContent(url) && peer.enabled && !(util.isElectron && url === ELECTRON_GUN_URL);
	    })), sampleSize);
	    if (sample && connectToLocalElectron) {
	      sample.push(ELECTRON_GUN_URL);
	    }
	    return sample;
	  },
	  checkGunPeerCount: function checkGunPeerCount() {
	    var _this3 = this;
	    var peersFromGun = global$2().back('opt.peers');
	    var connectedPeers = Object.values(peersFromGun).filter(function (peer) {
	      if (peer && peer.wire && peer.wire.constructor.name !== 'WebSocket') {
	        console.log('WebRTC peer', peer);
	      }
	      return peer && peer.wire && peer.wire.readyState === 1 && peer.wire.bufferedAmount === 0 && peer.wire.constructor.name === 'WebSocket';
	    });
	    if (connectedPeers.length < maxConnectedPeers) {
	      var unconnectedPeers = Object.keys(this.known).filter(function (url) {
	        var addedToGun = Object.values(peersFromGun).map(function (peer) {
	          return peer.url;
	        }).indexOf(url) > -1;
	        var enabled = _this3.known[url].enabled;
	        var mixedContent = window.location.protocol === 'https:' && url.indexOf('http:') === 0;
	        return !mixedContent && enabled && !addedToGun;
	      });
	      if (unconnectedPeers.length) {
	        var sample = String(_.sample(unconnectedPeers));
	        this.connect(sample);
	      }
	    }
	    if (connectedPeers.length > maxConnectedPeers) {
	      this.disconnect(_.sample(connectedPeers));
	    }
	  },
	  init: function init() {
	    var _this4 = this;
	    this.known = this.getSaved();
	    /* use the default value of 1 for now because of memory issue
	    local().get('settings').get('maxConnectedPeers').on(n => {
	      if (n !== undefined) maxConnectedPeers = n;
	    });
	     */
	    setInterval(function () {
	      return _this4.checkGunPeerCount();
	    }, 1000);
	  }
	};

	var global$1;
	function global$2 (opts) {
	  if (opts === void 0) {
	    opts = {};
	  }
	  if (!global$1) {
	    var myOpts = Object.assign({
	      peers: opts.peers || peers.random(),
	      localStorage: false,
	      retry: Infinity
	    }, opts);
	    if (opts.peers) {
	      opts.peers.forEach(function (url) {
	        return peers.add({
	          url: url
	        });
	      });
	    }
	    peers.init();
	    global$1 = new gun$1(myOpts);
	  }
	  return global$1;
	}

	// @ts-nocheck
	/*eslint no-useless-escape: "off", camelcase: "off" */
	var UNIQUE_ID_VALIDATORS = {
	  email: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
	  bitcoin: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
	  bitcoin_address: /^[13][a-km-zA-HJ-NP-Z0-9]{26,33}$/,
	  ip: /^(([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)\.){3}([1-9]?\d|1\d\d|2[0-5][0-5]|2[0-4]\d)$/,
	  ipv6: /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$/,
	  gpg_fingerprint: null,
	  gpg_keyid: null,
	  google_oauth2: null,
	  tel: /^\d{7,}$/,
	  phone: /^\d{7,}$/,
	  keyID: null,
	  url: /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi,
	  account: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
	  uuid: /[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/
	};
	// TODO this class could perhaps be removed
	var Attribute = /*#__PURE__*/function () {
	  function Attribute(a, b) {
	    if (typeof a === "object") {
	      if (typeof a.value !== "string") {
	        throw new Error("param1.value must be a string, got " + typeof a.value + ": " + JSON.stringify(a.value));
	      }
	      if (typeof a.type !== "string") {
	        throw new Error("param1.type must be a string, got " + typeof a.type + ": " + JSON.stringify(a.type));
	      }
	      b = a.value;
	      a = a.type;
	    }
	    if (typeof a !== "string") {
	      throw new Error("First param must be a string, got " + typeof a + ": " + JSON.stringify(a));
	    }
	    if (!a.length) {
	      throw new Error("First param string is empty");
	    }
	    if (b) {
	      if (typeof b !== "string") {
	        throw new Error("Second parameter must be a string, got " + typeof b + ": " + JSON.stringify(b));
	      }
	      if (!b.length) {
	        throw new Error("Second param string is empty");
	      }
	      this.type = a;
	      this.value = b;
	    } else {
	      this.value = a;
	      var t = Attribute.guessTypeOf(this.value);
	      if (t) {
	        this.type = t;
	      } else {
	        throw new Error("Type of attribute was omitted and could not be guessed");
	      }
	    }
	  }
	  Attribute.getUuid = function getUuid() {
	    var b = function b(a) {
	      return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b);
	    };
	    return new Attribute("uuid", b());
	  };
	  Attribute.getUniqueIdValidators = function getUniqueIdValidators() {
	    return UNIQUE_ID_VALIDATORS;
	  };
	  Attribute.isUniqueType = function isUniqueType(type) {
	    return Object.keys(UNIQUE_ID_VALIDATORS).indexOf(type) > -1;
	  };
	  var _proto = Attribute.prototype;
	  _proto.isUniqueType = function isUniqueType() {
	    return Attribute.isUniqueType(this.type);
	  };
	  Attribute.guessTypeOf = function guessTypeOf(value) {
	    for (var key in UNIQUE_ID_VALIDATORS) {
	      if (value.match(UNIQUE_ID_VALIDATORS[key])) {
	        return key;
	      }
	    }
	  };
	  Attribute.equals = function equals(a, b) {
	    return a.equals(b);
	  };
	  _proto.equals = function equals(a) {
	    return a && this.type === a.type && this.value === a.value;
	  };
	  _proto.uri = function uri() {
	    return encodeURIComponent(this.value) + ":" + encodeURIComponent(this.type);
	  };
	  return Attribute;
	}();

	var currentUser;
	/**
	 * Get a public space where only the specified user (public key) can write. Others can read.
	 * @param pub The public key of the user. Defaults to the current user from session.
	 * @returns {Node} The user space.
	 */
	function publicState (pub) {
	  if (!currentUser) {
	    currentUser = global$2().user();
	    currentUser.auth(session.getKey());
	  }
	  return pub ? global$2().user(pub) : currentUser;
	}

	// TODO: extract Group channels into their own class
	var DEFAULT_PERMISSIONS = {
	  read: true,
	  write: true,
	  admin: false
	};
	/**
	* Private communication channel between two or more participants ([Gun](https://github.com/amark/gun) public keys). Can be used independently of other Iris stuff.
	*
	* Used as a core element of [iris-messenger](https://github.com/irislib/iris-messenger).
	*
	* You can use iris.private(pub) to always use the same Channel object for a given pub.
	*
	* ---
	*
	* #### Key-value API
	* `channel.put(key, value)` and `channel.on(key, callback)`.
	*
	* Note that each participant has their own versions of each key-value — they don't overwrite each other. `channel.on()` callback returns them all by default and has a parameter that indicates whose value you got.
	*
	* While values are encrypted, encryption of keys is not implemented yet.
	*
	* #### Message API
	* `channel.send()` and `channel.getMessages()` for timestamp-indexed chat-style messaging.
	*
	* Message data is encrypted, but timestamps are public so that peers can return your messages in a sequential order.
	*
	* ---
	*
	* You can open a channel with yourself for a private key-value space or a "note to self" type chat with yourself.
	*
	* **Privacy disclaimer:** Channel ids, data values and messages are encrypted, but message timestamps are unencrypted so that peers can return them to you in a sequential order. By looking at the unencrypted timestamps (or Gun subscriptions), it is possible to guess who are communicating with each other. This could be improved by indexing messages by *day* only, so making the guess would be more difficult, while you could still return them in a semi-sequential order.
	*
	* @param {Object} options
	* @param {string} options.key your keypair
	* @param {Object} options.gun [gun](https://github.com/amark/gun) instance
	* @param options.participants (optional) string or string array or permissions object ({'pub1':{read:true,write:true,admin:false},'pub2'...}) of participant public keys (your own key is included by default)
	* @param {string} options.chatLink (optional) chat link instead of participants list
	* @param {string} options.uuid (group channels only) unique channel identifier. Leave out for new channel.
	* @param {string} options.name (group channels only) channel name
	* @example
	* // Copy & paste this to console at https://iris.to or other page that has gun, sea and iris-lib
	* // Due to an unsolved bug, someoneElse's messages only start showing up after a reload
	*
	* var gun1 = new Gun('https://gun-us.herokuapp.com/gun');
	* var gun2 = new Gun('https://gun-us.herokuapp.com/gun');
	* var myKey = await iris.Key.getDefault();
	* var someoneElse = localStorage.getItem('someoneElsesKey');
	* if (someoneElse) {
	*  someoneElse = JSON.parse(someoneElse);
	* } else {
	*  someoneElse = await iris.Key.generate();
	*  localStorage.setItem('someoneElsesKey', JSON.stringify(someoneElse));
	* }
	*
	* iris.Channel.initUser(gun1, myKey); // saves myKey.epub to gun.user().get('epub')
	* iris.Channel.initUser(gun2, someoneElse);
	*
	* var ourChannel = new iris.Channel({key: myKey, gun: gun1, participants: someoneElse.pub});
	* var theirChannel = new iris.Channel({key: someoneElse, gun: gun2, participants: myKey.pub});
	*
	* var myChannels = {}; // you can list them in a user interface
	* function printMessage(msg, info) {
	*  console.log(`[${new Date(msg.time).toLocaleString()}] ${info.from.slice(0,8)}: ${msg.text}`)
	* }
	* iris.Channel.getChannels(gun1, myKey, channel => {
	*  var pub = channel.getCurrentParticipants()[0];
	*  gun1.user(pub).get('profile').get('name').on(name => channel.name = name);
	*  myChannels[pub] = channel;
	*  channel.getMessages(printMessage);
	*  channel.on('mood', (mood, from) => console.log(from.slice(0,8) + ' is feeling ' + mood));
	* });
	*
	* // you can play with these in the console:
	* ourChannel.send('message from myKey');
	* theirChannel.send('message from someoneElse');
	*
	* ourChannel.put('mood', 'blessed');
	* theirChannel.put('mood', 'happy');
	*
	* @example https://github.com/irislib/iris-lib/blob/master/__tests__/Channel.js
	*/
	var Channel = /*#__PURE__*/function () {
	  function Channel(options) {
	    var _this = this;
	    this.theirSecretUuids = {};
	    this.theirGroupSecrets = {};
	    this.secrets = {};
	    this.ourSecretChannelIds = {};
	    this.theirSecretChannelIds = {};
	    this.messages = {};
	    this.chatLinks = {};
	    this.groupSubscriptions = {};
	    this.directSubscriptions = {};
	    this.getParticipantsCallbacks = {};
	    this.myGroupSecret = options.myGroupSecret;
	    if (options.chatLink) {
	      this.useChatLink(options);
	    }
	    if (typeof options.participants === "string") {
	      this.addParticipant(options.participants, options.save);
	    } else if (Array.isArray(options.participants)) {
	      var o = {};
	      options.participants.forEach(function (p) {
	        return o[p] = Object.assign({}, DEFAULT_PERMISSIONS);
	      });
	      options.participants = o;
	    }
	    if (typeof options.participants === "object") {
	      // it's a group channel
	      var keys = Object.keys(options.participants);
	      keys.forEach(function (k) {
	        if (k !== session.getKey().pub) {
	          _this.addParticipant(k, options.save, Object.assign({}, DEFAULT_PERMISSIONS, options.participants[k]));
	        }
	      });
	      options.participants[session.getKey().pub] = options.participants[session.getKey().pub] || Object.assign({}, DEFAULT_PERMISSIONS);
	      if (options.uuid) {
	        this.uuid = options.uuid;
	        this.name = options.name;
	      } else {
	        options.uuid = Attribute.getUuid().value;
	        this.uuid = options.uuid;
	        options.participants[session.getKey().pub].admin = true;
	        options.participants[session.getKey().pub].founder = true;
	      }
	      this.getChatLinks({
	        subscribe: true
	      });
	    }
	    this.participants = options.participants;
	    if (options.uuid) {
	      // It's a group channel
	      // share secret uuid with other participants. since secret is already non-deterministic, maybe uuid could also be?
	      // generate channel-specific secret and share it with other participants
	      // put() keys should be encrypted first? so you could do put(uuid, secret)
	      // what if you join the channel with 2 unconnected devices? on reconnect, the older secret would be overwritten and messages unreadable. maybe participants should store each others' old keys? or maybe you should store them and re-encrypt old stuff when key changes? return them with map() instead?
	      this.putDirect("S" + this.uuid, this.getMyGroupSecret());
	      this.getMySecretUuid().then(function (s) {
	        _this.putDirect(_this.uuid, s); // TODO: encrypt keys in put()
	      });

	      this.onTheirDirect(this.uuid, function (s, k, from) {
	        _this.theirSecretUuids[from] = s;
	      });
	      this.onTheirDirect("S" + this.uuid, function (s, k, from) {
	        _this.theirGroupSecrets[from] = s;
	      });
	      // need to make put(), on(), send() and getMessages() behave differently when it's a group and retain the old versions for mutual signaling
	    }

	    this.onTheir("participants", function (participants, k, from) {
	      var hasAdmin = false;
	      var keys = Object.keys(_this.participants);
	      for (var i = 0; i < keys.length; i++) {
	        if (_this.participants[keys[i]].admin || _this.participants[keys[i]].inviter) {
	          hasAdmin = true;
	          break;
	        }
	      }
	      if (!hasAdmin) {
	        keys.forEach(function (k) {
	          return _this.participants[k].admin = true;
	        }); // if no admins, make everyone admin
	      }

	      if (_this.participants[from] && (_this.participants[from].admin || _this.participants[from].inviter)) {
	        if (typeof participants === "object") {
	          if (JSON.stringify(_this.participants) === JSON.stringify(participants)) {
	            return;
	          }
	          _this.participants = participants;
	          delete _this.participants[from].inviter;
	          Object.keys(participants).forEach(function (k) {
	            if (k !== session.getKey().pub) {
	              _this.addParticipant(k, true, Object.assign({}, DEFAULT_PERMISSIONS, participants[k]), true);
	            }
	          });
	          _this.participantsChanged();
	          options.saved = true;
	        }
	      }
	    });
	    if (!options.saved && (options.save === undefined || options.save === true)) {
	      this.save();
	    }
	  }
	  var _proto = Channel.prototype;
	  _proto.useChatLink = function useChatLink(options) {
	    var s = options.chatLink.split('?');
	    if (s.length === 2) {
	      var chatWith = util.getUrlParameter('chatWith', s[1]);
	      var channelId = util.getUrlParameter('channelId', s[1]);
	      var inviter = util.getUrlParameter('inviter', s[1]);
	      var pub = inviter || chatWith;
	      if (chatWith) {
	        options.participants = pub;
	      } else if (channelId && inviter && inviter !== session.getKey().pub) {
	        // TODO! initializing it twice breaks things - new secret is generated
	        options.uuid = channelId;
	        options.participants = {};
	        options.participants[inviter] = Object.assign({
	          inviter: true
	        }, DEFAULT_PERMISSIONS);
	      }
	      if (pub !== session.getKey().pub) {
	        var sharedSecret = util.getUrlParameter('s', s[1]);
	        var linkId = util.getUrlParameter('k', s[1]);
	        if (sharedSecret && linkId) {
	          this.save(); // save the channel first so it's there before inviter subscribes to it
	          options.saved = true;
	          global$2().user(pub).get('chatLinks').get(linkId).get('encryptedSharedKey').on( /*#__PURE__*/function () {
	            var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(encrypted) {
	              var sharedKey, encryptedChatRequest, channelRequestId;
	              return _regeneratorRuntime().wrap(function _callee$(_context) {
	                while (1) {
	                  switch (_context.prev = _context.next) {
	                    case 0:
	                      _context.next = 2;
	                      return gun$1.SEA.decrypt(encrypted, sharedSecret);
	                    case 2:
	                      sharedKey = _context.sent;
	                      _context.next = 5;
	                      return gun$1.SEA.encrypt(session.getKey().pub, sharedSecret);
	                    case 5:
	                      encryptedChatRequest = _context.sent;
	                      _context.next = 8;
	                      return util.getHash(encryptedChatRequest);
	                    case 8:
	                      channelRequestId = _context.sent;
	                      util.gunAsAnotherUser(global$2(), sharedKey, function (user) {
	                        user.get('chatRequests').get(channelRequestId.slice(0, 12)).put(encryptedChatRequest);
	                      });
	                    case 10:
	                    case "end":
	                      return _context.stop();
	                  }
	                }
	              }, _callee);
	            }));
	            return function (_x) {
	              return _ref.apply(this, arguments);
	            };
	          }());
	        }
	      }
	    }
	  };
	  _proto.getTheirSecretUuid = function getTheirSecretUuid(pub) {
	    var _this2 = this;
	    return new Promise(function (resolve) {
	      if (!_this2.theirSecretUuids[pub]) {
	        _this2.onTheirDirect(_this2.uuid, function (s) {
	          _this2.theirSecretUuids[pub] = s;
	          resolve(_this2.theirSecretUuids[pub]);
	        }, pub);
	      } else {
	        resolve(_this2.theirSecretUuids[pub]);
	      }
	    });
	  };
	  _proto.getTheirGroupSecret = function getTheirGroupSecret(pub) {
	    var _this3 = this;
	    if (pub === session.getKey().pub) {
	      return this.getMyGroupSecret();
	    }
	    return new Promise(function (resolve) {
	      if (!_this3.theirGroupSecrets[pub]) {
	        _this3.onTheirDirect("S" + _this3.uuid, function (s) {
	          _this3.theirGroupSecrets[pub] = s;
	          resolve(_this3.theirGroupSecrets[pub]);
	        }, pub);
	      } else {
	        resolve(_this3.theirGroupSecrets[pub]);
	      }
	    });
	  };
	  _proto.changeMyGroupSecret = function changeMyGroupSecret() {
	    this.myGroupSecret = gun$1.SEA.random(32).toString('base64');
	    // TODO: secret should be archived and probably messages should include the encryption key id so past messages don't become unreadable
	    this.putDirect("S" + this.uuid, this.myGroupSecret);
	  }
	  /**
	  * Unsubscribe messages from a channel participants
	  *
	  * @param {string} participant public key
	  */;
	  _proto.mute =
	  /*#__PURE__*/
	  function () {
	    var _mute = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(participant) {
	      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              global$2().user(participant).get(this.theirSecretUuids[participant]).off();
	              // TODO: persist
	            case 1:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, this);
	    }));
	    function mute(_x2) {
	      return _mute.apply(this, arguments);
	    }
	    return mute;
	  }() /**
	      * Mute user and prevent them from seeing your further (and maybe past) messages
	      *
	      * @param {string} participant public key
	      */;
	  _proto.block =
	  /*#__PURE__*/
	  function () {
	    var _block = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(participant) {
	      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              this.mute(participant);
	              this.putDirect(this.uuid, null);
	              this.putDirect("S" + this.uuid, null);
	              delete this.secrets[participant];
	              delete this.ourSecretChannelIds[participant];
	              delete this.theirSecretChannelIds[participant];
	              this.changeMyGroupSecret();
	            case 7:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3, this);
	    }));
	    function block(_x3) {
	      return _block.apply(this, arguments);
	    }
	    return block;
	  }();
	  _proto.getMySecretUuid = /*#__PURE__*/function () {
	    var _getMySecretUuid = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
	      var mySecret, mySecretHash;
	      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              if (this.mySecretUuid) {
	                _context4.next = 10;
	                break;
	              }
	              _context4.next = 3;
	              return gun$1.SEA.secret(session.getKey().epub, session.getKey());
	            case 3:
	              mySecret = _context4.sent;
	              _context4.next = 6;
	              return util.getHash(mySecret);
	            case 6:
	              mySecretHash = _context4.sent;
	              _context4.next = 9;
	              return util.getHash(mySecretHash + this.uuid);
	            case 9:
	              this.mySecretUuid = _context4.sent;
	            case 10:
	              return _context4.abrupt("return", this.mySecretUuid);
	            case 11:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4, this);
	    }));
	    function getMySecretUuid() {
	      return _getMySecretUuid.apply(this, arguments);
	    }
	    return getMySecretUuid;
	  }() /**
	      * List participants of the channel (other than you)
	      */;
	  _proto.getCurrentParticipants = function getCurrentParticipants() {
	    return Object.keys(this.secrets);
	  }
	  /**
	  * Subscribe to the changing list of participants by channel admins
	  */;
	  _proto.getParticipants = function getParticipants(callback) {
	    if (this.getParticipantsCallbackId) {
	      this.getParticipantsCallbackId++;
	    } else {
	      this.getParticipantsCallbackId = 1;
	    }
	    this.getParticipantsCallbacks[this.getParticipantsCallbackId] = callback;
	    if (this.participants) {
	      callback(this.participants);
	    }
	  };
	  _proto.participantsChanged = function participantsChanged() {
	    var _this4 = this;
	    Object.keys(this.getParticipantsCallbacks).forEach(function (id) {
	      _this4.getParticipantsCallbacks[id](_this4.participants);
	    });
	  }
	  /**
	  * Returns either the uuid of a group channel or the public key of a direct channel.
	  */;
	  _proto.getId = function getId() {
	    return this.uuid || this.getCurrentParticipants()[0];
	  };
	  _proto.getSecret = /*#__PURE__*/function () {
	    var _getSecret = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(pub) {
	      var epub;
	      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              if (this.secrets[pub]) {
	                _context5.next = 7;
	                break;
	              }
	              _context5.next = 3;
	              return util.gunOnceDefined(global$2().user(pub).get("epub"));
	            case 3:
	              epub = _context5.sent;
	              _context5.next = 6;
	              return gun$1.SEA.secret(epub, session.getKey());
	            case 6:
	              this.secrets[pub] = _context5.sent;
	            case 7:
	              return _context5.abrupt("return", this.secrets[pub]);
	            case 8:
	            case "end":
	              return _context5.stop();
	          }
	        }
	      }, _callee5, this);
	    }));
	    function getSecret(_x4) {
	      return _getSecret.apply(this, arguments);
	    }
	    return getSecret;
	  }() /**
	      *
	      */;
	  Channel.getOurSecretChannelId =
	  /*#__PURE__*/
	  function () {
	    var _getOurSecretChannelId = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(pub, pair) {
	      var epub, secret;
	      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              _context6.next = 2;
	              return util.gunOnceDefined(global$2().user(pub).get("epub"));
	            case 2:
	              epub = _context6.sent;
	              _context6.next = 5;
	              return gun$1.SEA.secret(epub, pair);
	            case 5:
	              secret = _context6.sent;
	              return _context6.abrupt("return", util.getHash(secret + pub));
	            case 7:
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6);
	    }));
	    function getOurSecretChannelId(_x5, _x6) {
	      return _getOurSecretChannelId.apply(this, arguments);
	    }
	    return getOurSecretChannelId;
	  }() /**
	      *
	      */;
	  Channel.getTheirSecretChannelId =
	  /*#__PURE__*/
	  function () {
	    var _getTheirSecretChannelId = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(pub, pair) {
	      var epub, secret;
	      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              _context7.next = 2;
	              return util.gunOnceDefined(global$2().user(pub).get("epub"));
	            case 2:
	              epub = _context7.sent;
	              _context7.next = 5;
	              return gun$1.SEA.secret(epub, pair);
	            case 5:
	              secret = _context7.sent;
	              return _context7.abrupt("return", util.getHash(secret + pair.pub));
	            case 7:
	            case "end":
	              return _context7.stop();
	          }
	        }
	      }, _callee7);
	    }));
	    function getTheirSecretChannelId(_x7, _x8) {
	      return _getTheirSecretChannelId.apply(this, arguments);
	    }
	    return getTheirSecretChannelId;
	  }() /**
	      * Calls back with Channels that you have initiated or written to.
	      * @param {Object} keypair Gun.SEA keypair that the gun instance is authenticated with
	      * @param callback callback function that is called for each public key you have a channel with
	      */;
	  Channel.getChannels =
	  /*#__PURE__*/
	  function () {
	    var _getChannels = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(callback, listenToChatLinks) {
	      var keypair, mySecret, seen, handleChannel;
	      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
	        while (1) {
	          switch (_context9.prev = _context9.next) {
	            case 0:
	              if (listenToChatLinks === void 0) {
	                listenToChatLinks = true;
	              }
	              keypair = session.getKey();
	              _context9.next = 4;
	              return gun$1.SEA.secret(keypair.epub, keypair);
	            case 4:
	              mySecret = _context9.sent;
	              if (listenToChatLinks) {
	                Channel.getMyChatLinks(undefined, undefined, true);
	              }
	              seen = {};
	              handleChannel = /*#__PURE__*/function () {
	                var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(value, ourSecretChannelId) {
	                  var encryptedChatId, chatId;
	                  return _regeneratorRuntime().wrap(function _callee8$(_context8) {
	                    while (1) {
	                      switch (_context8.prev = _context8.next) {
	                        case 0:
	                          if (!(value && !seen[ourSecretChannelId])) {
	                            _context8.next = 14;
	                            break;
	                          }
	                          seen[ourSecretChannelId] = true;
	                          if (!(ourSecretChannelId.length > 44)) {
	                            _context8.next = 5;
	                            break;
	                          }
	                          global$2().user().get("chats").get(ourSecretChannelId).put(null);
	                          return _context8.abrupt("return");
	                        case 5:
	                          _context8.next = 7;
	                          return util.gunOnceDefined(global$2().user().get("chats").get(ourSecretChannelId).get("pub"));
	                        case 7:
	                          encryptedChatId = _context8.sent;
	                          _context8.next = 10;
	                          return gun$1.SEA.decrypt(encryptedChatId, mySecret);
	                        case 10:
	                          chatId = _context8.sent;
	                          if (chatId) {
	                            _context8.next = 13;
	                            break;
	                          }
	                          return _context8.abrupt("return");
	                        case 13:
	                          if (chatId.pub || typeof chatId === "string") {
	                            callback(new Channel({
	                              key: keypair,
	                              participants: chatId.pub || chatId,
	                              save: false
	                            }));
	                          } else if (chatId.uuid && chatId.participants && chatId.myGroupSecret) {
	                            callback(new Channel({
	                              key: keypair,
	                              participants: chatId.participants,
	                              uuid: chatId.uuid,
	                              myGroupSecret: chatId.myGroupSecret,
	                              save: false
	                            }));
	                          }
	                        case 14:
	                        case "end":
	                          return _context8.stop();
	                      }
	                    }
	                  }, _callee8);
	                }));
	                return function handleChannel(_x11, _x12) {
	                  return _ref2.apply(this, arguments);
	                };
	              }();
	              global$2().user().get("chats").map().on(handleChannel);
	            case 9:
	            case "end":
	              return _context9.stop();
	          }
	        }
	      }, _callee9);
	    }));
	    function getChannels(_x9, _x10) {
	      return _getChannels.apply(this, arguments);
	    }
	    return getChannels;
	  }();
	  _proto.getMyGroupSecret = function getMyGroupSecret() {
	    if (!this.myGroupSecret) {
	      this.changeMyGroupSecret();
	    }
	    return this.myGroupSecret;
	  };
	  _proto.getOurSecretChannelId = /*#__PURE__*/function () {
	    var _getOurSecretChannelId2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10(pub) {
	      var secret;
	      return _regeneratorRuntime().wrap(function _callee10$(_context10) {
	        while (1) {
	          switch (_context10.prev = _context10.next) {
	            case 0:
	              if (this.ourSecretChannelIds[pub]) {
	                _context10.next = 7;
	                break;
	              }
	              _context10.next = 3;
	              return this.getSecret(pub);
	            case 3:
	              secret = _context10.sent;
	              _context10.next = 6;
	              return util.getHash(secret + pub);
	            case 6:
	              this.ourSecretChannelIds[pub] = _context10.sent;
	            case 7:
	              return _context10.abrupt("return", this.ourSecretChannelIds[pub]);
	            case 8:
	            case "end":
	              return _context10.stop();
	          }
	        }
	      }, _callee10, this);
	    }));
	    function getOurSecretChannelId(_x13) {
	      return _getOurSecretChannelId2.apply(this, arguments);
	    }
	    return getOurSecretChannelId;
	  }();
	  _proto.getTheirSecretChannelId = /*#__PURE__*/function () {
	    var _getTheirSecretChannelId2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(pub) {
	      var secret;
	      return _regeneratorRuntime().wrap(function _callee11$(_context11) {
	        while (1) {
	          switch (_context11.prev = _context11.next) {
	            case 0:
	              if (this.theirSecretChannelIds[pub]) {
	                _context11.next = 7;
	                break;
	              }
	              _context11.next = 3;
	              return this.getSecret(pub);
	            case 3:
	              secret = _context11.sent;
	              _context11.next = 6;
	              return util.getHash(secret + session.getKey().pub);
	            case 6:
	              this.theirSecretChannelIds[pub] = _context11.sent;
	            case 7:
	              return _context11.abrupt("return", this.theirSecretChannelIds[pub]);
	            case 8:
	            case "end":
	              return _context11.stop();
	          }
	        }
	      }, _callee11, this);
	    }));
	    function getTheirSecretChannelId(_x14) {
	      return _getTheirSecretChannelId2.apply(this, arguments);
	    }
	    return getTheirSecretChannelId;
	  }() /**
	      * Get messages from the channel
	      */;
	  _proto.getMessages =
	  /*#__PURE__*/
	  function () {
	    var _getMessages = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee13(callback) {
	      var _this5 = this;
	      var mySecretUuid;
	      return _regeneratorRuntime().wrap(function _callee13$(_context13) {
	        while (1) {
	          switch (_context13.prev = _context13.next) {
	            case 0:
	              this.getCurrentParticipants().forEach( /*#__PURE__*/function () {
	                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee12(pub) {
	                  var theirSecretChannelId, ourSecretChannelId;
	                  return _regeneratorRuntime().wrap(function _callee12$(_context12) {
	                    while (1) {
	                      switch (_context12.prev = _context12.next) {
	                        case 0:
	                          if (!(pub !== session.getKey().pub)) {
	                            _context12.next = 11;
	                            break;
	                          }
	                          if (!_this5.uuid) {
	                            _context12.next = 7;
	                            break;
	                          }
	                          _context12.next = 4;
	                          return _this5.getTheirSecretUuid(pub);
	                        case 4:
	                          theirSecretChannelId = _context12.sent;
	                          _context12.next = 10;
	                          break;
	                        case 7:
	                          _context12.next = 9;
	                          return _this5.getTheirSecretChannelId(pub);
	                        case 9:
	                          theirSecretChannelId = _context12.sent;
	                        case 10:
	                          global$2().user(pub).get("chats").get(theirSecretChannelId).get("msgs").map().once(function (data, key) {
	                            _this5.messageReceived(callback, data, _this5.uuid || pub, false, key, pub);
	                          });
	                        case 11:
	                          if (_this5.uuid) {
	                            _context12.next = 16;
	                            break;
	                          }
	                          _context12.next = 14;
	                          return _this5.getOurSecretChannelId(pub);
	                        case 14:
	                          ourSecretChannelId = _context12.sent;
	                          publicState().get("chats").get(ourSecretChannelId).get("msgs").map().once(function (data, key) {
	                            _this5.messageReceived(callback, data, pub, true, key, session.getKey().pub);
	                          });
	                        case 16:
	                        case "end":
	                          return _context12.stop();
	                      }
	                    }
	                  }, _callee12);
	                }));
	                return function (_x16) {
	                  return _ref3.apply(this, arguments);
	                };
	              }());
	              if (!this.uuid) {
	                _context13.next = 6;
	                break;
	              }
	              _context13.next = 4;
	              return this.getMySecretUuid();
	            case 4:
	              mySecretUuid = _context13.sent;
	              publicState().get("chats").get(mySecretUuid).get("msgs").map().once(function (data, key) {
	                _this5.messageReceived(callback, data, _this5.uuid, true, key, session.getKey().pub);
	              });
	            case 6:
	            case "end":
	              return _context13.stop();
	          }
	        }
	      }, _callee13, this);
	    }));
	    function getMessages(_x15) {
	      return _getMessages.apply(this, arguments);
	    }
	    return getMessages;
	  }();
	  _proto.messageReceived = /*#__PURE__*/function () {
	    var _messageReceived = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee14(callback, data, channelId, selfAuthored, key, from) {
	      var secret, decrypted, info;
	      return _regeneratorRuntime().wrap(function _callee14$(_context14) {
	        while (1) {
	          switch (_context14.prev = _context14.next) {
	            case 0:
	              if (!(this.messages[key] || !data)) {
	                _context14.next = 2;
	                break;
	              }
	              return _context14.abrupt("return");
	            case 2:
	              if (!this.uuid) {
	                _context14.next = 8;
	                break;
	              }
	              _context14.next = 5;
	              return this.getTheirGroupSecret(from);
	            case 5:
	              _context14.t0 = _context14.sent;
	              _context14.next = 11;
	              break;
	            case 8:
	              _context14.next = 10;
	              return this.getSecret(channelId);
	            case 10:
	              _context14.t0 = _context14.sent;
	            case 11:
	              secret = _context14.t0;
	              _context14.next = 14;
	              return gun$1.SEA.decrypt(data, secret);
	            case 14:
	              decrypted = _context14.sent;
	              if (!(typeof decrypted !== "object")) {
	                _context14.next = 17;
	                break;
	              }
	              return _context14.abrupt("return");
	            case 17:
	              info = {
	                selfAuthored: selfAuthored,
	                channelId: channelId,
	                from: from
	              };
	              this.messages[key] = decrypted;
	              callback(decrypted, info);
	            case 20:
	            case "end":
	              return _context14.stop();
	          }
	        }
	      }, _callee14, this);
	    }));
	    function messageReceived(_x17, _x18, _x19, _x20, _x21, _x22) {
	      return _messageReceived.apply(this, arguments);
	    }
	    return messageReceived;
	  }() /**
	      * Get latest message in this channel. Useful for channel listing.
	      */;
	  _proto.getLatestMsg =
	  /*#__PURE__*/
	  function () {
	    var _getLatestMsg = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee16(callback) {
	      var _this6 = this;
	      var callbackIfLatest;
	      return _regeneratorRuntime().wrap(function _callee16$(_context16) {
	        while (1) {
	          switch (_context16.prev = _context16.next) {
	            case 0:
	              callbackIfLatest = /*#__PURE__*/function () {
	                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee15(msg, info) {
	                  var t;
	                  return _regeneratorRuntime().wrap(function _callee15$(_context15) {
	                    while (1) {
	                      switch (_context15.prev = _context15.next) {
	                        case 0:
	                          if (!_this6.latest) {
	                            _this6.latest = msg;
	                            callback(msg, info);
	                          } else {
	                            t = typeof _this6.latest.time === "string" ? _this6.latest.time : _this6.latest.time.toISOString();
	                            if (t < msg.time) {
	                              _this6.latest = msg;
	                              callback(msg, info);
	                            }
	                          }
	                        case 1:
	                        case "end":
	                          return _context15.stop();
	                      }
	                    }
	                  }, _callee15);
	                }));
	                return function callbackIfLatest(_x24, _x25) {
	                  return _ref4.apply(this, arguments);
	                };
	              }();
	              this.onMy('latestMsg', function (msg) {
	                return callbackIfLatest(msg, {
	                  selfAuthored: true,
	                  from: session.getKey().pub
	                });
	              });
	              this.onTheir('latestMsg', function (msg, k, from) {
	                return callbackIfLatest(msg, {
	                  selfAuthored: false,
	                  from: from
	                });
	              });
	            case 3:
	            case "end":
	              return _context16.stop();
	          }
	        }
	      }, _callee16, this);
	    }));
	    function getLatestMsg(_x23) {
	      return _getLatestMsg.apply(this, arguments);
	    }
	    return getLatestMsg;
	  }() /**
	      * Useful for notifications
	      * @param {integer} time last seen msg time (default: now)
	      */;
	  _proto.setMyMsgsLastSeenTime =
	  /*#__PURE__*/
	  function () {
	    var _setMyMsgsLastSeenTime = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee17(time) {
	      return _regeneratorRuntime().wrap(function _callee17$(_context17) {
	        while (1) {
	          switch (_context17.prev = _context17.next) {
	            case 0:
	              time = time || new Date().toISOString();
	              return _context17.abrupt("return", this.put("msgsLastSeenTime", time));
	            case 2:
	            case "end":
	              return _context17.stop();
	          }
	        }
	      }, _callee17, this);
	    }));
	    function setMyMsgsLastSeenTime(_x26) {
	      return _setMyMsgsLastSeenTime.apply(this, arguments);
	    }
	    return setMyMsgsLastSeenTime;
	  }() /**
	      * Useful for notifications
	      */;
	  _proto.getMyMsgsLastSeenTime =
	  /*#__PURE__*/
	  function () {
	    var _getMyMsgsLastSeenTime = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee18(callback) {
	      var _this7 = this;
	      return _regeneratorRuntime().wrap(function _callee18$(_context18) {
	        while (1) {
	          switch (_context18.prev = _context18.next) {
	            case 0:
	              this.onMy("msgsLastSeenTime", function (time) {
	                _this7.myMsgsLastSeenTime = time;
	                if (callback) {
	                  callback(_this7.myMsgsLastSeenTime);
	                }
	              });
	            case 1:
	            case "end":
	              return _context18.stop();
	          }
	        }
	      }, _callee18, this);
	    }));
	    function getMyMsgsLastSeenTime(_x27) {
	      return _getMyMsgsLastSeenTime.apply(this, arguments);
	    }
	    return getMyMsgsLastSeenTime;
	  }() /**
	      * For "seen" status indicator
	      */;
	  _proto.getTheirMsgsLastSeenTime =
	  /*#__PURE__*/
	  function () {
	    var _getTheirMsgsLastSeenTime = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee19(callback) {
	      var _this8 = this;
	      return _regeneratorRuntime().wrap(function _callee19$(_context19) {
	        while (1) {
	          switch (_context19.prev = _context19.next) {
	            case 0:
	              this.onTheir("msgsLastSeenTime", function (time) {
	                _this8.theirMsgsLastSeenTime = time;
	                if (callback) {
	                  callback(_this8.theirMsgsLastSeenTime);
	                }
	              });
	            case 1:
	            case "end":
	              return _context19.stop();
	          }
	        }
	      }, _callee19, this);
	    }));
	    function getTheirMsgsLastSeenTime(_x28) {
	      return _getTheirMsgsLastSeenTime.apply(this, arguments);
	    }
	    return getTheirMsgsLastSeenTime;
	  }();
	  _proto.removeParticipant = /*#__PURE__*/function () {
	    var _removeParticipant = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee20(pub) {
	      return _regeneratorRuntime().wrap(function _callee20$(_context20) {
	        while (1) {
	          switch (_context20.prev = _context20.next) {
	            case 0:
	              this.addParticipant(pub, true, {
	                read: false,
	                write: false
	              });
	            case 1:
	            case "end":
	              return _context20.stop();
	          }
	        }
	      }, _callee20, this);
	    }));
	    function removeParticipant(_x29) {
	      return _removeParticipant.apply(this, arguments);
	    }
	    return removeParticipant;
	  }() /**
	      * Add a public key to the channel or update its permissions
	      * @param {string} pub
	      */;
	  _proto.addParticipant =
	  /*#__PURE__*/
	  function () {
	    var _addParticipant = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee21(pub, save, permissions, subscribe) {
	      var _this9 = this;
	      var ourSecretChannelId, mySecret;
	      return _regeneratorRuntime().wrap(function _callee21$(_context21) {
	        while (1) {
	          switch (_context21.prev = _context21.next) {
	            case 0:
	              if (save === void 0) {
	                save = true;
	              }
	              if (!this.uuid) {
	                _context21.next = 3;
	                break;
	              }
	              return _context21.abrupt("return");
	            case 3:
	              if (permissions === undefined) {
	                permissions = DEFAULT_PERMISSIONS;
	              }
	              if (!(this.secrets[pub] && JSON.stringify(this.secrets[pub]) === JSON.stringify(permissions))) {
	                _context21.next = 6;
	                break;
	              }
	              return _context21.abrupt("return");
	            case 6:
	              this.secrets[pub] = null;
	              this.getSecret(pub);
	              _context21.next = 10;
	              return this.getOurSecretChannelId(pub);
	            case 10:
	              ourSecretChannelId = _context21.sent;
	              if (!save) {
	                _context21.next = 20;
	                break;
	              }
	              _context21.next = 14;
	              return gun$1.SEA.secret(session.getKey().epub, session.getKey());
	            case 14:
	              mySecret = _context21.sent;
	              _context21.t0 = global$2().user().get("chats").get(ourSecretChannelId).get("pub");
	              _context21.next = 18;
	              return gun$1.SEA.encrypt({
	                pub: pub
	              }, mySecret);
	            case 18:
	              _context21.t1 = _context21.sent;
	              _context21.t0.put.call(_context21.t0, _context21.t1);
	            case 20:
	              if (this.uuid) {
	                this.participants[pub] = permissions;
	                if (save) {
	                  this.putDirect("S" + this.uuid, this.getMyGroupSecret());
	                  this.getMySecretUuid().then(function (s) {
	                    _this9.putDirect(_this9.uuid, s); // TODO: encrypt keys in put()
	                  });

	                  this.onTheirDirect(this.uuid, function (s, k, from) {
	                    _this9.theirSecretUuids[from] = s;
	                  });
	                  this.onTheirDirect("S" + this.uuid, function (s, k, from) {
	                    _this9.theirGroupSecrets[from] = s;
	                  });
	                  this.save();
	                }
	              }
	              if (subscribe) {
	                Object.values(this.directSubscriptions).forEach(function (arr) {
	                  arr.forEach(function (o) {
	                    if (!o.from || o.from === pub) {
	                      _this9._onTheirDirectFromUser(pub, o.key, o.callback);
	                    }
	                  });
	                });
	                Object.values(this.groupSubscriptions).forEach(function (arr) {
	                  arr.forEach(function (o) {
	                    if (o.from && o.from !== pub) {
	                      return;
	                    }
	                    if (permissions.write) {
	                      _this9._onTheirGroupFromUser(pub, o.key, o.callback);
	                    } else {
	                      // unsubscribe
	                      o.event && o.event.off();
	                    }
	                  });
	                });
	              }
	            case 22:
	            case "end":
	              return _context21.stop();
	          }
	        }
	      }, _callee21, this);
	    }));
	    function addParticipant(_x30, _x31, _x32, _x33) {
	      return _addParticipant.apply(this, arguments);
	    }
	    return addParticipant;
	  }() /**
	      * Send a message to the channel
	      * @param msg string or {time, text, ...} object
	      */;
	  _proto.send =
	  /*#__PURE__*/
	  function () {
	    var _send = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee22(msg) {
	      var encrypted, mySecretUuid, keys, i, _encrypted, ourSecretChannelId;
	      return _regeneratorRuntime().wrap(function _callee22$(_context22) {
	        while (1) {
	          switch (_context22.prev = _context22.next) {
	            case 0:
	              if (!(typeof msg === "string")) {
	                _context22.next = 7;
	                break;
	              }
	              msg = msg.trim();
	              if (!(msg.length === 0)) {
	                _context22.next = 4;
	                break;
	              }
	              return _context22.abrupt("return");
	            case 4:
	              msg = {
	                time: new Date().toISOString(),
	                text: msg
	              };
	              _context22.next = 12;
	              break;
	            case 7:
	              if (!(typeof msg === "object")) {
	                _context22.next = 11;
	                break;
	              }
	              msg.time = msg.time || new Date().toISOString();
	              _context22.next = 12;
	              break;
	            case 11:
	              throw new Error("msg param must be a string or an object");
	            case 12:
	              if (!this.uuid) {
	                _context22.next = 23;
	                break;
	              }
	              _context22.next = 15;
	              return gun$1.SEA.encrypt(JSON.stringify(msg), this.getMyGroupSecret());
	            case 15:
	              encrypted = _context22.sent;
	              _context22.next = 18;
	              return this.getMySecretUuid();
	            case 18:
	              mySecretUuid = _context22.sent;
	              publicState().get("chats").get(mySecretUuid).get("msgs").get("" + msg.time).put(encrypted);
	              publicState().get("chats").get(mySecretUuid).get("latestMsg").put(encrypted);
	              _context22.next = 42;
	              break;
	            case 23:
	              keys = this.getCurrentParticipants();
	              i = 0;
	            case 25:
	              if (!(i < keys.length)) {
	                _context22.next = 42;
	                break;
	              }
	              _context22.t0 = gun$1.SEA;
	              _context22.t1 = JSON.stringify(msg);
	              _context22.next = 30;
	              return this.getSecret(keys[i]);
	            case 30:
	              _context22.t2 = _context22.sent;
	              _context22.next = 33;
	              return _context22.t0.encrypt.call(_context22.t0, _context22.t1, _context22.t2);
	            case 33:
	              _encrypted = _context22.sent;
	              _context22.next = 36;
	              return this.getOurSecretChannelId(keys[i]);
	            case 36:
	              ourSecretChannelId = _context22.sent;
	              publicState().get("chats").get(ourSecretChannelId).get("msgs").get("" + msg.time).put(_encrypted);
	              publicState().get("chats").get(ourSecretChannelId).get("latestMsg").put(_encrypted);
	            case 39:
	              i++;
	              _context22.next = 25;
	              break;
	            case 42:
	            case "end":
	              return _context22.stop();
	          }
	        }
	      }, _callee22, this);
	    }));
	    function send(_x34) {
	      return _send.apply(this, arguments);
	    }
	    return send;
	  }() /**
	      * Save the channel to our channels list without sending a message
	      */;
	  _proto.save =
	  /*#__PURE__*/
	  function () {
	    var _save = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee23() {
	      var mySecretUuid, mySecret, keys, i, ourSecretChannelId;
	      return _regeneratorRuntime().wrap(function _callee23$(_context23) {
	        while (1) {
	          switch (_context23.prev = _context23.next) {
	            case 0:
	              if (!this.uuid) {
	                _context23.next = 17;
	                break;
	              }
	              _context23.next = 3;
	              return this.getMySecretUuid();
	            case 3:
	              mySecretUuid = _context23.sent;
	              publicState().get("chats").get(mySecretUuid).get('msgs').get('a').put(null);
	              this.put("participants", this.participants); // public participants list
	              _context23.next = 8;
	              return gun$1.SEA.secret(session.getKey().epub, session.getKey());
	            case 8:
	              mySecret = _context23.sent;
	              _context23.t0 = publicState().get("chats").get(mySecretUuid).get("pub");
	              _context23.next = 12;
	              return gun$1.SEA.encrypt({
	                uuid: this.uuid,
	                myGroupSecret: this.getMyGroupSecret(),
	                participants: this.participants // private participants list
	              }, mySecret);
	            case 12:
	              _context23.t1 = _context23.sent;
	              _context23.t0.put.call(_context23.t0, _context23.t1);
	              this.participantsChanged();
	              _context23.next = 27;
	              break;
	            case 17:
	              keys = this.getCurrentParticipants();
	              i = 0;
	            case 19:
	              if (!(i < keys.length)) {
	                _context23.next = 27;
	                break;
	              }
	              _context23.next = 22;
	              return this.getOurSecretChannelId(keys[i]);
	            case 22:
	              ourSecretChannelId = _context23.sent;
	              publicState().get("chats").get(ourSecretChannelId).get('msgs').get('a').put(null);
	            case 24:
	              i++;
	              _context23.next = 19;
	              break;
	            case 27:
	            case "end":
	              return _context23.stop();
	          }
	        }
	      }, _callee23, this);
	    }));
	    function save() {
	      return _save.apply(this, arguments);
	    }
	    return save;
	  }() /**
	      * Save a key-value pair, encrypt value. Each participant in the Channel writes to their own version of the key-value pair — they don't overwrite the same one.
	      * @param {string} key
	      * @param value
	      */;
	  _proto.put =
	  /*#__PURE__*/
	  function () {
	    var _put = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee24(key, value) {
	      return _regeneratorRuntime().wrap(function _callee24$(_context24) {
	        while (1) {
	          switch (_context24.prev = _context24.next) {
	            case 0:
	              return _context24.abrupt("return", (this.uuid ? this.putGroup : this.putDirect).call(this, key, value));
	            case 1:
	            case "end":
	              return _context24.stop();
	          }
	        }
	      }, _callee24, this);
	    }));
	    function put(_x35, _x36) {
	      return _put.apply(this, arguments);
	    }
	    return put;
	  }();
	  _proto.putGroup = /*#__PURE__*/function () {
	    var _putGroup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee25(key, value) {
	      var encrypted, mySecretUuid;
	      return _regeneratorRuntime().wrap(function _callee25$(_context25) {
	        while (1) {
	          switch (_context25.prev = _context25.next) {
	            case 0:
	              if (!(key === "msgs")) {
	                _context25.next = 2;
	                break;
	              }
	              throw new Error("Sorry, you can't overwrite the msgs field which is used for .send()");
	            case 2:
	              _context25.next = 4;
	              return gun$1.SEA.encrypt(JSON.stringify(value), this.getMyGroupSecret());
	            case 4:
	              encrypted = _context25.sent;
	              _context25.next = 7;
	              return this.getMySecretUuid();
	            case 7:
	              mySecretUuid = _context25.sent;
	              publicState().get("chats").get(mySecretUuid).get(key).put(encrypted);
	            case 9:
	            case "end":
	              return _context25.stop();
	          }
	        }
	      }, _callee25, this);
	    }));
	    function putGroup(_x37, _x38) {
	      return _putGroup.apply(this, arguments);
	    }
	    return putGroup;
	  }();
	  _proto.putDirect = /*#__PURE__*/function () {
	    var _putDirect = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee26(key, value) {
	      var keys, i, encrypted, ourSecretChannelId;
	      return _regeneratorRuntime().wrap(function _callee26$(_context26) {
	        while (1) {
	          switch (_context26.prev = _context26.next) {
	            case 0:
	              if (!(key === "msgs")) {
	                _context26.next = 2;
	                break;
	              }
	              throw new Error("Sorry, you can't overwrite the msgs field which is used for .send()");
	            case 2:
	              keys = this.getCurrentParticipants();
	              i = 0;
	            case 4:
	              if (!(i < keys.length)) {
	                _context26.next = 20;
	                break;
	              }
	              _context26.t0 = gun$1.SEA;
	              _context26.t1 = JSON.stringify(value);
	              _context26.next = 9;
	              return this.getSecret(keys[i]);
	            case 9:
	              _context26.t2 = _context26.sent;
	              _context26.next = 12;
	              return _context26.t0.encrypt.call(_context26.t0, _context26.t1, _context26.t2);
	            case 12:
	              encrypted = _context26.sent;
	              _context26.next = 15;
	              return this.getOurSecretChannelId(keys[i]);
	            case 15:
	              ourSecretChannelId = _context26.sent;
	              publicState().get("chats").get(ourSecretChannelId).get(key).put(encrypted);
	            case 17:
	              i++;
	              _context26.next = 4;
	              break;
	            case 20:
	            case "end":
	              return _context26.stop();
	          }
	        }
	      }, _callee26, this);
	    }));
	    function putDirect(_x39, _x40) {
	      return _putDirect.apply(this, arguments);
	    }
	    return putDirect;
	  }() /**
	      * Subscribe to a key-value pair. Callback returns every participant's value unless you limit it with *from* param.
	      * @param {string} key
	      * @param {function} callback
	      * @param {string} from public key whose value you want, or *"me"* for your value only, or *"them"* for the value of others only
	      */;
	  _proto.on =
	  /*#__PURE__*/
	  function () {
	    var _on = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee27(key, callback, from) {
	      return _regeneratorRuntime().wrap(function _callee27$(_context27) {
	        while (1) {
	          switch (_context27.prev = _context27.next) {
	            case 0:
	              return _context27.abrupt("return", (this.uuid ? this.onGroup : this.onDirect).call(this, key, callback, from));
	            case 1:
	            case "end":
	              return _context27.stop();
	          }
	        }
	      }, _callee27, this);
	    }));
	    function on(_x41, _x42, _x43) {
	      return _on.apply(this, arguments);
	    }
	    return on;
	  }();
	  _proto.onDirect = /*#__PURE__*/function () {
	    var _onDirect = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee28(key, callback, from) {
	      return _regeneratorRuntime().wrap(function _callee28$(_context28) {
	        while (1) {
	          switch (_context28.prev = _context28.next) {
	            case 0:
	              if (!from || from === "me" || from === session.getKey().pub) {
	                this.onMy(key, function (val) {
	                  return callback(val, session.getKey().pub);
	                });
	              }
	              if (!from || from !== "me" && from !== session.getKey().pub) {
	                this.onTheir(key, function (val, k, pub) {
	                  return callback(val, pub);
	                });
	              }
	            case 2:
	            case "end":
	              return _context28.stop();
	          }
	        }
	      }, _callee28, this);
	    }));
	    function onDirect(_x44, _x45, _x46) {
	      return _onDirect.apply(this, arguments);
	    }
	    return onDirect;
	  }();
	  _proto.onGroup = /*#__PURE__*/function () {
	    var _onGroup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee29(key, callback, from) {
	      return _regeneratorRuntime().wrap(function _callee29$(_context29) {
	        while (1) {
	          switch (_context29.prev = _context29.next) {
	            case 0:
	              if (!from || from === "me" || from === session.getKey().pub) {
	                this.onMyGroup(key, function (val) {
	                  return callback(val, session.getKey().pub);
	                });
	              }
	              if (!from || from !== "me" && from !== session.getKey().pub) {
	                this.onTheirGroup(key, function (val, k, pub) {
	                  return callback(val, pub);
	                });
	              }
	            case 2:
	            case "end":
	              return _context29.stop();
	          }
	        }
	      }, _callee29, this);
	    }));
	    function onGroup(_x47, _x48, _x49) {
	      return _onGroup.apply(this, arguments);
	    }
	    return onGroup;
	  }();
	  _proto.onMy = /*#__PURE__*/function () {
	    var _onMy = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee30(key, callback) {
	      return _regeneratorRuntime().wrap(function _callee30$(_context30) {
	        while (1) {
	          switch (_context30.prev = _context30.next) {
	            case 0:
	              return _context30.abrupt("return", (this.uuid ? this.onMyGroup : this.onMyDirect).call(this, key, callback));
	            case 1:
	            case "end":
	              return _context30.stop();
	          }
	        }
	      }, _callee30, this);
	    }));
	    function onMy(_x50, _x51) {
	      return _onMy.apply(this, arguments);
	    }
	    return onMy;
	  }();
	  _proto.onMyDirect = /*#__PURE__*/function () {
	    var _onMyDirect = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee32(key, callback) {
	      var _this10 = this;
	      var keys, _loop, i, _ret;
	      return _regeneratorRuntime().wrap(function _callee32$(_context33) {
	        while (1) {
	          switch (_context33.prev = _context33.next) {
	            case 0:
	              if (!(typeof callback !== 'function')) {
	                _context33.next = 2;
	                break;
	              }
	              throw new Error("onMy callback must be a function, got " + typeof callback);
	            case 2:
	              keys = this.getCurrentParticipants();
	              _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop(i) {
	                var ourSecretChannelId;
	                return _regeneratorRuntime().wrap(function _loop$(_context32) {
	                  while (1) {
	                    switch (_context32.prev = _context32.next) {
	                      case 0:
	                        _context32.next = 2;
	                        return _this10.getOurSecretChannelId(keys[i]);
	                      case 2:
	                        ourSecretChannelId = _context32.sent;
	                        global$2().user().get("chats").get(ourSecretChannelId).get(key).on( /*#__PURE__*/function () {
	                          var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee31(data) {
	                            var decrypted;
	                            return _regeneratorRuntime().wrap(function _callee31$(_context31) {
	                              while (1) {
	                                switch (_context31.prev = _context31.next) {
	                                  case 0:
	                                    _context31.t0 = gun$1.SEA;
	                                    _context31.t1 = data;
	                                    _context31.next = 4;
	                                    return _this10.getSecret(keys[i]);
	                                  case 4:
	                                    _context31.t2 = _context31.sent;
	                                    _context31.next = 7;
	                                    return _context31.t0.decrypt.call(_context31.t0, _context31.t1, _context31.t2);
	                                  case 7:
	                                    decrypted = _context31.sent;
	                                    if (decrypted) {
	                                      callback(typeof decrypted.v !== "undefined" ? decrypted.v : decrypted, key);
	                                    }
	                                  case 9:
	                                  case "end":
	                                    return _context31.stop();
	                                }
	                              }
	                            }, _callee31);
	                          }));
	                          return function (_x54) {
	                            return _ref5.apply(this, arguments);
	                          };
	                        }());
	                        return _context32.abrupt("return", "break");
	                      case 5:
	                      case "end":
	                        return _context32.stop();
	                    }
	                  }
	                }, _loop);
	              });
	              i = 0;
	            case 5:
	              if (!(i < keys.length)) {
	                _context33.next = 13;
	                break;
	              }
	              return _context33.delegateYield(_loop(i), "t0", 7);
	            case 7:
	              _ret = _context33.t0;
	              if (!(_ret === "break")) {
	                _context33.next = 10;
	                break;
	              }
	              return _context33.abrupt("break", 13);
	            case 10:
	              i++;
	              _context33.next = 5;
	              break;
	            case 13:
	            case "end":
	              return _context33.stop();
	          }
	        }
	      }, _callee32, this);
	    }));
	    function onMyDirect(_x52, _x53) {
	      return _onMyDirect.apply(this, arguments);
	    }
	    return onMyDirect;
	  }();
	  _proto.onMyGroup = /*#__PURE__*/function () {
	    var _onMyGroup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee34(key, callback) {
	      var mySecretUuid, mySecret;
	      return _regeneratorRuntime().wrap(function _callee34$(_context35) {
	        while (1) {
	          switch (_context35.prev = _context35.next) {
	            case 0:
	              if (!(typeof callback !== 'function')) {
	                _context35.next = 2;
	                break;
	              }
	              throw new Error("onMy callback must be a function, got " + typeof callback);
	            case 2:
	              _context35.next = 4;
	              return this.getMySecretUuid();
	            case 4:
	              mySecretUuid = _context35.sent;
	              _context35.next = 7;
	              return this.getMyGroupSecret();
	            case 7:
	              mySecret = _context35.sent;
	              global$2().user().get("chats").get(mySecretUuid).get(key).on( /*#__PURE__*/function () {
	                var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee33(data) {
	                  var decrypted;
	                  return _regeneratorRuntime().wrap(function _callee33$(_context34) {
	                    while (1) {
	                      switch (_context34.prev = _context34.next) {
	                        case 0:
	                          _context34.next = 2;
	                          return gun$1.SEA.decrypt(data, mySecret);
	                        case 2:
	                          decrypted = _context34.sent;
	                          if (decrypted) {
	                            callback(typeof decrypted.v !== "undefined" ? decrypted.v : decrypted, key, session.getKey().pub);
	                          }
	                        case 4:
	                        case "end":
	                          return _context34.stop();
	                      }
	                    }
	                  }, _callee33);
	                }));
	                return function (_x57) {
	                  return _ref6.apply(this, arguments);
	                };
	              }());
	            case 9:
	            case "end":
	              return _context35.stop();
	          }
	        }
	      }, _callee34, this);
	    }));
	    function onMyGroup(_x55, _x56) {
	      return _onMyGroup.apply(this, arguments);
	    }
	    return onMyGroup;
	  }();
	  _proto.onTheir = /*#__PURE__*/function () {
	    var _onTheir = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee35(key, callback, from) {
	      return _regeneratorRuntime().wrap(function _callee35$(_context36) {
	        while (1) {
	          switch (_context36.prev = _context36.next) {
	            case 0:
	              return _context36.abrupt("return", (this.uuid ? this.onTheirGroup : this.onTheirDirect).call(this, key, callback, from));
	            case 1:
	            case "end":
	              return _context36.stop();
	          }
	        }
	      }, _callee35, this);
	    }));
	    function onTheir(_x58, _x59, _x60) {
	      return _onTheir.apply(this, arguments);
	    }
	    return onTheir;
	  }();
	  _proto._onTheirDirectFromUser = /*#__PURE__*/function () {
	    var _onTheirDirectFromUser2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee37(key, callback, pub) {
	      var _this11 = this;
	      var theirSecretChannelId;
	      return _regeneratorRuntime().wrap(function _callee37$(_context38) {
	        while (1) {
	          switch (_context38.prev = _context38.next) {
	            case 0:
	              if (this.hasWritePermission(pub)) {
	                _context38.next = 2;
	                break;
	              }
	              return _context38.abrupt("return");
	            case 2:
	              _context38.next = 4;
	              return this.getTheirSecretChannelId(pub);
	            case 4:
	              theirSecretChannelId = _context38.sent;
	              global$2().user(pub).get("chats").get(theirSecretChannelId).get(key).on( /*#__PURE__*/function () {
	                var _ref7 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee36(data) {
	                  var decrypted;
	                  return _regeneratorRuntime().wrap(function _callee36$(_context37) {
	                    while (1) {
	                      switch (_context37.prev = _context37.next) {
	                        case 0:
	                          if (_this11.hasWritePermission(pub)) {
	                            _context37.next = 2;
	                            break;
	                          }
	                          return _context37.abrupt("return");
	                        case 2:
	                          _context37.t0 = gun$1.SEA;
	                          _context37.t1 = data;
	                          _context37.next = 6;
	                          return _this11.getSecret(pub);
	                        case 6:
	                          _context37.t2 = _context37.sent;
	                          _context37.next = 9;
	                          return _context37.t0.decrypt.call(_context37.t0, _context37.t1, _context37.t2);
	                        case 9:
	                          decrypted = _context37.sent;
	                          if (decrypted) {
	                            callback(typeof decrypted.v !== "undefined" ? decrypted.v : decrypted, key, pub);
	                          }
	                        case 11:
	                        case "end":
	                          return _context37.stop();
	                      }
	                    }
	                  }, _callee36);
	                }));
	                return function (_x64) {
	                  return _ref7.apply(this, arguments);
	                };
	              }());
	            case 6:
	            case "end":
	              return _context38.stop();
	          }
	        }
	      }, _callee37, this);
	    }));
	    function _onTheirDirectFromUser(_x61, _x62, _x63) {
	      return _onTheirDirectFromUser2.apply(this, arguments);
	    }
	    return _onTheirDirectFromUser;
	  }();
	  _proto.onTheirDirect = /*#__PURE__*/function () {
	    var _onTheirDirect = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee39(key, callback, from) {
	      var _this12 = this;
	      var participants;
	      return _regeneratorRuntime().wrap(function _callee39$(_context40) {
	        while (1) {
	          switch (_context40.prev = _context40.next) {
	            case 0:
	              if (!(typeof callback !== 'function')) {
	                _context40.next = 2;
	                break;
	              }
	              throw new Error("onTheir callback must be a function, got " + typeof callback);
	            case 2:
	              if (!Object.prototype.hasOwnProperty.call(this.directSubscriptions, key)) {
	                this.directSubscriptions[key] = [];
	              }
	              this.directSubscriptions[key].push({
	                key: key,
	                callback: callback,
	                from: from
	              });
	              participants = this.getCurrentParticipants();
	              participants.forEach( /*#__PURE__*/function () {
	                var _ref8 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee38(pub) {
	                  return _regeneratorRuntime().wrap(function _callee38$(_context39) {
	                    while (1) {
	                      switch (_context39.prev = _context39.next) {
	                        case 0:
	                          if (!(from && pub !== from)) {
	                            _context39.next = 2;
	                            break;
	                          }
	                          return _context39.abrupt("return");
	                        case 2:
	                          _this12._onTheirDirectFromUser(pub, key, callback);
	                        case 3:
	                        case "end":
	                          return _context39.stop();
	                      }
	                    }
	                  }, _callee38);
	                }));
	                return function (_x68) {
	                  return _ref8.apply(this, arguments);
	                };
	              }());
	            case 6:
	            case "end":
	              return _context40.stop();
	          }
	        }
	      }, _callee39, this);
	    }));
	    function onTheirDirect(_x65, _x66, _x67) {
	      return _onTheirDirect.apply(this, arguments);
	    }
	    return onTheirDirect;
	  }();
	  _proto.hasWritePermission = function hasWritePermission(pub) {
	    return !this.uuid || this.participants && this.participants[pub] && this.participants[pub].write;
	  };
	  _proto._onTheirGroupFromUser = /*#__PURE__*/function () {
	    var _onTheirGroupFromUser2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee41(pub, key, callback, subscription) {
	      var _this13 = this;
	      var theirSecretUuid;
	      return _regeneratorRuntime().wrap(function _callee41$(_context42) {
	        while (1) {
	          switch (_context42.prev = _context42.next) {
	            case 0:
	              if (this.hasWritePermission(pub)) {
	                _context42.next = 2;
	                break;
	              }
	              return _context42.abrupt("return");
	            case 2:
	              _context42.next = 4;
	              return this.getTheirSecretUuid(pub);
	            case 4:
	              theirSecretUuid = _context42.sent;
	              global$2().user(pub).get("chats").get(theirSecretUuid).get(key).on( /*#__PURE__*/function () {
	                var _ref9 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee40(data, _a, _b, e) {
	                  var decrypted;
	                  return _regeneratorRuntime().wrap(function _callee40$(_context41) {
	                    while (1) {
	                      switch (_context41.prev = _context41.next) {
	                        case 0:
	                          if (subscription) {
	                            subscription.event = e;
	                          }
	                          if (_this13.hasWritePermission(pub)) {
	                            _context41.next = 3;
	                            break;
	                          }
	                          return _context41.abrupt("return");
	                        case 3:
	                          _context41.t0 = gun$1.SEA;
	                          _context41.t1 = data;
	                          _context41.next = 7;
	                          return _this13.getTheirGroupSecret(pub);
	                        case 7:
	                          _context41.t2 = _context41.sent;
	                          _context41.next = 10;
	                          return _context41.t0.decrypt.call(_context41.t0, _context41.t1, _context41.t2);
	                        case 10:
	                          decrypted = _context41.sent;
	                          if (decrypted) {
	                            callback(typeof decrypted.v !== "undefined" ? decrypted.v : decrypted, key, pub);
	                          }
	                        case 12:
	                        case "end":
	                          return _context41.stop();
	                      }
	                    }
	                  }, _callee40);
	                }));
	                return function (_x73, _x74, _x75, _x76) {
	                  return _ref9.apply(this, arguments);
	                };
	              }());
	            case 6:
	            case "end":
	              return _context42.stop();
	          }
	        }
	      }, _callee41, this);
	    }));
	    function _onTheirGroupFromUser(_x69, _x70, _x71, _x72) {
	      return _onTheirGroupFromUser2.apply(this, arguments);
	    }
	    return _onTheirGroupFromUser;
	  }();
	  _proto.onTheirGroup = /*#__PURE__*/function () {
	    var _onTheirGroup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee43(key, callback, from) {
	      var _this14 = this;
	      var subscription;
	      return _regeneratorRuntime().wrap(function _callee43$(_context44) {
	        while (1) {
	          switch (_context44.prev = _context44.next) {
	            case 0:
	              if (!(typeof callback !== 'function')) {
	                _context44.next = 2;
	                break;
	              }
	              throw new Error("onTheir callback must be a function, got " + typeof callback);
	            case 2:
	              if (!Object.prototype.hasOwnProperty.call(this.groupSubscriptions, key)) {
	                this.groupSubscriptions[key] = [];
	              }
	              subscription = {
	                key: key,
	                callback: callback,
	                from: from
	              };
	              this.groupSubscriptions[key].push(subscription);
	              this.getParticipants(function (participants) {
	                Object.keys(participants).forEach( /*#__PURE__*/function () {
	                  var _ref10 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee42(pub) {
	                    return _regeneratorRuntime().wrap(function _callee42$(_context43) {
	                      while (1) {
	                        switch (_context43.prev = _context43.next) {
	                          case 0:
	                            if (!(from && pub !== from)) {
	                              _context43.next = 2;
	                              break;
	                            }
	                            return _context43.abrupt("return");
	                          case 2:
	                            if (participants[pub] && participants[pub].write) {
	                              _context43.next = 4;
	                              break;
	                            }
	                            return _context43.abrupt("return");
	                          case 4:
	                            _this14._onTheirGroupFromUser(pub, key, callback, subscription);
	                          case 5:
	                          case "end":
	                            return _context43.stop();
	                        }
	                      }
	                    }, _callee42);
	                  }));
	                  return function (_x80) {
	                    return _ref10.apply(this, arguments);
	                  };
	                }());
	              });
	            case 6:
	            case "end":
	              return _context44.stop();
	          }
	        }
	      }, _callee43, this);
	    }));
	    function onTheirGroup(_x77, _x78, _x79) {
	      return _onTheirGroup.apply(this, arguments);
	    }
	    return onTheirGroup;
	  }() /**
	      * Set typing status
	      */;
	  _proto.setTyping = function setTyping(isTyping, timeout) {
	    var _this15 = this;
	    if (timeout === void 0) {
	      timeout = 5;
	    }
	    isTyping = typeof isTyping === "undefined" ? true : isTyping;
	    timeout = timeout * 1000;
	    this.put("typing", isTyping ? new Date().toISOString() : new Date(0).toISOString());
	    clearTimeout(this.setTypingTimeout);
	    this.setTypingTimeout = setTimeout(function () {
	      return _this15.put("typing", false);
	    }, timeout);
	  }
	  /**
	  * Get typing status
	  */;
	  _proto.getTyping = function getTyping(callback, timeout) {
	    var _this16 = this;
	    if (timeout === void 0) {
	      timeout = 5;
	    }
	    timeout = timeout * 1000;
	    this.onTheir("typing", function (typing, key, pub) {
	      if (callback) {
	        var isTyping = typing && new Date() - new Date(typing) <= timeout;
	        callback(isTyping, pub);
	        _this16.getTypingTimeouts = _this16.getTypingTimeouts || {};
	        clearTimeout(_this16.getTypingTimeouts[pub]);
	        if (isTyping) {
	          _this16.getTypingTimeouts[pub] = setTimeout(function () {
	            return callback(false, pub);
	          }, timeout);
	        }
	      }
	    });
	  }
	  /**
	  * Add a chat button to page
	  * @param options {label, channelOptions}
	  */;
	  Channel.addChatButton = function addChatButton(options) {
	    if (options === void 0) {
	      options = {};
	    }
	    options = Object.assign({
	      label: 'Chat'
	    }, options);
	    if (!options.channelOptions) {
	      throw new Error('addChatButton missing options.channelOptions param');
	    }
	    util.injectCss();
	    var channel, box;
	    var btn = util.createElement('div', 'iris-chat-open-button', document.body);
	    btn.setAttribute('id', 'iris-chat-open-button');
	    btn.innerHTML = "<svg style=\"margin-right:7px;margin-bottom: -0.2em\" version=\"1.1\" id=\"Capa_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 510 510\" xml:space=\"preserve\"><path fill=\"currentColor\" d=\"M459,0H51C22.95,0,0,22.95,0,51v459l102-102h357c28.05,0,51-22.95,51-51V51C510,22.95,487.05,0,459,0z M102,178.5h306v51 H102V178.5z M306,306H102v-51h204V306z M408,153H102v-51h306V153z\"></path></svg> " + options.label;
	    btn.addEventListener('click', function () {
	      btn.setAttribute('style', 'display: none');
	      if (!channel) {
	        channel = new Channel(options.channelOptions);
	        box = channel.getChatBox();
	        document.body.appendChild(box);
	      } else {
	        box.setAttribute('style', ''); // show
	      }
	    });
	  }
	  /**
	  * Get a simple link that points to the channel.
	  *
	  * Direct channel: both users need to give their simple links. Use createChatLink() to get a two-way link that needs to be given by one user only.
	  *
	  * Group channel: Works only if the link recipient has been already added onto the channel participants list.
	  */;
	  _proto.getSimpleLink = function getSimpleLink(urlRoot) {
	    if (urlRoot === void 0) {
	      urlRoot = 'https://iris.to/';
	    }
	    if (this.uuid) {
	      return urlRoot + "?channelId=" + this.uuid + "&inviter=" + session.getKey().pub;
	    }
	    return urlRoot + "?chatWith=" + this.getCurrentParticipants()[0];
	  }
	  /**
	  *
	  */;
	  _proto.getChatLinks =
	  /*#__PURE__*/
	  function () {
	    var _getChatLinks = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee45(opts) {
	      var _this17 = this;
	      var _opts, callback, urlRoot, subscribe, chatLinks, chatLinkSubscriptions;
	      return _regeneratorRuntime().wrap(function _callee45$(_context46) {
	        while (1) {
	          switch (_context46.prev = _context46.next) {
	            case 0:
	              if (opts === void 0) {
	                opts = {};
	              }
	              _opts = opts, callback = _opts.callback, urlRoot = _opts.urlRoot, subscribe = _opts.subscribe;
	              urlRoot = urlRoot || 'https://iris.to/';
	              if (this.uuid) {
	                _context46.next = 5;
	                break;
	              }
	              throw new Error('Only group channels may have chat links');
	            case 5:
	              chatLinks = [];
	              chatLinkSubscriptions = {};
	              this.on('chatLinks', function (links, from) {
	                // TODO: check admin permissions
	                if (!links || typeof links !== 'object') {
	                  return;
	                }
	                Object.keys(links).forEach(function (linkId) {
	                  var link = links[linkId];
	                  if (link === null) {
	                    chatLinkSubscriptions[linkId] && chatLinkSubscriptions[linkId].off(); // unsubscribe removed chat link
	                    delete chatLinkSubscriptions[linkId];
	                    callback && callback({
	                      id: linkId,
	                      url: null
	                    });
	                    return;
	                  }
	                  if (chatLinks.indexOf(linkId) !== -1) {
	                    return;
	                  }
	                  var channels = [];
	                  chatLinks.push(linkId);
	                  var url = Channel.formatChatLink({
	                    urlRoot: urlRoot,
	                    inviter: from,
	                    channelId: _this17.uuid,
	                    sharedSecret: link.sharedSecret,
	                    linkId: linkId
	                  });
	                  callback && callback({
	                    url: url,
	                    id: linkId
	                  });
	                  if (subscribe) {
	                    global$2().user(link.sharedKey.pub).get('chatRequests').map().on( /*#__PURE__*/function () {
	                      var _ref11 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee44(encPub, requestId, a, e) {
	                        var s, pub;
	                        return _regeneratorRuntime().wrap(function _callee44$(_context45) {
	                          while (1) {
	                            switch (_context45.prev = _context45.next) {
	                              case 0:
	                                if (!(!encPub || typeof encPub !== 'string' || encPub.length < 10)) {
	                                  _context45.next = 2;
	                                  break;
	                                }
	                                return _context45.abrupt("return");
	                              case 2:
	                                chatLinkSubscriptions[linkId] = e;
	                                s = JSON.stringify(encPub);
	                                if (!(channels.indexOf(s) === -1)) {
	                                  _context45.next = 10;
	                                  break;
	                                }
	                                channels.push(s);
	                                _context45.next = 8;
	                                return gun$1.SEA.decrypt(encPub, link.sharedSecret);
	                              case 8:
	                                pub = _context45.sent;
	                                _this17.addParticipant(pub, undefined, undefined, true);
	                              case 10:
	                              case "end":
	                                return _context45.stop();
	                            }
	                          }
	                        }, _callee44);
	                      }));
	                      return function (_x82, _x83, _x84, _x85) {
	                        return _ref11.apply(this, arguments);
	                      };
	                    }());
	                  }
	                });
	              });
	            case 8:
	            case "end":
	              return _context46.stop();
	          }
	        }
	      }, _callee45, this);
	    }));
	    function getChatLinks(_x81) {
	      return _getChatLinks.apply(this, arguments);
	    }
	    return getChatLinks;
	  }();
	  _proto.createChatLink = /*#__PURE__*/function () {
	    var _createChatLink = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee46(urlRoot) {
	      var sharedKey, sharedKeyString, sharedSecret, encryptedSharedKey, ownerSecret, ownerEncryptedSharedKey, linkId;
	      return _regeneratorRuntime().wrap(function _callee46$(_context47) {
	        while (1) {
	          switch (_context47.prev = _context47.next) {
	            case 0:
	              if (urlRoot === void 0) {
	                urlRoot = 'https://iris.to/';
	              }
	              _context47.next = 3;
	              return gun$1.SEA.pair();
	            case 3:
	              sharedKey = _context47.sent;
	              sharedKeyString = JSON.stringify(sharedKey);
	              _context47.next = 7;
	              return gun$1.SEA.secret(sharedKey.epub, sharedKey);
	            case 7:
	              sharedSecret = _context47.sent;
	              _context47.next = 10;
	              return gun$1.SEA.encrypt(sharedKeyString, sharedSecret);
	            case 10:
	              encryptedSharedKey = _context47.sent;
	              _context47.next = 13;
	              return gun$1.SEA.secret(session.getKey().epub, session.getKey());
	            case 13:
	              ownerSecret = _context47.sent;
	              _context47.next = 16;
	              return gun$1.SEA.encrypt(sharedKeyString, ownerSecret);
	            case 16:
	              ownerEncryptedSharedKey = _context47.sent;
	              _context47.next = 19;
	              return util.getHash(encryptedSharedKey);
	            case 19:
	              linkId = _context47.sent;
	              linkId = linkId.slice(0, 12);
	              // User has to exist, in order for .get(chatRequests).on() to be ever triggered
	              _context47.next = 23;
	              return util.gunAsAnotherUser(global$2(), sharedKey, function (user) {
	                return user.get('chatRequests').put({
	                  a: 1
	                }).then();
	              });
	            case 23:
	              this.chatLinks[linkId] = {
	                sharedKey: sharedKey,
	                sharedSecret: sharedSecret
	              };
	              this.put('chatLinks', this.chatLinks);
	              publicState().get('chatLinks').get(linkId).put({
	                encryptedSharedKey: encryptedSharedKey,
	                ownerEncryptedSharedKey: ownerEncryptedSharedKey
	              });
	              return _context47.abrupt("return", Channel.formatChatLink({
	                urlRoot: urlRoot,
	                channelId: this.uuid,
	                inviter: session.getKey().pub,
	                sharedSecret: sharedSecret,
	                linkId: linkId
	              }));
	            case 27:
	            case "end":
	              return _context47.stop();
	          }
	        }
	      }, _callee46, this);
	    }));
	    function createChatLink(_x86) {
	      return _createChatLink.apply(this, arguments);
	    }
	    return createChatLink;
	  }() /**
	      * Get a channel box element that you can add to your page
	      */;
	  _proto.getChatBox = function getChatBox() {
	    var _this18 = this;
	    util.injectCss();
	    var minimized = false;
	    var chatBox = util.createElement('div', 'iris-chat-box');
	    var header = util.createElement('div', 'iris-chat-header', chatBox);
	    var minimize = util.createElement('span', 'iris-chat-minimize', header);
	    minimize.innerText = '—';
	    minimize.addEventListener('click', function (e) {
	      e.stopPropagation();
	      chatBox.setAttribute('class', 'iris-chat-box minimized');
	      minimized = true;
	    });
	    var headerText = util.createElement('div', 'iris-chat-header-text', header);
	    var onlineIndicator = util.createElement('span', 'iris-online-indicator', headerText);
	    onlineIndicator.innerHTML = '&#x25cf;';
	    var nameEl = util.createElement('span', undefined, headerText);
	    var close = util.createElement('span', 'iris-chat-close', header);
	    close.innerHTML = '&#215;';
	    close.addEventListener('click', function () {
	      chatBox.setAttribute('style', 'display: none');
	      var openChatBtn = document.getElementById('iris-chat-open-button');
	      if (openChatBtn) {
	        openChatBtn.setAttribute('style', ''); // show
	      }
	    });

	    header.addEventListener('click', function () {
	      if (minimized) {
	        chatBox.setAttribute('class', 'iris-chat-box');
	        minimized = false;
	      }
	    });
	    var messages = util.createElement('div', 'iris-chat-messages', chatBox);
	    var typingIndicator = util.createElement('div', 'iris-typing-indicator', chatBox);
	    typingIndicator.innerText = 'typing...';
	    this.getTyping(function (isTyping) {
	      typingIndicator.setAttribute('class', "iris-typing-indicator" + (isTyping ? ' yes' : ''));
	    });
	    var inputWrapper = util.createElement('div', 'iris-chat-input-wrapper', chatBox);
	    var textArea = util.createElement('textarea', undefined, inputWrapper);
	    textArea.setAttribute('rows', '1');
	    textArea.setAttribute('placeholder', 'Type a message');
	    if (util.isMobile) {
	      var sendBtn = util.createElement('button', undefined, inputWrapper);
	      sendBtn.innerHTML = "\n        <svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\" viewBox=\"0 0 486.736 486.736\" style=\"enable-background:new 0 0 486.736 486.736;\" xml:space=\"preserve\" width=\"100px\" height=\"100px\" fill=\"#000000\" stroke=\"#000000\" stroke-width=\"0\"><path fill=\"currentColor\" d=\"M481.883,61.238l-474.3,171.4c-8.8,3.2-10.3,15-2.6,20.2l70.9,48.4l321.8-169.7l-272.4,203.4v82.4c0,5.6,6.3,9,11,5.9 l60-39.8l59.1,40.3c5.4,3.7,12.8,2.1,16.3-3.5l214.5-353.7C487.983,63.638,485.083,60.038,481.883,61.238z\"></path></svg>\n      ";
	      sendBtn.addEventListener('click', function () {
	        _this18.send(textArea.value);
	        textArea.value = '';
	        _this18.setTyping(false);
	      });
	    }
	    var participants = this.getCurrentParticipants();
	    if (participants.length) {
	      var pub = participants[0];
	      global$2().user(pub).get('profile').get('name').on(function (name) {
	        return nameEl.innerText = name;
	      });
	      Channel.getActivity(global$2(), pub, function (status) {
	        var cls = "iris-online-indicator" + (status.isActive ? ' yes' : '');
	        onlineIndicator.setAttribute('class', cls);
	        var undelivered = messages.querySelectorAll('.iris-chat-message:not(.delivered)');
	        undelivered.forEach(function (msg) {
	          if (msg.getAttribute('data-time') <= status.lastActive) {
	            var c = msg.getAttribute('class');
	            msg.setAttribute('class', c + " delivered");
	          }
	        });
	      });
	    }
	    this.getTheirMsgsLastSeenTime(function (time) {
	      var unseen = messages.querySelectorAll('.iris-seen:not(.yes)');
	      unseen.forEach(function (indicator) {
	        var msgEl = indicator.parentElement.parentElement.parentElement;
	        if (msgEl.getAttribute('data-time') <= time) {
	          var msgClass = msgEl.getAttribute('class');
	          if (msgClass.indexOf('delivered') === -1) {
	            msgEl.setAttribute('class', msgClass + " delivered");
	          }
	          indicator.setAttribute('class', 'iris-seen yes');
	        }
	      });
	    });
	    this.getMessages(function (msg, info) {
	      var msgContent = util.createElement('div', 'iris-msg-content');
	      msgContent.innerText = msg.text;
	      var time = util.createElement('div', 'time', msgContent);
	      time.innerText = util.formatTime(new Date(msg.time));
	      if (info.selfAuthored) {
	        var cls = _this18.theirMsgsLastSeenTime >= msg.time ? 'iris-seen yes' : 'iris-seen';
	        var seenIndicator = util.createElement('span', cls, time);
	        seenIndicator.innerHTML = ' <svg version="1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 59 42"><polygon fill="currentColor" points="40.6,12.1 17,35.7 7.4,26.1 4.6,29 17,41.3 43.4,14.9"></polygon><polygon class="iris-delivered-checkmark" fill="currentColor" points="55.6,12.1 32,35.7 29.4,33.1 26.6,36 32,41.3 58.4,14.9"></polygon></svg>';
	      }
	      msgContent.innerHTML = msgContent.innerHTML.replace(/\n/g, '<br>\n');
	      var msgEl = util.createElement('div', (info.selfAuthored ? 'our' : 'their') + " iris-chat-message");
	      msgEl.appendChild(msgContent);
	      msgEl.setAttribute('data-time', msg.time);
	      for (var i = messages.children.length; i >= 0; i--) {
	        if (i === 0) {
	          messages.insertBefore(msgEl, messages.firstChild);
	        } else {
	          var t = messages.children[i - 1].getAttribute('data-time');
	          if (t && t < msg.time) {
	            messages.children[i - 1].insertAdjacentElement('afterend', msgEl);
	            break;
	          }
	        }
	      }
	      messages.scrollTop = messages.scrollHeight;
	    });
	    textArea.addEventListener('keyup', function (event) {
	      Channel.setActivity(global$2(), true); // TODO
	      _this18.setMyMsgsLastSeenTime(); // TODO
	      if (event.keyCode === 13) {
	        event.preventDefault();
	        var content = textArea.value;
	        var caret = util.getCaret(textArea);
	        if (event.shiftKey) {
	          textArea.value = content.substring(0, caret - 1) + "\n" + content.substring(caret, content.length);
	        } else {
	          textArea.value = content.substring(0, caret - 1) + content.substring(caret, content.length);
	          _this18.send(textArea.value);
	          textArea.value = '';
	          _this18.setTyping(false);
	        }
	      } else {
	        _this18.setTyping(!!textArea.value.length);
	      }
	    });
	    return chatBox;
	  }
	  /**
	  * Set the user's online/active status
	  * @param {string} activity string: set the activity status every 3 seconds, null/false: stop updating
	  */;
	  Channel.setActivity = function setActivity(activity) {
	    if (global$2().irisActivityStatus === activity) {
	      return;
	    }
	    global$2().irisActivityStatus = activity;
	    clearTimeout(global$2().setActivityTimeout);
	    var update = function update() {
	      global$2().user().get("activity").put({
	        status: activity,
	        time: new Date(gun$1.state()).toISOString()
	      });
	    };
	    update();
	    function timerUpdate() {
	      update();
	      global$2().setActivityTimeout = setTimeout(timerUpdate, 3000);
	    }
	    if (activity) {
	      timerUpdate();
	    }
	  }
	  /**
	  * Get the online status of a user.
	  *
	  * @param {string} pubKey public key of the user
	  * @param {boolean} callback receives a boolean each time the user's online status changes
	  */;
	  Channel.getActivity = function getActivity(pubKey, callback) {
	    var timeout;
	    global$2().user(pubKey).get("activity").on(function (activity) {
	      if (!activity || !(activity.time && activity.status)) {
	        return;
	      }
	      clearTimeout(timeout);
	      var now = new Date(gun$1.state());
	      var activityDate = new Date(activity.time);
	      var isActive = activityDate > new Date(now.getTime() - 10 * 1000) && activityDate < new Date(now.getTime() + 30 * 1000);
	      callback({
	        isActive: isActive,
	        lastActive: activity.time,
	        status: activity.status
	      });
	      if (isActive) {
	        timeout = setTimeout(function () {
	          return callback({
	            isOnline: false,
	            lastActive: activity.time
	          });
	        }, 10000);
	      }
	    });
	  };
	  Channel.formatChatLink = function formatChatLink(_ref12) {
	    var urlRoot = _ref12.urlRoot,
	      chatWith = _ref12.chatWith,
	      channelId = _ref12.channelId,
	      inviter = _ref12.inviter,
	      sharedSecret = _ref12.sharedSecret,
	      linkId = _ref12.linkId;
	    var enc = encodeURIComponent;
	    if (channelId && inviter) {
	      return urlRoot + "?channelId=" + enc(channelId) + "&inviter=" + enc(inviter) + "&s=" + enc(sharedSecret) + "&k=" + enc(linkId);
	    }
	    return urlRoot + "?chatWith=" + enc(chatWith) + "&s=" + enc(sharedSecret) + "&k=" + enc(linkId);
	  }
	  /**
	  * Creates a channel link that can be used for two-way communication, i.e. only one link needs to be exchanged.
	  */;
	  Channel.createChatLink =
	  /*#__PURE__*/
	  function () {
	    var _createChatLink2 = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee47(urlRoot) {
	      var user, key, sharedKey, sharedKeyString, sharedSecret, encryptedSharedKey, ownerSecret, ownerEncryptedSharedKey, linkId;
	      return _regeneratorRuntime().wrap(function _callee47$(_context48) {
	        while (1) {
	          switch (_context48.prev = _context48.next) {
	            case 0:
	              if (urlRoot === void 0) {
	                urlRoot = 'https://iris.to/';
	              }
	              user = global$2().user();
	              key = session.getKey(); // We create a new Gun user whose private key is shared with the chat link recipients.
	              // Chat link recipients can contact you by writing their public key to the shared key's user space.
	              _context48.next = 5;
	              return gun$1.SEA.pair();
	            case 5:
	              sharedKey = _context48.sent;
	              sharedKeyString = JSON.stringify(sharedKey);
	              _context48.next = 9;
	              return gun$1.SEA.secret(sharedKey.epub, sharedKey);
	            case 9:
	              sharedSecret = _context48.sent;
	              _context48.next = 12;
	              return gun$1.SEA.encrypt(sharedKeyString, sharedSecret);
	            case 12:
	              encryptedSharedKey = _context48.sent;
	              _context48.next = 15;
	              return gun$1.SEA.secret(key.epub, key);
	            case 15:
	              ownerSecret = _context48.sent;
	              _context48.next = 18;
	              return gun$1.SEA.encrypt(sharedKeyString, ownerSecret);
	            case 18:
	              ownerEncryptedSharedKey = _context48.sent;
	              _context48.next = 21;
	              return util.getHash(encryptedSharedKey);
	            case 21:
	              linkId = _context48.sent;
	              linkId = linkId.slice(0, 12);
	              // User has to exist, in order for .get(chatRequests).on() to be ever triggered
	              util.gunAsAnotherUser(global$2(), sharedKey, function (user) {
	                user.get('chatRequests').put({
	                  a: 1
	                });
	              });
	              user.get('chatLinks').get(linkId).put({
	                encryptedSharedKey: encryptedSharedKey,
	                ownerEncryptedSharedKey: ownerEncryptedSharedKey
	              });
	              return _context48.abrupt("return", Channel.formatChatLink({
	                urlRoot: urlRoot,
	                chatWith: key.pub,
	                sharedSecret: sharedSecret,
	                linkId: linkId
	              }));
	            case 26:
	            case "end":
	              return _context48.stop();
	          }
	        }
	      }, _callee47);
	    }));
	    function createChatLink(_x87) {
	      return _createChatLink2.apply(this, arguments);
	    }
	    return createChatLink;
	  }() /**
	      *
	      */;
	  Channel.getMyChatLinks =
	  /*#__PURE__*/
	  function () {
	    var _getMyChatLinks = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee50(urlRoot, callback, subscribe) {
	      var key, user, mySecret, chatLinks;
	      return _regeneratorRuntime().wrap(function _callee50$(_context51) {
	        while (1) {
	          switch (_context51.prev = _context51.next) {
	            case 0:
	              if (urlRoot === void 0) {
	                urlRoot = 'https://iris.to/';
	              }
	              if (subscribe === void 0) {
	                subscribe = false;
	              }
	              key = session.getKey();
	              user = global$2().user();
	              _context51.next = 6;
	              return gun$1.SEA.secret(key.epub, key);
	            case 6:
	              mySecret = _context51.sent;
	              chatLinks = [];
	              user.get('chatLinks').map().on(function (data, linkId) {
	                if (!data || chatLinks.indexOf(linkId) !== -1) {
	                  return;
	                }
	                var channels = [];
	                user.get('chatLinks').get(linkId).get('ownerEncryptedSharedKey').on( /*#__PURE__*/function () {
	                  var _ref13 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee49(enc) {
	                    var sharedKey, sharedSecret, url;
	                    return _regeneratorRuntime().wrap(function _callee49$(_context50) {
	                      while (1) {
	                        switch (_context50.prev = _context50.next) {
	                          case 0:
	                            if (!(!enc || chatLinks.indexOf(linkId) !== -1)) {
	                              _context50.next = 2;
	                              break;
	                            }
	                            return _context50.abrupt("return");
	                          case 2:
	                            chatLinks.push(linkId);
	                            _context50.next = 5;
	                            return gun$1.SEA.decrypt(enc, mySecret);
	                          case 5:
	                            sharedKey = _context50.sent;
	                            _context50.next = 8;
	                            return gun$1.SEA.secret(sharedKey.epub, sharedKey);
	                          case 8:
	                            sharedSecret = _context50.sent;
	                            url = Channel.formatChatLink({
	                              urlRoot: urlRoot,
	                              chatWith: key.pub,
	                              sharedSecret: sharedSecret,
	                              linkId: linkId
	                            });
	                            if (callback) {
	                              callback({
	                                url: url,
	                                id: linkId
	                              });
	                            }
	                            if (subscribe) {
	                              global$2().user(sharedKey.pub).get('chatRequests').map().on( /*#__PURE__*/function () {
	                                var _ref14 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee48(encPub, requestId) {
	                                  var s, pub, channel;
	                                  return _regeneratorRuntime().wrap(function _callee48$(_context49) {
	                                    while (1) {
	                                      switch (_context49.prev = _context49.next) {
	                                        case 0:
	                                          if (encPub) {
	                                            _context49.next = 2;
	                                            break;
	                                          }
	                                          return _context49.abrupt("return");
	                                        case 2:
	                                          s = JSON.stringify(encPub);
	                                          if (!(channels.indexOf(s) === -1)) {
	                                            _context49.next = 10;
	                                            break;
	                                          }
	                                          channels.push(s);
	                                          _context49.next = 7;
	                                          return gun$1.SEA.decrypt(encPub, sharedSecret);
	                                        case 7:
	                                          pub = _context49.sent;
	                                          channel = new Channel({
	                                            key: key,
	                                            participants: pub
	                                          });
	                                          channel.save();
	                                        case 10:
	                                          util.gunAsAnotherUser(global$2(), sharedKey, function (user) {
	                                            user.get('chatRequests').get(requestId).put(null);
	                                          });
	                                        case 11:
	                                        case "end":
	                                          return _context49.stop();
	                                      }
	                                    }
	                                  }, _callee48);
	                                }));
	                                return function (_x92, _x93) {
	                                  return _ref14.apply(this, arguments);
	                                };
	                              }());
	                            }
	                          case 12:
	                          case "end":
	                            return _context50.stop();
	                        }
	                      }
	                    }, _callee49);
	                  }));
	                  return function (_x91) {
	                    return _ref13.apply(this, arguments);
	                  };
	                }());
	              });
	            case 9:
	            case "end":
	              return _context51.stop();
	          }
	        }
	      }, _callee50);
	    }));
	    function getMyChatLinks(_x88, _x89, _x90) {
	      return _getMyChatLinks.apply(this, arguments);
	    }
	    return getMyChatLinks;
	  }() /**
	      *
	      */;
	  _proto.removeGroupChatLink = function removeGroupChatLink(linkId) {
	    this.chatLinks[linkId] = null;
	    this.put('chatLinks', this.chatLinks);
	    global$2().user().get('chatLinks').get(linkId).put(null);
	  }
	  /**
	  *
	  */;
	  Channel.removePrivateChatLink = function removePrivateChatLink(key, linkId) {
	    global$2().user().auth(key);
	    global$2().user().get('chatLinks').get(linkId).put(null);
	  }
	  /**
	  *
	  */;
	  Channel.deleteChannel =
	  /*#__PURE__*/
	  function () {
	    var _deleteChannel = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee51(key, pub) {
	      var channelId;
	      return _regeneratorRuntime().wrap(function _callee51$(_context52) {
	        while (1) {
	          switch (_context52.prev = _context52.next) {
	            case 0:
	              global$2().user().auth(key);
	              _context52.next = 3;
	              return Channel.getOurSecretChannelId(pub, key);
	            case 3:
	              channelId = _context52.sent;
	              global$2().user().get('channels').get(channelId).put(null);
	              global$2().user().get('channels').get(channelId).off();
	            case 6:
	            case "end":
	              return _context52.stop();
	          }
	        }
	      }, _callee51);
	    }));
	    function deleteChannel(_x94, _x95) {
	      return _deleteChannel.apply(this, arguments);
	    }
	    return deleteChannel;
	  }() /**
	      *
	      */;
	  Channel.deleteGroup =
	  /*#__PURE__*/
	  function () {
	    var _deleteGroup = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee52(key, uuid) {
	      var mySecret, mySecretHash, mySecretUuid;
	      return _regeneratorRuntime().wrap(function _callee52$(_context53) {
	        while (1) {
	          switch (_context53.prev = _context53.next) {
	            case 0:
	              _context53.next = 2;
	              return gun$1.SEA.secret(key.epub, key);
	            case 2:
	              mySecret = _context53.sent;
	              _context53.next = 5;
	              return util.getHash(mySecret);
	            case 5:
	              mySecretHash = _context53.sent;
	              _context53.next = 8;
	              return util.getHash(mySecretHash + uuid);
	            case 8:
	              mySecretUuid = _context53.sent;
	              global$2().user().auth(key);
	              global$2().user().get('channels').get(mySecretUuid).put(null);
	              global$2().user().get('channels').get(mySecretUuid).off();
	            case 12:
	            case "end":
	              return _context53.stop();
	          }
	        }
	      }, _callee52);
	    }));
	    function deleteGroup(_x96, _x97) {
	      return _deleteGroup.apply(this, arguments);
	    }
	    return deleteGroup;
	  }();
	  return Channel;
	}();

	var channels = /*#__PURE__*/new Map();
	/**
	 * Private channel that only you and publicKey can read/write.
	 * @param publicKey
	 * @returns {Channel}
	 */
	function privateState (publicKey, chatLink) {
	  if (publicKey === void 0) {
	    publicKey = session.getKey();
	  }
	  var channel = channels.get(publicKey);
	  if (!channel) {
	    channel = new Channel({
	      participants: publicKey,
	      chatLink: chatLink
	    });
	    channels.set(publicKey, channel);
	  }
	  return channel;
	}

	var localforage = createCommonjsModule(function (module, exports) {
	/*!
	    localForage -- Offline Storage, Improved
	    Version 1.10.0
	    https://localforage.github.io/localForage
	    (c) 2013-2017 Mozilla, Apache License 2.0
	*/
	(function(f){{module.exports=f();}})(function(){return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw (f.code="MODULE_NOT_FOUND", f)}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	(function (global){
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	{
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{}],2:[function(_dereq_,module,exports){
	var immediate = _dereq_(1);

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];

	module.exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype["catch"] = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && (typeof obj === 'object' || typeof obj === 'function') && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	Promise.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	Promise.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	Promise.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	Promise.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	},{"1":1}],3:[function(_dereq_,module,exports){
	(function (global){
	if (typeof global.Promise !== 'function') {
	  global.Promise = _dereq_(2);
	}

	}).call(this,typeof commonjsGlobal !== "undefined" ? commonjsGlobal : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
	},{"2":2}],4:[function(_dereq_,module,exports){

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function getIDB() {
	    /* global indexedDB,webkitIndexedDB,mozIndexedDB,OIndexedDB,msIndexedDB */
	    try {
	        if (typeof indexedDB !== 'undefined') {
	            return indexedDB;
	        }
	        if (typeof webkitIndexedDB !== 'undefined') {
	            return webkitIndexedDB;
	        }
	        if (typeof mozIndexedDB !== 'undefined') {
	            return mozIndexedDB;
	        }
	        if (typeof OIndexedDB !== 'undefined') {
	            return OIndexedDB;
	        }
	        if (typeof msIndexedDB !== 'undefined') {
	            return msIndexedDB;
	        }
	    } catch (e) {
	        return;
	    }
	}

	var idb = getIDB();

	function isIndexedDBValid() {
	    try {
	        // Initialize IndexedDB; fall back to vendor-prefixed versions
	        // if needed.
	        if (!idb || !idb.open) {
	            return false;
	        }
	        // We mimic PouchDB here;
	        //
	        // We test for openDatabase because IE Mobile identifies itself
	        // as Safari. Oh the lulz...
	        var isSafari = typeof openDatabase !== 'undefined' && /(Safari|iPhone|iPad|iPod)/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent) && !/BlackBerry/.test(navigator.platform);

	        var hasFetch = typeof fetch === 'function' && fetch.toString().indexOf('[native code') !== -1;

	        // Safari <10.1 does not meet our requirements for IDB support
	        // (see: https://github.com/pouchdb/pouchdb/issues/5572).
	        // Safari 10.1 shipped with fetch, we can use that to detect it.
	        // Note: this creates issues with `window.fetch` polyfills and
	        // overrides; see:
	        // https://github.com/localForage/localForage/issues/856
	        return (!isSafari || hasFetch) && typeof indexedDB !== 'undefined' &&
	        // some outdated implementations of IDB that appear on Samsung
	        // and HTC Android devices <4.4 are missing IDBKeyRange
	        // See: https://github.com/mozilla/localForage/issues/128
	        // See: https://github.com/mozilla/localForage/issues/272
	        typeof IDBKeyRange !== 'undefined';
	    } catch (e) {
	        return false;
	    }
	}

	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	// Abstracts constructing a Blob object, so it also works in older
	// browsers that don't support the native Blob constructor. (i.e.
	// old QtWebKit versions, at least).
	function createBlob(parts, properties) {
	    /* global BlobBuilder,MSBlobBuilder,MozBlobBuilder,WebKitBlobBuilder */
	    parts = parts || [];
	    properties = properties || {};
	    try {
	        return new Blob(parts, properties);
	    } catch (e) {
	        if (e.name !== 'TypeError') {
	            throw e;
	        }
	        var Builder = typeof BlobBuilder !== 'undefined' ? BlobBuilder : typeof MSBlobBuilder !== 'undefined' ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined' ? MozBlobBuilder : WebKitBlobBuilder;
	        var builder = new Builder();
	        for (var i = 0; i < parts.length; i += 1) {
	            builder.append(parts[i]);
	        }
	        return builder.getBlob(properties.type);
	    }
	}

	// This is CommonJS because lie is an external dependency, so Rollup
	// can just ignore it.
	if (typeof Promise === 'undefined') {
	    // In the "nopromises" build this will just throw if you don't have
	    // a global promise object, but it would throw anyway later.
	    _dereq_(3);
	}
	var Promise$1 = Promise;

	function executeCallback(promise, callback) {
	    if (callback) {
	        promise.then(function (result) {
	            callback(null, result);
	        }, function (error) {
	            callback(error);
	        });
	    }
	}

	function executeTwoCallbacks(promise, callback, errorCallback) {
	    if (typeof callback === 'function') {
	        promise.then(callback);
	    }

	    if (typeof errorCallback === 'function') {
	        promise["catch"](errorCallback);
	    }
	}

	function normalizeKey(key) {
	    // Cast the key to a string, as that's all we can set as a key.
	    if (typeof key !== 'string') {
	        console.warn(key + ' used as a key, but it is not a string.');
	        key = String(key);
	    }

	    return key;
	}

	function getCallback() {
	    if (arguments.length && typeof arguments[arguments.length - 1] === 'function') {
	        return arguments[arguments.length - 1];
	    }
	}

	// Some code originally from async_storage.js in
	// [Gaia](https://github.com/mozilla-b2g/gaia).

	var DETECT_BLOB_SUPPORT_STORE = 'local-forage-detect-blob-support';
	var supportsBlobs = void 0;
	var dbContexts = {};
	var toString = Object.prototype.toString;

	// Transaction Modes
	var READ_ONLY = 'readonly';
	var READ_WRITE = 'readwrite';

	// Transform a binary string to an array buffer, because otherwise
	// weird stuff happens when you try to work with the binary string directly.
	// It is known.
	// From http://stackoverflow.com/questions/14967647/ (continues on next line)
	// encode-decode-image-with-base64-breaks-image (2013-04-21)
	function _binStringToArrayBuffer(bin) {
	    var length = bin.length;
	    var buf = new ArrayBuffer(length);
	    var arr = new Uint8Array(buf);
	    for (var i = 0; i < length; i++) {
	        arr[i] = bin.charCodeAt(i);
	    }
	    return buf;
	}

	//
	// Blobs are not supported in all versions of IndexedDB, notably
	// Chrome <37 and Android <5. In those versions, storing a blob will throw.
	//
	// Various other blob bugs exist in Chrome v37-42 (inclusive).
	// Detecting them is expensive and confusing to users, and Chrome 37-42
	// is at very low usage worldwide, so we do a hacky userAgent check instead.
	//
	// content-type bug: https://code.google.com/p/chromium/issues/detail?id=408120
	// 404 bug: https://code.google.com/p/chromium/issues/detail?id=447916
	// FileReader bug: https://code.google.com/p/chromium/issues/detail?id=447836
	//
	// Code borrowed from PouchDB. See:
	// https://github.com/pouchdb/pouchdb/blob/master/packages/node_modules/pouchdb-adapter-idb/src/blobSupport.js
	//
	function _checkBlobSupportWithoutCaching(idb) {
	    return new Promise$1(function (resolve) {
	        var txn = idb.transaction(DETECT_BLOB_SUPPORT_STORE, READ_WRITE);
	        var blob = createBlob(['']);
	        txn.objectStore(DETECT_BLOB_SUPPORT_STORE).put(blob, 'key');

	        txn.onabort = function (e) {
	            // If the transaction aborts now its due to not being able to
	            // write to the database, likely due to the disk being full
	            e.preventDefault();
	            e.stopPropagation();
	            resolve(false);
	        };

	        txn.oncomplete = function () {
	            var matchedChrome = navigator.userAgent.match(/Chrome\/(\d+)/);
	            var matchedEdge = navigator.userAgent.match(/Edge\//);
	            // MS Edge pretends to be Chrome 42:
	            // https://msdn.microsoft.com/en-us/library/hh869301%28v=vs.85%29.aspx
	            resolve(matchedEdge || !matchedChrome || parseInt(matchedChrome[1], 10) >= 43);
	        };
	    })["catch"](function () {
	        return false; // error, so assume unsupported
	    });
	}

	function _checkBlobSupport(idb) {
	    if (typeof supportsBlobs === 'boolean') {
	        return Promise$1.resolve(supportsBlobs);
	    }
	    return _checkBlobSupportWithoutCaching(idb).then(function (value) {
	        supportsBlobs = value;
	        return supportsBlobs;
	    });
	}

	function _deferReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Create a deferred object representing the current database operation.
	    var deferredOperation = {};

	    deferredOperation.promise = new Promise$1(function (resolve, reject) {
	        deferredOperation.resolve = resolve;
	        deferredOperation.reject = reject;
	    });

	    // Enqueue the deferred operation.
	    dbContext.deferredOperations.push(deferredOperation);

	    // Chain its promise to the database readiness.
	    if (!dbContext.dbReady) {
	        dbContext.dbReady = deferredOperation.promise;
	    } else {
	        dbContext.dbReady = dbContext.dbReady.then(function () {
	            return deferredOperation.promise;
	        });
	    }
	}

	function _advanceReadiness(dbInfo) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();

	    // Resolve its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.resolve();
	        return deferredOperation.promise;
	    }
	}

	function _rejectReadiness(dbInfo, err) {
	    var dbContext = dbContexts[dbInfo.name];

	    // Dequeue a deferred operation.
	    var deferredOperation = dbContext.deferredOperations.pop();

	    // Reject its promise (which is part of the database readiness
	    // chain of promises).
	    if (deferredOperation) {
	        deferredOperation.reject(err);
	        return deferredOperation.promise;
	    }
	}

	function _getConnection(dbInfo, upgradeNeeded) {
	    return new Promise$1(function (resolve, reject) {
	        dbContexts[dbInfo.name] = dbContexts[dbInfo.name] || createDbContext();

	        if (dbInfo.db) {
	            if (upgradeNeeded) {
	                _deferReadiness(dbInfo);
	                dbInfo.db.close();
	            } else {
	                return resolve(dbInfo.db);
	            }
	        }

	        var dbArgs = [dbInfo.name];

	        if (upgradeNeeded) {
	            dbArgs.push(dbInfo.version);
	        }

	        var openreq = idb.open.apply(idb, dbArgs);

	        if (upgradeNeeded) {
	            openreq.onupgradeneeded = function (e) {
	                var db = openreq.result;
	                try {
	                    db.createObjectStore(dbInfo.storeName);
	                    if (e.oldVersion <= 1) {
	                        // Added when support for blob shims was added
	                        db.createObjectStore(DETECT_BLOB_SUPPORT_STORE);
	                    }
	                } catch (ex) {
	                    if (ex.name === 'ConstraintError') {
	                        console.warn('The database "' + dbInfo.name + '"' + ' has been upgraded from version ' + e.oldVersion + ' to version ' + e.newVersion + ', but the storage "' + dbInfo.storeName + '" already exists.');
	                    } else {
	                        throw ex;
	                    }
	                }
	            };
	        }

	        openreq.onerror = function (e) {
	            e.preventDefault();
	            reject(openreq.error);
	        };

	        openreq.onsuccess = function () {
	            var db = openreq.result;
	            db.onversionchange = function (e) {
	                // Triggered when the database is modified (e.g. adding an objectStore) or
	                // deleted (even when initiated by other sessions in different tabs).
	                // Closing the connection here prevents those operations from being blocked.
	                // If the database is accessed again later by this instance, the connection
	                // will be reopened or the database recreated as needed.
	                e.target.close();
	            };
	            resolve(db);
	            _advanceReadiness(dbInfo);
	        };
	    });
	}

	function _getOriginalConnection(dbInfo) {
	    return _getConnection(dbInfo, false);
	}

	function _getUpgradedConnection(dbInfo) {
	    return _getConnection(dbInfo, true);
	}

	function _isUpgradeNeeded(dbInfo, defaultVersion) {
	    if (!dbInfo.db) {
	        return true;
	    }

	    var isNewStore = !dbInfo.db.objectStoreNames.contains(dbInfo.storeName);
	    var isDowngrade = dbInfo.version < dbInfo.db.version;
	    var isUpgrade = dbInfo.version > dbInfo.db.version;

	    if (isDowngrade) {
	        // If the version is not the default one
	        // then warn for impossible downgrade.
	        if (dbInfo.version !== defaultVersion) {
	            console.warn('The database "' + dbInfo.name + '"' + " can't be downgraded from version " + dbInfo.db.version + ' to version ' + dbInfo.version + '.');
	        }
	        // Align the versions to prevent errors.
	        dbInfo.version = dbInfo.db.version;
	    }

	    if (isUpgrade || isNewStore) {
	        // If the store is new then increment the version (if needed).
	        // This will trigger an "upgradeneeded" event which is required
	        // for creating a store.
	        if (isNewStore) {
	            var incVersion = dbInfo.db.version + 1;
	            if (incVersion > dbInfo.version) {
	                dbInfo.version = incVersion;
	            }
	        }

	        return true;
	    }

	    return false;
	}

	// encode a blob for indexeddb engines that don't support blobs
	function _encodeBlob(blob) {
	    return new Promise$1(function (resolve, reject) {
	        var reader = new FileReader();
	        reader.onerror = reject;
	        reader.onloadend = function (e) {
	            var base64 = btoa(e.target.result || '');
	            resolve({
	                __local_forage_encoded_blob: true,
	                data: base64,
	                type: blob.type
	            });
	        };
	        reader.readAsBinaryString(blob);
	    });
	}

	// decode an encoded blob
	function _decodeBlob(encodedBlob) {
	    var arrayBuff = _binStringToArrayBuffer(atob(encodedBlob.data));
	    return createBlob([arrayBuff], { type: encodedBlob.type });
	}

	// is this one of our fancy encoded blobs?
	function _isEncodedBlob(value) {
	    return value && value.__local_forage_encoded_blob;
	}

	// Specialize the default `ready()` function by making it dependent
	// on the current database operations. Thus, the driver will be actually
	// ready when it's been initialized (default) *and* there are no pending
	// operations on the database (initiated by some other instances).
	function _fullyReady(callback) {
	    var self = this;

	    var promise = self._initReady().then(function () {
	        var dbContext = dbContexts[self._dbInfo.name];

	        if (dbContext && dbContext.dbReady) {
	            return dbContext.dbReady;
	        }
	    });

	    executeTwoCallbacks(promise, callback, callback);
	    return promise;
	}

	// Try to establish a new db connection to replace the
	// current one which is broken (i.e. experiencing
	// InvalidStateError while creating a transaction).
	function _tryReconnect(dbInfo) {
	    _deferReadiness(dbInfo);

	    var dbContext = dbContexts[dbInfo.name];
	    var forages = dbContext.forages;

	    for (var i = 0; i < forages.length; i++) {
	        var forage = forages[i];
	        if (forage._dbInfo.db) {
	            forage._dbInfo.db.close();
	            forage._dbInfo.db = null;
	        }
	    }
	    dbInfo.db = null;

	    return _getOriginalConnection(dbInfo).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        // store the latest db reference
	        // in case the db was upgraded
	        dbInfo.db = dbContext.db = db;
	        for (var i = 0; i < forages.length; i++) {
	            forages[i]._dbInfo.db = db;
	        }
	    })["catch"](function (err) {
	        _rejectReadiness(dbInfo, err);
	        throw err;
	    });
	}

	// FF doesn't like Promises (micro-tasks) and IDDB store operations,
	// so we have to do it with callbacks
	function createTransaction(dbInfo, mode, callback, retries) {
	    if (retries === undefined) {
	        retries = 1;
	    }

	    try {
	        var tx = dbInfo.db.transaction(dbInfo.storeName, mode);
	        callback(null, tx);
	    } catch (err) {
	        if (retries > 0 && (!dbInfo.db || err.name === 'InvalidStateError' || err.name === 'NotFoundError')) {
	            return Promise$1.resolve().then(function () {
	                if (!dbInfo.db || err.name === 'NotFoundError' && !dbInfo.db.objectStoreNames.contains(dbInfo.storeName) && dbInfo.version <= dbInfo.db.version) {
	                    // increase the db version, to create the new ObjectStore
	                    if (dbInfo.db) {
	                        dbInfo.version = dbInfo.db.version + 1;
	                    }
	                    // Reopen the database for upgrading.
	                    return _getUpgradedConnection(dbInfo);
	                }
	            }).then(function () {
	                return _tryReconnect(dbInfo).then(function () {
	                    createTransaction(dbInfo, mode, callback, retries - 1);
	                });
	            })["catch"](callback);
	        }

	        callback(err);
	    }
	}

	function createDbContext() {
	    return {
	        // Running localForages sharing a database.
	        forages: [],
	        // Shared database.
	        db: null,
	        // Database readiness (promise).
	        dbReady: null,
	        // Deferred operations on the database.
	        deferredOperations: []
	    };
	}

	// Open the IndexedDB database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };

	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }

	    // Get the current context of the database;
	    var dbContext = dbContexts[dbInfo.name];

	    // ...or create a new context.
	    if (!dbContext) {
	        dbContext = createDbContext();
	        // Register the new context in the global container.
	        dbContexts[dbInfo.name] = dbContext;
	    }

	    // Register itself as a running localForage in the current context.
	    dbContext.forages.push(self);

	    // Replace the default `ready()` function with the specialized one.
	    if (!self._initReady) {
	        self._initReady = self.ready;
	        self.ready = _fullyReady;
	    }

	    // Create an array of initialization states of the related localForages.
	    var initPromises = [];

	    function ignoreErrors() {
	        // Don't handle errors here,
	        // just makes sure related localForages aren't pending.
	        return Promise$1.resolve();
	    }

	    for (var j = 0; j < dbContext.forages.length; j++) {
	        var forage = dbContext.forages[j];
	        if (forage !== self) {
	            // Don't wait for itself...
	            initPromises.push(forage._initReady()["catch"](ignoreErrors));
	        }
	    }

	    // Take a snapshot of the related localForages.
	    var forages = dbContext.forages.slice(0);

	    // Initialize the connection process only when
	    // all the related localForages aren't pending.
	    return Promise$1.all(initPromises).then(function () {
	        dbInfo.db = dbContext.db;
	        // Get the connection or open a new one without upgrade.
	        return _getOriginalConnection(dbInfo);
	    }).then(function (db) {
	        dbInfo.db = db;
	        if (_isUpgradeNeeded(dbInfo, self._defaultConfig.version)) {
	            // Reopen the database for upgrading.
	            return _getUpgradedConnection(dbInfo);
	        }
	        return db;
	    }).then(function (db) {
	        dbInfo.db = dbContext.db = db;
	        self._dbInfo = dbInfo;
	        // Share the final connection amongst related localForages.
	        for (var k = 0; k < forages.length; k++) {
	            var forage = forages[k];
	            if (forage !== self) {
	                // Self is already up-to-date.
	                forage._dbInfo.db = dbInfo.db;
	                forage._dbInfo.version = dbInfo.version;
	            }
	        }
	    });
	}

	function getItem(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.get(key);

	                    req.onsuccess = function () {
	                        var value = req.result;
	                        if (value === undefined) {
	                            value = null;
	                        }
	                        if (_isEncodedBlob(value)) {
	                            value = _decodeBlob(value);
	                        }
	                        resolve(value);
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Iterate over all items stored in database.
	function iterate(iterator, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.openCursor();
	                    var iterationNumber = 1;

	                    req.onsuccess = function () {
	                        var cursor = req.result;

	                        if (cursor) {
	                            var value = cursor.value;
	                            if (_isEncodedBlob(value)) {
	                                value = _decodeBlob(value);
	                            }
	                            var result = iterator(value, cursor.key, iterationNumber++);

	                            // when the iterator callback returns any
	                            // (non-`undefined`) value, then we stop
	                            // the iteration immediately
	                            if (result !== void 0) {
	                                resolve(result);
	                            } else {
	                                cursor["continue"]();
	                            }
	                        } else {
	                            resolve();
	                        }
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);

	    return promise;
	}

	function setItem(key, value, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        var dbInfo;
	        self.ready().then(function () {
	            dbInfo = self._dbInfo;
	            if (toString.call(value) === '[object Blob]') {
	                return _checkBlobSupport(dbInfo.db).then(function (blobSupport) {
	                    if (blobSupport) {
	                        return value;
	                    }
	                    return _encodeBlob(value);
	                });
	            }
	            return value;
	        }).then(function (value) {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);

	                    // The reason we don't _save_ null is because IE 10 does
	                    // not support saving the `null` type in IndexedDB. How
	                    // ironic, given the bug below!
	                    // See: https://github.com/mozilla/localForage/issues/161
	                    if (value === null) {
	                        value = undefined;
	                    }

	                    var req = store.put(value, key);

	                    transaction.oncomplete = function () {
	                        // Cast to undefined so the value passed to
	                        // callback/promise is the same as what one would get out
	                        // of `getItem()` later. This leads to some weirdness
	                        // (setItem('foo', undefined) will return `null`), but
	                        // it's not my fault localStorage is our baseline and that
	                        // it's weird.
	                        if (value === undefined) {
	                            value = null;
	                        }

	                        resolve(value);
	                    };
	                    transaction.onabort = transaction.onerror = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function removeItem(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    // We use a Grunt task to make this safe for IE and some
	                    // versions of Android (including those used by Cordova).
	                    // Normally IE won't like `.delete()` and will insist on
	                    // using `['delete']()`, but we have a build step that
	                    // fixes this for us now.
	                    var req = store["delete"](key);
	                    transaction.oncomplete = function () {
	                        resolve();
	                    };

	                    transaction.onerror = function () {
	                        reject(req.error);
	                    };

	                    // The request will be also be aborted if we've exceeded our storage
	                    // space.
	                    transaction.onabort = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function clear(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_WRITE, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.clear();

	                    transaction.oncomplete = function () {
	                        resolve();
	                    };

	                    transaction.onabort = transaction.onerror = function () {
	                        var err = req.error ? req.error : req.transaction.error;
	                        reject(err);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function length(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.count();

	                    req.onsuccess = function () {
	                        resolve(req.result);
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function key(n, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        if (n < 0) {
	            resolve(null);

	            return;
	        }

	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var advanced = false;
	                    var req = store.openKeyCursor();

	                    req.onsuccess = function () {
	                        var cursor = req.result;
	                        if (!cursor) {
	                            // this means there weren't enough keys
	                            resolve(null);

	                            return;
	                        }

	                        if (n === 0) {
	                            // We have the first key, return it if that's what they
	                            // wanted.
	                            resolve(cursor.key);
	                        } else {
	                            if (!advanced) {
	                                // Otherwise, ask the cursor to skip ahead n
	                                // records.
	                                advanced = true;
	                                cursor.advance(n);
	                            } else {
	                                // When we get here, we've got the nth key.
	                                resolve(cursor.key);
	                            }
	                        }
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            createTransaction(self._dbInfo, READ_ONLY, function (err, transaction) {
	                if (err) {
	                    return reject(err);
	                }

	                try {
	                    var store = transaction.objectStore(self._dbInfo.storeName);
	                    var req = store.openKeyCursor();
	                    var keys = [];

	                    req.onsuccess = function () {
	                        var cursor = req.result;

	                        if (!cursor) {
	                            resolve(keys);
	                            return;
	                        }

	                        keys.push(cursor.key);
	                        cursor["continue"]();
	                    };

	                    req.onerror = function () {
	                        reject(req.error);
	                    };
	                } catch (e) {
	                    reject(e);
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function dropInstance(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    var currentConfig = this.config();
	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        var isCurrentDb = options.name === currentConfig.name && self._dbInfo.db;

	        var dbPromise = isCurrentDb ? Promise$1.resolve(self._dbInfo.db) : _getOriginalConnection(options).then(function (db) {
	            var dbContext = dbContexts[options.name];
	            var forages = dbContext.forages;
	            dbContext.db = db;
	            for (var i = 0; i < forages.length; i++) {
	                forages[i]._dbInfo.db = db;
	            }
	            return db;
	        });

	        if (!options.storeName) {
	            promise = dbPromise.then(function (db) {
	                _deferReadiness(options);

	                var dbContext = dbContexts[options.name];
	                var forages = dbContext.forages;

	                db.close();
	                for (var i = 0; i < forages.length; i++) {
	                    var forage = forages[i];
	                    forage._dbInfo.db = null;
	                }

	                var dropDBPromise = new Promise$1(function (resolve, reject) {
	                    var req = idb.deleteDatabase(options.name);

	                    req.onerror = function () {
	                        var db = req.result;
	                        if (db) {
	                            db.close();
	                        }
	                        reject(req.error);
	                    };

	                    req.onblocked = function () {
	                        // Closing all open connections in onversionchange handler should prevent this situation, but if
	                        // we do get here, it just means the request remains pending - eventually it will succeed or error
	                        console.warn('dropInstance blocked for database "' + options.name + '" until all open connections are closed');
	                    };

	                    req.onsuccess = function () {
	                        var db = req.result;
	                        if (db) {
	                            db.close();
	                        }
	                        resolve(db);
	                    };
	                });

	                return dropDBPromise.then(function (db) {
	                    dbContext.db = db;
	                    for (var i = 0; i < forages.length; i++) {
	                        var _forage = forages[i];
	                        _advanceReadiness(_forage._dbInfo);
	                    }
	                })["catch"](function (err) {
	                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
	                    throw err;
	                });
	            });
	        } else {
	            promise = dbPromise.then(function (db) {
	                if (!db.objectStoreNames.contains(options.storeName)) {
	                    return;
	                }

	                var newVersion = db.version + 1;

	                _deferReadiness(options);

	                var dbContext = dbContexts[options.name];
	                var forages = dbContext.forages;

	                db.close();
	                for (var i = 0; i < forages.length; i++) {
	                    var forage = forages[i];
	                    forage._dbInfo.db = null;
	                    forage._dbInfo.version = newVersion;
	                }

	                var dropObjectPromise = new Promise$1(function (resolve, reject) {
	                    var req = idb.open(options.name, newVersion);

	                    req.onerror = function (err) {
	                        var db = req.result;
	                        db.close();
	                        reject(err);
	                    };

	                    req.onupgradeneeded = function () {
	                        var db = req.result;
	                        db.deleteObjectStore(options.storeName);
	                    };

	                    req.onsuccess = function () {
	                        var db = req.result;
	                        db.close();
	                        resolve(db);
	                    };
	                });

	                return dropObjectPromise.then(function (db) {
	                    dbContext.db = db;
	                    for (var j = 0; j < forages.length; j++) {
	                        var _forage2 = forages[j];
	                        _forage2._dbInfo.db = db;
	                        _advanceReadiness(_forage2._dbInfo);
	                    }
	                })["catch"](function (err) {
	                    (_rejectReadiness(options, err) || Promise$1.resolve())["catch"](function () {});
	                    throw err;
	                });
	            });
	        }
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var asyncStorage = {
	    _driver: 'asyncStorage',
	    _initStorage: _initStorage,
	    _support: isIndexedDBValid(),
	    iterate: iterate,
	    getItem: getItem,
	    setItem: setItem,
	    removeItem: removeItem,
	    clear: clear,
	    length: length,
	    key: key,
	    keys: keys,
	    dropInstance: dropInstance
	};

	function isWebSQLValid() {
	    return typeof openDatabase === 'function';
	}

	// Sadly, the best way to save binary data in WebSQL/localStorage is serializing
	// it to Base64, so this is how we store it to prevent very strange errors with less
	// verbose ways of binary <-> string data storage.
	var BASE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

	var BLOB_TYPE_PREFIX = '~~local_forage_type~';
	var BLOB_TYPE_PREFIX_REGEX = /^~~local_forage_type~([^~]+)~/;

	var SERIALIZED_MARKER = '__lfsc__:';
	var SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER.length;

	// OMG the serializations!
	var TYPE_ARRAYBUFFER = 'arbf';
	var TYPE_BLOB = 'blob';
	var TYPE_INT8ARRAY = 'si08';
	var TYPE_UINT8ARRAY = 'ui08';
	var TYPE_UINT8CLAMPEDARRAY = 'uic8';
	var TYPE_INT16ARRAY = 'si16';
	var TYPE_INT32ARRAY = 'si32';
	var TYPE_UINT16ARRAY = 'ur16';
	var TYPE_UINT32ARRAY = 'ui32';
	var TYPE_FLOAT32ARRAY = 'fl32';
	var TYPE_FLOAT64ARRAY = 'fl64';
	var TYPE_SERIALIZED_MARKER_LENGTH = SERIALIZED_MARKER_LENGTH + TYPE_ARRAYBUFFER.length;

	var toString$1 = Object.prototype.toString;

	function stringToBuffer(serializedString) {
	    // Fill the string into a ArrayBuffer.
	    var bufferLength = serializedString.length * 0.75;
	    var len = serializedString.length;
	    var i;
	    var p = 0;
	    var encoded1, encoded2, encoded3, encoded4;

	    if (serializedString[serializedString.length - 1] === '=') {
	        bufferLength--;
	        if (serializedString[serializedString.length - 2] === '=') {
	            bufferLength--;
	        }
	    }

	    var buffer = new ArrayBuffer(bufferLength);
	    var bytes = new Uint8Array(buffer);

	    for (i = 0; i < len; i += 4) {
	        encoded1 = BASE_CHARS.indexOf(serializedString[i]);
	        encoded2 = BASE_CHARS.indexOf(serializedString[i + 1]);
	        encoded3 = BASE_CHARS.indexOf(serializedString[i + 2]);
	        encoded4 = BASE_CHARS.indexOf(serializedString[i + 3]);

	        /*jslint bitwise: true */
	        bytes[p++] = encoded1 << 2 | encoded2 >> 4;
	        bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
	        bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
	    }
	    return buffer;
	}

	// Converts a buffer to a string to store, serialized, in the backend
	// storage library.
	function bufferToString(buffer) {
	    // base64-arraybuffer
	    var bytes = new Uint8Array(buffer);
	    var base64String = '';
	    var i;

	    for (i = 0; i < bytes.length; i += 3) {
	        /*jslint bitwise: true */
	        base64String += BASE_CHARS[bytes[i] >> 2];
	        base64String += BASE_CHARS[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
	        base64String += BASE_CHARS[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
	        base64String += BASE_CHARS[bytes[i + 2] & 63];
	    }

	    if (bytes.length % 3 === 2) {
	        base64String = base64String.substring(0, base64String.length - 1) + '=';
	    } else if (bytes.length % 3 === 1) {
	        base64String = base64String.substring(0, base64String.length - 2) + '==';
	    }

	    return base64String;
	}

	// Serialize a value, afterwards executing a callback (which usually
	// instructs the `setItem()` callback/promise to be executed). This is how
	// we store binary data with localStorage.
	function serialize(value, callback) {
	    var valueType = '';
	    if (value) {
	        valueType = toString$1.call(value);
	    }

	    // Cannot use `value instanceof ArrayBuffer` or such here, as these
	    // checks fail when running the tests using casper.js...
	    //
	    // TODO: See why those tests fail and use a better solution.
	    if (value && (valueType === '[object ArrayBuffer]' || value.buffer && toString$1.call(value.buffer) === '[object ArrayBuffer]')) {
	        // Convert binary arrays to a string and prefix the string with
	        // a special marker.
	        var buffer;
	        var marker = SERIALIZED_MARKER;

	        if (value instanceof ArrayBuffer) {
	            buffer = value;
	            marker += TYPE_ARRAYBUFFER;
	        } else {
	            buffer = value.buffer;

	            if (valueType === '[object Int8Array]') {
	                marker += TYPE_INT8ARRAY;
	            } else if (valueType === '[object Uint8Array]') {
	                marker += TYPE_UINT8ARRAY;
	            } else if (valueType === '[object Uint8ClampedArray]') {
	                marker += TYPE_UINT8CLAMPEDARRAY;
	            } else if (valueType === '[object Int16Array]') {
	                marker += TYPE_INT16ARRAY;
	            } else if (valueType === '[object Uint16Array]') {
	                marker += TYPE_UINT16ARRAY;
	            } else if (valueType === '[object Int32Array]') {
	                marker += TYPE_INT32ARRAY;
	            } else if (valueType === '[object Uint32Array]') {
	                marker += TYPE_UINT32ARRAY;
	            } else if (valueType === '[object Float32Array]') {
	                marker += TYPE_FLOAT32ARRAY;
	            } else if (valueType === '[object Float64Array]') {
	                marker += TYPE_FLOAT64ARRAY;
	            } else {
	                callback(new Error('Failed to get type for BinaryArray'));
	            }
	        }

	        callback(marker + bufferToString(buffer));
	    } else if (valueType === '[object Blob]') {
	        // Conver the blob to a binaryArray and then to a string.
	        var fileReader = new FileReader();

	        fileReader.onload = function () {
	            // Backwards-compatible prefix for the blob type.
	            var str = BLOB_TYPE_PREFIX + value.type + '~' + bufferToString(this.result);

	            callback(SERIALIZED_MARKER + TYPE_BLOB + str);
	        };

	        fileReader.readAsArrayBuffer(value);
	    } else {
	        try {
	            callback(JSON.stringify(value));
	        } catch (e) {
	            console.error("Couldn't convert value into a JSON string: ", value);

	            callback(null, e);
	        }
	    }
	}

	// Deserialize data we've inserted into a value column/field. We place
	// special markers into our strings to mark them as encoded; this isn't
	// as nice as a meta field, but it's the only sane thing we can do whilst
	// keeping localStorage support intact.
	//
	// Oftentimes this will just deserialize JSON content, but if we have a
	// special marker (SERIALIZED_MARKER, defined above), we will extract
	// some kind of arraybuffer/binary data/typed array out of the string.
	function deserialize(value) {
	    // If we haven't marked this string as being specially serialized (i.e.
	    // something other than serialized JSON), we can just return it and be
	    // done with it.
	    if (value.substring(0, SERIALIZED_MARKER_LENGTH) !== SERIALIZED_MARKER) {
	        return JSON.parse(value);
	    }

	    // The following code deals with deserializing some kind of Blob or
	    // TypedArray. First we separate out the type of data we're dealing
	    // with from the data itself.
	    var serializedString = value.substring(TYPE_SERIALIZED_MARKER_LENGTH);
	    var type = value.substring(SERIALIZED_MARKER_LENGTH, TYPE_SERIALIZED_MARKER_LENGTH);

	    var blobType;
	    // Backwards-compatible blob type serialization strategy.
	    // DBs created with older versions of localForage will simply not have the blob type.
	    if (type === TYPE_BLOB && BLOB_TYPE_PREFIX_REGEX.test(serializedString)) {
	        var matcher = serializedString.match(BLOB_TYPE_PREFIX_REGEX);
	        blobType = matcher[1];
	        serializedString = serializedString.substring(matcher[0].length);
	    }
	    var buffer = stringToBuffer(serializedString);

	    // Return the right type based on the code/type set during
	    // serialization.
	    switch (type) {
	        case TYPE_ARRAYBUFFER:
	            return buffer;
	        case TYPE_BLOB:
	            return createBlob([buffer], { type: blobType });
	        case TYPE_INT8ARRAY:
	            return new Int8Array(buffer);
	        case TYPE_UINT8ARRAY:
	            return new Uint8Array(buffer);
	        case TYPE_UINT8CLAMPEDARRAY:
	            return new Uint8ClampedArray(buffer);
	        case TYPE_INT16ARRAY:
	            return new Int16Array(buffer);
	        case TYPE_UINT16ARRAY:
	            return new Uint16Array(buffer);
	        case TYPE_INT32ARRAY:
	            return new Int32Array(buffer);
	        case TYPE_UINT32ARRAY:
	            return new Uint32Array(buffer);
	        case TYPE_FLOAT32ARRAY:
	            return new Float32Array(buffer);
	        case TYPE_FLOAT64ARRAY:
	            return new Float64Array(buffer);
	        default:
	            throw new Error('Unkown type: ' + type);
	    }
	}

	var localforageSerializer = {
	    serialize: serialize,
	    deserialize: deserialize,
	    stringToBuffer: stringToBuffer,
	    bufferToString: bufferToString
	};

	/*
	 * Includes code from:
	 *
	 * base64-arraybuffer
	 * https://github.com/niklasvh/base64-arraybuffer
	 *
	 * Copyright (c) 2012 Niklas von Hertzen
	 * Licensed under the MIT license.
	 */

	function createDbTable(t, dbInfo, callback, errorCallback) {
	    t.executeSql('CREATE TABLE IF NOT EXISTS ' + dbInfo.storeName + ' ' + '(id INTEGER PRIMARY KEY, key unique, value)', [], callback, errorCallback);
	}

	// Open the WebSQL database (automatically creates one if one didn't
	// previously exist), using any options set in the config.
	function _initStorage$1(options) {
	    var self = this;
	    var dbInfo = {
	        db: null
	    };

	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = typeof options[i] !== 'string' ? options[i].toString() : options[i];
	        }
	    }

	    var dbInfoPromise = new Promise$1(function (resolve, reject) {
	        // Open the database; the openDatabase API will automatically
	        // create it for us if it doesn't exist.
	        try {
	            dbInfo.db = openDatabase(dbInfo.name, String(dbInfo.version), dbInfo.description, dbInfo.size);
	        } catch (e) {
	            return reject(e);
	        }

	        // Create our key/value table if it doesn't exist.
	        dbInfo.db.transaction(function (t) {
	            createDbTable(t, dbInfo, function () {
	                self._dbInfo = dbInfo;
	                resolve();
	            }, function (t, error) {
	                reject(error);
	            });
	        }, reject);
	    });

	    dbInfo.serializer = localforageSerializer;
	    return dbInfoPromise;
	}

	function tryExecuteSql(t, dbInfo, sqlStatement, args, callback, errorCallback) {
	    t.executeSql(sqlStatement, args, callback, function (t, error) {
	        if (error.code === error.SYNTAX_ERR) {
	            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name = ?", [dbInfo.storeName], function (t, results) {
	                if (!results.rows.length) {
	                    // if the table is missing (was deleted)
	                    // re-create it table and retry
	                    createDbTable(t, dbInfo, function () {
	                        t.executeSql(sqlStatement, args, callback, errorCallback);
	                    }, errorCallback);
	                } else {
	                    errorCallback(t, error);
	                }
	            }, errorCallback);
	        } else {
	            errorCallback(t, error);
	        }
	    }, errorCallback);
	}

	function getItem$1(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName + ' WHERE key = ? LIMIT 1', [key], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).value : null;

	                    // Check to see if this is serialized content we need to
	                    // unpack.
	                    if (result) {
	                        result = dbInfo.serializer.deserialize(result);
	                    }

	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function iterate$1(iterator, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;

	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT * FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var rows = results.rows;
	                    var length = rows.length;

	                    for (var i = 0; i < length; i++) {
	                        var item = rows.item(i);
	                        var result = item.value;

	                        // Check to see if this is serialized content
	                        // we need to unpack.
	                        if (result) {
	                            result = dbInfo.serializer.deserialize(result);
	                        }

	                        result = iterator(result, item.key, i + 1);

	                        // void(0) prevents problems with redefinition
	                        // of `undefined`.
	                        if (result !== void 0) {
	                            resolve(result);
	                            return;
	                        }
	                    }

	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function _setItem(key, value, callback, retriesLeft) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            // The localStorage API doesn't return undefined values in an
	            // "expected" way, so undefined is always cast to null in all
	            // drivers. See: https://github.com/mozilla/localForage/pull/42
	            if (value === undefined) {
	                value = null;
	            }

	            // Save the original value to pass to the callback.
	            var originalValue = value;

	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    dbInfo.db.transaction(function (t) {
	                        tryExecuteSql(t, dbInfo, 'INSERT OR REPLACE INTO ' + dbInfo.storeName + ' ' + '(key, value) VALUES (?, ?)', [key, value], function () {
	                            resolve(originalValue);
	                        }, function (t, error) {
	                            reject(error);
	                        });
	                    }, function (sqlError) {
	                        // The transaction failed; check
	                        // to see if it's a quota error.
	                        if (sqlError.code === sqlError.QUOTA_ERR) {
	                            // We reject the callback outright for now, but
	                            // it's worth trying to re-run the transaction.
	                            // Even if the user accepts the prompt to use
	                            // more storage on Safari, this error will
	                            // be called.
	                            //
	                            // Try to re-run the transaction.
	                            if (retriesLeft > 0) {
	                                resolve(_setItem.apply(self, [key, originalValue, callback, retriesLeft - 1]));
	                                return;
	                            }
	                            reject(sqlError);
	                        }
	                    });
	                }
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function setItem$1(key, value, callback) {
	    return _setItem.apply(this, [key, value, callback, 1]);
	}

	function removeItem$1(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName + ' WHERE key = ?', [key], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Deletes every item in the table.
	// TODO: Find out if this resets the AUTO_INCREMENT number.
	function clear$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'DELETE FROM ' + dbInfo.storeName, [], function () {
	                    resolve();
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Does a simple `COUNT(key)` to get the number of items stored in
	// localForage.
	function length$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                // Ahhh, SQL makes this one soooooo easy.
	                tryExecuteSql(t, dbInfo, 'SELECT COUNT(key) as c FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var result = results.rows.item(0).c;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Return the key located at key index X; essentially gets the key from a
	// `WHERE id = ?`. This is the most efficient way I can think to implement
	// this rarely-used (in my experience) part of the API, but it can seem
	// inconsistent, because we do `INSERT OR REPLACE INTO` on `setItem()`, so
	// the ID of each key will change every time it's updated. Perhaps a stored
	// procedure for the `setItem()` SQL would solve this problem?
	// TODO: Don't change ID on `setItem()`.
	function key$1(n, callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName + ' WHERE id = ? LIMIT 1', [n + 1], function (t, results) {
	                    var result = results.rows.length ? results.rows.item(0).key : null;
	                    resolve(result);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys$1(callback) {
	    var self = this;

	    var promise = new Promise$1(function (resolve, reject) {
	        self.ready().then(function () {
	            var dbInfo = self._dbInfo;
	            dbInfo.db.transaction(function (t) {
	                tryExecuteSql(t, dbInfo, 'SELECT key FROM ' + dbInfo.storeName, [], function (t, results) {
	                    var keys = [];

	                    for (var i = 0; i < results.rows.length; i++) {
	                        keys.push(results.rows.item(i).key);
	                    }

	                    resolve(keys);
	                }, function (t, error) {
	                    reject(error);
	                });
	            });
	        })["catch"](reject);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// https://www.w3.org/TR/webdatabase/#databases
	// > There is no way to enumerate or delete the databases available for an origin from this API.
	function getAllStoreNames(db) {
	    return new Promise$1(function (resolve, reject) {
	        db.transaction(function (t) {
	            t.executeSql('SELECT name FROM sqlite_master ' + "WHERE type='table' AND name <> '__WebKitDatabaseInfoTable__'", [], function (t, results) {
	                var storeNames = [];

	                for (var i = 0; i < results.rows.length; i++) {
	                    storeNames.push(results.rows.item(i).name);
	                }

	                resolve({
	                    db: db,
	                    storeNames: storeNames
	                });
	            }, function (t, error) {
	                reject(error);
	            });
	        }, function (sqlError) {
	            reject(sqlError);
	        });
	    });
	}

	function dropInstance$1(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    var currentConfig = this.config();
	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        promise = new Promise$1(function (resolve) {
	            var db;
	            if (options.name === currentConfig.name) {
	                // use the db reference of the current instance
	                db = self._dbInfo.db;
	            } else {
	                db = openDatabase(options.name, '', '', 0);
	            }

	            if (!options.storeName) {
	                // drop all database tables
	                resolve(getAllStoreNames(db));
	            } else {
	                resolve({
	                    db: db,
	                    storeNames: [options.storeName]
	                });
	            }
	        }).then(function (operationInfo) {
	            return new Promise$1(function (resolve, reject) {
	                operationInfo.db.transaction(function (t) {
	                    function dropTable(storeName) {
	                        return new Promise$1(function (resolve, reject) {
	                            t.executeSql('DROP TABLE IF EXISTS ' + storeName, [], function () {
	                                resolve();
	                            }, function (t, error) {
	                                reject(error);
	                            });
	                        });
	                    }

	                    var operations = [];
	                    for (var i = 0, len = operationInfo.storeNames.length; i < len; i++) {
	                        operations.push(dropTable(operationInfo.storeNames[i]));
	                    }

	                    Promise$1.all(operations).then(function () {
	                        resolve();
	                    })["catch"](function (e) {
	                        reject(e);
	                    });
	                }, function (sqlError) {
	                    reject(sqlError);
	                });
	            });
	        });
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var webSQLStorage = {
	    _driver: 'webSQLStorage',
	    _initStorage: _initStorage$1,
	    _support: isWebSQLValid(),
	    iterate: iterate$1,
	    getItem: getItem$1,
	    setItem: setItem$1,
	    removeItem: removeItem$1,
	    clear: clear$1,
	    length: length$1,
	    key: key$1,
	    keys: keys$1,
	    dropInstance: dropInstance$1
	};

	function isLocalStorageValid() {
	    try {
	        return typeof localStorage !== 'undefined' && 'setItem' in localStorage &&
	        // in IE8 typeof localStorage.setItem === 'object'
	        !!localStorage.setItem;
	    } catch (e) {
	        return false;
	    }
	}

	function _getKeyPrefix(options, defaultConfig) {
	    var keyPrefix = options.name + '/';

	    if (options.storeName !== defaultConfig.storeName) {
	        keyPrefix += options.storeName + '/';
	    }
	    return keyPrefix;
	}

	// Check if localStorage throws when saving an item
	function checkIfLocalStorageThrows() {
	    var localStorageTestKey = '_localforage_support_test';

	    try {
	        localStorage.setItem(localStorageTestKey, true);
	        localStorage.removeItem(localStorageTestKey);

	        return false;
	    } catch (e) {
	        return true;
	    }
	}

	// Check if localStorage is usable and allows to save an item
	// This method checks if localStorage is usable in Safari Private Browsing
	// mode, or in any other case where the available quota for localStorage
	// is 0 and there wasn't any saved items yet.
	function _isLocalStorageUsable() {
	    return !checkIfLocalStorageThrows() || localStorage.length > 0;
	}

	// Config the localStorage backend, using options set in the config.
	function _initStorage$2(options) {
	    var self = this;
	    var dbInfo = {};
	    if (options) {
	        for (var i in options) {
	            dbInfo[i] = options[i];
	        }
	    }

	    dbInfo.keyPrefix = _getKeyPrefix(options, self._defaultConfig);

	    if (!_isLocalStorageUsable()) {
	        return Promise$1.reject();
	    }

	    self._dbInfo = dbInfo;
	    dbInfo.serializer = localforageSerializer;

	    return Promise$1.resolve();
	}

	// Remove all keys from the datastore, effectively destroying all data in
	// the app's key/value store!
	function clear$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var keyPrefix = self._dbInfo.keyPrefix;

	        for (var i = localStorage.length - 1; i >= 0; i--) {
	            var key = localStorage.key(i);

	            if (key.indexOf(keyPrefix) === 0) {
	                localStorage.removeItem(key);
	            }
	        }
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Retrieve an item from the store. Unlike the original async_storage
	// library in Gaia, we don't modify return values at all. If a key's value
	// is `undefined`, we pass that value to the callback function.
	function getItem$2(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result = localStorage.getItem(dbInfo.keyPrefix + key);

	        // If a result was found, parse it from the serialized
	        // string into a JS object. If result isn't truthy, the key
	        // is likely undefined and we'll pass it straight to the
	        // callback.
	        if (result) {
	            result = dbInfo.serializer.deserialize(result);
	        }

	        return result;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Iterate over all items in the store.
	function iterate$2(iterator, callback) {
	    var self = this;

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var keyPrefix = dbInfo.keyPrefix;
	        var keyPrefixLength = keyPrefix.length;
	        var length = localStorage.length;

	        // We use a dedicated iterator instead of the `i` variable below
	        // so other keys we fetch in localStorage aren't counted in
	        // the `iterationNumber` argument passed to the `iterate()`
	        // callback.
	        //
	        // See: github.com/mozilla/localForage/pull/435#discussion_r38061530
	        var iterationNumber = 1;

	        for (var i = 0; i < length; i++) {
	            var key = localStorage.key(i);
	            if (key.indexOf(keyPrefix) !== 0) {
	                continue;
	            }
	            var value = localStorage.getItem(key);

	            // If a result was found, parse it from the serialized
	            // string into a JS object. If result isn't truthy, the
	            // key is likely undefined and we'll pass it straight
	            // to the iterator.
	            if (value) {
	                value = dbInfo.serializer.deserialize(value);
	            }

	            value = iterator(value, key.substring(keyPrefixLength), iterationNumber++);

	            if (value !== void 0) {
	                return value;
	            }
	        }
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Same as localStorage's key() method, except takes a callback.
	function key$2(n, callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var result;
	        try {
	            result = localStorage.key(n);
	        } catch (error) {
	            result = null;
	        }

	        // Remove the prefix from the key, if a key is found.
	        if (result) {
	            result = result.substring(dbInfo.keyPrefix.length);
	        }

	        return result;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function keys$2(callback) {
	    var self = this;
	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        var length = localStorage.length;
	        var keys = [];

	        for (var i = 0; i < length; i++) {
	            var itemKey = localStorage.key(i);
	            if (itemKey.indexOf(dbInfo.keyPrefix) === 0) {
	                keys.push(itemKey.substring(dbInfo.keyPrefix.length));
	            }
	        }

	        return keys;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Supply the number of keys in the datastore to the callback function.
	function length$2(callback) {
	    var self = this;
	    var promise = self.keys().then(function (keys) {
	        return keys.length;
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Remove an item from the store, nice and simple.
	function removeItem$2(key, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        var dbInfo = self._dbInfo;
	        localStorage.removeItem(dbInfo.keyPrefix + key);
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	// Set a key's value and run an optional callback once the value is set.
	// Unlike Gaia's implementation, the callback function is passed the value,
	// in case you want to operate on that value only after you're sure it
	// saved, or something like that.
	function setItem$2(key, value, callback) {
	    var self = this;

	    key = normalizeKey(key);

	    var promise = self.ready().then(function () {
	        // Convert undefined values to null.
	        // https://github.com/mozilla/localForage/pull/42
	        if (value === undefined) {
	            value = null;
	        }

	        // Save the original value to pass to the callback.
	        var originalValue = value;

	        return new Promise$1(function (resolve, reject) {
	            var dbInfo = self._dbInfo;
	            dbInfo.serializer.serialize(value, function (value, error) {
	                if (error) {
	                    reject(error);
	                } else {
	                    try {
	                        localStorage.setItem(dbInfo.keyPrefix + key, value);
	                        resolve(originalValue);
	                    } catch (e) {
	                        // localStorage capacity exceeded.
	                        // TODO: Make this a specific error/event.
	                        if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
	                            reject(e);
	                        }
	                        reject(e);
	                    }
	                }
	            });
	        });
	    });

	    executeCallback(promise, callback);
	    return promise;
	}

	function dropInstance$2(options, callback) {
	    callback = getCallback.apply(this, arguments);

	    options = typeof options !== 'function' && options || {};
	    if (!options.name) {
	        var currentConfig = this.config();
	        options.name = options.name || currentConfig.name;
	        options.storeName = options.storeName || currentConfig.storeName;
	    }

	    var self = this;
	    var promise;
	    if (!options.name) {
	        promise = Promise$1.reject('Invalid arguments');
	    } else {
	        promise = new Promise$1(function (resolve) {
	            if (!options.storeName) {
	                resolve(options.name + '/');
	            } else {
	                resolve(_getKeyPrefix(options, self._defaultConfig));
	            }
	        }).then(function (keyPrefix) {
	            for (var i = localStorage.length - 1; i >= 0; i--) {
	                var key = localStorage.key(i);

	                if (key.indexOf(keyPrefix) === 0) {
	                    localStorage.removeItem(key);
	                }
	            }
	        });
	    }

	    executeCallback(promise, callback);
	    return promise;
	}

	var localStorageWrapper = {
	    _driver: 'localStorageWrapper',
	    _initStorage: _initStorage$2,
	    _support: isLocalStorageValid(),
	    iterate: iterate$2,
	    getItem: getItem$2,
	    setItem: setItem$2,
	    removeItem: removeItem$2,
	    clear: clear$2,
	    length: length$2,
	    key: key$2,
	    keys: keys$2,
	    dropInstance: dropInstance$2
	};

	var sameValue = function sameValue(x, y) {
	    return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
	};

	var includes = function includes(array, searchElement) {
	    var len = array.length;
	    var i = 0;
	    while (i < len) {
	        if (sameValue(array[i], searchElement)) {
	            return true;
	        }
	        i++;
	    }

	    return false;
	};

	var isArray = Array.isArray || function (arg) {
	    return Object.prototype.toString.call(arg) === '[object Array]';
	};

	// Drivers are stored here when `defineDriver()` is called.
	// They are shared across all instances of localForage.
	var DefinedDrivers = {};

	var DriverSupport = {};

	var DefaultDrivers = {
	    INDEXEDDB: asyncStorage,
	    WEBSQL: webSQLStorage,
	    LOCALSTORAGE: localStorageWrapper
	};

	var DefaultDriverOrder = [DefaultDrivers.INDEXEDDB._driver, DefaultDrivers.WEBSQL._driver, DefaultDrivers.LOCALSTORAGE._driver];

	var OptionalDriverMethods = ['dropInstance'];

	var LibraryMethods = ['clear', 'getItem', 'iterate', 'key', 'keys', 'length', 'removeItem', 'setItem'].concat(OptionalDriverMethods);

	var DefaultConfig = {
	    description: '',
	    driver: DefaultDriverOrder.slice(),
	    name: 'localforage',
	    // Default DB size is _JUST UNDER_ 5MB, as it's the highest size
	    // we can use without a prompt.
	    size: 4980736,
	    storeName: 'keyvaluepairs',
	    version: 1.0
	};

	function callWhenReady(localForageInstance, libraryMethod) {
	    localForageInstance[libraryMethod] = function () {
	        var _args = arguments;
	        return localForageInstance.ready().then(function () {
	            return localForageInstance[libraryMethod].apply(localForageInstance, _args);
	        });
	    };
	}

	function extend() {
	    for (var i = 1; i < arguments.length; i++) {
	        var arg = arguments[i];

	        if (arg) {
	            for (var _key in arg) {
	                if (arg.hasOwnProperty(_key)) {
	                    if (isArray(arg[_key])) {
	                        arguments[0][_key] = arg[_key].slice();
	                    } else {
	                        arguments[0][_key] = arg[_key];
	                    }
	                }
	            }
	        }
	    }

	    return arguments[0];
	}

	var LocalForage = function () {
	    function LocalForage(options) {
	        _classCallCheck(this, LocalForage);

	        for (var driverTypeKey in DefaultDrivers) {
	            if (DefaultDrivers.hasOwnProperty(driverTypeKey)) {
	                var driver = DefaultDrivers[driverTypeKey];
	                var driverName = driver._driver;
	                this[driverTypeKey] = driverName;

	                if (!DefinedDrivers[driverName]) {
	                    // we don't need to wait for the promise,
	                    // since the default drivers can be defined
	                    // in a blocking manner
	                    this.defineDriver(driver);
	                }
	            }
	        }

	        this._defaultConfig = extend({}, DefaultConfig);
	        this._config = extend({}, this._defaultConfig, options);
	        this._driverSet = null;
	        this._initDriver = null;
	        this._ready = false;
	        this._dbInfo = null;

	        this._wrapLibraryMethodsWithReady();
	        this.setDriver(this._config.driver)["catch"](function () {});
	    }

	    // Set any config values for localForage; can be called anytime before
	    // the first API call (e.g. `getItem`, `setItem`).
	    // We loop through options so we don't overwrite existing config
	    // values.


	    LocalForage.prototype.config = function config(options) {
	        // If the options argument is an object, we use it to set values.
	        // Otherwise, we return either a specified config value or all
	        // config values.
	        if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) === 'object') {
	            // If localforage is ready and fully initialized, we can't set
	            // any new configuration values. Instead, we return an error.
	            if (this._ready) {
	                return new Error("Can't call config() after localforage " + 'has been used.');
	            }

	            for (var i in options) {
	                if (i === 'storeName') {
	                    options[i] = options[i].replace(/\W/g, '_');
	                }

	                if (i === 'version' && typeof options[i] !== 'number') {
	                    return new Error('Database version must be a number.');
	                }

	                this._config[i] = options[i];
	            }

	            // after all config options are set and
	            // the driver option is used, try setting it
	            if ('driver' in options && options.driver) {
	                return this.setDriver(this._config.driver);
	            }

	            return true;
	        } else if (typeof options === 'string') {
	            return this._config[options];
	        } else {
	            return this._config;
	        }
	    };

	    // Used to define a custom driver, shared across all instances of
	    // localForage.


	    LocalForage.prototype.defineDriver = function defineDriver(driverObject, callback, errorCallback) {
	        var promise = new Promise$1(function (resolve, reject) {
	            try {
	                var driverName = driverObject._driver;
	                var complianceError = new Error('Custom driver not compliant; see ' + 'https://mozilla.github.io/localForage/#definedriver');

	                // A driver name should be defined and not overlap with the
	                // library-defined, default drivers.
	                if (!driverObject._driver) {
	                    reject(complianceError);
	                    return;
	                }

	                var driverMethods = LibraryMethods.concat('_initStorage');
	                for (var i = 0, len = driverMethods.length; i < len; i++) {
	                    var driverMethodName = driverMethods[i];

	                    // when the property is there,
	                    // it should be a method even when optional
	                    var isRequired = !includes(OptionalDriverMethods, driverMethodName);
	                    if ((isRequired || driverObject[driverMethodName]) && typeof driverObject[driverMethodName] !== 'function') {
	                        reject(complianceError);
	                        return;
	                    }
	                }

	                var configureMissingMethods = function configureMissingMethods() {
	                    var methodNotImplementedFactory = function methodNotImplementedFactory(methodName) {
	                        return function () {
	                            var error = new Error('Method ' + methodName + ' is not implemented by the current driver');
	                            var promise = Promise$1.reject(error);
	                            executeCallback(promise, arguments[arguments.length - 1]);
	                            return promise;
	                        };
	                    };

	                    for (var _i = 0, _len = OptionalDriverMethods.length; _i < _len; _i++) {
	                        var optionalDriverMethod = OptionalDriverMethods[_i];
	                        if (!driverObject[optionalDriverMethod]) {
	                            driverObject[optionalDriverMethod] = methodNotImplementedFactory(optionalDriverMethod);
	                        }
	                    }
	                };

	                configureMissingMethods();

	                var setDriverSupport = function setDriverSupport(support) {
	                    if (DefinedDrivers[driverName]) {
	                        console.info('Redefining LocalForage driver: ' + driverName);
	                    }
	                    DefinedDrivers[driverName] = driverObject;
	                    DriverSupport[driverName] = support;
	                    // don't use a then, so that we can define
	                    // drivers that have simple _support methods
	                    // in a blocking manner
	                    resolve();
	                };

	                if ('_support' in driverObject) {
	                    if (driverObject._support && typeof driverObject._support === 'function') {
	                        driverObject._support().then(setDriverSupport, reject);
	                    } else {
	                        setDriverSupport(!!driverObject._support);
	                    }
	                } else {
	                    setDriverSupport(true);
	                }
	            } catch (e) {
	                reject(e);
	            }
	        });

	        executeTwoCallbacks(promise, callback, errorCallback);
	        return promise;
	    };

	    LocalForage.prototype.driver = function driver() {
	        return this._driver || null;
	    };

	    LocalForage.prototype.getDriver = function getDriver(driverName, callback, errorCallback) {
	        var getDriverPromise = DefinedDrivers[driverName] ? Promise$1.resolve(DefinedDrivers[driverName]) : Promise$1.reject(new Error('Driver not found.'));

	        executeTwoCallbacks(getDriverPromise, callback, errorCallback);
	        return getDriverPromise;
	    };

	    LocalForage.prototype.getSerializer = function getSerializer(callback) {
	        var serializerPromise = Promise$1.resolve(localforageSerializer);
	        executeTwoCallbacks(serializerPromise, callback);
	        return serializerPromise;
	    };

	    LocalForage.prototype.ready = function ready(callback) {
	        var self = this;

	        var promise = self._driverSet.then(function () {
	            if (self._ready === null) {
	                self._ready = self._initDriver();
	            }

	            return self._ready;
	        });

	        executeTwoCallbacks(promise, callback, callback);
	        return promise;
	    };

	    LocalForage.prototype.setDriver = function setDriver(drivers, callback, errorCallback) {
	        var self = this;

	        if (!isArray(drivers)) {
	            drivers = [drivers];
	        }

	        var supportedDrivers = this._getSupportedDrivers(drivers);

	        function setDriverToConfig() {
	            self._config.driver = self.driver();
	        }

	        function extendSelfWithDriver(driver) {
	            self._extend(driver);
	            setDriverToConfig();

	            self._ready = self._initStorage(self._config);
	            return self._ready;
	        }

	        function initDriver(supportedDrivers) {
	            return function () {
	                var currentDriverIndex = 0;

	                function driverPromiseLoop() {
	                    while (currentDriverIndex < supportedDrivers.length) {
	                        var driverName = supportedDrivers[currentDriverIndex];
	                        currentDriverIndex++;

	                        self._dbInfo = null;
	                        self._ready = null;

	                        return self.getDriver(driverName).then(extendSelfWithDriver)["catch"](driverPromiseLoop);
	                    }

	                    setDriverToConfig();
	                    var error = new Error('No available storage method found.');
	                    self._driverSet = Promise$1.reject(error);
	                    return self._driverSet;
	                }

	                return driverPromiseLoop();
	            };
	        }

	        // There might be a driver initialization in progress
	        // so wait for it to finish in order to avoid a possible
	        // race condition to set _dbInfo
	        var oldDriverSetDone = this._driverSet !== null ? this._driverSet["catch"](function () {
	            return Promise$1.resolve();
	        }) : Promise$1.resolve();

	        this._driverSet = oldDriverSetDone.then(function () {
	            var driverName = supportedDrivers[0];
	            self._dbInfo = null;
	            self._ready = null;

	            return self.getDriver(driverName).then(function (driver) {
	                self._driver = driver._driver;
	                setDriverToConfig();
	                self._wrapLibraryMethodsWithReady();
	                self._initDriver = initDriver(supportedDrivers);
	            });
	        })["catch"](function () {
	            setDriverToConfig();
	            var error = new Error('No available storage method found.');
	            self._driverSet = Promise$1.reject(error);
	            return self._driverSet;
	        });

	        executeTwoCallbacks(this._driverSet, callback, errorCallback);
	        return this._driverSet;
	    };

	    LocalForage.prototype.supports = function supports(driverName) {
	        return !!DriverSupport[driverName];
	    };

	    LocalForage.prototype._extend = function _extend(libraryMethodsAndProperties) {
	        extend(this, libraryMethodsAndProperties);
	    };

	    LocalForage.prototype._getSupportedDrivers = function _getSupportedDrivers(drivers) {
	        var supportedDrivers = [];
	        for (var i = 0, len = drivers.length; i < len; i++) {
	            var driverName = drivers[i];
	            if (this.supports(driverName)) {
	                supportedDrivers.push(driverName);
	            }
	        }
	        return supportedDrivers;
	    };

	    LocalForage.prototype._wrapLibraryMethodsWithReady = function _wrapLibraryMethodsWithReady() {
	        // Add a stub for each driver API method that delays the call to the
	        // corresponding driver method until localForage is ready. These stubs
	        // will be replaced by the driver methods as soon as the driver is
	        // loaded, so there is no performance impact.
	        for (var i = 0, len = LibraryMethods.length; i < len; i++) {
	            callWhenReady(this, LibraryMethods[i]);
	        }
	    };

	    LocalForage.prototype.createInstance = function createInstance(options) {
	        return new LocalForage(options);
	    };

	    return LocalForage;
	}();

	// The actual localForage object that we expose as a module or via a
	// global. It's extended by pulling in one of our other libraries.


	var localforage_js = new LocalForage();

	module.exports = localforage_js;

	},{"3":3}]},{},[4])(4)
	});
	});

	// Localforage returns null if an item is not found, so we represent null with this uuid instead.
	// not foolproof, but good enough for now.
	var LOCALFORAGE_NULL = "c2fc1ad0-f76f-11ec-b939-0242ac120002";
	var notInLocalForage = /*#__PURE__*/new Set();
	localforage.config({
	  driver: [localforage.LOCALSTORAGE, localforage.INDEXEDDB, localforage.WEBSQL]
	});
	/**
	  Our very own implementation of the Gun API
	 */
	var Node = /*#__PURE__*/function () {
	  /** */
	  function Node(id, parent) {
	    var _this = this;
	    if (id === void 0) {
	      id = '';
	    }
	    if (parent === void 0) {
	      parent = null;
	    }
	    this.children = new Map();
	    this.on_subscriptions = new Map();
	    this.map_subscriptions = new Map();
	    this.value = undefined;
	    this.counter = 0;
	    this.loaded = false;
	    this.saveLocalForage = _.throttle( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var children;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (_this.loaded) {
	                _context.next = 3;
	                break;
	              }
	              _context.next = 3;
	              return _this.loadLocalForage();
	            case 3:
	              if (_this.children.size) {
	                children = Array.from(_this.children.keys());
	                localforage.setItem(_this.id, children);
	              } else if (_this.value === undefined) {
	                localforage.removeItem(_this.id);
	              } else {
	                localforage.setItem(_this.id, _this.value === null ? LOCALFORAGE_NULL : _this.value);
	              }
	            case 4:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    })), 500);
	    this.loadLocalForage = _.throttle( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
	      var result, newResult;
	      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              if (!notInLocalForage.has(_this.id)) {
	                _context3.next = 2;
	                break;
	              }
	              return _context3.abrupt("return", undefined);
	            case 2:
	              _context3.next = 4;
	              return localforage.getItem(_this.id);
	            case 4:
	              result = _context3.sent;
	              if (!(result === null)) {
	                _context3.next = 10;
	                break;
	              }
	              result = undefined;
	              notInLocalForage.add(_this.id);
	              _context3.next = 22;
	              break;
	            case 10:
	              if (!(result === LOCALFORAGE_NULL)) {
	                _context3.next = 14;
	                break;
	              }
	              result = null;
	              _context3.next = 22;
	              break;
	            case 14:
	              if (!Array.isArray(result)) {
	                _context3.next = 21;
	                break;
	              }
	              // result is a list of children
	              newResult = {};
	              _context3.next = 18;
	              return Promise.all(result.map( /*#__PURE__*/function () {
	                var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key) {
	                  return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	                    while (1) {
	                      switch (_context2.prev = _context2.next) {
	                        case 0:
	                          _context2.next = 2;
	                          return _this.get(key).once();
	                        case 2:
	                          newResult[key] = _context2.sent;
	                        case 3:
	                        case "end":
	                          return _context2.stop();
	                      }
	                    }
	                  }, _callee2);
	                }));
	                return function (_x) {
	                  return _ref3.apply(this, arguments);
	                };
	              }()));
	            case 18:
	              result = newResult;
	              _context3.next = 22;
	              break;
	            case 21:
	              // result is a value
	              _this.value = result;
	            case 22:
	              _this.loaded = true;
	              return _context3.abrupt("return", result);
	            case 24:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    })), 500);
	    this.doCallbacks = _.throttle(function () {
	      var _loop3 = function _loop3() {
	        var _step$value = _step.value,
	          id = _step$value[0],
	          callback = _step$value[1];
	        var event = {
	          off: function off() {
	            return _this.on_subscriptions["delete"](id);
	          }
	        };
	        _this.once(callback, event, false);
	      };
	      for (var _iterator = _createForOfIteratorHelperLoose(_this.on_subscriptions), _step; !(_step = _iterator()).done;) {
	        _loop3();
	      }
	      if (_this.parent) {
	        var _loop = function _loop() {
	          var _step2$value = _step2.value,
	            id = _step2$value[0],
	            callback = _step2$value[1];
	          var event = {
	            off: function off() {
	              return _this.parent.on_subscriptions["delete"](id);
	            }
	          };
	          _this.parent.once(callback, event, false);
	        };
	        for (var _iterator2 = _createForOfIteratorHelperLoose(_this.parent.on_subscriptions), _step2; !(_step2 = _iterator2()).done;) {
	          _loop();
	        }
	        var _loop2 = function _loop2() {
	          var _step3$value = _step3.value,
	            id = _step3$value[0],
	            callback = _step3$value[1];
	          var event = {
	            off: function off() {
	              return _this.parent.map_subscriptions["delete"](id);
	            }
	          };
	          _this.once(callback, event, false);
	        };
	        for (var _iterator3 = _createForOfIteratorHelperLoose(_this.parent.map_subscriptions), _step3; !(_step3 = _iterator3()).done;) {
	          _loop2();
	        }
	      }
	    }, 40);
	    this.id = id;
	    this.parent = parent;
	  }
	  /**
	   *
	   * @param key
	   * @returns {Node}
	   * @example node.get('users').get('alice').put({name: 'Alice'})
	   */
	  var _proto = Node.prototype;
	  _proto.get = function get(key) {
	    var existing = this.children.get(key);
	    if (existing) {
	      return existing;
	    }
	    var new_node = new Node(this.id + "/" + key, this);
	    this.children.set(key, new_node);
	    this.saveLocalForage();
	    return new_node;
	  }
	  /**
	   * Set a value to the node. If the value is an object, it will be converted to child nodes.
	   * @param value
	   * @example node.get('users').get('alice').put({name: 'Alice'})
	   */;
	  _proto.put = function put(value) {
	    var _this2 = this;
	    if (Array.isArray(value)) {
	      throw new Error('Sorry, we don\'t deal with arrays');
	    }
	    if (typeof value === 'object' && value !== null) {
	      this.value = undefined;
	      for (var key in value) {
	        this.get(key).put(value[key]);
	      }
	      _.defer(function () {
	        return _this2.doCallbacks();
	      }, 100);
	      return;
	    }
	    this.children = new Map();
	    this.value = value;
	    this.doCallbacks();
	    this.saveLocalForage();
	  }
	  // protip: the code would be a lot cleaner if you separated the Node API from storage adapters.
	  /**
	   * Return a value without subscribing to it
	   * @param callback
	   * @param event
	   * @param returnIfUndefined
	   * @returns {Promise<*>}
	   */;
	  _proto.once =
	  /*#__PURE__*/
	  function () {
	    var _once = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(callback, event, returnIfUndefined) {
	      var _this3 = this;
	      var result;
	      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              if (returnIfUndefined === void 0) {
	                returnIfUndefined = true;
	              }
	              if (!this.children.size) {
	                _context5.next = 7;
	                break;
	              }
	              // return an object containing all children
	              result = {};
	              _context5.next = 5;
	              return Promise.all(Array.from(this.children.keys()).map( /*#__PURE__*/function () {
	                var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(key) {
	                  return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	                    while (1) {
	                      switch (_context4.prev = _context4.next) {
	                        case 0:
	                          _context4.next = 2;
	                          return _this3.get(key).once(undefined, event);
	                        case 2:
	                          result[key] = _context4.sent;
	                        case 3:
	                        case "end":
	                          return _context4.stop();
	                      }
	                    }
	                  }, _callee4);
	                }));
	                return function (_x5) {
	                  return _ref4.apply(this, arguments);
	                };
	              }()));
	            case 5:
	              _context5.next = 14;
	              break;
	            case 7:
	              if (!(this.value !== undefined)) {
	                _context5.next = 11;
	                break;
	              }
	              result = this.value;
	              _context5.next = 14;
	              break;
	            case 11:
	              _context5.next = 13;
	              return this.loadLocalForage();
	            case 13:
	              result = _context5.sent;
	            case 14:
	              if (!(result !== undefined || returnIfUndefined)) {
	                _context5.next = 17;
	                break;
	              }
	              callback && callback(result, this.id.slice(this.id.lastIndexOf('/') + 1), null, event);
	              return _context5.abrupt("return", result);
	            case 17:
	            case "end":
	              return _context5.stop();
	          }
	        }
	      }, _callee5, this);
	    }));
	    function once(_x2, _x3, _x4) {
	      return _once.apply(this, arguments);
	    }
	    return once;
	  }() /**
	       * Subscribe to a value
	       * @param callback
	       */;
	  _proto.on = function on(callback) {
	    var _this4 = this;
	    var id = this.counter++;
	    this.on_subscriptions.set(id, callback);
	    var event = {
	      off: function off() {
	        return _this4.on_subscriptions["delete"](id);
	      }
	    };
	    this.once(callback, event, false);
	  }
	  /**
	   * Subscribe to the children of a node. Callback is called separately for each child.
	   * @param callback
	   * @returns {Promise<void>}
	   */;
	  _proto.map =
	  /*#__PURE__*/
	  function () {
	    var _map = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(callback) {
	      var _this5 = this;
	      var id, event, _iterator4, _step4, child;
	      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              id = this.counter++;
	              this.map_subscriptions.set(id, callback);
	              event = {
	                off: function off() {
	                  return _this5.map_subscriptions["delete"](id);
	                }
	              };
	              if (this.loaded) {
	                _context6.next = 6;
	                break;
	              }
	              _context6.next = 6;
	              return this.loadLocalForage();
	            case 6:
	              for (_iterator4 = _createForOfIteratorHelperLoose(this.children.values()); !(_step4 = _iterator4()).done;) {
	                child = _step4.value;
	                child.once(callback, event, false);
	              }
	            case 7:
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6, this);
	    }));
	    function map(_x6) {
	      return _map.apply(this, arguments);
	    }
	    return map;
	  }();
	  return Node;
	}();

	var local;
	/**
	 * Get a state that is only synced in memory and local storage.
	 *
	 * Useful for storing things like UI state, local indexes or logged in user.
	 * @returns {Node}
	 */
	function local$1 () {
	  if (!local) {
	    local = new Node();
	  }
	  return local;
	}

	var blockedUsers = {};
	function blockedUsers$1 () {
	  if (!blockedUsers) {
	    blockedUsers = {};
	    local$1().get('block').map(function (isBlocked, user) {
	      if (isBlocked === blockedUsers[user]) {
	        return;
	      }
	      if (isBlocked) {
	        blockedUsers[user] = isBlocked;
	        local$1().get('groups').map(function (_v, k) {
	          local$1().get('groups').get(k).get(user).put(false);
	        });
	      } else {
	        delete blockedUsers[user];
	      }
	    });
	  }
	  return blockedUsers;
	}

	var counter = 0;
	var cache = /*#__PURE__*/new Map();
	var callbacks = /*#__PURE__*/new Map();
	/**
	 * Aggregates public data from all users in the group.
	 *
	 * For example, the public message feed, message replies and likes are aggregated using this.
	 * @param groupName
	 * @returns object
	 */
	function group (groupName) {
	  if (groupName === void 0) {
	    groupName = 'everyone';
	  }
	  return {
	    get: function get(path, callback) {
	      var groupNode = local$1().get('groups').get(groupName);
	      var follows = {};
	      requestAnimationFrame(function () {
	        groupNode.map(function (isFollowing, user) {
	          if (blockedUsers$1()[user]) {
	            return;
	          } // TODO: allow to specifically query blocked users?
	          if (follows[user] && follows[user] === isFollowing) {
	            return;
	          }
	          follows[user] = isFollowing;
	          if (isFollowing) {
	            // TODO: callback on unfollow, for unsubscribe
	            var node = publicState(user);
	            if (path && path !== '/') {
	              node = path.split('/').reduce(function (sum, s) {
	                return sum.get(decodeURIComponent(s));
	              }, node);
	            }
	            callback(node, user);
	          }
	        });
	      });
	    },
	    _cached_map: function _cached_map(cached, cacheKey, path, myEvent, callback) {
	      if (!cached) {
	        var _cached = new Map();
	        cache.set(cacheKey, _cached);
	        this.get(path, function (node, from) {
	          return node.map(function (value, key, x) {
	            var item = {
	              value: value,
	              key: key,
	              from: from
	            };
	            _cached.set(key, item);
	            for (var _iterator = _createForOfIteratorHelperLoose(callbacks.get(cacheKey).values()), _step; !(_step = _iterator()).done;) {
	              var cb = _step.value;
	              cb(value, key, x, myEvent, from);
	            }
	          });
	        });
	      } else {
	        for (var _iterator2 = _createForOfIteratorHelperLoose(cached.values()), _step2; !(_step2 = _iterator2()).done;) {
	          var item = _step2.value;
	          callback(item.value, item.key, 0, myEvent, item.from);
	        }
	      }
	    },
	    // TODO: this should probably store just the most recent value, not everyone's value
	    // TODO: for counting of likes etc, use this.count() instead
	    _cached_on: function _cached_on(cached, cacheKey, path, myEvent, callback) {
	      if (!cached) {
	        var _cached2 = new Map();
	        cache.set(cacheKey, _cached2);
	        this.get(path, function (node, from) {
	          return node.on(function (value, key, x) {
	            var item = {
	              value: value,
	              key: key,
	              from: from
	            };
	            _cached2.set(from, item);
	            for (var _iterator3 = _createForOfIteratorHelperLoose(callbacks.get(cacheKey).values()), _step3; !(_step3 = _iterator3()).done;) {
	              var cb = _step3.value;
	              cb(value, key, x, myEvent, from);
	            }
	          });
	        });
	      } else {
	        for (var _iterator4 = _createForOfIteratorHelperLoose(cached.values()), _step4; !(_step4 = _iterator4()).done;) {
	          var item = _step4.value;
	          callback(item.value, item.key, 0, myEvent, item.from);
	        }
	      }
	    },
	    _cached_count: function _cached_count(cached, cacheKey, path, myEvent, callback) {
	      if (!cached) {
	        var _cached3 = new Map();
	        cache.set(cacheKey, _cached3);
	        this.get(path, function (node, from) {
	          return node.on(function (value, key) {
	            value ? _cached3.set(from, true) : _cached3["delete"](from);
	            var count = _cached3.size;
	            for (var _iterator5 = _createForOfIteratorHelperLoose(callbacks.get(cacheKey).values()), _step5; !(_step5 = _iterator5()).done;) {
	              var cb = _step5.value;
	              cb(count, key, null, myEvent, from);
	            }
	          });
	        });
	      } else {
	        callback(cached.size, path.split('/').pop(), null, myEvent);
	      }
	    },
	    _cached_fn: function _cached_fn(fn, path, callback) {
	      var cacheKey = fn + ":" + groupName + ":" + path;
	      var callbackId = counter++;
	      if (callbacks.has(cacheKey)) {
	        callbacks.get(cacheKey).set(callbackId, callback);
	      } else {
	        callbacks.set(cacheKey, new Map([[callbackId, callback]]));
	      }
	      var myEvent = {
	        off: function off() {
	          var myCallbacks = callbacks.get(cacheKey);
	          myCallbacks && myCallbacks["delete"](callbackId);
	        }
	      };
	      var cached = cache.get(cacheKey);
	      switch (fn) {
	        case 'map':
	          this._cached_map(cached, cacheKey, path, myEvent, callback);
	          break;
	        case 'on':
	          this._cached_on(cached, cacheKey, path, myEvent, callback);
	          break;
	        case 'count':
	          this._cached_count(cached, cacheKey, path, myEvent, callback);
	          break;
	      }
	    },
	    map: function map(path, callback) {
	      this._cached_fn('map', path, callback);
	    },
	    on: function on(path, callback) {
	      this._cached_fn('on', path, callback);
	    },
	    count: function count(path, callback) {
	      this._cached_fn('count', path, callback);
	    }
	  };
	}

	var NOTIFICATION_SERVICE_URL = 'https://iris-notifications.herokuapp.com/notify';
	// const notificationSound = new Audio('../../assets/audio/notification.mp3'); // TODO
	var loginTime;
	var unseenMsgsTotal = 0;
	var unseenNotificationCount = 0;
	var webPushSubscriptions = {};
	function desktopNotificationsEnabled() {
	  return window.Notification && Notification.permission === 'granted';
	}
	function notifyMsg(msg, info, channelId, onClick) {
	  function shouldNotify() {
	    if (msg.timeObj < loginTime) {
	      return false;
	    }
	    if (info.selfAuthored) {
	      return false;
	    }
	    if (document.visibilityState === 'visible') {
	      return false;
	    }
	    var channel = privateState(channelId);
	    if (channel.notificationSetting === 'nothing') {
	      return false;
	    }
	    if (channel.notificationSetting === 'mentions' && !msg.text.includes(session.getMyName())) {
	      return false;
	    }
	    return true;
	  }
	  function shouldDesktopNotify() {
	    if (!desktopNotificationsEnabled()) {
	      return false;
	    }
	    return shouldNotify();
	  }
	  function shouldAudioNotify() {
	    return shouldNotify();
	  }
	  if (shouldAudioNotify()) ;
	  if (shouldDesktopNotify()) {
	    var body, title;
	    var channel = privateState(channelId);
	    if (channel.uuid) {
	      title = channel.participantProfiles[info.from].name;
	      body = name + ": " + msg.text;
	    } else {
	      title = 'Message';
	      body = msg.text;
	    }
	    body = util.truncateString(body, 50);
	    var desktopNotification = new Notification(title, {
	      icon: '/assets/img/icon128.png',
	      body: body,
	      silent: true
	    });
	    desktopNotification.onclick = function () {
	      changeUnseenNotificationCount(-1);
	      onClick && onClick();
	      window.focus();
	    };
	  }
	}
	function changeChatUnseenMsgsCount(chatId, change) {
	  var chat = privateState(chatId);
	  if (!chat) return;
	  var chatNode = local$1().get('channels').get(chatId);
	  if (change) {
	    unseenMsgsTotal += change;
	    chat.unseen += change;
	  } else {
	    unseenMsgsTotal = unseenMsgsTotal - (chat.unseen || 0);
	    chat.unseen = 0;
	  }
	  chatNode.get('unseen').put(chat.unseen);
	  unseenMsgsTotal = unseenMsgsTotal >= 0 ? unseenMsgsTotal : 0;
	  local$1().get('unseenMsgsTotal').put(unseenMsgsTotal);
	}
	var publicVapidKey = 'BMqSvZArOIdn7vGkYplSpkZ70-Qt8nhYbey26WVa3LF3SwzblSzm3n3HHycpNkAKVq7MCkrzFuTFs_en7Y_J2MI';
	function urlBase64ToUint8Array(base64String) {
	  var padding = '='.repeat((4 - base64String.length % 4) % 4);
	  var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	  var rawData = window.atob(base64);
	  var outputArray = new Uint8Array(rawData.length);
	  for (var i = 0; i < rawData.length; ++i) {
	    outputArray[i] = rawData.charCodeAt(i);
	  }
	  return outputArray;
	}
	function subscribe(_x) {
	  return _subscribe.apply(this, arguments);
	}
	function _subscribe() {
	  _subscribe = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(reg) {
	    var subscription;
	    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	      while (1) {
	        switch (_context3.prev = _context3.next) {
	          case 0:
	            _context3.prev = 0;
	            _context3.next = 3;
	            return reg.pushManager.subscribe({
	              userVisibleOnly: true,
	              applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
	            });
	          case 3:
	            subscription = _context3.sent;
	            addWebPushSubscription(subscription);
	            _context3.next = 10;
	            break;
	          case 7:
	            _context3.prev = 7;
	            _context3.t0 = _context3["catch"](0);
	            console.error('web push subscription error', _context3.t0);
	          case 10:
	          case "end":
	            return _context3.stop();
	        }
	      }
	    }, _callee3, null, [[0, 7]]);
	  }));
	  return _subscribe.apply(this, arguments);
	}
	function subscribeToWebPush() {
	  return _subscribeToWebPush.apply(this, arguments);
	}
	function _subscribeToWebPush() {
	  _subscribeToWebPush = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
	    var reg, sub;
	    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	      while (1) {
	        switch (_context4.prev = _context4.next) {
	          case 0:
	            console.log('subscribing to web push', navigator.serviceWorker);
	            if (!(!desktopNotificationsEnabled() || !navigator.serviceWorker)) {
	              _context4.next = 3;
	              break;
	            }
	            return _context4.abrupt("return", false);
	          case 3:
	            _context4.next = 5;
	            return navigator.serviceWorker.ready;
	          case 5:
	            _context4.next = 7;
	            return navigator.serviceWorker.getRegistration();
	          case 7:
	            reg = _context4.sent;
	            reg.active.postMessage({
	              key: session.getKey()
	            });
	            _context4.next = 11;
	            return reg.pushManager.getSubscription();
	          case 11:
	            sub = _context4.sent;
	            sub ? addWebPushSubscription(sub) : subscribe(reg);
	          case 13:
	          case "end":
	            return _context4.stop();
	        }
	      }
	    }, _callee4);
	  }));
	  return _subscribeToWebPush.apply(this, arguments);
	}
	var addWebPushSubscriptionsToChats = /*#__PURE__*/_.debounce(function () {
	  var arr = Object.values(webPushSubscriptions);
	  session.channelIds.forEach(function (channelId) {
	    privateState(channelId).put('webPushSubscriptions', arr);
	  });
	}, 5000);
	function removeSubscription(hash) {
	  delete webPushSubscriptions[hash];
	  global$2().user().get('webPushSubscriptions').get(hash).put(null);
	  addWebPushSubscriptionsToChats();
	}
	function addWebPushSubscription(_x2, _x3) {
	  return _addWebPushSubscription.apply(this, arguments);
	}
	function _addWebPushSubscription() {
	  _addWebPushSubscription = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(s, saveToGun) {
	    var myKey, mySecret, enc, hash;
	    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
	      while (1) {
	        switch (_context5.prev = _context5.next) {
	          case 0:
	            if (saveToGun === void 0) {
	              saveToGun = true;
	            }
	            myKey = session.getKey();
	            _context5.next = 4;
	            return gun$1.SEA.secret(myKey.epub, myKey);
	          case 4:
	            mySecret = _context5.sent;
	            _context5.next = 7;
	            return gun$1.SEA.encrypt(s, mySecret);
	          case 7:
	            enc = _context5.sent;
	            _context5.next = 10;
	            return util.getHash(JSON.stringify(s));
	          case 10:
	            hash = _context5.sent;
	            if (saveToGun) {
	              global$2().user().get('webPushSubscriptions').get(hash).put(enc);
	            }
	            webPushSubscriptions[hash] = s;
	            addWebPushSubscriptionsToChats();
	          case 14:
	          case "end":
	            return _context5.stop();
	        }
	      }
	    }, _callee5);
	  }));
	  return _addWebPushSubscription.apply(this, arguments);
	}
	function getWebPushSubscriptions() {
	  return _getWebPushSubscriptions.apply(this, arguments);
	}
	function _getWebPushSubscriptions() {
	  _getWebPushSubscriptions = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
	    var myKey, mySecret;
	    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
	      while (1) {
	        switch (_context7.prev = _context7.next) {
	          case 0:
	            myKey = session.getKey();
	            _context7.next = 3;
	            return gun$1.SEA.secret(myKey.epub, myKey);
	          case 3:
	            mySecret = _context7.sent;
	            global$2().user().get('webPushSubscriptions').map().on( /*#__PURE__*/function () {
	              var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(enc) {
	                var s;
	                return _regeneratorRuntime().wrap(function _callee6$(_context6) {
	                  while (1) {
	                    switch (_context6.prev = _context6.next) {
	                      case 0:
	                        if (enc) {
	                          _context6.next = 2;
	                          break;
	                        }
	                        return _context6.abrupt("return");
	                      case 2:
	                        _context6.next = 4;
	                        return gun$1.SEA.decrypt(enc, mySecret);
	                      case 4:
	                        s = _context6.sent;
	                        addWebPushSubscription(s, false);
	                      case 6:
	                      case "end":
	                        return _context6.stop();
	                    }
	                  }
	                }, _callee6);
	              }));
	              return function (_x18) {
	                return _ref3.apply(this, arguments);
	              };
	            }());
	          case 5:
	          case "end":
	            return _context7.stop();
	        }
	      }
	    }, _callee7);
	  }));
	  return _getWebPushSubscriptions.apply(this, arguments);
	}
	function getEpub(user) {
	  return new Promise(function (resolve) {
	    global$2().user(user).get('epub').on( /*#__PURE__*/function () {
	      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(epub, k, x, e) {
	        return _regeneratorRuntime().wrap(function _callee$(_context) {
	          while (1) {
	            switch (_context.prev = _context.next) {
	              case 0:
	                if (epub) {
	                  e.off();
	                  resolve(epub);
	                }
	              case 1:
	              case "end":
	                return _context.stop();
	            }
	          }
	        }, _callee);
	      }));
	      return function (_x4, _x5, _x6, _x7) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  });
	}
	function getNotificationText(_x8) {
	  return _getNotificationText.apply(this, arguments);
	}
	function _getNotificationText() {
	  _getNotificationText = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(notification) {
	    var profile, name, event, eventText;
	    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
	      while (1) {
	        switch (_context8.prev = _context8.next) {
	          case 0:
	            _context8.next = 2;
	            return global$2().user(notification.from).get('profile').once();
	          case 2:
	            profile = _context8.sent;
	            name = profile && profile.name || 'someone';
	            event = notification.event || notification.action;
	            if (event === 'like') eventText = name + " liked your post";else if (event === 'reply') eventText = name + " replied to your post";else if (event === 'mention') eventText = name + " mentioned you in their post";else if (event === 'follow') eventText = name + " started following you";else eventText = name + " sent you a notification: " + event;
	            return _context8.abrupt("return", eventText);
	          case 7:
	          case "end":
	            return _context8.stop();
	        }
	      }
	    }, _callee8);
	  }));
	  return _getNotificationText.apply(this, arguments);
	}
	function subscribeToIrisNotifications(onClick) {
	  var notificationsSeenTime;
	  var notificationsShownTime;
	  global$2().user().get('notificationsSeenTime').on(function (v) {
	    notificationsSeenTime = v;
	    console.log(v);
	  });
	  global$2().user().get('notificationsShownTime').on(function (v) {
	    return notificationsShownTime = v;
	  });
	  var setNotificationsShownTime = _.debounce(function () {
	    global$2().user().get('notificationsShownTime').put(new Date().toISOString());
	  }, 1000);
	  var alreadyHave = new Set();
	  group().on("notifications/" + session.getPubKey(), /*#__PURE__*/function () {
	    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(encryptedNotification, k, x, e, from) {
	      var id, epub, secret, notification, text, desktopNotification;
	      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              id = from.slice(0, 30) + encryptedNotification.slice(0, 30);
	              if (!alreadyHave.has(id)) {
	                _context2.next = 3;
	                break;
	              }
	              return _context2.abrupt("return");
	            case 3:
	              alreadyHave.add(id);
	              _context2.next = 6;
	              return getEpub(from);
	            case 6:
	              epub = _context2.sent;
	              _context2.next = 9;
	              return gun$1.SEA.secret(epub, session.getKey());
	            case 9:
	              secret = _context2.sent;
	              _context2.next = 12;
	              return gun$1.SEA.decrypt(encryptedNotification, secret);
	            case 12:
	              notification = _context2.sent;
	              if (!(!notification || typeof notification !== 'object')) {
	                _context2.next = 15;
	                break;
	              }
	              return _context2.abrupt("return");
	            case 15:
	              setNotificationsShownTime();
	              notification.from = from;
	              local$1().get('notifications').get(notification.time).put(notification);
	              if (!notificationsSeenTime || notificationsSeenTime < notification.time) {
	                changeUnseenNotificationCount(1);
	              }
	              if (!(!notificationsShownTime || notificationsShownTime < notification.time)) {
	                _context2.next = 26;
	                break;
	              }
	              console.log('was new!');
	              _context2.next = 23;
	              return getNotificationText(notification);
	            case 23:
	              text = _context2.sent;
	              desktopNotification = new Notification(text, {
	                icon: '/assets/img/icon128.png',
	                body: text,
	                silent: true
	              });
	              desktopNotification.onclick = function () {
	                var link = notification.target ? "/post/" + notification.target : "/profile/" + notification.from;
	                onClick && onClick(link);
	                changeUnseenNotificationCount(-1);
	                window.focus();
	              };
	            case 26:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2);
	    }));
	    return function (_x9, _x10, _x11, _x12, _x13) {
	      return _ref2.apply(this, arguments);
	    };
	  }());
	}
	function changeUnseenNotificationCount(change) {
	  if (!change) {
	    unseenNotificationCount = 0;
	    global$2().user().get('notificationsSeenTime').put(new Date().toISOString());
	  } else {
	    unseenNotificationCount += change;
	    unseenNotificationCount = Math.max(unseenNotificationCount, 0);
	  }
	  local$1().get('unseenNotificationCount').put(unseenNotificationCount);
	}
	function sendIrisNotification(_x14, _x15) {
	  return _sendIrisNotification.apply(this, arguments);
	}
	function _sendIrisNotification() {
	  _sendIrisNotification = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(recipient, notification) {
	    var epub, secret, enc;
	    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
	      while (1) {
	        switch (_context9.prev = _context9.next) {
	          case 0:
	            if (recipient && notification) {
	              _context9.next = 2;
	              break;
	            }
	            return _context9.abrupt("return");
	          case 2:
	            // TODO: use typescript or sth :D
	            if (typeof notification === 'object') {
	              notification.time = new Date().toISOString();
	            }
	            _context9.next = 5;
	            return getEpub(recipient);
	          case 5:
	            epub = _context9.sent;
	            _context9.next = 8;
	            return gun$1.SEA.secret(epub, session.getKey());
	          case 8:
	            secret = _context9.sent;
	            _context9.next = 11;
	            return gun$1.SEA.encrypt(notification, secret);
	          case 11:
	            enc = _context9.sent;
	            global$2().user().get('notifications').get(recipient).put(enc);
	          case 13:
	          case "end":
	            return _context9.stop();
	        }
	      }
	    }, _callee9);
	  }));
	  return _sendIrisNotification.apply(this, arguments);
	}
	function sendWebPushNotification(_x16, _x17) {
	  return _sendWebPushNotification.apply(this, arguments);
	}
	function _sendWebPushNotification() {
	  _sendWebPushNotification = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee11(recipient, notification) {
	    var channel, myKey, shouldWebPush, _ret;
	    return _regeneratorRuntime().wrap(function _callee11$(_context12) {
	      while (1) {
	        switch (_context12.prev = _context12.next) {
	          case 0:
	            console.log('sending web push notification to', recipient, notification);
	            channel = privateState(recipient);
	            myKey = session.getKey();
	            shouldWebPush = recipient === myKey.pub || !(channel.activity && channel.activity.isActive);
	            if (!(shouldWebPush && channel.webPushSubscriptions)) {
	              _context12.next = 9;
	              break;
	            }
	            return _context12.delegateYield( /*#__PURE__*/_regeneratorRuntime().mark(function _callee10() {
	              var subscriptions, participants, _loop, i;
	              return _regeneratorRuntime().wrap(function _callee10$(_context11) {
	                while (1) {
	                  switch (_context11.prev = _context11.next) {
	                    case 0:
	                      subscriptions = [];
	                      participants = Object.keys(channel.webPushSubscriptions);
	                      _loop = /*#__PURE__*/_regeneratorRuntime().mark(function _loop(i) {
	                        var participant, secret, payload;
	                        return _regeneratorRuntime().wrap(function _loop$(_context10) {
	                          while (1) {
	                            switch (_context10.prev = _context10.next) {
	                              case 0:
	                                participant = participants[i];
	                                _context10.next = 3;
	                                return channel.getSecret(participant);
	                              case 3:
	                                secret = _context10.sent;
	                                _context10.next = 6;
	                                return gun$1.SEA.encrypt(notification.title, secret);
	                              case 6:
	                                _context10.t0 = _context10.sent;
	                                _context10.next = 9;
	                                return gun$1.SEA.encrypt(notification.body, secret);
	                              case 9:
	                                _context10.t1 = _context10.sent;
	                                _context10.t2 = {
	                                  pub: myKey.pub,
	                                  epub: myKey.epub
	                                };
	                                payload = {
	                                  title: _context10.t0,
	                                  body: _context10.t1,
	                                  from: _context10.t2
	                                };
	                                channel.webPushSubscriptions[participant].forEach(function (s) {
	                                  if (s && s.endpoint) {
	                                    subscriptions.push({
	                                      subscription: s,
	                                      payload: payload
	                                    });
	                                  }
	                                });
	                              case 13:
	                              case "end":
	                                return _context10.stop();
	                            }
	                          }
	                        }, _loop);
	                      });
	                      i = 0;
	                    case 4:
	                      if (!(i < participants.length)) {
	                        _context11.next = 9;
	                        break;
	                      }
	                      return _context11.delegateYield(_loop(i), "t0", 6);
	                    case 6:
	                      i++;
	                      _context11.next = 4;
	                      break;
	                    case 9:
	                      if (!(subscriptions.length === 0)) {
	                        _context11.next = 11;
	                        break;
	                      }
	                      return _context11.abrupt("return", {
	                        v: void 0
	                      });
	                    case 11:
	                      fetch(NOTIFICATION_SERVICE_URL, {
	                        method: 'POST',
	                        body: JSON.stringify({
	                          subscriptions: subscriptions
	                        }),
	                        headers: {
	                          'content-type': 'application/json'
	                        }
	                      })["catch"](function () {});
	                    case 12:
	                    case "end":
	                      return _context11.stop();
	                  }
	                }
	              }, _callee10);
	            })(), "t0", 6);
	          case 6:
	            _ret = _context12.t0;
	            if (!(typeof _ret === "object")) {
	              _context12.next = 9;
	              break;
	            }
	            return _context12.abrupt("return", _ret.v);
	          case 9:
	          case "end":
	            return _context12.stop();
	        }
	      }
	    }, _callee11);
	  }));
	  return _sendWebPushNotification.apply(this, arguments);
	}
	function init() {
	  loginTime = new Date();
	  unseenMsgsTotal = 0;
	}
	var notifications = {
	  init: init,
	  notifyMsg: notifyMsg,
	  getNotificationText: getNotificationText,
	  sendWebPushNotification: sendWebPushNotification,
	  changeUnseenNotificationCount: changeUnseenNotificationCount,
	  subscribeToIrisNotifications: subscribeToIrisNotifications,
	  sendIrisNotification: sendIrisNotification,
	  changeChatUnseenCount: changeChatUnseenMsgsCount,
	  webPushSubscriptions: webPushSubscriptions,
	  subscribeToWebPush: subscribeToWebPush,
	  getWebPushSubscriptions: getWebPushSubscriptions,
	  removeSubscription: removeSubscription
	};

	/**
	 * Fuse.js v6.6.2 - Lightweight fuzzy-search (http://fusejs.io)
	 *
	 * Copyright (c) 2022 Kiro Risk (http://kiro.me)
	 * All Rights Reserved. Apache Software License 2.0
	 *
	 * http://www.apache.org/licenses/LICENSE-2.0
	 */

	function isArray(value) {
	  return !Array.isArray
	    ? getTag(value) === '[object Array]'
	    : Array.isArray(value)
	}

	// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
	const INFINITY = 1 / 0;
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value
	  }
	  let result = value + '';
	  return result == '0' && 1 / value == -INFINITY ? '-0' : result
	}

	function toString(value) {
	  return value == null ? '' : baseToString(value)
	}

	function isString(value) {
	  return typeof value === 'string'
	}

	function isNumber(value) {
	  return typeof value === 'number'
	}

	// Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
	function isBoolean(value) {
	  return (
	    value === true ||
	    value === false ||
	    (isObjectLike(value) && getTag(value) == '[object Boolean]')
	  )
	}

	function isObject(value) {
	  return typeof value === 'object'
	}

	// Checks if `value` is object-like.
	function isObjectLike(value) {
	  return isObject(value) && value !== null
	}

	function isDefined(value) {
	  return value !== undefined && value !== null
	}

	function isBlank(value) {
	  return !value.trim().length
	}

	// Gets the `toStringTag` of `value`.
	// Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
	function getTag(value) {
	  return value == null
	    ? value === undefined
	      ? '[object Undefined]'
	      : '[object Null]'
	    : Object.prototype.toString.call(value)
	}

	const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';

	const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";

	const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) =>
	  `Invalid value for key ${key}`;

	const PATTERN_LENGTH_TOO_LARGE = (max) =>
	  `Pattern length exceeds max of ${max}.`;

	const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;

	const INVALID_KEY_WEIGHT_VALUE = (key) =>
	  `Property 'weight' in key '${key}' must be a positive integer`;

	const hasOwn = Object.prototype.hasOwnProperty;

	class KeyStore {
	  constructor(keys) {
	    this._keys = [];
	    this._keyMap = {};

	    let totalWeight = 0;

	    keys.forEach((key) => {
	      let obj = createKey(key);

	      totalWeight += obj.weight;

	      this._keys.push(obj);
	      this._keyMap[obj.id] = obj;

	      totalWeight += obj.weight;
	    });

	    // Normalize weights so that their sum is equal to 1
	    this._keys.forEach((key) => {
	      key.weight /= totalWeight;
	    });
	  }
	  get(keyId) {
	    return this._keyMap[keyId]
	  }
	  keys() {
	    return this._keys
	  }
	  toJSON() {
	    return JSON.stringify(this._keys)
	  }
	}

	function createKey(key) {
	  let path = null;
	  let id = null;
	  let src = null;
	  let weight = 1;
	  let getFn = null;

	  if (isString(key) || isArray(key)) {
	    src = key;
	    path = createKeyPath(key);
	    id = createKeyId(key);
	  } else {
	    if (!hasOwn.call(key, 'name')) {
	      throw new Error(MISSING_KEY_PROPERTY('name'))
	    }

	    const name = key.name;
	    src = name;

	    if (hasOwn.call(key, 'weight')) {
	      weight = key.weight;

	      if (weight <= 0) {
	        throw new Error(INVALID_KEY_WEIGHT_VALUE(name))
	      }
	    }

	    path = createKeyPath(name);
	    id = createKeyId(name);
	    getFn = key.getFn;
	  }

	  return { path, id, weight, src, getFn }
	}

	function createKeyPath(key) {
	  return isArray(key) ? key : key.split('.')
	}

	function createKeyId(key) {
	  return isArray(key) ? key.join('.') : key
	}

	function get(obj, path) {
	  let list = [];
	  let arr = false;

	  const deepGet = (obj, path, index) => {
	    if (!isDefined(obj)) {
	      return
	    }
	    if (!path[index]) {
	      // If there's no path left, we've arrived at the object we care about.
	      list.push(obj);
	    } else {
	      let key = path[index];

	      const value = obj[key];

	      if (!isDefined(value)) {
	        return
	      }

	      // If we're at the last value in the path, and if it's a string/number/bool,
	      // add it to the list
	      if (
	        index === path.length - 1 &&
	        (isString(value) || isNumber(value) || isBoolean(value))
	      ) {
	        list.push(toString(value));
	      } else if (isArray(value)) {
	        arr = true;
	        // Search each item in the array.
	        for (let i = 0, len = value.length; i < len; i += 1) {
	          deepGet(value[i], path, index + 1);
	        }
	      } else if (path.length) {
	        // An object. Recurse further.
	        deepGet(value, path, index + 1);
	      }
	    }
	  };

	  // Backwards compatibility (since path used to be a string)
	  deepGet(obj, isString(path) ? path.split('.') : path, 0);

	  return arr ? list : list[0]
	}

	const MatchOptions = {
	  // Whether the matches should be included in the result set. When `true`, each record in the result
	  // set will include the indices of the matched characters.
	  // These can consequently be used for highlighting purposes.
	  includeMatches: false,
	  // When `true`, the matching function will continue to the end of a search pattern even if
	  // a perfect match has already been located in the string.
	  findAllMatches: false,
	  // Minimum number of characters that must be matched before a result is considered a match
	  minMatchCharLength: 1
	};

	const BasicOptions = {
	  // When `true`, the algorithm continues searching to the end of the input even if a perfect
	  // match is found before the end of the same input.
	  isCaseSensitive: false,
	  // When true, the matching function will continue to the end of a search pattern even if
	  includeScore: false,
	  // List of properties that will be searched. This also supports nested properties.
	  keys: [],
	  // Whether to sort the result list, by score
	  shouldSort: true,
	  // Default sort function: sort by ascending score, ascending index
	  sortFn: (a, b) =>
	    a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
	};

	const FuzzyOptions = {
	  // Approximately where in the text is the pattern expected to be found?
	  location: 0,
	  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
	  // (of both letters and location), a threshold of '1.0' would match anything.
	  threshold: 0.6,
	  // Determines how close the match must be to the fuzzy location (specified above).
	  // An exact letter match which is 'distance' characters away from the fuzzy location
	  // would score as a complete mismatch. A distance of '0' requires the match be at
	  // the exact location specified, a threshold of '1000' would require a perfect match
	  // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
	  distance: 100
	};

	const AdvancedOptions = {
	  // When `true`, it enables the use of unix-like search commands
	  useExtendedSearch: false,
	  // The get function to use when fetching an object's properties.
	  // The default will search nested paths *ie foo.bar.baz*
	  getFn: get,
	  // When `true`, search will ignore `location` and `distance`, so it won't matter
	  // where in the string the pattern appears.
	  // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
	  ignoreLocation: false,
	  // When `true`, the calculation for the relevance score (used for sorting) will
	  // ignore the field-length norm.
	  // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
	  ignoreFieldNorm: false,
	  // The weight to determine how much field length norm effects scoring.
	  fieldNormWeight: 1
	};

	var Config = {
	  ...BasicOptions,
	  ...MatchOptions,
	  ...FuzzyOptions,
	  ...AdvancedOptions
	};

	const SPACE = /[^ ]+/g;

	// Field-length norm: the shorter the field, the higher the weight.
	// Set to 3 decimals to reduce index size.
	function norm(weight = 1, mantissa = 3) {
	  const cache = new Map();
	  const m = Math.pow(10, mantissa);

	  return {
	    get(value) {
	      const numTokens = value.match(SPACE).length;

	      if (cache.has(numTokens)) {
	        return cache.get(numTokens)
	      }

	      // Default function is 1/sqrt(x), weight makes that variable
	      const norm = 1 / Math.pow(numTokens, 0.5 * weight);

	      // In place of `toFixed(mantissa)`, for faster computation
	      const n = parseFloat(Math.round(norm * m) / m);

	      cache.set(numTokens, n);

	      return n
	    },
	    clear() {
	      cache.clear();
	    }
	  }
	}

	class FuseIndex {
	  constructor({
	    getFn = Config.getFn,
	    fieldNormWeight = Config.fieldNormWeight
	  } = {}) {
	    this.norm = norm(fieldNormWeight, 3);
	    this.getFn = getFn;
	    this.isCreated = false;

	    this.setIndexRecords();
	  }
	  setSources(docs = []) {
	    this.docs = docs;
	  }
	  setIndexRecords(records = []) {
	    this.records = records;
	  }
	  setKeys(keys = []) {
	    this.keys = keys;
	    this._keysMap = {};
	    keys.forEach((key, idx) => {
	      this._keysMap[key.id] = idx;
	    });
	  }
	  create() {
	    if (this.isCreated || !this.docs.length) {
	      return
	    }

	    this.isCreated = true;

	    // List is Array<String>
	    if (isString(this.docs[0])) {
	      this.docs.forEach((doc, docIndex) => {
	        this._addString(doc, docIndex);
	      });
	    } else {
	      // List is Array<Object>
	      this.docs.forEach((doc, docIndex) => {
	        this._addObject(doc, docIndex);
	      });
	    }

	    this.norm.clear();
	  }
	  // Adds a doc to the end of the index
	  add(doc) {
	    const idx = this.size();

	    if (isString(doc)) {
	      this._addString(doc, idx);
	    } else {
	      this._addObject(doc, idx);
	    }
	  }
	  // Removes the doc at the specified index of the index
	  removeAt(idx) {
	    this.records.splice(idx, 1);

	    // Change ref index of every subsquent doc
	    for (let i = idx, len = this.size(); i < len; i += 1) {
	      this.records[i].i -= 1;
	    }
	  }
	  getValueForItemAtKeyId(item, keyId) {
	    return item[this._keysMap[keyId]]
	  }
	  size() {
	    return this.records.length
	  }
	  _addString(doc, docIndex) {
	    if (!isDefined(doc) || isBlank(doc)) {
	      return
	    }

	    let record = {
	      v: doc,
	      i: docIndex,
	      n: this.norm.get(doc)
	    };

	    this.records.push(record);
	  }
	  _addObject(doc, docIndex) {
	    let record = { i: docIndex, $: {} };

	    // Iterate over every key (i.e, path), and fetch the value at that key
	    this.keys.forEach((key, keyIndex) => {
	      let value = key.getFn ? key.getFn(doc) : this.getFn(doc, key.path);

	      if (!isDefined(value)) {
	        return
	      }

	      if (isArray(value)) {
	        let subRecords = [];
	        const stack = [{ nestedArrIndex: -1, value }];

	        while (stack.length) {
	          const { nestedArrIndex, value } = stack.pop();

	          if (!isDefined(value)) {
	            continue
	          }

	          if (isString(value) && !isBlank(value)) {
	            let subRecord = {
	              v: value,
	              i: nestedArrIndex,
	              n: this.norm.get(value)
	            };

	            subRecords.push(subRecord);
	          } else if (isArray(value)) {
	            value.forEach((item, k) => {
	              stack.push({
	                nestedArrIndex: k,
	                value: item
	              });
	            });
	          }
	        }
	        record.$[keyIndex] = subRecords;
	      } else if (isString(value) && !isBlank(value)) {
	        let subRecord = {
	          v: value,
	          n: this.norm.get(value)
	        };

	        record.$[keyIndex] = subRecord;
	      }
	    });

	    this.records.push(record);
	  }
	  toJSON() {
	    return {
	      keys: this.keys,
	      records: this.records
	    }
	  }
	}

	function createIndex(
	  keys,
	  docs,
	  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
	) {
	  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
	  myIndex.setKeys(keys.map(createKey));
	  myIndex.setSources(docs);
	  myIndex.create();
	  return myIndex
	}

	function parseIndex(
	  data,
	  { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
	) {
	  const { keys, records } = data;
	  const myIndex = new FuseIndex({ getFn, fieldNormWeight });
	  myIndex.setKeys(keys);
	  myIndex.setIndexRecords(records);
	  return myIndex
	}

	function computeScore$1(
	  pattern,
	  {
	    errors = 0,
	    currentLocation = 0,
	    expectedLocation = 0,
	    distance = Config.distance,
	    ignoreLocation = Config.ignoreLocation
	  } = {}
	) {
	  const accuracy = errors / pattern.length;

	  if (ignoreLocation) {
	    return accuracy
	  }

	  const proximity = Math.abs(expectedLocation - currentLocation);

	  if (!distance) {
	    // Dodge divide by zero error.
	    return proximity ? 1.0 : accuracy
	  }

	  return accuracy + proximity / distance
	}

	function convertMaskToIndices(
	  matchmask = [],
	  minMatchCharLength = Config.minMatchCharLength
	) {
	  let indices = [];
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (let len = matchmask.length; i < len; i += 1) {
	    let match = matchmask[i];
	    if (match && start === -1) {
	      start = i;
	    } else if (!match && start !== -1) {
	      end = i - 1;
	      if (end - start + 1 >= minMatchCharLength) {
	        indices.push([start, end]);
	      }
	      start = -1;
	    }
	  }

	  // (i-1 - start) + 1 => i - start
	  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
	    indices.push([start, i - 1]);
	  }

	  return indices
	}

	// Machine word size
	const MAX_BITS = 32;

	function search(
	  text,
	  pattern,
	  patternAlphabet,
	  {
	    location = Config.location,
	    distance = Config.distance,
	    threshold = Config.threshold,
	    findAllMatches = Config.findAllMatches,
	    minMatchCharLength = Config.minMatchCharLength,
	    includeMatches = Config.includeMatches,
	    ignoreLocation = Config.ignoreLocation
	  } = {}
	) {
	  if (pattern.length > MAX_BITS) {
	    throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
	  }

	  const patternLen = pattern.length;
	  // Set starting location at beginning text and initialize the alphabet.
	  const textLen = text.length;
	  // Handle the case when location > text.length
	  const expectedLocation = Math.max(0, Math.min(location, textLen));
	  // Highest score beyond which we give up.
	  let currentThreshold = threshold;
	  // Is there a nearby exact match? (speedup)
	  let bestLocation = expectedLocation;

	  // Performance: only computer matches when the minMatchCharLength > 1
	  // OR if `includeMatches` is true.
	  const computeMatches = minMatchCharLength > 1 || includeMatches;
	  // A mask of the matches, used for building the indices
	  const matchMask = computeMatches ? Array(textLen) : [];

	  let index;

	  // Get all exact matches, here for speed up
	  while ((index = text.indexOf(pattern, bestLocation)) > -1) {
	    let score = computeScore$1(pattern, {
	      currentLocation: index,
	      expectedLocation,
	      distance,
	      ignoreLocation
	    });

	    currentThreshold = Math.min(score, currentThreshold);
	    bestLocation = index + patternLen;

	    if (computeMatches) {
	      let i = 0;
	      while (i < patternLen) {
	        matchMask[index + i] = 1;
	        i += 1;
	      }
	    }
	  }

	  // Reset the best location
	  bestLocation = -1;

	  let lastBitArr = [];
	  let finalScore = 1;
	  let binMax = patternLen + textLen;

	  const mask = 1 << (patternLen - 1);

	  for (let i = 0; i < patternLen; i += 1) {
	    // Scan for the best match; each iteration allows for one more error.
	    // Run a binary search to determine how far from the match location we can stray
	    // at this error level.
	    let binMin = 0;
	    let binMid = binMax;

	    while (binMin < binMid) {
	      const score = computeScore$1(pattern, {
	        errors: i,
	        currentLocation: expectedLocation + binMid,
	        expectedLocation,
	        distance,
	        ignoreLocation
	      });

	      if (score <= currentThreshold) {
	        binMin = binMid;
	      } else {
	        binMax = binMid;
	      }

	      binMid = Math.floor((binMax - binMin) / 2 + binMin);
	    }

	    // Use the result from this iteration as the maximum for the next.
	    binMax = binMid;

	    let start = Math.max(1, expectedLocation - binMid + 1);
	    let finish = findAllMatches
	      ? textLen
	      : Math.min(expectedLocation + binMid, textLen) + patternLen;

	    // Initialize the bit array
	    let bitArr = Array(finish + 2);

	    bitArr[finish + 1] = (1 << i) - 1;

	    for (let j = finish; j >= start; j -= 1) {
	      let currentLocation = j - 1;
	      let charMatch = patternAlphabet[text.charAt(currentLocation)];

	      if (computeMatches) {
	        // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
	        matchMask[currentLocation] = +!!charMatch;
	      }

	      // First pass: exact match
	      bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

	      // Subsequent passes: fuzzy match
	      if (i) {
	        bitArr[j] |=
	          ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
	      }

	      if (bitArr[j] & mask) {
	        finalScore = computeScore$1(pattern, {
	          errors: i,
	          currentLocation,
	          expectedLocation,
	          distance,
	          ignoreLocation
	        });

	        // This match will almost certainly be better than any existing match.
	        // But check anyway.
	        if (finalScore <= currentThreshold) {
	          // Indeed it is
	          currentThreshold = finalScore;
	          bestLocation = currentLocation;

	          // Already passed `loc`, downhill from here on in.
	          if (bestLocation <= expectedLocation) {
	            break
	          }

	          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
	          start = Math.max(1, 2 * expectedLocation - bestLocation);
	        }
	      }
	    }

	    // No hope for a (better) match at greater error levels.
	    const score = computeScore$1(pattern, {
	      errors: i + 1,
	      currentLocation: expectedLocation,
	      expectedLocation,
	      distance,
	      ignoreLocation
	    });

	    if (score > currentThreshold) {
	      break
	    }

	    lastBitArr = bitArr;
	  }

	  const result = {
	    isMatch: bestLocation >= 0,
	    // Count exact matches (those with a score of 0) to be "almost" exact
	    score: Math.max(0.001, finalScore)
	  };

	  if (computeMatches) {
	    const indices = convertMaskToIndices(matchMask, minMatchCharLength);
	    if (!indices.length) {
	      result.isMatch = false;
	    } else if (includeMatches) {
	      result.indices = indices;
	    }
	  }

	  return result
	}

	function createPatternAlphabet(pattern) {
	  let mask = {};

	  for (let i = 0, len = pattern.length; i < len; i += 1) {
	    const char = pattern.charAt(i);
	    mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
	  }

	  return mask
	}

	class BitapSearch {
	  constructor(
	    pattern,
	    {
	      location = Config.location,
	      threshold = Config.threshold,
	      distance = Config.distance,
	      includeMatches = Config.includeMatches,
	      findAllMatches = Config.findAllMatches,
	      minMatchCharLength = Config.minMatchCharLength,
	      isCaseSensitive = Config.isCaseSensitive,
	      ignoreLocation = Config.ignoreLocation
	    } = {}
	  ) {
	    this.options = {
	      location,
	      threshold,
	      distance,
	      includeMatches,
	      findAllMatches,
	      minMatchCharLength,
	      isCaseSensitive,
	      ignoreLocation
	    };

	    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

	    this.chunks = [];

	    if (!this.pattern.length) {
	      return
	    }

	    const addChunk = (pattern, startIndex) => {
	      this.chunks.push({
	        pattern,
	        alphabet: createPatternAlphabet(pattern),
	        startIndex
	      });
	    };

	    const len = this.pattern.length;

	    if (len > MAX_BITS) {
	      let i = 0;
	      const remainder = len % MAX_BITS;
	      const end = len - remainder;

	      while (i < end) {
	        addChunk(this.pattern.substr(i, MAX_BITS), i);
	        i += MAX_BITS;
	      }

	      if (remainder) {
	        const startIndex = len - MAX_BITS;
	        addChunk(this.pattern.substr(startIndex), startIndex);
	      }
	    } else {
	      addChunk(this.pattern, 0);
	    }
	  }

	  searchIn(text) {
	    const { isCaseSensitive, includeMatches } = this.options;

	    if (!isCaseSensitive) {
	      text = text.toLowerCase();
	    }

	    // Exact match
	    if (this.pattern === text) {
	      let result = {
	        isMatch: true,
	        score: 0
	      };

	      if (includeMatches) {
	        result.indices = [[0, text.length - 1]];
	      }

	      return result
	    }

	    // Otherwise, use Bitap algorithm
	    const {
	      location,
	      distance,
	      threshold,
	      findAllMatches,
	      minMatchCharLength,
	      ignoreLocation
	    } = this.options;

	    let allIndices = [];
	    let totalScore = 0;
	    let hasMatches = false;

	    this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
	      const { isMatch, score, indices } = search(text, pattern, alphabet, {
	        location: location + startIndex,
	        distance,
	        threshold,
	        findAllMatches,
	        minMatchCharLength,
	        includeMatches,
	        ignoreLocation
	      });

	      if (isMatch) {
	        hasMatches = true;
	      }

	      totalScore += score;

	      if (isMatch && indices) {
	        allIndices = [...allIndices, ...indices];
	      }
	    });

	    let result = {
	      isMatch: hasMatches,
	      score: hasMatches ? totalScore / this.chunks.length : 1
	    };

	    if (hasMatches && includeMatches) {
	      result.indices = allIndices;
	    }

	    return result
	  }
	}

	class BaseMatch {
	  constructor(pattern) {
	    this.pattern = pattern;
	  }
	  static isMultiMatch(pattern) {
	    return getMatch(pattern, this.multiRegex)
	  }
	  static isSingleMatch(pattern) {
	    return getMatch(pattern, this.singleRegex)
	  }
	  search(/*text*/) {}
	}

	function getMatch(pattern, exp) {
	  const matches = pattern.match(exp);
	  return matches ? matches[1] : null
	}

	// Token: 'file

	class ExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'exact'
	  }
	  static get multiRegex() {
	    return /^="(.*)"$/
	  }
	  static get singleRegex() {
	    return /^=(.*)$/
	  }
	  search(text) {
	    const isMatch = text === this.pattern;

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [0, this.pattern.length - 1]
	    }
	  }
	}

	// Token: !fire

	class InverseExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'inverse-exact'
	  }
	  static get multiRegex() {
	    return /^!"(.*)"$/
	  }
	  static get singleRegex() {
	    return /^!(.*)$/
	  }
	  search(text) {
	    const index = text.indexOf(this.pattern);
	    const isMatch = index === -1;

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [0, text.length - 1]
	    }
	  }
	}

	// Token: ^file

	class PrefixExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'prefix-exact'
	  }
	  static get multiRegex() {
	    return /^\^"(.*)"$/
	  }
	  static get singleRegex() {
	    return /^\^(.*)$/
	  }
	  search(text) {
	    const isMatch = text.startsWith(this.pattern);

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [0, this.pattern.length - 1]
	    }
	  }
	}

	// Token: !^fire

	class InversePrefixExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'inverse-prefix-exact'
	  }
	  static get multiRegex() {
	    return /^!\^"(.*)"$/
	  }
	  static get singleRegex() {
	    return /^!\^(.*)$/
	  }
	  search(text) {
	    const isMatch = !text.startsWith(this.pattern);

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [0, text.length - 1]
	    }
	  }
	}

	// Token: .file$

	class SuffixExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'suffix-exact'
	  }
	  static get multiRegex() {
	    return /^"(.*)"\$$/
	  }
	  static get singleRegex() {
	    return /^(.*)\$$/
	  }
	  search(text) {
	    const isMatch = text.endsWith(this.pattern);

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [text.length - this.pattern.length, text.length - 1]
	    }
	  }
	}

	// Token: !.file$

	class InverseSuffixExactMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'inverse-suffix-exact'
	  }
	  static get multiRegex() {
	    return /^!"(.*)"\$$/
	  }
	  static get singleRegex() {
	    return /^!(.*)\$$/
	  }
	  search(text) {
	    const isMatch = !text.endsWith(this.pattern);
	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices: [0, text.length - 1]
	    }
	  }
	}

	class FuzzyMatch extends BaseMatch {
	  constructor(
	    pattern,
	    {
	      location = Config.location,
	      threshold = Config.threshold,
	      distance = Config.distance,
	      includeMatches = Config.includeMatches,
	      findAllMatches = Config.findAllMatches,
	      minMatchCharLength = Config.minMatchCharLength,
	      isCaseSensitive = Config.isCaseSensitive,
	      ignoreLocation = Config.ignoreLocation
	    } = {}
	  ) {
	    super(pattern);
	    this._bitapSearch = new BitapSearch(pattern, {
	      location,
	      threshold,
	      distance,
	      includeMatches,
	      findAllMatches,
	      minMatchCharLength,
	      isCaseSensitive,
	      ignoreLocation
	    });
	  }
	  static get type() {
	    return 'fuzzy'
	  }
	  static get multiRegex() {
	    return /^"(.*)"$/
	  }
	  static get singleRegex() {
	    return /^(.*)$/
	  }
	  search(text) {
	    return this._bitapSearch.searchIn(text)
	  }
	}

	// Token: 'file

	class IncludeMatch extends BaseMatch {
	  constructor(pattern) {
	    super(pattern);
	  }
	  static get type() {
	    return 'include'
	  }
	  static get multiRegex() {
	    return /^'"(.*)"$/
	  }
	  static get singleRegex() {
	    return /^'(.*)$/
	  }
	  search(text) {
	    let location = 0;
	    let index;

	    const indices = [];
	    const patternLen = this.pattern.length;

	    // Get all exact matches
	    while ((index = text.indexOf(this.pattern, location)) > -1) {
	      location = index + patternLen;
	      indices.push([index, location - 1]);
	    }

	    const isMatch = !!indices.length;

	    return {
	      isMatch,
	      score: isMatch ? 0 : 1,
	      indices
	    }
	  }
	}

	// ❗Order is important. DO NOT CHANGE.
	const searchers = [
	  ExactMatch,
	  IncludeMatch,
	  PrefixExactMatch,
	  InversePrefixExactMatch,
	  InverseSuffixExactMatch,
	  SuffixExactMatch,
	  InverseExactMatch,
	  FuzzyMatch
	];

	const searchersLen = searchers.length;

	// Regex to split by spaces, but keep anything in quotes together
	const SPACE_RE = / +(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/;
	const OR_TOKEN = '|';

	// Return a 2D array representation of the query, for simpler parsing.
	// Example:
	// "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
	function parseQuery(pattern, options = {}) {
	  return pattern.split(OR_TOKEN).map((item) => {
	    let query = item
	      .trim()
	      .split(SPACE_RE)
	      .filter((item) => item && !!item.trim());

	    let results = [];
	    for (let i = 0, len = query.length; i < len; i += 1) {
	      const queryItem = query[i];

	      // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
	      let found = false;
	      let idx = -1;
	      while (!found && ++idx < searchersLen) {
	        const searcher = searchers[idx];
	        let token = searcher.isMultiMatch(queryItem);
	        if (token) {
	          results.push(new searcher(token, options));
	          found = true;
	        }
	      }

	      if (found) {
	        continue
	      }

	      // 2. Handle single query matches (i.e, once that are *not* quoted)
	      idx = -1;
	      while (++idx < searchersLen) {
	        const searcher = searchers[idx];
	        let token = searcher.isSingleMatch(queryItem);
	        if (token) {
	          results.push(new searcher(token, options));
	          break
	        }
	      }
	    }

	    return results
	  })
	}

	// These extended matchers can return an array of matches, as opposed
	// to a singl match
	const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

	/**
	 * Command-like searching
	 * ======================
	 *
	 * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
	 * search in a given text.
	 *
	 * Search syntax:
	 *
	 * | Token       | Match type                 | Description                            |
	 * | ----------- | -------------------------- | -------------------------------------- |
	 * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
	 * | `=scheme`   | exact-match                | Items that are `scheme`                |
	 * | `'python`   | include-match              | Items that include `python`            |
	 * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
	 * | `^java`     | prefix-exact-match         | Items that start with `java`           |
	 * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
	 * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
	 * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
	 *
	 * A single pipe character acts as an OR operator. For example, the following
	 * query matches entries that start with `core` and end with either`go`, `rb`,
	 * or`py`.
	 *
	 * ```
	 * ^core go$ | rb$ | py$
	 * ```
	 */
	class ExtendedSearch {
	  constructor(
	    pattern,
	    {
	      isCaseSensitive = Config.isCaseSensitive,
	      includeMatches = Config.includeMatches,
	      minMatchCharLength = Config.minMatchCharLength,
	      ignoreLocation = Config.ignoreLocation,
	      findAllMatches = Config.findAllMatches,
	      location = Config.location,
	      threshold = Config.threshold,
	      distance = Config.distance
	    } = {}
	  ) {
	    this.query = null;
	    this.options = {
	      isCaseSensitive,
	      includeMatches,
	      minMatchCharLength,
	      findAllMatches,
	      ignoreLocation,
	      location,
	      threshold,
	      distance
	    };

	    this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
	    this.query = parseQuery(this.pattern, this.options);
	  }

	  static condition(_, options) {
	    return options.useExtendedSearch
	  }

	  searchIn(text) {
	    const query = this.query;

	    if (!query) {
	      return {
	        isMatch: false,
	        score: 1
	      }
	    }

	    const { includeMatches, isCaseSensitive } = this.options;

	    text = isCaseSensitive ? text : text.toLowerCase();

	    let numMatches = 0;
	    let allIndices = [];
	    let totalScore = 0;

	    // ORs
	    for (let i = 0, qLen = query.length; i < qLen; i += 1) {
	      const searchers = query[i];

	      // Reset indices
	      allIndices.length = 0;
	      numMatches = 0;

	      // ANDs
	      for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
	        const searcher = searchers[j];
	        const { isMatch, indices, score } = searcher.search(text);

	        if (isMatch) {
	          numMatches += 1;
	          totalScore += score;
	          if (includeMatches) {
	            const type = searcher.constructor.type;
	            if (MultiMatchSet.has(type)) {
	              allIndices = [...allIndices, ...indices];
	            } else {
	              allIndices.push(indices);
	            }
	          }
	        } else {
	          totalScore = 0;
	          numMatches = 0;
	          allIndices.length = 0;
	          break
	        }
	      }

	      // OR condition, so if TRUE, return
	      if (numMatches) {
	        let result = {
	          isMatch: true,
	          score: totalScore / numMatches
	        };

	        if (includeMatches) {
	          result.indices = allIndices;
	        }

	        return result
	      }
	    }

	    // Nothing was matched
	    return {
	      isMatch: false,
	      score: 1
	    }
	  }
	}

	const registeredSearchers = [];

	function register(...args) {
	  registeredSearchers.push(...args);
	}

	function createSearcher(pattern, options) {
	  for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
	    let searcherClass = registeredSearchers[i];
	    if (searcherClass.condition(pattern, options)) {
	      return new searcherClass(pattern, options)
	    }
	  }

	  return new BitapSearch(pattern, options)
	}

	const LogicalOperator = {
	  AND: '$and',
	  OR: '$or'
	};

	const KeyType = {
	  PATH: '$path',
	  PATTERN: '$val'
	};

	const isExpression = (query) =>
	  !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);

	const isPath = (query) => !!query[KeyType.PATH];

	const isLeaf = (query) =>
	  !isArray(query) && isObject(query) && !isExpression(query);

	const convertToExplicit = (query) => ({
	  [LogicalOperator.AND]: Object.keys(query).map((key) => ({
	    [key]: query[key]
	  }))
	});

	// When `auto` is `true`, the parse function will infer and initialize and add
	// the appropriate `Searcher` instance
	function parse$3(query, options, { auto = true } = {}) {
	  const next = (query) => {
	    let keys = Object.keys(query);

	    const isQueryPath = isPath(query);

	    if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
	      return next(convertToExplicit(query))
	    }

	    if (isLeaf(query)) {
	      const key = isQueryPath ? query[KeyType.PATH] : keys[0];

	      const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

	      if (!isString(pattern)) {
	        throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
	      }

	      const obj = {
	        keyId: createKeyId(key),
	        pattern
	      };

	      if (auto) {
	        obj.searcher = createSearcher(pattern, options);
	      }

	      return obj
	    }

	    let node = {
	      children: [],
	      operator: keys[0]
	    };

	    keys.forEach((key) => {
	      const value = query[key];

	      if (isArray(value)) {
	        value.forEach((item) => {
	          node.children.push(next(item));
	        });
	      }
	    });

	    return node
	  };

	  if (!isExpression(query)) {
	    query = convertToExplicit(query);
	  }

	  return next(query)
	}

	// Practical scoring function
	function computeScore(
	  results,
	  { ignoreFieldNorm = Config.ignoreFieldNorm }
	) {
	  results.forEach((result) => {
	    let totalScore = 1;

	    result.matches.forEach(({ key, norm, score }) => {
	      const weight = key ? key.weight : null;

	      totalScore *= Math.pow(
	        score === 0 && weight ? Number.EPSILON : score,
	        (weight || 1) * (ignoreFieldNorm ? 1 : norm)
	      );
	    });

	    result.score = totalScore;
	  });
	}

	function transformMatches(result, data) {
	  const matches = result.matches;
	  data.matches = [];

	  if (!isDefined(matches)) {
	    return
	  }

	  matches.forEach((match) => {
	    if (!isDefined(match.indices) || !match.indices.length) {
	      return
	    }

	    const { indices, value } = match;

	    let obj = {
	      indices,
	      value
	    };

	    if (match.key) {
	      obj.key = match.key.src;
	    }

	    if (match.idx > -1) {
	      obj.refIndex = match.idx;
	    }

	    data.matches.push(obj);
	  });
	}

	function transformScore(result, data) {
	  data.score = result.score;
	}

	function format$3(
	  results,
	  docs,
	  {
	    includeMatches = Config.includeMatches,
	    includeScore = Config.includeScore
	  } = {}
	) {
	  const transformers = [];

	  if (includeMatches) transformers.push(transformMatches);
	  if (includeScore) transformers.push(transformScore);

	  return results.map((result) => {
	    const { idx } = result;

	    const data = {
	      item: docs[idx],
	      refIndex: idx
	    };

	    if (transformers.length) {
	      transformers.forEach((transformer) => {
	        transformer(result, data);
	      });
	    }

	    return data
	  })
	}

	class Fuse {
	  constructor(docs, options = {}, index) {
	    this.options = { ...Config, ...options };

	    if (
	      this.options.useExtendedSearch &&
	      !true
	    ) {
	      throw new Error(EXTENDED_SEARCH_UNAVAILABLE)
	    }

	    this._keyStore = new KeyStore(this.options.keys);

	    this.setCollection(docs, index);
	  }

	  setCollection(docs, index) {
	    this._docs = docs;

	    if (index && !(index instanceof FuseIndex)) {
	      throw new Error(INCORRECT_INDEX_TYPE)
	    }

	    this._myIndex =
	      index ||
	      createIndex(this.options.keys, this._docs, {
	        getFn: this.options.getFn,
	        fieldNormWeight: this.options.fieldNormWeight
	      });
	  }

	  add(doc) {
	    if (!isDefined(doc)) {
	      return
	    }

	    this._docs.push(doc);
	    this._myIndex.add(doc);
	  }

	  remove(predicate = (/* doc, idx */) => false) {
	    const results = [];

	    for (let i = 0, len = this._docs.length; i < len; i += 1) {
	      const doc = this._docs[i];
	      if (predicate(doc, i)) {
	        this.removeAt(i);
	        i -= 1;
	        len -= 1;

	        results.push(doc);
	      }
	    }

	    return results
	  }

	  removeAt(idx) {
	    this._docs.splice(idx, 1);
	    this._myIndex.removeAt(idx);
	  }

	  getIndex() {
	    return this._myIndex
	  }

	  search(query, { limit = -1 } = {}) {
	    const {
	      includeMatches,
	      includeScore,
	      shouldSort,
	      sortFn,
	      ignoreFieldNorm
	    } = this.options;

	    let results = isString(query)
	      ? isString(this._docs[0])
	        ? this._searchStringList(query)
	        : this._searchObjectList(query)
	      : this._searchLogical(query);

	    computeScore(results, { ignoreFieldNorm });

	    if (shouldSort) {
	      results.sort(sortFn);
	    }

	    if (isNumber(limit) && limit > -1) {
	      results = results.slice(0, limit);
	    }

	    return format$3(results, this._docs, {
	      includeMatches,
	      includeScore
	    })
	  }

	  _searchStringList(query) {
	    const searcher = createSearcher(query, this.options);
	    const { records } = this._myIndex;
	    const results = [];

	    // Iterate over every string in the index
	    records.forEach(({ v: text, i: idx, n: norm }) => {
	      if (!isDefined(text)) {
	        return
	      }

	      const { isMatch, score, indices } = searcher.searchIn(text);

	      if (isMatch) {
	        results.push({
	          item: text,
	          idx,
	          matches: [{ score, value: text, norm, indices }]
	        });
	      }
	    });

	    return results
	  }

	  _searchLogical(query) {

	    const expression = parse$3(query, this.options);

	    const evaluate = (node, item, idx) => {
	      if (!node.children) {
	        const { keyId, searcher } = node;

	        const matches = this._findMatches({
	          key: this._keyStore.get(keyId),
	          value: this._myIndex.getValueForItemAtKeyId(item, keyId),
	          searcher
	        });

	        if (matches && matches.length) {
	          return [
	            {
	              idx,
	              item,
	              matches
	            }
	          ]
	        }

	        return []
	      }

	      const res = [];
	      for (let i = 0, len = node.children.length; i < len; i += 1) {
	        const child = node.children[i];
	        const result = evaluate(child, item, idx);
	        if (result.length) {
	          res.push(...result);
	        } else if (node.operator === LogicalOperator.AND) {
	          return []
	        }
	      }
	      return res
	    };

	    const records = this._myIndex.records;
	    const resultMap = {};
	    const results = [];

	    records.forEach(({ $: item, i: idx }) => {
	      if (isDefined(item)) {
	        let expResults = evaluate(expression, item, idx);

	        if (expResults.length) {
	          // Dedupe when adding
	          if (!resultMap[idx]) {
	            resultMap[idx] = { idx, item, matches: [] };
	            results.push(resultMap[idx]);
	          }
	          expResults.forEach(({ matches }) => {
	            resultMap[idx].matches.push(...matches);
	          });
	        }
	      }
	    });

	    return results
	  }

	  _searchObjectList(query) {
	    const searcher = createSearcher(query, this.options);
	    const { keys, records } = this._myIndex;
	    const results = [];

	    // List is Array<Object>
	    records.forEach(({ $: item, i: idx }) => {
	      if (!isDefined(item)) {
	        return
	      }

	      let matches = [];

	      // Iterate over every key (i.e, path), and fetch the value at that key
	      keys.forEach((key, keyIndex) => {
	        matches.push(
	          ...this._findMatches({
	            key,
	            value: item[keyIndex],
	            searcher
	          })
	        );
	      });

	      if (matches.length) {
	        results.push({
	          idx,
	          item,
	          matches
	        });
	      }
	    });

	    return results
	  }
	  _findMatches({ key, value, searcher }) {
	    if (!isDefined(value)) {
	      return []
	    }

	    let matches = [];

	    if (isArray(value)) {
	      value.forEach(({ v: text, i: idx, n: norm }) => {
	        if (!isDefined(text)) {
	          return
	        }

	        const { isMatch, score, indices } = searcher.searchIn(text);

	        if (isMatch) {
	          matches.push({
	            score,
	            key,
	            value: text,
	            idx,
	            norm,
	            indices
	          });
	        }
	      });
	    } else {
	      const { v: text, n: norm } = value;

	      const { isMatch, score, indices } = searcher.searchIn(text);

	      if (isMatch) {
	        matches.push({ score, key, value: text, norm, indices });
	      }
	    }

	    return matches
	  }
	}

	Fuse.version = '6.6.2';
	Fuse.createIndex = createIndex;
	Fuse.parseIndex = parseIndex;
	Fuse.config = Config;

	{
	  Fuse.parseQuery = parse$3;
	}

	{
	  register(ExtendedSearch);
	}

	var electron = util.isElectron ? /*#__PURE__*/new gun$1({
	  peers: ['http://localhost:8768/gun'],
	  file: 'State.electron',
	  multicast: false,
	  localStorage: false
	}).get('state') : null;

	var _nodeResolve_empty = {};

	var nodeCrypto = {
		__proto__: null,
		'default': _nodeResolve_empty
	};

	/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
	const _0n = BigInt(0);
	const _1n = BigInt(1);
	const _2n = BigInt(2);
	const _3n = BigInt(3);
	const _8n = BigInt(8);
	const CURVE = Object.freeze({
	    a: _0n,
	    b: BigInt(7),
	    P: BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f'),
	    n: BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'),
	    h: _1n,
	    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
	    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
	    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
	});
	function weistrass(x) {
	    const { a, b } = CURVE;
	    const x2 = mod(x * x);
	    const x3 = mod(x2 * x);
	    return mod(x3 + a * x + b);
	}
	const USE_ENDOMORPHISM = CURVE.a === _0n;
	class ShaError extends Error {
	    constructor(message) {
	        super(message);
	    }
	}
	class JacobianPoint {
	    constructor(x, y, z) {
	        this.x = x;
	        this.y = y;
	        this.z = z;
	    }
	    static fromAffine(p) {
	        if (!(p instanceof Point)) {
	            throw new TypeError('JacobianPoint#fromAffine: expected Point');
	        }
	        return new JacobianPoint(p.x, p.y, _1n);
	    }
	    static toAffineBatch(points) {
	        const toInv = invertBatch(points.map((p) => p.z));
	        return points.map((p, i) => p.toAffine(toInv[i]));
	    }
	    static normalizeZ(points) {
	        return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
	    }
	    equals(other) {
	        if (!(other instanceof JacobianPoint))
	            throw new TypeError('JacobianPoint expected');
	        const { x: X1, y: Y1, z: Z1 } = this;
	        const { x: X2, y: Y2, z: Z2 } = other;
	        const Z1Z1 = mod(Z1 * Z1);
	        const Z2Z2 = mod(Z2 * Z2);
	        const U1 = mod(X1 * Z2Z2);
	        const U2 = mod(X2 * Z1Z1);
	        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
	        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
	        return U1 === U2 && S1 === S2;
	    }
	    negate() {
	        return new JacobianPoint(this.x, mod(-this.y), this.z);
	    }
	    double() {
	        const { x: X1, y: Y1, z: Z1 } = this;
	        const A = mod(X1 * X1);
	        const B = mod(Y1 * Y1);
	        const C = mod(B * B);
	        const x1b = X1 + B;
	        const D = mod(_2n * (mod(x1b * x1b) - A - C));
	        const E = mod(_3n * A);
	        const F = mod(E * E);
	        const X3 = mod(F - _2n * D);
	        const Y3 = mod(E * (D - X3) - _8n * C);
	        const Z3 = mod(_2n * Y1 * Z1);
	        return new JacobianPoint(X3, Y3, Z3);
	    }
	    add(other) {
	        if (!(other instanceof JacobianPoint))
	            throw new TypeError('JacobianPoint expected');
	        const { x: X1, y: Y1, z: Z1 } = this;
	        const { x: X2, y: Y2, z: Z2 } = other;
	        if (X2 === _0n || Y2 === _0n)
	            return this;
	        if (X1 === _0n || Y1 === _0n)
	            return other;
	        const Z1Z1 = mod(Z1 * Z1);
	        const Z2Z2 = mod(Z2 * Z2);
	        const U1 = mod(X1 * Z2Z2);
	        const U2 = mod(X2 * Z1Z1);
	        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
	        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
	        const H = mod(U2 - U1);
	        const r = mod(S2 - S1);
	        if (H === _0n) {
	            if (r === _0n) {
	                return this.double();
	            }
	            else {
	                return JacobianPoint.ZERO;
	            }
	        }
	        const HH = mod(H * H);
	        const HHH = mod(H * HH);
	        const V = mod(U1 * HH);
	        const X3 = mod(r * r - HHH - _2n * V);
	        const Y3 = mod(r * (V - X3) - S1 * HHH);
	        const Z3 = mod(Z1 * Z2 * H);
	        return new JacobianPoint(X3, Y3, Z3);
	    }
	    subtract(other) {
	        return this.add(other.negate());
	    }
	    multiplyUnsafe(scalar) {
	        const P0 = JacobianPoint.ZERO;
	        if (typeof scalar === 'bigint' && scalar === _0n)
	            return P0;
	        let n = normalizeScalar(scalar);
	        if (n === _1n)
	            return this;
	        if (!USE_ENDOMORPHISM) {
	            let p = P0;
	            let d = this;
	            while (n > _0n) {
	                if (n & _1n)
	                    p = p.add(d);
	                d = d.double();
	                n >>= _1n;
	            }
	            return p;
	        }
	        let { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
	        let k1p = P0;
	        let k2p = P0;
	        let d = this;
	        while (k1 > _0n || k2 > _0n) {
	            if (k1 & _1n)
	                k1p = k1p.add(d);
	            if (k2 & _1n)
	                k2p = k2p.add(d);
	            d = d.double();
	            k1 >>= _1n;
	            k2 >>= _1n;
	        }
	        if (k1neg)
	            k1p = k1p.negate();
	        if (k2neg)
	            k2p = k2p.negate();
	        k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
	        return k1p.add(k2p);
	    }
	    precomputeWindow(W) {
	        const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
	        const points = [];
	        let p = this;
	        let base = p;
	        for (let window = 0; window < windows; window++) {
	            base = p;
	            points.push(base);
	            for (let i = 1; i < 2 ** (W - 1); i++) {
	                base = base.add(p);
	                points.push(base);
	            }
	            p = base.double();
	        }
	        return points;
	    }
	    wNAF(n, affinePoint) {
	        if (!affinePoint && this.equals(JacobianPoint.BASE))
	            affinePoint = Point.BASE;
	        const W = (affinePoint && affinePoint._WINDOW_SIZE) || 1;
	        if (256 % W) {
	            throw new Error('Point#wNAF: Invalid precomputation window, must be power of 2');
	        }
	        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
	        if (!precomputes) {
	            precomputes = this.precomputeWindow(W);
	            if (affinePoint && W !== 1) {
	                precomputes = JacobianPoint.normalizeZ(precomputes);
	                pointPrecomputes.set(affinePoint, precomputes);
	            }
	        }
	        let p = JacobianPoint.ZERO;
	        let f = JacobianPoint.ZERO;
	        const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
	        const windowSize = 2 ** (W - 1);
	        const mask = BigInt(2 ** W - 1);
	        const maxNumber = 2 ** W;
	        const shiftBy = BigInt(W);
	        for (let window = 0; window < windows; window++) {
	            const offset = window * windowSize;
	            let wbits = Number(n & mask);
	            n >>= shiftBy;
	            if (wbits > windowSize) {
	                wbits -= maxNumber;
	                n += _1n;
	            }
	            if (wbits === 0) {
	                let pr = precomputes[offset];
	                if (window % 2)
	                    pr = pr.negate();
	                f = f.add(pr);
	            }
	            else {
	                let cached = precomputes[offset + Math.abs(wbits) - 1];
	                if (wbits < 0)
	                    cached = cached.negate();
	                p = p.add(cached);
	            }
	        }
	        return { p, f };
	    }
	    multiply(scalar, affinePoint) {
	        let n = normalizeScalar(scalar);
	        let point;
	        let fake;
	        if (USE_ENDOMORPHISM) {
	            const { k1neg, k1, k2neg, k2 } = splitScalarEndo(n);
	            let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
	            let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
	            if (k1neg)
	                k1p = k1p.negate();
	            if (k2neg)
	                k2p = k2p.negate();
	            k2p = new JacobianPoint(mod(k2p.x * CURVE.beta), k2p.y, k2p.z);
	            point = k1p.add(k2p);
	            fake = f1p.add(f2p);
	        }
	        else {
	            const { p, f } = this.wNAF(n, affinePoint);
	            point = p;
	            fake = f;
	        }
	        return JacobianPoint.normalizeZ([point, fake])[0];
	    }
	    toAffine(invZ = invert(this.z)) {
	        const { x, y, z } = this;
	        const iz1 = invZ;
	        const iz2 = mod(iz1 * iz1);
	        const iz3 = mod(iz2 * iz1);
	        const ax = mod(x * iz2);
	        const ay = mod(y * iz3);
	        const zz = mod(z * iz1);
	        if (zz !== _1n)
	            throw new Error('invZ was invalid');
	        return new Point(ax, ay);
	    }
	}
	JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
	JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
	const pointPrecomputes = new WeakMap();
	class Point {
	    constructor(x, y) {
	        this.x = x;
	        this.y = y;
	    }
	    _setWindowSize(windowSize) {
	        this._WINDOW_SIZE = windowSize;
	        pointPrecomputes.delete(this);
	    }
	    hasEvenY() {
	        return this.y % _2n === _0n;
	    }
	    static fromCompressedHex(bytes) {
	        const isShort = bytes.length === 32;
	        const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
	        if (!isValidFieldElement(x))
	            throw new Error('Point is not on curve');
	        const y2 = weistrass(x);
	        let y = sqrtMod(y2);
	        const isYOdd = (y & _1n) === _1n;
	        if (isShort) {
	            if (isYOdd)
	                y = mod(-y);
	        }
	        else {
	            const isFirstByteOdd = (bytes[0] & 1) === 1;
	            if (isFirstByteOdd !== isYOdd)
	                y = mod(-y);
	        }
	        const point = new Point(x, y);
	        point.assertValidity();
	        return point;
	    }
	    static fromUncompressedHex(bytes) {
	        const x = bytesToNumber(bytes.subarray(1, 33));
	        const y = bytesToNumber(bytes.subarray(33, 65));
	        const point = new Point(x, y);
	        point.assertValidity();
	        return point;
	    }
	    static fromHex(hex) {
	        const bytes = ensureBytes(hex);
	        const len = bytes.length;
	        const header = bytes[0];
	        if (len === 32 || (len === 33 && (header === 0x02 || header === 0x03))) {
	            return this.fromCompressedHex(bytes);
	        }
	        if (len === 65 && header === 0x04)
	            return this.fromUncompressedHex(bytes);
	        throw new Error(`Point.fromHex: received invalid point. Expected 32-33 compressed bytes or 65 uncompressed bytes, not ${len}`);
	    }
	    static fromPrivateKey(privateKey) {
	        return Point.BASE.multiply(normalizePrivateKey(privateKey));
	    }
	    static fromSignature(msgHash, signature, recovery) {
	        msgHash = ensureBytes(msgHash);
	        const h = truncateHash(msgHash);
	        const { r, s } = normalizeSignature(signature);
	        if (recovery !== 0 && recovery !== 1) {
	            throw new Error('Cannot recover signature: invalid recovery bit');
	        }
	        const prefix = recovery & 1 ? '03' : '02';
	        const R = Point.fromHex(prefix + numTo32bStr(r));
	        const { n } = CURVE;
	        const rinv = invert(r, n);
	        const u1 = mod(-h * rinv, n);
	        const u2 = mod(s * rinv, n);
	        const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
	        if (!Q)
	            throw new Error('Cannot recover signature: point at infinify');
	        Q.assertValidity();
	        return Q;
	    }
	    toRawBytes(isCompressed = false) {
	        return hexToBytes(this.toHex(isCompressed));
	    }
	    toHex(isCompressed = false) {
	        const x = numTo32bStr(this.x);
	        if (isCompressed) {
	            const prefix = this.hasEvenY() ? '02' : '03';
	            return `${prefix}${x}`;
	        }
	        else {
	            return `04${x}${numTo32bStr(this.y)}`;
	        }
	    }
	    toHexX() {
	        return this.toHex(true).slice(2);
	    }
	    toRawX() {
	        return this.toRawBytes(true).slice(1);
	    }
	    assertValidity() {
	        const msg = 'Point is not on elliptic curve';
	        const { x, y } = this;
	        if (!isValidFieldElement(x) || !isValidFieldElement(y))
	            throw new Error(msg);
	        const left = mod(y * y);
	        const right = weistrass(x);
	        if (mod(left - right) !== _0n)
	            throw new Error(msg);
	    }
	    equals(other) {
	        return this.x === other.x && this.y === other.y;
	    }
	    negate() {
	        return new Point(this.x, mod(-this.y));
	    }
	    double() {
	        return JacobianPoint.fromAffine(this).double().toAffine();
	    }
	    add(other) {
	        return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
	    }
	    subtract(other) {
	        return this.add(other.negate());
	    }
	    multiply(scalar) {
	        return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
	    }
	    multiplyAndAddUnsafe(Q, a, b) {
	        const P = JacobianPoint.fromAffine(this);
	        const aP = a === _0n || a === _1n || this !== Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
	        const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
	        const sum = aP.add(bQ);
	        return sum.equals(JacobianPoint.ZERO) ? undefined : sum.toAffine();
	    }
	}
	Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
	Point.ZERO = new Point(_0n, _0n);
	function sliceDER(s) {
	    return Number.parseInt(s[0], 16) >= 8 ? '00' + s : s;
	}
	function parseDERInt(data) {
	    if (data.length < 2 || data[0] !== 0x02) {
	        throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
	    }
	    const len = data[1];
	    const res = data.subarray(2, len + 2);
	    if (!len || res.length !== len) {
	        throw new Error(`Invalid signature integer: wrong length`);
	    }
	    if (res[0] === 0x00 && res[1] <= 0x7f) {
	        throw new Error('Invalid signature integer: trailing length');
	    }
	    return { data: bytesToNumber(res), left: data.subarray(len + 2) };
	}
	function parseDERSignature(data) {
	    if (data.length < 2 || data[0] != 0x30) {
	        throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
	    }
	    if (data[1] !== data.length - 2) {
	        throw new Error('Invalid signature: incorrect length');
	    }
	    const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
	    const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
	    if (rBytesLeft.length) {
	        throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
	    }
	    return { r, s };
	}
	class Signature {
	    constructor(r, s) {
	        this.r = r;
	        this.s = s;
	        this.assertValidity();
	    }
	    static fromCompact(hex) {
	        const arr = hex instanceof Uint8Array;
	        const name = 'Signature.fromCompact';
	        if (typeof hex !== 'string' && !arr)
	            throw new TypeError(`${name}: Expected string or Uint8Array`);
	        const str = arr ? bytesToHex(hex) : hex;
	        if (str.length !== 128)
	            throw new Error(`${name}: Expected 64-byte hex`);
	        return new Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
	    }
	    static fromDER(hex) {
	        const arr = hex instanceof Uint8Array;
	        if (typeof hex !== 'string' && !arr)
	            throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
	        const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
	        return new Signature(r, s);
	    }
	    static fromHex(hex) {
	        return this.fromDER(hex);
	    }
	    assertValidity() {
	        const { r, s } = this;
	        if (!isWithinCurveOrder(r))
	            throw new Error('Invalid Signature: r must be 0 < r < n');
	        if (!isWithinCurveOrder(s))
	            throw new Error('Invalid Signature: s must be 0 < s < n');
	    }
	    hasHighS() {
	        const HALF = CURVE.n >> _1n;
	        return this.s > HALF;
	    }
	    normalizeS() {
	        return this.hasHighS() ? new Signature(this.r, CURVE.n - this.s) : this;
	    }
	    toDERRawBytes(isCompressed = false) {
	        return hexToBytes(this.toDERHex(isCompressed));
	    }
	    toDERHex(isCompressed = false) {
	        const sHex = sliceDER(numberToHexUnpadded(this.s));
	        if (isCompressed)
	            return sHex;
	        const rHex = sliceDER(numberToHexUnpadded(this.r));
	        const rLen = numberToHexUnpadded(rHex.length / 2);
	        const sLen = numberToHexUnpadded(sHex.length / 2);
	        const length = numberToHexUnpadded(rHex.length / 2 + sHex.length / 2 + 4);
	        return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
	    }
	    toRawBytes() {
	        return this.toDERRawBytes();
	    }
	    toHex() {
	        return this.toDERHex();
	    }
	    toCompactRawBytes() {
	        return hexToBytes(this.toCompactHex());
	    }
	    toCompactHex() {
	        return numTo32bStr(this.r) + numTo32bStr(this.s);
	    }
	}
	function concatBytes(...arrays) {
	    if (!arrays.every((b) => b instanceof Uint8Array))
	        throw new Error('Uint8Array list expected');
	    if (arrays.length === 1)
	        return arrays[0];
	    const length = arrays.reduce((a, arr) => a + arr.length, 0);
	    const result = new Uint8Array(length);
	    for (let i = 0, pad = 0; i < arrays.length; i++) {
	        const arr = arrays[i];
	        result.set(arr, pad);
	        pad += arr.length;
	    }
	    return result;
	}
	const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
	function bytesToHex(uint8a) {
	    if (!(uint8a instanceof Uint8Array))
	        throw new Error('Expected Uint8Array');
	    let hex = '';
	    for (let i = 0; i < uint8a.length; i++) {
	        hex += hexes[uint8a[i]];
	    }
	    return hex;
	}
	const POW_2_256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000');
	function numTo32bStr(num) {
	    if (typeof num !== 'bigint')
	        throw new Error('Expected bigint');
	    if (!(_0n <= num && num < POW_2_256))
	        throw new Error('Expected number < 2^256');
	    return num.toString(16).padStart(64, '0');
	}
	function numTo32b(num) {
	    const b = hexToBytes(numTo32bStr(num));
	    if (b.length !== 32)
	        throw new Error('Error: expected 32 bytes');
	    return b;
	}
	function numberToHexUnpadded(num) {
	    const hex = num.toString(16);
	    return hex.length & 1 ? `0${hex}` : hex;
	}
	function hexToNumber(hex) {
	    if (typeof hex !== 'string') {
	        throw new TypeError('hexToNumber: expected string, got ' + typeof hex);
	    }
	    return BigInt(`0x${hex}`);
	}
	function hexToBytes(hex) {
	    if (typeof hex !== 'string') {
	        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
	    }
	    if (hex.length % 2)
	        throw new Error('hexToBytes: received invalid unpadded hex' + hex.length);
	    const array = new Uint8Array(hex.length / 2);
	    for (let i = 0; i < array.length; i++) {
	        const j = i * 2;
	        const hexByte = hex.slice(j, j + 2);
	        const byte = Number.parseInt(hexByte, 16);
	        if (Number.isNaN(byte) || byte < 0)
	            throw new Error('Invalid byte sequence');
	        array[i] = byte;
	    }
	    return array;
	}
	function bytesToNumber(bytes) {
	    return hexToNumber(bytesToHex(bytes));
	}
	function ensureBytes(hex) {
	    return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
	}
	function normalizeScalar(num) {
	    if (typeof num === 'number' && Number.isSafeInteger(num) && num > 0)
	        return BigInt(num);
	    if (typeof num === 'bigint' && isWithinCurveOrder(num))
	        return num;
	    throw new TypeError('Expected valid private scalar: 0 < scalar < curve.n');
	}
	function mod(a, b = CURVE.P) {
	    const result = a % b;
	    return result >= _0n ? result : b + result;
	}
	function pow2(x, power) {
	    const { P } = CURVE;
	    let res = x;
	    while (power-- > _0n) {
	        res *= res;
	        res %= P;
	    }
	    return res;
	}
	function sqrtMod(x) {
	    const { P } = CURVE;
	    const _6n = BigInt(6);
	    const _11n = BigInt(11);
	    const _22n = BigInt(22);
	    const _23n = BigInt(23);
	    const _44n = BigInt(44);
	    const _88n = BigInt(88);
	    const b2 = (x * x * x) % P;
	    const b3 = (b2 * b2 * x) % P;
	    const b6 = (pow2(b3, _3n) * b3) % P;
	    const b9 = (pow2(b6, _3n) * b3) % P;
	    const b11 = (pow2(b9, _2n) * b2) % P;
	    const b22 = (pow2(b11, _11n) * b11) % P;
	    const b44 = (pow2(b22, _22n) * b22) % P;
	    const b88 = (pow2(b44, _44n) * b44) % P;
	    const b176 = (pow2(b88, _88n) * b88) % P;
	    const b220 = (pow2(b176, _44n) * b44) % P;
	    const b223 = (pow2(b220, _3n) * b3) % P;
	    const t1 = (pow2(b223, _23n) * b22) % P;
	    const t2 = (pow2(t1, _6n) * b2) % P;
	    return pow2(t2, _2n);
	}
	function invert(number, modulo = CURVE.P) {
	    if (number === _0n || modulo <= _0n) {
	        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
	    }
	    let a = mod(number, modulo);
	    let b = modulo;
	    let x = _0n, y = _1n, u = _1n, v = _0n;
	    while (a !== _0n) {
	        const q = b / a;
	        const r = b % a;
	        const m = x - u * q;
	        const n = y - v * q;
	        b = a, a = r, x = u, y = v, u = m, v = n;
	    }
	    const gcd = b;
	    if (gcd !== _1n)
	        throw new Error('invert: does not exist');
	    return mod(x, modulo);
	}
	function invertBatch(nums, p = CURVE.P) {
	    const scratch = new Array(nums.length);
	    const lastMultiplied = nums.reduce((acc, num, i) => {
	        if (num === _0n)
	            return acc;
	        scratch[i] = acc;
	        return mod(acc * num, p);
	    }, _1n);
	    const inverted = invert(lastMultiplied, p);
	    nums.reduceRight((acc, num, i) => {
	        if (num === _0n)
	            return acc;
	        scratch[i] = mod(acc * scratch[i], p);
	        return mod(acc * num, p);
	    }, inverted);
	    return scratch;
	}
	const divNearest = (a, b) => (a + b / _2n) / b;
	const ENDO = {
	    a1: BigInt('0x3086d221a7d46bcde86c90e49284eb15'),
	    b1: -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3'),
	    a2: BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8'),
	    b2: BigInt('0x3086d221a7d46bcde86c90e49284eb15'),
	    POW_2_128: BigInt('0x100000000000000000000000000000000'),
	};
	function splitScalarEndo(k) {
	    const { n } = CURVE;
	    const { a1, b1, a2, b2, POW_2_128 } = ENDO;
	    const c1 = divNearest(b2 * k, n);
	    const c2 = divNearest(-b1 * k, n);
	    let k1 = mod(k - c1 * a1 - c2 * a2, n);
	    let k2 = mod(-c1 * b1 - c2 * b2, n);
	    const k1neg = k1 > POW_2_128;
	    const k2neg = k2 > POW_2_128;
	    if (k1neg)
	        k1 = n - k1;
	    if (k2neg)
	        k2 = n - k2;
	    if (k1 > POW_2_128 || k2 > POW_2_128) {
	        throw new Error('splitScalarEndo: Endomorphism failed, k=' + k);
	    }
	    return { k1neg, k1, k2neg, k2 };
	}
	function truncateHash(hash) {
	    const { n } = CURVE;
	    const byteLength = hash.length;
	    const delta = byteLength * 8 - 256;
	    let h = bytesToNumber(hash);
	    if (delta > 0)
	        h = h >> BigInt(delta);
	    if (h >= n)
	        h -= n;
	    return h;
	}
	let _sha256Sync;
	let _hmacSha256Sync;
	function isWithinCurveOrder(num) {
	    return _0n < num && num < CURVE.n;
	}
	function isValidFieldElement(num) {
	    return _0n < num && num < CURVE.P;
	}
	function normalizePrivateKey(key) {
	    let num;
	    if (typeof key === 'bigint') {
	        num = key;
	    }
	    else if (typeof key === 'number' && Number.isSafeInteger(key) && key > 0) {
	        num = BigInt(key);
	    }
	    else if (typeof key === 'string') {
	        if (key.length !== 64)
	            throw new Error('Expected 32 bytes of private key');
	        num = hexToNumber(key);
	    }
	    else if (key instanceof Uint8Array) {
	        if (key.length !== 32)
	            throw new Error('Expected 32 bytes of private key');
	        num = bytesToNumber(key);
	    }
	    else {
	        throw new TypeError('Expected valid private key');
	    }
	    if (!isWithinCurveOrder(num))
	        throw new Error('Expected private key: 0 < key < n');
	    return num;
	}
	function normalizePublicKey(publicKey) {
	    if (publicKey instanceof Point) {
	        publicKey.assertValidity();
	        return publicKey;
	    }
	    else {
	        return Point.fromHex(publicKey);
	    }
	}
	function normalizeSignature(signature) {
	    if (signature instanceof Signature) {
	        signature.assertValidity();
	        return signature;
	    }
	    try {
	        return Signature.fromDER(signature);
	    }
	    catch (error) {
	        return Signature.fromCompact(signature);
	    }
	}
	function schnorrChallengeFinalize(ch) {
	    return mod(bytesToNumber(ch), CURVE.n);
	}
	class SchnorrSignature {
	    constructor(r, s) {
	        this.r = r;
	        this.s = s;
	        this.assertValidity();
	    }
	    static fromHex(hex) {
	        const bytes = ensureBytes(hex);
	        if (bytes.length !== 64)
	            throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes.length}`);
	        const r = bytesToNumber(bytes.subarray(0, 32));
	        const s = bytesToNumber(bytes.subarray(32, 64));
	        return new SchnorrSignature(r, s);
	    }
	    assertValidity() {
	        const { r, s } = this;
	        if (!isValidFieldElement(r) || !isWithinCurveOrder(s))
	            throw new Error('Invalid signature');
	    }
	    toHex() {
	        return numTo32bStr(this.r) + numTo32bStr(this.s);
	    }
	    toRawBytes() {
	        return hexToBytes(this.toHex());
	    }
	}
	function schnorrGetPublicKey(privateKey) {
	    return Point.fromPrivateKey(privateKey).toRawX();
	}
	class InternalSchnorrSignature {
	    constructor(message, privateKey, auxRand = utils.randomBytes()) {
	        if (message == null)
	            throw new TypeError(`sign: Expected valid message, not "${message}"`);
	        this.m = ensureBytes(message);
	        const { x, scalar } = this.getScalar(normalizePrivateKey(privateKey));
	        this.px = x;
	        this.d = scalar;
	        this.rand = ensureBytes(auxRand);
	        if (this.rand.length !== 32)
	            throw new TypeError('sign: Expected 32 bytes of aux randomness');
	    }
	    getScalar(priv) {
	        const point = Point.fromPrivateKey(priv);
	        const scalar = point.hasEvenY() ? priv : CURVE.n - priv;
	        return { point, scalar, x: point.toRawX() };
	    }
	    initNonce(d, t0h) {
	        return numTo32b(d ^ bytesToNumber(t0h));
	    }
	    finalizeNonce(k0h) {
	        const k0 = mod(bytesToNumber(k0h), CURVE.n);
	        if (k0 === _0n)
	            throw new Error('sign: Creation of signature failed. k is zero');
	        const { point: R, x: rx, scalar: k } = this.getScalar(k0);
	        return { R, rx, k };
	    }
	    finalizeSig(R, k, e, d) {
	        return new SchnorrSignature(R.x, mod(k + e * d, CURVE.n)).toRawBytes();
	    }
	    error() {
	        throw new Error('sign: Invalid signature produced');
	    }
	    async calc() {
	        const { m, d, px, rand } = this;
	        const tag = utils.taggedHash;
	        const t = this.initNonce(d, await tag(TAGS.aux, rand));
	        const { R, rx, k } = this.finalizeNonce(await tag(TAGS.nonce, t, px, m));
	        const e = schnorrChallengeFinalize(await tag(TAGS.challenge, rx, px, m));
	        const sig = this.finalizeSig(R, k, e, d);
	        if (!(await schnorrVerify(sig, m, px)))
	            this.error();
	        return sig;
	    }
	    calcSync() {
	        const { m, d, px, rand } = this;
	        const tag = utils.taggedHashSync;
	        const t = this.initNonce(d, tag(TAGS.aux, rand));
	        const { R, rx, k } = this.finalizeNonce(tag(TAGS.nonce, t, px, m));
	        const e = schnorrChallengeFinalize(tag(TAGS.challenge, rx, px, m));
	        const sig = this.finalizeSig(R, k, e, d);
	        if (!schnorrVerifySync(sig, m, px))
	            this.error();
	        return sig;
	    }
	}
	async function schnorrSign(msg, privKey, auxRand) {
	    return new InternalSchnorrSignature(msg, privKey, auxRand).calc();
	}
	function schnorrSignSync(msg, privKey, auxRand) {
	    return new InternalSchnorrSignature(msg, privKey, auxRand).calcSync();
	}
	function initSchnorrVerify(signature, message, publicKey) {
	    const raw = signature instanceof SchnorrSignature;
	    const sig = raw ? signature : SchnorrSignature.fromHex(signature);
	    if (raw)
	        sig.assertValidity();
	    return {
	        ...sig,
	        m: ensureBytes(message),
	        P: normalizePublicKey(publicKey),
	    };
	}
	function finalizeSchnorrVerify(r, P, s, e) {
	    const R = Point.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey(s), mod(-e, CURVE.n));
	    if (!R || !R.hasEvenY() || R.x !== r)
	        return false;
	    return true;
	}
	async function schnorrVerify(signature, message, publicKey) {
	    try {
	        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
	        const e = schnorrChallengeFinalize(await utils.taggedHash(TAGS.challenge, numTo32b(r), P.toRawX(), m));
	        return finalizeSchnorrVerify(r, P, s, e);
	    }
	    catch (error) {
	        return false;
	    }
	}
	function schnorrVerifySync(signature, message, publicKey) {
	    try {
	        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
	        const e = schnorrChallengeFinalize(utils.taggedHashSync(TAGS.challenge, numTo32b(r), P.toRawX(), m));
	        return finalizeSchnorrVerify(r, P, s, e);
	    }
	    catch (error) {
	        if (error instanceof ShaError)
	            throw error;
	        return false;
	    }
	}
	const schnorr = {
	    Signature: SchnorrSignature,
	    getPublicKey: schnorrGetPublicKey,
	    sign: schnorrSign,
	    verify: schnorrVerify,
	    signSync: schnorrSignSync,
	    verifySync: schnorrVerifySync,
	};
	Point.BASE._setWindowSize(8);
	const crypto = {
	    node: nodeCrypto,
	    web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined,
	};
	const TAGS = {
	    challenge: 'BIP0340/challenge',
	    aux: 'BIP0340/aux',
	    nonce: 'BIP0340/nonce',
	};
	const TAGGED_HASH_PREFIXES = {};
	const utils = {
	    bytesToHex,
	    hexToBytes,
	    concatBytes,
	    mod,
	    invert,
	    isValidPrivateKey(privateKey) {
	        try {
	            normalizePrivateKey(privateKey);
	            return true;
	        }
	        catch (error) {
	            return false;
	        }
	    },
	    _bigintTo32Bytes: numTo32b,
	    _normalizePrivateKey: normalizePrivateKey,
	    hashToPrivateKey: (hash) => {
	        hash = ensureBytes(hash);
	        if (hash.length < 40 || hash.length > 1024)
	            throw new Error('Expected 40-1024 bytes of private key as per FIPS 186');
	        const num = mod(bytesToNumber(hash), CURVE.n - _1n) + _1n;
	        return numTo32b(num);
	    },
	    randomBytes: (bytesLength = 32) => {
	        if (crypto.web) {
	            return crypto.web.getRandomValues(new Uint8Array(bytesLength));
	        }
	        else if (crypto.node) {
	            const { randomBytes } = crypto.node;
	            return Uint8Array.from(randomBytes(bytesLength));
	        }
	        else {
	            throw new Error("The environment doesn't have randomBytes function");
	        }
	    },
	    randomPrivateKey: () => {
	        return utils.hashToPrivateKey(utils.randomBytes(40));
	    },
	    sha256: async (...messages) => {
	        if (crypto.web) {
	            const buffer = await crypto.web.subtle.digest('SHA-256', concatBytes(...messages));
	            return new Uint8Array(buffer);
	        }
	        else if (crypto.node) {
	            const { createHash } = crypto.node;
	            const hash = createHash('sha256');
	            messages.forEach((m) => hash.update(m));
	            return Uint8Array.from(hash.digest());
	        }
	        else {
	            throw new Error("The environment doesn't have sha256 function");
	        }
	    },
	    hmacSha256: async (key, ...messages) => {
	        if (crypto.web) {
	            const ckey = await crypto.web.subtle.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
	            const message = concatBytes(...messages);
	            const buffer = await crypto.web.subtle.sign('HMAC', ckey, message);
	            return new Uint8Array(buffer);
	        }
	        else if (crypto.node) {
	            const { createHmac } = crypto.node;
	            const hash = createHmac('sha256', key);
	            messages.forEach((m) => hash.update(m));
	            return Uint8Array.from(hash.digest());
	        }
	        else {
	            throw new Error("The environment doesn't have hmac-sha256 function");
	        }
	    },
	    sha256Sync: undefined,
	    hmacSha256Sync: undefined,
	    taggedHash: async (tag, ...messages) => {
	        let tagP = TAGGED_HASH_PREFIXES[tag];
	        if (tagP === undefined) {
	            const tagH = await utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
	            tagP = concatBytes(tagH, tagH);
	            TAGGED_HASH_PREFIXES[tag] = tagP;
	        }
	        return utils.sha256(tagP, ...messages);
	    },
	    taggedHashSync: (tag, ...messages) => {
	        if (typeof _sha256Sync !== 'function')
	            throw new ShaError('sha256Sync is undefined, you need to set it');
	        let tagP = TAGGED_HASH_PREFIXES[tag];
	        if (tagP === undefined) {
	            const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
	            tagP = concatBytes(tagH, tagH);
	            TAGGED_HASH_PREFIXES[tag] = tagP;
	        }
	        return _sha256Sync(tagP, ...messages);
	    },
	    precompute(windowSize = 8, point = Point.BASE) {
	        const cached = point === Point.BASE ? point : new Point(point.x, point.y);
	        cached._setWindowSize(windowSize);
	        cached.multiply(_3n);
	        return cached;
	    },
	};
	Object.defineProperties(utils, {
	    sha256Sync: {
	        configurable: false,
	        get() {
	            return _sha256Sync;
	        },
	        set(val) {
	            if (!_sha256Sync)
	                _sha256Sync = val;
	        },
	    },
	    hmacSha256Sync: {
	        configurable: false,
	        get() {
	            return _hmacSha256Sync;
	        },
	        set(val) {
	            if (!_hmacSha256Sync)
	                _hmacSha256Sync = val;
	        },
	    },
	});

	var EC = /*#__PURE__*/require('elliptic').ec;
	var myKey;
	function arrayToBase64Url(array) {
	  return btoa(String.fromCharCode.apply(null, array)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
	}
	function arrayToHex(array) {
	  return Array.from(array, function (_byte) {
	    return ('0' + (_byte & 0xff).toString(16)).slice(-2);
	  }).join('');
	}
	function base64UrlToArray(base64Url) {
	  return Uint8Array.from(atob(base64Url.replace(/-/g, '+').replace(/_/g, '/')), function (c) {
	    return c.charCodeAt(0);
	  });
	}
	var hexToUint8Array = function hexToUint8Array(hexString) {
	  var match = hexString.match(/.{1,2}/g);
	  if (!match) {
	    throw new Error('Not a hex string');
	  }
	  return Uint8Array.from(match.map(function (_byte2) {
	    return parseInt(_byte2, 16);
	  }));
	};
	var Key = /*#__PURE__*/function () {
	  function Key() {}
	  /**
	   * Derive a key from bytes. For example, sign a login prompt string with metamask and
	   * pass the signature to this function to derive a key.
	   * @param bytes
	   */Key.deriveFromBytes =
	  /*#__PURE__*/
	  function () {
	    var _deriveFromBytes = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(bytes) {
	      var hash1, hash2, signingKey, encryptionKey, k;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.next = 2;
	              return window.crypto.subtle.digest('SHA-256', bytes);
	            case 2:
	              hash1 = _context.sent;
	              _context.next = 5;
	              return window.crypto.subtle.digest('SHA-256', hash1);
	            case 5:
	              hash2 = _context.sent;
	              signingKey = this.irisKeyPairFromHash(hash1);
	              encryptionKey = this.irisKeyPairFromHash(hash2);
	              k = {
	                pub: signingKey.pub,
	                priv: signingKey.priv,
	                epub: encryptionKey.pub,
	                epriv: encryptionKey.priv
	              };
	              _context.next = 11;
	              return Key.addSecp256k1KeyPair(k);
	            case 11:
	              k = _context.sent;
	              return _context.abrupt("return", k);
	            case 13:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee, this);
	    }));
	    function deriveFromBytes(_x) {
	      return _deriveFromBytes.apply(this, arguments);
	    }
	    return deriveFromBytes;
	  }();
	  Key.addSecp256k1KeyPair = /*#__PURE__*/function () {
	    var _addSecp256k1KeyPair = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key) {
	      var hash;
	      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              if (key.secp256k1) {
	                _context2.next = 5;
	                break;
	              }
	              _context2.next = 3;
	              return window.crypto.subtle.digest('SHA-256', base64UrlToArray(key.priv));
	            case 3:
	              hash = _context2.sent;
	              key.secp256k1 = Key.secp256k1KeyPairFromHash(hash);
	            case 5:
	              return _context2.abrupt("return", key);
	            case 6:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2);
	    }));
	    function addSecp256k1KeyPair(_x2) {
	      return _addSecp256k1KeyPair.apply(this, arguments);
	    }
	    return addSecp256k1KeyPair;
	  }();
	  Key.fromSecp256k1 = /*#__PURE__*/function () {
	    var _fromSecp256k = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(priv) {
	      var privArr, hash, k;
	      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              if (utils.isValidPrivateKey(priv)) {
	                _context3.next = 2;
	                break;
	              }
	              throw new Error("invalid secp256k1 private key");
	            case 2:
	              privArr = hexToUint8Array(priv);
	              _context3.next = 5;
	              return window.crypto.subtle.digest('SHA-256', privArr);
	            case 5:
	              hash = _context3.sent;
	              _context3.next = 8;
	              return this.deriveFromBytes(new Uint8Array(hash));
	            case 8:
	              k = _context3.sent;
	              k.secp256k1 = {
	                priv: priv,
	                rpub: arrayToHex(schnorr.getPublicKey(privArr))
	              };
	              return _context3.abrupt("return", k);
	            case 11:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3, this);
	    }));
	    function fromSecp256k1(_x3) {
	      return _fromSecp256k.apply(this, arguments);
	    }
	    return fromSecp256k1;
	  }();
	  Key.irisKeyPairFromHash = function irisKeyPairFromHash(hash) {
	    var ec = new EC('p256');
	    var keyPair = ec.keyFromPrivate(new Uint8Array(hash));
	    var privKey = keyPair.getPrivate().toArray('be', 32);
	    var x = keyPair.getPublic().getX().toArray('be', 32);
	    var y = keyPair.getPublic().getY().toArray('be', 32);
	    privKey = arrayToBase64Url(privKey);
	    x = arrayToBase64Url(x);
	    y = arrayToBase64Url(y);
	    var kp = {
	      pub: x + "." + y,
	      priv: privKey
	    };
	    return kp;
	  }
	  // secp256k1 is used by nostr among others
	  ;
	  Key.secp256k1KeyPairFromHash = function secp256k1KeyPairFromHash(hash) {
	    var ec = new EC('secp256k1');
	    var keyPair = ec.keyFromPrivate(new Uint8Array(hash));
	    var priv = keyPair.getPrivate().toString(16);
	    var rpub = arrayToHex(schnorr.getPublicKey(priv));
	    var kp = {
	      rpub: rpub,
	      priv: priv
	    };
	    return kp;
	  };
	  Key.getActiveKey = /*#__PURE__*/function () {
	    var _getActiveKey = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(datadir, keyfile, fs) {
	      var privKeyFile, f, newKey, str, _newKey;
	      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              if (datadir === void 0) {
	                datadir = ".";
	              }
	              if (keyfile === void 0) {
	                keyfile = "iris.key";
	              }
	              if (!myKey) {
	                _context4.next = 4;
	                break;
	              }
	              return _context4.abrupt("return", myKey);
	            case 4:
	              if (!fs) {
	                _context4.next = 21;
	                break;
	              }
	              privKeyFile = datadir + "/" + keyfile;
	              if (!fs.existsSync(privKeyFile)) {
	                _context4.next = 11;
	                break;
	              }
	              f = fs.readFileSync(privKeyFile, "utf8");
	              myKey = Key.fromString(f);
	              _context4.next = 17;
	              break;
	            case 11:
	              _context4.next = 13;
	              return Key.generate();
	            case 13:
	              newKey = _context4.sent;
	              myKey = myKey || newKey; // eslint-disable-line require-atomic-updates
	              fs.writeFileSync(privKeyFile, Key.toString(myKey));
	              fs.chmodSync(privKeyFile, 400);
	            case 17:
	              if (myKey) {
	                _context4.next = 19;
	                break;
	              }
	              throw new Error("loading default key failed - check " + datadir + "/" + keyfile);
	            case 19:
	              _context4.next = 33;
	              break;
	            case 21:
	              str = window.localStorage.getItem("iris.myKey");
	              if (!str) {
	                _context4.next = 26;
	                break;
	              }
	              myKey = Key.fromString(str);
	              _context4.next = 31;
	              break;
	            case 26:
	              _context4.next = 28;
	              return Key.generate();
	            case 28:
	              _newKey = _context4.sent;
	              myKey = myKey || _newKey; // eslint-disable-line require-atomic-updates
	              window.localStorage.setItem("iris.myKey", Key.toString(myKey));
	            case 31:
	              if (myKey) {
	                _context4.next = 33;
	                break;
	              }
	              throw new Error("loading default key failed - check localStorage iris.myKey");
	            case 33:
	              return _context4.abrupt("return", this.addSecp256k1KeyPair(myKey));
	            case 34:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4, this);
	    }));
	    function getActiveKey(_x4, _x5, _x6) {
	      return _getActiveKey.apply(this, arguments);
	    }
	    return getActiveKey;
	  }();
	  Key.getDefault = function getDefault(datadir, keyfile) {
	    if (datadir === void 0) {
	      datadir = ".";
	    }
	    if (keyfile === void 0) {
	      keyfile = "iris.key";
	    }
	    return Key.getActiveKey(datadir, keyfile);
	  };
	  Key.getActivePub = /*#__PURE__*/function () {
	    var _getActivePub = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(datadir, keyfile) {
	      var key;
	      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              if (datadir === void 0) {
	                datadir = ".";
	              }
	              if (keyfile === void 0) {
	                keyfile = "iris.key";
	              }
	              _context5.next = 4;
	              return Key.getActiveKey(datadir, keyfile);
	            case 4:
	              key = _context5.sent;
	              return _context5.abrupt("return", key.pub);
	            case 6:
	            case "end":
	              return _context5.stop();
	          }
	        }
	      }, _callee5);
	    }));
	    function getActivePub(_x7, _x8) {
	      return _getActivePub.apply(this, arguments);
	    }
	    return getActivePub;
	  }();
	  Key.setActiveKey = function setActiveKey(key, save, datadir, keyfile, fs) {
	    if (save === void 0) {
	      save = true;
	    }
	    if (datadir === void 0) {
	      datadir = ".";
	    }
	    if (keyfile === void 0) {
	      keyfile = "iris.key";
	    }
	    myKey = key;
	    if (!save) return;
	    if (util.isNode) {
	      var privKeyFile = datadir + "/" + keyfile;
	      fs.writeFileSync(privKeyFile, Key.toString(myKey));
	      fs.chmodSync(privKeyFile, 400);
	    } else {
	      window.localStorage.setItem("iris.myKey", Key.toString(myKey));
	    }
	  };
	  Key.toString = function toString(key) {
	    return JSON.stringify(key);
	  };
	  Key.getId = function getId(key) {
	    if (!(key && key.pub)) {
	      throw new Error("missing param");
	    }
	    return key.pub; // hack until GUN supports lookups by keyID
	    //return util.getHash(key.pub);
	  };
	  Key.fromString = function fromString(str) {
	    return JSON.parse(str);
	  };
	  Key.generate = function generate() {
	    return gun$1.SEA.pair();
	  };
	  Key.schnorrSign = /*#__PURE__*/function () {
	    var _schnorrSign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(msg, priv) {
	      var msgArr, privArr, sig;
	      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              msgArr = hexToUint8Array(msg);
	              privArr = hexToUint8Array(priv);
	              _context6.next = 4;
	              return schnorr.sign(msgArr, privArr);
	            case 4:
	              sig = _context6.sent;
	              return _context6.abrupt("return", arrayToHex(sig));
	            case 6:
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6);
	    }));
	    function schnorrSign(_x9, _x10) {
	      return _schnorrSign.apply(this, arguments);
	    }
	    return schnorrSign;
	  }();
	  Key.schnorrVerify = function schnorrVerify(sig, msg, pub) {
	    var sigArr = hexToUint8Array(sig);
	    var msgArr = hexToUint8Array(msg);
	    var pubArr = hexToUint8Array(pub);
	    return schnorr.verify(sigArr, msgArr, pubArr);
	  };
	  Key.sign = /*#__PURE__*/function () {
	    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(msg, pair) {
	      var sig;
	      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              _context7.next = 2;
	              return gun$1.SEA.sign(msg, pair);
	            case 2:
	              sig = _context7.sent;
	              return _context7.abrupt("return", "a" + sig);
	            case 4:
	            case "end":
	              return _context7.stop();
	          }
	        }
	      }, _callee7);
	    }));
	    function sign(_x11, _x12) {
	      return _sign.apply(this, arguments);
	    }
	    return sign;
	  }();
	  Key.verify = function verify(msg, pubKey) {
	    return gun$1.SEA.verify(msg.slice(1), pubKey);
	  };
	  return Key;
	}();

	var key;
	var myName;
	var latestChatLink;
	var onlineTimeout;
	var ourActivity;
	var noFollows;
	var noFollowers;
	var searchIndex;
	var initCalled;
	var searchableItems = {};
	var getExtendedFollowsCalled = /*#__PURE__*/new Map();
	var DEFAULT_FOLLOW = 'hyECQHwSo7fgr2MVfPyakvayPeixxsaAWVtZ-vbaiSc.TXIp8MnCtrnW6n2MrYquWPcc-DTmZzMBmc2yaGv9gIU';
	var DEFAULT_SETTINGS = {
	  electron: {
	    openAtLogin: true,
	    minimizeOnClose: true
	  },
	  local: {
	    enableWebtorrent: !util.isMobile,
	    enablePublicPeerDiscovery: true,
	    autoplayWebtorrent: true,
	    maxConnectedPeers: util.isElectron ? 2 : 1
	  }
	};
	/**
	 * User session management utilities.
	 */
	var session = {
	  /**
	   * Log in with a key from localStorage.
	   *
	   * If no key is found and options.autologin is not false, a new user will be created.
	   *
	   * If options.autofollow is not false, the default follow will be added.
	   * @param options
	   */init: function init(options) {
	    var _this = this;
	    if (options === void 0) {
	      options = {};
	    }
	    if (initCalled) {
	      return;
	    }
	    initCalled = true;
	    var localStorageKey = localStorage.getItem('iris.myKey');
	    if (!localStorageKey) {
	      localStorageKey = localStorage.getItem('chatKeyPair');
	    }
	    if (localStorageKey) {
	      this.login(JSON.parse(localStorageKey), options);
	    } else if (options.autologin !== false) {
	      this.loginAsNewUser(options);
	    } else {
	      this.clearIndexedDB();
	    }
	    setTimeout(function () {
	      local$1().get('block').map(function () {
	        _this.updateSearchIndex();
	      });
	      _this.updateSearchIndex();
	    });
	    setInterval(function () {
	      if (_this.taskQueue.length) {
	        //console.log('this.taskQueue', this.taskQueue.length);
	        var t = _this.taskQueue.shift();
	        t && t();
	      }
	    }, 10);
	  },
	  DEFAULT_SETTINGS: DEFAULT_SETTINGS,
	  DEFAULT_FOLLOW: DEFAULT_FOLLOW,
	  taskQueue: [],
	  updateSearchIndex: /*#__PURE__*/_.throttle(function () {
	    var options = {
	      keys: ['name'],
	      includeScore: true,
	      includeMatches: true,
	      threshold: 0.3
	    };
	    var values = Object.values(_.omit(searchableItems, Object.keys(blockedUsers$1())));
	    searchIndex = new Fuse(values, options);
	    local$1().get('searchIndexUpdated').put(true);
	  }, 2000, {
	    leading: true
	  }),
	  saveSearchResult: /*#__PURE__*/_.throttle(function (k) {
	    local$1().get('contacts').get(k).put({
	      followDistance: searchableItems[k].followDistance,
	      followerCount: searchableItems[k].followers.size
	    });
	  }, 1000, {
	    leading: true
	  }),
	  addFollow: function addFollow(callback, k, followDistance, follower) {
	    if (searchableItems[k]) {
	      var _searchableItems$k$fo;
	      if (searchableItems[k].followDistance > followDistance) {
	        searchableItems[k].followDistance = followDistance;
	      }
	      follower && ((_searchableItems$k$fo = searchableItems[k].followers) == null ? void 0 : _searchableItems$k$fo.add(follower));
	    } else {
	      searchableItems[k] = {
	        key: k,
	        followDistance: followDistance,
	        followers: new Set(follower && [follower])
	      };
	      this.taskQueue.push(function () {
	        publicState(k).get('profile').get('name').on(function (name) {
	          searchableItems[k].name = name;
	          local$1().get('contacts').get(k).get('name').put(name);
	          callback && callback(k, searchableItems[k]);
	        });
	      });
	    }
	    this.saveSearchResult(k);
	    callback && callback(k, searchableItems[k]);
	    this.updateSearchIndex();
	    this.updateNoFollows();
	    this.updateNoFollowers();
	  },
	  addToSearchIndex: function addToSearchIndex(key, item) {
	    searchableItems[key] = item;
	    this.updateSearchIndex();
	  },
	  removeFollow: function removeFollow(k, followDistance, follower) {
	    if (followDistance === 1) {
	      local$1().get('contacts').get(k).put(false);
	      local$1().get('groups').get('follows').get(k).put(false);
	      if (searchableItems[k]) {
	        searchableItems[k].followers["delete"](follower);
	        this.updateNoFollows();
	        this.updateNoFollowers();
	      }
	    }
	    //console.log('removeFollow', k, followDistance, follower);
	    if (searchableItems[k] && searchableItems[k].followers.size === 0) {
	      delete searchableItems[k];
	      local$1().get('contacts').get(k).put(false);
	      local$1().get('groups').get('everyone').get(k).put(false);
	    }
	  },
	  getExtendedFollows: function getExtendedFollows(callback, k, maxDepth, currentDepth) {
	    var _this2 = this;
	    if (k === void 0) {
	      k = key.pub;
	    }
	    if (maxDepth === void 0) {
	      maxDepth = 3;
	    }
	    if (currentDepth === void 0) {
	      currentDepth = 1;
	    }
	    var called = getExtendedFollowsCalled.get(k);
	    if (called && called <= currentDepth) {
	      return;
	    }
	    getExtendedFollowsCalled.set(k, currentDepth);
	    this.addFollow(callback, k, currentDepth - 1);
	    publicState(k).get('follow').map().on(function (isFollowing, followedKey) {
	      if (isFollowing) {
	        _this2.addFollow(callback, followedKey, currentDepth, k);
	        if (currentDepth < maxDepth) {
	          _this2.taskQueue.push(function () {
	            return _this2.getExtendedFollows(callback, followedKey, maxDepth, currentDepth + 1);
	          });
	        }
	      } else {
	        _this2.removeFollow(followedKey, currentDepth, k);
	      }
	    });
	    return searchableItems;
	  },
	  updateNoFollows: /*#__PURE__*/_.throttle(function () {
	    var v = Object.keys(searchableItems).length <= 1;
	    if (v !== noFollows) {
	      noFollows = v;
	      local$1().get('noFollows').put(noFollows);
	    }
	  }, 1000, {
	    leading: true
	  }),
	  updateNoFollowers: /*#__PURE__*/_.throttle(function () {
	    var v = !(searchableItems[key.pub] && searchableItems[key.pub].followers.size > 0);
	    if (v !== noFollowers) {
	      noFollowers = v;
	      local$1().get('noFollowers').put(noFollowers);
	    }
	  }, 1000, {
	    leading: true
	  }),
	  getSearchIndex: function getSearchIndex() {
	    return searchIndex;
	  },
	  setOurOnlineStatus: function setOurOnlineStatus() {
	    var activeRoute = window.location.hash;
	    Channel.setActivity(ourActivity = 'active');
	    var setActive = _.debounce(function () {
	      var chatId = activeRoute && activeRoute.replace('#/profile/', '').replace('#/chat/', '');
	      var chat = privateState(chatId);
	      if (chat && !ourActivity) {
	        chat.setMyMsgsLastSeenTime();
	      }
	      Channel.setActivity(ourActivity = 'active');
	      clearTimeout(onlineTimeout);
	      onlineTimeout = setTimeout(function () {
	        return Channel.setActivity(ourActivity = 'online');
	      }, 30000);
	    }, 1000);
	    document.addEventListener("touchmove", setActive);
	    document.addEventListener("mousemove", setActive);
	    document.addEventListener("keypress", setActive);
	    document.addEventListener("visibilitychange", function () {
	      if (document.visibilityState === 'visible') {
	        Channel.setActivity(ourActivity = 'active');
	        var chatId = location.pathname.slice(1).replace('chat/', '');
	        var chat = activeRoute && privateState(chatId);
	        if (chat) {
	          chat.setMyMsgsLastSeenTime();
	          notifications.changeChatUnseenCount(chatId, 0);
	        }
	      } else {
	        Channel.setActivity(ourActivity = 'online');
	      }
	    });
	    setActive();
	    window.addEventListener("beforeunload", function () {
	      Channel.setActivity(ourActivity = null);
	    });
	  },
	  updateGroups: function updateGroups() {
	    var _this3 = this;
	    this.getExtendedFollows(function (k, info) {
	      if (info.followDistance <= 1) {
	        local$1().get('groups').get('follows').get(k).put(true);
	      }
	      local$1().get('groups').get('everyone').get(k).put(true);
	      if (k === _this3.getPubKey()) {
	        _this3.updateNoFollowers();
	      }
	    });
	  },
	  /**
	   * Log in with a private key.
	   * @param key
	   */login: function login(k, opts) {
	    var _this4 = this;
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var shouldRefresh, sig, proof;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              if (opts === void 0) {
	                opts = {};
	              }
	              shouldRefresh = !!key;
	              _context.next = 4;
	              return Key.addSecp256k1KeyPair(k);
	            case 4:
	              key = _context.sent;
	              localStorage.setItem('iris.myKey', JSON.stringify(key));
	              publicState().auth(key);
	              publicState().put({
	                epub: key.epub
	              });
	              publicState().get('likes').put({
	                a: null
	              }); // gun bug?
	              publicState().get('msgs').put({
	                a: null
	              }); // gun bug?
	              publicState().get('replies').put({
	                a: null
	              }); // gun bug?
	              if (!key.secp256k1.priv) {
	                _context.next = 17;
	                break;
	              }
	              _context.next = 14;
	              return Key.schnorrSign(key.pub, key.secp256k1.priv);
	            case 14:
	              sig = _context.sent;
	              proof = JSON.stringify({
	                pub: key.pub,
	                rpub: key.secp256k1.rpub,
	                sig: sig
	              });
	              publicState().get('profile').get('nostr').put(proof);
	            case 17:
	              notifications.subscribeToWebPush();
	              notifications.getWebPushSubscriptions();
	              notifications.subscribeToIrisNotifications();
	              if (opts.initChannels) {
	                Channel.getMyChatLinks(undefined, function (chatLink) {
	                  local$1().get('chatLinks').get(chatLink.id).put(chatLink.url);
	                  latestChatLink = chatLink.url;
	                });
	                Channel.getChannels(function (c) {
	                  return _this4.addChannel(c);
	                });
	              }
	              publicState().get('profile').get('name').on(function (name) {
	                if (name && typeof name === 'string') {
	                  myName = name;
	                }
	              });
	              _this4.setOurOnlineStatus();
	              notifications.init();
	              local$1().get('loggedIn').put(true);
	              local$1().get('settings').once().then(function (settings) {
	                if (!settings) {
	                  local$1().get('settings').put(DEFAULT_SETTINGS.local);
	                } else if (settings.enableWebtorrent === undefined || settings.autoplayWebtorrent === undefined) {
	                  local$1().get('settings').get('enableWebtorrent').put(DEFAULT_SETTINGS.local.enableWebtorrent);
	                  local$1().get('settings').get('autoplayWebtorrent').put(DEFAULT_SETTINGS.local.autoplayWebtorrent);
	                }
	              });
	              publicState().get('block').map().on(function (isBlocked, user) {
	                local$1().get('block').get(user).put(isBlocked);
	                if (isBlocked) {
	                  delete searchableItems[user];
	                }
	              });
	              _this4.updateGroups();
	              if (shouldRefresh) {
	                location.reload();
	              }
	              if (electron) {
	                electron.get('settings').on(function (electron) {
	                  local$1().get('settings').get('electron').put(electron);
	                });
	                electron.get('user').put(key.pub);
	              }
	              local$1().get('filters').get('group').once().then(function (v) {
	                if (!v) {
	                  local$1().get('filters').get('group').put('follows');
	                }
	              });
	            case 31:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }))();
	  },
	  /**
	   * Create a new user account and log in.
	   * @param options {Object} - Options for the new account.
	   * @returns {Promise<*>}
	   */loginAsNewUser: function loginAsNewUser(options) {
	    var _this5 = this;
	    if (options === void 0) {
	      options = {};
	    }
	    var name = options.name || util.generateName();
	    console.log('loginAsNewUser name', name);
	    return gun$1.SEA.pair().then( /*#__PURE__*/function () {
	      var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(k) {
	        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	          while (1) {
	            switch (_context2.prev = _context2.next) {
	              case 0:
	                _context2.next = 2;
	                return _this5.login(k, options);
	              case 2:
	                publicState().get('profile').put({
	                  a: null
	                });
	                publicState().get('profile').get('name').put(name);
	                local$1().get('filters').put({
	                  a: null
	                });
	                local$1().get('filters').get('group').put('follows');
	                Channel.createChatLink().then(function (l) {
	                  return latestChatLink = l;
	                });
	                setTimeout(function () {
	                  if (options.autofollow !== false) {
	                    console.log('autofollowing', DEFAULT_FOLLOW);
	                    publicState().get('follow').get(DEFAULT_FOLLOW).put(true);
	                  }
	                }, 1000); // maybe wait for login return instead
	              case 8:
	              case "end":
	                return _context2.stop();
	            }
	          }
	        }, _callee2);
	      }));
	      return function (_x) {
	        return _ref.apply(this, arguments);
	      };
	    }());
	  },
	  /**
	   * Log out the current user.
	   * @returns {Promise<void>}
	   */logOut: function logOut() {
	    var _this6 = this;
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
	      var reg, _reg$active, sub, hash;
	      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              if (electron) {
	                electron.get('user').put(null);
	              }
	              // TODO: remove subscription from your channels
	              if (!navigator.serviceWorker) {
	                _context3.next = 16;
	                break;
	              }
	              _context3.next = 4;
	              return navigator.serviceWorker.getRegistration();
	            case 4:
	              reg = _context3.sent;
	              if (!(reg && reg.pushManager)) {
	                _context3.next = 16;
	                break;
	              }
	              (_reg$active = reg.active) == null ? void 0 : _reg$active.postMessage({
	                key: null
	              });
	              _context3.next = 9;
	              return reg.pushManager.getSubscription();
	            case 9:
	              sub = _context3.sent;
	              if (!sub) {
	                _context3.next = 16;
	                break;
	              }
	              _context3.next = 13;
	              return util.getHash(JSON.stringify(sub));
	            case 13:
	              hash = _context3.sent;
	              notifications.removeSubscription(hash);
	              sub.unsubscribe && sub.unsubscribe();
	            case 16:
	              _this6.clearIndexedDB();
	              localStorage.clear(); // TODO clear only iris data
	              localforage.clear().then(function () {
	                window.location.hash = '';
	                window.location.href = '/';
	                location.reload();
	              });
	            case 19:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    }))();
	  },
	  clearIndexedDB: function clearIndexedDB() {
	    return new Promise(function (resolve) {
	      var r1 = window.indexedDB.deleteDatabase('local()');
	      var r2 = window.indexedDB.deleteDatabase('radata');
	      var r1done = false;
	      var r2done = false;
	      var check = function check() {
	        r1done && r2done && resolve(undefined);
	      };
	      r1.onerror = r2.onerror = function (e) {
	        return console.error(e);
	      };
	      //r1.onblocked = r2.onblocked = e => console.error('blocked', e);
	      r1.onsuccess = function () {
	        r1done = true;
	        check();
	      };
	      r2.onsuccess = function () {
	        r2done = true;
	        check();
	      };
	    });
	  },
	  getMyChatLink: function getMyChatLink() {
	    return latestChatLink || util.getProfileLink(key.pub);
	  },
	  /**
	   * Get the keypair of the logged in user.
	   * @returns {*}
	   */getKey: function getKey() {
	    return key;
	  },
	  /**
	   * Get the public key of the logged in user.
	   * @returns {*}
	   */getPubKey: function getPubKey() {
	    return key && key.pub;
	  },
	  /**
	   * Get the name of the logged in user.
	   * @returns {*}
	   */getMyName: function getMyName() {
	    return myName;
	  },
	  myPeerUrl: function myPeerUrl(ip) {
	    return "http://" + ip + ":8767/gun";
	  },
	  shareMyPeerUrl: function shareMyPeerUrl(channel) {
	    var _this7 = this;
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
	      var myIp;
	      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              _context4.next = 2;
	              return local$1().get('settings').get('electron').get('publicIp').once();
	            case 2:
	              myIp = _context4.sent;
	              myIp && channel.put && channel.put('my_peer', _this7.myPeerUrl(myIp));
	            case 4:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4);
	    }))();
	  },
	  newChannel: function newChannel(pub, chatLink) {
	    if (!pub || this.channelIds.has(pub)) {
	      return;
	    }
	    var chat = privateState(pub, chatLink);
	    this.addChannel(chat);
	    return chat;
	  },
	  addChannel: function addChannel(chat) {
	    var _this8 = this;
	    this.taskQueue.push(function () {
	      var pub = chat.getId();
	      if (_this8.channelIds.has(pub)) {
	        return;
	      }
	      _this8.channelIds.add(pub);
	      var chatNode = local$1().get('channels').get(pub);
	      chatNode.get('latestTime').on(function (t) {
	        if (t && (!chat.latestTime || t > chat.latestTime)) {
	          chat.latestTime = t;
	        }
	      });
	      chatNode.get('theirMsgsLastSeenTime').on(function (t) {
	        if (!t) {
	          return;
	        }
	        var d = new Date(t);
	        if (!chat.theirMsgsLastSeenDate || chat.theirMsgsLastSeenDate < d) {
	          chat.theirMsgsLastSeenDate = d;
	        }
	      });
	      chat.getLatestMsg && chat.getLatestMsg(function (latest, info) {
	        _this8.processMessage(pub, latest, info);
	      });
	      notifications.changeChatUnseenCount(pub, 0);
	      chat.notificationSetting = 'all';
	      chat.onMy('notificationSetting', function (val) {
	        chat.notificationSetting = val;
	      });
	      //$(".chat-list").append(el);
	      chat.theirMsgsLastSeenTime = '';
	      chat.getTheirMsgsLastSeenTime(function (time) {
	        if (chat && time && time >= chat.theirMsgsLastSeenTime) {
	          chat.theirMsgsLastSeenTime = time;
	          chatNode.get('theirMsgsLastSeenTime').put(time);
	        }
	      });
	      chat.getMyMsgsLastSeenTime(function (time) {
	        chat.myLastSeenTime = new Date(time);
	        if (chat.latest && chat.myLastSeenTime >= chat.latest.time) {
	          notifications.changeChatUnseenCount(pub, 0);
	        }
	      });
	      chat.isTyping = false;
	      chat.getTyping(function (isTyping) {
	        chat.isTyping = isTyping;
	        local$1().get('channels').get(pub).get('isTyping').put(isTyping);
	      });
	      chat.online = {};
	      Channel.getActivity(pub, function (activity) {
	        if (chat) {
	          chatNode.put({
	            theirLastActiveTime: activity && activity.lastActive,
	            activity: activity && activity.isActive && activity.status
	          });
	          chat.activity = activity;
	        }
	      });
	      if (chat.uuid) {
	        var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	        chat.participantProfiles = {};
	        chat.on('name', function (v) {
	          chat.name = v;
	          searchableItems[chat.uuid] = {
	            name: v,
	            uuid: chat.uuid
	          };
	          local$1().get('channels').get(chat.uuid).get('name').put(v);
	        });
	        chat.on('photo', function (v) {
	          searchableItems[chat.uuid] = searchableItems[chat.uuid] || {};
	          searchableItems[chat.uuid].photo = v;
	          local$1().get('channels').get(chat.uuid).get('photo').put(v);
	        });
	        chat.on('about', function (v) {
	          return local$1().get('channels').get(chat.uuid).get('about').put(v);
	        });
	        chat.getParticipants(function (participants) {
	          delete participants.undefined; // TODO fix where it comes from
	          if (typeof participants === 'object') {
	            var keys = Object.keys(participants);
	            keys.forEach(function (k, i) {
	              var hue = 360 / Math.max(keys.length, 2) * i; // TODO use css filter brightness
	              chat.participantProfiles[k] = {
	                permissions: participants[k],
	                color: "hsl(" + hue + ", 98%, " + (isDarkMode ? 80 : 33) + "%)"
	              };
	              publicState(k).get('profile').get('name').on(function (name) {
	                chat.participantProfiles[k].name = name;
	              });
	            });
	          }
	          local$1().get('channels').get(chat.uuid).get('participants').put(participants);
	        });
	        chat.inviteLinks = {};
	        chat.getChatLinks({
	          callback: function callback(_ref2) {
	            var url = _ref2.url,
	              id = _ref2.id;
	            console.log('got chat link', id, url);
	            chat.inviteLinks[id] = url; // TODO use State
	            local$1().get('inviteLinksChanged').put(true);
	          }
	        });
	      } else {
	        // TODO do we want this?
	        publicState(pub).get('profile').get('name').on(function (v) {
	          return local$1().get('channels').get(pub).get('name').put(v);
	        });
	      }
	      if (chat.put) {
	        chat.onTheir('webPushSubscriptions', function (s, k, from) {
	          if (!Array.isArray(s)) {
	            return;
	          }
	          chat.webPushSubscriptions = chat.webPushSubscriptions || {};
	          chat.webPushSubscriptions[from || pub] = s;
	        });
	        var arr = Object.values(notifications.webPushSubscriptions);
	        setTimeout(function () {
	          return chat.put('webPushSubscriptions', arr);
	        }, 5000);
	        _this8.shareMyPeerUrl(chat);
	      }
	      chat.onTheir('call', function (call) {
	        local$1().get('call').put({
	          pub: pub,
	          call: call
	        });
	      });
	      local$1().get('channels').get(pub).put({
	        enabled: true
	      });
	      /* Disable private peer discovery, since they're not connecting anyway
	      if (chat.onTheir) {
	        chat.onTheir('my_peer', (url, k, from) => {
	          console.log('Got private peer url', url, 'from', from);
	          peers.addPeer({url, from})
	        });
	      }
	       */
	    });
	  },
	  // TODO: should perhaps be in Channel
	  processMessage: function processMessage(chatId, msg, info, onClickNotification) {
	    var chat = privateState(chatId);
	    chat.messageIds = chat.messageIds || {};
	    if (chat.messageIds[msg.time + info.from]) return;
	    chat.messageIds[msg.time + info.from] = true;
	    if (info) {
	      msg = Object.assign(msg, info);
	    }
	    if (msg.invite) {
	      var chatLink = "https://iris.to/?channelId=" + msg.invite.group + "&inviter=" + chatId;
	      this.newChannel(msg.invite.group, chatLink);
	      return;
	    }
	    msg.selfAuthored = info.selfAuthored;
	    local$1().get('channels').get(chatId).get('msgs').get(msg.time + (msg.from && msg.from.slice(0, 10))).put(JSON.stringify(msg));
	    msg.timeObj = new Date(msg.time);
	    if (!info.selfAuthored && msg.timeObj > chat.myLastSeenTime) {
	      if (window.location.hash !== "#/chat/" + chatId || document.visibilityState !== 'visible') {
	        notifications.changeChatUnseenCount(chatId, 1);
	      } else if (ourActivity === 'active') {
	        chat.setMyMsgsLastSeenTime();
	      }
	    }
	    if (!info.selfAuthored && msg.time > chat.theirMsgsLastSeenTime) {
	      local$1().get('channels').get(chatId).get('theirMsgsLastSeenTime').put(msg.time);
	    }
	    if (!chat.latestTime || msg.time > chat.latestTime) {
	      local$1().get('channels').get(chatId).put({
	        latestTime: msg.time,
	        latest: {
	          time: msg.time,
	          text: msg.text,
	          selfAuthored: info.selfAuthored
	        }
	      });
	    }
	    // TODO: onclickNotification should do       route(`/chat/${  pub}`);
	    notifications.notifyMsg(msg, info, chatId, onClickNotification);
	  },
	  subscribeToMsgs: function subscribeToMsgs(pub) {
	    var _this9 = this;
	    var c = privateState(pub);
	    if (c.subscribed) {
	      return;
	    }
	    c.subscribed = true;
	    c.getMessages(function (msg, info) {
	      _this9.processMessage(pub, msg, info);
	    });
	  },
	  /**
	   * Known private channels with other users
	   */
	  channelIds: /*#__PURE__*/new Set()
	};

	/**
	 * Content-addressed storage
	 */
	var staticState = {
	  /**
	   * Get a file identified by its hash
	   * @param hash
	   * @param callback
	   * @returns {Promise<unknown>}
	   */get: function get(hash, callback) {
	    return new Promise(function (resolve, reject) {
	      if (!hash) {
	        reject('No hash provided');
	      }
	      if (typeof hash !== 'string') {
	        reject('Hash must be a string');
	      }
	      global$2().get('#').get(hash).on(function (v, _k, _x, e) {
	        if (v) {
	          e.off();
	          callback && callback(v);
	          resolve(v);
	        }
	      });
	    });
	  },
	  /**
	   * Store a file and return its hash
	   * @param value
	   * @returns {Promise<string>}
	   */put: function put(value) {
	    return _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var hash;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              _context.next = 2;
	              return util.getHash(value);
	            case 2:
	              hash = _context.sent;
	              global$2().get('#').get(hash).put(value);
	              return _context.abrupt("return", hash);
	            case 5:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }))();
	  }
	};

	var errorMsg = "Invalid  message:";
	var ValidationError = /*#__PURE__*/function (_Error) {
	  _inheritsLoose(ValidationError, _Error);
	  function ValidationError() {
	    return _Error.apply(this, arguments) || this;
	  }
	  return ValidationError;
	}( /*#__PURE__*/_wrapNativeSuper(Error)); /**
	                                          * Signed message object. Your friends can index and relay your messages, while others can still verify that they were signed by you.
	                                          *
	                                          * Fields: signedData, signer (public key) and signature.
	                                          *
	                                          * signedData has an author, signer, type, time and optionally other fields.
	                                          *
	                                          * signature covers the utf8 string representation of signedData. Since messages are digitally signed, users only need to care about the message signer and not who relayed it or whose index it was found from.
	                                          *
	                                          * signer is the entity that verified its origin. In other words: message author and signer can be different entities, and only the signer needs to use Iris.
	                                          *
	                                          * For example, a crawler can import and sign other people's messages from Twitter. Only the users who trust the crawler will see the messages.
	                                          *
	                                          * Constructor: creates a message from the param obj.signedData that must contain at least the mandatory fields: author, type and time.
	                                          * @param obj
	                                          *
	                                          * @example
	                                          * https://github.com/irislib/iris-lib/blob/master/__tests__/SignedMessage.js
	                                          *
	                                          * Verification message:
	                                          * {
	                                          *   signedData: {
	                                          *     author: {name:'Alice', key:'ABCD1234'},
	                                          *     recipient: {
	                                          *       name: 'Bob',
	                                          *       email: ['bob@example.com', 'bob.saget@example.com'],
	                                          *       bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
	                                          *     },
	                                          *     type: 'verification'
	                                          *   },
	                                          *   signer: 'ABCD1234',
	                                          *   signature: '1234ABCD'
	                                          * }
	                                          */
	var SignedMessage = /*#__PURE__*/function () {
	  function SignedMessage(obj) {
	    this.signedData = obj.signedData;
	    this.pubKey = obj.pubKey;
	    if (obj.sig) {
	      if (typeof obj.sig !== "string") {
	        throw new ValidationError("SignedMessage signature must be a string");
	      }
	      this.sig = obj.sig;
	      this.getHash();
	    }
	    this._validate();
	  }
	  SignedMessage._getArray = function _getArray(authorOrRecipient) {
	    var arr = [];
	    var keys = Object.keys(authorOrRecipient);
	    for (var i = 0; i < keys.length; i++) {
	      var type = keys[i];
	      var value = authorOrRecipient[keys[i]];
	      if (typeof value === "string") {
	        arr.push(new Attribute(type, value));
	      } else {
	        // array
	        for (var j = 0; j < value.length; j++) {
	          var elementValue = value[j];
	          arr.push(new Attribute(type, elementValue));
	        }
	      }
	    }
	    return arr;
	  };
	  SignedMessage._getIterable = function _getIterable(authorOrRecipient) {
	    var _ref;
	    return _ref = {}, _ref[Symbol.iterator] = /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
	      var keys, i, type, value, j, elementValue;
	      return _regeneratorRuntime().wrap(function _callee$(_context) {
	        while (1) {
	          switch (_context.prev = _context.next) {
	            case 0:
	              keys = Object.keys(authorOrRecipient);
	              i = 0;
	            case 2:
	              if (!(i < keys.length)) {
	                _context.next = 21;
	                break;
	              }
	              type = keys[i];
	              value = authorOrRecipient[keys[i]];
	              if (!(typeof value === "string")) {
	                _context.next = 10;
	                break;
	              }
	              _context.next = 8;
	              return new Attribute(type, value);
	            case 8:
	              _context.next = 18;
	              break;
	            case 10:
	              j = 0;
	            case 11:
	              if (!(j < value.length)) {
	                _context.next = 18;
	                break;
	              }
	              elementValue = value[j];
	              _context.next = 15;
	              return new Attribute(type, elementValue);
	            case 15:
	              j++;
	              _context.next = 11;
	              break;
	            case 18:
	              i++;
	              _context.next = 2;
	              break;
	            case 21:
	            case "end":
	              return _context.stop();
	          }
	        }
	      }, _callee);
	    }), _ref;
	  };
	  var _proto = SignedMessage.prototype;
	  _proto.getAuthorIterable = function getAuthorIterable() {
	    return SignedMessage._getIterable(this.signedData.author);
	  };
	  _proto.getRecipientIterable = function getRecipientIterable() {
	    return SignedMessage._getIterable(this.signedData.recipient);
	  };
	  _proto.getAuthorArray = function getAuthorArray() {
	    return SignedMessage._getArray(this.signedData.author);
	  };
	  _proto.getRecipientArray = function getRecipientArray() {
	    return this.signedData.recipient ? SignedMessage._getArray(this.signedData.recipient) : [];
	  };
	  _proto.getSignerKeyID = function getSignerKeyID() {
	    return this.pubKey; // hack until gun supports keyID lookups
	    //return util.getHash(this.pubKey);
	  };
	  _proto._validate = function _validate() {
	    if (!this.signedData) {
	      throw new ValidationError(errorMsg + " Missing signedData");
	    }
	    if (typeof this.signedData !== "object") {
	      throw new ValidationError(errorMsg + " signedData must be an object");
	    }
	    var d = this.signedData;
	    if (!d.type) {
	      throw new ValidationError(errorMsg + " Missing type definition");
	    }
	    if (!d.author) {
	      throw new ValidationError(errorMsg + " Missing author");
	    }
	    if (typeof d.author !== "object") {
	      throw new ValidationError(errorMsg + " Author must be object");
	    }
	    if (Array.isArray(d.author)) {
	      throw new ValidationError(errorMsg + " Author must not be an array");
	    }
	    if (Object.keys(d.author).length === 0) {
	      throw new ValidationError(errorMsg + " Author empty");
	    }
	    if (this.pubKey) {
	      this.signerKeyHash = this.getSignerKeyID();
	    }
	    for (var attr in d.author) {
	      var t = typeof d.author[attr];
	      if (t !== "string") {
	        if (Array.isArray(d.author[attr])) {
	          for (var i = 0; i < d.author[attr].length; i++) {
	            if (typeof d.author[attr][i] !== "string") {
	              throw new ValidationError(errorMsg + " Author attribute must be string, got " + attr + ": [" + d.author[attr][i] + "]");
	            }
	            if (d.author[attr][i].length === 0) {
	              throw new ValidationError(errorMsg + " author " + attr + " in array[" + i + "] is empty");
	            }
	          }
	        } else {
	          throw new ValidationError(errorMsg + " Author attribute must be string or array, got " + attr + ": " + d.author[attr]);
	        }
	      }
	      if (attr === "keyID") {
	        if (t !== "string") {
	          throw new ValidationError(errorMsg + " Author keyID must be string, got " + t);
	        }
	        if (this.signerKeyHash && d.author[attr] !== this.signerKeyHash) {
	          throw new ValidationError(errorMsg + " If message has a keyID author, it must be signed by the same key");
	        }
	      }
	    }
	    if (d.recipient) {
	      if (typeof d.recipient !== "object") {
	        throw new ValidationError(errorMsg + " Recipient must be object");
	      }
	      if (Array.isArray(d.recipient)) {
	        throw new ValidationError(errorMsg + " Recipient must not be an array");
	      }
	      if (Object.keys(d.recipient).length === 0) {
	        throw new ValidationError(errorMsg + " Recipient empty");
	      }
	      for (var _attr in d.recipient) {
	        var _t = typeof d.recipient[_attr];
	        if (_t !== "string") {
	          if (Array.isArray(d.recipient[_attr])) {
	            for (var _i = 0; _i < d.recipient[_attr].length; _i++) {
	              if (typeof d.recipient[_attr][_i] !== "string") {
	                throw new ValidationError(errorMsg + " Recipient attribute must be string, got " + _attr + ": [" + d.recipient[_attr][_i] + "]");
	              }
	              if (d.recipient[_attr][_i].length === 0) {
	                throw new ValidationError(errorMsg + " recipient " + _attr + " in array[" + _i + "] is empty");
	              }
	            }
	          } else {
	            throw new ValidationError(errorMsg + " Recipient attribute must be string or array, got " + _attr + ": " + d.recipient[_attr]);
	          }
	        }
	      }
	    }
	    if (!(d.time || d.timestamp)) {
	      throw new ValidationError(errorMsg + " Missing time field");
	    }
	    if (!Date.parse(d.time || d.timestamp)) {
	      throw new ValidationError(errorMsg + " Invalid time field");
	    }
	    if (d.type === "rating") {
	      if (isNaN(d.rating)) {
	        throw new ValidationError(errorMsg + " Invalid rating");
	      }
	      if (isNaN(d.maxRating)) {
	        throw new ValidationError(errorMsg + " Invalid maxRating");
	      }
	      if (isNaN(d.minRating)) {
	        throw new ValidationError(errorMsg + " Invalid minRating");
	      }
	      if (d.rating > d.maxRating) {
	        throw new ValidationError(errorMsg + " Rating is above maxRating");
	      }
	      if (d.rating < d.minRating) {
	        throw new ValidationError(errorMsg + " Rating is below minRating");
	      }
	      if (typeof d.context !== "string" || !d.context.length) {
	        throw new ValidationError(errorMsg + " Rating messages must have a context field");
	      }
	    }
	    if (d.type === "verification" || d.type === "unverification") {
	      if (d.recipient.length < 2) {
	        throw new ValidationError(errorMsg + " At least 2 recipient attributes are needed for a connection / disconnection. Got: " + d.recipient);
	      }
	    }
	    return true;
	  };
	  _proto.isPositive = function isPositive() {
	    return this.signedData.type === "rating" && this.signedData.rating > (this.signedData.maxRating + this.signedData.minRating) / 2;
	  };
	  _proto.isNegative = function isNegative() {
	    return this.signedData.type === "rating" && this.signedData.rating < (this.signedData.maxRating + this.signedData.minRating) / 2;
	  };
	  _proto.isNeutral = function isNeutral() {
	    return this.signedData.type === "rating" && this.signedData.rating === (this.signedData.maxRating + this.signedData.minRating) / 2;
	  }
	  /**
	  * @param {Object} key Gun.SEA keypair to sign the message with
	  */;
	  _proto.sign =
	  /*#__PURE__*/
	  function () {
	    var _sign = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(key) {
	      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
	        while (1) {
	          switch (_context2.prev = _context2.next) {
	            case 0:
	              _context2.next = 2;
	              return Key.sign(this.signedData, key);
	            case 2:
	              this.sig = _context2.sent;
	              this.pubKey = key.pub;
	              _context2.next = 6;
	              return this.getHash();
	            case 6:
	              return _context2.abrupt("return", true);
	            case 7:
	            case "end":
	              return _context2.stop();
	          }
	        }
	      }, _callee2, this);
	    }));
	    function sign(_x) {
	      return _sign.apply(this, arguments);
	    }
	    return sign;
	  }() /**
	      * Create an iris message. SignedMessage time is automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
	      * @param {Object} signedData message data object including author, recipient and other possible attributes
	      * @param {Object} signingKey optionally, you can set the key to sign the message with
	      * @returns {Promise<SignedMessage>}  message
	      */;
	  SignedMessage.create =
	  /*#__PURE__*/
	  function () {
	    var _create = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(signedData, signingKey) {
	      var m;
	      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
	        while (1) {
	          switch (_context3.prev = _context3.next) {
	            case 0:
	              if (!signedData.author && signingKey) {
	                signedData.author = {
	                  keyID: Key.getId(signingKey)
	                };
	              }
	              signedData.time = signedData.time || new Date().toISOString();
	              m = new SignedMessage({
	                signedData: signedData
	              });
	              if (!signingKey) {
	                _context3.next = 6;
	                break;
	              }
	              _context3.next = 6;
	              return m.sign(signingKey);
	            case 6:
	              return _context3.abrupt("return", m);
	            case 7:
	            case "end":
	              return _context3.stop();
	          }
	        }
	      }, _callee3);
	    }));
	    function create(_x2, _x3) {
	      return _create.apply(this, arguments);
	    }
	    return create;
	  }();
	  SignedMessage.createVerification = function createVerification(signedData, signingKey) {
	    signedData.type = "verification";
	    return SignedMessage.create(signedData, signingKey);
	  };
	  SignedMessage.createRating = function createRating(signedData, signingKey) {
	    signedData.type = "rating";
	    signedData.context = signedData.context || "iris";
	    signedData.maxRating = signedData.maxRating || 10;
	    signedData.minRating = signedData.minRating || -10;
	    return SignedMessage.create(signedData, signingKey);
	  };
	  _proto.getAuthor = function getAuthor(index) {
	    for (var _iterator = _createForOfIteratorHelperLoose(this.getAuthorIterable()), _step; !(_step = _iterator()).done;) {
	      var a = _step.value;
	      if (a.isUniqueType()) {
	        return index.getContacts(a);
	      }
	    }
	  };
	  _proto.getRecipient = function getRecipient(index) {
	    if (!this.signedData.recipient) {
	      return undefined;
	    }
	    for (var _iterator2 = _createForOfIteratorHelperLoose(this.getRecipientIterable()), _step2; !(_step2 = _iterator2()).done;) {
	      var a = _step2.value;
	      if (a.isUniqueType()) {
	        return index.getContacts(a);
	      }
	    }
	  }
	  /**
	  * @returns {string} base64 sha256 hash of message
	  */;
	  _proto.getHash =
	  /*#__PURE__*/
	  function () {
	    var _getHash = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
	      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
	        while (1) {
	          switch (_context4.prev = _context4.next) {
	            case 0:
	              if (!(this.sig && !this.hash)) {
	                _context4.next = 4;
	                break;
	              }
	              _context4.next = 3;
	              return util.getHash(this.sig);
	            case 3:
	              this.hash = _context4.sent;
	            case 4:
	              return _context4.abrupt("return", this.hash);
	            case 5:
	            case "end":
	              return _context4.stop();
	          }
	        }
	      }, _callee4, this);
	    }));
	    function getHash() {
	      return _getHash.apply(this, arguments);
	    }
	    return getHash;
	  }();
	  _proto.getId = function getId() {
	    return this.getHash();
	  };
	  SignedMessage.fromSig = /*#__PURE__*/function () {
	    var _fromSig = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(obj) {
	      var signedData, o;
	      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
	        while (1) {
	          switch (_context5.prev = _context5.next) {
	            case 0:
	              if (obj.sig) {
	                _context5.next = 2;
	                break;
	              }
	              throw new Error("Missing signature in object:", obj);
	            case 2:
	              if (obj.pubKey) {
	                _context5.next = 4;
	                break;
	              }
	              throw new Error("Missing pubKey in object:");
	            case 4:
	              //const signedData = await Key.verify(obj.sig, obj.pubKey); // disable sig verification while migrating to new gun :(
	              signedData = JSON.parse(obj.sig.slice(4)).m;
	              o = {
	                signedData: signedData,
	                sig: obj.sig,
	                pubKey: obj.pubKey
	              };
	              return _context5.abrupt("return", new SignedMessage(o));
	            case 7:
	            case "end":
	              return _context5.stop();
	          }
	        }
	      }, _callee5);
	    }));
	    function fromSig(_x4) {
	      return _fromSig.apply(this, arguments);
	    }
	    return fromSig;
	  }() /**
	      * @return {boolean} true if message signature is valid. Otherwise throws ValidationError.
	      */;
	  _proto.verify =
	  /*#__PURE__*/
	  function () {
	    var _verify = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
	      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
	        while (1) {
	          switch (_context6.prev = _context6.next) {
	            case 0:
	              if (this.pubKey) {
	                _context6.next = 2;
	                break;
	              }
	              throw new ValidationError(errorMsg + " SignedMessage has no .pubKey");
	            case 2:
	              if (this.sig) {
	                _context6.next = 4;
	                break;
	              }
	              throw new ValidationError(errorMsg + " SignedMessage has no .sig");
	            case 4:
	              _context6.next = 6;
	              return Key.verify(this.sig, this.pubKey);
	            case 6:
	              this.signedData = _context6.sent;
	              if (this.signedData) {
	                _context6.next = 9;
	                break;
	              }
	              throw new ValidationError(errorMsg + " Invalid signature");
	            case 9:
	              if (!this.hash) {
	                _context6.next = 18;
	                break;
	              }
	              _context6.t0 = this.hash;
	              _context6.next = 13;
	              return util.getHash(this.sig);
	            case 13:
	              _context6.t1 = _context6.sent;
	              if (!(_context6.t0 !== _context6.t1)) {
	                _context6.next = 16;
	                break;
	              }
	              throw new ValidationError(errorMsg + " Invalid message hash");
	            case 16:
	              _context6.next = 19;
	              break;
	            case 18:
	              this.getHash();
	            case 19:
	              return _context6.abrupt("return", true);
	            case 20:
	            case "end":
	              return _context6.stop();
	          }
	        }
	      }, _callee6, this);
	    }));
	    function verify() {
	      return _verify.apply(this, arguments);
	    }
	    return verify;
	  }() /**
	      * @returns {string}
	      */;
	  _proto.serialize = function serialize() {
	    return {
	      sig: this.sig,
	      pubKey: this.pubKey
	    };
	  };
	  _proto.toString = function toString() {
	    return JSON.stringify(this.serialize());
	  }
	  /**
	  * @returns {Promise<SignedMessage>}
	  */;
	  SignedMessage.deserialize =
	  /*#__PURE__*/
	  function () {
	    var _deserialize = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee7(s) {
	      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
	        while (1) {
	          switch (_context7.prev = _context7.next) {
	            case 0:
	              return _context7.abrupt("return", SignedMessage.fromSig(s));
	            case 1:
	            case "end":
	              return _context7.stop();
	          }
	        }
	      }, _callee7);
	    }));
	    function deserialize(_x5) {
	      return _deserialize.apply(this, arguments);
	    }
	    return deserialize;
	  }();
	  SignedMessage.fromString = /*#__PURE__*/function () {
	    var _fromString = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee8(s) {
	      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
	        while (1) {
	          switch (_context8.prev = _context8.next) {
	            case 0:
	              return _context8.abrupt("return", SignedMessage.fromSig(JSON.parse(s)));
	            case 1:
	            case "end":
	              return _context8.stop();
	          }
	        }
	      }, _callee8);
	    }));
	    function fromString(_x6) {
	      return _fromString.apply(this, arguments);
	    }
	    return fromString;
	  }();
	  SignedMessage.setReaction = /*#__PURE__*/function () {
	    var _setReaction = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee9(gun, msg, reaction) {
	      var hash;
	      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
	        while (1) {
	          switch (_context9.prev = _context9.next) {
	            case 0:
	              _context9.next = 2;
	              return msg.getHash();
	            case 2:
	              hash = _context9.sent;
	              gun.get("reactions").get(hash).put(reaction);
	              gun.get("reactions").get(hash).put(reaction);
	              gun.get("messagesByHash").get(hash).get("reactions").get(this.rootContact.value).put(reaction);
	              gun.get("messagesByHash").get(hash).get("reactions").get(this.rootContact.value).put(reaction);
	            case 7:
	            case "end":
	              return _context9.stop();
	          }
	        }
	      }, _callee9, this);
	    }));
	    function setReaction(_x7, _x8, _x9) {
	      return _setReaction.apply(this, arguments);
	    }
	    return setReaction;
	  }();
	  return SignedMessage;
	}();

	/*eslint no-useless-escape: "off", camelcase: "off" */
	var index = {
	  local: local$1,
	  global: global$2,
	  group: group,
	  "public": publicState,
	  "private": privateState,
	  "static": staticState,
	  electron: electron,
	  peers: peers,
	  session: session,
	  util: util,
	  notifications: notifications,
	  SEA: gun$1.SEA,
	  Gun: gun$1,
	  SignedMessage: SignedMessage,
	  Channel: Channel,
	  Node: Node,
	  Key: Key
	};

	exports.default = index;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=iris.umd.development.js.map
