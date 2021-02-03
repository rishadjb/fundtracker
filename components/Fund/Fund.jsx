var React = require('react');
var ReactDOM = require('react-dom');
var PageComponent  = require('./PageComponent');

if (document.getElementById('fund')) {
	console.log('funds')
	ReactDOM.render(<PageComponent  test='mytest'/>,document.getElementById('fund'));
}