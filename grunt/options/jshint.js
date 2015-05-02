/* grunt-contrib-jshint */

module.exports = {
  options: {
    ignores: [
      'src/mobile/lib/**/*.js'
    ],
    jshintrc: true
  },
  app: [
    'src/**/*.js'
  ],
  grunt: [
    'grunt/**/*.js'
  ],
  tests: [
    'test/**/*.js'
  ]
};
