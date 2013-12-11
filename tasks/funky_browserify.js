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

/**
 * Exports.
 *
 * @param {Object} grunt
 */
module.exports = function(grunt) {

  var utils = require('funky-grunt-utils')(grunt);

  // Register task
  grunt.registerMultiTask('funky_browserify', function() {
    var opts = this.options({
      entryFile: 'js/app/app.js',
      modulesDir: 'js/modules'
    });

    var bundle    = browserify();
    var bundleStr = '';
    var dest      = '';
    var done      = this.async();

    // Set dest and concat libs
    this.files.forEach(function(fm) {
      if (fm.dest) dest = fm.dest;
      fm.src.forEach(function(filepath) {
        bundleStr += grunt.file.read(filepath) + '\n\n';
      });
    });

    // Validate dest
    if (!dest) {
      utils.fail('Destination file required.');
    }

    // Require modules
    var modulesDir = path.resolve(opts.modulesDir);
    var modules = fs.readdirSync(modulesDir);
    modules.forEach(function(filepath) {
      if (path.extname(filepath) === '.js') {
        var fullpath = modulesDir + '/' + filepath;
        bundle.require(fullpath, {expose: path.basename(filepath, '.js')});
      }
    });

    // Add entry
    var entry = path.resolve(opts.entryFile);
    bundle.add(entry);

    // Bundle and write
    bundle.bundle(function(err, str) {
      if (err) throw err;
      bundleStr += str;
      grunt.file.write(dest, bundleStr);
      grunt.log.ok('Bundled: ' + dest);
      done();
    });
  });

};
