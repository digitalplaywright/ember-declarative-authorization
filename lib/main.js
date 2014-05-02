import CanDoComponent           from './can-do-component';
import CannotDoComponent        from './cannot-do-component';
import DeclarativeAuthorization from './declarative-authorization.js';
import AuthorizedRouteMixin     from './authorize-route-mixin.js';
import canDoTemplate            from './templates/can-do';
import cannotDoTemplate         from './templates/cannot-do';
import { Application }          from 'ember';

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

export {
  setup,
  CanDoComponent,
  CannotDoComponent,
  DeclarativeAuthorization,
  AuthorizedRouteMixin
};

