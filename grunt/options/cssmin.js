/* grunt-contrib-cssmin */

/*jshint camelcase: false*/
/*jscs: disable requireCamelCaseOrUpperCaseIdentifiers */

module.exports = {
  add_banner: {
    files: {
      'build/mobile.min.css': [
        'src/mobile/*.css'
      ]
    }
  }
};
