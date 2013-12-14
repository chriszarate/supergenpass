/* grunt-contrib-cssmin */

module.exports = {
  add_banner: {
    files: {
      'build/app.min.css': [
        'app/app.css'
      ]
    }
  }
};
