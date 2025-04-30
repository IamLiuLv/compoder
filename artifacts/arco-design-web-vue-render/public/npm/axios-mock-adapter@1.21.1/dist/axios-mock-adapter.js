/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["AxiosMockAdapter"] = factory();
	else
		root["AxiosMockAdapter"] = factory();
})(self, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/fast-deep-equal/index.js":
/*!***********************************************!*\
  !*** ./node_modules/fast-deep-equal/index.js ***!
  \***********************************************/
/***/ ((module) => {

"use strict";
eval("\n\n// do not edit .js files directly - edit src/index.jst\n\n\n\nmodule.exports = function equal(a, b) {\n  if (a === b) return true;\n\n  if (a && b && typeof a == 'object' && typeof b == 'object') {\n    if (a.constructor !== b.constructor) return false;\n\n    var length, i, keys;\n    if (Array.isArray(a)) {\n      length = a.length;\n      if (length != b.length) return false;\n      for (i = length; i-- !== 0;)\n        if (!equal(a[i], b[i])) return false;\n      return true;\n    }\n\n\n\n    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;\n    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();\n    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();\n\n    keys = Object.keys(a);\n    length = keys.length;\n    if (length !== Object.keys(b).length) return false;\n\n    for (i = length; i-- !== 0;)\n      if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;\n\n    for (i = length; i-- !== 0;) {\n      var key = keys[i];\n\n      if (!equal(a[key], b[key])) return false;\n    }\n\n    return true;\n  }\n\n  // true if both NaN, false otherwise\n  return a!==a && b!==b;\n};\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./node_modules/fast-deep-equal/index.js?");

/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("/*!\n * Determine if an object is a Buffer\n *\n * @author   Feross Aboukhadijeh <https://feross.org>\n * @license  MIT\n */\n\nmodule.exports = function isBuffer (obj) {\n  return obj != null && obj.constructor != null &&\n    typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)\n}\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./node_modules/is-buffer/index.js?");

/***/ }),

/***/ "./src/handle_request.js":
/*!*******************************!*\
  !*** ./src/handle_request.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nfunction transformRequest(data) {\n  if (\n    utils.isArrayBuffer(data) ||\n    utils.isBuffer(data) ||\n    utils.isStream(data) ||\n    utils.isBlob(data)\n  ) {\n    return data;\n  }\n\n  // Object and Array: returns a deep copy\n  if (utils.isObjectOrArray(data)) {\n    return JSON.parse(JSON.stringify(data));\n  }\n\n  // for primitives like string, undefined, null, number\n  return data;\n}\n\nfunction makeResponse(result, config) {\n  return {\n    status: result[0],\n    data: transformRequest(result[1]),\n    headers: result[2],\n    config: config,\n    request: {\n      responseURL: config.url,\n    },\n  };\n}\n\nfunction handleRequest(mockAdapter, resolve, reject, config) {\n  var url = config.url || \"\";\n  // TODO we're not hitting this `if` in any of the tests, investigate\n  if (\n    config.baseURL &&\n    url.substr(0, config.baseURL.length) === config.baseURL\n  ) {\n    url = url.slice(config.baseURL.length);\n  }\n\n  delete config.adapter;\n  mockAdapter.history[config.method].push(config);\n\n  var handler = utils.findHandler(\n    mockAdapter.handlers,\n    config.method,\n    url,\n    config.data,\n    config.params,\n    config.headers,\n    config.baseURL\n  );\n\n  if (handler) {\n    if (handler.length === 7) {\n      utils.purgeIfReplyOnce(mockAdapter, handler);\n    }\n\n    if (handler.length === 2) {\n      // passThrough handler\n      mockAdapter.originalAdapter(config).then(resolve, reject);\n    } else if (typeof handler[3] !== \"function\") {\n      utils.settle(\n        resolve,\n        reject,\n        makeResponse(handler.slice(3), config),\n        mockAdapter.delayResponse\n      );\n    } else {\n      var result = handler[3](config);\n      // TODO throw a sane exception when return value is incorrect\n      if (typeof result.then !== \"function\") {\n        utils.settle(\n          resolve,\n          reject,\n          makeResponse(result, config),\n          mockAdapter.delayResponse\n        );\n      } else {\n        result.then(\n          function (result) {\n            if (result.config && result.status) {\n              utils.settle(\n                resolve,\n                reject,\n                makeResponse(\n                  [result.status, result.data, result.headers],\n                  result.config\n                ),\n                0\n              );\n            } else {\n              utils.settle(\n                resolve,\n                reject,\n                makeResponse(result, config),\n                mockAdapter.delayResponse\n              );\n            }\n          },\n          function (error) {\n            if (mockAdapter.delayResponse > 0) {\n              setTimeout(function () {\n                reject(error);\n              }, mockAdapter.delayResponse);\n            } else {\n              reject(error);\n            }\n          }\n        );\n      }\n    }\n  } else {\n    // handler not found\n    switch (mockAdapter.onNoMatch) {\n      case \"passthrough\":\n        mockAdapter.originalAdapter(config).then(resolve, reject);\n        break;\n      case \"throwException\":\n        throw utils.createCouldNotFindMockError(config);\n      default:\n        utils.settle(\n          resolve,\n          reject,\n          {\n            status: 404,\n            config: config,\n          },\n          mockAdapter.delayResponse\n        );\n    }\n  }\n}\n\nmodule.exports = handleRequest;\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./src/handle_request.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar handleRequest = __webpack_require__(/*! ./handle_request */ \"./src/handle_request.js\");\nvar utils = __webpack_require__(/*! ./utils */ \"./src/utils.js\");\n\nvar VERBS = [\n  \"get\",\n  \"post\",\n  \"head\",\n  \"delete\",\n  \"patch\",\n  \"put\",\n  \"options\",\n  \"list\",\n  \"link\",\n  \"unlink\",\n];\n\nfunction adapter() {\n  return function (config) {\n    var mockAdapter = this;\n    return new Promise(function (resolve, reject) {\n      handleRequest(mockAdapter, resolve, reject, config);\n    });\n  }.bind(this);\n}\n\nfunction getVerbObject() {\n  return VERBS.reduce(function (accumulator, verb) {\n    accumulator[verb] = [];\n    return accumulator;\n  }, {});\n}\n\nfunction reset() {\n  resetHandlers.call(this);\n  resetHistory.call(this);\n}\n\nfunction resetHandlers() {\n  this.handlers = getVerbObject();\n}\n\nfunction resetHistory() {\n  this.history = getVerbObject();\n}\n\nfunction MockAdapter(axiosInstance, options) {\n  reset.call(this);\n\n  if (axiosInstance) {\n    this.axiosInstance = axiosInstance;\n    this.originalAdapter = axiosInstance.defaults.adapter;\n    this.delayResponse =\n      options && options.delayResponse > 0 ? options.delayResponse : null;\n    this.onNoMatch = (options && options.onNoMatch) || null;\n    axiosInstance.defaults.adapter = this.adapter.call(this);\n  } else {\n    throw new Error(\"Please provide an instance of axios to mock\");\n  }\n}\n\nMockAdapter.prototype.adapter = adapter;\n\nMockAdapter.prototype.restore = function restore() {\n  if (this.axiosInstance) {\n    this.axiosInstance.defaults.adapter = this.originalAdapter;\n    this.axiosInstance = undefined;\n  }\n};\n\nMockAdapter.prototype.reset = reset;\nMockAdapter.prototype.resetHandlers = resetHandlers;\nMockAdapter.prototype.resetHistory = resetHistory;\n\nVERBS.concat(\"any\").forEach(function (method) {\n  var methodName = \"on\" + method.charAt(0).toUpperCase() + method.slice(1);\n  MockAdapter.prototype[methodName] = function (matcher, body, requestHeaders) {\n    var _this = this;\n    var matcher = matcher === undefined ? /.*/ : matcher;\n\n    function reply(code, response, headers) {\n      var handler = [matcher, body, requestHeaders, code, response, headers];\n      addHandler(method, _this.handlers, handler);\n      return _this;\n    }\n\n    function replyOnce(code, response, headers) {\n      var handler = [\n        matcher,\n        body,\n        requestHeaders,\n        code,\n        response,\n        headers,\n        true,\n      ];\n      addHandler(method, _this.handlers, handler);\n      return _this;\n    }\n\n    return {\n      reply: reply,\n\n      replyOnce: replyOnce,\n\n      passThrough: function passThrough() {\n        var handler = [matcher, body];\n        addHandler(method, _this.handlers, handler);\n        return _this;\n      },\n\n      abortRequest: function () {\n        return reply(function (config) {\n          var error = utils.createAxiosError(\n            \"Request aborted\",\n            config,\n            undefined,\n            \"ECONNABORTED\"\n          );\n          return Promise.reject(error);\n        });\n      },\n\n      abortRequestOnce: function () {\n        return replyOnce(function (config) {\n          var error = utils.createAxiosError(\n            \"Request aborted\",\n            config,\n            undefined,\n            \"ECONNABORTED\"\n          );\n          return Promise.reject(error);\n        });\n      },\n\n      networkError: function () {\n        return reply(function (config) {\n          var error = utils.createAxiosError(\"Network Error\", config);\n          return Promise.reject(error);\n        });\n      },\n\n      networkErrorOnce: function () {\n        return replyOnce(function (config) {\n          var error = utils.createAxiosError(\"Network Error\", config);\n          return Promise.reject(error);\n        });\n      },\n\n      timeout: function () {\n        return reply(function (config) {\n          var error = utils.createAxiosError(\n            config.timeoutErrorMessage ||\n              \"timeout of \" + config.timeout + \"ms exceeded\",\n            config,\n            undefined,\n            \"ECONNABORTED\"\n          );\n          return Promise.reject(error);\n        });\n      },\n\n      timeoutOnce: function () {\n        return replyOnce(function (config) {\n          var error = utils.createAxiosError(\n            config.timeoutErrorMessage ||\n              \"timeout of \" + config.timeout + \"ms exceeded\",\n            config,\n            undefined,\n            \"ECONNABORTED\"\n          );\n          return Promise.reject(error);\n        });\n      },\n    };\n  };\n});\n\nfunction findInHandlers(method, handlers, handler) {\n  var index = -1;\n  for (var i = 0; i < handlers[method].length; i += 1) {\n    var item = handlers[method][i];\n    var isReplyOnce = item.length === 7;\n    var comparePaths =\n      item[0] instanceof RegExp && handler[0] instanceof RegExp\n        ? String(item[0]) === String(handler[0])\n        : item[0] === handler[0];\n    var isSame =\n      comparePaths &&\n      utils.isEqual(item[1], handler[1]) &&\n      utils.isEqual(item[2], handler[2]);\n    if (isSame && !isReplyOnce) {\n      index = i;\n    }\n  }\n  return index;\n}\n\nfunction addHandler(method, handlers, handler) {\n  if (method === \"any\") {\n    VERBS.forEach(function (verb) {\n      handlers[verb].push(handler);\n    });\n  } else {\n    var indexOfExistingHandler = findInHandlers(method, handlers, handler);\n    if (indexOfExistingHandler > -1 && handler.length < 7) {\n      handlers[method].splice(indexOfExistingHandler, 1, handler);\n    } else {\n      handlers[method].push(handler);\n    }\n  }\n}\n\nmodule.exports = MockAdapter;\nmodule.exports[\"default\"] = MockAdapter;\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./src/index.js?");

/***/ }),

/***/ "./src/is_blob.js":
/*!************************!*\
  !*** ./src/is_blob.js ***!
  \************************/
/***/ ((module) => {

eval("/*!\n * MIT License\n *\n * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated\n * documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the\n * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit\n * persons to whom the Software is furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the\n * Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE\n * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\n * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n */\n\nfunction isBlob(value) {\n  if (typeof Blob === 'undefined') {\n    return false;\n  }\n\n  return value instanceof Blob || Object.prototype.toString.call(value) === '[object Blob]';\n}\n\nmodule.exports = isBlob;\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./src/is_blob.js?");

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
eval("\n\nvar isEqual = __webpack_require__(/*! fast-deep-equal */ \"./node_modules/fast-deep-equal/index.js\");\nvar isBuffer = __webpack_require__(/*! is-buffer */ \"./node_modules/is-buffer/index.js\");\nvar isBlob = __webpack_require__(/*! ./is_blob */ \"./src/is_blob.js\");\nvar toString = Object.prototype.toString;\n\nfunction find(array, predicate) {\n  var length = array.length;\n  for (var i = 0; i < length; i++) {\n    var value = array[i];\n    if (predicate(value)) return value;\n  }\n}\n\nfunction isFunction(val) {\n  return toString.call(val) === \"[object Function]\";\n}\n\nfunction isObjectOrArray(val) {\n  return val !== null && typeof val === \"object\";\n}\n\nfunction isStream(val) {\n  return isObjectOrArray(val) && isFunction(val.pipe);\n}\n\nfunction isArrayBuffer(val) {\n  return toString.call(val) === \"[object ArrayBuffer]\";\n}\n\nfunction combineUrls(baseURL, url) {\n  if (baseURL) {\n    return baseURL.replace(/\\/+$/, \"\") + \"/\" + url.replace(/^\\/+/, \"\");\n  }\n\n  return url;\n}\n\nfunction findHandler(\n  handlers,\n  method,\n  url,\n  body,\n  parameters,\n  headers,\n  baseURL\n) {\n  return find(handlers[method.toLowerCase()], function (handler) {\n    if (typeof handler[0] === \"string\") {\n      return (\n        (isUrlMatching(url, handler[0]) ||\n          isUrlMatching(combineUrls(baseURL, url), handler[0])) &&\n        isBodyOrParametersMatching(method, body, parameters, handler[1]) &&\n        isObjectMatching(headers, handler[2])\n      );\n    } else if (handler[0] instanceof RegExp) {\n      return (\n        (handler[0].test(url) || handler[0].test(combineUrls(baseURL, url))) &&\n        isBodyOrParametersMatching(method, body, parameters, handler[1]) &&\n        isObjectMatching(headers, handler[2])\n      );\n    }\n  });\n}\n\nfunction isUrlMatching(url, required) {\n  var noSlashUrl = url[0] === \"/\" ? url.substr(1) : url;\n  var noSlashRequired = required[0] === \"/\" ? required.substr(1) : required;\n  return noSlashUrl === noSlashRequired;\n}\n\nfunction isBodyOrParametersMatching(method, body, parameters, required) {\n  var allowedParamsMethods = [\"delete\", \"get\", \"head\", \"options\"];\n  if (allowedParamsMethods.indexOf(method.toLowerCase()) >= 0) {\n    var data = required ? required.data : undefined;\n    var params = required ? required.params : undefined;\n    return isObjectMatching(parameters, params) && isBodyMatching(body, data);\n  } else {\n    return isBodyMatching(body, required);\n  }\n}\n\nfunction isObjectMatching(actual, expected) {\n  if (expected === undefined) return true;\n  if (typeof expected.asymmetricMatch === \"function\") {\n    return expected.asymmetricMatch(actual);\n  }\n  return isEqual(actual, expected);\n}\n\nfunction isBodyMatching(body, requiredBody) {\n  if (requiredBody === undefined) {\n    return true;\n  }\n  var parsedBody;\n  try {\n    parsedBody = JSON.parse(body);\n  } catch (e) {}\n\n  return isObjectMatching(parsedBody ? parsedBody : body, requiredBody);\n}\n\nfunction purgeIfReplyOnce(mock, handler) {\n  Object.keys(mock.handlers).forEach(function (key) {\n    var index = mock.handlers[key].indexOf(handler);\n    if (index > -1) {\n      mock.handlers[key].splice(index, 1);\n    }\n  });\n}\n\nfunction settle(resolve, reject, response, delay) {\n  if (delay > 0) {\n    setTimeout(settle, delay, resolve, reject, response);\n    return;\n  }\n\n  if (\n    !response.config.validateStatus ||\n    response.config.validateStatus(response.status)\n  ) {\n    resolve(response);\n  } else {\n    reject(\n      createAxiosError(\n        \"Request failed with status code \" + response.status,\n        response.config,\n        response\n      )\n    );\n  }\n}\n\nfunction createAxiosError(message, config, response, code) {\n  var error = new Error(message);\n  error.isAxiosError = true;\n  error.config = config;\n  if (response !== undefined) {\n    error.response = response;\n  }\n  if (code !== undefined) {\n    error.code = code;\n  }\n\n  error.toJSON = function toJSON() {\n    return {\n      // Standard\n      message: this.message,\n      name: this.name,\n      // Microsoft\n      description: this.description,\n      number: this.number,\n      // Mozilla\n      fileName: this.fileName,\n      lineNumber: this.lineNumber,\n      columnNumber: this.columnNumber,\n      stack: this.stack,\n      // Axios\n      config: this.config,\n      code: this.code,\n    };\n  };\n  return error;\n}\n\nfunction createCouldNotFindMockError(config) {\n  var message =\n    \"Could not find mock for: \\n\" +\n    JSON.stringify(config, [\"method\", \"url\"], 2);\n  var error = new Error(message);\n  error.isCouldNotFindMockError = true;\n  error.url = config.url;\n  error.method = config.method;\n  return error;\n}\n\nmodule.exports = {\n  find: find,\n  findHandler: findHandler,\n  purgeIfReplyOnce: purgeIfReplyOnce,\n  settle: settle,\n  isStream: isStream,\n  isArrayBuffer: isArrayBuffer,\n  isFunction: isFunction,\n  isObjectOrArray: isObjectOrArray,\n  isBuffer: isBuffer,\n  isBlob: isBlob,\n  isBodyOrParametersMatching: isBodyOrParametersMatching,\n  isEqual: isEqual,\n  createAxiosError: createAxiosError,\n  createCouldNotFindMockError: createCouldNotFindMockError,\n};\n\n\n//# sourceURL=webpack://AxiosMockAdapter/./src/utils.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});