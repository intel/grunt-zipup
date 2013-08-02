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

// this test is setup by the zipup:adm_corrupter task
// (see ../Gruntfile.js)
describe('zipup:adm_corrupter', function () {
  it('should correctly pack files into the zip file', function (done) {
    testZipfile(
      {
        zipfileGlob: 'build/adm-corrupter_1.0.0_*.wgt',
        zipfilenameRegex: /adm-corrupter_1.0.0_\d{4}-\d{2}-\d{2}_\d{6}\.wgt/,
        expectedFilesGlob: 'test/fixtures/adm-corrupter/**',
        expectedFilesStripPrefix: 'test/fixtures/adm-corrupter/'
      },
      done
    );
  });
});
