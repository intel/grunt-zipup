/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
var AdmZip = require('adm-zip');
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var fileHelper = require('./file.helper');

// get the entries in the zipfile and test zip file name matches
// filenameRegex
var getZipfileEntries = function (zipfileName, filenameRegex, cb) {
  fileHelper(zipfileName, function (err, files) {
    if (err) {
      cb(err);
    }
    else {
      files.length.should.equal(1);
      files[0].should.match(filenameRegex);

      var zipfile = new AdmZip(files[0]);

      var entries = _.map(zipfile.getEntries(), function (entry) {
        return entry.entryName;
      });

      cb(null, entries);
    }
  });
};

// get the array of expected filenames
var getExpectedFilenames = function (pattern, stripPrefix, cb) {
  fileHelper(
    pattern,

    // filter which returns only files, with the "test/fixtures"
    // prefix removed and '/' added at the beginning
    function (filename) {
      if (fs.statSync(filename).isFile()) {
        return filename.replace(stripPrefix, '');
      }
      else {
        return null;
      };
    },

    cb
  );
};

// get the file lists in parallel (one from the actual zip file,
// the other from the directory structure being zipped) and compare them
// config.zipfileGlob: glob to find the generated zip file
// config.zipfilenameRegex: regex to compare the generated zip file
// name against
// config.expectedFilesGlob: glob pattern to get the list of files
// expected to be inside the zip file
// config.expectedFilesStripPrefix: prefix to strip from each file
// in the list of files expected inside the zip file (for testing
// the effect of cwd)
// config.expectedFiles: array of expected file names (useful for
// manually constructing a file name array, for cases where the output
// directory structure is going to be different from the input one,
// e.g. where dest is specified)
module.exports = function (config, cb) {
  var zipfileGlob = config.zipfileGlob;
  var zipfilenameRegex = config.zipfilenameRegex;
  var expectedFiles = config.expectedFiles;
  var expectedFilesGlob = config.expectedFilesGlob;
  var expectedFilesStripPrefix = config.expectedFilesStripPrefix;

  async.parallel(
    {
      actual: function (asyncCb) {
        getZipfileEntries(zipfileGlob, zipfilenameRegex, asyncCb);
      },
      expected: function (asyncCb) {
        if (expectedFilesGlob) {
          getExpectedFilenames(expectedFilesGlob, expectedFilesStripPrefix, asyncCb);
        }
        else if (expectedFiles) {
          asyncCb(null, expectedFiles);
        }
        else {
          var msg = 'please specify expectedFiles or ' +
                    '(expectedFilesGlob + expectedFilesStripPrefix)';
          asyncCb(new Error(msg));
        }
      }
    },

    function (err, result) {
      if (err) {
        cb(err);
      }
      else {
        result.actual.sort().should.eql(result.expected.sort());
        result.actual.length.should.equal(result.expected.length);
        cb();
      }
    }
  );
};
