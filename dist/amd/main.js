define(
  ["./can-do-component","./cannot-do-component","./declarative-authorization.js","./authorize-route-mixin.js","./templates/can-do","./templates/cannot-do","ember","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var CanDoComponent = __dependency1__["default"] || __dependency1__;
    var CannotDoComponent = __dependency2__["default"] || __dependency2__;
    var DeclarativeAuthorization = __dependency3__["default"] || __dependency3__;
    var AuthorizedRouteMixin = __dependency4__["default"] || __dependency4__;
    var canDoTemplate = __dependency5__["default"] || __dependency5__;
    var cannotDoTemplate = __dependency6__["default"] || __dependency6__;
    var Application = __dependency7__.Application;

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

    __exports__.setup = setup;
    __exports__.CanDoComponent = CanDoComponent;
    __exports__.CannotDoComponent = CannotDoComponent;
    __exports__.DeclarativeAuthorization = DeclarativeAuthorization;
    __exports__.AuthorizedRouteMixin = AuthorizedRouteMixin;
  });