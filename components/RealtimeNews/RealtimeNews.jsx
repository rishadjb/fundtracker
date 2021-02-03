var React = require('react');
var ReactDOM = require('react-dom');
var PageComponent  = require('./PageComponent');

if (document.getElementById('realtime_news')) {
	ReactDOM.render(<PageComponent />,document.getElementById('realtime_news'));
}