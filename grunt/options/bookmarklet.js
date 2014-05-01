/* Bookmarklet options */

module.exports = {
  app: {
    options: {
      anonymize: false,
      urlencode: true
    },
    files: {
      'dist/bookmarklet/sgp.bookmarklet.min.js': ['build/sgp.bookmarklet.min.js']
    }
  }
};
