/* grunt-static-inline */

module.exports = {
  app: {
    options: {
      basepath: './'
    },
    files: {
      'mobile/index.html': 'src/mobile/index.html'
    }
  }
};
