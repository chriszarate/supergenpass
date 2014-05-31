/* grunt-manifest */

module.exports = {
  generate: {
    options: {
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
