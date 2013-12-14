/* Checksum task */

module.exports = function(grunt) {

  var description = 'Generate checksums for specified files.';

  grunt.registerMultiTask('checksum', description, function() {

    var done = this.async(),
    crypto = require('crypto'),
    fs = require('fs'),

    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
      algorithm: 'sha512',
      basepath: false
    }),

    // Placeholder for checksums.
    result = {},

    // Task counter.
    tasks = this.files.length,

    // Check for basepath.
    removeBasepath = function(filepath) {
      return (filepath.substring(0, options.basepath.length) === options.basepath) ? filepath.substring(options.basepath.length) : filepath;
    },

    // Generate checksum.
    checkSum = function(filepath, dest) {
      var shasum = crypto.createHash(options.algorithm),
      stream = fs.ReadStream(filepath);
      stream.on('data', function(data) {
        shasum.update(data);
      });
      stream.on('end', function() {
        var sum = shasum.digest('hex');
        writeSum(removeBasepath(filepath), dest, sum);
      });
    },

    // Write to checksum file.
    writeSum = function(src, dest, sum) {
      result[dest].sums[src] = sum;
      if(Object.keys(result[dest].sums).length === result[dest].count) {
        grunt.file.write(dest, JSON.stringify(result[dest].sums));
        grunt.log.writeln('Checksums: ' + dest);
        if(!--tasks) {
          done();
        }
      }
    };

    // Process files.
    this.files.forEach(function(file) {

      // Stash checksum destination in scope.
      var dest = file.dest;

      // Create a placeholder record for this checksum task.
      result[dest] = {
        count: file.src.length,
        sums: {}
      };

      // Loop through each source file.
      file.src.forEach(function(src) {
        checkSum(src, dest);
      });

    });

  });

};
