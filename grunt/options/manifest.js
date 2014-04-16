/* grunt-manifest */

module.exports = {
  generate: {
    options: {
      basePath: 'build/',
      network: ['*'],
      verbose: true,
      timestamp: true
    },
    src: [
      'mobile.html'
    ],
    dest: 'build/cache.manifest'
  }
};
