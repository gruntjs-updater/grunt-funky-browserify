/*
 * grunt-funky-browserify
 * https://github.com/davemedema/grunt-funky-browserify
 *
 * Copyright (c) 2013 Dave Medema
 * Licensed under the MIT license.
 */

'use strict';

var browserify = require('browserify');
var fs         = require('fs');
var path       = require('path');

module.exports = function(grunt) {

  function failed(message, error) {
    if (error) grunt.log.error(error);
    grunt.fail.warn(message || 'Task failed.');
  }

  grunt.registerMultiTask('funky_browserify', function() {
    var opts = this.options({
      entryFile: 'js/app/app.js',
      modulesDir: 'js/modules'
    });

    var bundle    = browserify();
    var bundleSrc = '';
    var done      = this.async();
    var root      = path.resolve();

    // Loop through file mappings
    this.files.forEach(function(fileMapping) {
      // Validate src files
      var srcFiles = fileMapping.src.filter(function(filepath) {
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });

      // Concat libs
      srcFiles.forEach(function(filepath) {
        bundleSrc += grunt.file.read(filepath) + '\n\n';
      });

      // Modules
      var modulesDir = root + '/' + opts.modulesDir;
      var modules = fs.readdirSync(modulesDir);
      modules.forEach(function(filepath) {
        if (path.extname(filepath) === '.js') {
          var fullpath = modulesDir + '/' + filepath;
          bundle.require(fullpath, {expose: path.basename(filepath, '.js')});
        }
      });

      // Entry
      var entry = root + '/' + opts.entryFile;
      bundle.add(entry);

      // Bundle and write
      bundle.bundle(function(err, src) {
        if (err) throw err;
        bundleSrc += src;
        grunt.file.write(fileMapping.dest, bundleSrc);
        done();
      });
    });
  });

};
