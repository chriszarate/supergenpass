/* Checksum options */

module.exports = {
  app: {
    options: {
      basepath: 'dist/'
    },
    src: [
      'dist/mobile/index.html',
      'dist/bookmarklet/sgp.bookmarklet.min.js'
    ],
    dest: 'dist/checksums.json'
  }
};
