/* grunt-manifest */

module.exports = {
  generate: {
    options: {
      basePath: 'mobile/',
      network: ['*'],
      verbose: true,
      timestamp: true
    },
    src: [
      'index.html'
    ],
    dest: 'mobile/cache.manifest'
  }
};
