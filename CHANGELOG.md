<a name="0.1.3"></a>
### v0.1.3 (2013-08-02)

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
