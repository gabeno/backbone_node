'use strict';

var $ = require('jquery');
var Backbone = require('backbone');
var _ = require('lodash/dist/lodash.underscore');

Backbone.$ = $;

var Item = Backbone.Model.extend({
  defaults: function() {
    return {
      text: '',
      done: false,
      order: 0
    }
  },

  initialize: function() {
    this.set({ text: this.get('text').replace('article', 'post') }, { silent: true });
  },

  validate: function(attrs) {
    if (attrs.hasOwnProperty('done') && !_.isBoolean(attrs.done)) {
      return 'Todo.done must be a boolean value';
    }
  },

  toggle: function() {
    this.set({ done: !this.get('done') });
  }
});

module.exports = Item;