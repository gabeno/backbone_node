'use strict';

var chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

var Backbone = require('backbone');
var _ = require('lodash/dist/lodash.underscore');

chai.use(sinonChai);

describe('Backbone.Events', function() {
  var myObj;

  beforeEach(function() {
    myObj = {};
    _.extend(myObj, Backbone.Events);
  });

  it('can extend javascript objects to support custom events', function() {
    expect(typeof myObj.on).to.equal('function'); // alias 'bind'
    expect(typeof myObj.bind).to.equal('function');

    expect(typeof myObj.off).to.equal('function'); // alias 'unbind'
    expect(typeof myObj.unbind).to.equal('function');

    expect(typeof myObj.trigger).to.equal('function');
    expect(typeof myObj.once).to.equal('function');
    expect(typeof myObj.listenTo).to.equal('function');
    expect(typeof myObj.listenToOnce).to.equal('function');
    expect(typeof myObj.stopListening).to.equal('function');
  });

  it('allows us to bind and trigger custom named events on an object', function() {
    var callback = sinon.spy();

    myObj.bind('custom event', callback);
    myObj.trigger('custom event');

    expect(callback).to.have.been.called; // called twice, why? 2 events: 'custom' and 'event'
    expect(callback).to.have.been.calledTwice;
  });

  it('can bind a callback only once', function() {
    var callback = sinon.spy();

    myObj.once('event1', callback);

    myObj.trigger('event1');
    expect(callback).to.have.been.calledOnce;

    myObj.trigger('event1');
    expect(callback).to.have.callCount(1); // NOTE: once not twice!!
  });

  it('can set up an object to listen on another\'s events', function() {
    var childObj = {};
    var childCallback = sinon.spy();
    var callback = sinon.spy();

    _.extend(childObj, Backbone.Events);

    childObj.on('child_event', childCallback);
    myObj.listenTo(childObj, 'child_event', callback);
    childObj.trigger('child_event');

    expect(callback).to.have.been.called;

    // stop listening
    myObj.stopListening(childObj);
    childObj.trigger('child_event');
    expect(callback).to.have.callCount(1); // should be 2 but since stopped listening, its only once!

  });

  it('passes along some arguments to the callback when an event is triggered', function() {
    var passedArgs = [];

    myObj.bind('some_event', function() {
      [].push.apply(passedArgs, arguments);
    });
    myObj.trigger('some_event', 'arg1', 'arg2', 'arg3');

    expect(passedArgs).to.eql(['arg1', 'arg2', 'arg3']);
  });

  it('can also bind the passed context to the event callback w/ bind method', function() {
    var foo = { color: 'green' };
    var changeColor = function() {
      this.color = 'yellow';
    };
    myObj.bind('change_color', changeColor, foo);
    // myObj.on('change_color', changeColor, foo); // also works

    expect(foo.color).to.be.equal('green');

    myObj.trigger('change_color'); // changeColor bound to foo upon event happening
    expect(foo.color).to.be.equal('yellow');
  });

  it('uses "all" as a special event name to capture all events bound to the object', function() {
    var callback = sinon.spy();

    myObj.bind('all', callback);
    myObj.trigger('event1 event2');

    expect(callback).to.have.been.calledTwice;

    // "all" — this special event fires for any triggered event, passing the event name as the first argument.
    expect(callback.getCall(0).args[0]).to.equal('event1');
    expect(callback.getCall(1).args[0]).to.equal('event2');
  });

  it('can remove custom events from objects', function() {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    var spy3 = sinon.spy();

    myObj.on('foo', spy1);
    myObj.on('bar', spy1);
    myObj.on('foo', spy2);
    myObj.on('foo', spy3);

    // unbind a single callback for the event
    myObj.off('foo', spy1);
    myObj.trigger('foo');
    // expect(spy1).to.not.have.been.called;
    expect(spy1).to.have.callCount(0);
    // expect(spy2).to.have.been.called;
    expect(spy2).to.have.callCount(1);
    // expect(spy3).to.have.been.called;
    expect(spy3).to.have.callCount(1);

    // remove all 'foo' callbacks
    myObj.off('foo');
    myObj.trigger('foo');
    expect(spy1).to.have.callCount(0);
    expect(spy2).to.have.callCount(1); // see comment below
    expect(spy3).to.have.callCount(1); // see comment below
    // spies don't reset their call counts between tests: => https://github.com/jashkenas/backbone/issues/2994

    // unbind all callbacks on object
    myObj.off();
    myObj.trigger('bar');
    expect(spy1).to.have.callCount(0);
  });
});