describe('ngTestHarness', function() {
    describe('constructor', function () {
        it('should build a modules list that includes the default modules.', function () {
            var harness = new ngTestHarness();
            // Test for $http, which is in the ng module.
            expect(harness.angularFactory.get('$http')).not.toBeUndefined();
            // Test for $sanitize, which is in the ngSanitize module.
            expect(harness.angularFactory.get('$sanitize')).not.toBeUndefined();
            // Test for $httpBackend, which is in the ngMock module.
            expect(harness.angularFactory.get('$httpBackend')).not.toBeUndefined();
        });

        it('should build a modules list that includes ngCookies and cookie helper objects and function.', function () {
            var harness = new ngTestHarness(['ngCookies']);
            // Test for $cookies, which is in the ngCookies module.
            expect(harness.angularFactory.get('$cookies')).not.toBeUndefined();
            // Test for cookie helpers.
            expect(Array.isArray(harness.cookies)).toBe(true);
            expect(harness.cookieStore).not.toBeUndefined();
            expect(typeof harness.handleCookie === 'function').toBe(true);
        });
    });

    describe('handleCookie', function () {
        beforeEach(function () {
            this.harness = new ngTestHarness(['ngCookies']);
            // Add a cookie to the cookieStore with handleCookie.
            this.harness.handleCookie('test', 'test');
        });

        it('should save the cookie key in cookies.', function () {
            // Make sure the key exists in cookies.
            expect(this.harness.cookies).toContain('test');
        });

        it('should get the cookie from the cookieStore with that value set.', function () {
            // Make sure handle cookie returns the cookie value.
            expect(this.harness.handleCookie('test')).toBe('test');
        });
    });

    describe('compileElement', function () {
        it('should create a child scope and compile a template.', function () {
            var scope = {};
            var harness = new ngTestHarness();
            var template = '<div class="test"></div>';
            // Attempt to build the template.
            var element = harness.compileElement(template, scope);
            // If the template succeeded, we should have an element
            // and that element should have an Angular-special class, ng-scope.
            expect(element && element[0]).not.toBeUndefined();
            expect(element[0].classList.contains('ng-scope')).toBe(true);
        });
    });

    describe('getIsolate, getScope, isValidScope', function () {
        var template = '<test></test>';
        var scopeTemplate = {};

        beforeEach(function () {
            angular.module('test', []).directive('test', function () {
              return {restrict: 'E', scope:{}, link: angular.noop};
            });

            this.harness = new ngTestHarness(['test']);
        });

        it('should return a valid isolated scope.', function () {
            var scope = this.harness.getIsolate(template, angular.copy(scopeTemplate));
            // A valid scope is defined and contains Angular's private $id variable.
            expect(scope).not.toBeUndefined();
            expect(typeof scope.$id === 'number').toBe(true);
        });

        it('should return a valid scope.', function () {
            var scope = this.harness.getScope(template, angular.copy(scopeTemplate));
            // A valid scope is defined and contains Angular's private $id variable.
            expect(scope).not.toBeUndefined();
            expect(typeof scope.$id === 'number').toBe(true);
        });

        it('should grab the isolated scope and it should be unique from the passed in scope.', function () {
            var scopeTemplate = {};
            var element = this.harness.compileElement(template, angular.copy(scopeTemplate));
            // Attempt to compare $id's between both scopes.
            expect(element.scope().$id).not.toBe(element.isolateScope().$id);
        });

        it('should return true when $id is present on an object and false when not.', function () {
            var scope = this.harness.getIsolate(template, {});
            // getIsolate, at this point, returns a valid scope, so it will
            // evaluate true.
            expect(this.harness.isValidScope(scope)).toBe(true);

            scope = {};
            // Reducing scope to an empty object should ensure a failure.
            expect(this.harness.isValidScope(scope)).toBe(false);
        });
    });

    describe('addToRootScope, removeFromRootScope', function () {
        it('should add a string value to rootScope.', function () {
            var harness = new ngTestHarness();
            harness.addToRootScope('test', 'test');
            // Ensure that the $rootScope does now contain a test property.
            var prototype = Object.getPrototypeOf(harness.angularFactory.get('$rootScope'));
            expect(prototype.test).toBe('test');
        });

        it('should remove a property from the rootScope', function () {
            var harness = new ngTestHarness();
            harness.addToRootScope('test', 'test');
            // Ensure that the $rootScope no longer has a test property.
            harness.removeFromRootScope('test');
            var prototype = Object.getPrototypeOf(harness.angularFactory.get('$rootScope'));
            expect(prototype.test).toBeUndefined();
        });
    });

    describe('_callBackend, setCustomVerb, set{Get|Put|Post|Delete}', function () {
        it('should build a mocking response based on when.', function () {
            var harness = new ngTestHarness();

            // We can confirm a `when` was set up by spying on it.
            spyOn(harness.httpBackend, 'when').and.callThrough();
            harness._callBackend({
                verb: 'GET',
                url: 'http://example.com',
                requestData: [],
                requestHeaders: [],
                isWhen: true
            });

            expect(harness.httpBackend.when).toHaveBeenCalledWith('GET', 'http://example.com', [], []);
        });

        it('should build a mocking response based on expect.', function () {
            var harness = new ngTestHarness();

            spyOn(harness.httpBackend, 'expect').and.callThrough();
            harness._callBackend({
                verb: 'GET',
                url: 'http://example.com',
                requestData: [],
                requestHeaders: [],
                isWhen: false
            });

            expect(harness.httpBackend.expect).toHaveBeenCalledWith('GET', 'http://example.com', [], []);
        });

        it('should bind HttpOptions on the provided callback function.', function () {
            // Turns out PhantomJS doesn't come with bind.
            Function.prototype.bind = function () {
                // We only need it to make sure it was called.
                return Array.prototype.slice.call(arguments, 1);
            };

            var harness = new ngTestHarness();
            var options = {
                verb: 'GET',
                url: 'http://example.com',
                requestData: [],
                requestHeaders: [],
                responseStatus: 200,
                responseData: [],
                responseHeaders: [],
                statusText: 'test',
                isWhen: false,
                callback: function () {}
            };

            harness._callBackend(options);
            // Make sure bind was called with responseStatus, responseData, responseHeaders
            // and statusText.
            expect(options.callback).toEqual([200, [], [], 'test']);
        });

        it('should build a default HttpOptions object merged with passed in data.', function () {
            var harness = new ngTestHarness();
            var options = {
                verb: 'GET',
                url: 'http://example.com'
            };

            spyOn(harness, '_callBackend');
            harness.setCustomVerb(options);

            expect(harness._callBackend).toHaveBeenCalledWith({
                verb: 'GET',
                url: 'http://example.com',
                requestData: undefined,
                requestHeaders: undefined,
                responseStatus: 200,
                responseData: '',
                responseHeaders: undefined,
                isWhen: false,
                callback: undefined,
                statusText: undefined
            });
        });

        it('should set the correct HTTP verb with the correspond convenience function.', function () {
            var harness = new ngTestHarness();
            var options = {
              verb: 'OPTIONS',
              url: 'http://example.com'
            };

            spyOn(harness, 'setCustomVerb');
            // Start with setGet
            harness.setGet(angular.copy(options));

            expect(harness.setCustomVerb).toHaveBeenCalledWith({
                verb: 'GET',
                url: 'http://example.com'
            });

            // Start with setGet
            harness.setPost(angular.copy(options));

            expect(harness.setCustomVerb).toHaveBeenCalledWith({
                verb: 'POST',
                url: 'http://example.com'
            });

            // Start with setGet
            harness.setPut(angular.copy(options));

            expect(harness.setCustomVerb).toHaveBeenCalledWith({
                verb: 'PUT',
                url: 'http://example.com'
            });

            // Start with setGet
            harness.setDelete(angular.copy(options));

            expect(harness.setCustomVerb).toHaveBeenCalledWith({
                verb: 'DELETE',
                url: 'http://example.com'
            });
        });
    });

    describe('flushInterval, flushTimeout', function () {
        beforeEach(function () {
            this.harness = new ngTestHarness();
            this.scope = {$id: 1};
        });

        it('should attempt to flush interval without and with a scope digesting.', function () {
            var harness = this.harness;
            var scope = this.scope;

            spyOn(harness.interval, 'flush');
            spyOn(harness, 'digest');

            harness.flushInterval(100);
            expect(harness.interval.flush).toHaveBeenCalledWith(100);

            harness.flushInterval(100, scope);
            expect(harness.interval.flush).toHaveBeenCalledWith(100);
            expect(harness.digest).toHaveBeenCalledWith({$id: 1});
        });

        it('should attempt to flush timeout without and with a scope digesting.', function () {
            var harness = this.harness;
            var scope = this.scope;

            spyOn(harness.timeout, 'flush');
            spyOn(harness, 'digest');

            harness.flushTimeout(100);
            expect(harness.timeout.flush).toHaveBeenCalledWith(100);

            harness.flushTimeout(100, scope);
            expect(harness.timeout.flush).toHaveBeenCalledWith(100);
            expect(harness.digest).toHaveBeenCalledWith({$id: 1});
        });

        it('should call internal timeout verification function.', function () {
            var harness = this.harness;

            spyOn(harness.timeout, 'verifyNoPendingTasks');

            harness.verifyTimeout();
            expect(harness.timeout.verifyNoPendingTasks).toHaveBeenCalled();
        });

        it('should cancel a timeout before it occurs.', function () {
            var harness = this.harness;
            var timeout = harness.timeout(angular.noop);

            harness.cancelTimeout(timeout);
            expect(timeout.$$state.value).toBe('canceled');
        });
    });

    describe('clearTemplateCache', function () {
        it('should attempt to remove all templates in the cache.', function () {
            var harness = new ngTestHarness();

            spyOn(harness.templateCache, 'removeAll');

            harness.clearTemplateCache();
            expect(harness.templateCache.removeAll).toHaveBeenCalled();
        });
    });

    describe('verifyHttp, flushHttp', function () {
        it('should call $httpBackend\'s verifyNoOutstandingRequest and clear templateCache.', function () {
            var harness = new ngTestHarness();

            spyOn(harness.httpBackend, 'verifyNoOutstandingRequest');
            spyOn(harness, 'clearTemplateCache');

            harness.verifyHttp();

            expect(harness.httpBackend.verifyNoOutstandingRequest).toHaveBeenCalled();
            expect(harness.clearTemplateCache).toHaveBeenCalled();
        });

        it('should call $httpBackend\'s flush and digest if given a scope.', function () {
            var harness = new ngTestHarness();
            var scope = {$id: 1};

            spyOn(harness.httpBackend, 'flush');
            spyOn(harness, 'digest');

            harness.flushHttp();
            expect(harness.httpBackend.flush).toHaveBeenCalled();
            expect(harness.digest).not.toHaveBeenCalled();

            harness.flushHttp(scope);
            expect(harness.httpBackend.flush).toHaveBeenCalled();
            expect(harness.digest).toHaveBeenCalled();
        });
    });

    describe('clearContext, digest', function () {
        it('should clean up scope, timeouts, http request, a rootScope phases.', function () {
            var harness = new ngTestHarness();
            var scope = {$id: 1, $destroy: function () {}};

            spyOn(harness, 'verifyHttp');
            spyOn(harness, 'verifyTimeout');
            spyOn(harness, 'verifyRootIsClean');
            spyOn(scope, '$destroy');

            harness.clearContext(scope);

            expect(harness.verifyHttp).toHaveBeenCalled();
            expect(harness.verifyTimeout).toHaveBeenCalled();
            expect(harness.verifyRootIsClean).toHaveBeenCalled();
            expect(scope.$destroy).toHaveBeenCalled();

            delete scope.$id;

            expect(harness.clearContext).toThrow();
        });

        it('should digest scope, clean up timeouts, and http requests.', function () {
            var harness = new ngTestHarness();
            var scope = {$id: 1, $digest: function () {}};

            spyOn(harness, 'flushTimeout');
            spyOn(harness, 'verifyTimeout');
            spyOn(harness, 'flushHttp');
            spyOn(scope, '$digest');

            harness.digest(scope);

            expect(harness.flushTimeout).not.toHaveBeenCalled();
            expect(harness.verifyTimeout).not.toHaveBeenCalled();
            expect(harness.flushHttp).toHaveBeenCalled();
            expect(scope.$digest).toHaveBeenCalled();


            harness.browser.deferredFns = [true];
            harness.digest(scope);

            expect(harness.flushTimeout).toHaveBeenCalled();
            expect(harness.verifyTimeout).toHaveBeenCalled();

            delete scope.$id;

            expect(harness.digest).toThrow();
        });
    });

    describe('getProvider', function () {
        it('should return $http from ng (core).', function () {
            var harness = new ngTestHarness();
            var $http = harness.getProvider('$http');

            expect($http).toBeDefined();
        });
    });

    describe('getController', function () {
        var harness;

        beforeEach(function () {
            angular.module('test', []).controller('testCtrl',function ($scope) {
                $scope.message = 'Hello';
                $scope.messageCopy = '';

                $scope.$watch('message', function (newVal, oldVal) {
                    $scope.messageCopy = newVal;
                });

                return {
                    getMessage: function () {
                        return $scope.message;
                    },
                    setMessage: function (val) {
                        $scope.message = val;
                    }
                };
            });

            harness = new ngTestHarness(['test']);
        });

        it('should get controller instance with scope', function () {
            var controller = harness.getController('testCtrl');

            expect(controller).not.toBe(undefined);
            expect(controller.$scope).not.toBe(undefined);
            expect(controller.$scope.message).toBe("Hello");
            expect(angular.isFunction(controller.setMessage)).toBe(true);
        });

        it('should call $watcher when $scope changed', function () {
            var controller = harness.getController('testCtrl');

            controller.$scope.message = 'Goodbye';
            harness.digest(controller.$scope);
            expect(controller.$scope.messageCopy).toBe('Goodbye');
        });

        it('should call $watcher when $scope changed in controller function', function () {
            var controller = harness.getController('testCtrl');

            controller.setMessage("Goodbye");
            harness.digest(controller.$scope);
            expect(controller.$scope.messageCopy).toBe("Goodbye");
        });

        it('should inject passed in $scope', function () {
            var controller = harness.getController('testCtrl', {
                testMessage: 'Bonjour'
            });

            expect(controller.$scope.testMessage).toBe('Bonjour');
            expect(controller.$scope.message).toBe('Hello');
        });
    });
});
