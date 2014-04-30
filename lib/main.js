import CanDoComponent           from './can-do-component';
import CannotDoComponent        from './cannot-do-component';
import DeclarativeAuthorization from './declarative-authorization.js';
import AuthorizedRouteMixin     from './authorize-route-mixin.js';
import canDoTemplate            from './templates/can-do';
import cannotDoTemplate         from './templates/cannot-do';
import { Application }          from 'ember';

Application.initializer({
  name: 'ember-declarative-authorization',
  initialize: function(container) {
    container.register('component:can-do', CanDoComponent);
    container.register('component:cannot-do', CannotDoComponent);
    container.register('mixin:authorize-route', AuthorizedRouteMixin);
    container.register('declarative-authorization:eval', DeclarativeAuthorization);
    container.register('template:components/can-do', canDoTemplate);
    container.register('template:components/cannot-do', cannotDoTemplate);
  }
});

export {
  CanDoComponent,
  CannotDoComponent,
  DeclarativeAuthorization,
  AuthorizedRouteMixin
};

