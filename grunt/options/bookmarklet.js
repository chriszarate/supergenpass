/* Bookmarklet options */

module.exports = {
  app: {
    options: {
      anonymize: false,
      urlencode: true
    },
    files: {
      'build/sgp.bookmarklet.js': ['build/sgp.js']
    }
  }
};
