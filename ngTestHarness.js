/* global angular: true */
/* jshint node: true, phantom: true, strict: true */

/**
      ________       .__ ____  __.      .__
     /  _____/_____  |__|    |/ _|____  |__|
    /   \  ___\__  \ |  |      < \__  \ |  |
    \    \_\  \/ __ \|  |    |  \ / __ \|  |
     \______  (____  /__|____|__ (____  /__|
            \/     \/           \/    \/

    Copyright (c) 2014-2015 Gaikai Inc. (A Sony Computer Entertainment Company).
    Visit us at https://gaikai.com/ for more information.

    @author David Posin
    @author Nate Ferrero
    @author Daniel Jordan
    @author Gaikai Team Titan
    @desc Creates a context for Angular unit tests and provides several convenience functions to streamline testing
*/
(function(angular) {
    'use strict';

    /* A constant list of commonly used Angular providers
     * These will be exposed through ngTestHarness()[provider]
     * in a non-$ syntax, e.g. ngTestHarness().q
     */
    var providers = [
        '$rootScope',
        '$compile',
        '$http',
        '$httpBackend',
        '$templateCache',
        '$timeout',
        '$interval',
        '$browser',
        '$q'
    ];

    /** @ignore */
    var ngTestHarness = function(modules) {

        // Add in Angular, Sanitize, and Mock as default modules.
        modules.unshift('ng', 'ngSanitize', 'ngMock');

        //Angular's services that will be used by the rest of the object's functions, and that should be externally accessible
        this.angularFactory = angular.injector(modules);

        // Each factory gets placed on ngTestHarness, accessible through a non-$ method.
        providers.forEach(function(provider) {
            this[provider.slice(1)] = this.angularFactory.get(provider);
        }, this);

        //if cookie mocking is requested, then add the needed pieces
        if (modules.indexOf('ngCookies') > -1) {
            this.cookieStore = this.angularFactory.get('$cookieStore');
            this.cookies = [];

            /**
             * @function handleCookie
             * @desc Adds a cookie, by key and value, into the Angular $cookieStore.
             * @param {string} key ID for the value.
             * @param {object} value Value to be stored.
             * @return the cookie information as determined by $cookieStore.
             */
            this.handleCookie = function(key, value) {
                if (value) {
                    this.cookieStore.put(key, value);
                    this.cookies.push(key);
                }

                return this.cookieStore.get(key);
            };
        }
    };

    ngTestHarness.prototype = {
        /**
            @constructs ngTestHarness
            @param {array} modules Names of modules to be loaded into the context
            @param {object} options Key value pairs for context creation.  Currently supports cookies: true
        */
        constructor: ngTestHarness,

        /**
            @function compileElement
            @desc Create the html context and scope
            @returns {string} Html
            @param {string} html The html to be used by the module to create the page DOM
            @param {object} vars For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit
        */
        compileElement: function(html, vars) {

            var compile = this.compile;
            var parentScope = {};
            var scope = {};
            var browser = this.browser;
            var httpBackend = this.httpBackend;
            var timeout = this.timeout;

            parentScope = this.rootScope.$new();
            if (vars) {
                angular.extend(parentScope, angular.copy(vars));
            }

            scope = parentScope.$new();

            //invoke the injector prepared in the constructor
            return this.angularFactory.invoke(function() {
                var elm = compile(html)(scope);

                //digesting won't happen automatically since we are testing, so force it
                parentScope.$digest();

                //if there are any back end calls waiting from the compile, flush them out
                try {
                    httpBackend.flush();
                } catch (e) {
                    if (e.message !== 'No pending request to flush !') {
                        throw e;
                    }
                }

                //if there are any timers waiting from the compile, flush them out
                if (browser.deferredFns.length > 0) {
                    timeout.flush();
                }

                //in case the http or timeout caused a data bound element to change, force another digest
                parentScope.$digest();

                return elm;
            });
        },

        /**
            @function getIsolate
            @desc If this is a directive with isolateScope then return it
            @returns {object} Directive scope
            @param {string} html The html to be used by the module to create the page DOM
            @param {object} vars For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit
        */
        getIsolate: function(html, vars) {
            return this.compileElement(html, vars).isolateScope();
        },

        /**
            @function getScope
            @desc Returns the scope associated with the element (which will differ from the isolate scope when used by a directive)
            @returns {object} Scope
            @param {string} html The html to be used by the module to create the page DOM
            @param {object} vars For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit
        */
        getScope: function(html, vars) {
            return this.compileElement(html, vars).scope();
        },

        /**
            @function isValidScope
            @description Validates an object to see if it is likely to be an Angular scope.
            (Note: If there is a better way to determine scope, please suggest it.)
            @returns {boolean} Whether or not the scope is valid.
            @param {object} scope An object to be tested for Angular scope identifiers.
        */
        isValidScope: function(scope) {
            return scope && scope.$id;
        },

        /**
            @function addToRootScope
            @desc Add mocked services directly to rootScope, and subsequently all new scopes.
            @param {string} key The name of service, which can be accessed with scope[key]
            @param {any} value Any valid JavaScript type that will correspond to scope[key]
        */
        addToRootScope: function (key, value) {
            var prototype = Object.getPrototypeOf(this.rootScope);
            prototype[key] = value;
        },

        /**
            @function removeFromRootScope
            @desc Remove mocked services directly from rootScope.
            @param {string} key The name of service
        */
        removeFromRootScope: function (key) {
            var prototype = Object.getPrototypeOf(this.rootScope);
            if (key in prototype) {
                delete prototype[key];
            }
        },

        _callBackend: function (opts){
            var clause;

            if (opts.isWhen){
                clause = 'when';
            } else {
                clause = 'expect';
            }

            if ( angular.isFunction(opts.callback) ){
                opts.callback = opts.callback.bind(opts.callback, opts.responseStatus, opts.responseData, opts.responseHeaders, opts.statusText);
            }

            this.httpBackend[clause] (opts.verb, opts.url, opts.requestData, opts.requestHeaders).respond( opts.callback ||
                function (){ return [opts.responseStatus, opts.responseData, opts.responseHeaders, opts.statusText];}
            );
        },

        /**
            @function setGet
            @desc Convenience function for setting up a get in the httpBackEnd.  Provides the verb property for the options object.
            @param {HttpOptions} opts Options object.
        */
        setGet: function(opts) {
            opts.verb = 'GET';
            this.setCustomVerb (opts);
        },

        /**
            @function setPost
            @desc Convenience function for setting up a post in the httpBackEnd.  Provides the verb property for the options object.
            @param {HttpOptions} opts Options object.
        */
        setPost: function(opts) {
            opts.verb = 'POST';
            this.setCustomVerb (opts);
        },

        /**
            @function setPut
            @desc Convenience function for setting up a put in the httpBackEnd.  Provides the verb property for the options object.
            @param {HttpOptions} opts Options object.
        */
        setPut: function(opts) {
            opts.verb = 'PUT';
            this.setCustomVerb (opts);
        },

        /**
            @function setDelete
            @desc Convenience function for setting up a delete in the httpBackEnd.  Provides the verb property for the options object.
            @param {HttpOptions} opts Options object.
        */
        setDelete: function(opts) {
            opts.verb = 'DELETE';
            this.setCustomVerb (opts);
        },


        /**
            @function setCustomVerb
            @desc Convenience function for setting up a custom verb in the httpBackEnd.
            @param {HttpOptions} opts Options object.
        */
        setCustomVerb: function(opts) {
            this._callBackend ({
                verb: opts.verb || 'GET',
                url: opts.url || '',
                requestData: opts.data || undefined,
                responseStatus: opts.responseStatus || 200,
                responseData: opts.responseData || '',
                requestHeaders: opts.requestHeaders,
                isWhen: opts.isWhen || false,
                callback: opts.callback || undefined,
                responseHeaders: opts.responseHeaders || undefined,
                statusText: opts.statusText || undefined
            });
        },

        /**
            @function flushInterval
            @desc Convenience function for causing intervals to fire (advancing the timeout clock)
            @param {number} delay Mms to advance the interval clock (to trigger any intervals within that time period) before calling the flush
            @param {Object} [scope] If provided, a digest cycle will be run on the scope to process any functions triggered by the interval
        */
        flushInterval: function(delay, scope) {
            this.interval.flush(delay);
            this.isValidScope(scope) && this.digest(scope);
        },

        /**
            @function flushTimeout
            @desc Convenience function for causing timeouts to fire (flushing the timeout queue)
            @param {number} delay Mms to advance the timeout clock (to trigger any timeouts within that time period) before calling the flush
            @param {Object} [scope] If provided, a digest cycle will be run on the scope to process any functions triggered by the timeout
        */
        flushTimeout: function(delay, scope) {
            this.timeout.flush(delay);
            this.isValidScope(scope) && this.digest(scope);
        },

        /**
            @function verifyTimeout
            @desc Convenience function to verify the mocked timeout doesn't have any more deferred tasks
        */
        verifyTimeout: function() {
            this.timeout.verifyNoPendingTasks();
        },

        /**
            @function cancelTimeout
            @desc Convenience function to cancel a timeout, causing the promise to return a rejection
            @param {number} timeout The timeout promise to cancel. Will trigger the timeout's reject function.
        */
        cancelTimeout: function(timeout) {
            if (timeout) {
                this.timeout.cancel(timeout);
            }
        },

       /**
            @function clearTemplateCache
            @desc Convenience function to clear templates from the cache
        */
        clearTemplateCache: function() {
            this.templates.removeAll();
        },

        /**
            @function verifyHttp
            @desc Convenience function for making sure there are no outstanding http expect requests, and no templates hanging around
        */
        verifyHttp: function() {
            this.httpBackend.verifyNoOutstandingRequest();
            this.clearTemplateCache();
        },

        /**
            @function flushHttp
            @desc Convenience function for causing http requests in the back end to fire (flushing the httpBackend queue)
        */
        flushHttp: function(scope) {
            this.httpBackend.flush();
            this.isValidScope(scope) && this.digest(scope);
        },

        /**
            @function clearContext
            @desc Makes sure there are no outstanding pieces (http, timeout, $$phase) sitting in the context that would indicate an incomplete test or interefere with future tests.  Consider putting this in the afterEach block.
            @param {object} scope The scope to check
        */
        clearContext: function(scope) {

            var self = this;

            //if we are testing cookies, clear them
            if (this.cookies) {
                if (this.cookies.length > 0) {
                    angular.forEach(this.cookies, function(key) {
                        try {
                            this.cookieStore.remove(key);
                        } catch (e) {
                            return true;
                        }
                    });
                }

                this.cookies = [];
            }

            //ensure there are no digest operations in progress
            this.verifyRootIsClean(
                angular.noop,
                function (msg){
                    self.rootScope.$$phase = '';
                    throw new Error(msg);
                }
            );

            //verify timeout, http, and interval queues are empty
            this.timeout.verifyNoPendingTasks();
            this.httpBackend.verifyNoOutstandingRequest();
            this.httpBackend.resetExpectations();

            //just for surety, destroy the scope so it doesn't stick around and affect the next test
            if (scope && scope.$destroy) {
                scope.$destroy();
            }
        },

        /**
            @function digest
            @desc Convenience function to streamline calling a scope digest.  Initially a scope digest is called, then the http and timeout queues are flushed in case they have queued actions, and finally a digest is called again to process the results of the flush
            @param {object} scope The scope to digest
        */
        digest: function(scope) {

            scope.$digest();

            //flush timeouts, and make sure there are no more
            if (this.browser.deferredFns.length > 0) {
                this.timeout.flush();
                this.timeout.verifyNoPendingTasks();
            }

            try {
                this.httpBackend.flush();
            } catch (e) {
                if (e.message !== 'No pending request to flush !') {
                    throw e;
                }
            }

            scope.$digest();
        },

        /**
            @function verifyRootIsClean
            @returns {Object} Promise for the root scope check
            @desc Convenience function to check that there are no digest operations in progress
        */
        verifyRootIsClean: function() {

            var self = this;

            return self.q(function(resolve, reject) {
                if (self.rootScope.$$phase){
                    resolve();
                } else {
                    reject('rootScope is not clean - in ' + self.rootScope.$$phase);
                }
            })
        },

        /**
            @function getProvider
            @desc Pull a particular provider from the context
            @returns {object} Provider object
            @param {string} name The name of the provider to retrieve
        */
        getProvider: function(name) {
            return this.angularFactory.get(name);
        }
    };

    if (typeof window === 'object') {
        window.ngTestHarness = ngTestHarness;
    } else {
        exports = ngTestHarness;
    }

    /**
        @namespace HttpOptions
        @typedef {object} HttpOptions
        @property {string} verb The http verb, default 'GET'
        @property {string} url The url to intercept (Can be a regular expression)
        @property {string} [requestData] The data to send for mock matching purposes
        @property {number} [responseStatus] Status code to send in the response, default 200
        @property {string|object} [responseData] Message or data to return, default ''
        @property {string} [responseHeaders] Headers to send back with the response, default undefined
        @property {string} [requestHeaders] Headers to pass to the interceptor for mock matching purposes
        @property {function} [callback] Function to call in the response instead of returning the response data array
        @property {boolean} [isWhen] If true, this instantiates a when[verb].  This is useful for a standard response that most tests should trip.  Avoids creating new interceptions with every test.  If false or missing, this creates an except[verb] which only fires once and supercedes the whenGet.  If false and untripped, the test will fail. Defaults to false.
    */
})(angular);

