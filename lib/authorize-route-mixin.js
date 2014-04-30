/**
  The mixin for routes that require authorization in order to be accessible.

  The mixin defines an afterModel hook that authorizes the route. 

  @class AuthorizeRouteMixin
  @namespace $mainModule
  @extends Ember.Mixin
  @static
*/

var AuthorizeRouteMixin = Ember.Mixin.create({
  afterModel: function(model, transition) {

      var rule = { activity: this.routeName, object: model };

      if( Ember.DeclarativeRules.cannot(rule) ){
        throw{ code: 401, route: this.routeName, message: "Unauthorized access"}
      };
  }

});

export default AuthorizeRouteMixin;
