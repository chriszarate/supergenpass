/* Bookmarklet task */

module.exports = function(grunt) {

  var description = 'Generate a bookmarklet from JavaScript code.';

  grunt.registerMultiTask('bookmarklet', description, function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      anonymize: true,
      urlencode: true
    }),

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

      // Wrap in anonymous function.
      if(options.anonymize) {
        contents = '(function(){' + contents + '})()';
      }

      // Encode as URI.
      if(options.urlencode) {
        contents = encodeURI(contents);
      }

      // Add javascript protocol.
      contents = 'javascript:' + contents;

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, contents);
      grunt.log.writeln('Bookmarklet: ' + file.dest);

    });

  });

};
