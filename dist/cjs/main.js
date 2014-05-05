"use strict";
var CanDoComponent = require("./can-do-component")["default"] || require("./can-do-component");
var CannotDoComponent = require("./cannot-do-component")["default"] || require("./cannot-do-component");
var DeclarativeAuthorization = require("./declarative-authorization.js")["default"] || require("./declarative-authorization.js");
var AuthorizedRouteMixin = require("./authorize-route-mixin.js")["default"] || require("./authorize-route-mixin.js");
var canDoTemplate = require("./templates/can-do")["default"] || require("./templates/can-do");
var cannotDoTemplate = require("./templates/cannot-do")["default"] || require("./templates/cannot-do");
var Application = require("ember").Application;

/**
  Sets up Ember.DeclarativeAuthorization for the application; this method __should be invoked
  in a custom initializer__ like this after a rule object is registered on 'rules:main':

  ```javascript
  Ember.Application.initializer({
    name: 'authorization',
    initialize: function(container, application) {
          Ember.DeclarativeAuthorization.setup(container,application);
    }
  });
  ```

  @method setup
  @namespace $mainModule
  @static
  @param {Container} container The Ember.js application's dependency injection container
  @param {Ember.Application} application The Ember.js application instance
**/
var setup = function(container, application) {

    //Register all 
    container.register('component:can-do', CanDoComponent);
    container.register('component:cannot-do', CannotDoComponent);
    container.register('mixin:authorize-route', AuthorizedRouteMixin);
    container.register('declarative-authorization:eval', DeclarativeAuthorization);
    container.register('template:components/can-do', canDoTemplate);
    container.register('template:components/cannot-do', cannotDoTemplate);

    container.lookup('declarative-authorization:eval').setup(container);

};

exports.setup = setup;
exports.CanDoComponent = CanDoComponent;
exports.CannotDoComponent = CannotDoComponent;
exports.DeclarativeAuthorization = DeclarativeAuthorization;
exports.AuthorizedRouteMixin = AuthorizedRouteMixin;