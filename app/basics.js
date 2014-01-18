var
  Backbone = require('backbone'),
  $ = require('jquery/dist/jquery');
  // _ = require('underscore');
  // browserify = require('browserify');
  // _ = require('lodash/dist/lodash.underscore');

// var b = browserify();
// b.require('lodash/dist/lodash.underscore', { expose: '_' });

Backbone.$ = $;
console.log(Backbone);

// Models

var Todo = Backbone.Model.extend();

var todo1 = new Todo();
console.log(JSON.stringify(todo1));

var todo2 = new Todo({
  title: "completed setting up backbone the node way",
  completed: true
});
console.log(JSON.stringify(todo2));