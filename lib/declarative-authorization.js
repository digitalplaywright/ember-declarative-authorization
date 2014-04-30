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
	  init the object

	  @method init
    */
    init: function(){
        this.expected_properties = this.required_properties.concat(this.optional_properties);
    },


    /**
	  setup the object

	  @method setup
	  @param {Object} container The container object of the Ember app.
    */
    setup: function(container){
        this.make_activities_hash(container);
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



export default DeclarativeRules;