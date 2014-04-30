export default Ember.Object.extend({
	'edit': [
	{
		actor:  "post",
		object: "post",
		target: "post",
		can: function(actor, object, target){
			return actor.get('title')=="mydream";
		}

	},
	{
		actor:  "post",
		object: "post",
		can: function(actor, object, target){
			return actor.get('title')=="mydream";
		}

	}


	],
	'posts.index': {
		object: 'post',
		can: function(actor, object, target){
			return true;
		}
	},
	'posts.show': {
		object: 'post',
		can: function(actor, object, target){
			return true;
		}
	},
	'controller:posts.edit': [
		{
			actor:  'user',
			object: 'post',
			target: 'postsEditController',
			can: function(actor, object, target){
				return true;
			}

		},
		{
			actor:  'user',
			object: 'post2',
			target: 'postsEditController',
			can: function(actor, object, target){
				return true;
			}

		}
	]
});