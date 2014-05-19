/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
var path = require('path');

module.exports = function (grunt) {
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-release');
  grunt.loadNpmTasks('grunt-mochaccino');
  grunt.loadTasks('tasks');

  var fixtureDir = './build/empty-files-fixture';

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
        add: true,
        commit: true,
        push: true,

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
      },

      custom_template: {
        appName: 'custom-template',
        version: '0.5.0',
        datetime: grunt.template.today('yyyymm'),
        addGitCommitId: true,
        outDir: 'build',
        template: '{{appName}}_{{version}}_{{datetime}}_git@{{gitCommit}}_{{purpose}}.zip',
        purpose: 'QA',
        files: [
          { src: 'test/fixtures/specific-files/**', expand: true }
        ]
      },

      adm_corrupter: {
        appName: 'adm-corrupter',
        suffix: 'wgt',
        version: '1.0.0',
        files: [
          {
            cwd: 'test/fixtures/adm-corrupter',
            expand: true,
            src: '**'
          }
        ],
        outDir: 'build'
      },

      empty_files: {
        appName: 'empty-files',
        suffix: 'zip',
        version: '1.0.0',
        files: [
          {
            cwd: fixtureDir,
            expand: true,
            src: '**'
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

  // set up fixtures for testing which cannot be added to the repo,
  // e.g. zipping empty files
  grunt.registerTask('setup-fixtures', function () {
    if (grunt.file.exists(fixtureDir)) {
      grunt.file.delete(fixtureDir);
    }

    grunt.file.mkdir(fixtureDir);

    // add one file with content
    var nonEmptyFile = path.join(fixtureDir, 'CONTENT');
    grunt.file.write(nonEmptyFile, 'I am not empty');

    // add two empty files; we do this here as empty files won't
    // be included in git commits
    var emptyFile1 = path.join(fixtureDir, 'EMPTY-FILE-1');
    var emptyFile2 = path.join(fixtureDir, 'EMPTY-FILE-2');
    grunt.file.write(emptyFile1, '');
    grunt.file.write(emptyFile2, '');
  });

  grunt.registerTask('print-data-for-target', function () {
    grunt.log.ok('Printing data for the zipup commit_id target');
    grunt.log.write(JSON.stringify(grunt.zipup.commit_id, null, 2));
  });

  grunt.registerTask('test', ['clean', 'setup-fixtures', 'zipup', 'mochaccino', 'print-data-for-target']);
  grunt.registerTask('default', ['jshint', 'test']);
};
