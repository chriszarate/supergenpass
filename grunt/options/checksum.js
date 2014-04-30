/* Checksum options */

module.exports = {
  app: {
    options: {
      basepath: 'dist/'
    },
    src: [
      'dist/mobile.html',
      'dist/sgp.bookmarklet.min.js'
    ],
    dest: 'dist/checksums.json'
  }
};
