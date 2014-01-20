var
  $ = require('jquery'),
  // _ = require('underscore'),
  _ = require('lodash/dist/lodash.underscore'),
  Backbone = require('backbone');

Backbone.$ = $;
console.log(Backbone);

// ---------------------------------------------------------------------------------------*
//                                        Models
// ---------------------------------------------------------------------------------------*

var Todo = Backbone.Model.extend({
  defaults: {
    completed: false
  },

  // attrs reps what the object would be after completing the current set() or save()
  validate: function(attrs) {
    if (!attrs.title) {
      return 'Please set a title!';
    }
  },

  initialize: function() {
    // listen to changes on all atributes on this model
    this.on('change', function() {
      console.log('value for this model has changed.');
    });
    // listen to changes on an attribute on this model
    this.on('change:title', function() {
      console.log('title was changed.');
    });
    // listen to validation errors
    this.on('invalid', function(model, error) {
      console.log('Model raised error: %s', error);
      console.log(model.validationError);
    });
  }
});

var todo = new Todo();
console.log(JSON.stringify(todo));
todo.set({ completed: true }, { validate: true });

var todo1 = new Todo({
  title: "check attributes of the logged model in the console"
});
console.log('JSON.stringify() outputs a json string', JSON.stringify(todo1));
console.log('model.toJSON() outputs an object',todo1.toJSON());
console.log(todo1.get('title'));
console.log(todo1.get('completed'));

var todo2 = new Todo({
  title: 'This todo is done. So take no action on this one.'
});
console.log(JSON.stringify(todo2));

// set a single attribute
todo2.set('title', 'Title attribute set through model.set()');
console.log(JSON.stringify(todo2));

// set multiple attributes
todo2.set({
  title: 'Both attributes set through model.set()',
  completed: true
});
console.log(JSON.stringify(todo2));
console.log('Previous attrs: ', todo2.previousAttributes());
console.log('Changed attrs: ', todo2.changedAttributes());

console.log('underscore Methods');
console.log('_keys: names of object properties -> ', todo2.keys().join(', '));
console.log('_values: values of object properties -> ', todo2.values());
console.log('_pairs: convert an object to list of key, value pairs -> ', todo2.pairs());
console.log('_invert: swap key, value -> ', todo2.invert());
console.log('_pick: return copy of object filtered w/ only whitelisted props -> ', todo2.pick('title'));
console.log('_omit: return copy of object filtered to omit blacklisted props -> ', todo2.omit('title'));

// ---------------------------------------------------------------------------------------*
//                                        Views
// ---------------------------------------------------------------------------------------*

var TodoView = Backbone.View.extend({
  tagName: 'li',
  todoTpl: _.template('An example template'),

  // DOM events of interest to us, regarding this view
  events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  render: function() {
    this.$el.html(this.todoTpl(this.model.toJSON())); // this.$el == $(view.el)
    this.input = this.$('.edit'); // this.$('.edit') == $(view.el).find('.edit')
    return this;
  },

  edit: function() {},

  close: function() {},

  updateOnEnter: function() {}
});

var todoView = new TodoView();

console.log(todoView.el);

// ---------------------------------------------------------------------------------------*
//                                        Collections
// ---------------------------------------------------------------------------------------*

var TodosCollection = Backbone.Collection.extend({
  model: Todo
});

// // listen on events: add, remove, change
// TodosCollection.on('add', function(todo) {
//   console.log('Model: '+ todo.get('title') +'added to collection!');
// });

// TodosCollection.on('remove', function(todo) {
//   console.log('Model: '+ todo.get('title') +'removed to collection!');
// });

// TodosCollection.on('change:title', function(todo) {
//   console.log('Title : '+ todo.get('title') +'for model changed.');
// });

var todos = new TodosCollection([todo, todo1, todo2]);

console.log('Collection size: ', todos.length);

// add a model to a collection
var todo3 = new Todo({ title: 'My Life is good!' });
todos.add(todo3);
console.log('Collection size: ', todos.length);

// remove a model from a collection
todos.remove(todo3);
console.log('Collection size: ', todos.length);

// retrieve model using model id and change its props
var model1 = todos.get(todo1.cid);
console.log(model1);
model1.set('title', 'Smart people read the star');