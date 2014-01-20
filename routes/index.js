
/*
 * GET home page.
 */

exports.index = function(req, res) {
  res.render('index', { title: 'UI: Backbone & Node' });
};

exports.basics = function(req, res) {
  res.render('basics', { title: 'Backbone Basics' });
};

exports.todo = function(req, res) {
  res.render('todo', { title: 'Todo App' });
};