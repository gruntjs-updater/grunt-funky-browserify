'use strict';

module.exports = function(grunt) {

  // Config
  // ---

  grunt.initConfig({

    // package.json
    pkg: grunt.file.readJSON('package.json'),

    // `browserify`
    browserify: {
      test: {
        options: {
          entryFile: 'test/fixtures/app/app.js',
          modulesDir: 'test/fixtures/modules'
        },
        src: [
          'test/fixtures/libs/foo.js',
          'test/fixtures/libs/bar.js'
        ],
        dest: 'tmp/test.js'
      }
    },

    // `clean`
    clean: {
      all: ['tmp']
    },

    // `jshint`
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.files %>'
      ]
    },

    // `nodeunit`
    nodeunit: {
      files: ['test/**/*_test.js']
    }

  });

  // Load tasks
  // ---

  grunt.loadTasks('tasks');

  // npm tasks
  // ---

  require('load-grunt-tasks')(grunt);

  // Task aliases
  // ---

  grunt.registerTask('default', ['test']);

  grunt.registerTask('release', function(type) {
    grunt.task.run('test');
    grunt.task.run('bump:' + (type || 'patch'));
    grunt.task.run('tag');
  });

  grunt.registerTask('test', ['clean', 'jshint', 'browserify', 'nodeunit']);
  grunt.registerTask('t', ['test']);

};
