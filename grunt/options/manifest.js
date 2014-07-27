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
      'index.html',
      'ZeroClipboard.swf'
    ],
    dest: 'mobile/cache.manifest'
  }
};
