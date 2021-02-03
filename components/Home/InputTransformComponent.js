var React = require('react');

var InputRishComponent = require('./InputRishComponent.js');

//var Utils = require('../../common/utils/Utils');
//var confirm = require('../../common/modal/Confirm');

var InputTransformComponent = React.createClass({
	
	getInitialState: function(){
		return({
			value:this.props.value,
			spanVisible: (this.props.value == '' ? false : true),
			inputVisible: (this.props.value == '' ? true : false)
		})
	},
	
	componentWillReceiveProps:function(newProps){
		if(newProps.value == ''){
			
			this.setSpanAndInputVisibility(false, true, newProps.value)
		}
		else{
			this.setSpanAndInputVisibility(true, false, newProps.value)
		}
	},
	
	//activates the input field and hides the span 
	activateInput: function(){
		
		this.setState({
			//toggle the visibility of the input and span
			spanVisible:false,
			inputVisible:true,
		},function(){
			//focus on the end of the input text
			this.refs.inputComponent.onFocus()
//			this.refs.inputComponent.refs.autocompletetype.refs.autocomplete.refs.input.selectionStart=1000
		}.bind(this))
	},
	
	setSpanAndInputVisibility:function(spanVisible, inputVisible, value){
		
		this.setState(function(previousState,currentProps){
			value !== undefined ? (previousState.value = value) : null,
			previousState.spanVisible = spanVisible,
			previousState.inputVisible = inputVisible
		})
	},
	
	leaveInput: function(token){
		
//		console.log('leaveInput')
//		
//		console.log(token)
//		console.log(this.state.value)
		
		//if token is undefined, toggle states depending on value
		if(token == undefined){
			this.state.value == "" ? this.setSpanAndInputVisibility(false, true) : this.setSpanAndInputVisibility(true, false)
			return
		}
		
		this.props.onChange(token.name)
		
		this.setSpanAndInputVisibility(true, false)
	},
	

	render:function(){
		
		return(
			<div onClick={this.state.spanVisible ? this.activateInput : null}>
				<span className={this.state.spanVisible ? '' : 'invisible'}>{this.state.value}</span>
			
				<div className={this.state.inputVisible ? '' : 'invisible'}>
			
					<InputRishComponent 
						ref='inputComponent' 
						type={this.props.type}
						value={this.state.value}
						options={this.props.options} 
						addToken_callback={this.leaveInput} 
						onChange={this.props.onChange}
						onBlur={this.leaveInput}/>
			
				</div>
			
				
				
			</div>
	
		)
	}

});


module.exports = InputTransformComponent;
