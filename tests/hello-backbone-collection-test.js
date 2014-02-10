'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

var TodoList = require('../hello-backbone/collections');

chai.use(sinonChai);

describe('Backbone.Collection', function() {
  it('can add Model instances as objects and arrays', function() {
    var todos = new TodoList();

    expect(todos.length).to.equal(0);

    todos.add({ text: 'Get a hair cut' });
    expect(todos.length).to.equal(1);

    todos.add([
      { text: 'Finish reading novel' },
      { text: 'Prepare speech', done: true }
    ]);
    expect(todos.length).to.equal(3);

    // insert a model at a specified index
    expect(todos.at(1).attributes.text).to.equal('Finish reading novel');
    todos.add({ text: 'Do laundry' }, { at: 1 });
    expect(todos.at(1).attributes.text).to.equal('Do laundry');
    expect(todos.at(2).attributes.text).to.equal('Finish reading novel');
  });

  it('can have url property to define the basic url structure for all contained models', function() {
    var todos = new TodoList();

    expect(todos.url).to.equal('/todos/');
  });

  it('fires custom named events when the models change', function() {
    var todos = new TodoList();

    var addModelCallback = sinon.spy();
    var resetCollectionCallback = sinon.spy();
    var removeModelCallback = sinon.spy();

    todos.bind('add', addModelCallback);
    todos.bind('remove', removeModelCallback);
    todos.bind('reset', resetCollectionCallback);

    todos.add({ text: 'Reply letter from dad and mum' });
    expect(addModelCallback).to.have.been.calledOnce;

    todos.reset([
      { text: 'Take car for service' },
      { text: 'Make reservation for dinner' }
    ]);
    expect(resetCollectionCallback).to.have.been.calledOnce;

    todos.remove(todos.last());
    expect(removeModelCallback).to.have.been.calledOnce;

    todos.reset();
    expect(removeModelCallback).to.have.been.calledOnce;

    // collection.set(models, [options]) => test this?
  });
});