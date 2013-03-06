/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: {
      name: 'SuperGenPass',
      hostedURL: 'https://mobile.supergenpass.com/sgp.js'
    },

    jshint: {
      all: ['js/sgp*.js']
    },

    uglify: {
      app: {
        files: {
          'build/app.js': [
            'js/jquery.custom.js',
            'js/jquery.jstorage.js',
            'js/jquery.identicon5.js',
            'js/sgp.hash.js',
            'js/sgp.core.js',
            'js/sgp.form.js'
          ]
        }
      },
      bookmarklet: {
        files: {
          'build/sgp.js': ['js/sgp.js'],
          'build/sgp.bookmarklet.js': ['js/sgp.bookmarklet.js']
        }
      }
    },

    app: {
      all: {
        options: {
          isTemplate: true,
          data: {
            js: 'build/app.js',
            css: 'css/sgp.css'
          }
        },
        files: {
          'build/index.html': ['app/index.html'],
          'build/sgp.appcache': ['app/sgp.appcache']
        },
      }
    },

    bookmarklet: {
      all: {
        options: { isTemplate: true },
        files: {
          'build/sgp.bookmarklet.js': ['build/sgp.bookmarklet.js']
        }
      }
    }

  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerMultiTask('app', 'Generate self-contained HTML5 app', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      isTemplate: false
    });

    this.files.forEach(function(file) {

      // From Grunt.js API documentation.
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read and return the file's source.
        return grunt.file.read(filepath);
      }).join('');

      // Process as template.
      if(options.isTemplate) contents = grunt.template.process(contents, {data:options.data});

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, contents);
      grunt.log.writeln('Created file: ' + file.dest);

    });

    // One-off deletion.
    grunt.file.delete(options.data.js);
    grunt.log.writeln('Deleted file: ' + options.data.js);

  });

  grunt.registerMultiTask('bookmarklet', 'Generate bookmarklet', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      anonymize: true,
      isTemplate: false
    });

    this.files.forEach(function(file) {

      // From Grunt.js API documentation.
      var contents = file.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read and return the file's source.
        return grunt.file.read(filepath);
      }).join('');

      // Process script as template.
      if(options.isTemplate) contents = grunt.template.process(contents);

      // Wrap in anonymous function.
      if(options.anonymize) contents = '(function(){;' + contents + ';})()';

      // Encode as URI.
      contents = encodeURI('javascript:' + contents);

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, contents);
      grunt.log.writeln('Created bookmarklet: ' + file.dest);

    });

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'app', 'bookmarklet']);
  grunt.registerTask('build-app', ['jshint', 'uglify:app', 'app']);
  grunt.registerTask('build-bookmarklet', ['jshint', 'uglify:bookmarklet', 'bookmarklet']);

};
