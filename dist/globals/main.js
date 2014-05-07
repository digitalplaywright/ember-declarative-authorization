!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),(o.Ember||(o.Ember={})).DeclarativeAuthorization=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
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

    var current_actor_promise = Ember.tryInvoke(this, 'actor');

    if ( current_actor_promise == undefined )
    {
      this.applyRule(rule);
    }else{
      var self = this;

      current_actor_promise.then(
        function(result){
          rule['actor'] =  result; 

          self.applyRule(rule);

        },
        function(failure){
          throw{message: 'failed to fetch actor'}
        }
      );
    }
  }

});

exports["default"] = AuthorizeRouteMixin;
},{}],2:[function(_dereq_,module,exports){
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
    canDo: function() {
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

      return rules.can(args);
    }.property('actor.updated_at', 'object.updated_at', 'target.updated_at')

});
},{}],3:[function(_dereq_,module,exports){
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
exports["default"] = Ember.Component.extend({
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
},{}],4:[function(_dereq_,module,exports){
"use strict";
/**
  The object that registers a rule definition from 'rules:main' and 
  authorizes rule invocations.

  @class DeclarativeRules
  @namespace $mainModule
  @extends Ember.Object
  @static
*/

var DeclarativeRules = Ember.Object.extend({
	activities_hash: {},

    required_properties: ["activity"],
	optional_properties: ["actor","object", "target"],
	expected_properties: [],
	hash_key_separator:  "-",

	/**
	  init the object

	  @method init
    */
    initExpectedProperties: function(){
        this.expected_properties = this.required_properties.concat(this.optional_properties);
    }.on('init'),


    /**
	  setup the object

	  @method setup
	  @param {Object} container The container object of the Ember app.
    */
    setup: function(container){
        this.make_activities_hash(container);
    },

	/**
	  Validates that a rule definition is in the correct format.

	  The expected format is:
	  {
	  	activity: {string}, 
	  	actor:    {string},
	  	object:   {string},
	  	target:   {string},
	  	can:    {function}
	  }
      See required_properties property which attributes are required.

	  @method validateFormat
	  @param {hash} item The rule definition
	  @param {boolean} require_can_definition If true then require a can 
	                   function definition
    */

    validateFormat: function(item, require_can_definition){

    	//validate required properties
    	this.required_properties.forEach(function(prop_name, index, enumerable){

    		if( item[prop_name] == undefined )
			{
				var message = "Error: Missing required property ";
				message = message.concat(JSON.stringify(prop_name) );
				message = message.concat(" in: ", JSON.stringify(item) );

				throw new Error(message);
			}
			
	    });

	    if( ( require_can_definition == true ) && 
	    	( typeof(item["can"]) != "function" ) 
	      )
	    {
	    	var message = "Error: Can is not a function in ";
			message = message.concat(" in: ", JSON.stringify(item) );

			throw new Error(message);

	    }


        //validate that only expected properties
	    var self = this;
  
	    var unexpected_properties = Object.keys(item).filter(function(i) {
	    	return i != "can" && self.expected_properties.indexOf(i) < 0;
	    });

	    if(unexpected_properties.length > 0)
	    {
     	    var message = "Error: Unexpected field(s) ";
			message = message.concat(JSON.stringify(unexpected_properties) );
			message = message.concat(" in: ", JSON.stringify(item) );

			throw new Error(message);

	    }


    },

	/**
	  Construct the key for a rule lookup. 

	  @method get_hash_key
	  @param {Object} item The hash definition of the current rule
  	  @param {boolean} require_can_definition If true then require a can 
                   function definition
    */
    get_hash_key: function(item, require_can_definition){
    	var self = this;

		var hash_key="";

        self.validateFormat(item, require_can_definition);

		this.expected_properties.forEach(function(prop_name, index, enumerable){
            var cur_prop = item[prop_name];

			if(cur_prop != undefined){ 
			    if (index != 0)	{ hash_key = hash_key.concat(self.hash_key_separator) }		

			    if (  typeof cur_prop === 'string' ){
					hash_key = hash_key.concat(cur_prop);
				}else{
					var cur_type = 
					hash_key = hash_key.concat(self.type_of(cur_prop));
				}

			}

		});

		return hash_key;
    },

	/**
	  Makes a hash table with quick lookup of rules, and validates that all rules are in the correct
	  format. 

	  @method set_activity
	  @param {Object} cur_def The hash definition of the current rule
    */
    set_activity: function(cur_def){
		var hash_key = this.get_hash_key(cur_def, true);
    	
        //Disallow duplicate keys
		if( this.activities_hash.hasOwnProperty(hash_key) ){
			var message = "Error: Activity with the same definition already exists for ";
			message = message.concat( JSON.stringify(cur_def) );

			throw new Error(message);
		}

		this.activities_hash[hash_key] = cur_def.can;
    },


	/**
	  Makes a hash table with quick lookup of rules, and validates that all rules are in the correct
	  format. 

	  @method make_activities_hash
	  @param {Object} container The container object for the Ember App of Ember.Container type
    */
    make_activities_hash: function(container){
      	var self = this;

        //find all properties that are inherited from super
        //FIXME: need a better way to find non-inherited properties
      	var super_obj = Ember.Object.extend({container: 'test', _debugContainerKey: 'test'}).create();

      	var super_attributes = [];

        for(var item in super_obj){
        	super_attributes.push(item);
        }

        //for each rule in the main rules object return
      	var rules = container.lookup('rules:main');

      	if( rules == undefined ){
      		throw new Error("no rules are defined");
      	}

        for(var item in rules){

        	if( (typeof item == 'string') && super_attributes.indexOf(item) == -1 ){
        		var local_var         = rules[item];

        		if( local_var instanceof Array ){

        			local_var.forEach(function(cur_item, index, enumerable) {
		        		cur_item['activity'] = item;
		        		self.set_activity(cur_item);
        			});

        		}else{
		        		local_var['activity'] = item;
		        		self.set_activity(local_var);
        		}
        	}
	    };

    },


    
    /**
	  Get the abstract type of an object, 

	  Unlike javascript typeof this method is aware of Ember abstract types, 
	  like e.g an Ember.Model or Ember.Controller.

	  @method type_of
	  @param {Object} object The object to get the type of. 
    */
	type_of: function(object){

      if(DS.Model.detectInstance(object)){
      	return object.constructor.typeKey;
      }else if(DS.RecordArray.detectInstance(object)){
      	return object.type.typeKey;
      }else{

		throw new Error("Error: Type unhandled for "+JSON.stringify(object));
      }

	},

    /**
	  Determines if the rule invocation is allowed. If true it
	  returne true.

	  @method can
	  @param {Object} params_hash A rule lookup.
    */
    can: function( params_hash ) {

    	var hash_key = this.get_hash_key(params_hash, false);

		if( !this.activities_hash.hasOwnProperty(hash_key) ){
			throw new Error("Error: no matching activity definition found for "+JSON.stringify(params_hash.activity));
		}

		return this.activities_hash[hash_key](params_hash["actor"],
			params_hash["object"], params_hash["target"]);

    },

    /**
	  Determines if the rule invocation is not allowed. If not it
	  returne true.

	  @method cannot
	  @param {Object} params_hash A rule lookup.
    */
    cannot: function( params_hash ) {
    	return !this.can(params_hash);
    }

});



exports["default"] = DeclarativeRules;
},{}],5:[function(_dereq_,module,exports){
"use strict";
var CanDoComponent = _dereq_("./can-do-component")["default"] || _dereq_("./can-do-component");
var CannotDoComponent = _dereq_("./cannot-do-component")["default"] || _dereq_("./cannot-do-component");
var DeclarativeAuthorization = _dereq_("./declarative-authorization.js")["default"] || _dereq_("./declarative-authorization.js");
var AuthorizedRouteMixin = _dereq_("./authorize-route-mixin.js")["default"] || _dereq_("./authorize-route-mixin.js");
var canDoTemplate = _dereq_("./templates/can-do")["default"] || _dereq_("./templates/can-do");
var cannotDoTemplate = _dereq_("./templates/cannot-do")["default"] || _dereq_("./templates/cannot-do");
var Application = window.Ember.Application;

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
},{"./authorize-route-mixin.js":1,"./can-do-component":2,"./cannot-do-component":3,"./declarative-authorization.js":4,"./templates/can-do":6,"./templates/cannot-do":7}],6:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n  ");
  stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "canDo", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});
},{}],7:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
exports["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
  var stack1, self=this;

function program1(depth0,data) {
  
  var buffer = '', stack1;
  data.buffer.push("\n  ");
  stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  data.buffer.push("\n");
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, "cannotDo", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
  if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
  else { data.buffer.push(''); }
  
});
},{}]},{},[5])
(5)
});