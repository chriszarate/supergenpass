/* Bookmarklet task */

var bookmarkleter = require('bookmarkleter');

module.exports = function(grunt) {

  var description = 'Generate a bookmarklet from JavaScript code.';

  grunt.registerMultiTask('bookmarklet', description, function() {

    // File exists helper.
    fileExists = function(filepath) {
      if(grunt.file.exists(filepath)) {
        return true;
      } else {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      }
    },

    // Read and return the file's source.
    readFile = function(filepath) {
      return grunt.file.read(filepath);
    };

    this.files.forEach(function(file) {

      // Load files.
      var contents = file.src.map(readFile).join('');

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, bookmarkleter(contents, this.options));
      grunt.log.writeln('Bookmarklet: ' + file.dest);

    });

  });

};
