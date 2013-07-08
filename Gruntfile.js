/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');
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

    release: {
      options: {
        add: false,
        commit: false,
        push: false,

        bump: true,
        tag: true,
        pushTags: true,
        npm: true,
        folder: '.',
        tagName: '<%= version %>',
        tagMessage: 'Version <%= version %>'
      }
    },

    // the tasks below are used to test _this_ plugin
    clean: ['build'],

    zipup: {
      tizen_tiny_app_wgt: {
        appName: 'tizen-tiny-app',
        suffix: 'wgt',
        version: '0.1.0',
        files: [
          {
            cwd: 'test/fixtures',
            expand: true,
            src: 'tizen-tiny-app/**'
          }
        ],
        outDir: 'build'
      },

      specific_files: {
        appName: 'specific-files',
        version: '0.2.0',
        files: [
          { src: 'test/fixtures/specific-files/app/lib/test1.js' },
          { src: 'test/fixtures/specific-files/app/lib/test2.js' },
          { src: 'test/fixtures/specific-files/app/src/test3.js' },
          { src: 'test/fixtures/specific-files/app/src/test4.js' }
        ],
        outDir: 'build'
      },

      commit_id: {
        appName: 'commit-id',
        version: '0.3.0',
        addGitCommitId: true,
        files: [
          { src: 'test/fixtures/specific-files/**', expand: true }
        ],
        outDir: 'build'
      },

      custom_dest: {
        appName: 'custom-dest',
        version: '0.4.0',
        files: [
          {
            cwd: 'test/fixtures/specific-files/app',
            src: '**',
            expand: true,
            dest: 'custom_dest_app'
          }
        ],
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

  grunt.registerTask('test', ['clean', 'zipup', 'mochaccino']);
  grunt.registerTask('default', ['jshint', 'test']);
};
