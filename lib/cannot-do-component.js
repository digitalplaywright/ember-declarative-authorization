export default Ember.Component.extend({
    isEqual: function() {
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
