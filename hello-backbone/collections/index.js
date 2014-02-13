'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var Todo = require('../models');

var TodoList = Backbone.Collection.extend({
  model: Todo,

  url: '/todos/'
});

module.exports = TodoList;