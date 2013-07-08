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

## Options

### appName

type: string, mandatory

The name of the application; used as the base filename for the zip file.

### files

type: grunt files object, mandatory

Specifies which files to include in the output zip file. See http://gruntjs.com/configuring-tasks#files for details of the supported formats. Some examples:

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

        build/TheMightyApp_0.1.0_git@81a131a2_2013-07-05_133951.wgt
