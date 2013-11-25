/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      app: ['js/sgp*.js'],
      tests: ['test/*.js']
    },

    qunit: {
      app: ['test/*.html']
    },

    uglify: {
      components: {
        files: {
          'build/components.min.js': [
            'lib/jquery-custom/dist/jquery.js',
            'js/localstorage-polyfill.js',
            'js/identicon5.js'
          ]
        }
      },
      app: {
        files: {
          'build/app.min.js': [
            'js/sgp.hash.js',
            'js/sgp.core.js',
            'js/sgp.form.js'
          ]
        }
      },
      bookmarklet: {
        files: {
          'build/sgp.js': ['js/sgp.js']
        }
      }
    },

    cssmin: {
      add_banner: {
        files: {
          'build/app.min.css': [
            'app/app.css'
          ]
        }
      }
    },

    staticinline: {
      app: {
        files: {
          'build/index.html': 'app/index.html'
        }
      }
    },

    bookmarklet: {
      app: {
        options: {
          anonymize: false,
          urlencode: true
        },
        files: {
          'build/sgp.bookmarklet.js': ['build/sgp.js']
        }
      }
    },

    manifest: {
      generate: {
        options: {
          basePath: 'build/',
          network: ['*'],
          verbose: true,
          timestamp: true
        },
        src: [
          'index.html'
        ],
        dest: 'build/cache.manifest'
      }
    },

    checksum: {
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
    }

  }),

  grunt.registerMultiTask('bookmarklet', 'Generate a bookmarklet from JavaScript code', function() {

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

  grunt.registerMultiTask('checksum', 'Generate checksums', function() {

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

  grunt.registerTask('default', ['jshint', 'uglify:app', 'uglify:bookmarklet', 'qunit', 'cssmin', 'staticinline', 'bookmarklet', 'manifest', 'checksum']);
  grunt.registerTask('components', ['uglify:components']);
  grunt.registerTask('test', ['jshint:tests', 'qunit']);

};
