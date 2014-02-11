'use strict';

var expect = require('chai').expect;
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var Todo = require('../hello-backbone/models/');

chai.use(sinonChai);

describe('Backbone.Model', function() {

  it('can be created with default values', function() {
    var todo = new Todo();

    expect(todo.get('text')).to.equal('');
    expect(todo.get('done')).to.be.false;
    expect(todo.get('order')).to.equal(0);
  });

  it('will set attributes on the model instance when created', function() {
    var todo = new Todo({ text: 'clear pending emails' });

    expect(todo.get('text')).to.equal('clear pending emails');
    expect(todo.get('done')).to.be.false;
    expect(todo.get('order')).to.equal(0);
  });

  it('will call a custom initialize function on the model instance when created', function() {
    var todo = new Todo({ text: 'proof read draft blog article' });

    expect(todo.get('text')).to.equal('proof read draft blog post');
  });

  it('fires a custom event when the state changes', function() {
    var spy = sinon.spy();
    var todo = new Todo();

    todo.bind('change', spy);
    todo.set('text', 'send email out to clients');

    expect(spy).to.have.been.calledOnce;
  });

  it('can contain custom validation rules, and will trigger an error event on failed validation', function() {
    var errorCallback = sinon.spy();
    var todo = new Todo();

    todo.bind('invalid', errorCallback);
    todo.set('done', 'true', { validate: true });

    expect(todo.validationError).to.equal('Todo.done must be a boolean value');
    expect(errorCallback).to.have.been.called;
    expect(errorCallback.getCall(0)).to.not.equal(undefined);
    // http://backbonejs.org/#Events
    // "invalid" (model, error, options) — when a model's validation fails on the client.
    expect(errorCallback.getCall(0).args[0]).to.eql(todo);
    expect(errorCallback.getCall(0).args[1]).to.eql('Todo.done must be a boolean value');
    expect(errorCallback.getCall(0).args[2].validate).to.be.true;
  });

  it('can unset an attribute', function() {
    var callback = sinon.spy();
    var todo = new Todo();

    todo.bind('change', callback);
    todo.unset('text');

    expect(callback).to.be.calledOnce;
    expect(todo.get('text')).to.be.undefined;
    expect(todo.has('text')).to.be.false;
  });

  it('can toggle the completed status of the model', function() {
    var todo = new Todo();

    expect(todo.get('done')).to.be.false;
    todo.toggle();
    expect(todo.get('done')).to.be.true;
  });
});