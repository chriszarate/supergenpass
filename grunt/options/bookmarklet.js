/* Bookmarklet options */

module.exports = {
  app: {
    options: {
      anonymize: false,
      urlencode: true
    },
    files: {
      'dist/bookmarklet/bookmarklet.min.js': ['build/bookmarklet.min.js']
    }
  }
};
