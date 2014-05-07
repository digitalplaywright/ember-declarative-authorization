/**
  The mixin for routes that require authorization in order to be accessible.

  The mixin defines an afterModel hook that authorizes the route. 

  @class AuthorizeRouteMixin
  @namespace $mainModule
  @extends Ember.Mixin
  @static
*/

var AuthorizeRouteMixin = Ember.Mixin.create({
  applyRule: function(rule){
    var ruleEval = this.container.lookup('declarative-authorization:eval');

    if( ruleEval.cannot(rule) ){
      throw new Error({ code: 401, route: this.routeName, message: "Unauthorized access"});
    };
  },

  /**
    Authorize the current route.

    The action is the route name.

    If the method 'actor' exists then it should return a promise, and what
    the promise evaluates to is the actor.

    The object is the 'model' parameter.

    @method afterModel
    @param {Object} model The model for this route
    @param {Object} transition The transition for this route
  */
  afterModel: function(model, transition) {
    var rule = { activity: this.routeName, object: model };

    var current_actor = Ember.tryInvoke(this, 'actor');

    if ( current_actor == undefined )
    {
      this.applyRule(rule);
    }else{
      var self = this;

      current_actor.then(
        function(current_actor){
          rule['actor'] =  current_actor 

          self.applyRule(rule);

        },
        function(failure){
          throw{message: 'failed to fetch actor'}
        }
      );
    }
  }

});

export default AuthorizeRouteMixin;
