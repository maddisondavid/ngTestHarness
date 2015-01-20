/**
 * Demo Test Runner Configuration
 * @author David Posin
 * For Chrome on Linux set the environment variable called CHROME_BIN to your
 * Chromium installation. For example,
 * export CHROME_BIN=/usr/bin/chromium-browser
 */
var vendorLibs = [
    '../vendor/angular.min.js',
    '../vendor/angular-mocks.js',
    '../vendor/angular-sanitize.js',
    '../../ngTestHarness.js'
];

var templates = [
    'template.html'
];

var inCoverage = [
    '../demo.js'
];

var testSpecs = [
    'karma.spec.js'
];

module.exports = function (config) {
    config.set({

        frameworks: [
            'jasmine'
        ],

        files: [].concat(
            vendorLibs,
            templates,
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
