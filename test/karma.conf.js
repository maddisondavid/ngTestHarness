/**
 * Demo Test Runner Configuration
 * @author David Posin
 * For Chrome on Linux set the environment variable called CHROME_BIN to your
 * Chromium installation. For example,
 * export CHROME_BIN=/usr/bin/chromium-browser
 */
var vendorLibs = [
    '../examples/vendor/angular.min.js',
    '../examples/vendor/angular-mocks.js',
    '../examples/vendor/angular-sanitize.js',
    '../examples/vendor/angular-cookies.js',
    '../ngTestHarness.js'
];

var inCoverage = [
    '../ngTestHarness.js'
];

var testSpecs = [
    'ngTestHarness.spec.js'
];

module.exports = function (config) {
    config.set({

        frameworks: [
            'jasmine'
        ],

        files: [].concat(
            vendorLibs,
            inCoverage,
            testSpecs
        ),

        plugins: [
            'karma-ng-html2js-preprocessor',
            'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-firefox-launcher',
            'karma-chrome-launcher'
        ],

        preprocessors: {
            '*.html': 'ng-html2js'
        },

        port: 9876,
        runnerPort: 9100,
        colors: true,
        logLevel: config.LOG_ERROR,
        autoWatch: false,
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};
