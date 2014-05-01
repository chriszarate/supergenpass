/* grunt-manifest */

module.exports = {
  generate: {
    options: {
      basePath: 'dist/',
      network: ['*'],
      verbose: true,
      timestamp: true
    },
    src: [
      'mobile.html'
    ],
    dest: 'dist/mobile/cache.manifest'
  }
};
