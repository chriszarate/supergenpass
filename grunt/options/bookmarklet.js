/* Bookmarklet options */

module.exports = {
  app: {
    options: {
      anonymize: false,
      mangleVars: true,
      urlencode: true
    },
    files: {
      'bookmarklet/bookmarklet.min.js': ['src/bookmarklet/sgp.bookmarklet.js']
    }
  }
};
