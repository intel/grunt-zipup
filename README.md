# grunt-zipup

grunt plugin to zip a directory into a zip file with customisable/automatic package name and suffix.

# License

Apache version 2. See the LICENSE file for more details.

# Getting started

grunt-zipup has been tested on:

*   Fedora 17 Linux (64bit)

*   Windows 7 Enterprise (64bit)

You need **Grunt ~0.4.1**.

Install the grunt-zipup plugin in your project with:

    npm install grunt-zipup --save-dev

Then add a line to your <em>Gruntfile.js</em> near the top:

    module.exports = function (grunt) {
      grunt.loadNpmTasks('grunt-zipup');

      // ... rest of your grunt config ...
    };

See the next section for options.

# zipup task

The zipup task produces an output zip file with a filename in the format:

    <appName>_<version>_git@<abbreviated commit ID>_YYYY-MM-DD_HHMMSS_<suffix>.zip

The git and suffix parts are optional (see below for configuration).

## Options

### appName

type: string, mandatory

The name of the application; used as the base filename for the zip file.

### files

type: grunt files object, mandatory

Specifies which files to include in the output zip file. See [grunt's API docs](http://gruntjs.com/configuring-tasks#files) for details of the supported formats.

Some examples:

*   Add three specific files to the zip file:

        files: [
          { src: 'src/app.js' },
          { src: 'src/data-adapter.js' },
          { src: 'src/ui.js' }
        ]

    Note that in this case, the destination file name in the zip file will match the source file name, including its parent directory hierarchy.

*   Add all files under the <em>app/src</em> and <em>app/lib</em> directories, retaining the original paths to the matching files:

        file: [
          { src: 'app/src/**, expand: true },
          { src: 'app/src/**, expand: true },
        ]

*   Zip all files inside the <em>app/src</em> and <em>app/lib</em> directories, keeping the same hierarchy in the zip file as is under those directories:

        files: [
          { cwd: 'app/src', src: '**', expand: true },
          { cwd: 'app/lib', src: '**', expand: true }
        ]

    Note how the <code>cwd</code> option is set so that the file paths used in the zip file are relative to those paths.

*   Zip all files inside a directory, specifying a different output directory structure in the zip file:

        files: [
          { cwd: 'app/src', src: '**', expand: true, dest: 'src' },
          { cwd: 'app/lib', src: '**', expand: true, dest: 'lib' }
        ]

    If there is a file <em>app/src/main.js</em> in the project, this is translated to <em>src/main.js</em> in the output zip file.

### version

type: string, mandatory

Application version.

### suffix

type: string, default: 'zip'

The suffix for the zip file. Don't include the dot.

### outDir

type: string, default: '.'

Output directory to put the zipfile into.

### addGitCommitId

type: boolean, default: false

If the project is a git repo, set this to <code>true</code> to include the 7 character variant of the last commit ID as part of the filename.

For example, an output filename for <code>appName</code> "myapp" may look like:

    myapp_git@4f7fe3f_2012-11-01_1151.zip

NB this requires that the <code>git</code> command be in your path.

# Tips

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
          files: [
            {
              cwd: 'build/dist',
              expand: true,
              src: '**'
            }
          ],
          outDir: 'build'
        }
      }
    });

# Full example

    grunt.initConfig({
      zipup: {
        wgt: {
          appName: 'TheMightyApp',
          suffix: 'wgt',
          version: '0.1.0',
          addGitCommitId: true,
          files: [
            {
              cwd: 'build/dist',
              src: '**',
              expand: true
            }
          ],
          outDir: 'build'
        }
      }
    });

In this example, the zip file will be constructed as follows:

*   Files files matching <em>**</em> under the <em>build/dist</em> directory are added to the zip file.

*   Inside the zip file, entries have the "build/dist" prefix stripped (as the <code>cwd</code> option is set); this means that the zip file structure will match the structure under the <em>build/dist</em> directory.

*   The output zipfile name also contains the latest git commit ID and has the suffix "wgt".

*   The zip file is written to the <em>build/</em> directory. An example of the output filenames produced by this configuration might be:

        build/TheMightyApp_0.1.0_git@41513f9_2013-07-05_133951.wgt

# Contributing

Please log issues on the [github issue tracker](https://github.com/01org/grunt-zipup/issues) for the project.

New features or bug fixes are welcome, and should be submitted as a pull request against the <em>master</em> branch of the project.

Please note that any changes you make should be accompanied by tests and documentation, and should not break the existing tests. You should also ensure that you run the <code>grunt jshint</code> task before submitting, to ensure that your code is lint free.

Note that the tests for the project require grunt-mochaccino to run. Install it and its dependencies the usual way:

    npm install .

grunt-mochaccino requires a global installation of mocha:

    npm install -g mocha

You can run the project tests with:

    grunt test
