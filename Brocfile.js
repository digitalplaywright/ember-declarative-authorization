var moduleFilter = require('broccoli-dist-es6-module');
var templateFilter = require('broccoli-template-compiler');

module.exports = function(broccoli) {
  var tree = broccoli.makeTree('lib');
  var templates = templateFilter(tree, {module: true});
  var modules = moduleFilter(templates, {
    global: 'Ember.DeclarativeAuthorization',
    packageName: 'ember-declarative-authorization',
    main: 'main',
    shim: {
      'ember': 'Ember'
    }
  });
  return modules;
};

