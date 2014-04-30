ic-modal
========

[![Build Status](https://travis-ci.org/instructure/ic-modal.png?branch=master)](https://travis-ci.org/instructure/ic-modal)

[WAI-ARIA][wai-aria] declarative authorization component for [Ember.js][ember].

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

Usage
------------------

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

