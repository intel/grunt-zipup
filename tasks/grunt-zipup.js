/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
var zip = require('./lib/zip');

module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var async = require('async');
  var Mustache = require('mustache');
  var exec = require('child_process').exec;

  // get the latest commit ID as an 8-character string;
  // if not a git repo, returns '' and logs an error;
  // receiver is a function with the signature receiver(err, result),
  // where err is null if no error occurred and result is the commit ID
  var gitCommitId = function (cb) {
    exec('git log -n1 --format=format:\'%h\'', function (err, stdout) {
      if (err) {
        cb(err);
      }
      else {
        var commitId = stdout.replace(/'/g, '');
        cb(null, commitId);
      }
    });
  };

  // returns true if path exists and is not a directory
  var isFile = function (path) {
    if (fs.existsSync(path) && !fs.statSync(path).isDirectory()) {
      return true;
    }
    return false;
  };

  // returns true if path exists and is a directory
  var isDirectory = function (path) {
    if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
      return true;
    }
    return false;
  };

  // files is a grunt files object: an array with objects
  // which map from src to dest
  var packFiles = function (data, files, cb) {
    var outDir = data.outDir;
    var zipfilename = Mustache.render(data.template, data);
    var outfile = path.join(outDir, zipfilename);

    // store the output zip file name on the task data
    data.outfile = outfile;

    var zipfile = zip.create(outfile);

    async.each(
      files,

      function (file, next) {
        var src = file.src[0];
        var dest = file.dest || src;

        if (isFile(src)) {
          grunt.log.writeln('adding file ' + src + ' to package as ' + dest);
          zipfile.addFile(src, dest, next);
        }
        // screen out the '.' directory to avoid a spurious entry
        else if (isDirectory(src) && dest !== '.') {
          grunt.log.writeln('adding directory ' + src + ' to package as ' + dest);
          zipfile.addDirectory(dest, next);
        }
        else {
          next();
        }
      },

      function (err) {
        if (err) {
          grunt.fatal(err.message);
        }
        else {
          grunt.log.writeln('\npackage written to:\n' + outfile);
          zipfile.writeToFile(cb);
        }
      }
    );
  };

  // zipup task definition; see the README.md file for options
  grunt.registerMultiTask(
    'zipup',
    'Zip files with custom zipfile name',
    function (identifier) {
      // store the task details on the grunt.zipup object,
      // keyed by the target name
      grunt.zipup = grunt.zipup || {};
      grunt.zipup[this.target] = this.data;

      var done = this.async();

      // default template for the filename
      var defaultTemplate = '{{appName}}_{{version}}_' +
                            '{{#gitCommit}}' +
                            'git@{{gitCommit}}_' +
                            '{{/gitCommit}}' +
                            '{{datetime}}{{identifier}}.{{suffix}}';

      // set defaults for task options if not present
      var data = this.data;

      data.identifier = (identifier ? '_' + identifier : '');

      data.datetime = data.datetime ||
                      grunt.template.today('yyyy-mm-dd_HHMMss');

      data.suffix = data.suffix || 'zip';
      data.suffix = data.suffix.replace(/^\./, '');

      data.outDir = data.outDir || '.';
      data.addGitCommitId = !!data.addGitCommitId;

      // files to be added
      var files = this.files;

      // ensure outDir exists and make it if not
      if (grunt.file.exists(data.outDir)) {
        if (!grunt.file.isDir(data.outDir)) {
          grunt.fatal('cannot use ' + data.outDir + ' as outDir because ' +
                      'file already exists and is not a directory');
        }
      }
      else {
        grunt.file.mkdir(data.outDir);
      }

      // use custom template if defined; NB if this is the case, it's up to
      // the user to ensure that all the required data is present in
      // the zipup task configuration
      // if no custom template set, use the default one
      if (!data.template) {
        // make sure the default template has the data it needs
        if (!data.appName) {
          grunt.fatal('zipup task requires appName argument');
        }

        if (!data.version) {
          grunt.fatal('zipup task requires version argument (x.x.x)');
        }

        // data is OK, so set template to the default
        data.template = defaultTemplate;
      }

      // do we want to use the git commit ID in the template?
      if (data.addGitCommitId) {
        // add the git commit data before generating filename
        gitCommitId(function (err, commit) {
          if (err) {
            done(err);
          }
          else {
            data.gitCommit = commit;
            packFiles(data, files, done);
          }
        });
      }
      else {
        // set an empty git commit ID
        data.gitCommit = null;
        packFiles(data, files, done);
      }
    }
  );
};
