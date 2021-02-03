var React = require('react');
var ReactDOM = require('react-dom');
var PageComponent  = require('./PageComponent');

if (document.getElementById('live_chart')) {
	ReactDOM.render(<PageComponent />,document.getElementById('live_chart'));
}