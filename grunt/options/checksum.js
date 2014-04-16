/* Checksum options */

module.exports = {
  app: {
    options: {
      basepath: 'build/'
    },
    src: [
      'build/mobile.html',
      'build/sgp.bookmarklet.js'
    ],
    dest: 'build/checksums.json'
  }
};
