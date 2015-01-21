#Index

**Classes**

* [class: ngTestHarness](#ngTestHarness)
  * [new ngTestHarness(modules, options)](#new_ngTestHarness)

**Functions**

* [handleCookie(key, value)](#handleCookie)
* [clearCookies()](#clearCookies)
* [compileElement(html, vars)](#compileElement)
* [getIsolate(html, vars)](#getIsolate)
* [getScope(html, vars)](#getScope)
* [isValidScope(scope)](#isValidScope)
* [addToRootScope(key, value)](#addToRootScope)
* [removeFromRootScope(key)](#removeFromRootScope)
* [setGet(opts)](#setGet)
* [setPost(opts)](#setPost)
* [setPut(opts)](#setPut)
* [setDelete(opts)](#setDelete)
* [setCustomVerb(opts)](#setCustomVerb)
* [flushInterval(delay, [scope])](#flushInterval)
* [flushTimeout(delay, [scope])](#flushTimeout)
* [verifyTimeout()](#verifyTimeout)
* [cancelTimeout(timeout)](#cancelTimeout)
* [clearTemplateCache()](#clearTemplateCache)
* [verifyHttp()](#verifyHttp)
* [flushHttp()](#flushHttp)
* [clearContext(scope)](#clearContext)
* [digest(scope)](#digest)
* [verifyRootIsClean(resolve, reject)](#verifyRootIsClean)
* [getProvider(name)](#getProvider)

**Typedefs**

* [type: HttpOptions](#HttpOptions)
 
<a name="ngTestHarness"></a>
#class: ngTestHarness
**Members**

* [class: ngTestHarness](#ngTestHarness)
  * [new ngTestHarness(modules, options)](#new_ngTestHarness)

<a name="new_ngTestHarness"></a>
##new ngTestHarness(modules, options)
**Params**

- modules `array` - Names of modules to be loaded into the context  
- options `object` - Key value pairs for context creation.  Currently supports cookies: true  

<a name="handleCookie"></a>
#handleCookie(key, value)
Adds a cookie, by key and value, into the Angular $cookieStore.

**Params**

- key `string` - ID for the value.  
- value `object` - Value to be stored.  

**Returns**:  - the cookie information as determined by $cookieStore.  
<a name="clearCookies"></a>
#clearCookies()
Clears all cookies currently in the cookieStore.

<a name="compileElement"></a>
#compileElement(html, vars)
Create the html context and scope

**Params**

- html `string` - The html to be used by the module to create the page DOM  
- vars `object` - For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit  

**Returns**: `string` - Html  
<a name="getIsolate"></a>
#getIsolate(html, vars)
If this is a directive with isolateScope then return it

**Params**

- html `string` - The html to be used by the module to create the page DOM  
- vars `object` - For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit  

**Returns**: `object` - Directive scope  
<a name="getScope"></a>
#getScope(html, vars)
Returns the scope associated with the element (which will differ from the isolate scope when used by a directive)

**Params**

- html `string` - The html to be used by the module to create the page DOM  
- vars `object` - For the purpose of scope inheritance, this contains variables that should be on the parent scope for the child to inherit  

**Returns**: `object` - Scope  
<a name="isValidScope"></a>
#isValidScope(scope)
Validates an object to see if it is likely to be an Angular scope.
(Note: If there is a better way to determine scope, please suggest it.)

**Params**

- scope `object` - An object to be tested for Angular scope identifiers.  

**Returns**: `boolean` - Whether or not the scope is valid.  
<a name="addToRootScope"></a>
#addToRootScope(key, value)
Add mocked services directly to rootScope, and subsequently all new scopes.

**Params**

- key `string` - The name of service, which can be accessed with scope[key]  
- value `any` - Any valid JavaScript type that will correspond to scope[key]  

<a name="removeFromRootScope"></a>
#removeFromRootScope(key)
Remove mocked services directly from rootScope.

**Params**

- key `string` - The name of service  

<a name="setGet"></a>
#setGet(opts)
Convenience function for setting up a get in the httpBackEnd.  Provides the verb property for the options object.

**Params**

- opts <code>[HttpOptions](#HttpOptions)</code> - Options object.  

<a name="setPost"></a>
#setPost(opts)
Convenience function for setting up a post in the httpBackEnd.  Provides the verb property for the options object.

**Params**

- opts <code>[HttpOptions](#HttpOptions)</code> - Options object.  

<a name="setPut"></a>
#setPut(opts)
Convenience function for setting up a put in the httpBackEnd.  Provides the verb property for the options object.

**Params**

- opts <code>[HttpOptions](#HttpOptions)</code> - Options object.  

<a name="setDelete"></a>
#setDelete(opts)
Convenience function for setting up a delete in the httpBackEnd.  Provides the verb property for the options object.

**Params**

- opts <code>[HttpOptions](#HttpOptions)</code> - Options object.  

<a name="setCustomVerb"></a>
#setCustomVerb(opts)
Convenience function for setting up a custom verb in the httpBackEnd.

**Params**

- opts <code>[HttpOptions](#HttpOptions)</code> - Options object.  

<a name="flushInterval"></a>
#flushInterval(delay, [scope])
Convenience function for causing intervals to fire (advancing the timeout clock)

**Params**

- delay `number` - Mms to advance the interval clock (to trigger any intervals within that time period) before calling the flush  
- \[scope\] `Object` - If provided, a digest cycle will be run on the scope to process any functions triggered by the interval  

<a name="flushTimeout"></a>
#flushTimeout(delay, [scope])
Convenience function for causing timeouts to fire (flushing the timeout queue)

**Params**

- delay `number` - Mms to advance the timeout clock (to trigger any timeouts within that time period) before calling the flush  
- \[scope\] `Object` - If provided, a digest cycle will be run on the scope to process any functions triggered by the timeout  

<a name="verifyTimeout"></a>
#verifyTimeout()
Convenience function to verify the mocked timeout doesn't have any more deferred tasks

<a name="cancelTimeout"></a>
#cancelTimeout(timeout)
Convenience function to cancel a timeout, causing the promise to return a rejection

**Params**

- timeout `number` - The timeout promise to cancel. Will trigger the timeout's reject function.  

<a name="clearTemplateCache"></a>
#clearTemplateCache()
Convenience function to clear templates from the cache

<a name="verifyHttp"></a>
#verifyHttp()
Convenience function for making sure there are no outstanding http expect requests, and no templates hanging around

<a name="flushHttp"></a>
#flushHttp()
Convenience function for causing http requests in the back end to fire (flushing the httpBackend queue)

<a name="clearContext"></a>
#clearContext(scope)
Makes sure there are no outstanding pieces (http, timeout, $$phase) sitting in the
context that would indicate an incomplete test or interefere with future tests.
Note: Consider putting this in the afterEach block.

**Params**

- scope `object` - The scope to check  

**Type**: `Error`  
<a name="digest"></a>
#digest(scope)
Convenience function to streamline calling a scope digest.  Initially a scope digest is called, then the http and timeout queues are flushed in case they have queued actions, and finally a digest is called again to process the results of the flush

**Params**

- scope `object` - The scope to digest  

**Type**: `Error`  
<a name="verifyRootIsClean"></a>
#verifyRootIsClean(resolve, reject)
Convenience function to check that there are no digest operations in progress

**Params**

- resolve `function` - The resolver function for the promise checking rootScope's phase.  
- reject `function` - The reject function for the promise checking rootScope's phase.  

**Returns**: `Object` - Promise for the root scope check  
<a name="getProvider"></a>
#getProvider(name)
Pull a particular provider from the context

**Params**

- name `string` - The name of the provider to retrieve  

**Returns**: `object` - Provider object  
<a name="HttpOptions"></a>
#type: HttpOptions
**Properties**

- verb `string` - The http verb, default 'GET'  
- url `string` - The url to intercept (Can be a regular expression)  
- requestData `string` - The data to send for mock matching purposes  
- responseStatus `number` - Status code to send in the response, default 200  
- responseData `string` | `object` - Message or data to return, default ''  
- responseHeaders `string` - Headers to send back with the response, default undefined  
- requestHeaders `string` - Headers to pass to the interceptor for mock matching purposes  
- callback `function` - Function to call in the response instead of returning the response data array  
- isWhen `boolean` - If true, this instantiates a when[verb].  This is useful for a standard response that most tests should trip.  Avoids creating new interceptions with every test.  If false or missing, this creates an except[verb] which only fires once and supercedes the whenGet.  If false and untripped, the test will fail. Defaults to false.  

**Type**: `object`  
