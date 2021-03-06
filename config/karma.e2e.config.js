// Karma configuration
// Generated on Wed Jun 05 2013 09:16:41 GMT-0700 (PDT)

// base path, that will be used to resolve files and exclude
basePath = '../';

// list of files / patterns to load in the browser
files = [
    ANGULAR_SCENARIO,
    ANGULAR_SCENARIO_ADAPTER,

    // Test specs
    './test/angular/e2e/**/*.js'
];

// list of files to exclude
exclude = [];

// A map of path-proxy pairs.
proxies = {
    '/': 'https://localhost:3000'
};

// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];

// web server port
port = 9203;

// cli runner port
runnerPort = 9303;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome', 'Firefox', 'Safari'];

// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
