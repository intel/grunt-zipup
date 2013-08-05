<a name="0.1.5"></a>
### 0.1.5 (2013-08-05)

*   Fixed a bug where the multitask was not executing
    because the callback was not being invoked.

<a name="0.1.4"></a>
### 0.1.4 (2013-08-05)

*   Fix issues where zip files were occasionally corrupted
    because streams reading from the files into the output
    zip were not being appended correctly.

<a name="0.1.3"></a>
### 0.1.3 (2013-08-02)

*   Replace adm-zip with node-archiver

    adm-zip has a bug which corrupts the zip file for certain
    png files (possibly other file types too):
    https://github.com/cthackers/adm-zip/issues/57

    Added tests which check the generated zip file can be
    extracted, and that it contains the correct content.

<a name="0.1.2"></a>
### 0.1.2 (2013-07-19)

*   Use grunt-release to automatically push releases

<a name="0.1.1"></a>
### 0.1.1 (2013-07-19)

*   Remove need for global mocha installation

*   travis-ci integration

<a name="0.1.0"></a>
### 0.1.0 (2013-07-08)

*   Initial release
