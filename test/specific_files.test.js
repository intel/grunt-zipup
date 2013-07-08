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

// this test is setup by the zipup:specific_files task
// (see ../Gruntfile.js)
describe('zipup:specific_files', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/specific-files_0.2.0_*.zip',
        zipfilenameRegex: /specific-files_0.2.0_\d{4}-\d{2}-\d{2}_\d{6}\.zip/,
        expectedFilesGlob: 'test/fixtures/specific-files/**',
        expectedFilesStripPrefix: ''
      },
      done
    );
  });
});
