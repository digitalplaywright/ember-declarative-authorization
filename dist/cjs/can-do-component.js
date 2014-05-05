"use strict";
/**
  The component for authorizing determining if a user can perform an action.

  Expected syntax is:
  {{#can-do activity="edit" actor=object-1 object=object-2 target=object-3 }}

  where object and target are optional parameters.

  Invoked in a template as:

  ```handlebars
  {{#can-do activity="edit" actor=user object=post }}
    MARK
  {{/can-do}}
  ```

  @class CanDoComponent
  @namespace $mainModule
  @extends Ember.Component
  @static
*/
exports["default"] = Ember.Component.extend({
    isEqual: function() {
  	  var rules = this.container.lookup('declarative-authorization:eval');

  	  var activity = this.get('activity');
  	  var actor    = this.get('actor');
  	  var object   = this.get('object');
  	  var target   = this.get('target');

  	  var args = {};
  	  console.log(target);

  	  if(activity != null) { args['activity'] = activity; }; 
  	  if(actor    != null) { args['actor']    = actor;    }; 
  	  if(object   != null) { args['object']   = object;   }; 
  	  if(target   != null) { args['target']   = target;   }; 

      return rules.can(args);
    }.property('actor.updated_at', 'object.updated_at', 'target.updated_at')

});