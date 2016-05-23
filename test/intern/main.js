'use strict';

/*global define*/

// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
  // The port on which the instrumenting proxy will listen
  proxyPort: 9000,

  // A fully qualified URL to the Intern proxy
  proxyUrl: 'http://localhost:9000/',

  // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
  // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
  // capabilities options specified for an environment will be copied as-is
  environments: [
    { browserName: 'android', version: '4.4', platform: 'Linux' },
    { browserName: 'iphone', version: '9.2', platform: 'OS X 10.10' },
    { browserName: 'internet explorer', version: '11.0', platform: 'Windows 7', requireWindowFocus: 'true' },
    { browserName: 'firefox', version: '45.0', platform: 'Windows 7' },
    { browserName: 'chrome', version: '50.0', platform: 'Windows 7' },
    { browserName: 'safari', version: '8.0', platform: 'OS X 10.10' }
  ],

  // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
  maxConcurrency: 2,

  // Name of the tunnel class to use for WebDriver tests
  tunnel: 'SauceLabsTunnel',

  // Functional test suite(s) to run in each browser once non-functional tests are completed
  functionalSuites: ['test/intern/functional/mobile'],

  // A regular expression matching URLs to files that should not be included in code coverage analysis
  excludeInstrumentation: /^bower_components|node_modules\//
});
