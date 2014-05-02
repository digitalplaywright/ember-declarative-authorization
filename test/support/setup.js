emq.globalize();

setResolver(Ember.DefaultResolver.extend({
  testSubjects: {
    'component:can-do':    Ember.DeclarativeAuthorization.CanDoComponent,
    'component:cannot-do': Ember.DeclarativeAuthorization.CannotDoComponent,
    'mixin:authorized-route': Ember.DeclarativeAuthorization.AuthorizedRouteMixin,
    'declarative-authorization:eval': Ember.DeclarativeAuthorization.DeclarativeAuthorization
  },
  resolve: function(fullName) {
    return this.testSubjects[fullName] || this._super.apply(this, arguments);
  }
}).create());

Function.prototype.compile = function() {
  var template = this.toString().split('\n').slice(1,-1).join('\n') + '\n';
  return Ember.Handlebars.compile(template);
};

function lookupComponent(id) {
  return Ember.View.views[id];
}

