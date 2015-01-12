#Angular Testing Harness
Testing harness for Angular scopes, controllers, and providers.
Streamlines the boilerplate created by needing to inject dependencies for Angular Unit Testing.  Abstracts other features, and wraps setup and cleanup operations in easy to use functions.

##Modules Loaded By Default
  * ng
  * ngMock
  * ngSanitize

Additional modules, should be included in the modules parameter.

##Options Object
```
{
  cookies: true/false
}
```
* cookies - Loads the ngCookies module.  Make sure the angular-cookies javascript file is included in your test runner file or configuration.

##API
<a href="api.md">API</a>

##If using Jasmine
1. Make sure your SpecRunner includes:
    * Angular
    * Angular Mocks
    * Angular Sanitize

2. The files should include at least the three angular files above, the harness filepath, the paths to all spec and source files, and the path to your modularized template files.
  * The easiest way to get this is to run your templates through the [grunt-html2js](https://www.npmjs.com/package/grunt-html2js) and use the created file.  You could easily put this whole process into grunt using [grunt-contrib-jasmine] (https://www.npmjs.com/package/grunt-contrib-jasmine).

3. Open the SpecRunner in a browser.

###Jasmine Modularized Templates Example
```
angular.module('templates-main', ['template.html']);

angular.module('template.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template.html', '<div class={{class}}>{{message}}</div>');
}]);
```

###Jasmine SpecRunner Test Example
```
describe ("Load Sample\n", function (){
  var harness = new ngHarness([
      'sample',
      'templates-main'
  ]),
    parent={
      message:'Hello'
    };

  it('Expect innerHTML to contain message', function (){
    expect(
      harness.compileElement('<sample-demo message="message"></sample-demo>', parent).html()
    ).toContain('Hello');
  });
})
```


##If using Karma
1. Make sure the Karma configuration includes:
    * Angular
    * Angular Mocks
    * Angular Sanitize

2. The files should include at least the three angular files above, the harness filepath, the paths to all spec and source files, and all template files.
3. Install the [karma-ng-html2js-preprocessor](https://github.com/karma-runner/karma-ng-html2js-preprocessor), preferably through npm
4. Add the 'karma-ng-html2js-preprocessor' plugin to your karma configuration file.
5. Add a filepath pattern that will include your html templates in the preprocessors section.
6. Run Karma

```
plugins: [
    'karma-ng-html2js-preprocessor'
]
```
```
preprocessors: {
    "'*.html': 'ng-html2js'""
}
```

###Karma Test Example (Using Jasmine)
```
describe ("Load Sample\n", function (){
  var harness = new ngHarness([
      'sample',
      'template.html'
  ]),
  parent={
    message:'Hello'
  };

  it('Expect innerHTML to contain message', function (){
    expect(
      harness.compileElement('<sample-demo message="message"></sample-demo>', parent).html()
    ).toContain('Hello');
  });
})

```

##Authors
* [David Posin](https://github.com/Lastalas)
* [Nate Ferrero](https://github.com/NateFerrero)
* [Daniel Jordan](https://github.com/danjordan2)

##Contributors
* [Jarrod Perez](https://github.com/cytoplankton)
* [Jeremy Bernstein](https://github.com/Dr-Jerm)
* [Trey Cordova](https://github.com/treycordova)
* [Kevin Kragenbrink](https://github.com/kkragenbrink)
* Matt Furniss

##License
[MIT License](LICENSE.md)

Copyright (c) 2014-2015 Gaikai Inc. (A Sony Computer Entertainment Company).
Visit us at https://gaikai.com/ for more information.
