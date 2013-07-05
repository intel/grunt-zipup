module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mochaccino');
  grunt.loadTasks('tasks');

  grunt.initConfig({
    // these tasks are used to test _this_ plugin
    clean: ['build'],

    zipup: {
      tizen_tiny_app_wgt: {
        appName: 'tizen-tiny-app',
        suffix: 'wgt',
        version: '0.1.0',
        files: 'test/fixtures/tizen-tiny-app/**',
        stripPrefix: 'test/fixtures',
        outDir: 'build'
      }
    },

    mochaccino: {
      all: {
        files: { src: 'test/*.test.js' },
        reporter: 'dot'
      }
    }
  });

  grunt.registerTask('test', [
    'clean',
    'zipup',
    'mochaccino:all'
  ]);

  grunt.registerTask('default', 'test');
};
