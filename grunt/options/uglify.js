/* grunt-contrib-uglify */

module.exports = {
  app: {
    files: {
      'build/sgp.mobile.min.js': [
        'build/sgp.mobile.js'
      ]
    }
  },
  bookmarklet: {
    files: {
      'build/sgp.bookmarklet.min.js': ['src/bookmarklet/sgp.bookmarklet.js']
    }
  }
};
