/*
 * Copyright (c) 2014, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */

// ensure that empty files don't become directories in the
// output zip file;
// this test is setup by the zipup:empty_files task
// (see ../Gruntfile.js)
var path = require('path');
require('chai').should();
var testZipfile = require('./zip_file_test.helper');

// this has to be the same as the value in Gruntfile.js
var fixtureDir = 'build/empty-files-fixture';

describe('zipup:empty_files', function () {
  it('should not create directories for empty files', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/empty-files_1.0.0_*.zip',
        zipfilenameRegex: /empty-files_1.0.0_\d{4}-\d{2}-\d{2}_\d{6}\.zip/,
        expectedFilesGlob: path.join(fixtureDir, '**'),
        expectedFilesStripPrefix: fixtureDir + '/',
        zipfileExtractDir: 'build/empty-files-unzipped',
        includeDirs: true
      },
      done
    );
  });
});
