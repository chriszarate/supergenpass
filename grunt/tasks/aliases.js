/* Grunt task aliases */

module.exports = function(grunt) {

  grunt.registerTask(
    'default',
    [
      'jshint',
      'uglify:app',
      'uglify:bookmarklet',
      'qunit',
      'cssmin',
      'staticinline',
      'bookmarklet',
      'manifest',
      'checksum'
    ]
  );

  grunt.registerTask('components', ['uglify:components']);
  grunt.registerTask('test', ['jshint:tests', 'qunit']);

};
