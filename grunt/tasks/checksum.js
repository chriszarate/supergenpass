/* Checksum task */

'use strict';

module.exports = function (grunt) {

  var description = 'Generate checksums for specified files.';

  grunt.registerMultiTask('checksum', description, function () {

    var done = this.async();
    var crypto = require('crypto');
    var fs = require('fs');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      algorithm: 'sha512',
      basepath: false
    });

    // Placeholder for checksums.
    var result = {};

    // Task counter.
    var tasks = this.files.length;

    // Check for basepath.
    var removeBasepath = function (filepath) {
      return (filepath.substring(0, options.basepath.length) === options.basepath) ? filepath.substring(options.basepath.length) : filepath;
    };

    // Generate checksum.
    var checkSum = function (filepath, dest) {
      var shasum = crypto.createHash(options.algorithm);
      var stream = fs.ReadStream(filepath);
      stream.on('data', function (data) {
        shasum.update(data);
      });
      stream.on('end', function () {
        var sum = shasum.digest('hex');
        writeSum(removeBasepath(filepath), dest, sum);
      });
    };

    // Write to checksum file.
    var writeSum = function (src, dest, sum) {
      result[dest].sums[src] = sum;
      if (Object.keys(result[dest].sums).length === result[dest].count) {
        grunt.file.write(dest, JSON.stringify(result[dest].sums));
        grunt.log.writeln('Checksums: ' + dest);
        if (!tasks) {
          done();
        }
        tasks = tasks - 1;
      }
    };

    // Process files.
    this.files.forEach(function (file) {

      // Stash checksum destination in scope.
      var dest = file.dest;

      // Create a placeholder record for this checksum task.
      result[dest] = {
        count: file.src.length,
        sums: {}
      };

      // Loop through each source file.
      file.src.forEach(function (src) {
        checkSum(src, dest);
      });

    });

  });

};
