/* Bookmarklet task */

'use strict';

var bookmarkleter = require('bookmarkleter');

module.exports = function (grunt) {

  var description = 'Generate a bookmarklet from JavaScript code.';

  grunt.registerMultiTask('bookmarklet', description, function () {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      anonymize: true,
      urlencode: true,
      mangleVars: true,
      jQuery: false
    });

    // File exists helper.
    var fileExists = function (filepath) {
      if (grunt.file.exists(filepath)) {
        return true;
      } else {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      }
    };

    // Read and return the file's source.
    var readFile = function (filepath) {
      return (fileExists(filepath)) ? grunt.file.read(filepath) : '';
    };

    this.files.forEach(function (file) {

      // Load files and create bookmarklet.
      var contents = file.src.map(readFile).join('');
      var bookmarklet = bookmarkleter(contents, options);

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, bookmarklet);
      grunt.log.writeln('Bookmarklet: ' + file.dest);

    });

  });

};
