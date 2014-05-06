Ember Declarative Authorization
========

[![Build Status](https://travis-ci.org/instructure/ic-modal.png?branch=master)](https://travis-ci.org/instructure/ic-modal)

declarative authorization component for [Ember.js][ember].

Installation
------------

```sh
$ npm install ember-declarative-authorization
```

or ...

```sh
$ bower install ember-declarative-authorization
```

or just grab your preferred distribution from `dist/`.

Then include the script(s) into your application:

### npm+browserify

`require('ic-modal')`

### amd

Register `ic-modal` as a [package][rjspackage], then:

`define(['ic-modal'], ...)`

### named-amd

You ought to know what you're doing if this is the case.

### globals

`<script src="bower_components/ember-declarative-authorization/dist/globals/main.js"></script>`


Usage (e.g how does it work?)
------------------


**To enable Ember.DeclartiveAuth in an Application, simply add a custom initializer:**

```javascript
//user defined rules object. Where it is located doesn't matter, but
//it must be registered on 'rules:main' like shown below.
import RulesMain from 'appkit/rules/main';

Ember.Application.initializer({
  name: 'authorization',
  initialize: function (container, application) {
    
    container.register('rules:main', RulesMain);

    Ember.DeclarativeAuthorization.setup(container,application);

  }
});

```

This initializer parses and validates the rules you as a user define, and constructs
a quick way to lookup rules at runtime.

**You must define a module with your own rules in 'rules/main.js' which you can
import in app.js using 'import RulesMain from 'appkit/rules/main':**

```Javascript
export default Ember.Object.extend({
    //Can a specific user edit edit a specific post?
	'posts.edit': [
	{
	    actor:  "user",
	    object: "post"
		can: function(actor, object, target){
		    //do an arbitrary check here
              	    return true;
		}
	}
});
```

Rule Format
------------

A rule is specified in the format where **only the activity-verb and defining the 'can' function is required:

```javascript

activity-verb: {
	actor:   object-type-1,
	object:  object-type-2,
	target:  object-type-3,

	can: function(actor, object, target){
          //arbitrary javascript function that 
          //returns true/false
          return true;
    }
}
```

where object-type-# is the expected type of object provided in that argument. 

The activity verb is the name of an activity like for instance 'posts.edit'.

The actor is the entity that is seeking authorization.

The object may be the entity performing the activity, or the entity on which the activity was performed. e.g John(actor) shared a video(act_object)

The target is the object that the verb is enacted on. e.g. Geraldine(actor) posted a photo(object) to her album(target).


Rule Activity Verbs with Multiple Associated Rules
------------

An activity verb can be used for multiple rules by putting all rules for that verb into
an array. 

```javascript

activity-verb: [
	{
		actor:   object-type-1,
		object:  object-type-2,
		target:  object-type-3,

		can: function(actor, object, target){
	       //arbitrary javascript function that 
	       //returns true/false
               return true;
	   
	    }
	},
    {
		actor:   object-type-1,
		can: function(actor, object, target){
	       //arbitrary javascript function that 
	       //returns true/false
               return false;
	    }
	}

]
```

Invoking a Rule in a Template
------------

To selectively show content in a template invoke the #can-do component, e.g:

```handlebars
{{#can-do activity="edit" actor=user object=post }}
MARK
{{/can-do}}
```

To selectively hide content in a template invoke the #cannot-do component, e.g:

```handlebars
{{#cannot-do activity="edit" actor=user object=post }}
MARK
{{/cannot-do}}
```

Declaratively Protecting a Route
------------

You can declaratively protect a controller route by extending the 'AuthorizeRouteMixin' mixin, e.g:

```handlebars
var PostsRoute = Ember.Route.extend(Ember.DeclarativeAuthorization.AuthorizeRouteMixin, {
  model: function() {
    return this.store.find('post');
  }
});

export default PostsRoute;
```

The activity verb of the controller is then inferred to be the route name, like e.g 'posts.index', and 
the model on the controller is assumed to be the object. For example, for the controlelr above
the route above the following rule must be defined:

```javascript

"posts.index": {
	actor:   "user",
	object:  "post",

	can: function(actor, object, target){
          //arbitrary javascript function that 
          //returns true/false
          return true;
    }
}
```





Contributing
------------

```sh
$ git clone <this repo>
$ npm install
$ npm test
# during dev
$ broccoli serve
# localhost:4200/globals/main.js instead of dist/globals/main.js
# new tab
$ karma start
```

Make a new branch, send a pull request, squashing commits into one
change is preferred.

  [rjspackage]:http://requirejs.org/docs/api.html#packages
  [ember]:http://emberjs.com
  [wai-aria]:http://www.w3.org/TR/wai-aria/roles#dialog

