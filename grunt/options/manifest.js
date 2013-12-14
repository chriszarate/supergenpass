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
      'index.html'
    ],
    dest: 'build/cache.manifest'
  }
};
