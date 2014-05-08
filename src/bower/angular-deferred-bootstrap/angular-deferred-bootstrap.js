/**
 * angular-deferred-bootstrap - v0.0.3 - 2014-04-15
 * https://github.com/philippd/angular-deferred-bootstrap
 * Copyright (c) 2014 Philipp Denzler
 * License: MIT
 */
(function (window, document) {
'use strict';

var isObject = angular.isObject,
  isFunction = angular.isFunction,
  isString = angular.isString,
  forEach = angular.forEach,
  bodyElement = angular.element(document.body),
  injector = angular.injector(['ng']),
  $q = injector.get('$q'),
  $http = injector.get('$http'),
  loadingClass = 'deferred-bootstrap-loading',
  errorClass = 'deferred-bootstrap-error';

function addLoadingClass() {
  bodyElement.addClass(loadingClass);
}

function removeLoadingClass() {
  bodyElement.removeClass(loadingClass);
}

function addErrorClass() {
  removeLoadingClass();
  bodyElement.addClass(errorClass);
}

function isPromise (value) {
  return isObject(value) && isFunction(value.then);
}

function checkConfig (config) {
  if (!isObject(config)) {
    throw new Error('Bootstrap configuration must be an object.');
  }
  if (!isString(config.module)) {
    throw new Error('\'config.module\' must be a string.');
  }
  if (!isObject(config.resolve)) {
    throw new Error('\'config.resolve\' must be an object.');
  }
}

function doBootstrap (element, module) {
  angular.element(document).ready(function () {
    angular.bootstrap(element, [module]);
    removeLoadingClass();
  });
}

function bootstrap (configParam) {

  var config = configParam || {},
    element = config.element,
    module = config.module,
    promises = [],
    constantNames = [];

  addLoadingClass();
  checkConfig(config);

  function callResolveFn (resolveFunction, constantName) {
    var result;

    constantNames.push(constantName);
    if (!isFunction(resolveFunction)) {
      throw new Error('Resolve for \'' + constantName + '\' is not a function.');
    }

    result = resolveFunction($http, $q, injector);
    if (isPromise(result)) {
      promises.push(result);
    } else {
      throw new Error('Resolve function for \'' + constantName + '\' must return a promise.');
    }
  }

  function handleResults (results) {
    forEach(results, function (value, index) {
      var result = value && value.data ? value.data : value;
      angular.module(module).constant(constantNames[index], result);
    });
    doBootstrap(element, module);
  }

  forEach(config.resolve, callResolveFn);

  $q.all(promises).then(handleResults, addErrorClass);

}

// publish external API
window.deferredBootstrapper = {
  bootstrap: bootstrap
};

})(window, document);