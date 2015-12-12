"use strict";

var _ = require("lodash");
var fs = require("fs");
var path = require("path");
var mustache = require("mustache");


exports.buildData = function( dataDir, lang, notify ) {
  var data = {};
  _.filter(_.map(fs.readdirSync(dataDir), function (f) {
    var full = path.join(dataDir, f);
    var key = path.basename(f, ".json");

    var stat = fs.statSync(full);
    if (stat.isFile() && f.match(/\.json$/) ) {
      try {
        var obj  = {};
        obj[ key ] = require(full)
        _.merge( data, obj );
      } catch(e) {
        notify("invalid data", f, e);
      }
    }
  }));
  //console.log("DATA: " + JSON.stringify(data, true));
  return data;
}

exports.render = function(input, data) {
  return mustache.render(input, data);
}

exports.validate = function(srcDir, data, notify) {
  //-- Walk srcDir, for each file, parse tokens, and verify in data
  var contents, tokens, matches, shortFile;

  if (!fs.existsSync(srcDir)) {
    throw new Error("Source folder '" + dir + "' not found");
  }

  var files = getFileList( srcDir );

  _.map( files, function(f) {
      matches = [];
      contents = fs.readFileSync(f, "utf8");
      tokens = mustache.parse(contents);
      _.each(_.flatten(tokens), function(element, index, list) {
        if ( element == "name" ) {
          matches.push(list[index+1]);
        }
      });
      if ( matches.length ) {
        shortFile = f.substring(srcDir.length+1);
        matches = _.uniq(matches);
        //console.log( shortFile, ":", matches);
        _.each(matches, function(key) {
          if( !_.get(data, key) ) {
            notify("missing data", shortFile, key);
          }

        });
      }
  });
}

function getFileList (dir) {
  var full, stat;

  return _.flatten(_.map(fs.readdirSync(dir).sort(), function (f) {
    full = path.join(dir, f);
    stat = fs.statSync(full);
    if (stat.isDirectory()) {
      return getFileList(full);
    } else if (stat.isFile()) {
      return filterInputFiles(full)
    }
  }));
}

function filterInputFiles(f) {
  return f.match(/\.(md|html)$/) ? f : null;
}

function filterDataFiles(f) {
  return f.match(/\.(json|js)$/) ? f : null;
}


