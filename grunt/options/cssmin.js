/* grunt-contrib-cssmin */

module.exports = {
  add_banner: {
    files: {
      'build/mobile.min.css': [
        'src/mobile/*.css'
      ]
    }
  }
};
