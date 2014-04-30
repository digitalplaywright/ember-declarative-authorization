//import ExampleRules from 'appkit/tests/support/rules.js';

moduleForComponent('can-do');


test('renders', function() {
    expect(2);
    var modal = this.subject({
      template: function() {/*
                         {{#ic-modal}}
                         Hello
                         {{/ic-modal}}
                       */}
    });
    equal(modal.state, 'preRender');
    this.append();
    equal(modal.state, 'inDOM');
    });

test('renders', function() {
    expect(2);
    var modal = this.subject({
template: function() {/*
                         {{#ic-modal}}
                         Hello
                         {{/ic-modal}}
                       */}
});
    equal(modal.state, 'preRender');
    this.append();
    equal(modal.state, 'inDOM');
    });
