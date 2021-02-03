var React = require('react');
var ReactDOM = require('react-dom');
var PageComponent  = require('./PageComponent');

if (document.getElementById('allaction')) {
	ReactDOM.render(<PageComponent />,document.getElementById('allaction'));
}