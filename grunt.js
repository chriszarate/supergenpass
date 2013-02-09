/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: { name: 'SuperGenPass' },

    app: {
      js: 'build/app.js',
      css: 'css/sgp.css',
      files: ['index.html', 'sgp.appcache'],
      src: 'app/',
      dest: 'build/'
    },

    lint: {
      files: ['js/sgp*.js']
    },

    min: {
      dist: {
        src: [
          'js/jquery.custom.js',
          'js/jquery.jstorage.js',
          'js/jquery.identicon5.js',
          'js/sgp.hash.js',
          'js/sgp.core.js',
          'js/sgp.form.js'
        ],
        dest: 'build/app.js'
      },
      bookmarklet: {
        src: ['js/sgp.bookmarklet.js'],
        dest: 'build/sgp.bookmarklet.js'
      },
      loader: {
        src: ['js/sgp.js'],
        dest: 'build/sgp.js'
      },
    }

  });

  grunt.registerTask('app', 'Generate self-contained HTML5 app', function() {
    var conf = grunt.config('app');
    conf.files.forEach(function(file) {
      grunt.file.write(conf.dest + file, grunt.template.process(grunt.file.read(conf.src + file), conf));
      console.log('File "'+conf.dest + file+'" created.');
    });
    //Needs v0.4
    //grunt.file.delete(conf.js);
    //console.log('File "'+conf.js+'" deleted.');
  });

  grunt.registerTask('default', 'lint min app');

};
