/*
 * Copyright (c) 2013, Intel Corporation.
 *
 * This program is licensed under the terms and conditions of the
 * Apache License, version 2.0.  The full text of the Apache License is at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 */
require('chai').should();
var testZipfile = require('./zip_file_test.helper');

// this test is setup by the zipup:commit_id task
// (see ../Gruntfile.js)
describe('zipup:commit_id', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/commit-id_0.3.0_*.zip',
        zipfilenameRegex: /commit-id_0.3.0_git@[a-z0-9]{7}_\d{4}-\d{2}-\d{2}_\d{6}\.zip/,
        expectedFilesGlob: 'test/fixtures/specific-files/**',
        expectedFilesStripPrefix: ''
      },
      done
    );
  });
});
