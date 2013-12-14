/* Checksum options */

module.exports = {
  app: {
    options: {
      basepath: 'build/'
    },
    src: [
      'build/index.html',
      'build/sgp.bookmarklet.js'
    ],
    dest: 'build/checksums.json'
  }
};
