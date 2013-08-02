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
var path = require('path');
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

      // only get files, not directories
      var entries = _.select(zipfile.getEntries(), function (entry) {
        return !entry.isDirectory;
      });

      entries = _.map(entries, function (entry) {
        return entry.entryName;
      });

      cb(null, entries);
    }
  });
};

// unzip a zip file to the specified path and get the filenames
// under that path
var getUnzippedFilenames = function (zipfileName, outDir, cb) {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  fileHelper(zipfileName, function (err, files) {
    if (err) {
      cb(err);
    }
    else {
      files.length.should.equal(1);

      var zipfile = new AdmZip(files[0]);

      zipfile.extractAllTo(outDir, true);

      // ensure that the outDir always has a trailing '/'
      // so the leading slash is correctly removed from extracted file names
      var stripPrefix = outDir.replace(/\/$/, '') + '/';

      getExpectedFilenames(path.join(outDir, '**'), stripPrefix, cb);
    }
  });
};

// get the array of expected filenames
var getExpectedFilenames = function (pattern, stripPrefix, cb) {
  fileHelper(
    pattern,

    // filter which returns only files, with the stripPrefix removed
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
// config.zipfileExtract: location to extract zip file to
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
  var zipfileExtractDir = config.zipfileExtractDir;
  var expectedFiles = config.expectedFiles;
  var expectedFilesGlob = config.expectedFilesGlob;
  var expectedFilesStripPrefix = config.expectedFilesStripPrefix;

  var expectedFilesList = function (asyncCb) {
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
  };

  async.parallel(
    {
      actualEntries: function (asyncCb) {
        getZipfileEntries(zipfileGlob, zipfilenameRegex, asyncCb);
      },

      actualUnzipped: function (asyncCb) {
        getUnzippedFilenames(zipfileGlob, zipfileExtractDir, asyncCb);
      },

      expected: expectedFilesList
    },

    function (err, result) {
      if (err) {
        cb(err);
      }
      else {
        result.actualEntries.sort().should.eql(result.expected.sort());
        result.actualEntries.length.should.equal(result.expected.length);
        result.actualUnzipped.sort().should.eql(result.expected.sort());
        result.actualUnzipped.length.should.equal(result.expected.length);
        cb();
      }
    }
  );
};
