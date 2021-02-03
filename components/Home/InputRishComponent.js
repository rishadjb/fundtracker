var React = require('react');
var ReactDOM = require('react-dom');

var AutocompleteInputComponent = require('../../common/cards/AutoCompleteComponent/AutocompleteInputComponent.js');
var Utils = require('../../common/utils/Utils');
var confirm = require('../../common/modal/Confirm');

var InputRishComponent = React.createClass({
	
	getInitialState: function(){
		return({
			value:this.props.value
		})
	},
	
	componentWillReceiveProps: function(newProps){
		this.setState({value:newProps.value})
	},
	
	onFocus: function(){
		
		if(this.props.type == 'autocomplete'){			
			var input = this.refs.autocomplete.refs.autocomplete.refs.input
//			this.refs.autocomplete.refs.autocomplete.refs.input.focus()
//			this.refs.autocomplete.refs.autocomplete.refs.input.selectionStart=1000
		}
		else if(this.props.type == 'text'){			
			var input = this.refs.text
//			this.refs.text.focus()
//			this.refs.text.selectionStart=1000
		}		
		
		input.focus()
		input.selectionStart=1000
	
	},
	
	//used for text fields, so that it doesn't onfocus for ever onchange
	changeInput: function(event){
		
		if(RegExp(/^(?:\d+\.?\d{0,2})?$/).test(event.target.value)){
			var regeexp_val = event.target.value
		} else var regeexp_val = this.state.value
		
		this.setState({value:regeexp_val})
	},
	
	onBlur:function(){
		this.props.onChange(this.state.value)
	},
	
	onKeyPress: function(e){
		if(e.which == 13){
			this.onBlur()
		}	
	},

	render:function(){
		
		return(<div>
			   {this.props.type == 'autocomplete' ?					
					<AutocompleteInputComponent
						ref='autocomplete'
						type="typeahead"
						defaultValue={this.props.value}
						options={this.props.options}
						addToken_callback={this.props.addToken_callback}
						placeholder={'Select Fund'}
						onBlur={this.props.onBlur}/> : null}
			   
			   {this.props.type == 'text' ?
					<input 
						ref='text'
						type={'text'}
						value={this.state.value} 
						onChange={this.changeInput}
			   			onKeyPress={this.onKeyPress}
						placeholder={'Enter Amount'}
						onBlur={this.onBlur}/> : null}
		</div>)
	}

});


module.exports = InputRishComponent;
