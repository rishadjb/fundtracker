var React = require('react');
var ReactDOM = require('react-dom');
var PageComponent  = require('./PageComponent');

if (document.getElementById('template')) {
 ReactDOM.render(<PageComponent />,document.getElementById('template'));
}