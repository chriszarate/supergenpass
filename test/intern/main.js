// Learn more about configuring this file at <https://github.com/theintern/intern/wiki/Configuring-Intern>.
// These default settings work OK for most people. The options that *must* be changed below are the
// packages, suites, excludeInstrumentation, and (if you want functional tests) functionalSuites.
define({
  // The port on which the instrumenting proxy will listen
  proxyPort: 9000,

  // A fully qualified URL to the Intern proxy
  proxyUrl: 'http://localhost:9000/',

  // Default desired capabilities for all environments. Individual capabilities can be overridden by any of the
  // specified browser environments in the `environments` array below as well. See
  // https://code.google.com/p/selenium/wiki/DesiredCapabilities for standard Selenium capabilities and
  // https://saucelabs.com/docs/additional-config#desired-capabilities for Sauce Labs capabilities.
  // Note that the `build` capability will be filled in with the current commit ID from the Travis CI environment
  // automatically
  capabilities: {
    'selenium-version': '2.41.0'
  },

  // Browsers to run integration testing against. Note that version numbers must be strings if used with Sauce
  // OnDemand. Options that will be permutated are browserName, version, platform, and platformVersion; any other
  // capabilities options specified for an environment will be copied as-is
  environments: [
    { browserName: 'android', version: '4.4', platform: 'Linux' },
    { browserName: 'iphone', version: ['8.1', '7.1'], platform: 'OS X 10.9' },
    { browserName: 'internet explorer', version: '11', platform: 'Windows 8.1' },
    { browserName: 'firefox', version: '33', platform: 'Linux' },
    { browserName: 'chrome', version: '38', platform: 'Linux' },
    { browserName: 'safari', version: '8', platform: 'OS X 10.10' },
    { browserName: 'safari', version: '7', platform: 'OS X 10.9' },
    { browserName: 'safari', version: '6', platform: 'OS X 10.8' }
  ],

  // Maximum number of simultaneous integration tests that should be executed on the remote WebDriver service
  maxConcurrency: 3,

  // Name of the tunnel class to use for WebDriver tests
  tunnel: "SauceLabsTunnel",

  // Functional test suite(s) to run in each browser once non-functional tests are completed
  functionalSuites: [ 'test/intern/functional/mobile' ],

  // A regular expression matching URLs to files that should not be included in code coverage analysis
  excludeInstrumentation: /^tests|bower_components|node_modules\//
});
