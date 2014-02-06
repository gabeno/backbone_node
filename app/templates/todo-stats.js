exports = [
  '<span id="todo-count"><strong><%= remaining %></strong> <%= remaining === 1 ? "item" : "items" %> left</span>',
  '<ul id="filters">',
  '<li><a class="selected" href="#/">All</a></li>',
  '<li><a href="#/active">Active</a></li>',
  '<li><a href="#/completed">Completed</a></li>',
  '</ul>',
  '<% if (completed) { %>',
  '<button id="clear-completed">Clear completed (<%= completed %>)</button>',
  '<% } %>'
].join('');