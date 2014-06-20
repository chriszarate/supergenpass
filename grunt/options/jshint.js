/* grunt-contrib-jshint */

module.exports = {
  options: {
    browser: true,
    node: true,
    unused: true
  },
  app: [
    'src/**/*.js'
  ],
  tests: [
    'test/*.js'
  ]
};
