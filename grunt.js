/*
 * SuperGenPass
 * http://supergenpass.com/
 */

module.exports = function(grunt) {

  grunt.initConfig({

    meta: { name: 'SuperGenPass' },

    build: {
      js: 'build/sgp.js',
      css: 'css/sgp.css',
      files: ['index.html', 'sgp.appcache'],
      src: 'app/',
      dest: 'build/'
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
        dest: 'build/sgp.js'
      }
    }

  });

  grunt.registerTask('build', 'Generate self-contained HTML5 app', function() {
    var conf = grunt.config('build');
    conf.files.forEach(function(file) {
      grunt.file.write(conf.dest + file, grunt.template.process(grunt.file.read(conf.src + file), conf));
    });
  });

  grunt.registerTask('default', 'min build');

};
