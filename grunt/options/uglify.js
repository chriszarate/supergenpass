/* grunt-contrib-uglify */

module.exports = {
  app: {
    files: {
      'build/mobile.min.js': [
        'build/mobile.js'
      ]
    }
  },
  bookmarklet: {
    files: {
      'build/bookmarklet.min.js': ['src/bookmarklet/*.js']
    }
  }
};
