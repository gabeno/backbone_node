'use strict';

var expect = require('chai').expect,
    jsdom = require('jsdom');

var Todo = require('../hello-backbone/models'),
    TodoView = require('../hello-backbone/views/todoItemView');

describe('Backbone.View', function() {
  var todoView;

  before(function(done) {
    var $;
    jsdom.env({
      html: '<html><body></body></html>',
      scripts: ['scripts/jquery-2.1.0.min.js'],
      done: function(err, window) {
        if (err) {
          console.log(err);
        }
        // console.log(window.jQuery); // referencing jQuery into the DOM instance
        $ = global.$ = window.jQuery;
        var Backbone = require('backbone');
        // var _ = require('lodash/dist/lodash.underscore');
        Backbone.$ = $;

        $('body').append('<ul id="todo-list"></ul>');

        todoView = new TodoView({ model: new Todo() });
        done();
      }
    });
  });

  it('should be tied to a DOM element when created, based off the property provided', function() {
    expect(todoView.el.tagName.toLowerCase()).to.equal('li');
  });

  it('is backed by a model instance, which provides the data', function() {
    expect(todoView.model).to.be.ok;
    expect(todoView.model.get('done')).to.be.false;
  });

  it('can render, after which the DOM representation of the view will be visible', function() {
    todoView.render();
    $('ul#todo-list').append(todoView.el);
    expect($('ul#todo-list').find('li').length).to.equal(1);
  });
  
  it('can wire up view methods to DOM elements');
});