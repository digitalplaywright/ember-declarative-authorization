define(
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      The component for authorizing determining if a user can not perform an action.

      Expected syntax is:
      {{#cannot-do activity="edit" actor=object-1 object=object-2 target=object-3 }}

      where object and target are optional parameters.

      Invoked in a template as:

      ```handlebars
      {{#cannot-do activity="edit" actor=user object=post }}
        MARK
      {{/cannot-do}}
      ```

      @class CanDoComponent
      @namespace $mainModule
      @extends Ember.Component
      @static
    */
    __exports__["default"] = Ember.Component.extend({
        cannotDo: function() {
      	  var rules = this.container.lookup('declarative-authorization:eval');

      	  var activity = this.get('activity');
      	  var actor    = this.get('actor');
      	  var object   = this.get('object');
      	  var target   = this.get('target');

      	  var args = {};

      	  if(activity != null) { args['activity'] = activity; }; 
      	  if(actor    != null) { args['actor']    = actor;    }; 
      	  if(object   != null) { args['object']   = object;   }; 
      	  if(target   != null) { args['target']   = target;   };

          return rules.cannot(args);
        }.property('actor.updated_at', 'object.updated_at', 'target.updated_at')
        
    });
  });