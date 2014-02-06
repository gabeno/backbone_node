var
  $ = require('jquery'),
  _ = require('lodash/dist/lodash.underscore'),
  Backbone = require('backbone'),
  statsTemplate = require('./templates/todo-stats');

Backbone.$ = $;
Backbone.LocalStorage = require('backbone.localstorage');

var app = {};

// ------------------------------------------------------------------------
//                              Models
// ------------------------------------------------------------------------
var Todo = Backbone.Model.extend({
  // default attributes
  defaults: {
    title: '',
    completed: false
  },

  // toggle the completed state of this item
  toggle: function() {
    this.save({
      completed: !this.get('completed')
    });
  }
});

// ------------------------------------------------------------------------
//                              Collection
// ------------------------------------------------------------------------

var TodoList = Backbone.Collection.extend({
  model: Todo,

  localStorage: new Backbone.LocalStorage('todo-app'),

  completed: function() {
    return this.filter(function(todo) {
      return todo.get('completed');
    });
  },

  remaining: function() {
    return this.without.apply(this, this.completed());
  },

  nextOrder: function() {
    if (!this.length)
      return 1;
    return this.last().get('order') + 1;
  },

  comparator: function(todo) {
    return todo.get('order');
  }
});

var todos = new TodoList();

// ------------------------------------------------------------------------
//                              Views
// ------------------------------------------------------------------------

var AppView = Backbone.View.extend({
  el: '#todoapp',
  statsTemplate: _.template(require('./templates/todo-stats')),

  events: {
    'keypress #new-todo': 'createOnEnter',
    'click #clear-completed': 'clearCompleted',
    'click #toggle-all': 'toggleAllComplete'
  },

  initialize: function() {
    this.allCheckbox = this.$('#toggle-all')[0];
    this.$input = this.$('#new-todo');
    this.$footer = this.$('#footer');
    this.$main = this.$('#main');

    this.listenTo(todos, 'add', this.addOne);
    this.listenTo(todos, 'reset', this.addAll);

    this.listenTo(todos, 'change:completed', this.filterOne);
    this.listenTo(todos, 'filter', this.filterAll);
    this.listenTo(todos, 'all', this.render);

    todos.fetch();
  },

  render: function() {
    var completed = todos.completed().length;
    var remaining = todos.remaining().length;

    if (todos.length) {
      this.$main.show();
      this.$footer.show();

      this.$footer.html(this.statsTemplate({
        completed: completed,
        remaining: remaining
      }));

      this.$('#filters li a')
        .removeClass('selected')
        .filter('[href="#/'+ (app.TodoFilter || '') +'"]')
        .addClass('selected');
    } else {
      this.$main.hide();
      this.$footer.hide();
    }

    this.allCheckbox.checked = !remaining;
  },

  // add a single todo item
  addOne: function(todo) {
    var view = new TodoView({ model: todo });
    $('#todo-list').append(view.render().el);
  },

  // add all items in the collection at once
  addAll: function() {
    this.$('#todo-list').html('');
    todos.each(this.addOne, this);
  },

  filterOne: function(todo) {
    todo.trigger('visible');
  },

  filterAll: function() {
    todos.each(this.filterOne, this);
  },

  newAttributes: function() {
    return {
      title: this.$input.val().trim(),
      completed: false,
      order: todos.nextOrder()
    };
  },

  createOnEnter: function(event) {
    if (event.which !== 13 || !this.$input.val().trim())
      return;

    todos.create(this.newAttributes());
    this.$input.val('');
  },

  clearCompleted: function() {
    _.invoke(todos.completed(), 'destroy');
    return false;
  },

  toggleAllComplete: function() {
    var completed = this.allCheckbox.checked;

    todos.each(function(todo) {
      todo.save({ 'completed': completed });
    });
  }
});

var TodoView = Backbone.View.extend({
  tagName: 'li',
  template: _.template(require('./templates/todo')),

  events: {
    'dblclick label': 'edit',
    'keypress .edit': 'updateOnEnter',
    'blur .edit': 'close'
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$input = this.$('.edit');
    return this;
  },

  edit: function() {
    this.$el.addClass('editing');
    this.$input.focus();
  },

  close: function() {
    var value = this.$input.val().trim();

    if (value)
      this.model.save({ title: value });

    this.$el.removeClass('editing');
  },

  updateOnEnter: function(e) {
    if (e.which === 13)
      this.close();
  }
});

$(function() {
  new AppView();
});