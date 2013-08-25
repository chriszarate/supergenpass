/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['js/sgp*.js']
    },

    uglify: {
      components: {
        files: {
          'build/components.min.js': [
            'bower_components/jquery/jquery.js',
            'bower_components/jstorage/jstorage.js',
            'js/jquery.identicon5.js'
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

    compile: {
      app: {
        options: {
          include: {
            lib: 'build/components.min.js',
            js: 'build/app.min.js',
            css: 'build/app.min.css'
          }
        },
        files: {
          'build/index.html': ['app/index.html']
        }
      },
      bookmarklet: {
        options: {
          bookmarklet: true
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
    }

  });

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-manifest');

  grunt.registerMultiTask('compile', 'Generate self-contained HTML5 app', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      bookmarklet: false,
      include: {},
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

    // Read file helper.
    readFile = function(filepath) {
      // Read and return the file's source.
      return grunt.file.read(filepath);
    };

    // Load include files into include object.
    Object.keys(options.include).forEach(function(key) {
      var filepath = options.include[key];
      if(fileExists(filepath)) {
        options.include[key] = readFile(filepath)
      } else {
        delete options.include[key];
      }
    });

    this.files.forEach(function(file) {

      // Load files.
      var contents = file.src.filter(fileExists).map(readFile).join('');

      // Process as template.
      contents = grunt.template.process(contents, {data:options.include});

      if(options.bookmarklet) {

        // Wrap in anonymous function.
        contents = '(function(){' + contents + '})()';

        // Encode as URI.
        contents = encodeURI('javascript:' + contents);

      }

      // Write joined contents to destination filepath.
      grunt.file.write(file.dest, contents);
      grunt.log.writeln('Compiled file: ' + file.dest);

    });

  });

  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'compile']);
  grunt.registerTask('build', ['jshint', 'uglify:app', 'cssmin', 'compile:app']);
  grunt.registerTask('bookmarklet', ['jshint', 'uglify:bookmarklet', 'compile:bookmarklet']);
  grunt.registerTask('components', ['uglify:components']);
  grunt.registerTask('css', ['cssmin']);

};
