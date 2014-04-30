export default Ember.Component.extend({
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
