/* grunt-contrib-uglify */

module.exports = {
  components: {
    files: {
      'build/components.min.js': [
        'lib/jquery-custom/dist/jquery.js',
        'js/localstorage-polyfill.js',
        'js/identicon5.js'
      ]
    }
  },
  app: {
    files: {
      'build/app.min.js': [
        'js/sgp.hash.js',
        'js/sgp.core.js',
        'js/sgp.form.js'
      ]
    }
  },
  bookmarklet: {
    files: {
      'build/sgp.js': ['js/sgp.js']
    }
  }
};
