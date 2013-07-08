/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
module.exports = function (grunt) {
  'use strict';

  var path = require('path');
  var fs = require('fs');
  var async = require('async');
  var AdmZip = require('adm-zip');

  // zipup task definition; see the README.md file for options
  grunt.registerMultiTask(
    'zipup',
    'Zip files with custom zipfile name',
    function (identifier) {
      var appName = this.data.appName;
      var version = this.data.version;

      if (!appName) {
        grunt.fatal('zipup task requires appName argument');
      }

      if (!version) {
        grunt.fatal('zipup task requires version argument (x.x.x)');
      }

      var suffix = this.data.suffix || 'zip';
      var outDir = this.data.outDir || '.';
      var addGitCommitId = !!this.data.addGitCommitId;

      // files to be added
      var files = this.files;

      // ensure outDir exists and make it if not
      if (grunt.file.exists(outDir)) {
        if (!grunt.file.isDir(outDir)) {
          grunt.fatal('cannot use ' + outDir + ' as outDir because ' +
                      'file already exists and is not a directory');
        }
      }
      else {
        grunt.file.mkdir(outDir);
      }

      var done = this.async();

      var outFile = appName;

      // get the latest commit ID as an 8-character string;
      // if not a git repo, returns '' and logs an error;
      // receiver is a function with the signature receiver(err, result),
      // where err is null if no error occurred and result is the commit ID
      var gitCommitId = function (receiver) {
        grunt.util.spawn(
          {
            cmd: 'git',
            args: ['log', '-n1', '--format=format:\'%h\'']
          },

          function (err, result) {
            if (err) {
              receiver(true, '');
            }
            else {
              receiver(null, result.stdout.replace(/'/g, ''));
            }
          }
        );
      };

      var isFile = function (path) {
        if (!fs.existsSync(path) || fs.statSync(path).isDirectory()) {
          return false;
        }

        return true;
      };

      // infiles is a grunt files object: an array with objects
      // which map from src to dest
      var packFiles = function (outfile, infiles, cb) {
        var zipfile = new AdmZip();
        var buffer;

        async.forEachSeries(
          infiles,
          function (file, next) {
            var src = file.src[0];
            var dest = file.dest || src;

            if (isFile(src)) {
              grunt.log.writeln('adding ' + src + ' to package as ' + dest);

              buffer = fs.readFileSync(src);

              zipfile.addFile(dest, buffer);

              next();
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
              zipfile.writeZip(outfile);
              cb();
            }
          }
        );
      };

      var receiver = function (err, result) {
        if (version) {
          outFile += '_' + version;
        }

        if (result) {
          outFile += '_git@' + result;
        }

        outFile += '_' + grunt.template.today('yyyy-mm-dd_HHMMss');

        if (identifier) {
          outFile += '_' + identifier;
        }

        outFile += '.' + suffix.replace(/^\./, '');
        outFile = path.join(outDir, outFile);

        packFiles(outFile, files, done);
      };

      // append git commit ID to the package name
      if (addGitCommitId) {
        gitCommitId(receiver);
      }
      else {
        receiver(false, null);
      }
    }
  );
};
