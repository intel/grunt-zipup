# grunt-zipup

grunt plugin to zip a directory into a zip file with customisable/automatic package name and suffix.

# License

Apache version 2. See the LICENSE file for more details.

# Getting started

Format of the output filename is:

    <appName>_<version>_git@<commitID>_YYYY-MM-DD_HHMMSS_<suffix>.zip

The git and suffix parts are optional (see below for
configuration).

# zipup task

## Options

Note that it can be useful to set some of the zipup options from your <em>package.json</em>. For example, your <em>Gruntfile.js</em> might look like this:

    grunt.initConfig({
      packageInfo: grunt.file.readJSON('package.json'),

      // ... more config ...

      zipup: {
        wgt: {
          // set appName and version from package.json
          appName: '<%= packageInfo.name %>',
          version: '<%= packageInfo.version %>',

          suffix: 'wgt',
          addGitCommitId: true,
          files: 'build/dist/**',
          stripPrefix: 'build/dist',
          outDir: 'build'
        }
      }
    });

### appName

type: string, mandatory

The name of the application; used as the base filename for the zip file.

### files

type: string, mandatory

File glob to select the files to zip.

For example, to zip the content of the build/package directory:

    files: 'build/package/**'

### version

type: string, mandatory

Application version.

#### suffix

type: string, default: 'zip'

The suffix for the zip file. Don't include the dot.

### outDir

type: string, default: '.'

Output directory to put the zipfile into.

### stripPrefix

type: string, default: ''

If files selects a set of directories with a hierarchy inside it, specify the prefix to strip from all paths, to remove the embedded directories.

For example, if you are using the file glob <em>build/package/**</em> and want the structure of the output zip file to match the structure under the <em>build/package</em> directory, you would do:

    stripPrefix: 'build/package'

### addGitCommitId

type: boolean, default: false

If the project is a git repo, set this to <code>true</code> to include the 8 character variant of the last commit ID as part of the filename.

For example, an output filename for <code>appName</code> "myapp" may look like:

    myapp_git@81a131a2_2012-11-01_1151.zip

NB this requires that the <code>git</code> command be in your path.

# Full example

    grunt.initConfig({
      zipup: {
        wgt: {
          appName: 'TheMightyApp',
          suffix: 'wgt',
          version: '0.1.0',
          addGitCommitId: true,
          files: 'build/dist/**',
          stripPrefix: 'build/dist',
          outDir: 'build'
        }
      }
    });

In this example, we zip up the files matching <em>build/dist/**</em>. Inside the zip file, entries have the "build/dist" prefix stripped, so the zip file structure matches the structure under the <em>build/dist</em> directory. The output zipfile name also contains the latest git commit ID and has the suffix "wgt". It is written to the <em>build/</em> directory.

An example of the output filenames produced by this configuration might be:

    build/TheMightyApp_0.1.0_git@81a131a2_2013-07-05_133951.wgt
