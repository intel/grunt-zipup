module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mochaccino');
  grunt.loadTasks('tasks');

  grunt.initConfig({
    jshint: {
      all: ['tasks/**'],

      // see http://jshint.com/docs/
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        forin: true,
        immed: true,
        indent: 2,
        noempty: true,
        quotmark: 'single',

        undef: true,
        globals: {
          'require': false,
          'module': false,
          'process': false,
          '__dirname': false,
          'console': false
        },

        unused: true,
        browser: true,
        strict: true,
        trailing: true,
        maxdepth: 2,
        newcap: false
      }
    },

    // the tasks below are used to test _this_ plugin
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

  grunt.registerTask('default', [
    'jshint',
    'clean',
    'zipup',
    'mochaccino:all'
  ]);
};
