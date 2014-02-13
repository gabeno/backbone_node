'use strict';

var $ = require('jquery');
var Backbone = require('backbone');

Backbone.$ = $;

var TodoView = Backbone.View.extend({
  tagName: 'li'
});

module.exports = TodoView;