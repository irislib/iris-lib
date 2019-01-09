(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.identifiLib = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function commonjsRequire () {
		throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
	}

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var _core = createCommonjsModule(function (module) {
	var core = module.exports = { version: '2.5.7' };
	if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
	});
	var _core_1 = _core.version;

	var $JSON = _core.JSON || (_core.JSON = { stringify: JSON.stringify });
	var stringify = function stringify(it) { // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

	var stringify$1 = createCommonjsModule(function (module) {
	module.exports = { "default": stringify, __esModule: true };
	});

	var _JSON$stringify = unwrapExports(stringify$1);

	var classCallCheck = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};
	});

	var _classCallCheck = unwrapExports(classCallCheck);

	// 7.1.4 ToInteger
	var ceil = Math.ceil;
	var floor = Math.floor;
	var _toInteger = function (it) {
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

	// 7.2.1 RequireObjectCoercible(argument)
	var _defined = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on  " + it);
	  return it;
	};

	// true  -> String#at
	// false -> String#codePointAt
	var _stringAt = function (TO_STRING) {
	  return function (that, pos) {
	    var s = String(_defined(that));
	    var i = _toInteger(pos);
	    var l = s.length;
	    var a, b;
	    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

	var _library = true;

	var _global = createCommonjsModule(function (module) {
	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self
	  // eslint-disable-next-line no-new-func
	  : Function('return this')();
	if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
	});

	var _aFunction = function (it) {
	  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
	  return it;
	};

	// optional / simple context binding

	var _ctx = function (fn, that, length) {
	  _aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var _isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	var _anObject = function (it) {
	  if (!_isObject(it)) throw TypeError(it + ' is not an object!');
	  return it;
	};

	var _fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (e) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var _descriptors = !_fails(function () {
	  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
	});

	var document$1 = _global.document;
	// typeof document.createElement is 'object' in old IE
	var is = _isObject(document$1) && _isObject(document$1.createElement);
	var _domCreate = function (it) {
	  return is ? document$1.createElement(it) : {};
	};

	var _ie8DomDefine = !_descriptors && !_fails(function () {
	  return Object.defineProperty(_domCreate('div'), 'a', { get: function () { return 7; } }).a != 7;
	});

	// 7.1.1 ToPrimitive(input [, PreferredType])

	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var _toPrimitive = function (it, S) {
	  if (!_isObject(it)) return it;
	  var fn, val;
	  if (S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (typeof (fn = it.valueOf) == 'function' && !_isObject(val = fn.call(it))) return val;
	  if (!S && typeof (fn = it.toString) == 'function' && !_isObject(val = fn.call(it))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var dP = Object.defineProperty;

	var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
	  _anObject(O);
	  P = _toPrimitive(P, true);
	  _anObject(Attributes);
	  if (_ie8DomDefine) try {
	    return dP(O, P, Attributes);
	  } catch (e) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var _objectDp = {
		f: f
	};

	var _propertyDesc = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var _hide = _descriptors ? function (object, key, value) {
	  return _objectDp.f(object, key, _propertyDesc(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var hasOwnProperty = {}.hasOwnProperty;
	var _has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var PROTOTYPE = 'prototype';

	var $export = function (type, name, source) {
	  var IS_FORCED = type & $export.F;
	  var IS_GLOBAL = type & $export.G;
	  var IS_STATIC = type & $export.S;
	  var IS_PROTO = type & $export.P;
	  var IS_BIND = type & $export.B;
	  var IS_WRAP = type & $export.W;
	  var exports = IS_GLOBAL ? _core : _core[name] || (_core[name] = {});
	  var expProto = exports[PROTOTYPE];
	  var target = IS_GLOBAL ? _global : IS_STATIC ? _global[name] : (_global[name] || {})[PROTOTYPE];
	  var key, own, out;
	  if (IS_GLOBAL) source = name;
	  for (key in source) {
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if (own && _has(exports, key)) continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? _ctx(out, _global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function (C) {
	      var F = function (a, b, c) {
	        if (this instanceof C) {
	          switch (arguments.length) {
	            case 0: return new C();
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? _ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if (IS_PROTO) {
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if (type & $export.R && expProto && !expProto[key]) _hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library`
	var _export = $export;

	var _redefine = _hide;

	var _iterators = {};

	var toString = {}.toString;

	var _cof = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	// fallback for non-array-like ES3 and non-enumerable old V8 strings

	// eslint-disable-next-line no-prototype-builtins
	var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
	  return _cof(it) == 'String' ? it.split('') : Object(it);
	};

	// to indexed object, toObject with fallback for non-array-like ES3 strings


	var _toIobject = function (it) {
	  return _iobject(_defined(it));
	};

	// 7.1.15 ToLength

	var min = Math.min;
	var _toLength = function (it) {
	  return it > 0 ? min(_toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;
	var _toAbsoluteIndex = function (index, length) {
	  index = _toInteger(index);
	  return index < 0 ? max(index + length, 0) : min$1(index, length);
	};

	// false -> Array#indexOf
	// true  -> Array#includes



	var _arrayIncludes = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = _toIobject($this);
	    var length = _toLength(O.length);
	    var index = _toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
	      if (O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var _shared = createCommonjsModule(function (module) {
	var SHARED = '__core-js_shared__';
	var store = _global[SHARED] || (_global[SHARED] = {});

	(module.exports = function (key, value) {
	  return store[key] || (store[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: _core.version,
	  mode: 'pure',
	  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var px = Math.random();
	var _uid = function (key) {
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

	var shared = _shared('keys');

	var _sharedKey = function (key) {
	  return shared[key] || (shared[key] = _uid(key));
	};

	var arrayIndexOf = _arrayIncludes(false);
	var IE_PROTO = _sharedKey('IE_PROTO');

	var _objectKeysInternal = function (object, names) {
	  var O = _toIobject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) if (key != IE_PROTO) _has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (_has(O, key = names[i++])) {
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE 8- don't enum bug keys
	var _enumBugKeys = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)



	var _objectKeys = Object.keys || function keys(O) {
	  return _objectKeysInternal(O, _enumBugKeys);
	};

	var _objectDps = _descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  _anObject(O);
	  var keys = _objectKeys(Properties);
	  var length = keys.length;
	  var i = 0;
	  var P;
	  while (length > i) _objectDp.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

	var document$2 = _global.document;
	var _html = document$2 && document$2.documentElement;

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])



	var IE_PROTO$1 = _sharedKey('IE_PROTO');
	var Empty = function () { /* empty */ };
	var PROTOTYPE$1 = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = _domCreate('iframe');
	  var i = _enumBugKeys.length;
	  var lt = '<';
	  var gt = '>';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  _html.appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while (i--) delete createDict[PROTOTYPE$1][_enumBugKeys[i]];
	  return createDict();
	};

	var _objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    Empty[PROTOTYPE$1] = _anObject(O);
	    result = new Empty();
	    Empty[PROTOTYPE$1] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : _objectDps(result, Properties);
	};

	var _wks = createCommonjsModule(function (module) {
	var store = _shared('wks');

	var Symbol = _global.Symbol;
	var USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function (name) {
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : _uid)('Symbol.' + name));
	};

	$exports.store = store;
	});

	var def = _objectDp.f;

	var TAG = _wks('toStringTag');

	var _setToStringTag = function (it, tag, stat) {
	  if (it && !_has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
	};

	var IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	_hide(IteratorPrototype, _wks('iterator'), function () { return this; });

	var _iterCreate = function (Constructor, NAME, next) {
	  Constructor.prototype = _objectCreate(IteratorPrototype, { next: _propertyDesc(1, next) });
	  _setToStringTag(Constructor, NAME + ' Iterator');
	};

	// 7.1.13 ToObject(argument)

	var _toObject = function (it) {
	  return Object(_defined(it));
	};

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)


	var IE_PROTO$2 = _sharedKey('IE_PROTO');
	var ObjectProto = Object.prototype;

	var _objectGpo = Object.getPrototypeOf || function (O) {
	  O = _toObject(O);
	  if (_has(O, IE_PROTO$2)) return O[IE_PROTO$2];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

	var ITERATOR = _wks('iterator');
	var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
	var FF_ITERATOR = '@@iterator';
	var KEYS = 'keys';
	var VALUES = 'values';

	var returnThis = function () { return this; };

	var _iterDefine = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
	  _iterCreate(Constructor, NAME, next);
	  var getMethod = function (kind) {
	    if (!BUGGY && kind in proto) return proto[kind];
	    switch (kind) {
	      case KEYS: return function keys() { return new Constructor(this, kind); };
	      case VALUES: return function values() { return new Constructor(this, kind); };
	    } return function entries() { return new Constructor(this, kind); };
	  };
	  var TAG = NAME + ' Iterator';
	  var DEF_VALUES = DEFAULT == VALUES;
	  var VALUES_BUG = false;
	  var proto = Base.prototype;
	  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
	  var $default = $native || getMethod(DEFAULT);
	  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
	  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
	  var methods, key, IteratorPrototype;
	  // Fix native
	  if ($anyNative) {
	    IteratorPrototype = _objectGpo($anyNative.call(new Base()));
	    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
	      // Set @@toStringTag to native iterators
	      _setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if (!_library && typeof IteratorPrototype[ITERATOR] != 'function') _hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEF_VALUES && $native && $native.name !== VALUES) {
	    VALUES_BUG = true;
	    $default = function values() { return $native.call(this); };
	  }
	  // Define iterator
	  if ((!_library || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
	    _hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  _iterators[NAME] = $default;
	  _iterators[TAG] = returnThis;
	  if (DEFAULT) {
	    methods = {
	      values: DEF_VALUES ? $default : getMethod(VALUES),
	      keys: IS_SET ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if (FORCED) for (key in methods) {
	      if (!(key in proto)) _redefine(proto, key, methods[key]);
	    } else _export(_export.P + _export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

	var $at = _stringAt(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	_iterDefine(String, 'String', function (iterated) {
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var index = this._i;
	  var point;
	  if (index >= O.length) return { value: undefined, done: true };
	  point = $at(O, index);
	  this._i += point.length;
	  return { value: point, done: false };
	});

	var _iterStep = function (done, value) {
	  return { value: value, done: !!done };
	};

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	var es6_array_iterator = _iterDefine(Array, 'Array', function (iterated, kind) {
	  this._t = _toIobject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function () {
	  var O = this._t;
	  var kind = this._k;
	  var index = this._i++;
	  if (!O || index >= O.length) {
	    this._t = undefined;
	    return _iterStep(1);
	  }
	  if (kind == 'keys') return _iterStep(0, index);
	  if (kind == 'values') return _iterStep(0, O[index]);
	  return _iterStep(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	_iterators.Arguments = _iterators.Array;

	var TO_STRING_TAG = _wks('toStringTag');

	var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
	  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
	  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
	  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
	  'TextTrackList,TouchList').split(',');

	for (var i = 0; i < DOMIterables.length; i++) {
	  var NAME = DOMIterables[i];
	  var Collection = _global[NAME];
	  var proto = Collection && Collection.prototype;
	  if (proto && !proto[TO_STRING_TAG]) _hide(proto, TO_STRING_TAG, NAME);
	  _iterators[NAME] = _iterators.Array;
	}

	var f$1 = _wks;

	var _wksExt = {
		f: f$1
	};

	var iterator = _wksExt.f('iterator');

	var iterator$1 = createCommonjsModule(function (module) {
	module.exports = { "default": iterator, __esModule: true };
	});

	unwrapExports(iterator$1);

	var _meta = createCommonjsModule(function (module) {
	var META = _uid('meta');


	var setDesc = _objectDp.f;
	var id = 0;
	var isExtensible = Object.isExtensible || function () {
	  return true;
	};
	var FREEZE = !_fails(function () {
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function (it) {
	  setDesc(it, META, { value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  } });
	};
	var fastKey = function (it, create) {
	  // return primitive with prefix
	  if (!_isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function (it, create) {
	  if (!_has(it, META)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function (it) {
	  if (FREEZE && meta.NEED && isExtensible(it) && !_has(it, META)) setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY: META,
	  NEED: false,
	  fastKey: fastKey,
	  getWeak: getWeak,
	  onFreeze: onFreeze
	};
	});
	var _meta_1 = _meta.KEY;
	var _meta_2 = _meta.NEED;
	var _meta_3 = _meta.fastKey;
	var _meta_4 = _meta.getWeak;
	var _meta_5 = _meta.onFreeze;

	var defineProperty = _objectDp.f;
	var _wksDefine = function (name) {
	  var $Symbol = _core.Symbol || (_core.Symbol = {});
	  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: _wksExt.f(name) });
	};

	var f$2 = Object.getOwnPropertySymbols;

	var _objectGops = {
		f: f$2
	};

	var f$3 = {}.propertyIsEnumerable;

	var _objectPie = {
		f: f$3
	};

	// all enumerable object keys, includes symbols



	var _enumKeys = function (it) {
	  var result = _objectKeys(it);
	  var getSymbols = _objectGops.f;
	  if (getSymbols) {
	    var symbols = getSymbols(it);
	    var isEnum = _objectPie.f;
	    var i = 0;
	    var key;
	    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
	  } return result;
	};

	// 7.2.2 IsArray(argument)

	var _isArray = Array.isArray || function isArray(arg) {
	  return _cof(arg) == 'Array';
	};

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)

	var hiddenKeys = _enumBugKeys.concat('length', 'prototype');

	var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return _objectKeysInternal(O, hiddenKeys);
	};

	var _objectGopn = {
		f: f$4
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window

	var gOPN = _objectGopn.f;
	var toString$1 = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return gOPN(it);
	  } catch (e) {
	    return windowNames.slice();
	  }
	};

	var f$5 = function getOwnPropertyNames(it) {
	  return windowNames && toString$1.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(_toIobject(it));
	};

	var _objectGopnExt = {
		f: f$5
	};

	var gOPD = Object.getOwnPropertyDescriptor;

	var f$6 = _descriptors ? gOPD : function getOwnPropertyDescriptor(O, P) {
	  O = _toIobject(O);
	  P = _toPrimitive(P, true);
	  if (_ie8DomDefine) try {
	    return gOPD(O, P);
	  } catch (e) { /* empty */ }
	  if (_has(O, P)) return _propertyDesc(!_objectPie.f.call(O, P), O[P]);
	};

	var _objectGopd = {
		f: f$6
	};

	// ECMAScript 6 symbols shim





	var META = _meta.KEY;



















	var gOPD$1 = _objectGopd.f;
	var dP$1 = _objectDp.f;
	var gOPN$1 = _objectGopnExt.f;
	var $Symbol = _global.Symbol;
	var $JSON$1 = _global.JSON;
	var _stringify = $JSON$1 && $JSON$1.stringify;
	var PROTOTYPE$2 = 'prototype';
	var HIDDEN = _wks('_hidden');
	var TO_PRIMITIVE = _wks('toPrimitive');
	var isEnum = {}.propertyIsEnumerable;
	var SymbolRegistry = _shared('symbol-registry');
	var AllSymbols = _shared('symbols');
	var OPSymbols = _shared('op-symbols');
	var ObjectProto$1 = Object[PROTOTYPE$2];
	var USE_NATIVE = typeof $Symbol == 'function';
	var QObject = _global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE$2] || !QObject[PROTOTYPE$2].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = _descriptors && _fails(function () {
	  return _objectCreate(dP$1({}, 'a', {
	    get: function () { return dP$1(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (it, key, D) {
	  var protoDesc = gOPD$1(ObjectProto$1, key);
	  if (protoDesc) delete ObjectProto$1[key];
	  dP$1(it, key, D);
	  if (protoDesc && it !== ObjectProto$1) dP$1(ObjectProto$1, key, protoDesc);
	} : dP$1;

	var wrap = function (tag) {
	  var sym = AllSymbols[tag] = _objectCreate($Symbol[PROTOTYPE$2]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D) {
	  if (it === ObjectProto$1) $defineProperty(OPSymbols, key, D);
	  _anObject(it);
	  key = _toPrimitive(key, true);
	  _anObject(D);
	  if (_has(AllSymbols, key)) {
	    if (!D.enumerable) {
	      if (!_has(it, HIDDEN)) dP$1(it, HIDDEN, _propertyDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if (_has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
	      D = _objectCreate(D, { enumerable: _propertyDesc(0, false) });
	    } return setSymbolDesc(it, key, D);
	  } return dP$1(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P) {
	  _anObject(it);
	  var keys = _enumKeys(P = _toIobject(P));
	  var i = 0;
	  var l = keys.length;
	  var key;
	  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P) {
	  return P === undefined ? _objectCreate(it) : $defineProperties(_objectCreate(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key) {
	  var E = isEnum.call(this, key = _toPrimitive(key, true));
	  if (this === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return false;
	  return E || !_has(this, key) || !_has(AllSymbols, key) || _has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
	  it = _toIobject(it);
	  key = _toPrimitive(key, true);
	  if (it === ObjectProto$1 && _has(AllSymbols, key) && !_has(OPSymbols, key)) return;
	  var D = gOPD$1(it, key);
	  if (D && _has(AllSymbols, key) && !(_has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it) {
	  var names = gOPN$1(_toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (!_has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
	  var IS_OP = it === ObjectProto$1;
	  var names = gOPN$1(IS_OP ? OPSymbols : _toIobject(it));
	  var result = [];
	  var i = 0;
	  var key;
	  while (names.length > i) {
	    if (_has(AllSymbols, key = names[i++]) && (IS_OP ? _has(ObjectProto$1, key) : true)) result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if (!USE_NATIVE) {
	  $Symbol = function Symbol() {
	    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
	    var tag = _uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function (value) {
	      if (this === ObjectProto$1) $set.call(OPSymbols, value);
	      if (_has(this, HIDDEN) && _has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, _propertyDesc(1, value));
	    };
	    if (_descriptors && setter) setSymbolDesc(ObjectProto$1, tag, { configurable: true, set: $set });
	    return wrap(tag);
	  };
	  _redefine($Symbol[PROTOTYPE$2], 'toString', function toString() {
	    return this._k;
	  });

	  _objectGopd.f = $getOwnPropertyDescriptor;
	  _objectDp.f = $defineProperty;
	  _objectGopn.f = _objectGopnExt.f = $getOwnPropertyNames;
	  _objectPie.f = $propertyIsEnumerable;
	  _objectGops.f = $getOwnPropertySymbols;

	  if (_descriptors && !_library) {
	    _redefine(ObjectProto$1, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  _wksExt.f = function (name) {
	    return wrap(_wks(name));
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE, { Symbol: $Symbol });

	for (var es6Symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), j = 0; es6Symbols.length > j;)_wks(es6Symbols[j++]);

	for (var wellKnownSymbols = _objectKeys(_wks.store), k = 0; wellKnownSymbols.length > k;) _wksDefine(wellKnownSymbols[k++]);

	_export(_export.S + _export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function (key) {
	    return _has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(sym) {
	    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
	    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
	  },
	  useSetter: function () { setter = true; },
	  useSimple: function () { setter = false; }
	});

	_export(_export.S + _export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON$1 && _export(_export.S + _export.F * (!USE_NATIVE || _fails(function () {
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it) {
	    var args = [it];
	    var i = 1;
	    var replacer, $replacer;
	    while (arguments.length > i) args.push(arguments[i++]);
	    $replacer = replacer = args[1];
	    if (!_isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	    if (!_isArray(replacer)) replacer = function (key, value) {
	      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
	      if (!isSymbol(value)) return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON$1, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE$2][TO_PRIMITIVE] || _hide($Symbol[PROTOTYPE$2], TO_PRIMITIVE, $Symbol[PROTOTYPE$2].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	_setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	_setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	_setToStringTag(_global.JSON, 'JSON', true);

	_wksDefine('asyncIterator');

	_wksDefine('observable');

	var symbol = _core.Symbol;

	var symbol$1 = createCommonjsModule(function (module) {
	module.exports = { "default": symbol, __esModule: true };
	});

	unwrapExports(symbol$1);

	var _typeof_1 = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _iterator2 = _interopRequireDefault(iterator$1);



	var _symbol2 = _interopRequireDefault(symbol$1);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};
	});

	unwrapExports(_typeof_1);

	var possibleConstructorReturn = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _typeof3 = _interopRequireDefault(_typeof_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};
	});

	var _possibleConstructorReturn = unwrapExports(possibleConstructorReturn);

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */


	var check = function (O, proto) {
	  _anObject(O);
	  if (!_isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
	};
	var _setProto = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function (test, buggy, set) {
	      try {
	        set = _ctx(Function.call, _objectGopd.f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch (e) { buggy = true; }
	      return function setPrototypeOf(O, proto) {
	        check(O, proto);
	        if (buggy) O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

	// 19.1.3.19 Object.setPrototypeOf(O, proto)

	_export(_export.S, 'Object', { setPrototypeOf: _setProto.set });

	var setPrototypeOf = _core.Object.setPrototypeOf;

	var setPrototypeOf$1 = createCommonjsModule(function (module) {
	module.exports = { "default": setPrototypeOf, __esModule: true };
	});

	unwrapExports(setPrototypeOf$1);

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	_export(_export.S, 'Object', { create: _objectCreate });

	var $Object = _core.Object;
	var create = function create(P, D) {
	  return $Object.create(P, D);
	};

	var create$1 = createCommonjsModule(function (module) {
	module.exports = { "default": create, __esModule: true };
	});

	unwrapExports(create$1);

	var inherits = createCommonjsModule(function (module, exports) {

	exports.__esModule = true;



	var _setPrototypeOf2 = _interopRequireDefault(setPrototypeOf$1);



	var _create2 = _interopRequireDefault(create$1);



	var _typeof3 = _interopRequireDefault(_typeof_1);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};
	});

	var _inherits = unwrapExports(inherits);

	var global$1 = (typeof global !== "undefined" ? global :
	            typeof self !== "undefined" ? self :
	            typeof window !== "undefined" ? window : {});

	// getting tag from 19.1.3.6 Object.prototype.toString()

	var TAG$1 = _wks('toStringTag');
	// ES3 wrong here
	var ARG = _cof(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (e) { /* empty */ }
	};

	var _classof = function (it) {
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG$1)) == 'string' ? T
	    // builtinTag case
	    : ARG ? _cof(O)
	    // ES3 arguments fallback
	    : (B = _cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

	var _anInstance = function (it, Constructor, name, forbiddenField) {
	  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

	// call something on iterator step with safe closing on error

	var _iterCall = function (iterator, fn, value, entries) {
	  try {
	    return entries ? fn(_anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch (e) {
	    var ret = iterator['return'];
	    if (ret !== undefined) _anObject(ret.call(iterator));
	    throw e;
	  }
	};

	// check on default Array iterator

	var ITERATOR$1 = _wks('iterator');
	var ArrayProto = Array.prototype;

	var _isArrayIter = function (it) {
	  return it !== undefined && (_iterators.Array === it || ArrayProto[ITERATOR$1] === it);
	};

	var ITERATOR$2 = _wks('iterator');

	var core_getIteratorMethod = _core.getIteratorMethod = function (it) {
	  if (it != undefined) return it[ITERATOR$2]
	    || it['@@iterator']
	    || _iterators[_classof(it)];
	};

	var _forOf = createCommonjsModule(function (module) {
	var BREAK = {};
	var RETURN = {};
	var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
	  var iterFn = ITERATOR ? function () { return iterable; } : core_getIteratorMethod(iterable);
	  var f = _ctx(fn, that, entries ? 2 : 1);
	  var index = 0;
	  var length, step, iterator, result;
	  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if (_isArrayIter(iterFn)) for (length = _toLength(iterable.length); length > index; index++) {
	    result = entries ? f(_anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if (result === BREAK || result === RETURN) return result;
	  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
	    result = _iterCall(iterator, f, step.value, entries);
	    if (result === BREAK || result === RETURN) return result;
	  }
	};
	exports.BREAK = BREAK;
	exports.RETURN = RETURN;
	});

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)


	var SPECIES = _wks('species');
	var _speciesConstructor = function (O, D) {
	  var C = _anObject(O).constructor;
	  var S;
	  return C === undefined || (S = _anObject(C)[SPECIES]) == undefined ? D : _aFunction(S);
	};

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	var _invoke = function (fn, args, that) {
	  var un = that === undefined;
	  switch (args.length) {
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return fn.apply(that, args);
	};

	var process = _global.process;
	var setTask = _global.setImmediate;
	var clearTask = _global.clearImmediate;
	var MessageChannel = _global.MessageChannel;
	var Dispatch = _global.Dispatch;
	var counter = 0;
	var queue = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var defer, channel, port;
	var run = function () {
	  var id = +this;
	  // eslint-disable-next-line no-prototype-builtins
	  if (queue.hasOwnProperty(id)) {
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function (event) {
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!setTask || !clearTask) {
	  setTask = function setImmediate(fn) {
	    var args = [];
	    var i = 1;
	    while (arguments.length > i) args.push(arguments[i++]);
	    queue[++counter] = function () {
	      // eslint-disable-next-line no-new-func
	      _invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id) {
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if (_cof(process) == 'process') {
	    defer = function (id) {
	      process.nextTick(_ctx(run, id, 1));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(_ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if (MessageChannel) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = _ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (_global.addEventListener && typeof postMessage == 'function' && !_global.importScripts) {
	    defer = function (id) {
	      _global.postMessage(id + '', '*');
	    };
	    _global.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in _domCreate('script')) {
	    defer = function (id) {
	      _html.appendChild(_domCreate('script'))[ONREADYSTATECHANGE] = function () {
	        _html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(_ctx(run, id, 1), 0);
	    };
	  }
	}
	var _task = {
	  set: setTask,
	  clear: clearTask
	};

	var macrotask = _task.set;
	var Observer = _global.MutationObserver || _global.WebKitMutationObserver;
	var process$1 = _global.process;
	var Promise$1 = _global.Promise;
	var isNode = _cof(process$1) == 'process';

	var _microtask = function () {
	  var head, last, notify;

	  var flush = function () {
	    var parent, fn;
	    if (isNode && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (e) {
	        if (head) notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // Node.js
	  if (isNode) {
	    notify = function () {
	      process$1.nextTick(flush);
	    };
	  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
	  } else if (Observer && !(_global.navigator && _global.navigator.standalone)) {
	    var toggle = true;
	    var node = document.createTextNode('');
	    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
	    notify = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    var promise = Promise$1.resolve(undefined);
	    notify = function () {
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function () {
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(_global, flush);
	    };
	  }

	  return function (fn) {
	    var task = { fn: fn, next: undefined };
	    if (last) last.next = task;
	    if (!head) {
	      head = task;
	      notify();
	    } last = task;
	  };
	};

	// 25.4.1.5 NewPromiseCapability(C)


	function PromiseCapability(C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = _aFunction(resolve);
	  this.reject = _aFunction(reject);
	}

	var f$7 = function (C) {
	  return new PromiseCapability(C);
	};

	var _newPromiseCapability = {
		f: f$7
	};

	var _perform = function (exec) {
	  try {
	    return { e: false, v: exec() };
	  } catch (e) {
	    return { e: true, v: e };
	  }
	};

	var navigator = _global.navigator;

	var _userAgent = navigator && navigator.userAgent || '';

	var _promiseResolve = function (C, x) {
	  _anObject(C);
	  if (_isObject(x) && x.constructor === C) return x;
	  var promiseCapability = _newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var _redefineAll = function (target, src, safe) {
	  for (var key in src) {
	    if (safe && target[key]) target[key] = src[key];
	    else _hide(target, key, src[key]);
	  } return target;
	};

	var SPECIES$1 = _wks('species');

	var _setSpecies = function (KEY) {
	  var C = typeof _core[KEY] == 'function' ? _core[KEY] : _global[KEY];
	  if (_descriptors && C && !C[SPECIES$1]) _objectDp.f(C, SPECIES$1, {
	    configurable: true,
	    get: function () { return this; }
	  });
	};

	var ITERATOR$3 = _wks('iterator');
	var SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR$3]();
	  riter['return'] = function () { SAFE_CLOSING = true; };
	} catch (e) { /* empty */ }

	var _iterDetect = function (exec, skipClosing) {
	  if (!skipClosing && !SAFE_CLOSING) return false;
	  var safe = false;
	  try {
	    var arr = [7];
	    var iter = arr[ITERATOR$3]();
	    iter.next = function () { return { done: safe = true }; };
	    arr[ITERATOR$3] = function () { return iter; };
	    exec(arr);
	  } catch (e) { /* empty */ }
	  return safe;
	};

	var task = _task.set;
	var microtask = _microtask();




	var PROMISE = 'Promise';
	var TypeError$1 = _global.TypeError;
	var process$2 = _global.process;
	var versions = process$2 && process$2.versions;
	var v8 = versions && versions.v8 || '';
	var $Promise = _global[PROMISE];
	var isNode$1 = _classof(process$2) == 'process';
	var empty$1 = function () { /* empty */ };
	var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
	var newPromiseCapability = newGenericPromiseCapability = _newPromiseCapability.f;

	var USE_NATIVE$1 = !!function () {
	  try {
	    // correct subclassing with @@species support
	    var promise = $Promise.resolve(1);
	    var FakePromise = (promise.constructor = {})[_wks('species')] = function (exec) {
	      exec(empty$1, empty$1);
	    };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode$1 || typeof PromiseRejectionEvent == 'function')
	      && promise.then(empty$1) instanceof FakePromise
	      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	      // we can't detect it synchronously, so just check versions
	      && v8.indexOf('6.6') !== 0
	      && _userAgent.indexOf('Chrome/66') === -1;
	  } catch (e) { /* empty */ }
	}();

	// helpers
	var isThenable = function (it) {
	  var then;
	  return _isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var notify = function (promise, isReject) {
	  if (promise._n) return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function () {
	    var value = promise._v;
	    var ok = promise._s == 1;
	    var i = 0;
	    var run = function (reaction) {
	      var handler = ok ? reaction.ok : reaction.fail;
	      var resolve = reaction.resolve;
	      var reject = reaction.reject;
	      var domain = reaction.domain;
	      var result, then, exited;
	      try {
	        if (handler) {
	          if (!ok) {
	            if (promise._h == 2) onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if (handler === true) result = value;
	          else {
	            if (domain) domain.enter();
	            result = handler(value); // may throw
	            if (domain) {
	              domain.exit();
	              exited = true;
	            }
	          }
	          if (result === reaction.promise) {
	            reject(TypeError$1('Promise-chain cycle'));
	          } else if (then = isThenable(result)) {
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch (e) {
	        if (domain && !exited) domain.exit();
	        reject(e);
	      }
	    };
	    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if (isReject && !promise._h) onUnhandled(promise);
	  });
	};
	var onUnhandled = function (promise) {
	  task.call(_global, function () {
	    var value = promise._v;
	    var unhandled = isUnhandled(promise);
	    var result, handler, console;
	    if (unhandled) {
	      result = _perform(function () {
	        if (isNode$1) {
	          process$2.emit('unhandledRejection', value, promise);
	        } else if (handler = _global.onunhandledrejection) {
	          handler({ promise: promise, reason: value });
	        } else if ((console = _global.console) && console.error) {
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode$1 || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if (unhandled && result.e) throw result.v;
	  });
	};
	var isUnhandled = function (promise) {
	  return promise._h !== 1 && (promise._a || promise._c).length === 0;
	};
	var onHandleUnhandled = function (promise) {
	  task.call(_global, function () {
	    var handler;
	    if (isNode$1) {
	      process$2.emit('rejectionHandled', promise);
	    } else if (handler = _global.onrejectionhandled) {
	      handler({ promise: promise, reason: promise._v });
	    }
	  });
	};
	var $reject = function (value) {
	  var promise = this;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if (!promise._a) promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function (value) {
	  var promise = this;
	  var then;
	  if (promise._d) return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
	    if (then = isThenable(value)) {
	      microtask(function () {
	        var wrapper = { _w: promise, _d: false }; // wrap
	        try {
	          then.call(value, _ctx($resolve, wrapper, 1), _ctx($reject, wrapper, 1));
	        } catch (e) {
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch (e) {
	    $reject.call({ _w: promise, _d: false }, e); // wrap
	  }
	};

	// constructor polyfill
	if (!USE_NATIVE$1) {
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor) {
	    _anInstance(this, $Promise, PROMISE, '_h');
	    _aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(_ctx($resolve, this, 1), _ctx($reject, this, 1));
	    } catch (err) {
	      $reject.call(this, err);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal = function Promise(executor) {
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = _redefineAll($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected) {
	      var reaction = newPromiseCapability(_speciesConstructor(this, $Promise));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode$1 ? process$2.domain : undefined;
	      this._c.push(reaction);
	      if (this._a) this._a.push(reaction);
	      if (this._s) notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    this.promise = promise;
	    this.resolve = _ctx($resolve, promise, 1);
	    this.reject = _ctx($reject, promise, 1);
	  };
	  _newPromiseCapability.f = newPromiseCapability = function (C) {
	    return C === $Promise || C === Wrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };
	}

	_export(_export.G + _export.W + _export.F * !USE_NATIVE$1, { Promise: $Promise });
	_setToStringTag($Promise, PROMISE);
	_setSpecies(PROMISE);
	Wrapper = _core[PROMISE];

	// statics
	_export(_export.S + _export.F * !USE_NATIVE$1, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r) {
	    var capability = newPromiseCapability(this);
	    var $$reject = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	_export(_export.S + _export.F * (_library || !USE_NATIVE$1), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x) {
	    return _promiseResolve(_library && this === Wrapper ? $Promise : this, x);
	  }
	});
	_export(_export.S + _export.F * !(USE_NATIVE$1 && _iterDetect(function (iter) {
	  $Promise.all(iter)['catch'](empty$1);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = _perform(function () {
	      var values = [];
	      var index = 0;
	      var remaining = 1;
	      _forOf(iterable, false, function (promise) {
	        var $index = index++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability(C);
	    var reject = capability.reject;
	    var result = _perform(function () {
	      _forOf(iterable, false, function (promise) {
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.e) reject(result.v);
	    return capability.promise;
	  }
	});

	_export(_export.P + _export.R, 'Promise', { 'finally': function (onFinally) {
	  var C = _speciesConstructor(this, _core.Promise || _global.Promise);
	  var isFunction = typeof onFinally == 'function';
	  return this.then(
	    isFunction ? function (x) {
	      return _promiseResolve(C, onFinally()).then(function () { return x; });
	    } : onFinally,
	    isFunction ? function (e) {
	      return _promiseResolve(C, onFinally()).then(function () { throw e; });
	    } : onFinally
	  );
	} });

	// https://github.com/tc39/proposal-promise-try




	_export(_export.S, 'Promise', { 'try': function (callbackfn) {
	  var promiseCapability = _newPromiseCapability.f(this);
	  var result = _perform(callbackfn);
	  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
	  return promiseCapability.promise;
	} });

	var promise = _core.Promise;

	var promise$1 = createCommonjsModule(function (module) {
	module.exports = { "default": promise, __esModule: true };
	});

	var _Promise = unwrapExports(promise$1);

	var inherits_browser = createCommonjsModule(function (module) {
	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	});

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup[i] = code[i];
	    revLookup[code.charCodeAt(i)] = i;
	  }

	  revLookup['-'.charCodeAt(0)] = 62;
	  revLookup['_'.charCodeAt(0)] = 63;
	}

	function toByteArray (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup[tmp >> 2];
	    output += lookup[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup[tmp >> 10];
	    output += lookup[(tmp >> 4) & 0x3F];
	    output += lookup[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString$2 = {}.toString;

	var isArray = Array.isArray || function (arr) {
	  return toString$2.call(arr) == '[object Array]';
	};

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	/*
	 * Export kMaxLength after typed array support is determined.
	 */
	var _kMaxLength = kMaxLength();

	function kMaxLength () {
	  return Buffer.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
	    return new Buffer(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer._augment = function (arr) {
	  arr.__proto__ = Buffer.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer.TYPED_ARRAY_SUPPORT) {
	  Buffer.prototype.__proto__ = Uint8Array.prototype;
	  Buffer.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}
	Buffer.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf$1(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf$1(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf$1 (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read$$1 (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read$$1(arr, i) === read$$1(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read$$1(arr, i + j) !== read$$1(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write$$1 (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray(buf)
	  } else {
	    return fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	var buffer = /*#__PURE__*/Object.freeze({
		INSPECT_MAX_BYTES: INSPECT_MAX_BYTES,
		kMaxLength: _kMaxLength,
		Buffer: Buffer,
		SlowBuffer: SlowBuffer,
		isBuffer: isBuffer
	});

	var safeBuffer = createCommonjsModule(function (module, exports) {
	/* eslint-disable node/no-deprecated-api */

	var Buffer = buffer.Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer;
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer, exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer.SlowBuffer(size)
	};
	});
	var safeBuffer_1 = safeBuffer.Buffer;

	var domain;

	// This constructor is used to store event handlers. Instantiating this is
	// faster than explicitly calling `Object.create(null)` to get a "clean" empty
	// object (tested with v8 v4.9).
	function EventHandlers() {}
	EventHandlers.prototype = Object.create(null);

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}

	// nodejs oddity
	// require('events') === require('events').EventEmitter
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.usingDomains = false;

	EventEmitter.prototype.domain = undefined;
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	EventEmitter.init = function() {
	  this.domain = null;
	  if (EventEmitter.usingDomains) {
	    // if there is an active domain, then attach to it.
	    if (domain.active && !(this instanceof domain.Domain)) ;
	  }

	  if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
	    this._events = new EventHandlers();
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || isNaN(n))
	    throw new TypeError('"n" argument must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	function $getMaxListeners(that) {
	  if (that._maxListeners === undefined)
	    return EventEmitter.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	  return $getMaxListeners(this);
	};

	// These standalone emit* functions are used to optimize calling of event
	// handlers for fast cases because emit() itself often has a variable number of
	// arguments and can be deoptimized because of that. These functions always have
	// the same number of arguments and thus do not get deoptimized, so the code
	// inside them can execute faster.
	function emitNone(handler, isFn, self) {
	  if (isFn)
	    handler.call(self);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self);
	  }
	}
	function emitOne(handler, isFn, self, arg1) {
	  if (isFn)
	    handler.call(self, arg1);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1);
	  }
	}
	function emitTwo(handler, isFn, self, arg1, arg2) {
	  if (isFn)
	    handler.call(self, arg1, arg2);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1, arg2);
	  }
	}
	function emitThree(handler, isFn, self, arg1, arg2, arg3) {
	  if (isFn)
	    handler.call(self, arg1, arg2, arg3);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].call(self, arg1, arg2, arg3);
	  }
	}

	function emitMany(handler, isFn, self, args) {
	  if (isFn)
	    handler.apply(self, args);
	  else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      listeners[i].apply(self, args);
	  }
	}

	EventEmitter.prototype.emit = function emit(type) {
	  var er, handler, len, args, i, events, domain;
	  var doError = (type === 'error');

	  events = this._events;
	  if (events)
	    doError = (doError && events.error == null);
	  else if (!doError)
	    return false;

	  domain = this.domain;

	  // If there is no 'error' event listener then throw.
	  if (doError) {
	    er = arguments[1];
	    if (domain) {
	      if (!er)
	        er = new Error('Uncaught, unspecified "error" event');
	      er.domainEmitter = this;
	      er.domain = domain;
	      er.domainThrown = false;
	      domain.emit('error', er);
	    } else if (er instanceof Error) {
	      throw er; // Unhandled 'error' event
	    } else {
	      // At least give some kind of context to the user
	      var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
	      err.context = er;
	      throw err;
	    }
	    return false;
	  }

	  handler = events[type];

	  if (!handler)
	    return false;

	  var isFn = typeof handler === 'function';
	  len = arguments.length;
	  switch (len) {
	    // fast cases
	    case 1:
	      emitNone(handler, isFn, this);
	      break;
	    case 2:
	      emitOne(handler, isFn, this, arguments[1]);
	      break;
	    case 3:
	      emitTwo(handler, isFn, this, arguments[1], arguments[2]);
	      break;
	    case 4:
	      emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
	      break;
	    // slower
	    default:
	      args = new Array(len - 1);
	      for (i = 1; i < len; i++)
	        args[i - 1] = arguments[i];
	      emitMany(handler, isFn, this, args);
	  }

	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;

	  if (typeof listener !== 'function')
	    throw new TypeError('"listener" argument must be a function');

	  events = target._events;
	  if (!events) {
	    events = target._events = new EventHandlers();
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener) {
	      target.emit('newListener', type,
	                  listener.listener ? listener.listener : listener);

	      // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object
	      events = target._events;
	    }
	    existing = events[type];
	  }

	  if (!existing) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] = prepend ? [listener, existing] :
	                                          [existing, listener];
	    } else {
	      // If we've already got an array, just append.
	      if (prepend) {
	        existing.unshift(listener);
	      } else {
	        existing.push(listener);
	      }
	    }

	    // Check for listener leak
	    if (!existing.warned) {
	      m = $getMaxListeners(target);
	      if (m && m > 0 && existing.length > m) {
	        existing.warned = true;
	        var w = new Error('Possible EventEmitter memory leak detected. ' +
	                            existing.length + ' ' + type + ' listeners added. ' +
	                            'Use emitter.setMaxListeners() to increase limit');
	        w.name = 'MaxListenersExceededWarning';
	        w.emitter = target;
	        w.type = type;
	        w.count = existing.length;
	        emitWarning(w);
	      }
	    }
	  }

	  return target;
	}
	function emitWarning(e) {
	  typeof console.warn === 'function' ? console.warn(e) : console.log(e);
	}
	EventEmitter.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener =
	    function prependListener(type, listener) {
	      return _addListener(this, type, listener, true);
	    };

	function _onceWrap(target, type, listener) {
	  var fired = false;
	  function g() {
	    target.removeListener(type, g);
	    if (!fired) {
	      fired = true;
	      listener.apply(target, arguments);
	    }
	  }
	  g.listener = listener;
	  return g;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	  if (typeof listener !== 'function')
	    throw new TypeError('"listener" argument must be a function');
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	      if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');
	      this.prependListener(type, _onceWrap(this, type, listener));
	      return this;
	    };

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener =
	    function removeListener(type, listener) {
	      var list, events, position, i, originalListener;

	      if (typeof listener !== 'function')
	        throw new TypeError('"listener" argument must be a function');

	      events = this._events;
	      if (!events)
	        return this;

	      list = events[type];
	      if (!list)
	        return this;

	      if (list === listener || (list.listener && list.listener === listener)) {
	        if (--this._eventsCount === 0)
	          this._events = new EventHandlers();
	        else {
	          delete events[type];
	          if (events.removeListener)
	            this.emit('removeListener', type, list.listener || listener);
	        }
	      } else if (typeof list !== 'function') {
	        position = -1;

	        for (i = list.length; i-- > 0;) {
	          if (list[i] === listener ||
	              (list[i].listener && list[i].listener === listener)) {
	            originalListener = list[i].listener;
	            position = i;
	            break;
	          }
	        }

	        if (position < 0)
	          return this;

	        if (list.length === 1) {
	          list[0] = undefined;
	          if (--this._eventsCount === 0) {
	            this._events = new EventHandlers();
	            return this;
	          } else {
	            delete events[type];
	          }
	        } else {
	          spliceOne(list, position);
	        }

	        if (events.removeListener)
	          this.emit('removeListener', type, originalListener || listener);
	      }

	      return this;
	    };

	EventEmitter.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	      var listeners, events;

	      events = this._events;
	      if (!events)
	        return this;

	      // not listening for removeListener, no need to emit
	      if (!events.removeListener) {
	        if (arguments.length === 0) {
	          this._events = new EventHandlers();
	          this._eventsCount = 0;
	        } else if (events[type]) {
	          if (--this._eventsCount === 0)
	            this._events = new EventHandlers();
	          else
	            delete events[type];
	        }
	        return this;
	      }

	      // emit removeListener for all listeners on all events
	      if (arguments.length === 0) {
	        var keys = Object.keys(events);
	        for (var i = 0, key; i < keys.length; ++i) {
	          key = keys[i];
	          if (key === 'removeListener') continue;
	          this.removeAllListeners(key);
	        }
	        this.removeAllListeners('removeListener');
	        this._events = new EventHandlers();
	        this._eventsCount = 0;
	        return this;
	      }

	      listeners = events[type];

	      if (typeof listeners === 'function') {
	        this.removeListener(type, listeners);
	      } else if (listeners) {
	        // LIFO order
	        do {
	          this.removeListener(type, listeners[listeners.length - 1]);
	        } while (listeners[0]);
	      }

	      return this;
	    };

	EventEmitter.prototype.listeners = function listeners(type) {
	  var evlistener;
	  var ret;
	  var events = this._events;

	  if (!events)
	    ret = [];
	  else {
	    evlistener = events[type];
	    if (!evlistener)
	      ret = [];
	    else if (typeof evlistener === 'function')
	      ret = [evlistener.listener || evlistener];
	    else
	      ret = unwrapListeners(evlistener);
	  }

	  return ret;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount.call(emitter, type);
	  }
	};

	EventEmitter.prototype.listenerCount = listenerCount;
	function listenerCount(type) {
	  var events = this._events;

	  if (events) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
	};

	// About 1.5x faster than the two-arg version of Array#splice().
	function spliceOne(list, index) {
	  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
	    list[i] = list[k];
	  list.pop();
	}

	function arrayClone(arr, i) {
	  var copy = new Array(i);
	  while (i--)
	    copy[i] = arr[i];
	  return copy;
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);
	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }
	  return ret;
	}

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue$1 = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue$1 = currentQueue.concat(queue$1);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue$1.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue$1.length;
	    while(len) {
	        currentQueue = queue$1;
	        queue$1 = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue$1.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue$1.push(new Item(fun, args));
	    if (queue$1.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions$1 = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance$1 = global$1.performance || {};
	var performanceNow =
	  performance$1.now        ||
	  performance$1.mozNow     ||
	  performance$1.msNow      ||
	  performance$1.oNow       ||
	  performance$1.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance$1)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var process$3 = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions$1,
	  on: on,
	  addListener: addListener,
	  once: once,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	var inherits$1;
	if (typeof Object.create === 'function'){
	  inherits$1 = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits$1 = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	var inherits$2 = inherits$1;

	var formatRegExp = /%[sdj%]/g;
	function format(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	}

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global$1.process)) {
	    return function() {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process$3.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;
	      debugs[set] = function() {
	        var msg = format.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	}

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray$1(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty$1(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty$1(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function(prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray$1(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull(arg) {
	  return arg === null;
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isString(arg) {
	  return typeof arg === 'string';
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}
	function hasOwnProperty$1(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return Buffer.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = Buffer.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

	// Copyright Joyent, Inc. and other Node contributors.
	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     };


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	function StringDecoder(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	}

	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}

	var stringDecoder = /*#__PURE__*/Object.freeze({
		StringDecoder: StringDecoder
	});

	Readable.ReadableState = ReadableState;

	var debug = debuglog('stream');
	inherits$2(Readable, EventEmitter);

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event])
	      emitter.on(event, fn);
	    else if (Array.isArray(emitter._events[event]))
	      emitter._events[event].unshift(fn);
	    else
	      emitter._events[event] = [fn, emitter._events[event]];
	  }
	}
	function listenerCount$1 (emitter, type) {
	  return emitter.listeners(type).length;
	}
	function ReadableState(options, stream) {

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	function Readable(options) {

	  if (!(this instanceof Readable)) return new Readable(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  EventEmitter.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = Buffer.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable(stream);
	        }
	      }

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  } else if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) nextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}

	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    nextTick(maybeReadMore_, stream, state);
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false);

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (listenerCount$1(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && src.listeners('data').length) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}

	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var _i = 0; _i < len; _i++) {
	      dests[_i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1) return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = EventEmitter.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        nextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }

	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;

	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    nextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = Buffer.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    nextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	// A bit simpler than readable streams.
	Writable.WritableState = WritableState;
	inherits$2(Writable, EventEmitter);

	function nop() {}

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	function WritableState(options, stream) {
	  Object.defineProperty(this, 'buffer', {
	    get: deprecate(function () {
	      return this.getBuffer();
	    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	  });
	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState.prototype.getBuffer = function writableStateGetBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};
	function Writable(options) {

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  EventEmitter.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  nextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    nextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};

	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = Buffer.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);

	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) nextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	        nextTick(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite(stream, state, finished, cb);
	      }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable.prototype._writev = null;

	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};

	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) nextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}

	inherits$2(Duplex, Readable);

	var keys = Object.keys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}
	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);

	  Readable.call(this, options);
	  Writable.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  nextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	// a transform stream is a readable/writable stream where you do
	inherits$2(Transform, Duplex);

	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er) {
	      done(stream, er);
	    });else done(stream);
	  });
	}

	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('Not implemented');
	};

	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done(stream, er) {
	  if (er) return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

	inherits$2(PassThrough, Transform);
	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);

	  Transform.call(this, options);
	}

	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

	inherits$2(Stream, EventEmitter);
	Stream.Readable = Readable;
	Stream.Writable = Writable;
	Stream.Duplex = Duplex;
	Stream.Transform = Transform;
	Stream.PassThrough = PassThrough;

	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;

	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream() {
	  EventEmitter.call(this);
	}

	Stream.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EventEmitter.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};

	var stream = /*#__PURE__*/Object.freeze({
		default: Stream,
		Readable: Readable,
		Writable: Writable,
		Duplex: Duplex,
		Transform: Transform,
		PassThrough: PassThrough,
		Stream: Stream
	});

	var require$$1 = ( stream && Stream ) || stream;

	var Buffer$1 = safeBuffer.Buffer;
	var Transform$1 = require$$1.Transform;


	function throwIfNotStringOrBuffer (val, prefix) {
	  if (!Buffer$1.isBuffer(val) && typeof val !== 'string') {
	    throw new TypeError(prefix + ' must be a string or a buffer')
	  }
	}

	function HashBase (blockSize) {
	  Transform$1.call(this);

	  this._block = Buffer$1.allocUnsafe(blockSize);
	  this._blockSize = blockSize;
	  this._blockOffset = 0;
	  this._length = [0, 0, 0, 0];

	  this._finalized = false;
	}

	inherits_browser(HashBase, Transform$1);

	HashBase.prototype._transform = function (chunk, encoding, callback) {
	  var error = null;
	  try {
	    this.update(chunk, encoding);
	  } catch (err) {
	    error = err;
	  }

	  callback(error);
	};

	HashBase.prototype._flush = function (callback) {
	  var error = null;
	  try {
	    this.push(this.digest());
	  } catch (err) {
	    error = err;
	  }

	  callback(error);
	};

	HashBase.prototype.update = function (data, encoding) {
	  throwIfNotStringOrBuffer(data, 'Data');
	  if (this._finalized) throw new Error('Digest already called')
	  if (!Buffer$1.isBuffer(data)) data = Buffer$1.from(data, encoding);

	  // consume data
	  var block = this._block;
	  var offset = 0;
	  while (this._blockOffset + data.length - offset >= this._blockSize) {
	    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++];
	    this._update();
	    this._blockOffset = 0;
	  }
	  while (offset < data.length) block[this._blockOffset++] = data[offset++];

	  // update length
	  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
	    this._length[j] += carry;
	    carry = (this._length[j] / 0x0100000000) | 0;
	    if (carry > 0) this._length[j] -= 0x0100000000 * carry;
	  }

	  return this
	};

	HashBase.prototype._update = function () {
	  throw new Error('_update is not implemented')
	};

	HashBase.prototype.digest = function (encoding) {
	  if (this._finalized) throw new Error('Digest already called')
	  this._finalized = true;

	  var digest = this._digest();
	  if (encoding !== undefined) digest = digest.toString(encoding);

	  // reset state
	  this._block.fill(0);
	  this._blockOffset = 0;
	  for (var i = 0; i < 4; ++i) this._length[i] = 0;

	  return digest
	};

	HashBase.prototype._digest = function () {
	  throw new Error('_digest is not implemented')
	};

	var hashBase = HashBase;

	var ARRAY16 = new Array(16);

	function MD5 () {
	  hashBase.call(this, 64);

	  // state
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	}

	inherits_browser(MD5, hashBase);

	MD5.prototype._update = function () {
	  var M = ARRAY16;
	  for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4);

	  var a = this._a;
	  var b = this._b;
	  var c = this._c;
	  var d = this._d;

	  a = fnF(a, b, c, d, M[0], 0xd76aa478, 7);
	  d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12);
	  c = fnF(c, d, a, b, M[2], 0x242070db, 17);
	  b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22);
	  a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7);
	  d = fnF(d, a, b, c, M[5], 0x4787c62a, 12);
	  c = fnF(c, d, a, b, M[6], 0xa8304613, 17);
	  b = fnF(b, c, d, a, M[7], 0xfd469501, 22);
	  a = fnF(a, b, c, d, M[8], 0x698098d8, 7);
	  d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12);
	  c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17);
	  b = fnF(b, c, d, a, M[11], 0x895cd7be, 22);
	  a = fnF(a, b, c, d, M[12], 0x6b901122, 7);
	  d = fnF(d, a, b, c, M[13], 0xfd987193, 12);
	  c = fnF(c, d, a, b, M[14], 0xa679438e, 17);
	  b = fnF(b, c, d, a, M[15], 0x49b40821, 22);

	  a = fnG(a, b, c, d, M[1], 0xf61e2562, 5);
	  d = fnG(d, a, b, c, M[6], 0xc040b340, 9);
	  c = fnG(c, d, a, b, M[11], 0x265e5a51, 14);
	  b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20);
	  a = fnG(a, b, c, d, M[5], 0xd62f105d, 5);
	  d = fnG(d, a, b, c, M[10], 0x02441453, 9);
	  c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14);
	  b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20);
	  a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5);
	  d = fnG(d, a, b, c, M[14], 0xc33707d6, 9);
	  c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14);
	  b = fnG(b, c, d, a, M[8], 0x455a14ed, 20);
	  a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5);
	  d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9);
	  c = fnG(c, d, a, b, M[7], 0x676f02d9, 14);
	  b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20);

	  a = fnH(a, b, c, d, M[5], 0xfffa3942, 4);
	  d = fnH(d, a, b, c, M[8], 0x8771f681, 11);
	  c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16);
	  b = fnH(b, c, d, a, M[14], 0xfde5380c, 23);
	  a = fnH(a, b, c, d, M[1], 0xa4beea44, 4);
	  d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11);
	  c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16);
	  b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23);
	  a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4);
	  d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11);
	  c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16);
	  b = fnH(b, c, d, a, M[6], 0x04881d05, 23);
	  a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4);
	  d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11);
	  c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16);
	  b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23);

	  a = fnI(a, b, c, d, M[0], 0xf4292244, 6);
	  d = fnI(d, a, b, c, M[7], 0x432aff97, 10);
	  c = fnI(c, d, a, b, M[14], 0xab9423a7, 15);
	  b = fnI(b, c, d, a, M[5], 0xfc93a039, 21);
	  a = fnI(a, b, c, d, M[12], 0x655b59c3, 6);
	  d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10);
	  c = fnI(c, d, a, b, M[10], 0xffeff47d, 15);
	  b = fnI(b, c, d, a, M[1], 0x85845dd1, 21);
	  a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6);
	  d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10);
	  c = fnI(c, d, a, b, M[6], 0xa3014314, 15);
	  b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21);
	  a = fnI(a, b, c, d, M[4], 0xf7537e82, 6);
	  d = fnI(d, a, b, c, M[11], 0xbd3af235, 10);
	  c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15);
	  b = fnI(b, c, d, a, M[9], 0xeb86d391, 21);

	  this._a = (this._a + a) | 0;
	  this._b = (this._b + b) | 0;
	  this._c = (this._c + c) | 0;
	  this._d = (this._d + d) | 0;
	};

	MD5.prototype._digest = function () {
	  // create padding and handle blocks
	  this._block[this._blockOffset++] = 0x80;
	  if (this._blockOffset > 56) {
	    this._block.fill(0, this._blockOffset, 64);
	    this._update();
	    this._blockOffset = 0;
	  }

	  this._block.fill(0, this._blockOffset, 56);
	  this._block.writeUInt32LE(this._length[0], 56);
	  this._block.writeUInt32LE(this._length[1], 60);
	  this._update();

	  // produce result
	  var buffer = new Buffer(16);
	  buffer.writeInt32LE(this._a, 0);
	  buffer.writeInt32LE(this._b, 4);
	  buffer.writeInt32LE(this._c, 8);
	  buffer.writeInt32LE(this._d, 12);
	  return buffer
	};

	function rotl (x, n) {
	  return (x << n) | (x >>> (32 - n))
	}

	function fnF (a, b, c, d, m, k, s) {
	  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + b) | 0
	}

	function fnG (a, b, c, d, m, k, s) {
	  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + b) | 0
	}

	function fnH (a, b, c, d, m, k, s) {
	  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0
	}

	function fnI (a, b, c, d, m, k, s) {
	  return (rotl((a + ((c ^ (b | (~d)))) + m + k) | 0, s) + b) | 0
	}

	var md5_js = MD5;

	var Buffer$2 = buffer.Buffer;



	var ARRAY16$1 = new Array(16);

	var zl = [
	  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
	  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
	  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
	  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
	];

	var zr = [
	  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
	  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
	  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
	  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
	  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
	];

	var sl = [
	  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
	  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
	  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
	  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
	  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
	];

	var sr = [
	  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
	  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
	  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
	  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
	  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
	];

	var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
	var hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

	function RIPEMD160 () {
	  hashBase.call(this, 64);

	  // state
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;
	}

	inherits_browser(RIPEMD160, hashBase);

	RIPEMD160.prototype._update = function () {
	  var words = ARRAY16$1;
	  for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(j * 4);

	  var al = this._a | 0;
	  var bl = this._b | 0;
	  var cl = this._c | 0;
	  var dl = this._d | 0;
	  var el = this._e | 0;

	  var ar = this._a | 0;
	  var br = this._b | 0;
	  var cr = this._c | 0;
	  var dr = this._d | 0;
	  var er = this._e | 0;

	  // computation
	  for (var i = 0; i < 80; i += 1) {
	    var tl;
	    var tr;
	    if (i < 16) {
	      tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i]);
	      tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i]);
	    } else if (i < 32) {
	      tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i]);
	      tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i]);
	    } else if (i < 48) {
	      tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i]);
	      tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i]);
	    } else if (i < 64) {
	      tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i]);
	      tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i]);
	    } else { // if (i<80) {
	      tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i]);
	      tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i]);
	    }

	    al = el;
	    el = dl;
	    dl = rotl$1(cl, 10);
	    cl = bl;
	    bl = tl;

	    ar = er;
	    er = dr;
	    dr = rotl$1(cr, 10);
	    cr = br;
	    br = tr;
	  }

	  // update state
	  var t = (this._b + cl + dr) | 0;
	  this._b = (this._c + dl + er) | 0;
	  this._c = (this._d + el + ar) | 0;
	  this._d = (this._e + al + br) | 0;
	  this._e = (this._a + bl + cr) | 0;
	  this._a = t;
	};

	RIPEMD160.prototype._digest = function () {
	  // create padding and handle blocks
	  this._block[this._blockOffset++] = 0x80;
	  if (this._blockOffset > 56) {
	    this._block.fill(0, this._blockOffset, 64);
	    this._update();
	    this._blockOffset = 0;
	  }

	  this._block.fill(0, this._blockOffset, 56);
	  this._block.writeUInt32LE(this._length[0], 56);
	  this._block.writeUInt32LE(this._length[1], 60);
	  this._update();

	  // produce result
	  var buffer$$1 = Buffer$2.alloc ? Buffer$2.alloc(20) : new Buffer$2(20);
	  buffer$$1.writeInt32LE(this._a, 0);
	  buffer$$1.writeInt32LE(this._b, 4);
	  buffer$$1.writeInt32LE(this._c, 8);
	  buffer$$1.writeInt32LE(this._d, 12);
	  buffer$$1.writeInt32LE(this._e, 16);
	  return buffer$$1
	};

	function rotl$1 (x, n) {
	  return (x << n) | (x >>> (32 - n))
	}

	function fn1 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
	}

	function fn2 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
	}

	function fn3 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
	}

	function fn4 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
	}

	function fn5 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
	}

	var ripemd160 = RIPEMD160;

	var Buffer$3 = safeBuffer.Buffer;

	// prototype class for hash functions
	function Hash (blockSize, finalSize) {
	  this._block = Buffer$3.alloc(blockSize);
	  this._finalSize = finalSize;
	  this._blockSize = blockSize;
	  this._len = 0;
	}

	Hash.prototype.update = function (data, enc) {
	  if (typeof data === 'string') {
	    enc = enc || 'utf8';
	    data = Buffer$3.from(data, enc);
	  }

	  var block = this._block;
	  var blockSize = this._blockSize;
	  var length = data.length;
	  var accum = this._len;

	  for (var offset = 0; offset < length;) {
	    var assigned = accum % blockSize;
	    var remainder = Math.min(length - offset, blockSize - assigned);

	    for (var i = 0; i < remainder; i++) {
	      block[assigned + i] = data[offset + i];
	    }

	    accum += remainder;
	    offset += remainder;

	    if ((accum % blockSize) === 0) {
	      this._update(block);
	    }
	  }

	  this._len += length;
	  return this
	};

	Hash.prototype.digest = function (enc) {
	  var rem = this._len % this._blockSize;

	  this._block[rem] = 0x80;

	  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
	  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
	  this._block.fill(0, rem + 1);

	  if (rem >= this._finalSize) {
	    this._update(this._block);
	    this._block.fill(0);
	  }

	  var bits = this._len * 8;

	  // uint32
	  if (bits <= 0xffffffff) {
	    this._block.writeUInt32BE(bits, this._blockSize - 4);

	  // uint64
	  } else {
	    var lowBits = (bits & 0xffffffff) >>> 0;
	    var highBits = (bits - lowBits) / 0x100000000;

	    this._block.writeUInt32BE(highBits, this._blockSize - 8);
	    this._block.writeUInt32BE(lowBits, this._blockSize - 4);
	  }

	  this._update(this._block);
	  var hash = this._hash();

	  return enc ? hash.toString(enc) : hash
	};

	Hash.prototype._update = function () {
	  throw new Error('_update must be implemented by subclass')
	};

	var hash = Hash;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
	 * in FIPS PUB 180-1
	 * This source code is derived from sha1.js of the same repository.
	 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
	 * operation was added.
	 */



	var Buffer$4 = safeBuffer.Buffer;

	var K = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W = new Array(80);

	function Sha () {
	  this.init();
	  this._w = W;

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha, hash);

	Sha.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl5 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha.prototype._hash = function () {
	  var H = Buffer$4.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha = Sha;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */



	var Buffer$5 = safeBuffer.Buffer;

	var K$1 = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W$1 = new Array(80);

	function Sha1 () {
	  this.init();
	  this._w = W$1;

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha1, hash);

	Sha1.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl1 (num) {
	  return (num << 1) | (num >>> 31)
	}

	function rotl5$1 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30$1 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft$1 (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha1.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5$1(a) + ft$1(s, b, c, d) + e + W[j] + K$1[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30$1(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha1.prototype._hash = function () {
	  var H = Buffer$5.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha1 = Sha1;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */



	var Buffer$6 = safeBuffer.Buffer;

	var K$2 = [
	  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	];

	var W$2 = new Array(64);

	function Sha256 () {
	  this.init();

	  this._w = W$2; // new Array(64)

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha256, hash);

	Sha256.prototype.init = function () {
	  this._a = 0x6a09e667;
	  this._b = 0xbb67ae85;
	  this._c = 0x3c6ef372;
	  this._d = 0xa54ff53a;
	  this._e = 0x510e527f;
	  this._f = 0x9b05688c;
	  this._g = 0x1f83d9ab;
	  this._h = 0x5be0cd19;

	  return this
	};

	function ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0 (x) {
	  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
	}

	function sigma1 (x) {
	  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
	}

	function gamma0 (x) {
	  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
	}

	function gamma1 (x) {
	  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
	}

	Sha256.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;
	  var f = this._f | 0;
	  var g = this._g | 0;
	  var h = this._h | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0;

	  for (var j = 0; j < 64; ++j) {
	    var T1 = (h + sigma1(e) + ch(e, f, g) + K$2[j] + W[j]) | 0;
	    var T2 = (sigma0(a) + maj(a, b, c)) | 0;

	    h = g;
	    g = f;
	    f = e;
	    e = (d + T1) | 0;
	    d = c;
	    c = b;
	    b = a;
	    a = (T1 + T2) | 0;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	  this._f = (f + this._f) | 0;
	  this._g = (g + this._g) | 0;
	  this._h = (h + this._h) | 0;
	};

	Sha256.prototype._hash = function () {
	  var H = Buffer$6.allocUnsafe(32);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);
	  H.writeInt32BE(this._h, 28);

	  return H
	};

	var sha256 = Sha256;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */




	var Buffer$7 = safeBuffer.Buffer;

	var W$3 = new Array(64);

	function Sha224 () {
	  this.init();

	  this._w = W$3; // new Array(64)

	  hash.call(this, 64, 56);
	}

	inherits_browser(Sha224, sha256);

	Sha224.prototype.init = function () {
	  this._a = 0xc1059ed8;
	  this._b = 0x367cd507;
	  this._c = 0x3070dd17;
	  this._d = 0xf70e5939;
	  this._e = 0xffc00b31;
	  this._f = 0x68581511;
	  this._g = 0x64f98fa7;
	  this._h = 0xbefa4fa4;

	  return this
	};

	Sha224.prototype._hash = function () {
	  var H = Buffer$7.allocUnsafe(28);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);

	  return H
	};

	var sha224 = Sha224;

	var Buffer$8 = safeBuffer.Buffer;

	var K$3 = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	var W$4 = new Array(160);

	function Sha512 () {
	  this.init();
	  this._w = W$4;

	  hash.call(this, 128, 112);
	}

	inherits_browser(Sha512, hash);

	Sha512.prototype.init = function () {
	  this._ah = 0x6a09e667;
	  this._bh = 0xbb67ae85;
	  this._ch = 0x3c6ef372;
	  this._dh = 0xa54ff53a;
	  this._eh = 0x510e527f;
	  this._fh = 0x9b05688c;
	  this._gh = 0x1f83d9ab;
	  this._hh = 0x5be0cd19;

	  this._al = 0xf3bcc908;
	  this._bl = 0x84caa73b;
	  this._cl = 0xfe94f82b;
	  this._dl = 0x5f1d36f1;
	  this._el = 0xade682d1;
	  this._fl = 0x2b3e6c1f;
	  this._gl = 0xfb41bd6b;
	  this._hl = 0x137e2179;

	  return this
	};

	function Ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj$1 (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0$1 (x, xl) {
	  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
	}

	function sigma1$1 (x, xl) {
	  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
	}

	function Gamma0 (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
	}

	function Gamma0l (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
	}

	function Gamma1 (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
	}

	function Gamma1l (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
	}

	function getCarry (a, b) {
	  return (a >>> 0) < (b >>> 0) ? 1 : 0
	}

	Sha512.prototype._update = function (M) {
	  var W = this._w;

	  var ah = this._ah | 0;
	  var bh = this._bh | 0;
	  var ch = this._ch | 0;
	  var dh = this._dh | 0;
	  var eh = this._eh | 0;
	  var fh = this._fh | 0;
	  var gh = this._gh | 0;
	  var hh = this._hh | 0;

	  var al = this._al | 0;
	  var bl = this._bl | 0;
	  var cl = this._cl | 0;
	  var dl = this._dl | 0;
	  var el = this._el | 0;
	  var fl = this._fl | 0;
	  var gl = this._gl | 0;
	  var hl = this._hl | 0;

	  for (var i = 0; i < 32; i += 2) {
	    W[i] = M.readInt32BE(i * 4);
	    W[i + 1] = M.readInt32BE(i * 4 + 4);
	  }
	  for (; i < 160; i += 2) {
	    var xh = W[i - 15 * 2];
	    var xl = W[i - 15 * 2 + 1];
	    var gamma0 = Gamma0(xh, xl);
	    var gamma0l = Gamma0l(xl, xh);

	    xh = W[i - 2 * 2];
	    xl = W[i - 2 * 2 + 1];
	    var gamma1 = Gamma1(xh, xl);
	    var gamma1l = Gamma1l(xl, xh);

	    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	    var Wi7h = W[i - 7 * 2];
	    var Wi7l = W[i - 7 * 2 + 1];

	    var Wi16h = W[i - 16 * 2];
	    var Wi16l = W[i - 16 * 2 + 1];

	    var Wil = (gamma0l + Wi7l) | 0;
	    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0;
	    Wil = (Wil + gamma1l) | 0;
	    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0;
	    Wil = (Wil + Wi16l) | 0;
	    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0;

	    W[i] = Wih;
	    W[i + 1] = Wil;
	  }

	  for (var j = 0; j < 160; j += 2) {
	    Wih = W[j];
	    Wil = W[j + 1];

	    var majh = maj$1(ah, bh, ch);
	    var majl = maj$1(al, bl, cl);

	    var sigma0h = sigma0$1(ah, al);
	    var sigma0l = sigma0$1(al, ah);
	    var sigma1h = sigma1$1(eh, el);
	    var sigma1l = sigma1$1(el, eh);

	    // t1 = h + sigma1 + ch + K[j] + W[j]
	    var Kih = K$3[j];
	    var Kil = K$3[j + 1];

	    var chh = Ch(eh, fh, gh);
	    var chl = Ch(el, fl, gl);

	    var t1l = (hl + sigma1l) | 0;
	    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0;
	    t1l = (t1l + chl) | 0;
	    t1h = (t1h + chh + getCarry(t1l, chl)) | 0;
	    t1l = (t1l + Kil) | 0;
	    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0;
	    t1l = (t1l + Wil) | 0;
	    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0;

	    // t2 = sigma0 + maj
	    var t2l = (sigma0l + majl) | 0;
	    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0;

	    hh = gh;
	    hl = gl;
	    gh = fh;
	    gl = fl;
	    fh = eh;
	    fl = el;
	    el = (dl + t1l) | 0;
	    eh = (dh + t1h + getCarry(el, dl)) | 0;
	    dh = ch;
	    dl = cl;
	    ch = bh;
	    cl = bl;
	    bh = ah;
	    bl = al;
	    al = (t1l + t2l) | 0;
	    ah = (t1h + t2h + getCarry(al, t1l)) | 0;
	  }

	  this._al = (this._al + al) | 0;
	  this._bl = (this._bl + bl) | 0;
	  this._cl = (this._cl + cl) | 0;
	  this._dl = (this._dl + dl) | 0;
	  this._el = (this._el + el) | 0;
	  this._fl = (this._fl + fl) | 0;
	  this._gl = (this._gl + gl) | 0;
	  this._hl = (this._hl + hl) | 0;

	  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0;
	  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0;
	  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0;
	  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0;
	  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0;
	  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0;
	  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0;
	  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0;
	};

	Sha512.prototype._hash = function () {
	  var H = Buffer$8.allocUnsafe(64);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);
	  writeInt64BE(this._gh, this._gl, 48);
	  writeInt64BE(this._hh, this._hl, 56);

	  return H
	};

	var sha512 = Sha512;

	var Buffer$9 = safeBuffer.Buffer;

	var W$5 = new Array(160);

	function Sha384 () {
	  this.init();
	  this._w = W$5;

	  hash.call(this, 128, 112);
	}

	inherits_browser(Sha384, sha512);

	Sha384.prototype.init = function () {
	  this._ah = 0xcbbb9d5d;
	  this._bh = 0x629a292a;
	  this._ch = 0x9159015a;
	  this._dh = 0x152fecd8;
	  this._eh = 0x67332667;
	  this._fh = 0x8eb44a87;
	  this._gh = 0xdb0c2e0d;
	  this._hh = 0x47b5481d;

	  this._al = 0xc1059ed8;
	  this._bl = 0x367cd507;
	  this._cl = 0x3070dd17;
	  this._dl = 0xf70e5939;
	  this._el = 0xffc00b31;
	  this._fl = 0x68581511;
	  this._gl = 0x64f98fa7;
	  this._hl = 0xbefa4fa4;

	  return this
	};

	Sha384.prototype._hash = function () {
	  var H = Buffer$9.allocUnsafe(48);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);

	  return H
	};

	var sha384 = Sha384;

	var sha_js = createCommonjsModule(function (module) {
	var exports = module.exports = function SHA (algorithm) {
	  algorithm = algorithm.toLowerCase();

	  var Algorithm = exports[algorithm];
	  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

	  return new Algorithm()
	};

	exports.sha = sha;
	exports.sha1 = sha1;
	exports.sha224 = sha224;
	exports.sha256 = sha256;
	exports.sha384 = sha384;
	exports.sha512 = sha512;
	});

	var Buffer$a = safeBuffer.Buffer;
	var Transform$2 = require$$1.Transform;
	var StringDecoder$1 = stringDecoder.StringDecoder;


	function CipherBase (hashMode) {
	  Transform$2.call(this);
	  this.hashMode = typeof hashMode === 'string';
	  if (this.hashMode) {
	    this[hashMode] = this._finalOrDigest;
	  } else {
	    this.final = this._finalOrDigest;
	  }
	  if (this._final) {
	    this.__final = this._final;
	    this._final = null;
	  }
	  this._decoder = null;
	  this._encoding = null;
	}
	inherits_browser(CipherBase, Transform$2);

	CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
	  if (typeof data === 'string') {
	    data = Buffer$a.from(data, inputEnc);
	  }

	  var outData = this._update(data);
	  if (this.hashMode) return this

	  if (outputEnc) {
	    outData = this._toString(outData, outputEnc);
	  }

	  return outData
	};

	CipherBase.prototype.setAutoPadding = function () {};
	CipherBase.prototype.getAuthTag = function () {
	  throw new Error('trying to get auth tag in unsupported state')
	};

	CipherBase.prototype.setAuthTag = function () {
	  throw new Error('trying to set auth tag in unsupported state')
	};

	CipherBase.prototype.setAAD = function () {
	  throw new Error('trying to set aad in unsupported state')
	};

	CipherBase.prototype._transform = function (data, _, next) {
	  var err;
	  try {
	    if (this.hashMode) {
	      this._update(data);
	    } else {
	      this.push(this._update(data));
	    }
	  } catch (e) {
	    err = e;
	  } finally {
	    next(err);
	  }
	};
	CipherBase.prototype._flush = function (done) {
	  var err;
	  try {
	    this.push(this.__final());
	  } catch (e) {
	    err = e;
	  }

	  done(err);
	};
	CipherBase.prototype._finalOrDigest = function (outputEnc) {
	  var outData = this.__final() || Buffer$a.alloc(0);
	  if (outputEnc) {
	    outData = this._toString(outData, outputEnc, true);
	  }
	  return outData
	};

	CipherBase.prototype._toString = function (value, enc, fin) {
	  if (!this._decoder) {
	    this._decoder = new StringDecoder$1(enc);
	    this._encoding = enc;
	  }

	  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

	  var out = this._decoder.write(value);
	  if (fin) {
	    out += this._decoder.end();
	  }

	  return out
	};

	var cipherBase = CipherBase;

	function Hash$1 (hash) {
	  cipherBase.call(this, 'digest');

	  this._hash = hash;
	}

	inherits_browser(Hash$1, cipherBase);

	Hash$1.prototype._update = function (data) {
	  this._hash.update(data);
	};

	Hash$1.prototype._final = function () {
	  return this._hash.digest()
	};

	var browser$1 = function createHash (alg) {
	  alg = alg.toLowerCase();
	  if (alg === 'md5') return new md5_js()
	  if (alg === 'rmd160' || alg === 'ripemd160') return new ripemd160()

	  return new Hash$1(sha_js(alg))
	};

	var isNode$2 = false;
	try {
	  isNode$2 = Object.prototype.toString.call(global$1.process) === '[object process]';
	} catch (e) {
	}

	var util$1 = {
	  getHash: function getHash(str) {
	    var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base64';

	    if (!str) {
	      return undefined;
	    }
	    var hash = browser$1('sha256');
	    hash.update(str);
	    return hash.digest(format);
	  },

	  timeoutPromise: function timeoutPromise(promise, timeout) {
	    return _Promise.race([promise, new _Promise(function (resolve) {
	      setTimeout(function () {
	        resolve();
	      }, timeout);
	    })]);
	  },


	  isNode: isNode$2
	};

	// most Object methods by ES6 should accept primitives



	var _objectSap = function (KEY, exec) {
	  var fn = (_core.Object || {})[KEY] || Object[KEY];
	  var exp = {};
	  exp[KEY] = exec(fn);
	  _export(_export.S + _export.F * _fails(function () { fn(1); }), 'Object', exp);
	};

	// 19.1.2.14 Object.keys(O)



	_objectSap('keys', function () {
	  return function keys(it) {
	    return _objectKeys(_toObject(it));
	  };
	});

	var keys$1 = _core.Object.keys;

	var keys$2 = createCommonjsModule(function (module) {
	module.exports = { "default": keys$1, __esModule: true };
	});

	var _Object$keys = unwrapExports(keys$2);

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
	  account: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
	};

	/**
	* A simple key-value pair.
	*/

	var Attribute = function () {
	  /**
	  * @param {Object|Array} data {name, val} or [name, val]
	  */
	  function Attribute(data) {
	    _classCallCheck(this, Attribute);

	    if (data.hasOwnProperty("val")) {
	      this.val = data.val;
	      if (data.hasOwnProperty("name")) {
	        this.name = data.name;
	      } else {
	        var n = Attribute.guessTypeOf(this.val);
	        if (n) {
	          this.name = n;
	        } else {
	          throw new Error("Type of attribute was omitted and could not be guessed");
	        }
	      }
	    } else if (Array.isArray(data)) {
	      if (data.length !== 2) {
	        throw new Error("Invalid Attribute");
	      }
	      this.name = data[0];
	      this.val = data[1];
	    } else {
	      throw new Error("Invalid attribute data", data);
	    }
	  }

	  /**
	  * @returns {Object} an object with attribute types as keys and regex patterns as values
	  */


	  Attribute.getUniqueIdValidators = function getUniqueIdValidators() {
	    return UNIQUE_ID_VALIDATORS;
	  };

	  /**
	  * @param {string} type attribute type
	  * @returns {boolean} true if the attribute type is unique
	  */


	  Attribute.isUniqueType = function isUniqueType(type) {
	    return _Object$keys(UNIQUE_ID_VALIDATORS).indexOf(type) > -1;
	  };

	  /**
	  * @param {string} value guess type of this attribute value
	  * @returns {string} type of attribute value or undefined
	  */


	  Attribute.guessTypeOf = function guessTypeOf(value) {
	    for (var key in UNIQUE_ID_VALIDATORS) {
	      if (value.match(UNIQUE_ID_VALIDATORS[key])) {
	        return key;
	      }
	    }
	  };

	  /**
	  * @param {Attribute} a
	  * @param {Attribute} b
	  * @returns {boolean} true if params are equal
	  */


	  Attribute.equals = function equals(a, b) {
	    return new Attribute(a).equals(new Attribute(b));
	  };

	  /**
	  * @returns {Array} attribute represented as a [name, val] array
	  */


	  Attribute.prototype.toArray = function toArray() {
	    return [this.name, this.val];
	  };

	  /**
	  * @param {Attribute} a attribute to compare to
	  * @returns {boolean} true if attribute matches param
	  */


	  Attribute.prototype.equals = function equals(a) {
	    return this.name === a.name && this.val === a.val;
	  };

	  Attribute.prototype.uri = function uri() {
	    return encodeURIComponent(this.val) + ":" + encodeURIComponent(this.name);
	  };

	  return Attribute;
	}();

	var gun_min = createCommonjsModule(function (module) {
	!function(){function t(n,o){function e(t){return t.split("/").slice(-1).toString().replace(".js","")}return o?commonjsRequire(n):n.slice?t[e(n)]:function(o,i){n(o={exports:{}}),t[e(i)]=o.exports;}}var n;"undefined"!=typeof window&&(n=window),"undefined"!=typeof commonjsGlobal&&(n=commonjsGlobal),n=n||{};var o=n.console||{log:function(){}};var e=module;t(function(t){var n={};n.fn={is:function(t){return !!t&&"function"==typeof t}},n.bi={is:function(t){return t instanceof Boolean||"boolean"==typeof t}},n.num={is:function(t){return !e(t)&&(t-parseFloat(t)+1>=0||1/0===t||-(1/0)===t)}},n.text={is:function(t){return "string"==typeof t}},n.text.ify=function(t){return n.text.is(t)?t:"undefined"!=typeof JSON?JSON.stringify(t):t&&t.toString?t.toString():t},n.text.random=function(t,n){var o="";for(t=t||24,n=n||"0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz";t>0;)o+=n.charAt(Math.floor(Math.random()*n.length)),t--;return o},n.text.match=function(t,o){function e(t,n){for(var o,e=-1,i=0;o=n[i++];)if(!~(e=t.indexOf(o,e+1)))return !1;return !0}var i=!1;if(t=t||"",o=n.text.is(o)?{"=":o}:o||{},n.obj.has(o,"~")&&(t=t.toLowerCase(),o["="]=(o["="]||o["~"]).toLowerCase()),n.obj.has(o,"="))return t===o["="];if(n.obj.has(o,"*")){if(t.slice(0,o["*"].length)!==o["*"])return !1;i=!0,t=t.slice(o["*"].length);}if(n.obj.has(o,"!")){if(t.slice(-o["!"].length)!==o["!"])return !1;i=!0;}if(n.obj.has(o,"+")&&n.list.map(n.list.is(o["+"])?o["+"]:[o["+"]],function(n){return t.indexOf(n)>=0?void(i=!0):!0}))return !1;if(n.obj.has(o,"-")&&n.list.map(n.list.is(o["-"])?o["-"]:[o["-"]],function(n){return t.indexOf(n)<0?void(i=!0):!0}))return !1;if(n.obj.has(o,">")){if(!(t>o[">"]))return !1;i=!0;}if(n.obj.has(o,"<")){if(!(t<o["<"]))return !1;i=!0;}if(n.obj.has(o,"?")){if(!e(t,o["?"]))return !1;i=!0;}return i},n.list={is:function(t){return t instanceof Array}},n.list.slit=Array.prototype.slice,n.list.sort=function(t){return function(n,o){return n&&o?(n=n[t],o=o[t],o>n?-1:n>o?1:0):0}},n.list.map=function(t,n,o){return u(t,n,o)},n.list.index=1,n.obj={is:function(t){return t?t instanceof Object&&t.constructor===Object||"Object"===Object.prototype.toString.call(t).match(/^\[object (\w+)\]$/)[1]:!1}},n.obj.put=function(t,n,o){return (t||{})[n]=o,t},n.obj.has=function(t,n){return t&&Object.prototype.hasOwnProperty.call(t,n)},n.obj.del=function(t,n){return t?(t[n]=null,delete t[n],t):void 0},n.obj.as=function(t,n,o,e){return t[n]=t[n]||(e===o?{}:o)},n.obj.ify=function(t){if(r(t))return t;try{t=JSON.parse(t);}catch(n){t={};}return t},function(){function t(t,n){a(this,n)&&o!==this[n]||(this[n]=t);}var o;n.obj.to=function(n,o){return o=o||{},u(n,t,o),o};}(),n.obj.copy=function(t){return t?JSON.parse(JSON.stringify(t)):t},function(){function t(t,n){var o=this.n;if(!o||!(n===o||r(o)&&a(o,n)))return n?!0:void 0}n.obj.empty=function(n,o){return n&&u(n,t,{n:o})?!1:!0};}(),function(){function t(n,o){return 2===arguments.length?(t.r=t.r||{},void(t.r[n]=o)):(t.r=t.r||[],void t.r.push(n))}var i=Object.keys;n.obj.map=function(u,s,f){var c,l,p,d,h,v=0,g=o(s);if(t.r=null,i&&r(u)&&(d=i(u),h=!0),e(u)||d)for(l=(d||u).length;l>v;v++){var m=v+n.list.index;if(g){if(p=h?s.call(f||this,u[d[v]],d[v],t):s.call(f||this,u[v],m,t),p!==c)return p}else if(s===u[h?d[v]:v])return d?d[v]:m}else for(v in u)if(g){if(a(u,v)&&(p=f?s.call(f,u[v],v,t):s(u[v],v,t),p!==c))return p}else if(s===u[v])return v;return g?t.r:n.list.index?0:-1};}(),n.time={},n.time.is=function(t){return t?t instanceof Date:+(new Date).getTime()};var o=n.fn.is,e=n.list.is,i=n.obj,r=i.is,a=i.has,u=i.map;t.exports=n;})(t,"./type"),t(function(t){t.exports=function n(t,o,e){if(!t)return {to:n};var i,t=(this.tag||(this.tag={}))[t]||(this.tag[t]={tag:t,to:n._={next:function(t){var n;(n=this.to)&&n.next(t);}}});if(o instanceof Function){var r={off:n.off||(n.off=function(){return this.next===n._.next?!0:(this===this.the.last&&(this.the.last=this.back),this.to.back=this.back,this.next=n._.next,this.back.to=this.to,void(this.the.last===this.the&&delete this.on.tag[this.the.tag]))}),to:n._,next:o,the:t,on:this,as:e};return (r.back=t.last||t).to=r,t.last=r}return (t=t.to)&&i!==o&&t.next(o),t};})(t,"./onto"),t(function(t){function n(t,n,e,i,r){if(n>t)return {defer:!0};if(e>n)return {historical:!0};if(n>e)return {converge:!0,incoming:!0};if(n===e){if(i=o(i)||"",r=o(r)||"",i===r)return {state:!0};if(r>i)return {converge:!0,current:!0};if(i>r)return {converge:!0,incoming:!0}}return {err:"Invalid CRDT Data: "+i+" to "+r+" at "+n+" to "+e+"!"}}if("undefined"==typeof JSON)throw new Error("JSON is not included in this browser. Please load it first: ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js");var o=JSON.stringify;t.exports=n;})(t,"./HAM"),t(function(n){var o=t("./type"),e={};e.is=function(t){return t===i?!1:null===t?!0:t===1/0?!1:s(t)||a(t)||u(t)?!0:e.rel.is(t)||!1},e.link=e.rel={_:"#"},function(){function t(t,n){var o=this;return o.id?o.id=!1:n==r&&s(t)?void(o.id=t):o.id=!1}e.rel.is=function(n){if(n&&n[r]&&!n._&&c(n)){var o={};if(p(n,t,o),o.id)return o.id}return !1};}(),e.rel.ify=function(t){return l({},r,t)},o.obj.has._=".";var i,r=e.link._,a=o.bi.is,u=o.num.is,s=o.text.is,f=o.obj,c=f.is,l=f.put,p=f.map;n.exports=e;})(t,"./val"),t(function(n){var o=t("./type"),e=t("./val"),i={_:"_"};i.soul=function(t,n){return t&&t._&&t._[n||p]},i.soul.ify=function(t,n){return n="string"==typeof n?{soul:n}:n||{},t=t||{},t._=t._||{},t._[p]=n.soul||t._[p]||l(),t},i.soul._=e.link._,function(){function t(t,n){return n!==i._?e.is(t)?void(this.cb&&this.cb.call(this.as,t,n,this.n,this.s)):!0:void 0}i.is=function(n,o,e){var r;return u(n)&&(r=i.soul(n))?!f(n,t,{as:e,cb:o,s:r,n:n}):!1};}(),function(){function t(t,n){var o,i,r=this.o;return r.map?(o=r.map.call(this.as,t,""+n,r.node),void(i===o?s(r.node,n):r.node&&(r.node[n]=o))):void(e.is(t)&&(r.node[n]=t))}i.ify=function(n,o,e){return o?"string"==typeof o?o={soul:o}:o instanceof Function&&(o={map:o}):o={},o.map&&(o.node=o.map.call(e,n,r,o.node||{})),(o.node=i.soul.ify(o.node||{},o))&&f(n,t,{o:o,as:e}),o.node};}();var r,a=o.obj,u=a.is,s=a.del,f=a.map,c=o.text,l=c.random,p=i.soul._;n.exports=i;})(t,"./node"),t(function(n){function o(){var t;return t=r(),t>a?(u=0,a=t+o.drift):a=t+(u+=1)/s+o.drift}{var e=t("./type"),i=t("./node"),r=e.time.is,a=-(1/0),u=0,s=1e3,f="undefined"!=typeof performance?performance.timing&&performance:!1;f&&f.timing&&f.timing.navigationStart||(f=!1);}o._=">",o.drift=0,o.is=function(t,n,e){var i=n&&t&&t[x]&&t[x][o._]||e;if(i)return b(i=i[n])?i:-(1/0)},o.lex=function(){return o().toString(36).replace(".","")},o.ify=function(t,n,e,r,a){if(!t||!t[x]){if(!a)return;t=i.soul.ify(t,a);}var u=p(t[x],o._);return c!==n&&n!==x&&(b(e)&&(u[n]=e),c!==r&&(t[n]=r)),t},o.to=function(t,n,e){var r=(t||{})[n];return h(r)&&(r=g(r)),o.ify(e,n,o.is(t,n),r,i.soul(t))},function(){function t(t,n){x!==n&&o.ify(this.o,n,this.s);}o.map=function(n,e,i){var r,a=h(a=n||e)?a:null;return n=y(n=n||e)?n:null,a&&!n?(e=b(e)?e:o(),a[x]=a[x]||{},v(a,t,{o:a,s:e}),a):(i=i||h(e)?e:r,e=b(e)?e:o(),function(o,a,u,s){return n?(n.call(i||this||{},o,a,u,s),void(d(u,a)&&r===u[a]||t.call({o:u,s:e},o,a))):(t.call({o:u,s:e},o,a),o)})};}();var c,l=e.obj,p=l.as,d=l.has,h=l.is,v=l.map,g=l.copy,m=e.num,b=m.is,k=e.fn,y=k.is,x=i._;n.exports=o;})(t,"./state"),t(function(n){var o=t("./type"),e=t("./val"),i=t("./node"),r={};!function(){function t(t,o){return t&&o===i.soul(t)&&i.is(t,this.fn,this.as)?void(this.cb&&(n.n=t,n.as=this.as,this.cb.call(n.as,t,o,n))):!0}function n(t){t&&i.is(n.n,t,n.as);}r.is=function(n,o,e,i){return n&&s(n)&&!l(n)?!d(n,t,{cb:o,fn:e,as:i}):!1};}(),function(){function t(t,o){var r;return (r=p(t,o))?r:(o.env=t,o.soul=u,i.ify(o.obj,n,o)&&(o.rel=o.rel||e.rel.ify(i.soul(o.node)),o.obj!==t.shell&&(t.graph[e.rel.is(o.rel)]=o.node)),o)}function n(n,o,r){var u,s,p=this,d=p.env;if(i._===o&&c(n,e.rel._))return r._;if(u=l(n,o,r,p,d)){if(o||(p.node=p.node||r||{},c(n,i._)&&i.soul(n)&&(p.node._=h(n._)),p.node=i.soul.ify(p.node,e.rel.is(p.rel)),p.rel=p.rel||e.rel.ify(i.soul(p.node))),(s=d.map)&&(s.call(d.as||{},n,o,r,p),c(r,o))){if(n=r[o],a===n)return void f(r,o);if(!(u=l(n,o,r,p,d)))return}if(!o)return p.node;if(!0===u)return n;if(s=t(d,{obj:n,path:p.path.concat(o)}),s.node)return s.rel}}function u(t){var n=this,o=e.link.is(n.rel),r=n.env.graph;n.rel=n.rel||e.rel.ify(t),n.rel[e.rel._]=t,n.node&&n.node[i._]&&(n.node[i._][e.rel._]=t),c(r,o)&&(r[t]=r[o],f(r,o));}function l(t,n,i,r,a){var u;return e.is(t)?!0:s(t)?1:(u=a.invalid)?(t=u.call(a.as||{},t,n,i),l(t,n,i,r,a)):(a.err="Invalid value at '"+r.path.concat(n).join(".")+"'!",void(o.list.is(t)&&(a.err+=" Use `.set(item)` instead of an Array.")))}function p(t,n){for(var o,e=t.seen,i=e.length;i--;)if(o=e[i],n.obj===o.obj)return o;e.push(n);}r.ify=function(n,o,i){var r={path:[],obj:n};return o?"string"==typeof o?o={soul:o}:o instanceof Function&&(o.map=o):o={},o.soul&&(r.rel=e.rel.ify(o.soul)),o.shell=(i||{}).shell,o.graph=o.graph||{},o.seen=o.seen||[],o.as=o.as||i,t(o,r),o.root=r.node,o.graph};}(),r.node=function(t){var n=i.soul(t);if(n)return p({},n,t)},function(){function t(t,n){var o,a;if(i._===n){if(l(t,e.rel._))return;return void(this.obj[n]=h(t))}return (o=e.rel.is(t))?(a=this.opt.seen[o])?void(this.obj[n]=a):void(this.obj[n]=this.opt.seen[o]=r.to(this.graph,o,this.opt)):void(this.obj[n]=t)}r.to=function(n,o,e){if(n){var i={};return e=e||{seen:{}},d(n[o],t,{obj:i,graph:n,opt:e}),i}};}();var a,u=(o.fn.is,o.obj),s=u.is,f=u.del,c=u.has,l=u.empty,p=u.put,d=u.map,h=u.copy;n.exports=r;})(t,"./graph"),t(function(n){t("./onto"),n.exports=function(t,n){if(this.on){if(!(t instanceof Function)){if(!t||!n)return;var o=t["#"]||t,e=(this.tag||empty)[o];if(!e)return;return e=this.on(o,n),clearTimeout(e.err),!0}var o=n&&n["#"]||Math.random().toString(36).slice(2);if(!t)return o;var i=this.on(o,t,n);return i.err=i.err||setTimeout(function(){i.next({err:"Error: No ACK received yet.",lack:!0}),i.off();},(this.opt||{}).lack||9e3),o}};})(t,"./ask"),t(function(n){function o(t){var n={s:{}};return t=t||{max:1e3,age:9e3},n.check=function(t){var o;return (o=n.s[t])?o.pass?o.pass=!1:n.track(t):!1},n.track=function(o,r){var a=n.s[o]||(n.s[o]={});return a.was=i(),r&&(a.pass=!0),n.to||(n.to=setTimeout(function(){var o=i();e.obj.map(n.s,function(i,r){i&&t.age>o-i.was||e.obj.del(n.s,r);}),n.to=null;},t.age+9)),a},n}var e=t("./type"),i=e.time.is;n.exports=o;})(t,"./dup"),t(function(n){function i(t){return t instanceof i?(this._={gun:this,$:this}).$:this instanceof i?i.create(this._={gun:this,$:this,opt:t}):new i(t)}i.is=function(t){return t instanceof i||t&&t._&&t===t._.$||!1},i.version=.9,i.chain=i.prototype,i.chain.toJSON=function(){};var r=t("./type");r.obj.to(r,i),i.HAM=t("./HAM"),i.val=t("./val"),i.node=t("./node"),i.state=t("./state"),i.graph=t("./graph"),i.on=t("./onto"),i.ask=t("./ask"),i.dup=t("./dup"),function(){function t(n){var o,e,r=this,u=r.as,s=u.at||u,f=s.$;return (e=n["#"])||(e=n["#"]=c(9)),(o=s.dup).check(e)?void(u.out===n.out&&(n.out=a,r.to.next(n))):(o.track(e),s.ask(n["@"],n)||(n.get&&i.on.get(n,f),n.put&&i.on.put(n,f)),r.to.next(n),void(u.out||(n.out=t,s.on("out",n))))}i.create=function(n){n.root=n.root||n,n.graph=n.graph||{},n.on=n.on||i.on,n.ask=n.ask||i.ask,n.dup=n.dup||i.dup();var o=n.$.opt(n.opt);return n.once||(n.on("in",t,n),n.on("out",t,{at:n,out:t}),i.on("create",n),n.on("create",n)),n.once=1,o};}(),function(){function t(t,n,o,e){var r=this,a=i.state.is(o,n);if(!a)return r.err="Error: No state on '"+n+"' in node '"+e+"'!";var u=r.graph[e]||k,s=i.state.is(u,n,!0),f=u[n],c=i.HAM(r.machine,a,s,t,f);return c.incoming?(r.put[e]=i.state.to(o,n,r.put[e]),(r.diff||(r.diff={}))[e]=i.state.to(o,n,r.diff[e]),void(r.souls[e]=!0)):void(c.defer&&(r.defer=a<(r.defer||1/0)?a:r.defer))}function n(t,n){var i=this,a=i.$._,u=(a.next||k)[n];if(!u){if(!(a.opt||k)["super"])return void(i.souls[n]=!1);u=i.$.get(n)._;}var s=i.map[n]={put:t,get:n,$:u.$},f={ctx:i,msg:s};i.async=!!a.tag.node,i.ack&&(s["@"]=i.ack),v(t,o,f),i.async&&(i.and||a.on("node",function(t){this.to.next(t),t===i.map[t.get]&&(i.souls[t.get]=!1,v(t.put,e,t),v(i.souls,function(t){return t?t:void 0})||i.c||(i.c=1,this.off(),v(i.map,r,i)));}),i.and=!0,a.on("node",s));}function o(t,n){var o=this.ctx,e=o.graph,r=this.msg,a=r.get,u=r.put,s=r.$._;e[a]=i.state.to(u,n,e[a]),o.async||(s.put=i.state.to(u,n,s.put));}function e(t,n){var o=this,e=o.put,r=o.$._;r.put=i.state.to(e,n,r.put);}function r(t){t.$&&(this.cat.stop=this.stop,t.$._.on("in",t),this.cat.stop=null);}i.on.put=function(o,e){var u=e._,s={$:e,graph:u.graph,put:{},map:{},souls:{},machine:i.state(),ack:o["@"],cat:u,stop:{}};return i.graph.is(o.put,null,t,s)||(s.err="Error: Invalid graph!"),s.err?u.on("in",{"@":o["#"],err:i.log(s.err)}):(v(s.put,n,s),s.async||v(s.map,r,s),a!==s.defer&&setTimeout(function(){i.on.put(o,e);},s.defer-s.machine),void(s.diff&&u.on("put",h(o,{put:s.diff}))))},i.on.get=function(t,n){var o,e=n._,r=t.get,a=r[m],u=e.graph[a],s=r[b],f=e.next||(e.next={}),c=f[a];if(d(a,"*")){var l={};i.obj.map(e.graph,function(t,n){i.text.match(n,a)&&(l[n]=i.obj.copy(t));}),i.obj.empty(l)||e.on("in",{"@":t["#"],how:"*",put:l,$:n});}if(!u)return e.on("get",t);if(s){if(!d(u,s))return e.on("get",t);u=i.state.to(u,s);}else u=i.obj.copy(u);u=i.graph.node(u),o=(c||k).ack,e.on("in",{"@":t["#"],how:"mem",put:u,$:n}),e.on("get",t);};}(),function(){i.chain.opt=function(t){t=t||{};var n=this,o=n._,e=t.peers||t;return p(t)||(t={}),p(o.opt)||(o.opt=t),f(e)&&(e=[e]),u(e)&&(e=v(e,function(t,n,o){o(t,{url:t});}),p(o.opt.peers)||(o.opt.peers={}),o.opt.peers=h(e,o.opt.peers)),o.opt.peers=o.opt.peers||{},h(t,o.opt),i.on("opt",o),o.opt.uuid=o.opt.uuid||function(){return g()+c(12)},n};}();var a,u=i.list.is,s=i.text,f=s.is,c=s.random,l=i.obj,p=l.is,d=l.has,h=l.to,v=l.map,g=(l.copy,i.state.lex),m=i.val.rel._,b=".",k=(i.node._,i.val.link.is,{});o.debug=function(t,n){return o.debug.i&&t===o.debug.i&&o.debug.i++&&(o.log.apply(o,arguments)||n)},i.log=function(){return !i.log.off&&o.log.apply(o,arguments),[].slice.call(arguments).join(" ")},i.log.once=function(t,n,o){return (o=i.log.once)[t]=o[t]||0,o[t]++||i.log(n)},i.log.once("welcome","Hello wonderful person! :) Thanks for using GUN, feel free to ask for help on https://gitter.im/amark/gun and ask StackOverflow questions tagged with 'gun'!"),"undefined"!=typeof window&&((window.GUN=window.Gun=i).window=window);try{"undefined"!=typeof e&&(e.exports=i);}catch(y){}n.exports=i;})(t,"./root"),t(function(){var n=t("./root");n.chain.back=function(t,i){var r;if(t=t||1,-1===t||1/0===t)return this._.root.$;if(1===t)return (this._.back||this._).$;var a=this,u=a._;if("string"==typeof t&&(t=t.split(".")),!(t instanceof Array)){if(t instanceof Function){for(var s,r={back:u};(r=r.back)&&o===(s=t(r,i)););return s}return n.num.is(t)?(u.back||u).$.back(t-1):this}var f=0,c=t.length,r=u;for(f;c>f;f++)r=(r||e)[t[f]];return o!==r?i?a:r:(r=u.back)?r.$.back(t,i):void 0};var o,e={};})(t,"./back"),t(function(){function n(t){var n,o,e,i=this.as,r=i.back,a=i.root;if(t.I||(t.I=i.$),t.$||(t.$=i.$),this.to.next(t),o=t.get){if(o["#"]||i.soul){if(o["#"]=o["#"]||i.soul,t["#"]||(t["#"]=b(9)),r=a.$.get(o["#"])._,o=o["."]){if(h(r.put,o)&&(n=r.$.get(o)._,(e=n.ack)||(n.ack=-1),r.on("in",{$:r.$,put:c.state.to(r.put,o),get:r.get}),e))return}else{if(e=r.ack,e||(r.ack=-1),h(r,"put")&&r.on("in",r),e)return;t.$=r.$;}return a.ask(f,t),a.on("in",t)}if(a.now&&(a.now[i.id]=a.now[i.id]||!0,i.pass={}),o["."])return i.get?(t={get:{".":i.get},$:i.$},r.ask||(r.ask={}),r.ask[i.get]=t.$._,r.on("out",t)):(t={get:{},$:i.$},r.on("out",t));if(i.ack=i.ack||-1,i.get)return t.$=i.$,o["."]=i.get,(r.ask||(r.ask={}))[i.get]=t.$._,r.on("out",t)}return r.on("out",t)}function o(t){var n,o,r=this,s=r.as,f=s.root,d=t.$,b=(d||p)._||p,k=t.put;if(s.get&&t.get!==s.get&&(t=g(t,{get:s.get})),s.has&&b!==s&&(t=g(t,{$:s.$}),b.ack&&(s.ack=b.ack)),l===k){if(o=b.put,r.to.next(t),s.soul)return;if(l===o&&l!==b.put)return;return i(s,t,r),s.has&&u(s,t),v(b.echo,s.id),void v(s.map,b.id)}if(s.soul)return r.to.next(t),i(s,t,r),void(s.next&&m(k,a,{msg:t,cat:s}));if(!(n=c.val.link.is(k)))return c.val.is(k)?(s.has||s.soul?u(s,t):(b.has||b.soul)&&((b.echo||(b.echo={}))[s.id]=b.echo[b.id]||s,(s.map||(s.map={}))[b.id]=s.map[b.id]||{at:b}),r.to.next(t),void i(s,t,r)):(s.has&&b!==s&&h(b,"put")&&(s.put=b.put),(n=c.node.soul(k))&&b.has&&(b.put=s.root.$.get(n)._.put),o=(f.stop||{})[b.id],r.to.next(t),e(s,t,b,n),i(s,t,r),void(s.next&&m(k,a,{msg:t,cat:s})));f.stop;o=f.stop||{},o=o[b.id]||(o[b.id]={}),o.is=o.is||b.put,o[s.id]=b.put||!0,r.to.next(t),e(s,t,b,n),i(s,t,r);}function e(t,n,o,i){if(i&&k!==t.get){var r=t.root.$.get(i)._;t.has?o=r:o.has&&e(o,n,o,i),o!==t&&(o.$||(o={}),(o.echo||(o.echo={}))[t.id]=o.echo[t.id]||t,t.has&&!(t.map||p)[o.id]&&u(t,n),r=o.id?(t.map||(t.map={}))[o.id]=t.map[o.id]||{at:o}:{},(i!==r.link||r.pass||t.pass)&&(t.pass&&(c.obj.map(t.map,function(t){t.pass=!0;}),v(t,"pass")),r.pass&&v(r,"pass"),t.has&&(t.link=i),s(t,r.link=i)));}}function i(t,n){t.echo&&m(t.echo,r,n);}function r(t){t&&t.on&&t.on("in",this);}function a(t,n){var o,e,i,r=this.cat,a=r.next||p,u=this.msg;(k!==n||a[n])&&(e=a[n])&&(e.has?(l!==e.put&&c.val.link.is(t)||(e.put=t),o=e.$):(i=u.$)&&(i=(o=u.$.get(n))._,l!==i.put&&c.val.link.is(t)||(i.put=t)),e.on("in",{put:t,get:n,$:o,via:u}));}function u(t,n){if(t.has||t.soul){{var o=t.map;t.root;}t.map=null,t.has&&(t.link=null),(t.pass||n["@"]||null!==o)&&(l===o&&c.val.link.is(t.put)||(m(o,function(n){(n=n.at)&&v(n.echo,t.id);}),o=t.put,m(t.next,function(n,e){return l===o&&l!==t.put?!0:(n.put=l,n.ack&&(n.ack=-1),void n.on("in",{get:e,$:n.$,put:l}))})));}}function s(t,n){var o=t.root.$.get(n)._;(!t.ack||(o.on("out",{get:{"#":n}}),t.ask))&&(o=t.ask,c.obj.del(t,"ask"),m(o||t.next,function(t,o){t.on("out",{get:{"#":n,".":o}});}),c.obj.del(t,"ask"));}function f(t){var n=this.as,o=n.get||p,e=n.$._,i=(t.put||p)[o["#"]];if(e.ack&&(e.ack=e.ack+1||1),!t.put||o["."]&&!h(i,e.get)){if(e.put!==l)return;return void e.on("in",{get:e.get,put:e.put=l,$:e.$,"@":t["@"]})}return k==o["."]?void e.on("in",{get:e.get,put:c.val.link.ify(o["#"]),$:e.$,"@":t["@"]}):(t.$=e.root.$,void c.on.put(t,e.root.$))}var c=t("./root");c.chain.chain=function(t){var e,i=this,r=i._,a=new(t||i).constructor(i),u=a._;return u.root=e=r.root,u.id=++e.once,u.back=i._,u.on=c.on,u.on("in",o,u),u.on("out",n,u),a};var l,p={},d=c.obj,h=d.has,v=(d.put,d.del),g=d.to,m=d.map,b=c.text.random,k=(c.val.rel._,c.node._);})(t,"./chain"),t(function(){function n(t,n){var o=n._,e=o.next,i=n.chain(),r=i._;return e||(e=o.next={}),e[r.get=t]=r,n===o.root.$?r.soul=t:(o.soul||o.has)&&(r.has=t),r}function o(t,n,o,e){var i,r=t._,u=0;return (i=r.soul)?(n(i,e,r),t):(i=r.link)?(n(i,e,r),t):(t.get(function(t,o){if(!(a===t.put&&(i=(s(r.root.opt.peers,function(t,n,o){o(n);})||[]).length)&&u++<=i)){o.rid(t);var f=(f=t.$)&&f._||{};i=f.link||f.soul||l.is(t.put)||p(t.put)||f.dub,n(i,e,t,o);}},{out:{get:{".":!0}}}),t)}function e(t){var n,o=this,e=o.as,i=e.at,u=i.root,s=t.$,c=(s||{})._||{},p=t.put||c.put;if((n=u.now)&&o!==n[e.now])return o.to.next(t);if(o.seen&&c.id&&o.seen[c.id])return o.to.next(t);if((n=p)&&n[l._]&&(n=l.is(n))&&(n=(t.$$=c.root.gun.get(n))._,a!==n.put&&(t=f(t,{put:p=n.put}))),(n=u.mum)&&c.id){var d=c.id+(o.id||(o.id=r.text.random(9)));if(n[d])return;a===p||l.is(p)||(n[d]=!0);}return e.use(t,o),o.stun?void(o.stun=null):void o.to.next(t)}function i(t){var n=this.on;if(!t||n.soul||n.has)return this.off();if(t=(t=(t=t.$||t)._||t).id){{var o,e;n.map;}return (o=(e=this.seen||(this.seen={}))[t])?!0:void(e[t]=!0)}}var r=t("./root");r.chain.get=function(t,a,u){var s,f;if("string"!=typeof t){if(t instanceof Function){if(!0===a)return o(this,t,a,u);s=this;var p,h=s._,v=h.root,f=v.now;u=a||{},u.at=h,u.use=t,u.out=u.out||{},u.out.get=u.out.get||{},(p=h.on("in",e,u)).rid=i,(v.now={$:1})[u.now=h.id]=p;var g=v.mum;return v.mum={},h.on("out",u.out),v.mum=g,v.now=f,s}return c(t)?this.get(""+t,a,u):(f=l.is(t))?this.get(f,a,u):((u=this.chain())._.err={err:r.log("Invalid get request!",t)},a&&a.call(u,u._.err),u)}var m=this,b=m._,k=b.next||d;return (s=k[t])||(s=n(t,m)),s=s.$,(f=b.stun)&&(s._.stun=s._.stun||f),a&&a instanceof Function&&s.get(a,u),s};var a,u=r.obj,s=u.map,f=(u.has,r.obj.to),c=r.num.is,l=r.val.link,p=r.node.soul,d=(r.node._,{});})(t,"./get"),t(function(){function n(t){t.batch=i;var n=t.opt||{},o=t.env=c.state.map(a,n.state);return o.soul=t.soul,t.graph=c.graph.ify(t.data,o,t),o.err?((t.ack||m).call(t,t.out={err:c.log(o.err)}),void(t.res&&t.res())):void t.batch()}function e(t){return void(t&&t())}function i(){var t=this;t.graph&&!v(t.stun,r)&&(t.res=t.res||function(t){t&&t();},t.res(function(){var n=t.$.back(-1)._,o=n.ask(function(o){n.root.on("ack",o),o.err&&c.log(o),o.lack||this.off(),t.ack&&t.ack(o,this);},t.opt),e=n.root.now;p.del(n.root,"now");var i=n.root.mum;n.root.mum={},t.ref._.on("out",{$:t.ref,put:t.out=t.env.graph,opt:t.opt,"#":o}),n.root.mum=i?p.to(i,n.root.mum):i,n.root.now=e;},t),t.res&&t.res());}function r(t){return t?!0:void 0}function a(t,n,o,e){var i=this,r=c.is(t);!n&&e.path.length&&(i.res||b)(function(){var n=e.path,o=i.ref,a=(i.opt,0),s=n.length;for(a;s>a;a++)o=o.get(n[a]);r&&(o=t);var f=o._.dub;return f||(f=c.node.soul(e.obj))?(o.back(-1).get(f),void e.soul(f)):((i.stun=i.stun||{})[n]=!0,void o.get(u,!0,{as:{at:e,as:i,p:n}}))},{as:i,at:e});}function u(t,n,o,e){var n=n.as,i=n.at;n=n.as;var r=((o||{}).$||{})._||{};return t=r.dub=r.dub||t||c.node.soul(i.obj)||c.node.soul(o.put||r.put)||c.val.rel.is(o.put||r.put)||(n.via.back("opt.uuid")||c.text.random)(),e&&(e.stun=!0),t?void s(r,r.dub=t,i,n):void r.via.back("opt.uuid")(function(t,o){return t?c.log(t):void s(r,r.dub=r.dub||o,i,n)})}function s(t,n,o,e){t.$.back(-1).get(n),o.soul(n),e.stun[o.path]=!1,e.batch();}function f(t,n,e,i){if(n=n.as,e.$&&e.$._){if(e.err)return void o.log("Please report this as an issue! Put.any.err");var r,a=e.$._,u=a.put,s=n.opt||{};if(!(r=n.ref)||!r._.now){if(i&&(i.stun=!0),n.ref!==n.$){if(r=n.$._.get||a.get,!r)return void o.log("Please report this as an issue! Put.no.get");n.data=h({},r,n.data),r=null;}if(l===u){if(!a.get)return;t||(r=a.$.back(function(t){return t.link||t.soul?t.link||t.soul:void(n.data=h({},t.get,n.data))})),r=r||a.soul||a.link||a.dub,a=r?a.root.$.get(r)._:a,n.soul=r,u=n.data;}return n.not||(n.soul=n.soul||t)||(n.path&&d(n.data)?n.soul=(s.uuid||n.via.back("opt.uuid")||c.text.random)():(k==a.get&&(n.soul=(a.put||g)["#"]||a.dub),n.soul=n.soul||a.soul||a.soul||(s.uuid||n.via.back("opt.uuid")||c.text.random)()),n.soul)?void n.ref.put(n.data,n.soul,n):void n.via.back("opt.uuid")(function(t,o){return t?c.log(t):void n.ref.put(n.data,n.soul=o,n)})}}}var c=t("./root");c.chain.put=function(t,o,i){var r,a=this,u=a._,s=u.root.$;return i=i||{},i.data=t,i.via=i.$=i.via||i.$||a,"string"==typeof o?i.soul=o:i.ack=i.ack||o,u.soul&&(i.soul=u.soul),i.soul||s===a?d(i.data)?(i.soul=i.soul||(i.not=c.node.soul(i.data)||(i.via.back("opt.uuid")||c.text.random)()),i.soul?(i.$=s.get(i.soul),i.ref=i.$,n(i),a):(i.via.back("opt.uuid")(function(t,n){return t?c.log(t):void(i.ref||i.$).put(i.data,i.soul=n,i)}),a)):((i.ack||m).call(i,i.out={err:c.log("Data saved to the root level of the graph must be a node (an object), not a",typeof i.data,'of "'+i.data+'"!')}),i.res&&i.res(),a):c.is(t)?(t.get(function(t,n,e){return !t&&c.val.is(e.put)?c.log("The reference you are saving is a",typeof e.put,'"'+e.put+'", not a node (object)!'):void a.put(c.val.rel.ify(t),o,i)},!0),a):(i.ref=i.ref||s._===(r=u.back)?a:r.$,i.ref._.soul&&c.val.is(i.data)&&u.get?(i.data=h({},u.get,i.data),i.ref.put(i.data,i.soul,i),a):(i.ref.get(f,!0,{as:i}),i.out||(i.res=i.res||e,i.$._.stun=i.ref._.stun),a))};var l,p=c.obj,d=p.is,h=p.put,v=p.map,g={},m=function(){},b=function(t,n){t.call(n||g);},k=c.node._;})(t,"./put"),t(function(n){var o=t("./root");t("./chain"),t("./back"),t("./put"),t("./get"),n.exports=o;})(t,"./index"),t(function(){function n(t,n){{var o,e=this,r=t.$,a=(r||{})._||{},u=a.put||t.put;e.at;}if(i!==u){if(o=t.$$){if(o=t.$$._,i===o.put)return;u=o.put;}e.change&&(u=t.put),e.as?e.ok.call(e.as,t,n):e.ok.call(r,u,t.get,t,n);}}function o(t,n,r){var u,f,c=this.as,l=(c.at,t.$),p=l._,d=p.put||t.put;return (f=t.$$)&&(u=f=t.$$._,i!==u.put&&(d=u.put)),(f=n.wait)&&(f=f[p.id])&&clearTimeout(f),!r&&(i===d||p.soul||p.link||u&&!(0<u.ack))||i===d&&(f=(a(p.root.opt.peers,function(t,n,o){o(n);})||[]).length)&&!r&&(u||p).ack<=f?void(f=(n.wait={})[p.id]=setTimeout(function(){o.call({as:c},t,n,f||1);},c.wait||99)):(u&&i===u.put&&(f=s.is(d))&&(d=e.node.ify({},f)),n.rid(t),void c.ok.call(l||c.$,d,t.get))}var e=t("./index");e.chain.on=function(t,o,e,i){var r,a=this,u=a._;if("string"==typeof t)return o?(r=u.on(t,o,e||u,i),e&&e.$&&(e.subs||(e.subs=[])).push(r),a):u.on(t);var s=o;return s=!0===s?{change:!0}:s||{},s.at=u,s.ok=t,a.get(n,s),a},e.chain.val=function(t,n){return e.log.once("onceval","Future Breaking API Change: .val -> .once, apologies unexpected."),this.once(t,n)},e.chain.once=function(t,n){var r=this,a=r._,u=a.put;if(0<a.ack&&i!==u)return (t||f).call(r,u,a.get),r;if(!t){e.log.once("valonce","Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");var s=r.chain();return s._.nix=r.once(function(){s._.on("in",r._);}),s}return (n=n||{}).ok=t,n.at=a,n.out={"#":e.text.random(9)},r.get(o,{as:n}),n.async=!0,r},e.chain.off=function(){var t,n=this,o=n._,e=o.back;return e?((t=e.next)&&t[o.get]&&u(t,o.get),(t=e.ask)&&u(t,o.get),(t=e.put)&&u(t,o.get),(t=o.soul)&&u(e.root.graph,t),(t=o.map)&&a(t,function(t){t.link&&e.root.$.get(t.link).off();}),(t=o.next)&&a(t,function(t){t.$.off();}),o.on("off",{}),n):void 0};var i,r=e.obj,a=r.map,u=(r.has,r.del),s=(r.to,e.val.link),f=function(){};})(t,"./on"),t(function(){function n(t){return !t.put||e.val.is(t.put)?this.to.next(t):(this.as.nix&&this.off(),r(t.put,o,{at:this.as,msg:t}),void this.to.next(t))}function o(t,n){if(u!==n){var o=this.msg,e=o.$,i=this.at,r=e.get(n)._;(r.echo||(r.echo={}))[i.id]=r.echo[i.id]||i;}}var e=t("./index");e.chain.map=function(t){var o,r=this,u=r._;return t?(e.log.once("mapfn","Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it."),o=r.chain(),r.map().on(function(n,r,u,s){var f=(t||a).call(this,n,r,u,s);if(i!==f)return n===f?o._.on("in",u):e.is(f)?o._.on("in",f._):void o._.on("in",{get:r,put:f})}),o):(o=u.each)?o:(u.each=o=r.chain(),o._.nix=r.back("nix"),r.on("in",n,o._),o)};var i,r=e.obj.map,a=function(){},u=e.node._;})(t,"./map"),t(function(){var n=t("./index");n.chain.set=function(t,o,e){var i,r=this;return o=o||function(){},e=e||{},e.item=e.item||t,(i=n.node.soul(t))&&(t=n.obj.put({},i,n.val.link.ify(i))),n.is(t)?(t.get(function(t,i,a){return t?void r.put(n.obj.put({},t,n.val.link.ify(t)),o,e):o.call(r,{err:n.log('Only a node can be linked! Not "'+a.put+'"!')})},!0),t):(n.obj.is(t)&&(t=r.back(-1).get(i=i||n.node.soul(t)||r.back("opt.uuid")()).put(t)),r.get(i||n.state.lex()+n.text.random(7)).put(t,o,e))};})(t,"./set"),t(function(){if("undefined"!=typeof Gun){var t,n=function(){};try{t=(Gun.window||n).localStorage;}catch(e){}t||(o.log("Warning: No localStorage exists to persist data to!"),t={setItem:function(t,n){this[t]=n;},removeItem:function(t){delete this[t];},getItem:function(t){return this[t]}}),Gun.on("create",function(n){function o(t){if(!t.err&&t.ok){var n=t["@"];setTimeout(function(){Gun.obj.map(u,function(t,o){Gun.obj.map(t,function(o,e){n===o&&delete t[e];}),s(t)&&delete u[o];}),p();},i.wait||1);}}var e=this.to,i=n.opt;if(n.once)return e.next(n);i.prefix=i.file||"gun/";var r,a,u=Gun.obj.ify(t.getItem("gap/"+i.prefix))||{},s=Gun.obj.empty;if(!s(u)){var f=Gun.obj.ify(t.getItem(i.prefix))||{},c={};Gun.obj.map(u,function(t,n){Gun.obj.map(t,function(t,o){c[n]=Gun.state.to(f[n],o,c[n]);});}),setTimeout(function(){n.on("out",{put:c,"#":n.ask(o),I:n.$});},1);}n.on("out",function(t){t.lS||(t.I&&t.put&&!t["@"]&&!s(i.peers)&&(r=t["#"],Gun.graph.is(t.put,null,l),a||(a=setTimeout(p,i.wait||1))),this.to.next(t));}),n.on("ack",o),e.next(n);var l=function(t,n,o,e){(u[e]||(u[e]={}))[n]=r;},p=function(){clearTimeout(a),a=!1;try{t.setItem("gap/"+i.prefix,JSON.stringify(u));}catch(n){Gun.log(err=n||"localStorage failure");}};}),Gun.on("create",function(n){this.to.next(n);var o=n.opt;if(!n.once&&!1!==o.localStorage){o.prefix=o.file||"gun/";var e,i=(n.graph,{}),r=0,a=Gun.obj.ify(t.getItem(o.prefix))||{};n.on("localStorage",a),n.on("put",function(t){return this.to.next(t),Gun.graph.is(t.put,null,u),t["@"]||(i[t["#"]]=!0),r+=1,r>=(o.batch||1e3)?s():void(e||(e=setTimeout(s,o.wait||1)))}),n.on("get",function(t){function e(){if(s&&(i=s["#"])){var e=s["."];r=a[i]||u,r&&e&&(r=Gun.state.to(r,e)),(r||Gun.obj.empty(o.peers))&&n.on("in",{"@":t["#"],put:Gun.graph.node(r),how:"lS",lS:t.I});}}this.to.next(t);var i,r,u,s=t.get;Gun.debug?setTimeout(e,1):e();});var u=function(t,n,o,e){a[e]=Gun.state.to(o,n,a[e]);},s=function(u){var f;r=0,clearTimeout(e),e=!1;var c=i;i={},u&&(a=u);try{t.setItem(o.prefix,JSON.stringify(a));}catch(l){Gun.log(f=(l||"localStorage failure")+" Consider using GUN's IndexedDB plugin for RAD for more storage space, temporary example at https://github.com/amark/gun/blob/master/test/tmp/indexedDB.html ."),n.on("localStorage:error",{err:f,file:o.prefix,flush:a,retry:s});}(f||Gun.obj.empty(o.peers))&&Gun.obj.map(c,function(t,o){n.on("in",{"@":o,err:f,ok:0});});};}});}})(t,"./adapters/localStorage"),t(function(n){function e(t){var n=function(){},u=t.opt||{};return u.log=u.log||o.log,u.gap=u.gap||u.wait||1,u.pack=u.pack||.3*(u.memory?1e3*u.memory*1e3:1399e6),n.out=function(o){var e;return this.to&&this.to.next(o),(e=o["@"])&&(e=t.dup.s[e])&&(e=e.it)&&e.mesh?(n.say(o,e.mesh.via,1),void(e["##"]=o["##"])):void n.say(o)},t.on("create",function(o){o.opt.pid=o.opt.pid||i.text.random(9),this.to.next(o),t.on("out",n.out);}),n.hear=function(o,e){if(o){var r,a,s,f=t.dup,c=o[0];if(u.pack<=o.length)return n.say({dam:"!",err:"Message too big!"},e);try{s=JSON.parse(o);}catch(l){u.log("DAM JSON parse error",l);}if("{"===c){if(!s)return;if(f.check(r=s["#"]))return;if(f.track(r,!0).it=s,(c=s["@"])&&s.put&&(a=s["##"]||(s["##"]=n.hash(s)),(c+=a)!=r)){if(f.check(c))return;(c=f.s)[a]=c[r];}return (s.mesh=function(){}).via=e,(c=s["><"])&&(s.mesh.to=i.obj.map(c.split(","),function(t,n,o){o(t,!0);})),s.dam?void((c=n.hear[s.dam])&&c(s,e,t)):void t.on("in",s)}if("["!==c);else{if(!s)return;for(var p,d=0;p=s[d++];)n.hear(p,e);}}},function(){function o(t){var n=t.batch;if(n&&(t.batch=t.tail=null,n.length))try{e(JSON.stringify(n),t);}catch(o){u.log("DAM JSON stringify error",o);}}function e(t,n){var o=n.wire;try{o.send?o.send(t):n.say&&n.say(t);}catch(e){(n.queue=n.queue||[]).push(t);}}n.say=function(r,s,f){if(!s)return void i.obj.map(u.peers,function(t){n.say(r,t);});var c,l,p,d=s.wire||u.wire&&u.wire(s);if(d&&(l=r.mesh||a,s!==l.via&&((p=l.raw)||(p=n.raw(r)),!((c=r["@"])&&(c=t.dup.s[c])&&(c=c.it)&&c.get&&c["##"]&&c["##"]===r["##"]||(c=l.to)&&(c[s.url]||c[s.id])&&!f)))){if(s.batch){if(s.tail=(s.tail||0)+p.length,s.tail<=u.pack)return void s.batch.push(p);o(s);}s.batch=[],setTimeout(function(){o(s);},u.gap),e(p,s);}};}(),function(){function o(t,n){var o;return n instanceof Object?(i.obj.map(Object.keys(n).sort(),a,{to:o={},on:n}),o):n}function a(t){this.to[t]=this.on[t];}n.raw=function(e){if(!e)return "";var a,c,l,p=t.dup,d=e.mesh||{};if(l=d.raw)return l;if("string"==typeof e)return e;e["@"]&&(l=e.put)&&((c=e["##"])||(a=s(l,o)||"",c=n.hash(e,a),e["##"]=c),(l=p.s)[c=e["@"]+c]=l[e["#"]],e["#"]=c||e["#"],a&&((e=i.obj.to(e)).put=f));var h=0,v=[];i.obj.map(u.peers,function(t){return v.push(t.url||t.id),++h>9?!0:void 0}),e["><"]=v.join();var g=s(e);return r!==a&&(l=g.indexOf(f,g.indexOf("put")),g=g.slice(0,l-1)+a+g.slice(l+f.length+1)),d&&(d.raw=g),g},n.hash=function(t,n){return e.hash(n||s(t.put,o)||"")||t["#"]||i.text.random(9)};var s=JSON.stringify,f=":])([:";}(),n.hi=function(o){var e=o.wire||{};o.id||o.url?(u.peers[o.url||o.id]=o,i.obj.del(u.peers,e.id)):(e=e.id=e.id||i.text.random(9),n.say({dam:"?"},u.peers[e]=o)),e.hied||t.on(e.hied="hi",o),e=o.queue,o.queue=[],i.obj.map(e,function(t){n.say(t,o);});},n.bye=function(n){
	i.obj.del(u.peers,n.id),t.on("bye",n);},n.hear["!"]=function(t){u.log("Error:",t.err);},n.hear["?"]=function(t,o){return t.pid?(o.id=o.id||t.pid,void n.hi(o)):n.say({dam:"?",pid:u.pid,"@":t["#"]},o)},n}var i=t("../type");e.hash=function(t){if("string"!=typeof t)return {err:1};var n=0;if(!t.length)return n;for(var o,e=0,i=t.length;i>e;++e)o=t.charCodeAt(e),n=(n<<5)-n+o,n|=0;return n};var r,a={};Object.keys=Object.keys||function(t){return map(t,function(t,n,o){o(n);})};try{n.exports=e;}catch(u){}})(t,"./adapters/mesh"),t(function(){var n=t("../index");n.Mesh=t("./mesh"),n.on("opt",function(t){function o(t){try{if(!t||!t.url)return o&&o(t);var n=t.url.replace("http","ws"),o=t.wire=new i.WebSocket(n);return o.onclose=function(){i.mesh.bye(t),e(t);},o.onerror=function(n){e(t),n&&"ECONNREFUSED"===n.code;},o.onopen=function(){i.mesh.hi(t);},o.onmessage=function(n){n&&i.mesh.hear(n.data||n,t);},o}catch(r){}}function e(t){clearTimeout(t.defer),t.defer=setTimeout(function(){o(t);},2e3);}this.to.next(t);var i=t.opt;if(!t.once&&!1!==i.WebSocket){var r;"undefined"!=typeof window&&(r=window),"undefined"!=typeof commonjsGlobal&&(r=commonjsGlobal),r=r||{};var a=i.WebSocket||r.WebSocket||r.webkitWebSocket||r.mozWebSocket;if(a){i.WebSocket=a;{i.mesh=i.mesh||n.Mesh(t),i.wire;}i.wire=o;}}});})(t,"./adapters/websocket");}();
	});

	var myKey = void 0;

	/**
	* Key management utils
	*/

	var Key = function () {
	  function Key() {
	    _classCallCheck(this, Key);
	  }

	  /**
	  * Load default key from datadir/private.key on node.js or from local storage 'identifi.myKey' in browser.
	  *
	  * If default key does not exist, it is generated.
	  * @param {string} datadir directory to find key from. In browser, localStorage is used instead.
	  * @returns {Object} Key object
	  */
	  Key.getDefault = async function getDefault() {
	    var datadir = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '.';

	    if (myKey) {
	      return myKey;
	    }
	    if (util$1.isNode) {
	      var fs = require('fs');
	      var privKeyFile = datadir + '/private.key';
	      if (fs.existsSync(privKeyFile)) {
	        var f = fs.readFileSync(privKeyFile, 'utf8');
	        myKey = Key.fromJwk(f);
	      } else {
	        myKey = await Key.generate();
	        fs.writeFileSync(privKeyFile, Key.toJwk(myKey));
	        fs.chmodSync(privKeyFile, 400);
	      }
	      if (!myKey) {
	        throw new Error('loading default key failed - check ' + datadir + '/private.key');
	      }
	    } else {
	      var jwk = window.localStorage.getItem('identifi.myKey');
	      if (jwk) {
	        myKey = Key.fromJwk(jwk);
	      } else {
	        myKey = await Key.generate();
	        window.localStorage.setItem('identifi.myKey', Key.toJwk(myKey));
	      }
	      if (!myKey) {
	        throw new Error('loading default key failed - check localStorage identifi.myKey');
	      }
	    }
	    return myKey;
	  };

	  /**
	  * Serialize key as JSON Web key
	  * @returns {String} JSON Web Key string
	  */


	  Key.toJwk = function toJwk(key) {
	    return _JSON$stringify(key);
	  };

	  Key.getId = function getId(key) {
	    if (!(key && key.pub)) {
	      throw new Error('missing param');
	    }
	    return key.pub; // hack until GUN supports lookups by keyID
	    //return util.getHash(key.pub);
	  };

	  /**
	  * Get a Key from a JSON Web Key object.
	  * @param {Object} jwk JSON Web Key
	  * @returns {String}
	  */


	  Key.fromJwk = function fromJwk(jwk) {
	    return JSON.parse(jwk);
	  };

	  /**
	  * Generate a new key
	  * @returns {Object} Gun.SEA private key object
	  */


	  Key.generate = function generate() {
	    return (gun_min.SEA || window.Gun.SEA).pair();
	  };

	  Key.sign = async function sign(msg, pair) {
	    var sig = await (gun_min.SEA || window.Gun.SEA).sign(msg, pair);
	    return 'a' + sig;
	  };

	  Key.verify = function verify(msg, pubKey) {
	    return (gun_min.SEA || window.Gun.SEA).verify(msg.slice(1), pubKey);
	  };

	  return Key;
	}();

	var errorMsg = 'Invalid Identifi message:';

	var ValidationError = function (_Error) {
	  _inherits(ValidationError, _Error);

	  function ValidationError() {
	    _classCallCheck(this, ValidationError);

	    return _possibleConstructorReturn(this, _Error.apply(this, arguments));
	  }

	  return ValidationError;
	}(Error);

	/**
	* Identifi message: an object that has an author, recipient, signer, type, timestamp, context and optionally other fields.
	*
	* On Identifi, signer and author can be different entities. This enables the crawling of content
	* from existing datasets. That makes Identifi an useful search tool even with no initial userbase.
	*
	* Messages are serialized as JSON Web Signatures.
	*/


	var Message = function () {
	  /**
	  * Creates a message from the param object that must contain at least the mandatory fields: author, recipient, type, context and timestamp. You can use createRating() and createVerification() to automatically populate some of these fields and optionally sign the message.
	  * @param signedData
	  */
	  function Message(obj) {
	    _classCallCheck(this, Message);

	    if (obj.signedData) {
	      this.signedData = obj.signedData;
	    }
	    if (obj.pubKey) {
	      this.pubKey = obj.pubKey;
	    }
	    if (obj.ipfsUri) {
	      this.ipfsUri = obj.ipfsUri;
	    }
	    if (obj.sig) {
	      if (typeof obj.sig !== 'string') {
	        throw new ValidationError('Message signature must be a string');
	      }
	      this.sig = obj.sig;
	      this.getHash();
	    }
	    this._validate();
	  }

	  /**
	  * @returns {string} Message signer keyID, i.e. base64 hash of public key
	  */


	  Message.prototype.getSignerKeyID = function getSignerKeyID() {
	    return this.pubKey; // hack until gun supports keyID lookups
	    //return util.getHash(this.pubKey);
	  };

	  Message.prototype._validate = function _validate() {
	    if (!this.signedData) {
	      throw new ValidationError(errorMsg + ' Missing signedData');
	    }
	    if (typeof this.signedData !== 'object') {
	      throw new ValidationError(errorMsg + ' signedData must be an object');
	    }
	    var d = this.signedData;

	    if (!d.type) {
	      throw new ValidationError(errorMsg + ' Missing type definition');
	    }
	    if (!d.author) {
	      throw new ValidationError(errorMsg + ' Missing author');
	    }
	    if (!d.author.length) {
	      throw new ValidationError(errorMsg + ' Author empty');
	    }
	    var i = void 0;
	    var authorKeyID = void 0;
	    if (this.pubKey) {
	      this.signerKeyHash = this.getSignerKeyID();
	    }
	    for (i = 0; i < d.author.length; i++) {
	      if (d.author[i].length !== 2) {
	        throw new ValidationError(errorMsg + ' Invalid author: ' + d.author[i].toString());
	      }
	      if (d.author[i][0] === 'keyID') {
	        if (authorKeyID) {
	          throw new ValidationError(errorMsg + ' Author may have only one keyID');
	        } else {
	          authorKeyID = d.author[i][1];
	        }
	        if (this.signerKeyHash && authorKeyID !== this.signerKeyHash) {
	          throw new ValidationError(errorMsg + ' If message has a keyID author, it must be signed by the same key');
	        }
	      }
	    }
	    if (!d.recipient) {
	      throw new ValidationError(errorMsg + ' Missing recipient');
	    }
	    if (!d.recipient.length) {
	      throw new ValidationError(errorMsg + ' Author empty');
	    }
	    for (i = 0; i < d.recipient.length; i++) {
	      if (d.recipient[i].length !== 2) {
	        throw new ValidationError(errorMsg + ' Invalid recipient: ' + d.recipient[i].toString());
	      }
	    }
	    if (!d.timestamp) {
	      throw new ValidationError(errorMsg + ' Missing timestamp');
	    }

	    if (!Date.parse(d.timestamp)) {
	      throw new ValidationError(errorMsg + ' Invalid timestamp');
	    }

	    if (d.type === 'rating') {
	      if (isNaN(d.rating)) {
	        throw new ValidationError(errorMsg + ' Invalid rating');
	      }
	      if (isNaN(d.maxRating)) {
	        throw new ValidationError(errorMsg + ' Invalid maxRating');
	      }
	      if (isNaN(d.minRating)) {
	        throw new ValidationError(errorMsg + ' Invalid minRating');
	      }
	      if (d.rating > d.maxRating) {
	        throw new ValidationError(errorMsg + ' Rating is above maxRating');
	      }
	      if (d.rating < d.minRating) {
	        throw new ValidationError(errorMsg + ' Rating is below minRating');
	      }
	      if (typeof d.context !== 'string' || !d.context.length) {
	        throw new ValidationError(errorMsg + ' Rating messages must have a context field');
	      }
	    }

	    if (d.type === 'verify_identity' || d.type === 'unverify_identity') {
	      if (d.recipient.length < 2) {
	        throw new ValidationError(errorMsg + ' At least 2 recipient attributes are needed for a connection / disconnection');
	      }
	    }

	    return true;
	  };

	  /**
	  * @returns {boolean} true if message has a positive rating
	  */


	  Message.prototype.isPositive = function isPositive() {
	    return this.signedData.type === 'rating' && this.signedData.rating > (this.signedData.maxRating + this.signedData.minRating) / 2;
	  };

	  /**
	  * @returns {boolean} true if message has a negative rating
	  */


	  Message.prototype.isNegative = function isNegative() {
	    return this.signedData.type === 'rating' && this.signedData.rating < (this.signedData.maxRating + this.signedData.minRating) / 2;
	  };

	  /**
	  * @returns {boolean} true if message has a neutral rating
	  */


	  Message.prototype.isNeutral = function isNeutral() {
	    return this.signedData.type === 'rating' && this.signedData.rating === (this.signedData.maxRating + this.signedData.minRating) / 2;
	  };

	  /**
	  * @param {Object} key Gun.SEA keypair to sign the message with
	  */


	  Message.prototype.sign = async function sign(key) {
	    this.sig = await Key.sign(this.signedData, key);
	    this.pubKey = key.pub;
	    this.getHash();
	    return true;
	  };

	  /**
	  * Create an identifi message. Message timestamp and context (identifi) are automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
	  * @param {Object} signedData message data object including author, recipient and other possible attributes
	  * @param {Object} signingKey optionally, you can set the key to sign the message with
	  * @returns {Message} Identifi message
	  */


	  Message.create = async function create(signedData, signingKey) {
	    if (!signedData.author && signingKey) {
	      signedData.author = [['keyID', Key.getId(signingKey)]];
	    }
	    signedData.timestamp = signedData.timestamp || new Date().toISOString();
	    signedData.context = signedData.context || 'identifi';
	    var m = new Message({ signedData: signedData });
	    if (signingKey) {
	      await m.sign(signingKey);
	    }
	    return m;
	  };

	  /**
	  * Create an Identifi verification message. Message type, maxRating, minRating, timestamp and context (identifi) are automatically set. If signingKey is specified and author omitted, signingKey will be used as author.
	  */


	  Message.createVerification = function createVerification(signedData, signingKey) {
	    signedData.type = 'verification';
	    return Message.create(signedData, signingKey);
	  };

	  /**
	  * Create an Identifi rating message. Message type, maxRating, minRating, timestamp and context are set automatically. If signingKey is specified and author omitted, signingKey will be used as author.
	  */


	  Message.createRating = function createRating(signedData, signingKey) {
	    signedData.type = 'rating';
	    signedData.maxRating = signedData.maxRating || 10;
	    signedData.minRating = signedData.minRating || -10;
	    return Message.create(signedData, signingKey);
	  };

	  /**
	  * @param {Index} index index to look up the message author from
	  * @returns {Identity} message author identity
	  */


	  Message.prototype.getAuthor = function getAuthor(index) {
	    for (var i = 0; i < this.signedData.author.length; i++) {
	      var a = this.signedData.author[i];
	      if (Attribute.isUniqueType(a[0])) {
	        return index.get(a[1], a[0]);
	      }
	    }
	  };

	  /**
	  * @param {Index} index index to look up the message recipient from
	  * @returns {Identity} message recipient identity
	  */


	  Message.prototype.getRecipient = function getRecipient(index) {
	    for (var i = 0; i < this.signedData.recipient.length; i++) {
	      var a = this.signedData.recipient[i];
	      if (Attribute.isUniqueType(a[0])) {
	        return index.get(a[1], a[0]);
	      }
	    }
	  };

	  /**
	  * @returns {string} base64 hash of message
	  */


	  Message.prototype.getHash = function getHash() {
	    if (this.sig && !this.hash) {
	      this.hash = util$1.getHash(this.sig);
	    }
	    return this.hash;
	  };

	  Message.fromSig = async function fromSig(obj) {
	    var signedData = await Key.verify(obj.sig, obj.pubKey);
	    var o = { signedData: signedData, sig: obj.sig, pubKey: obj.pubKey };
	    return new Message(o);
	  };

	  /**
	  * @return {boolean} true if message signature is valid. Otherwise throws ValidationError.
	  */


	  Message.prototype.verify = async function verify() {
	    if (!this.pubKey) {
	      throw new ValidationError(errorMsg + ' Message has no .pubKey');
	    }
	    if (!this.sig) {
	      throw new ValidationError(errorMsg + ' Message has no .sig');
	    }
	    this.signedData = await Key.verify(this.sig, this.pubKey);
	    if (!this.signedData) {
	      throw new ValidationError(errorMsg + ' Invalid signature');
	    }
	    if (this.hash) {
	      if (this.hash !== util$1.getHash(this.sig)) {
	        throw new ValidationError(errorMsg + ' Invalid message hash');
	      }
	    } else {
	      this.getHash();
	    }
	    return true;
	  };

	  Message.prototype.saveToIpfs = async function saveToIpfs(ipfs) {
	    var s = this.toString();
	    var r = await ipfs.files.add(ipfs.types.Buffer.from(s));
	    if (r.length) {
	      this.ipfsUri = r[0].hash;
	    }
	    return this.ipfsUri;
	  };

	  Message.loadFromIpfs = async function loadFromIpfs(ipfs, uri) {
	    var f = await ipfs.files.cat(uri);
	    var s = ipfs.types.Buffer.from(f).toString('utf8');
	    return Message.fromString(s);
	  };

	  Message.prototype.toString = function toString() {
	    return _JSON$stringify({ sig: this.sig, pubKey: this.pubKey });
	  };

	  Message.fromString = function fromString(s) {
	    return Message.fromSig(JSON.parse(s));
	  };

	  return Message;
	}();

	var pnglib = createCommonjsModule(function (module) {
	/**
	* A handy class to calculate color values.
	*
	* @version 1.0
	* @author Robert Eisele <robert@xarg.org>
	* @copyright Copyright (c) 2010, Robert Eisele
	* @link http://www.xarg.org/2010/03/generate-client-side-png-files-using-javascript/
	* @license http://www.opensource.org/licenses/bsd-license.php BSD License
	*
	*/

	(function() {

		// helper functions for that ctx
		function write(buffer, offs) {
			for (var i = 2; i < arguments.length; i++) {
				for (var j = 0; j < arguments[i].length; j++) {
					buffer[offs++] = arguments[i].charAt(j);
				}
			}
		}

		function byte2(w) {
			return String.fromCharCode((w >> 8) & 255, w & 255);
		}

		function byte4(w) {
			return String.fromCharCode((w >> 24) & 255, (w >> 16) & 255, (w >> 8) & 255, w & 255);
		}

		function byte2lsb(w) {
			return String.fromCharCode(w & 255, (w >> 8) & 255);
		}

		// modified from original source to support NPM
		var PNGlib = function(width,height,depth) {

			this.width   = width;
			this.height  = height;
			this.depth   = depth;

			// pixel data and row filter identifier size
			this.pix_size = height * (width + 1);

			// deflate header, pix_size, block headers, adler32 checksum
			this.data_size = 2 + this.pix_size + 5 * Math.floor((0xfffe + this.pix_size) / 0xffff) + 4;

			// offsets and sizes of Png chunks
			this.ihdr_offs = 0;									// IHDR offset and size
			this.ihdr_size = 4 + 4 + 13 + 4;
			this.plte_offs = this.ihdr_offs + this.ihdr_size;	// PLTE offset and size
			this.plte_size = 4 + 4 + 3 * depth + 4;
			this.trns_offs = this.plte_offs + this.plte_size;	// tRNS offset and size
			this.trns_size = 4 + 4 + depth + 4;
			this.idat_offs = this.trns_offs + this.trns_size;	// IDAT offset and size
			this.idat_size = 4 + 4 + this.data_size + 4;
			this.iend_offs = this.idat_offs + this.idat_size;	// IEND offset and size
			this.iend_size = 4 + 4 + 4;
			this.buffer_size  = this.iend_offs + this.iend_size;	// total PNG size

			this.buffer  = new Array();
			this.palette = new Object();
			this.pindex  = 0;

			var _crc32 = new Array();

			// initialize buffer with zero bytes
			for (var i = 0; i < this.buffer_size; i++) {
				this.buffer[i] = "\x00";
			}

			// initialize non-zero elements
			write(this.buffer, this.ihdr_offs, byte4(this.ihdr_size - 12), 'IHDR', byte4(width), byte4(height), "\x08\x03");
			write(this.buffer, this.plte_offs, byte4(this.plte_size - 12), 'PLTE');
			write(this.buffer, this.trns_offs, byte4(this.trns_size - 12), 'tRNS');
			write(this.buffer, this.idat_offs, byte4(this.idat_size - 12), 'IDAT');
			write(this.buffer, this.iend_offs, byte4(this.iend_size - 12), 'IEND');

			// initialize deflate header
			var header = ((8 + (7 << 4)) << 8) | (3 << 6);
			header+= 31 - (header % 31);

			write(this.buffer, this.idat_offs + 8, byte2(header));

			// initialize deflate block headers
			for (var i = 0; (i << 16) - 1 < this.pix_size; i++) {
				var size, bits;
				if (i + 0xffff < this.pix_size) {
					size = 0xffff;
					bits = "\x00";
				} else {
					size = this.pix_size - (i << 16) - i;
					bits = "\x01";
				}
				write(this.buffer, this.idat_offs + 8 + 2 + (i << 16) + (i << 2), bits, byte2lsb(size), byte2lsb(~size));
			}

			/* Create crc32 lookup table */
			for (var i = 0; i < 256; i++) {
				var c = i;
				for (var j = 0; j < 8; j++) {
					if (c & 1) {
						c = -306674912 ^ ((c >> 1) & 0x7fffffff);
					} else {
						c = (c >> 1) & 0x7fffffff;
					}
				}
				_crc32[i] = c;
			}

			// compute the index into a png for a given pixel
			this.index = function(x,y) {
				var i = y * (this.width + 1) + x + 1;
				var j = this.idat_offs + 8 + 2 + 5 * Math.floor((i / 0xffff) + 1) + i;
				return j;
			};

			// convert a color and build up the palette
			this.color = function(red, green, blue, alpha) {

				alpha = alpha >= 0 ? alpha : 255;
				var color = (((((alpha << 8) | red) << 8) | green) << 8) | blue;

				if (typeof this.palette[color] == "undefined") {
					if (this.pindex == this.depth) return "\x00";

					var ndx = this.plte_offs + 8 + 3 * this.pindex;

					this.buffer[ndx + 0] = String.fromCharCode(red);
					this.buffer[ndx + 1] = String.fromCharCode(green);
					this.buffer[ndx + 2] = String.fromCharCode(blue);
					this.buffer[this.trns_offs+8+this.pindex] = String.fromCharCode(alpha);

					this.palette[color] = String.fromCharCode(this.pindex++);
				}
				return this.palette[color];
			};

			// output a PNG string, Base64 encoded
			this.getBase64 = function() {

				var s = this.getDump();

				var ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
				var c1, c2, c3, e1, e2, e3, e4;
				var l = s.length;
				var i = 0;
				var r = "";

				do {
					c1 = s.charCodeAt(i);
					e1 = c1 >> 2;
					c2 = s.charCodeAt(i+1);
					e2 = ((c1 & 3) << 4) | (c2 >> 4);
					c3 = s.charCodeAt(i+2);
					if (l < i+2) { e3 = 64; } else { e3 = ((c2 & 0xf) << 2) | (c3 >> 6); }
					if (l < i+3) { e4 = 64; } else { e4 = c3 & 0x3f; }
					r+= ch.charAt(e1) + ch.charAt(e2) + ch.charAt(e3) + ch.charAt(e4);
				} while ((i+= 3) < l);
				return r;
			};

			// output a PNG string
			this.getDump = function() {

				// compute adler32 of output pixels + row filter bytes
				var BASE = 65521; /* largest prime smaller than 65536 */
				var NMAX = 5552;  /* NMAX is the largest n such that 255n(n+1)/2 + (n+1)(BASE-1) <= 2^32-1 */
				var s1 = 1;
				var s2 = 0;
				var n = NMAX;

				for (var y = 0; y < this.height; y++) {
					for (var x = -1; x < this.width; x++) {
						s1+= this.buffer[this.index(x, y)].charCodeAt(0);
						s2+= s1;
						if ((n-= 1) == 0) {
							s1%= BASE;
							s2%= BASE;
							n = NMAX;
						}
					}
				}
				s1%= BASE;
				s2%= BASE;
				write(this.buffer, this.idat_offs + this.idat_size - 8, byte4((s2 << 16) | s1));

				// compute crc32 of the PNG chunks
				function crc32(png, offs, size) {
					var crc = -1;
					for (var i = 4; i < size-4; i += 1) {
						crc = _crc32[(crc ^ png[offs+i].charCodeAt(0)) & 0xff] ^ ((crc >> 8) & 0x00ffffff);
					}
					write(png, offs+size-4, byte4(crc ^ -1));
				}

				crc32(this.buffer, this.ihdr_offs, this.ihdr_size);
				crc32(this.buffer, this.plte_offs, this.plte_size);
				crc32(this.buffer, this.trns_offs, this.trns_size);
				crc32(this.buffer, this.idat_offs, this.idat_size);
				crc32(this.buffer, this.iend_offs, this.iend_size);

				// convert PNG to string
				return "\x89PNG\r\n\x1a\n"+this.buffer.join('');
			};
		};

		// modified from original source to support NPM
		{
			module.exports = PNGlib;
		}
	})();
	});

	var identicon = createCommonjsModule(function (module) {
	/**
	 * Identicon.js 2.3.2
	 * http://github.com/stewartlord/identicon.js
	 *
	 * PNGLib required for PNG output
	 * http://www.xarg.org/download/pnglib.js
	 *
	 * Copyright 2018, Stewart Lord
	 * Released under the BSD license
	 * http://www.opensource.org/licenses/bsd-license.php
	 */

	(function() {
	    var PNGlib;
	    {
	        PNGlib = pnglib;
	    }

	    var Identicon = function(hash, options){
	        if (typeof(hash) !== 'string' || hash.length < 15) {
	            throw 'A hash of at least 15 characters is required.';
	        }

	        this.defaults = {
	            background: [240, 240, 240, 255],
	            margin:     0.08,
	            size:       64,
	            saturation: 0.7,
	            brightness: 0.5,
	            format:     'png'
	        };

	        this.options = typeof(options) === 'object' ? options : this.defaults;

	        // backward compatibility with old constructor (hash, size, margin)
	        if (typeof(arguments[1]) === 'number') { this.options.size   = arguments[1]; }
	        if (arguments[2])                      { this.options.margin = arguments[2]; }

	        this.hash        = hash;
	        this.background  = this.options.background || this.defaults.background;
	        this.size        = this.options.size       || this.defaults.size;
	        this.format      = this.options.format     || this.defaults.format;
	        this.margin      = this.options.margin !== undefined ? this.options.margin : this.defaults.margin;

	        // foreground defaults to last 7 chars as hue at 70% saturation, 50% brightness
	        var hue          = parseInt(this.hash.substr(-7), 16) / 0xfffffff;
	        var saturation   = this.options.saturation || this.defaults.saturation;
	        var brightness   = this.options.brightness || this.defaults.brightness;
	        this.foreground  = this.options.foreground || this.hsl2rgb(hue, saturation, brightness);
	    };

	    Identicon.prototype = {
	        background: null,
	        foreground: null,
	        hash:       null,
	        margin:     null,
	        size:       null,
	        format:     null,

	        image: function(){
	            return this.isSvg()
	                ? new Svg(this.size, this.foreground, this.background)
	                : new PNGlib(this.size, this.size, 256);
	        },

	        render: function(){
	            var image      = this.image(),
	                size       = this.size,
	                baseMargin = Math.floor(size * this.margin),
	                cell       = Math.floor((size - (baseMargin * 2)) / 5),
	                margin     = Math.floor((size - cell * 5) / 2),
	                bg         = image.color.apply(image, this.background),
	                fg         = image.color.apply(image, this.foreground);

	            // the first 15 characters of the hash control the pixels (even/odd)
	            // they are drawn down the middle first, then mirrored outwards
	            var i, color;
	            for (i = 0; i < 15; i++) {
	                color = parseInt(this.hash.charAt(i), 16) % 2 ? bg : fg;
	                if (i < 5) {
	                    this.rectangle(2 * cell + margin, i * cell + margin, cell, cell, color, image);
	                } else if (i < 10) {
	                    this.rectangle(1 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
	                    this.rectangle(3 * cell + margin, (i - 5) * cell + margin, cell, cell, color, image);
	                } else if (i < 15) {
	                    this.rectangle(0 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
	                    this.rectangle(4 * cell + margin, (i - 10) * cell + margin, cell, cell, color, image);
	                }
	            }

	            return image;
	        },

	        rectangle: function(x, y, w, h, color, image){
	            if (this.isSvg()) {
	                image.rectangles.push({x: x, y: y, w: w, h: h, color: color});
	            } else {
	                var i, j;
	                for (i = x; i < x + w; i++) {
	                    for (j = y; j < y + h; j++) {
	                        image.buffer[image.index(i, j)] = color;
	                    }
	                }
	            }
	        },

	        // adapted from: https://gist.github.com/aemkei/1325937
	        hsl2rgb: function(h, s, b){
	            h *= 6;
	            s = [
	                b += s *= b < .5 ? b : 1 - b,
	                b - h % 1 * s * 2,
	                b -= s *= 2,
	                b,
	                b + h % 1 * s,
	                b + s
	            ];

	            return [
	                s[ ~~h    % 6 ] * 255, // red
	                s[ (h|16) % 6 ] * 255, // green
	                s[ (h|8)  % 6 ] * 255  // blue
	            ];
	        },

	        toString: function(raw){
	            // backward compatibility with old toString, default to base64
	            if (raw) {
	                return this.render().getDump();
	            } else {
	                return this.render().getBase64();
	            }
	        },

	        isSvg: function(){
	            return this.format.match(/svg/i)
	        }
	    };

	    var Svg = function(size, foreground, background){
	        this.size       = size;
	        this.foreground = this.color.apply(this, foreground);
	        this.background = this.color.apply(this, background);
	        this.rectangles = [];
	    };

	    Svg.prototype = {
	        size:       null,
	        foreground: null,
	        background: null,
	        rectangles: null,

	        color: function(r, g, b, a){
	            var values = [r, g, b].map(Math.round);
	            values.push((a >= 0) && (a <= 255) ? a/255 : 1);
	            return 'rgba(' + values.join(',') + ')';
	        },

	        getDump: function(){
	          var i,
	                xml,
	                rect,
	                fg     = this.foreground,
	                bg     = this.background,
	                stroke = this.size * 0.005;

	            xml = "<svg xmlns='http://www.w3.org/2000/svg'"
	                + " width='" + this.size + "' height='" + this.size + "'"
	                + " style='background-color:" + bg + ";'>"
	                + "<g style='fill:" + fg + "; stroke:" + fg + "; stroke-width:" + stroke + ";'>";

	            for (i = 0; i < this.rectangles.length; i++) {
	                rect = this.rectangles[i];
	                if (rect.color == bg) continue;
	                xml += "<rect "
	                    + " x='"      + rect.x + "'"
	                    + " y='"      + rect.y + "'"
	                    + " width='"  + rect.w + "'"
	                    + " height='" + rect.h + "'"
	                    + "/>";
	            }
	            xml += "</g></svg>";

	            return xml;
	        },

	        getBase64: function(){
	            if (btoa) {
	                return btoa(this.getDump());
	            } else if (Buffer) {
	                return new Buffer(this.getDump(), 'binary').toString('base64');
	            } else {
	                throw 'Cannot generate base64 output';
	            }
	        }
	    };

	    {
	        module.exports = Identicon;
	    }
	})();
	});

	/**
	* An Identifi identity profile. Usually you don't create them yourself, but get them
	* from Index methods such as search().
	*/

	var Identity = function () {
	  /**
	  * @param {Object} gun node where the Identity data lives
	  * @param {Object} tempData temporary data to present before data from gun is received
	  * @param {Boolean} save whether to save identity data to the given gun node
	  */
	  function Identity(gun, tempData, save) {
	    var _this = this;

	    _classCallCheck(this, Identity);

	    this.gun = gun;
	    if (save) {
	      if (tempData.linkTo && !tempData.attrs) {
	        var linkTo = new Attribute(tempData.linkTo);
	        tempData.attrs = tempData.attrs || {};
	        if (!tempData.attrs.hasOwnProperty(linkTo.uri())) {
	          tempData.attrs[linkTo.uri()] = linkTo;
	        }
	      } else {
	        tempData.linkTo = Identity.getLinkTo(tempData.attrs);
	      }
	      this.gun.put(tempData);
	    } else {
	      this.tempData = tempData;
	      this.gun.on(function (data) {
	        if (data) {
	          //this.gun.off();
	          _this.tempData = null;
	        }
	      });
	    }
	  }

	  Identity.getLinkTo = function getLinkTo(attrs) {
	    var mva = Identity.getMostVerifiedAttributes(attrs);
	    var keys = _Object$keys(mva);
	    var linkTo = void 0;
	    for (var i = 0; i < keys.length; i++) {
	      if (keys[i] === 'keyID') {
	        linkTo = mva[keys[i]].attribute;
	        break;
	      } else if (Attribute.isUniqueType(keys[i])) {
	        linkTo = mva[keys[i]].attribute;
	      }
	    }
	    return linkTo;
	  };

	  Identity.getMostVerifiedAttributes = function getMostVerifiedAttributes(attrs) {
	    var mostVerifiedAttributes = {};
	    _Object$keys(attrs).forEach(function (k) {
	      var a = attrs[k];
	      var keyExists = _Object$keys(mostVerifiedAttributes).indexOf(a.name) > -1;
	      a.conf = isNaN(a.conf) ? 1 : a.conf;
	      a.ref = isNaN(a.ref) ? 0 : a.ref;
	      if (a.conf * 2 > a.ref * 3 && (!keyExists || a.conf - a.ref > mostVerifiedAttributes[a.name].verificationScore)) {
	        mostVerifiedAttributes[a.name] = {
	          attribute: a,
	          verificationScore: a.conf - a.ref
	        };
	        if (a.verified) {
	          mostVerifiedAttributes[a.name].verified = true;
	        }
	      }
	    });
	    return mostVerifiedAttributes;
	  };

	  /**
	  * @param {string} attribute attribute type
	  * @returns {string} most verified value of the param type
	  */


	  Identity.prototype.verified = async function verified(attribute) {
	    var attrs = await this.gun.get('attrs').then();
	    var mva = Identity.getMostVerifiedAttributes(attrs);
	    return mva.hasOwnProperty(attribute) ? mva[attribute].attribute.val : undefined;
	  };

	  /**
	  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
	  * @returns {HTMLElement} profile card html element describing the identity
	  */


	  Identity.prototype.profileCard = function profileCard(ipfs) {
	    var _this2 = this;

	    var card = document.createElement('div');
	    card.className = 'identifi-card';

	    var identicon$$1 = this.identicon(60, null, null, ipfs);
	    identicon$$1.style.order = 1;
	    identicon$$1.style.flexShrink = 0;
	    identicon$$1.style.marginRight = '15px';

	    var details = document.createElement('div');
	    details.style.padding = '5px';
	    details.style.order = 2;
	    details.style.flexGrow = 1;

	    var linkEl = document.createElement('span');
	    var links = document.createElement('small');
	    card.appendChild(identicon$$1);
	    card.appendChild(details);
	    details.appendChild(linkEl);
	    details.appendChild(links);

	    this.gun.on(async function (data) {
	      if (!data) {
	        return;
	      }
	      var attrs = await new _Promise(function (resolve) {
	        _this2.gun.get('attrs').load(function (r) {
	          return resolve(r);
	        });
	      });
	      var linkTo = await _this2.gun.get('linkTo').then();
	      var link = 'https://identi.fi/#/identities/' + linkTo.name + '/' + linkTo.val;
	      var mva = Identity.getMostVerifiedAttributes(attrs);
	      linkEl.innerHTML = '<a href="' + link + '">' + (mva.name && mva.name.attribute.val || mva.nickname && mva.nickname.attribute.val || linkTo.name + ':' + linkTo.val) + '</a><br>';
	      linkEl.innerHTML += '<small>Received: <span class="identifi-pos">+' + (data.receivedPositive || 0) + '</span> / <span class="identifi-neg">-' + (data.receivedNegative || 0) + '</span></small><br>';
	      links.innerHTML = '';
	      _Object$keys(attrs).forEach(function (k) {
	        var a = attrs[k];
	        if (a.link) {
	          links.innerHTML += a.name + ': <a href="' + a.link + '">' + a.val + '</a> ';
	        }
	      });
	    });

	    /*
	    const template = ```
	    <tr ng-repeat="result in ids.list" id="result{$index}" ng-hide="!result.linkTo" ui-sref="identities.show({ type: result.linkTo.type, value: result.linkTo.value })" class="search-result-row" ng-class="{active: result.active}">
	      <td class="gravatar-col"><identicon id="result" border="3" width="46" positive-score="result.pos" negative-score="result.neg"></identicon></td>
	      <td>
	        <span ng-if="result.distance == 0" class="label label-default pull-right">viewpoint</span>
	        <span ng-if="result.distance > 0" ng-bind="result.distance | ordinal" class="label label-default pull-right"></span>
	        <a ng-bind-html="result.name|highlight:query.term" ui-sref="identities.show({ type: result.linkTo.type, value: result.linkTo.value })"></a>
	        <small ng-if="!result.name" class="list-group-item-text">
	          <span ng-bind-html="result[0][0]|highlight:query.term"></span>
	        </small><br>
	        <small>
	          <span ng-if="result.nickname && result.name != result.nickname" ng-bind-html="result.nickname|highlight:query.term" class="mar-right10"></span>
	          <span ng-if="result.email" class="mar-right10">
	            <span class="glyphicon glyphicon-envelope"></span> <span ng-bind-html="result.email|highlight:query.term"></span>
	          </span>
	          <span ng-if="result.facebook" class="mar-right10">
	            <span class="fa fa-facebook"></span> <span ng-bind-html="result.facebook|highlight:query.term"></span>
	          </span>
	          <span ng-if="result.twitter" class="mar-right10">
	            <span class="fa fa-twitter"></span> <span ng-bind-html="result.twitter|highlight:query.term"></span>
	          </span>
	          <span ng-if="result.googlePlus" class="mar-right10">
	            <span class="fa fa-google-plus"></span> <span ng-bind-html="result.googlePlus|highlight:query.term"></span>
	          </span>
	          <span ng-if="result.bitcoin" class="mar-right10">
	            <span class="fa fa-bitcoin"></span> <span ng-bind-html="result.bitcoin|highlight:query.term"></span>
	          </span>
	        </small>
	      </td>
	    </tr>
	    ```;*/
	    return card;
	  };

	  /**
	  * Appends a search widget to the given HTMLElement
	  * @param {HTMLElement} parentElement element where the search widget is added and event listener attached
	  * @param {Index} index index root to use for search
	  */


	  Identity.appendSearchWidget = function appendSearchWidget(parentElement, index) {
	    var form = document.createElement('form');

	    var input = document.createElement('input');
	    input.type = 'text';
	    input.placeholder = 'Search';
	    input.id = 'identifiSearchInput';
	    form.innerHTML += '<div id="identifiSearchResults"></div>';

	    var searchResults = document.createElement('div');

	    parentElement.appendChild(form);
	    form.appendChild(input);
	    form.appendChild(searchResults);
	    input.addEventListener('keyup', async function () {
	      var r = await index.search(input.value);
	      searchResults.innerHTML = '';
	      r.sort(function (a, b) {
	        return a.trustDistance - b.trustDistance;
	      });
	      r.forEach(function (i) {
	        searchResults.appendChild(i.profileCard());
	      });
	    });
	  };

	  Identity._ordinal = function _ordinal(n) {
	    var s = ['th', 'st', 'nd', 'rd'];
	    var v = n % 100;
	    return n + (s[(v - 20) % 10] || s[v] || s[0]);
	  };

	  Identity._injectCss = function _injectCss() {
	    var elementId = 'identifiStyle';
	    if (document.getElementById(elementId)) {
	      return;
	    }
	    var sheet = document.createElement('style');
	    sheet.id = elementId;
	    sheet.innerHTML = '\n      .identifi-identicon * {\n        box-sizing: border-box;\n      }\n\n      .identifi-identicon {\n        vertical-align: middle;\n        margin: auto;\n        border-radius: 50%;\n        text-align: center;\n        display: inline-block;\n        position: relative;\n        margin: auto;\n        max-width: 100%;\n      }\n\n      .identifi-distance {\n        z-index: 2;\n        position: absolute;\n        left:0%;\n        top:2px;\n        width: 100%;\n        text-align: right;\n        color: #fff;\n        text-shadow: 0 0 1px #000;\n        font-size: 75%;\n        line-height: 75%;\n        font-weight: bold;\n      }\n\n      .identifi-pie {\n        border-radius: 50%;\n        position: absolute;\n        top: 0;\n        left: 0;\n        box-shadow: 0px 0px 0px 0px #82FF84;\n        padding-bottom: 100%;\n        max-width: 100%;\n        -webkit-transition: all 0.2s ease-in-out;\n        -moz-transition: all 0.2s ease-in-out;\n        transition: all 0.2s ease-in-out;\n      }\n\n      .identifi-card {\n        padding: 10px;\n        background-color: #f7f7f7;\n        color: #777;\n        border: 1px solid #ddd;\n        display: flex;\n        flex-direction: row;\n        overflow: hidden;\n      }\n\n      .identifi-card a {\n        -webkit-transition: color 150ms;\n        transition: color 150ms;\n        text-decoration: none;\n        color: #337ab7;\n      }\n\n      .identifi-card a:hover, .identifi-card a:active {\n        text-decoration: underline;\n        color: #23527c;\n      }\n\n      .identifi-pos {\n        color: #3c763d;\n      }\n\n      .identifi-neg {\n        color: #a94442;\n      }\n\n      .identifi-identicon img {\n        position: absolute;\n        top: 0;\n        left: 0;\n        max-width: 100%;\n        border-radius: 50%;\n        border-color: transparent;\n        border-style: solid;\n      }';
	    document.body.appendChild(sheet);
	  };

	  /**
	  * @param {number} width of the identicon
	  * @param {number} border identicon border (aura) width
	  * @param {boolean} showDistance whether to show web of trust distance ordinal
	  * @param {Object} ipfs (optional) an IPFS instance that is used to fetch images
	  * @returns {HTMLElement} identicon element that can be appended to DOM
	  */


	  Identity.prototype.identicon = function identicon$$1(width) {
	    var border = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
	    var showDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
	    var ipfs = arguments[3];

	    Identity._injectCss(); // some other way that is not called on each identicon generation?
	    var identicon$$1 = document.createElement('div');
	    identicon$$1.className = 'identifi-identicon';
	    identicon$$1.style.width = width + 'px';
	    identicon$$1.style.height = width + 'px';

	    var pie = document.createElement('div');
	    pie.className = 'identifi-pie';
	    pie.style.width = width + 'px';

	    var img = document.createElement('img');
	    img.alt = '';
	    img.width = width;
	    img.height = width;
	    img.style.borderWidth = border + 'px';

	    var distance = void 0;
	    if (showDistance) {
	      distance = document.createElement('span');
	      distance.className = 'identifi-distance';
	      distance.style.fontSize = width > 50 ? width / 4 + 'px' : '10px';
	      identicon$$1.appendChild(distance);
	    }
	    identicon$$1.appendChild(pie);
	    identicon$$1.appendChild(img);

	    function setPie(data) {
	      if (!data) {
	        return;
	      }
	      // Define colors etc
	      var bgColor = 'rgba(0,0,0,0.2)';
	      var bgImage = 'none';
	      var transform = '';
	      var boxShadow = '0px 0px 0px 0px #82FF84';
	      if (data.receivedPositive > data.receivedNegative * 20) {
	        boxShadow = '0px 0px ' + border * data.receivedPositive / 50 + 'px 0px #82FF84';
	      } else if (data.receivedPositive < data.receivedNegative * 3) {
	        boxShadow = '0px 0px ' + border * data.receivedNegative / 10 + 'px 0px #BF0400';
	      }
	      if (data.receivedPositive + data.receivedNegative > 0) {
	        if (data.receivedPositive > data.receivedNegative) {
	          transform = 'rotate(' + (-data.receivedPositive / (data.receivedPositive + data.receivedNegative) * 360 - 180) / 2 + 'deg)';
	          bgColor = '#A94442';
	          bgImage = 'linear-gradient(' + data.receivedPositive / (data.receivedPositive + data.receivedNegative) * 360 + 'deg, transparent 50%, #3C763D 50%), linear-gradient(0deg, #3C763D 50%, transparent 50%)';
	        } else {
	          transform = 'rotate(' + ((-data.receivedNegative / (data.receivedPositive + data.receivedNegative) * 360 - 180) / 2 + 180) + 'deg)';
	          bgColor = '#3C763D';
	          bgImage = 'linear-gradient(' + data.receivedNegative / (data.receivedPositive + data.receivedNegative) * 360 + 'deg, transparent 50%, #A94442 50%), linear-gradient(0deg, #A94442 50%, transparent 50%)';
	        }
	      }

	      pie.style.backgroundColor = bgColor;
	      pie.style.backgroundImage = bgImage;
	      pie.style.boxShadow = boxShadow;
	      pie.style.transform = transform;
	      pie.style.opacity = (data.receivedPositive + data.receivedNegative) / 10 * 0.5 + 0.35;

	      if (showDistance) {
	        distance.textContent = data.trustDistance < 1000 ? Identity._ordinal(data.trustDistance) : '\u2715';
	      }
	    }

	    function setIdenticonImg(data) {
	      var hash = util$1.getHash(encodeURIComponent(data.name) + ':' + encodeURIComponent(data.val), 'hex');
	      var identiconImg = new identicon(hash, { width: width, format: 'svg' });
	      img.src = img.src || 'data:image/svg+xml;base64,' + identiconImg.toString();
	    }

	    if (this.tempData) {
	      setPie(this.tempData);
	      if (this.tempData.linkTo) {
	        setIdenticonImg(this.tempData.linkTo);
	      }
	    }

	    this.gun.on(setPie);
	    this.gun.get('linkTo').on(setIdenticonImg);

	    if (ipfs) {
	      this.gun.get('attrs').open(function (attrs) {
	        var mva = Identity.getMostVerifiedAttributes(attrs);
	        if (mva.profilePhoto) {
	          var go = function go() {
	            ipfs.files.cat(mva.profilePhoto.attribute.val).then(function (file) {
	              var f = ipfs.types.Buffer.from(file).toString('base64');
	              img.src = 'data:image;base64,' + f;
	            });
	          };
	          ipfs.isOnline() ? go() : ipfs.on('ready', go);
	        }
	      });
	    }

	    return identicon$$1;
	  };

	  return Identity;
	}();

	// 20.1.2.6 Number.MAX_SAFE_INTEGER


	_export(_export.S, 'Number', { MAX_SAFE_INTEGER: 0x1fffffffffffff });

	var maxSafeInteger = 0x1fffffffffffff;

	var maxSafeInteger$1 = createCommonjsModule(function (module) {
	module.exports = { "default": maxSafeInteger, __esModule: true };
	});

	var _Number$MAX_SAFE_INTEGER = unwrapExports(maxSafeInteger$1);

	var _stringWs = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
	  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var space = '[' + _stringWs + ']';
	var non = '\u200b\u0085';
	var ltrim = RegExp('^' + space + space + '*');
	var rtrim = RegExp(space + space + '*$');

	var exporter = function (KEY, exec, ALIAS) {
	  var exp = {};
	  var FORCE = _fails(function () {
	    return !!_stringWs[KEY]() || non[KEY]() != non;
	  });
	  var fn = exp[KEY] = FORCE ? exec(trim) : _stringWs[KEY];
	  if (ALIAS) exp[ALIAS] = fn;
	  _export(_export.P + _export.F * FORCE, 'String', exp);
	};

	// 1 -> String#trimLeft
	// 2 -> String#trimRight
	// 3 -> String#trim
	var trim = exporter.trim = function (string, TYPE) {
	  string = String(_defined(string));
	  if (TYPE & 1) string = string.replace(ltrim, '');
	  if (TYPE & 2) string = string.replace(rtrim, '');
	  return string;
	};

	var _stringTrim = exporter;

	var $parseInt = _global.parseInt;
	var $trim = _stringTrim.trim;

	var hex = /^[-+]?0[xX]/;

	var _parseInt = $parseInt(_stringWs + '08') !== 8 || $parseInt(_stringWs + '0x16') !== 22 ? function parseInt(str, radix) {
	  var string = $trim(String(str), 3);
	  return $parseInt(string, (radix >>> 0) || (hex.test(string) ? 16 : 10));
	} : $parseInt;

	// 20.1.2.13 Number.parseInt(string, radix)
	_export(_export.S + _export.F * (Number.parseInt != _parseInt), 'Number', { parseInt: _parseInt });

	var _parseInt$1 = _core.Number.parseInt;

	var _parseInt$2 = createCommonjsModule(function (module) {
	module.exports = { "default": _parseInt$1, __esModule: true };
	});

	var _Number$parseInt = unwrapExports(_parseInt$2);

	var isEnum$1 = _objectPie.f;
	var _objectToArray = function (isEntries) {
	  return function (it) {
	    var O = _toIobject(it);
	    var keys = _objectKeys(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) if (isEnum$1.call(O, key = keys[i++])) {
	      result.push(isEntries ? [key, O[key]] : O[key]);
	    } return result;
	  };
	};

	// https://github.com/tc39/proposal-object-values-entries

	var $values = _objectToArray(false);

	_export(_export.S, 'Object', {
	  values: function values(it) {
	    return $values(it);
	  }
	});

	var values = _core.Object.values;

	var values$1 = createCommonjsModule(function (module) {
	module.exports = { "default": values, __esModule: true };
	});

	var _Object$values = unwrapExports(values$1);

	// 20.1.2.4 Number.isNaN(number)


	_export(_export.S, 'Number', {
	  isNaN: function isNaN(number) {
	    // eslint-disable-next-line no-self-compare
	    return number != number;
	  }
	});

	var isNan = _core.Number.isNaN;

	var isNan$1 = createCommonjsModule(function (module) {
	module.exports = { "default": isNan, __esModule: true };
	});

	var _Number$isNaN = unwrapExports(isNan$1);

	// 19.1.2.1 Object.assign(target, source, ...)





	var $assign = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	var _objectAssign = !$assign || _fails(function () {
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var S = Symbol();
	  var K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function (k) { B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = _toObject(target);
	  var aLen = arguments.length;
	  var index = 1;
	  var getSymbols = _objectGops.f;
	  var isEnum = _objectPie.f;
	  while (aLen > index) {
	    var S = _iobject(arguments[index++]);
	    var keys = getSymbols ? _objectKeys(S).concat(getSymbols(S)) : _objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
	  } return T;
	} : $assign;

	// 19.1.3.1 Object.assign(target, source)


	_export(_export.S + _export.F, 'Object', { assign: _objectAssign });

	var assign = _core.Object.assign;

	var assign$1 = createCommonjsModule(function (module) {
	module.exports = { "default": assign, __esModule: true };
	});

	var _Object$assign = unwrapExports(assign$1);

	var gun = createCommonjsModule(function (module) {
	(function(){

	  /* UNBUILD */
	  var root;
	  if(typeof window !== "undefined"){ root = window; }
	  if(typeof commonjsGlobal !== "undefined"){ root = commonjsGlobal; }
	  root = root || {};
	  var console = root.console || {log: function(){}};
	  function USE(arg, req){
	    return req? commonjsRequire(arg) : arg.slice? USE[R(arg)] : function(mod, path){
	      arg(mod = {exports: {}});
	      USE[R(path)] = mod.exports;
	    }
	    function R(p){
	      return p.split('/').slice(-1).toString().replace('.js','');
	    }
	  }
	  { var common = module; }
	USE(function(module){
			// Generic javascript utilities.
			var Type = {};
			//Type.fns = Type.fn = {is: function(fn){ return (!!fn && fn instanceof Function) }}
			Type.fn = {is: function(fn){ return (!!fn && 'function' == typeof fn) }};
			Type.bi = {is: function(b){ return (b instanceof Boolean || typeof b == 'boolean') }};
			Type.num = {is: function(n){ return !list_is(n) && ((n - parseFloat(n) + 1) >= 0 || Infinity === n || -Infinity === n) }};
			Type.text = {is: function(t){ return (typeof t == 'string') }};
			Type.text.ify = function(t){
				if(Type.text.is(t)){ return t }
				if(typeof JSON !== "undefined"){ return JSON.stringify(t) }
				return (t && t.toString)? t.toString() : t;
			};
			Type.text.random = function(l, c){
				var s = '';
				l = l || 24; // you are not going to make a 0 length random number, so no need to check type
				c = c || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxyz';
				while(l > 0){ s += c.charAt(Math.floor(Math.random() * c.length)); l--; }
				return s;
			};
			Type.text.match = function(t, o){ var r = false;
				t = t || '';
				o = Type.text.is(o)? {'=': o} : o || {}; // {'~', '=', '*', '<', '>', '+', '-', '?', '!'} // ignore case, exactly equal, anything after, lexically larger, lexically lesser, added in, subtacted from, questionable fuzzy match, and ends with.
				if(Type.obj.has(o,'~')){ t = t.toLowerCase(); o['='] = (o['='] || o['~']).toLowerCase(); }
				if(Type.obj.has(o,'=')){ return t === o['='] }
				if(Type.obj.has(o,'*')){ if(t.slice(0, o['*'].length) === o['*']){ r = true; t = t.slice(o['*'].length); } else { return false }}
				if(Type.obj.has(o,'!')){ if(t.slice(-o['!'].length) === o['!']){ r = true; } else { return false }}
				if(Type.obj.has(o,'+')){
					if(Type.list.map(Type.list.is(o['+'])? o['+'] : [o['+']], function(m){
						if(t.indexOf(m) >= 0){ r = true; } else { return true }
					})){ return false }
				}
				if(Type.obj.has(o,'-')){
					if(Type.list.map(Type.list.is(o['-'])? o['-'] : [o['-']], function(m){
						if(t.indexOf(m) < 0){ r = true; } else { return true }
					})){ return false }
				}
				if(Type.obj.has(o,'>')){ if(t > o['>']){ r = true; } else { return false }}
				if(Type.obj.has(o,'<')){ if(t < o['<']){ r = true; } else { return false }}
				function fuzzy(t,f){ var n = -1, i = 0, c; for(;c = f[i++];){ if(!~(n = t.indexOf(c, n+1))){ return false }} return true } // via http://stackoverflow.com/questions/9206013/javascript-fuzzy-search
				if(Type.obj.has(o,'?')){ if(fuzzy(t, o['?'])){ r = true; } else { return false }} // change name!
				return r;
			};
			Type.list = {is: function(l){ return (l instanceof Array) }};
			Type.list.slit = Array.prototype.slice;
			Type.list.sort = function(k){ // creates a new sort function based off some key
				return function(A,B){
					if(!A || !B){ return 0 } A = A[k]; B = B[k];
					if(A < B){ return -1 }else if(A > B){ return 1 }
					else { return 0 }
				}
			};
			Type.list.map = function(l, c, _){ return obj_map(l, c, _) };
			Type.list.index = 1; // change this to 0 if you want non-logical, non-mathematical, non-matrix, non-convenient array notation
			Type.obj = {is: function(o){ return o? (o instanceof Object && o.constructor === Object) || Object.prototype.toString.call(o).match(/^\[object (\w+)\]$/)[1] === 'Object' : false }};
			Type.obj.put = function(o, k, v){ return (o||{})[k] = v, o };
			Type.obj.has = function(o, k){ return o && Object.prototype.hasOwnProperty.call(o, k) };
			Type.obj.del = function(o, k){
				if(!o){ return }
				o[k] = null;
				delete o[k];
				return o;
			};
			Type.obj.as = function(o, k, v, u){ return o[k] = o[k] || (u === v? {} : v) };
			Type.obj.ify = function(o){
				if(obj_is(o)){ return o }
				try{o = JSON.parse(o);
				}catch(e){o={};}			return o;
			}
			;(function(){ var u;
				function map(v,k){
					if(obj_has(this,k) && u !== this[k]){ return }
					this[k] = v;
				}
				Type.obj.to = function(from, to){
					to = to || {};
					obj_map(from, map, to);
					return to;
				};
			}());
			Type.obj.copy = function(o){ // because http://web.archive.org/web/20140328224025/http://jsperf.com/cloning-an-object/2
				return !o? o : JSON.parse(JSON.stringify(o)); // is shockingly faster than anything else, and our data has to be a subset of JSON anyways!
			}
			;(function(){
				function empty(v,i){ var n = this.n;
					if(n && (i === n || (obj_is(n) && obj_has(n, i)))){ return }
					if(i){ return true }
				}
				Type.obj.empty = function(o, n){
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
				}			var keys = Object.keys;
				Type.obj.map = function(l, c, _){
					var u, i = 0, x, r, ll, lle, f = fn_is(c);
					t.r = null;
					if(keys && obj_is(l)){
						ll = keys(l); lle = true;
					}
					if(list_is(l) || ll){
						x = (ll || l).length;
						for(;i < x; i++){
							var ii = (i + Type.list.index);
							if(f){
								r = lle? c.call(_ || this, l[ll[i]], ll[i], t) : c.call(_ || this, l[i], ii, t);
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
			Type.time = {};
			Type.time.is = function(t){ return t? t instanceof Date : (+new Date().getTime()) };

			var fn_is = Type.fn.is;
			var list_is = Type.list.is;
			var obj = Type.obj, obj_is = obj.is, obj_has = obj.has, obj_map = obj.map;
			module.exports = Type;
		})(USE, './type');
	USE(function(module){
			// On event emitter generic javascript utility.
			module.exports = function onto(tag, arg, as){
				if(!tag){ return {to: onto} }
				var u, tag = (this.tag || (this.tag = {}))[tag] ||
				(this.tag[tag] = {tag: tag, to: onto._ = {
					next: function(arg){ var tmp;
						if((tmp = this.to)){
							tmp.next(arg);
					}}
				}});
				if(arg instanceof Function){
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
			/* Based on the Hypothetical Amnesia Machine thought experiment */
			function HAM(machineState, incomingState, currentState, incomingValue, currentValue){
				if(machineState < incomingState){
					return {defer: true}; // the incoming value is outside the boundary of the machine's state, it must be reprocessed in another state.
				}
				if(incomingState < currentState){
					return {historical: true}; // the incoming value is within the boundary of the machine's state, but not within the range.

				}
				if(currentState < incomingState){
					return {converge: true, incoming: true}; // the incoming value is within both the boundary and the range of the machine's state.

				}
				if(incomingState === currentState){
					incomingValue = Lexical(incomingValue) || "";
					currentValue = Lexical(currentValue) || "";
					if(incomingValue === currentValue){ // Note: while these are practically the same, the deltas could be technically different
						return {state: true};
					}
					/*
						The following is a naive implementation, but will always work.
						Never change it unless you have specific needs that absolutely require it.
						If changed, your data will diverge unless you guarantee every peer's algorithm has also been changed to be the same.
						As a result, it is highly discouraged to modify despite the fact that it is naive,
						because convergence (data integrity) is generally more important.
						Any difference in this algorithm must be given a new and different name.
					*/
					if(incomingValue < currentValue){ // Lexical only works on simple value types!
						return {converge: true, current: true};
					}
					if(currentValue < incomingValue){ // Lexical only works on simple value types!
						return {converge: true, incoming: true};
					}
				}
				return {err: "Invalid CRDT Data: "+ incomingValue +" to "+ currentValue +" at "+ incomingState +" to "+ currentState +"!"};
			}
			if(typeof JSON === 'undefined'){
				throw new Error(
					'JSON is not included in this browser. Please load it first: ' +
					'ajax.cdnjs.com/ajax/libs/json2/20110223/json2.js'
				);
			}
			var Lexical = JSON.stringify;
			module.exports = HAM;
		})(USE, './HAM');
	USE(function(module){
			var Type = USE('./type');
			var Val = {};
			Val.is = function(v){ // Valid values are a subset of JSON: null, binary, number (!Infinity), text, or a soul relation. Arrays need special algorithms to handle concurrency, so they are not supported directly. Use an extension that supports them if needed but research their problems first.
				if(v === u){ return false }
				if(v === null){ return true } // "deletes", nulling out keys.
				if(v === Infinity){ return false } // we want this to be, but JSON does not support it, sad face.
				if(text_is(v) // by "text" we mean strings.
				|| bi_is(v) // by "binary" we mean boolean.
				|| num_is(v)){ // by "number" we mean integers or decimals.
					return true; // simple values are valid.
				}
				return Val.rel.is(v) || false; // is the value a soul relation? Then it is valid and return it. If not, everything else remaining is an invalid data type. Custom extensions can be built on top of these primitives to support other types.
			};
			Val.link = Val.rel = {_: '#'};
	(function(){
				Val.rel.is = function(v){ // this defines whether an object is a soul relation or not, they look like this: {'#': 'UUID'}
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
			Val.rel.ify = function(t){ return obj_put({}, rel_, t) }; // convert a soul into a relation and return it.
			Type.obj.has._ = '.';
			var rel_ = Val.link._, u;
			var bi_is = Type.bi.is;
			var num_is = Type.num.is;
			var text_is = Type.text.is;
			var obj = Type.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map;
			module.exports = Val;
		})(USE, './val');
	USE(function(module){
			var Type = USE('./type');
			var Val = USE('./val');
			var Node = {_: '_'};
			Node.soul = function(n, o){ return (n && n._ && n._[o || soul_]) }; // convenience function to check to see if there is a soul on a node and return it.
			Node.soul.ify = function(n, o){ // put a soul on an object.
				o = (typeof o === 'string')? {soul: o} : o || {};
				n = n || {}; // make sure it exists.
				n._ = n._ || {}; // make sure meta exists.
				n._[soul_] = o.soul || n._[soul_] || text_random(); // put the soul on it.
				return n;
			};
			Node.soul._ = Val.link._;
	(function(){
				Node.is = function(n, cb, as){ var s; // checks to see if an object is a valid node.
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
				Node.ify = function(obj, o, as){ // returns a node from a shallow object.
					if(!o){ o = {}; }
					else if(typeof o === 'string'){ o = {soul: o}; }
					else if(o instanceof Function){ o = {map: o}; }
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
			module.exports = Node;
		})(USE, './node');
	USE(function(module){
			var Type = USE('./type');
			var Node = USE('./node');
			function State(){
				var t;
				/*if(perf){
					t = start + perf.now(); // Danger: Accuracy decays significantly over time, even if precise.
				} else {*/
					t = time();
				//}
				if(last < t){
					return N = 0, last = t + State.drift;
				}
				return last = t + ((N += 1) / D) + State.drift;
			}
			var time = Type.time.is, last = -Infinity, N = 0, D = 1000; // WARNING! In the future, on machines that are D times faster than 2016AD machines, you will want to increase D by another several orders of magnitude so the processing speed never out paces the decimal resolution (increasing an integer effects the state accuracy).
			var perf = (typeof performance !== 'undefined')? (performance.timing && performance) : false, start = (perf && perf.timing && perf.timing.navigationStart) || (perf = false);
			State._ = '>';
			State.drift = 0;
			State.is = function(n, k, o){ // convenience function to get the state on a key on a node and return it.
				var tmp = (k && n && n[N_] && n[N_][State._]) || o;
				if(!tmp){ return }
				return num_is(tmp = tmp[k])? tmp : -Infinity;
			};
			State.lex = function(){ return State().toString(36).replace('.','') };
			State.ify = function(n, k, s, v, soul){ // put a key's state on a node.
				if(!n || !n[N_]){ // reject if it is not node-like.
					if(!soul){ // unless they passed a soul
						return;
					}
					n = Node.soul.ify(n, soul); // then make it so!
				}
				var tmp = obj_as(n[N_], State._); // grab the states data.
				if(u !== k && k !== N_){
					if(num_is(s)){
						tmp[k] = s; // add the valid state.
					}
					if(u !== v){ // Note: Not its job to check for valid values!
						n[k] = v;
					}
				}
				return n;
			};
			State.to = function(from, k, to){
				var val = (from||{})[k];
				if(obj_is(val)){
					val = obj_copy(val);
				}
				return State.ify(to, k, State.is(from, k), val, Node.soul(from));
			}
			;(function(){
				State.map = function(cb, s, as){ var u; // for use with Node.ify
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
			var obj = Type.obj, obj_as = obj.as, obj_has = obj.has, obj_is = obj.is, obj_map = obj.map, obj_copy = obj.copy;
			var num = Type.num, num_is = num.is;
			var fn = Type.fn, fn_is = fn.is;
			var N_ = Node._, u;
			module.exports = State;
		})(USE, './state');
	USE(function(module){
			var Type = USE('./type');
			var Val = USE('./val');
			var Node = USE('./node');
			var Graph = {};
	(function(){
				Graph.is = function(g, cb, fn, as){ // checks to see if an object is a valid graph.
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
				Graph.ify = function(obj, env, as){
					var at = {path: [], obj: obj};
					if(!env){
						env = {};
					} else
					if(typeof env === 'string'){
						env = {soul: env};
					} else
					if(env instanceof Function){
						env.map = env;
					}
					if(env.soul){
						at.rel = Val.rel.ify(env.soul);
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
						at.rel = at.rel || Val.rel.ify(Node.soul(at.node));
						if(at.obj !== env.shell){
							env.graph[Val.rel.is(at.rel)] = at.node;
						}
					}
					return at;
				}
				function map(v,k,n){
					var at = this, env = at.env, is, tmp;
					if(Node._ === k && obj_has(v,Val.rel._)){
						return n._; // TODO: Bug?
					}
					if(!(is = valid(v,k,n, at,env))){ return }
					if(!k){
						at.node = at.node || n || {};
						if(obj_has(v, Node._) && Node.soul(v)){ // ? for safety ?
							at.node._ = obj_copy(v._);
						}
						at.node = Node.soul.ify(at.node, Val.rel.is(at.rel));
						at.rel = at.rel || Val.rel.ify(Node.soul(at.node));
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
					return tmp.rel; //{'#': Node.soul(tmp.node)};
				}
				function soul(id){ var at = this;
					var prev = Val.link.is(at.rel), graph = at.env.graph;
					at.rel = at.rel || Val.rel.ify(id);
					at.rel[Val.rel._] = id;
					if(at.node && at.node[Node._]){
						at.node[Node._][Val.rel._] = id;
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
			Graph.node = function(node){
				var soul = Node.soul(node);
				if(!soul){ return }
				return obj_put({}, soul, node);
			}
			;(function(){
				Graph.to = function(graph, root, opt){
					if(!graph){ return }
					var obj = {};
					opt = opt || {seen: {}};
					obj_map(graph[root], map, {obj:obj, graph: graph, opt: opt});
					return obj;
				};
				function map(v,k){ var tmp, obj;
					if(Node._ === k){
						if(obj_empty(v, Val.rel._)){
							return;
						}
						this.obj[k] = obj_copy(v);
						return;
					}
					if(!(tmp = Val.rel.is(v))){
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
			module.exports = Graph;
		})(USE, './graph');
	USE(function(module){
			// request / response module, for asking and acking messages.
			USE('./onto'); // depends upon onto!
			module.exports = function ask(cb, as){
				if(!this.on){ return }
				if(!(cb instanceof Function)){
					if(!cb || !as){ return }
					var id = cb['#'] || cb, tmp = (this.tag||empty)[id];
					if(!tmp){ return }
					tmp = this.on(id, as);
					clearTimeout(tmp.err);
					return true;
				}
				var id = (as && as['#']) || Math.random().toString(36).slice(2);
				if(!cb){ return id }
				var to = this.on(id, cb, as);
				to.err = to.err || setTimeout(function(){
					to.next({err: "Error: No ACK received yet.", lack: true});
					to.off();
				}, (this.opt||{}).lack || 9000);
				return id;
			};
		})(USE, './ask');
	USE(function(module){
			var Type = USE('./type');
			function Dup(opt){
				var dup = {s:{}};
				opt = opt || {max: 1000, age: 1000 * 9};//1000 * 60 * 2};
				dup.check = function(id){ var tmp;
					if(!(tmp = dup.s[id])){ return false }
					if(tmp.pass){ return tmp.pass = false }
					return dup.track(id);
				};
				dup.track = function(id, pass){
					var it = dup.s[id] || (dup.s[id] = {});
					it.was = time_is();
					if(pass){ it.pass = true; }
					if(!dup.to){
						dup.to = setTimeout(function(){
							var now = time_is();
							Type.obj.map(dup.s, function(it, id){
								if(it && opt.age > (now - it.was)){ return }
								Type.obj.del(dup.s, id);
							});
							dup.to = null;
						}, opt.age + 9);
					}
					return it;
				};
				return dup;
			}
			var time_is = Type.time.is;
			module.exports = Dup;
		})(USE, './dup');
	USE(function(module){

			function Gun(o){
				if(o instanceof Gun){ return (this._ = {gun: this, $: this}).$ }
				if(!(this instanceof Gun)){ return new Gun(o) }
				return Gun.create(this._ = {gun: this, $: this, opt: o});
			}

			Gun.is = function($){ return ($ instanceof Gun) || ($ && $._ && ($ === $._.$)) || false };

			Gun.version = 0.9;

			Gun.chain = Gun.prototype;
			Gun.chain.toJSON = function(){};

			var Type = USE('./type');
			Type.obj.to(Type, Gun);
			Gun.HAM = USE('./HAM');
			Gun.val = USE('./val');
			Gun.node = USE('./node');
			Gun.state = USE('./state');
			Gun.graph = USE('./graph');
			Gun.on = USE('./onto');
			Gun.ask = USE('./ask');
			Gun.dup = USE('./dup');
	(function(){
				Gun.create = function(at){
					at.root = at.root || at;
					at.graph = at.graph || {};
					at.on = at.on || Gun.on;
					at.ask = at.ask || Gun.ask;
					at.dup = at.dup || Gun.dup();
					var gun = at.$.opt(at.opt);
					if(!at.once){
						at.on('in', root, at);
						at.on('out', root, {at: at, out: root});
						Gun.on('create', at);
						at.on('create', at);
					}
					at.once = 1;
					return gun;
				};
				function root(msg){
					//add to.next(at); // TODO: MISSING FEATURE!!!
					var ev = this, as = ev.as, at = as.at || as, gun = at.$, dup, tmp;
					if(!(tmp = msg['#'])){ tmp = msg['#'] = text_rand(9); }
					if((dup = at.dup).check(tmp)){
						if(as.out === msg.out){
							msg.out = u;
							ev.to.next(msg);
						}
						return;
					}
					dup.track(tmp);
					if(!at.ask(msg['@'], msg)){
						if(msg.get){
							Gun.on.get(msg, gun); //at.on('get', get(msg));
						}
						if(msg.put){
							Gun.on.put(msg, gun); //at.on('put', put(msg));
						}
					}
					ev.to.next(msg);
					if(!as.out){
						msg.out = root;
						at.on('out', msg);
					}
				}
			}());
	(function(){
				Gun.on.put = function(msg, gun){
					var at = gun._, ctx = {$: gun, graph: at.graph, put: {}, map: {}, souls: {}, machine: Gun.state(), ack: msg['@'], cat: at, stop: {}};
					if(!Gun.graph.is(msg.put, null, verify, ctx)){ ctx.err = "Error: Invalid graph!"; }
					if(ctx.err){ return at.on('in', {'@': msg['#'], err: Gun.log(ctx.err) }) }
					obj_map(ctx.put, merge, ctx);
					if(!ctx.async){ obj_map(ctx.map, map, ctx); }
					if(u !== ctx.defer){
						setTimeout(function(){
							Gun.on.put(msg, gun);
						}, ctx.defer - ctx.machine);
					}
					if(!ctx.diff){ return }
					at.on('put', obj_to(msg, {put: ctx.diff}));
				};
				function verify(val, key, node, soul){ var ctx = this;
					var state = Gun.state.is(node, key);
					if(!state){ return ctx.err = "Error: No state on '"+key+"' in node '"+soul+"'!" }
					var vertex = ctx.graph[soul] || empty, was = Gun.state.is(vertex, key, true), known = vertex[key];
					var HAM = Gun.HAM(ctx.machine, state, was, val, known);
					if(!HAM.incoming){
						if(HAM.defer){ // pick the lowest
							ctx.defer = (state < (ctx.defer || Infinity))? state : ctx.defer;
						}
						return;
					}
					ctx.put[soul] = Gun.state.to(node, key, ctx.put[soul]);
					(ctx.diff || (ctx.diff = {}))[soul] = Gun.state.to(node, key, ctx.diff[soul]);
					ctx.souls[soul] = true;
				}
				function merge(node, soul){
					var ctx = this, cat = ctx.$._, at = (cat.next || empty)[soul];
					if(!at){
						if(!(cat.opt||empty).super){
							ctx.souls[soul] = false;
							return;
						}
						at = (ctx.$.get(soul)._);
					}
					var msg = ctx.map[soul] = {
						put: node,
						get: soul,
						$: at.$
					}, as = {ctx: ctx, msg: msg};
					ctx.async = !!cat.tag.node;
					if(ctx.ack){ msg['@'] = ctx.ack; }
					obj_map(node, each, as);
					if(!ctx.async){ return }
					if(!ctx.and){
						// If it is async, we only need to setup one listener per context (ctx)
						cat.on('node', function(m){
							this.to.next(m); // make sure to call other context's listeners.
							if(m !== ctx.map[m.get]){ return } // filter out events not from this context!
							ctx.souls[m.get] = false; // set our many-async flag
							obj_map(m.put, patch, m); // merge into view
							if(obj_map(ctx.souls, function(v){ if(v){ return v } })){ return } // if flag still outstanding, keep waiting.
							if(ctx.c){ return } ctx.c = 1; // failsafe for only being called once per context.
							this.off();
							obj_map(ctx.map, map, ctx); // all done, trigger chains.
						});
					}
					ctx.and = true;
					cat.on('node', msg); // each node on the current context's graph needs to be emitted though.
				}
				function each(val, key){
					var ctx = this.ctx, graph = ctx.graph, msg = this.msg, soul = msg.get, node = msg.put, at = (msg.$._);
					graph[soul] = Gun.state.to(node, key, graph[soul]);
					if(ctx.async){ return }
					at.put = Gun.state.to(node, key, at.put);
				}
				function patch(val, key){
					var msg = this, node = msg.put, at = (msg.$._);
					at.put = Gun.state.to(node, key, at.put);
				}
				function map(msg, soul){
					if(!msg.$){ return }
					this.cat.stop = this.stop; // temporary fix till a better solution?
					(msg.$._).on('in', msg);
					this.cat.stop = null; // temporary fix till a better solution?
				}

				Gun.on.get = function(msg, gun){
					var root = gun._, get = msg.get, soul = get[_soul], node = root.graph[soul], has = get[_has], tmp;
					var next = root.next || (root.next = {}), at = next[soul];
					if(obj_has(soul, '*')){ // TEMPORARY HACK FOR MARTTI, TESTING
						var graph = {};
						Gun.obj.map(root.graph, function(node, s){
							if(Gun.text.match(s, soul)){
								graph[s] = Gun.obj.copy(node);
							}
						});
						if(!Gun.obj.empty(graph)){
							root.on('in', {
								'@': msg['#'],
								how: '*',
								put: graph,
								$: gun
							});
						}
					} // TEMPORARY HACK FOR MARTTI, TESTING
					if(!node){ return root.on('get', msg) }
					if(has){
						if(!obj_has(node, has)){ return root.on('get', msg) }
						node = Gun.state.to(node, has);
						// If we have a key in-memory, do we really need to fetch?
						// Maybe... in case the in-memory key we have is a local write
						// we still need to trigger a pull/merge from peers.
					} else {
						node = Gun.obj.copy(node);
					}
					node = Gun.graph.node(node);
					tmp = (at||empty).ack;
					root.on('in', {
						'@': msg['#'],
						how: 'mem',
						put: node,
						$: gun
					});
					//if(0 < tmp){ return }
					root.on('get', msg);
				};
			}());
	(function(){
				Gun.chain.opt = function(opt){
					opt = opt || {};
					var gun = this, at = gun._, tmp = opt.peers || opt;
					if(!obj_is(opt)){ opt = {}; }
					if(!obj_is(at.opt)){ at.opt = opt; }
					if(text_is(tmp)){ tmp = [tmp]; }
					if(list_is(tmp)){
						tmp = obj_map(tmp, function(url, i, map){
							map(url, {url: url});
						});
						if(!obj_is(at.opt.peers)){ at.opt.peers = {};}
						at.opt.peers = obj_to(tmp, at.opt.peers);
					}
					at.opt.peers = at.opt.peers || {};
					obj_to(opt, at.opt); // copies options on to `at.opt` only if not already taken.
					Gun.on('opt', at);
					at.opt.uuid = at.opt.uuid || function(){ return state_lex() + text_rand(12) };
					return gun;
				};
			}());

			var list_is = Gun.list.is;
			var text = Gun.text, text_is = text.is, text_rand = text.random;
			var obj = Gun.obj, obj_is = obj.is, obj_has = obj.has, obj_to = obj.to, obj_map = obj.map, obj_copy = obj.copy;
			var state_lex = Gun.state.lex, _soul = Gun.val.rel._, _has = '.', node_ = Gun.node._, rel_is = Gun.val.link.is;
			var empty = {}, u;

			console.debug = function(i, s){ return (console.debug.i && i === console.debug.i && console.debug.i++) && (console.log.apply(console, arguments) || s) };

			Gun.log = function(){ return (!Gun.log.off && console.log.apply(console, arguments)), [].slice.call(arguments).join(' ') };
			Gun.log.once = function(w,s,o){ return (o = Gun.log.once)[w] = o[w] || 0, o[w]++ || Gun.log(s) }

			;		Gun.log.once("welcome", "Hello wonderful person! :) Thanks for using GUN, feel free to ask for help on https://gitter.im/amark/gun and ask StackOverflow questions tagged with 'gun'!");

			if(typeof window !== "undefined"){ (window.GUN = window.Gun = Gun).window = window; }
			try{ if(typeof common !== "undefined"){ common.exports = Gun; } }catch(e){}
			module.exports = Gun;

			/*Gun.on('opt', function(ctx){ // FOR TESTING PURPOSES
				this.to.next(ctx);
				if(ctx.once){ return }
				ctx.on('node', function(msg){
					var to = this.to;
					//Gun.node.is(msg.put, function(v,k){ msg.put[k] = v + v });
					setTimeout(function(){
						to.next(msg);
					},1);
				});
			});*/
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
				if(n instanceof Function){
					var yes, tmp = {back: at};
					while((tmp = tmp.back)
					&& u === (yes = n(tmp, opt))){}
					return yes;
				}
				if(Gun.num.is(n)){
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
				cat.on('in', input, cat); // For 'in' if I add my own listeners to each then I MUST do it before in gets called. If I listen globally for all incoming data instead though, regardless of individual listeners, I can transform the data there and then as well.
				cat.on('out', output, cat); // However for output, there isn't really the global option. I must listen by adding my own listener individually BEFORE this one is ever called.
				return chain;
			};

			function output(msg){
				var put, get, at = this.as, back = at.back, root = at.root, tmp;
				if(!msg.I){ msg.I = at.$; }
				if(!msg.$){ msg.$ = at.$; }
				this.to.next(msg);
				if(get = msg.get){
					/*if(u !== at.put){
						at.on('in', at);
						return;
					}*/
					if(get['#'] || at.soul){
						get['#'] = get['#'] || at.soul;
						msg['#'] || (msg['#'] = text_rand(9));
						back = (root.$.get(get['#'])._);
						if(!(get = get['.'])){
							tmp = back.ack;
							if(!tmp){ back.ack = -1; }
							if(obj_has(back, 'put')){
								back.on('in', back);
							}
							if(tmp){ return }
							msg.$ = back.$;
						} else
						if(obj_has(back.put, get)){
							put = (back.$.get(get)._);
							if(!(tmp = put.ack)){ put.ack = -1; }
							back.on('in', {
								$: back.$,
								put: Gun.state.to(back.put, get),
								get: back.get
							});
							if(tmp){ return }
						}
						root.ask(ack, msg);
						return root.on('in', msg);
					}
					if(root.now){ root.now[at.id] = root.now[at.id] || true; at.pass = {}; }
					if(get['.']){
						if(at.get){
							msg = {get: {'.': at.get}, $: at.$};
							//if(back.ask || (back.ask = {})[at.get]){ return }
							(back.ask || (back.ask = {}));
							back.ask[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
							return back.on('out', msg);
						}
						msg = {get: {}, $: at.$};
						return back.on('out', msg);
					}
					at.ack = at.ack || -1;
					if(at.get){
						msg.$ = at.$;
						get['.'] = at.get;
						(back.ask || (back.ask = {}))[at.get] = msg.$._; // TODO: PERFORMANCE? More elegant way?
						return back.on('out', msg);
					}
				}
				return back.on('out', msg);
			}

			function input(msg){
				var eve = this, cat = eve.as, root = cat.root, gun = msg.$, at = (gun||empty)._ || empty, change = msg.put, rel, tmp;
				if(cat.get && msg.get !== cat.get){
					msg = obj_to(msg, {get: cat.get});
				}
				if(cat.has && at !== cat){
					msg = obj_to(msg, {$: cat.$});
					if(at.ack){
						cat.ack = at.ack;
						//cat.ack = cat.ack || at.ack;
					}
				}
				if(u === change){
					tmp = at.put;
					eve.to.next(msg);
					if(cat.soul){ return } // TODO: BUG, I believee the fresh input refactor caught an edge case that a `gun.get('soul').get('key')` that points to a soul that doesn't exist will not trigger val/get etc.
					if(u === tmp && u !== at.put){ return }
					echo(cat, msg, eve);
					if(cat.has){
						not(cat, msg);
					}
					obj_del(at.echo, cat.id);
					obj_del(cat.map, at.id);
					return;
				}
				if(cat.soul){
					eve.to.next(msg);
					echo(cat, msg, eve);
					if(cat.next){ obj_map(change, map, {msg: msg, cat: cat}); }
					return;
				}
				if(!(rel = Gun.val.link.is(change))){
					if(Gun.val.is(change)){
						if(cat.has || cat.soul){
							not(cat, msg);
						} else
						if(at.has || at.soul){
							(at.echo || (at.echo = {}))[cat.id] = at.echo[at.id] || cat;
							(cat.map || (cat.map = {}))[at.id] = cat.map[at.id] || {at: at};
							//if(u === at.put){ return } // Not necessary but improves performance. If we have it but at does not, that means we got things out of order and at will get it. Once at gets it, it will tell us again.
						}
						eve.to.next(msg);
						echo(cat, msg, eve);
						return;
					}
					if(cat.has && at !== cat && obj_has(at, 'put')){
						cat.put = at.put;
					}				if((rel = Gun.node.soul(change)) && at.has){
						at.put = (cat.root.$.get(rel)._).put;
					}
					tmp = (root.stop || {})[at.id];
					//if(tmp && tmp[cat.id]){ } else {
						eve.to.next(msg);
					//}
					relate(cat, msg, at, rel);
					echo(cat, msg, eve);
					if(cat.next){ obj_map(change, map, {msg: msg, cat: cat}); }
					return;
				}
				var was = root.stop;
				tmp = root.stop || {};
				tmp = tmp[at.id] || (tmp[at.id] = {});
				//if(tmp[cat.id]){ return }
				tmp.is = tmp.is || at.put;
				tmp[cat.id] = at.put || true;
				//if(root.stop){
					eve.to.next(msg);
				//}
				relate(cat, msg, at, rel);
				echo(cat, msg, eve);
			}

			function relate(at, msg, from, rel){
				if(!rel || node_ === at.get){ return }
				var tmp = (at.root.$.get(rel)._);
				if(at.has){
					from = tmp;
				} else
				if(from.has){
					relate(from, msg, from, rel);
				}
				if(from === at){ return }
				if(!from.$){ from = {}; }
				(from.echo || (from.echo = {}))[at.id] = from.echo[at.id] || at;
				if(at.has && !(at.map||empty)[from.id]){ // if we haven't seen this before.
					not(at, msg);
				}
				tmp = from.id? ((at.map || (at.map = {}))[from.id] = at.map[from.id] || {at: from}) : {};
				if(rel === tmp.link){
					if(!(tmp.pass || at.pass)){
						return;
					}
				}
				if(at.pass){
					Gun.obj.map(at.map, function(tmp){ tmp.pass = true; });
					obj_del(at, 'pass');
				}
				if(tmp.pass){ obj_del(tmp, 'pass'); }
				if(at.has){ at.link = rel; }
				ask(at, tmp.link = rel);
			}
			function echo(at, msg, ev){
				if(!at.echo){ return } // || node_ === at.get ?
				//if(at.has){ msg = obj_to(msg, {event: ev}) }
				obj_map(at.echo, reverb, msg);
			}
			function reverb(to){
				if(!to || !to.on){ return }
				to.on('in', this);
			}
			function map(data, key){ // Map over only the changes on every update.
				var cat = this.cat, next = cat.next || empty, via = this.msg, chain, at, tmp;
				if(node_ === key && !next[key]){ return }
				if(!(at = next[key])){
					return;
				}
				//if(data && data[_soul] && (tmp = Gun.val.rel.is(data)) && (tmp = (cat.root.$.get(tmp)._)) && obj_has(tmp, 'put')){
				//	data = tmp.put;
				//}
				if(at.has){
					//if(!(data && data[_soul] && Gun.val.rel.is(data) === Gun.node.soul(at.put))){
					if(u === at.put || !Gun.val.link.is(data)){
						at.put = data;
					}
					chain = at.$;
				} else
				if(tmp = via.$){
					tmp = (chain = via.$.get(key))._;
					if(u === tmp.put || !Gun.val.link.is(data)){
						tmp.put = data;
					}
				}
				at.on('in', {
					put: data,
					get: key,
					$: chain,
					via: via
				});
			}
			function not(at, msg){
				if(!(at.has || at.soul)){ return }
				var tmp = at.map, root = at.root;
				at.map = null;
				if(at.has){ at.link = null; }
				//if(!root.now || !root.now[at.id]){
				if(!at.pass){
					if((!msg['@']) && null === tmp){ return }
					//obj_del(at, 'pass');
				}
				if(u === tmp && Gun.val.link.is(at.put)){ return } // This prevents the very first call of a thing from triggering a "clean up" call. // TODO: link.is(at.put) || !val.is(at.put) ?
				obj_map(tmp, function(proxy){
					if(!(proxy = proxy.at)){ return }
					obj_del(proxy.echo, at.id);
				});
				tmp = at.put;
				obj_map(at.next, function(neat, key){
					if(u === tmp && u !== at.put){ return true }
					neat.put = u;
					if(neat.ack){
						neat.ack = -1;
					}
					neat.on('in', {
						get: key,
						$: neat.$,
						put: u
					});
				});
			}
			function ask(at, soul){
				var tmp = (at.root.$.get(soul)._);
				if(at.ack){
					tmp.on('out', {get: {'#': soul}});
					if(!at.ask){ return } // TODO: PERFORMANCE? More elegant way?
				}
				tmp = at.ask; Gun.obj.del(at, 'ask');
				obj_map(tmp || at.next, function(neat, key){
					neat.on('out', {get: {'#': soul, '.': key}});
				});
				Gun.obj.del(at, 'ask'); // TODO: PERFORMANCE? More elegant way?
			}
			function ack(msg, ev){
				var as = this.as, get = as.get || empty, at = as.$._, tmp = (msg.put||empty)[get['#']];
				if(at.ack){ at.ack = (at.ack + 1) || 1; }
				if(!msg.put || (get['.'] && !obj_has(tmp, at.get))){
					if(at.put !== u){ return }
					at.on('in', {
						get: at.get,
						put: at.put = u,
						$: at.$,
						'@': msg['@']
					});
					return;
				}
				if(node_ == get['.']){ // is this a security concern?
					at.on('in', {get: at.get, put: Gun.val.link.ify(get['#']), $: at.$, '@': msg['@']});
					return;
				}
				msg.$ = at.root.$;
				Gun.on.put(msg, at.root.$);
			}
			var empty = {}, u;
			var obj = Gun.obj, obj_has = obj.has, obj_put = obj.put, obj_del = obj.del, obj_to = obj.to, obj_map = obj.map;
			var text_rand = Gun.text.random;
			var _soul = Gun.val.rel._, node_ = Gun.node._;
		})(USE, './chain');
	USE(function(module){
			var Gun = USE('./root');
			Gun.chain.get = function(key, cb, as){
				var gun, tmp;
				if(typeof key === 'string'){
					var back = this, cat = back._;
					var next = cat.next || empty;
					if(!(gun = next[key])){
						gun = cache(key, back);
					}
					gun = gun.$;
				} else
				if(key instanceof Function){
					if(true === cb){ return soul(this, key, cb, as) }
					gun = this;
					var at = gun._, root = at.root, tmp = root.now, ev;
					as = cb || {};
					as.at = at;
					as.use = key;
					as.out = as.out || {};
					as.out.get = as.out.get || {};
					(ev = at.on('in', use, as)).rid = rid;
					(root.now = {$:1})[as.now = at.id] = ev;
					var mum = root.mum; root.mum = {};
					at.on('out', as.out);
					root.mum = mum;
					root.now = tmp;
					return gun;
				} else
				if(num_is(key)){
					return this.get(''+key, cb, as);
				} else
				if(tmp = rel.is(key)){
					return this.get(tmp, cb, as);
				} else {
					(as = this.chain())._.err = {err: Gun.log('Invalid get request!', key)}; // CLEAN UP
					if(cb){ cb.call(as, as._.err); }
					return as;
				}
				if(tmp = cat.stun){ // TODO: Refactor?
					gun._.stun = gun._.stun || tmp;
				}
				if(cb && cb instanceof Function){
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
				if(tmp = cat.soul){ return cb(tmp, as, cat), gun }
				if(tmp = cat.link){ return cb(tmp, as, cat), gun }
				gun.get(function(msg, ev){
					if(u === msg.put && (tmp = (obj_map(cat.root.opt.peers, function(v,k,t){t(k);})||[]).length) && acks++ <= tmp){
						return;
					}
					ev.rid(msg);
					var at = ((at = msg.$) && at._) || {};
					tmp = at.link || at.soul || rel.is(msg.put) || node_soul(msg.put) || at.dub;
					cb(tmp, as, msg, ev);
				}, {out: {get: {'.':true}}});
				return gun;
			}
			function use(msg){
				var eve = this, as = eve.as, cat = as.at, root = cat.root, gun = msg.$, at = (gun||{})._ || {}, data = msg.put || at.put, tmp;
				if((tmp = root.now) && eve !== tmp[as.now]){ return eve.to.next(msg) }
				//console.log("USE:", cat.id, cat.soul, cat.has, cat.get, msg, root.mum);
				//if(at.async && msg.root){ return }
				//if(at.async === 1 && cat.async !== true){ return }
				//if(root.stop && root.stop[at.id]){ return } root.stop && (root.stop[at.id] = true);
				//if(!at.async && !cat.async && at.put && msg.put === at.put){ return }
				//else if(!cat.async && msg.put !== at.put && root.stop && root.stop[at.id]){ return } root.stop && (root.stop[at.id] = true);


				//root.stop && (root.stop.ID = root.stop.ID || Gun.text.random(2));
				//if((tmp = root.stop) && (tmp = tmp[at.id] || (tmp[at.id] = {})) && tmp[cat.id]){ return } tmp && (tmp[cat.id] = true);
				if(eve.seen && at.id && eve.seen[at.id]){ return eve.to.next(msg) }
				//if((tmp = root.stop)){ if(tmp[at.id]){ return } tmp[at.id] = msg.root; } // temporary fix till a better solution?
				if((tmp = data) && tmp[rel._] && (tmp = rel.is(tmp))){
					tmp = ((msg.$$ = at.root.gun.get(tmp))._);
					if(u !== tmp.put){
						msg = obj_to(msg, {put: data = tmp.put});
					}
				}
				if((tmp = root.mum) && at.id){ // TODO: can we delete mum entirely now?
					var id = at.id + (eve.id || (eve.id = Gun.text.random(9)));
					if(tmp[id]){ return }
					if(u !== data && !rel.is(data)){ tmp[id] = true; }
				}
				as.use(msg, eve);
				if(eve.stun){
					eve.stun = null;
					return;
				}
				eve.to.next(msg);
			}
			function rid(at){
				var cat = this.on;
				if(!at || cat.soul || cat.has){ return this.off() }
				if(!(at = (at = (at = at.$ || at)._ || at).id)){ return }
				var map = cat.map, tmp, seen;
				//if(!map || !(tmp = map[at]) || !(tmp = tmp.at)){ return }
				if(tmp = (seen = this.seen || (this.seen = {}))[at]){ return true }
				seen[at] = true;
				return;
				//tmp.echo[cat.id] = {}; // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
				//obj.del(map, at); // TODO: Warning: This unsubscribes ALL of this chain's listeners from this link, not just the one callback event.
				return;
			}
			var obj = Gun.obj, obj_map = obj.map, obj_has = obj.has, obj_to = Gun.obj.to;
			var num_is = Gun.num.is;
			var rel = Gun.val.link, node_soul = Gun.node.soul, node_ = Gun.node._;
			var empty = {}, u;
		})(USE, './get');
	USE(function(module){
			var Gun = USE('./root');
			Gun.chain.put = function(data, cb, as){
				// #soul.has=value>state
				// ~who#where.where=what>when@was
				// TODO: BUG! Put probably cannot handle plural chains!
				var gun = this, at = (gun._), root = at.root.$, tmp;
				as = as || {};
				as.data = data;
				as.via = as.$ = as.via || as.$ || gun;
				if(typeof cb === 'string'){
					as.soul = cb;
				} else {
					as.ack = as.ack || cb;
				}
				if(at.soul){
					as.soul = at.soul;
				}
				if(as.soul || root === gun){
					if(!obj_is(as.data)){
						(as.ack||noop).call(as, as.out = {err: Gun.log("Data saved to the root level of the graph must be a node (an object), not a", (typeof as.data), 'of "' + as.data + '"!')});
						if(as.res){ as.res(); }
						return gun;
					}
					as.soul = as.soul || (as.not = Gun.node.soul(as.data) || (as.via.back('opt.uuid') || Gun.text.random)());
					if(!as.soul){ // polyfill async uuid for SEA
						as.via.back('opt.uuid')(function(err, soul){ // TODO: improve perf without anonymous callback
							if(err){ return Gun.log(err) } // TODO: Handle error!
							(as.ref||as.$).put(as.data, as.soul = soul, as);
						});
						return gun;
					}
					as.$ = root.get(as.soul);
					as.ref = as.$;
					ify(as);
					return gun;
				}
				if(Gun.is(data)){
					data.get(function(soul, o, msg){
						if(!soul && Gun.val.is(msg.put)){
							return Gun.log("The reference you are saving is a", typeof msg.put, '"'+ msg.put +'", not a node (object)!');
						}
						gun.put(Gun.val.rel.ify(soul), cb, as);
					}, true);
					return gun;
				}
				as.ref = as.ref || (root._ === (tmp = at.back))? gun : tmp.$;
				if(as.ref._.soul && Gun.val.is(as.data) && at.get){
					as.data = obj_put({}, at.get, as.data);
					as.ref.put(as.data, as.soul, as);
					return gun;
				}
				as.ref.get(any, true, {as: as});
				if(!as.out){
					// TODO: Perf idea! Make a global lock, that blocks everything while it is on, but if it is on the lock it does the expensive lookup to see if it is a dependent write or not and if not then it proceeds full speed. Meh? For write heavy async apps that would be terrible.
					as.res = as.res || stun; // Gun.on.stun(as.ref); // TODO: BUG! Deal with locking?
					as.$._.stun = as.ref._.stun;
				}
				return gun;
			};

			function ify(as){
				as.batch = batch;
				var opt = as.opt||{}, env = as.env = Gun.state.map(map, opt.state);
				env.soul = as.soul;
				as.graph = Gun.graph.ify(as.data, env, as);
				if(env.err){
					(as.ack||noop).call(as, as.out = {err: Gun.log(env.err)});
					if(as.res){ as.res(); }
					return;
				}
				as.batch();
			}

			function stun(cb){
				if(cb){ cb(); }
				return;
				var as = this;
				if(!as.ref){ return }
				if(cb){
					as.after = as.ref._.tag;
					as.now = as.ref._.tag = {};
					cb();
					return;
				}
				if(as.after){
					as.ref._.tag = as.after;
				}
			}

			function batch(){ var as = this;
				if(!as.graph || obj_map(as.stun, no)){ return }
				as.res = as.res || function(cb){ if(cb){ cb(); } };
				as.res(function(){
					var cat = (as.$.back(-1)._), ask = cat.ask(function(ack){
						cat.root.on('ack', ack);
						if(ack.err){ Gun.log(ack); }
						if(!ack.lack){ this.off(); } // One response is good enough for us currently. Later we may want to adjust this.
						if(!as.ack){ return }
						as.ack(ack, this);
					}, as.opt);
					// NOW is a hack to get synchronous replies to correctly call.
					// and STOP is a hack to get async behavior to correctly call.
					// neither of these are ideal, need to be fixed without hacks,
					// but for now, this works for current tests. :/
					var tmp = cat.root.now; obj.del(cat.root, 'now');
					var mum = cat.root.mum; cat.root.mum = {};
					(as.ref._).on('out', {
						$: as.ref, put: as.out = as.env.graph, opt: as.opt, '#': ask
					});
					cat.root.mum = mum? obj.to(mum, cat.root.mum) : mum;
					cat.root.now = tmp;
				}, as);
				if(as.res){ as.res(); }
			} function no(v,k){ if(v){ return true } }

			function map(v,k,n, at){ var as = this;
				var is = Gun.is(v);
				if(k || !at.path.length){ return }
				(as.res||iife)(function(){
					var path = at.path, ref = as.ref, opt = as.opt;
					var i = 0, l = path.length;
					for(i; i < l; i++){
						ref = ref.get(path[i]);
					}
					if(is){ ref = v; }
					var id = (ref._).dub;
					if(id || (id = Gun.node.soul(at.obj))){
						ref.back(-1).get(id);
						at.soul(id);
						return;
					}
					(as.stun = as.stun || {})[path] = true;
					ref.get(soul, true, {as: {at: at, as: as, p:path}});
				}, {as: as, at: at});
				//if(is){ return {} }
			}

			function soul(id, as, msg, eve){
				var as = as.as, cat = as.at; as = as.as;
				var at = ((msg || {}).$ || {})._ || {};
				id = at.dub = at.dub || id || Gun.node.soul(cat.obj) || Gun.node.soul(msg.put || at.put) || Gun.val.rel.is(msg.put || at.put) || (as.via.back('opt.uuid') || Gun.text.random)(); // TODO: BUG!? Do we really want the soul of the object given to us? Could that be dangerous?
				if(eve){ eve.stun = true; }
				if(!id){ // polyfill async uuid for SEA
					at.via.back('opt.uuid')(function(err, id){ // TODO: improve perf without anonymous callback
						if(err){ return Gun.log(err) } // TODO: Handle error.
						solve(at, at.dub = at.dub || id, cat, as);
					});
					return;
				}
				solve(at, at.dub = id, cat, as);
			}

			function solve(at, id, cat, as){
				at.$.back(-1).get(id);
				cat.soul(id);
				as.stun[cat.path] = false;
				as.batch();
			}

			function any(soul, as, msg, eve){
				as = as.as;
				if(!msg.$ || !msg.$._){ return } // TODO: Handle
				if(msg.err){ // TODO: Handle
					console.log("Please report this as an issue! Put.any.err");
					return;
				}
				var at = (msg.$._), data = at.put, opt = as.opt||{}, tmp;
				if((tmp = as.ref) && tmp._.now){ return }
				if(eve){ eve.stun = true; }
				if(as.ref !== as.$){
					tmp = (as.$._).get || at.get;
					if(!tmp){ // TODO: Handle
						console.log("Please report this as an issue! Put.no.get"); // TODO: BUG!??
						return;
					}
					as.data = obj_put({}, tmp, as.data);
					tmp = null;
				}
				if(u === data){
					if(!at.get){ return } // TODO: Handle
					if(!soul){
						tmp = at.$.back(function(at){
							if(at.link || at.soul){ return at.link || at.soul }
							as.data = obj_put({}, at.get, as.data);
						});
					}
					tmp = tmp || at.soul || at.link || at.dub;// || at.get;
					at = tmp? (at.root.$.get(tmp)._) : at;
					as.soul = tmp;
					data = as.data;
				}
				if(!as.not && !(as.soul = as.soul || soul)){
					if(as.path && obj_is(as.data)){
						as.soul = (opt.uuid || as.via.back('opt.uuid') || Gun.text.random)();
					} else {
						//as.data = obj_put({}, as.$._.get, as.data);
						if(node_ == at.get){
							as.soul = (at.put||empty)['#'] || at.dub;
						}
						as.soul = as.soul || at.soul || at.soul || (opt.uuid || as.via.back('opt.uuid') || Gun.text.random)();
					}
					if(!as.soul){ // polyfill async uuid for SEA
						as.via.back('opt.uuid')(function(err, soul){ // TODO: improve perf without anonymous callback
							if(err){ return Gun.log(err) } // Handle error.
							as.ref.put(as.data, as.soul = soul, as);
						});
						return;
					}
				}
				as.ref.put(as.data, as.soul, as);
			}
			var obj = Gun.obj, obj_is = obj.is, obj_put = obj.put, obj_map = obj.map;
			var u, empty = {}, noop = function(){}, iife = function(fn,as){fn.call(as||empty);};
			var node_ = Gun.node._;
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
			Gun.chain.on = function(tag, arg, eas, as){
				var gun = this, at = gun._, act;
				if(typeof tag === 'string'){
					if(!arg){ return at.on(tag) }
					act = at.on(tag, arg, eas || at, as);
					if(eas && eas.$){
						(eas.subs || (eas.subs = [])).push(act);
					}
					return gun;
				}
				var opt = arg;
				opt = (true === opt)? {change: true} : opt || {};
				opt.at = at;
				opt.ok = tag;
				//opt.last = {};
				gun.get(ok, opt); // TODO: PERF! Event listener leak!!!?
				return gun;
			};

			function ok(msg, ev){ var opt = this;
				var gun = msg.$, at = (gun||{})._ || {}, data = at.put || msg.put, cat = opt.at, tmp;
				if(u === data){
					return;
				}
				if(tmp = msg.$$){
					tmp = (msg.$$._);
					if(u === tmp.put){
						return;
					}
					data = tmp.put;
				}
				if(opt.change){ // TODO: BUG? Move above the undef checks?
					data = msg.put;
				}
				// DEDUPLICATE // TODO: NEEDS WORK! BAD PROTOTYPE
				//if(tmp.put === data && tmp.get === id && !Gun.node.soul(data)){ return }
				//tmp.put = data;
				//tmp.get = id;
				// DEDUPLICATE // TODO: NEEDS WORK! BAD PROTOTYPE
				//at.last = data;
				if(opt.as){
					opt.ok.call(opt.as, msg, ev);
				} else {
					opt.ok.call(gun, data, msg.get, msg, ev);
				}
			}

			Gun.chain.val = function(cb, opt){
				Gun.log.once("onceval", "Future Breaking API Change: .val -> .once, apologies unexpected.");
				return this.once(cb, opt);
			};
			Gun.chain.once = function(cb, opt){
				var gun = this, at = gun._, data = at.put;
				if(0 < at.ack && u !== data){
					(cb || noop).call(gun, data, at.get);
					return gun;
				}
				if(cb){
					(opt = opt || {}).ok = cb;
					opt.at = at;
					opt.out = {'#': Gun.text.random(9)};
					gun.get(val, {as: opt});
					opt.async = true; //opt.async = at.stun? 1 : true;
				} else {
					Gun.log.once("valonce", "Chainable val is experimental, its behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
					var chain = gun.chain();
					chain._.nix = gun.once(function(){
						chain._.on('in', gun._);
					});
					return chain;
				}
				return gun;
			};

			function val(msg, eve, to){
				var opt = this.as, cat = opt.at, gun = msg.$, at = gun._, data = at.put || msg.put, link, tmp;
				if(tmp = msg.$$){
					link = tmp = (msg.$$._);
					if(u !== link.put){
						data = link.put;
					}
				}
				if((tmp = eve.wait) && (tmp = tmp[at.id])){ clearTimeout(tmp); }
				if((!to && (u === data || at.soul || at.link || (link && !(0 < link.ack))))
				|| (u === data && (tmp = (obj_map(at.root.opt.peers, function(v,k,t){t(k);})||[]).length) && (!to && (link||at).ack <= tmp))){
					tmp = (eve.wait = {})[at.id] = setTimeout(function(){
						val.call({as:opt}, msg, eve, tmp || 1);
					}, opt.wait || 99);
					return;
				}
				if(link && u === link.put && (tmp = rel.is(data))){ data = Gun.node.ify({}, tmp); }
				eve.rid(msg);
				opt.ok.call(gun || opt.$, data, msg.get);
			}

			Gun.chain.off = function(){
				// make off more aggressive. Warning, it might backfire!
				var gun = this, at = gun._, tmp;
				var cat = at.back;
				if(!cat){ return }
				if(tmp = cat.next){
					if(tmp[at.get]){
						obj_del(tmp, at.get);
					}
				}
				if(tmp = cat.ask){
					obj_del(tmp, at.get);
				}
				if(tmp = cat.put){
					obj_del(tmp, at.get);
				}
				if(tmp = at.soul){
					obj_del(cat.root.graph, tmp);
				}
				if(tmp = at.map){
					obj_map(tmp, function(at){
						if(at.link){
							cat.root.$.get(at.link).off();
						}
					});
				}
				if(tmp = at.next){
					obj_map(tmp, function(neat){
						neat.$.off();
					});
				}
				at.on('off', {});
				return gun;
			};
			var obj = Gun.obj, obj_map = obj.map, obj_has = obj.has, obj_del = obj.del, obj_to = obj.to;
			var rel = Gun.val.link;
			var noop = function(){}, u;
		})(USE, './on');
	USE(function(module){
			var Gun = USE('./index');
			Gun.chain.map = function(cb, opt, t){
				var gun = this, cat = gun._, chain;
				if(!cb){
					if(chain = cat.each){ return chain }
					cat.each = chain = gun.chain();
					chain._.nix = gun.back('nix');
					gun.on('in', map, chain._);
					return chain;
				}
				Gun.log.once("mapfn", "Map functions are experimental, their behavior and API may change moving forward. Please play with it and report bugs and ideas on how to improve it.");
				chain = gun.chain();
				gun.map().on(function(data, key, at, ev){
					var next = (cb||noop).call(this, data, key, at, ev);
					if(u === next){ return }
					if(data === next){ return chain._.on('in', at) }
					if(Gun.is(next)){ return chain._.on('in', next._) }
					chain._.on('in', {get: key, put: next});
				});
				return chain;
			};
			function map(msg){
				if(!msg.put || Gun.val.is(msg.put)){ return this.to.next(msg) }
				if(this.as.nix){ this.off(); } // TODO: Ugly hack!
				obj_map(msg.put, each, {at: this.as, msg: msg});
				this.to.next(msg);
			}
			function each(v,k){
				if(n_ === k){ return }
				var msg = this.msg, gun = msg.$, at = this.at, tmp = (gun.get(k)._);
				(tmp.echo || (tmp.echo = {}))[at.id] = tmp.echo[at.id] || at;
			}
			var obj_map = Gun.obj.map, noop = function(){}, n_ = Gun.node._, u;
		})(USE, './map');
	USE(function(module){
			var Gun = USE('./index');
			Gun.chain.set = function(item, cb, opt){
				var gun = this, soul;
				cb = cb || function(){};
				opt = opt || {}; opt.item = opt.item || item;
				if(soul = Gun.node.soul(item)){ item = Gun.obj.put({}, soul, Gun.val.link.ify(soul)); }
				if(!Gun.is(item)){
					if(Gun.obj.is(item)){					item = gun.back(-1).get(soul = soul || Gun.node.soul(item) || gun.back('opt.uuid')()).put(item);
					}
					return gun.get(soul || (Gun.state.lex() + Gun.text.random(7))).put(item, cb, opt);
				}
				item.get(function(soul, o, msg){
					if(!soul){ return cb.call(gun, {err: Gun.log('Only a node can be linked! Not "' + msg.put + '"!')}) }
					gun.put(Gun.obj.put({}, soul, Gun.val.link.ify(soul)), cb, opt);
				},true);
				return item;
			};
		})(USE, './set');
	USE(function(module){
			if(typeof Gun === 'undefined'){ return } // TODO: localStorage is Browser only. But it would be nice if it could somehow plugin into NodeJS compatible localStorage APIs?

			var noop = function(){}, store;
			try{store = (Gun.window||noop).localStorage;}catch(e){}
			if(!store){
				console.log("Warning: No localStorage exists to persist data to!");
				store = {setItem: function(k,v){this[k]=v;}, removeItem: function(k){delete this[k];}, getItem: function(k){return this[k]}};
			}
			/*
				NOTE: Both `lib/file.js` and `lib/memdisk.js` are based on this design!
				If you update anything here, consider updating the other adapters as well.
			*/

			Gun.on('create', function(root){
				// This code is used to queue offline writes for resync.
				// See the next 'opt' code below for actual saving of data.
				var ev = this.to, opt = root.opt;
				if(root.once){ return ev.next(root) }
				//if(false === opt.localStorage){ return ev.next(root) } // we want offline resynce queue regardless!
				opt.prefix = opt.file || 'gun/';
				var gap = Gun.obj.ify(store.getItem('gap/'+opt.prefix)) || {};
				var empty = Gun.obj.empty, id, to;
				// add re-sync command.
				if(!empty(gap)){
					var disk = Gun.obj.ify(store.getItem(opt.prefix)) || {}, send = {};
					Gun.obj.map(gap, function(node, soul){
						Gun.obj.map(node, function(val, key){
							send[soul] = Gun.state.to(disk[soul], key, send[soul]);
						});
					});
					setTimeout(function(){
						root.on('out', {put: send, '#': root.ask(ack), I: root.$});
					},1);
				}

				root.on('out', function(msg){
					if(msg.lS){ return }
					if(msg.I && msg.put && !msg['@'] && !empty(opt.peers)){
						id = msg['#'];
						Gun.graph.is(msg.put, null, map);
						if(!to){ to = setTimeout(flush, opt.wait || 1); }
					}
					this.to.next(msg);
				});
				root.on('ack', ack);

				function ack(ack){ // TODO: This is experimental, not sure if we should keep this type of event hook.
					if(ack.err || !ack.ok){ return }
					var id = ack['@'];
					setTimeout(function(){
						Gun.obj.map(gap, function(node, soul){
							Gun.obj.map(node, function(val, key){
								if(id !== val){ return }
								delete node[key];
							});
							if(empty(node)){
								delete gap[soul];
							}
						});
						flush();
					}, opt.wait || 1);
				}			ev.next(root);

				var map = function(val, key, node, soul){
					(gap[soul] || (gap[soul] = {}))[key] = id;
				};
				var flush = function(){
					clearTimeout(to);
					to = false;
					try{store.setItem('gap/'+opt.prefix, JSON.stringify(gap));
					}catch(e){ Gun.log(err = e || "localStorage failure"); }
				};
			});

			Gun.on('create', function(root){
				this.to.next(root);
				var opt = root.opt;
				if(root.once){ return }
				if(false === opt.localStorage){ return }
				opt.prefix = opt.file || 'gun/';
				var graph = root.graph, acks = {}, count = 0, to;
				var disk = Gun.obj.ify(store.getItem(opt.prefix)) || {};
				root.on('localStorage', disk); // NON-STANDARD EVENT!

				root.on('put', function(at){
					this.to.next(at);
					Gun.graph.is(at.put, null, map);
					if(!at['@']){ acks[at['#']] = true; } // only ack non-acks.
					count += 1;
					if(count >= (opt.batch || 1000)){
						return flush();
					}
					if(to){ return }
					to = setTimeout(flush, opt.wait || 1);
				});

				root.on('get', function(msg){
					this.to.next(msg);
					var lex = msg.get, soul, data, u;
					function to(){
					if(!lex || !(soul = lex['#'])){ return }
					//if(0 >= msg.cap){ return }
					var has = lex['.'];
					data = disk[soul] || u;
					if(data && has){
						data = Gun.state.to(data, has);
					}
					if(!data && !Gun.obj.empty(opt.peers)){ // if data not found, don't ack if there are peers.
						return; // Hmm, what if we have peers but we are disconnected?
					}
					//console.log("lS get", lex, data);
					root.on('in', {'@': msg['#'], put: Gun.graph.node(data), how: 'lS', lS: msg.I});
					}				Gun.debug? setTimeout(to,1) : to();
				});

				var map = function(val, key, node, soul){
					disk[soul] = Gun.state.to(node, key, disk[soul]);
				};

				var flush = function(data){
					var err;
					count = 0;
					clearTimeout(to);
					to = false;
					var ack = acks;
					acks = {};
					if(data){ disk = data; }
					try{store.setItem(opt.prefix, JSON.stringify(disk));
					}catch(e){
						Gun.log(err = (e || "localStorage failure") + " Consider using GUN's IndexedDB plugin for RAD for more storage space, temporary example at https://github.com/amark/gun/blob/master/test/tmp/indexedDB.html .");
						root.on('localStorage:error', {err: err, file: opt.prefix, flush: disk, retry: flush});
					}
					if(!err && !Gun.obj.empty(opt.peers)){ return } // only ack if there are no peers.
					Gun.obj.map(ack, function(yes, id){
						root.on('in', {
							'@': id,
							err: err,
							ok: 0 // localStorage isn't reliable, so make its `ok` code be a low number.
						});
					});
				};
			});
		})(USE, './adapters/localStorage');
	USE(function(module){
			var Type = USE('../type');

			function Mesh(ctx){
				var mesh = function(){};
				var opt = ctx.opt || {};
				opt.log = opt.log || console.log;
				opt.gap = opt.gap || opt.wait || 1;
				opt.pack = opt.pack || (opt.memory? (opt.memory * 1000 * 1000) : 1399000000) * 0.3; // max_old_space_size defaults to 1400 MB.

				mesh.out = function(msg){ var tmp;
					if(this.to){ this.to.next(msg); }
					//if(mesh.last != msg['#']){ return mesh.last = msg['#'], this.to.next(msg) }
					if((tmp = msg['@'])
					&& (tmp = ctx.dup.s[tmp])
					&& (tmp = tmp.it)
					&& tmp.mesh){
						mesh.say(msg, tmp.mesh.via, 1);
						tmp['##'] = msg['##'];
						return;
					}
					// add hook for AXE?
					//if (Gun.AXE && opt && opt.super) { Gun.AXE.say(msg, mesh.say, this); return; } // rogowski
					mesh.say(msg);
				};

				ctx.on('create', function(root){
					root.opt.pid = root.opt.pid || Type.text.random(9);
					this.to.next(root);
					ctx.on('out', mesh.out);
				});

				mesh.hear = function(raw, peer){
					if(!raw){ return }
					var dup = ctx.dup, id, hash, msg, tmp = raw[0];
					if(opt.pack <= raw.length){ return mesh.say({dam: '!', err: "Message too big!"}, peer) }
					try{msg = JSON.parse(raw);
					}catch(e){opt.log('DAM JSON parse error', e);}
					if('{' === tmp){
						if(!msg){ return }
						if(dup.check(id = msg['#'])){ return }
						dup.track(id, true).it = msg; // GUN core also dedups, so `true` is needed.
						if((tmp = msg['@']) && msg.put){
							hash = msg['##'] || (msg['##'] = mesh.hash(msg));
							if((tmp = tmp + hash) != id){
								if(dup.check(tmp)){ return }
								(tmp = dup.s)[hash] = tmp[id];
							}
						}
						(msg.mesh = function(){}).via = peer;
						if((tmp = msg['><'])){
							msg.mesh.to = Type.obj.map(tmp.split(','), function(k,i,m){m(k,true);});
						}
						if(msg.dam){
							if(tmp = mesh.hear[msg.dam]){
								tmp(msg, peer, ctx);
							}
							return;
						}
	          
						ctx.on('in', msg);

						return;
					} else
					if('[' === tmp){
						if(!msg){ return }
						var i = 0, m;
						while(m = msg[i++]){
							mesh.hear(m, peer);
						}

						return;
					}
				}

				;(function(){
					mesh.say = function(msg, peer, o){
						/*
							TODO: Plenty of performance optimizations
							that can be made just based off of ordering,
							and reducing function calls for cached writes.
						*/
						if(!peer){
							Type.obj.map(opt.peers, function(peer){
								mesh.say(msg, peer);
							});
							return;
						}
						var tmp, wire = peer.wire || ((opt.wire) && opt.wire(peer)), msh, raw;// || open(peer, ctx); // TODO: Reopen!
						if(!wire){ return }
						msh = msg.mesh || empty;
						if(peer === msh.via){ return }
						if(!(raw = msh.raw)){ raw = mesh.raw(msg); }
						if((tmp = msg['@'])
						&& (tmp = ctx.dup.s[tmp])
						&& (tmp = tmp.it)){
							if(tmp.get && tmp['##'] && tmp['##'] === msg['##']){ // PERF: move this condition outside say?
								return; // TODO: this still needs to be tested in the browser!
							}
						}
						if((tmp = msh.to) && (tmp[peer.url] || tmp[peer.id]) && !o){ return } // TODO: still needs to be tested
						if(peer.batch){
							peer.tail = (peer.tail || 0) + raw.length;
							if(peer.tail <= opt.pack){
								peer.batch.push(raw);
								return;
							}
							flush(peer);
						}
						peer.batch = [];
						setTimeout(function(){flush(peer);}, opt.gap);
						send(raw, peer);
					};
					function flush(peer){
						var tmp = peer.batch;
						if(!tmp){ return }
						peer.batch = peer.tail = null;
						if(!tmp.length){ return }
						try{send(JSON.stringify(tmp), peer);
						}catch(e){opt.log('DAM JSON stringify error', e);}
					}
					function send(raw, peer){
						var wire = peer.wire;
						try{
							if(wire.send){
								wire.send(raw);
							} else
							if(peer.say){
								peer.say(raw);
							}
						}catch(e){
							(peer.queue = peer.queue || []).push(raw);
						}
					}

				}());
	(function(){

					mesh.raw = function(msg){
						if(!msg){ return '' }
						var dup = ctx.dup, msh = msg.mesh || {}, put, hash, tmp;
						if(tmp = msh.raw){ return tmp }
						if(typeof msg === 'string'){ return msg }
						if(msg['@'] && (tmp = msg.put)){
							if(!(hash = msg['##'])){
								put = $(tmp, sort) || '';
								hash = mesh.hash(msg, put);
								msg['##'] = hash;
							}
							(tmp = dup.s)[hash = msg['@']+hash] = tmp[msg['#']];
							msg['#'] = hash || msg['#'];
							if(put){ (msg = Type.obj.to(msg)).put = _; }
						}
						var i = 0, to = []; Type.obj.map(opt.peers, function(p){
							to.push(p.url || p.id); if(++i > 9){ return true } // limit server, fast fix, improve later!
						}); msg['><'] = to.join();
						var raw = $(msg);
						if(u !== put){
							tmp = raw.indexOf(_, raw.indexOf('put'));
							raw = raw.slice(0, tmp-1) + put + raw.slice(tmp + _.length + 1);
							//raw = raw.replace('"'+ _ +'"', put); // https://github.com/amark/gun/wiki/@$$ Heisenbug
						}
						if(msh){
							msh.raw = raw;
						}
						return raw;
					};

					mesh.hash = function(msg, hash){
						return Mesh.hash(hash || $(msg.put, sort) || '') || msg['#'] || Type.text.random(9);
					};

					function sort(k, v){ var tmp;
						if(!(v instanceof Object)){ return v }
						Type.obj.map(Object.keys(v).sort(), map, {to: tmp = {}, on: v});
						return tmp;
					}

					function map(k){
						this.to[k] = this.on[k];
					}
					var $ = JSON.stringify, _ = ':])([:';

				}());

				mesh.hi = function(peer){
					var tmp = peer.wire || {};
					if(peer.id || peer.url){
						opt.peers[peer.url || peer.id] = peer;
						Type.obj.del(opt.peers, tmp.id);
					} else {
						tmp = tmp.id = tmp.id || Type.text.random(9);
						mesh.say({dam: '?'}, opt.peers[tmp] = peer);
					}
					if(!tmp.hied){ ctx.on(tmp.hied = 'hi', peer); }
					tmp = peer.queue; peer.queue = [];
					Type.obj.map(tmp, function(msg){
						mesh.say(msg, peer);
					});
				};
				mesh.bye = function(peer){
					Type.obj.del(opt.peers, peer.id); // assume if peer.url then reconnect
					ctx.on('bye', peer);
				};

				mesh.hear['!'] = function(msg, peer){ opt.log('Error:', msg.err); };
				mesh.hear['?'] = function(msg, peer){
					if(!msg.pid){ return mesh.say({dam: '?', pid: opt.pid, '@': msg['#']}, peer) }
					peer.id = peer.id || msg.pid;
					mesh.hi(peer);
				};

				return mesh;
			}

			Mesh.hash = function(s){ // via SO
				if(typeof s !== 'string'){ return {err: 1} }
		    var c = 0;
		    if(!s.length){ return c }
		    for(var i=0,l=s.length,n; i<l; ++i){
		      n = s.charCodeAt(i);
		      c = ((c<<5)-c)+n;
		      c |= 0;
		    }
		    return c; // Math.abs(c);
		  };

		  var empty = {}, u;
		  Object.keys = Object.keys || function(o){ return map(o, function(v,k,t){t(k);}) };

		  try{ module.exports = Mesh; }catch(e){}

		})(USE, './adapters/mesh');
	USE(function(module){
			var Gun = USE('../index');
			Gun.Mesh = USE('./mesh');

			Gun.on('opt', function(root){
				this.to.next(root);
				var opt = root.opt;
				if(root.once){ return }
				if(false === opt.WebSocket){ return }

				var env;
				if(typeof window !== "undefined"){ env = window; }
				if(typeof commonjsGlobal !== "undefined"){ env = commonjsGlobal; }
				env = env || {};

				var websocket = opt.WebSocket || env.WebSocket || env.webkitWebSocket || env.mozWebSocket;
				if(!websocket){ return }
				opt.WebSocket = websocket;

				var mesh = opt.mesh = opt.mesh || Gun.Mesh(root);

				var wire = opt.wire;
				opt.wire = open;
				function open(peer){ try{
					if(!peer || !peer.url){ return wire && wire(peer) }
					var url = peer.url.replace('http', 'ws');
					var wire = peer.wire = new opt.WebSocket(url);
					wire.onclose = function(){
						opt.mesh.bye(peer);
						reconnect(peer);
					};
					wire.onerror = function(error){
						reconnect(peer); // placement?
						if(!error){ return }
						if(error.code === 'ECONNREFUSED');
					};
					wire.onopen = function(){
						opt.mesh.hi(peer);
					};
					wire.onmessage = function(msg){
						if(!msg){ return }
						opt.mesh.hear(msg.data || msg, peer);
					};
					return wire;
				}catch(e){}}

				function reconnect(peer){
					clearTimeout(peer.defer);
					peer.defer = setTimeout(function(){
						open(peer);
					}, 2 * 1000);
				}
			});
		})(USE, './adapters/websocket');

	}());
	});

	var Gun$1 = (typeof window !== "undefined")? window.Gun : gun;

	Gun$1.chain.promise = function(cb) {
	  var gun$$1 = this, cb = cb || function(ctx) { return ctx };
	  return (new Promise(function(res, rej) {
	    gun$$1.once(function(data, key){
	    	res({put: data, get: key, gun: this});
	    });
	  })).then(cb);
	};

	Gun$1.chain.then = function(cb) {
		return this.promise(function(res){
			return cb? cb(res.put) : res.put;
		});
	};

	var Gun$2 = (typeof window !== "undefined")? window.Gun : gun;

	Gun$2.chain.open = function(cb, opt, at){
		opt = opt || {};
		opt.doc = opt.doc || {};
		opt.ids = opt.ids || {};
		opt.any = opt.any || cb;
		opt.ev = opt.ev || {off: function(){
			Gun$2.obj.map(opt.ev.s, function(e){
				if(e){ e.off(); }
			});
			opt.ev.s = {};
		}, s:{}};
		return this.on(function(data, key, ctx, ev){
			delete ((data = Gun$2.obj.copy(data))||{})._;
			clearTimeout(opt.to);
			opt.to = setTimeout(function(){
				if(!opt.any){ return }
				opt.any.call(opt.at.$, opt.doc, opt.key, opt, opt.ev);
				if(opt.off){
					opt.ev.off();
					opt.any = null;
				}
			}, opt.wait || 1);
			opt.at = opt.at || ctx;
			opt.key = opt.key || key;
			opt.ev.s[this._.id] = ev;
			if(Gun$2.val.is(data)){
				if(!at){
					opt.doc = data;
				} else {
					at[key] = data;
				}
				return;
			}
			var tmp = this, id;
			Gun$2.obj.map(data, function(val, key){
				if(!(id = Gun$2.val.link.is(val))){
					(at || opt.doc)[key] = val;
					return;
				}
				if(opt.ids[id]){
					(at || opt.doc)[key] = opt.ids[id];
					return;
				}
				tmp.get(key).open(opt.any, opt, opt.ids[id] = (at || opt.doc)[key] = {});
			});
		})
	};

	var open = {

	};

	var Gun$3 = (typeof window !== "undefined")? window.Gun : gun;
	Gun$3.chain.open || open;

	Gun$3.chain.load = function(cb, opt, at){
		(opt = opt || {}).off = !0;
		return this.open(cb, opt, at);
	};

	var GUN_TIMEOUT = 100;

	// temp method for GUN search
	async function searchText(node, query, limit, cursor) {
	  return new _Promise(function (resolve) {
	    var r = [];
	    function sortAndResolve() {
	      r.sort(function (a, b) {
	        if (a.key < b.key) {
	          return -1;
	        }
	        if (a.key > b.key) {
	          return 1;
	        }
	        return 0;
	      });
	      resolve(r);
	    }
	    node.map(function (value, key) {
	      if ((!cursor || key > cursor) && key.indexOf(query) === 0) {
	        if (value) {
	          r.push({ value: value, key: key });
	        }
	        if (r.length >= limit) {
	          sortAndResolve();
	        }
	      }
	    });
	    setTimeout(function () {
	      /* console.log(`r`, r);*/sortAndResolve();
	    }, 100);
	  });
	}

	// TODO: flush onto IPFS
	/**
	* Identifi index root. Contains four indexes: identitiesBySearchKey, identitiesByTrustDistance,
	* messagesByTimestamp, messagesByDistance.
	*/

	var Index = function () {
	  /**
	  * When you use someone else's index, initialise it with this constructor
	  */
	  function Index(gun, options) {
	    _classCallCheck(this, Index);

	    this.gun = gun || new gun_min();
	    this.options = _Object$assign({
	      importFromTrustedIndexes: true,
	      subscribeToTrustedIndexes: true,
	      queryTrustedIndexes: true
	    }, options);
	  }

	  /**
	  * Use this to load an index that you can write to
	  * @returns {Index}
	  */


	  Index.create = async function create(gun, keypair) {
	    if (!keypair) {
	      keypair = await Key.getDefault();
	    }
	    var user = gun.user();
	    user.auth(keypair);
	    var i = new Index(user.get('identifi'));
	    i.viewpoint = new Attribute({ name: 'keyID', val: Key.getId(keypair) });
	    i.gun.get('viewpoint').put(i.viewpoint);
	    var uri = i.viewpoint.uri();
	    var g = i.gun.get('identitiesBySearchKey').get(uri);
	    var kpId = new Identity(g, {
	      trustDistance: 0,
	      linkTo: i.viewpoint
	    }, true);
	    i._addIdentityToIndexes(kpId.gun);
	    return i;
	  };

	  Index.getMsgIndexKey = function getMsgIndexKey(msg) {
	    var distance = parseInt(msg.distance);
	    distance = _Number$isNaN(distance) ? 99 : distance;
	    distance = ('00' + distance).substring(distance.toString().length); // pad with zeros
	    var key = distance + ':' + Math.floor(Date.parse(msg.timestamp || msg.signedData.timestamp) / 1000) + ':' + (msg.ipfs_hash || msg.hash).substr(0, 9);
	    return key;
	  };

	  Index.getIdentityIndexKeys = async function getIdentityIndexKeys(identity, hash) {
	    var indexKeys = [];
	    var d = await util$1.timeoutPromise(identity.get('trustDistance').then(), GUN_TIMEOUT);
	    await identity.get('attrs').map().once(function (a) {
	      if (!a) {
	        // TODO: this sometimes returns undefined
	        return;
	      }
	      var distance = d !== undefined ? d : parseInt(a.dist);
	      distance = _Number$isNaN(distance) ? 99 : distance;
	      distance = ('00' + distance).substring(distance.toString().length); // pad with zeros
	      var v = a.val || a[1];
	      var n = a.name || a[0];
	      var value = encodeURIComponent(v);
	      var lowerCaseValue = encodeURIComponent(v.toLowerCase());
	      var name = encodeURIComponent(n);
	      var key = distance + ':' + value + ':' + name;
	      var lowerCaseKey = distance + ':' + lowerCaseValue + ':' + name;
	      if (!Attribute.isUniqueType(n)) {
	        // allow for multiple index keys with same non-unique attribute
	        key = key + ':' + hash.substr(0, 9);
	        lowerCaseKey = lowerCaseKey + ':' + hash.substr(0, 9);
	      }
	      indexKeys.push(key);
	      if (key !== lowerCaseKey) {
	        indexKeys.push(lowerCaseKey);
	      }
	      if (v.indexOf(' ') > -1) {
	        var words = v.toLowerCase().split(' ');
	        for (var l = 0; l < words.length; l += 1) {
	          var k = distance + ':' + encodeURIComponent(words[l]) + ':' + name;
	          if (!Attribute.isUniqueType(n)) {
	            k = k + ':' + hash.substr(0, 9);
	          }
	          indexKeys.push(k);
	        }
	      }
	      if (key.match(/^http(s)?:\/\/.+\/[a-zA-Z0-9_]+$/)) {
	        var split = key.split('/');
	        indexKeys.push(split[split.length - 1]);
	      }
	    }).then();
	    return indexKeys;
	  };

	  /**
	  * @returns {Identity} viewpoint identity of the index
	  */


	  Index.prototype.getViewpoint = async function getViewpoint() {
	    var vpAttr = void 0;
	    if (this.viewpoint) {
	      vpAttr = this.viewpoint;
	    } else {
	      vpAttr = new Attribute((await this.gun.get('viewpoint').then()));
	    }
	    return new Identity(this.gun.get('identitiesBySearchKey').get(vpAttr.uri()));
	  };

	  /**
	  * Get an identity referenced by an identifier.
	  * @param value identifier value to search by
	  * @param type (optional) identifier type to search by. If omitted, tries to guess it
	  * @returns {Identity} identity that is connected to the identifier param
	  */


	  Index.prototype.get = function get(value, type) {
	    if (typeof value === 'undefined') {
	      throw 'Value is undefined';
	    }
	    if (typeof type === 'undefined') {
	      type = Attribute.guessTypeOf(value);
	    }
	    var a = new Attribute([type, value]);
	    return new Identity(this.gun.get('identitiesBySearchKey').get(a.uri()), { linkTo: a });
	  };

	  Index.prototype._getMsgs = async function _getMsgs(msgIndex, limit, cursor) {
	    var rawMsgs = await searchText(msgIndex, '', limit, cursor, true);
	    var msgs = [];
	    for (var i = 0; i < rawMsgs.length; i++) {
	      var msg = await Message.fromSig(rawMsgs[i].value);
	      if (rawMsgs[i].value && rawMsgs[i].value.ipfsUri) {
	        msg.ipfsUri = rawMsgs[i].value.ipfsUri;
	      }
	      msgs.push(msg);
	    }
	    return msgs;
	  };

	  Index.prototype._addIdentityToIndexes = async function _addIdentityToIndexes(id) {
	    var hash = gun_min.node.soul(id) || 'todo';
	    var indexKeys = await Index.getIdentityIndexKeys(id, hash.substr(0, 6));
	    for (var i = 0; i < indexKeys.length; i++) {
	      var key = indexKeys[i];
	      console.log('adding key ' + key);
	      this.gun.get('identitiesByTrustDistance').get(key).put(id);
	      this.gun.get('identitiesBySearchKey').get(key.substr(key.indexOf(':') + 1)).put(id);
	    }
	  };

	  /**
	  * @returns {Array} list of messages sent by param identity
	  */


	  Index.prototype.getSentMsgs = async function getSentMsgs(identity, limit) {
	    var cursor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	    return this._getMsgs(identity.gun.get('sent'), limit, cursor);
	  };

	  /**
	  * @returns {Array} list of messages received by param identity
	  */


	  Index.prototype.getReceivedMsgs = async function getReceivedMsgs(identity, limit) {
	    var cursor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	    return this._getMsgs(identity.gun.get('received'), limit, cursor);
	  };

	  Index.prototype._getAttributeTrustDistance = async function _getAttributeTrustDistance(a) {
	    if (!Attribute.isUniqueType(a.name)) {
	      return;
	    }
	    if (this.viewpoint.equals(a)) {
	      return 0;
	    }
	    var id = this.get(a.val, a.name);
	    var d = await id.gun.get('trustDistance').then();
	    if (isNaN(d)) {
	      d = Infinity;
	    }
	    return d;
	  };

	  /**
	  * @param {Message} msg
	  * @returns {number} trust distance to msg author. Returns undefined if msg signer is not trusted.
	  */


	  Index.prototype.getMsgTrustDistance = async function getMsgTrustDistance(msg) {
	    var shortestDistance = Infinity;
	    var signerAttr = new Attribute(['keyID', msg.getSignerKeyID()]);
	    if (!signerAttr.equals(this.viewpoint)) {
	      var signer = this.get(signerAttr.val, signerAttr.name);
	      var d = await signer.gun.get('trustDistance').then();
	      if (isNaN(d)) {
	        return;
	      }
	    }
	    for (var i = 0; i < msg.signedData.author.length; i++) {
	      var _d = await this._getAttributeTrustDistance(new Attribute(msg.signedData.author[i]));
	      if (_d < shortestDistance) {
	        shortestDistance = _d;
	      }
	    }
	    return shortestDistance < Infinity ? shortestDistance : undefined;
	  };

	  Index.prototype._updateMsgRecipientIdentity = async function _updateMsgRecipientIdentity(msg, msgIndexKey, recipient) {
	    var hash = 'todo';
	    var identityIndexKeysBefore = await Index.getIdentityIndexKeys(recipient, hash.substr(0, 6));
	    var attrs = await new _Promise(function (resolve) {
	      recipient.get('attrs').load(function (r) {
	        return resolve(r);
	      });
	    });
	    if (msg.signedData.type === 'verification') {
	      msg.signedData.recipient.forEach(function (a1) {
	        var hasAttr = false;
	        _Object$keys(attrs).forEach(function (k) {
	          // TODO: if author is self, mark as self verified
	          if (Attribute.equals(a1, attrs[k])) {
	            attrs[k].conf = (attrs[k].conf || 0) + 1;
	            hasAttr = true;
	          }
	        });
	        if (!hasAttr) {
	          attrs[encodeURIComponent(a1[1]) + ':' + encodeURIComponent(a1[0])] = { name: a1[0], val: a1[1], conf: 1, ref: 0 };
	        }
	        if (msg.goodVerification) {
	          attrs[encodeURIComponent(a1[1]) + ':' + encodeURIComponent(a1[0])].verified = true;
	        }
	      });
	      recipient.get('mostVerifiedAttributes').put(Identity.getMostVerifiedAttributes(attrs));
	      recipient.get('attrs').put(attrs);
	    }
	    if (msg.signedData.type === 'rating') {
	      var id = await recipient.then();
	      id.receivedPositive = id.receivedPositive || 0;
	      id.receivedNegative = id.receivedNegative || 0;
	      id.receivedNeutral = id.receivedNeutral || 0;
	      if (msg.isPositive()) {
	        if (msg.distance + 1 < id.trustDistance) {
	          recipient.get('trustDistance').put(msg.distance + 1);
	        }
	        id.receivedPositive++;
	      } else if (msg.isNegative()) {
	        id.receivedNegative++;
	      } else {
	        id.receivedNeutral++;
	      }
	      recipient.get('receivedPositive').put(id.receivedPositive);
	      recipient.get('receivedNegative').put(id.receivedNegative);
	      recipient.get('receivedNeutral').put(id.receivedNeutral);
	      if (msg.signedData.context === 'verifier') {
	        if (msg.distance === 0) {
	          if (msg.isPositive) {
	            recipient.get('scores').get(msg.signedData.context).get('score').put(10);
	          } else if (msg.isNegative()) {
	            recipient.get('scores').get(msg.signedData.context).get('score').put(0);
	          } else {
	            recipient.get('scores').get(msg.signedData.context).get('score').put(-10);
	          }
	        }
	      }
	    }
	    var obj = { sig: msg.sig, pubKey: msg.pubKey };
	    if (msg.ipfsUri) {
	      obj.ipfsUri = msg.ipfsUri;
	    }
	    recipient.get('received').get(msgIndexKey).put(obj);
	    var identityIndexKeysAfter = await Index.getIdentityIndexKeys(recipient, hash.substr(0, 6));
	    for (var j = 0; j < identityIndexKeysBefore.length; j++) {
	      var k = identityIndexKeysBefore[j];
	      if (identityIndexKeysAfter.indexOf(k) === -1) {
	        this.gun.get('identitiesByTrustDistance').get(k).put(null);
	        this.gun.get('identitiesBySearchKey').get(k.substr(k.indexOf(':') + 1)).put(null);
	      }
	    }
	  };

	  Index.prototype._updateMsgAuthorIdentity = async function _updateMsgAuthorIdentity(msg, msgIndexKey, author) {
	    if (msg.signedData.type === 'rating') {
	      var id = await author.then();
	      id.sentPositive = id.sentPositive || 0;
	      id.sentNegative = id.sentNegative || 0;
	      id.sentNeutral = id.sentNeutral || 0;
	      if (msg.isPositive()) {
	        id.sentPositive++;
	      } else if (msg.isNegative()) {
	        id.sentNegative++;
	      } else {
	        id.sentNeutral++;
	      }
	      author.get('sentPositive').put(id.sentPositive);
	      author.get('sentNegative').put(id.sentNegative);
	      author.get('sentNeutral').put(id.sentNeutral);
	    }
	    var obj = { sig: msg.sig, pubKey: msg.pubKey };
	    if (msg.ipfsUri) {
	      obj.ipfsUri = msg.ipfsUri;
	    }
	    return author.get('sent').get(msgIndexKey).put(obj).then();
	  };

	  Index.prototype._updateIdentityProfilesByMsg = async function _updateIdentityProfilesByMsg(msg, authorIdentities, recipientIdentities) {
	    var msgIndexKey = Index.getMsgIndexKey(msg);
	    msgIndexKey = msgIndexKey.substr(msgIndexKey.indexOf(':') + 1);
	    var ids = _Object$values(_Object$assign({}, authorIdentities, recipientIdentities));
	    for (var i = 0; i < ids.length; i++) {
	      // add new identifiers to identity
	      var relocated = this.gun.get('identities').set((await ids[i].gun.then())); // this may screw up real time updates? and create unnecessary `identities` entries
	      if (recipientIdentities.hasOwnProperty(ids[i].gun['_'].link)) {
	        await this._updateMsgRecipientIdentity(msg, msgIndexKey, ids[i].gun);
	      }
	      if (authorIdentities.hasOwnProperty(ids[i].gun['_'].link)) {
	        await this._updateMsgAuthorIdentity(msg, msgIndexKey, ids[i].gun);
	      }
	      await this._addIdentityToIndexes(relocated);
	    }
	  };

	  Index.prototype.addTrustedIndex = async function addTrustedIndex(gunUri) {
	    var _this = this;

	    var maxMsgsToCrawl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;
	    var maxCrawlDistance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;

	    if (gunUri === this.viewpoint.val) {
	      return;
	    }
	    console.log('addTrustedIndex', gunUri);
	    this.gun.get('trustedIndexes').get(gunUri).put(true);
	    var msgs = [];
	    if (this.options.importFromTrustedIndexes) {
	      await util$1.timeoutPromise(new _Promise(function (resolve) {
	        _this.gun.user(gunUri).get('identifi').get('messagesByDistance').map(function (val, key) {
	          var d = _Number$parseInt(key.split(':')[0]);
	          if (!isNaN(d) && d <= maxCrawlDistance) {
	            Message.fromSig(val).then(function (msg) {
	              msgs.push(msg);
	              if (msgs.length >= maxMsgsToCrawl) {
	                resolve();
	              }
	            });
	          }
	        });
	      }), 10000);
	      console.log('adding', msgs.length, 'msgs');
	      this.addMessages(msgs);
	    }
	  };

	  Index.prototype._updateIdentityIndexesByMsg = async function _updateIdentityIndexesByMsg(msg) {
	    var recipientIdentities = {};
	    var authorIdentities = {};
	    var selfAuthored = false;
	    for (var i = 0; i < msg.signedData.author.length; i++) {
	      var a = msg.signedData.author[i];
	      var id = this.get(a[1], a[0]);
	      var td = await util$1.timeoutPromise(id.gun.get('trustDistance').then(), GUN_TIMEOUT);
	      if (!isNaN(td)) {
	        authorIdentities[id.gun['_'].link] = id;
	        var scores = await id.gun.get('scores').then();
	        if (scores && scores.verifier && msg.signedData.type === 'verification') {
	          msg.goodVerification = true;
	        }
	        if (td === 0) {
	          selfAuthored = true;
	        }
	      }
	    }
	    if (!_Object$keys(authorIdentities).length) {
	      return; // unknown author, do nothing
	    }
	    for (var _i = 0; _i < msg.signedData.recipient.length; _i++) {
	      var _a = msg.signedData.recipient[_i];
	      var _id = this.get(_a[1], _a[0]);
	      var _td = await util$1.timeoutPromise(_id.gun.get('trustDistance').then(), GUN_TIMEOUT);

	      if (!isNaN(_td)) {
	        recipientIdentities[_id.gun['_'].link] = _id;
	      }
	      if (selfAuthored && _a[0] === 'keyID' && _a[1] !== this.viewpoint.val && msg.isPositive()) {
	        // TODO: not if already added - causes infinite loop
	        this.addTrustedIndex(_a[1]);
	      }
	    }
	    if (!_Object$keys(recipientIdentities).length) {
	      // recipient is previously unknown
	      var attrs = {};
	      msg.signedData.recipient.forEach(function (a) {
	        var attr = new Attribute([a[0], a[1]]);
	        attrs[attr.uri()] = attr;
	      });
	      var linkTo = Identity.getLinkTo(attrs);
	      var random = Math.floor(Math.random() * _Number$MAX_SAFE_INTEGER); // TODO: bubblegum fix
	      var _id2 = new Identity(this.gun.get('identities').get(random).put({}), { attrs: attrs, linkTo: linkTo, trustDistance: 99 }, true);
	      // {a:1} because inserting {} causes a "no signature on data" error from gun

	      // TODO: take msg author trust into account
	      recipientIdentities[_id2.gun['_'].link] = _id2;
	    }

	    return this._updateIdentityProfilesByMsg(msg, authorIdentities, recipientIdentities);
	  };

	  /**
	  * Add a list of messages to the index.
	  * Useful for example when adding a new WoT dataset that contains previously
	  * unknown authors.
	  *
	  * Iteratively performs sorted merge joins on [previously known identities] and
	  * [new msgs authors], until all messages from within the WoT have been added.
	  *
	  * @param {Array} msgs an array of messages.
	  * @param {Object} ipfs (optional) ipfs instance where the messages are saved
	  * @returns {boolean} true on success
	  */


	  Index.prototype.addMessages = async function addMessages(msgs, ipfs) {
	    var msgsByAuthor = {};
	    if (Array.isArray(msgs)) {
	      console.log('sorting ' + msgs.length + ' messages onto a search tree...');
	      for (var i = 0; i < msgs.length; i++) {
	        for (var j = 0; j < msgs[i].signedData.author.length; j++) {
	          var id = msgs[i].signedData.author[j];
	          if (Attribute.isUniqueType(id[0])) {
	            var key = encodeURIComponent(id[1]) + ':' + encodeURIComponent(id[0]) + ':' + msgs[i].getHash();
	            msgsByAuthor[key] = msgs[i];
	          }
	        }
	      }
	      console.log('...done');
	    } else {
	      throw 'msgs param must be an array';
	    }
	    var msgAuthors = _Object$keys(msgsByAuthor).sort();
	    if (!msgAuthors.length) {
	      return;
	    }
	    var initialMsgCount = void 0,
	        msgCountAfterwards = void 0;
	    var index = this.gun.get('identitiesBySearchKey');
	    do {
	      var knownIdentities = await searchText(index, '');
	      var _i2 = 0;
	      var author = msgAuthors[_i2];
	      var knownIdentity = knownIdentities.shift();
	      initialMsgCount = msgAuthors.length;
	      // sort-merge join identitiesBySearchKey and msgsByAuthor
	      while (author && knownIdentity) {
	        if (author.indexOf(knownIdentity.key) === 0) {
	          try {
	            await util$1.timeoutPromise(this.addMessage(msgsByAuthor[author], ipfs), 10000);
	          } catch (e) {
	            console.log('adding failed:', e, _JSON$stringify(msgsByAuthor[author], null, 2));
	          }
	          msgAuthors.splice(_i2, 1);
	          author = _i2 < msgAuthors.length ? msgAuthors[_i2] : undefined;
	          //knownIdentity = knownIdentities.shift();
	        } else if (author < knownIdentity.key) {
	          author = _i2 < msgAuthors.length ? msgAuthors[++_i2] : undefined;
	        } else {
	          knownIdentity = knownIdentities.shift();
	        }
	      }
	      msgCountAfterwards = msgAuthors.length;
	    } while (msgCountAfterwards !== initialMsgCount);
	    return true;
	  };

	  /**
	  * @param msg Message to add to the index
	  * @param ipfs (optional) ipfs instance where the message is additionally saved
	  */


	  Index.prototype.addMessage = async function addMessage(msg, ipfs) {
	    if (msg.constructor.name !== 'Message') {
	      throw new Error('addMessage failed: param must be a Message, received ' + msg.constructor.name);
	    }
	    msg.distance = await this.getMsgTrustDistance(msg);
	    if (msg.distance === undefined) {
	      return false; // do not save messages from untrusted author
	    }
	    var indexKey = Index.getMsgIndexKey(msg);
	    var obj = { sig: msg.sig, pubKey: msg.pubKey };
	    if (ipfs) {
	      var ipfsUri = await msg.saveToIpfs(ipfs);
	      obj.ipfsUri = ipfsUri;
	    }
	    this.gun.get('messagesByDistance').get(indexKey).put(obj);
	    indexKey = indexKey.substr(indexKey.indexOf(':') + 1); // remove distance from key
	    this.gun.get('messagesByTimestamp').get(indexKey).put(obj);
	    await this._updateIdentityIndexesByMsg(msg);
	    return true;
	  };

	  /**
	  * @param {string} value search string
	  * @param {string} type (optional) type of searched value
	  * @returns {Array} list of matching identities
	  */


	  Index.prototype.search = async function search(value) {
	    var _this2 = this;

	    // TODO: param 'exact', type param
	    var r = {};
	    return new _Promise(function (resolve) {
	      _this2.gun.get('identitiesByTrustDistance').map(function (id, key) {
	        if (key.indexOf(encodeURIComponent(value)) === -1) {
	          return;
	        }
	        var soul = gun_min.node.soul(id);
	        if (soul && !r.hasOwnProperty(soul)) {
	          r[soul] = new Identity(_this2.gun.get('identitiesByTrustDistance').get(key));
	        }
	      });
	      if (_this2.options.queryTrustedIndexes) {
	        _this2.gun.get('trustedIndexes').map(function (val, key) {
	          if (val) {
	            _this2.gun.user(key).get('identifi').get('identitiesByTrustDistance').map(function (id, k) {
	              // TODO: where should this actually be searched from?
	              if (k.indexOf(encodeURIComponent(value)) === -1) {
	                return;
	              }
	              console.log('found search result from trusted index', key, ':', k);
	              var soul = gun_min.node.soul(id);
	              if (soul && !r.hasOwnProperty(soul)) {
	                r[soul] = new Identity(_this2.gun.get('identitiesByTrustDistance').get(k));
	              }
	            });
	          }
	        });
	      }
	      setTimeout(function () {
	        resolve(_Object$values(r));
	      }, 200);
	    });
	  };

	  /**
	  * @returns {Array} list of messages
	  */


	  Index.prototype.getMessagesByTimestamp = async function getMessagesByTimestamp(limit) {
	    var cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	    return this._getMsgs(this.gun.get('messagesByTimestamp'), limit, cursor);
	  };

	  /**
	  * @returns {Array} list of messages
	  */


	  Index.prototype.getMessagesByDistance = async function getMessagesByDistance(limit) {
	    var cursor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	    return this._getMsgs(this.gun.get('messagesByDistance'), limit, cursor);
	  };

	  return Index;
	}();

	var version$1 = "0.0.63";

	/*eslint no-useless-escape: "off", camelcase: "off" */

	var index = {
	  VERSION: version$1,
	  Message: Message,
	  Identity: Identity,
	  Attribute: Attribute,
	  Index: Index,
	  Key: Key,
	  util: util$1
	};

	return index;

})));
