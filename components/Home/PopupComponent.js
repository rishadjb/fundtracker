var React = require('react');

var AutocompleteInputComponent = require('../../common/cards/AutoCompleteComponent/AutocompleteInputComponent.js');
var DateComponent = require('./DateComponent');

var PopupComponent = React.createClass({
	
	seriesOptions: [
		{broker:'Fidelity', series:[{name:'A'},{name:'B'}]},
		{broker:'AGF', series:[{name:'FOC'},{name:'AGF'}]}
	   ],
	
	getInitialState: function(){
		      
		
		return({
			series:this.props.fund.series,
			name:this.props.fund.name,
			type:this.props.fund.type,
			date:this.props.fund.date,
			amount:this.props.fund.amount,
			rowIndex:this.props.rowIndex
		})
	},
	
	componentWillReceiveProps:function(newProps){
		this.setState({
			series:newProps.fund.series,
			name:newProps.fund.name,
			type:newProps.fund.type,
			date:newProps.fund.date,
			amount:newProps.fund.amount,
			rowIndex:newProps.fund.rowIndex,
		})
	},
	
	changeFundName: function(token){
		this.setState({name: token.name})
	},
	
	changeSeries: function(token){
		this.setState({series: token.name})
	},
	
	changeType: function(event){
		this.setState({type: event.target.value})
	},
	
	changeDate: function(date){		
		this.setState({date:date})
	},	
	
	changeAmount: function(event){
		
//		if(RegExp(/	^(?:\d+\.?\d{0,2})?$/).test(event.target.value)){
		if(RegExp(/^\-?(?:\d+\.?\d{0,2})?$/).test(event.target.value)){
			var regeexp_val = event.target.value
		} else var regeexp_val = this.state.amount
		
		this.setState({amount:regeexp_val})
	},
	
	validateAmount: function(event){
		
		if(parseFloat(event.target.value) == 0){
			this.setState({amount:''})
		}
		
	},
	
	onSubmit: function(){
		
		if(this.state.name == '' || this.state.amount == '' || this.state.date == '')
			return			
		
		this.props.onSubmit(this.state.rowIndex, this.state.series, this.state.name, this.state.type, this.state.date, this.state.amount)
	},	

	render:function(){
		
		var seriesOptions = [];
		var _this = this
				
		this.seriesOptions.map(function(broker,index){
			if(broker.broker.toUpperCase() == _this.props.broker.toUpperCase()){
				seriesOptions = broker.series
			}
		})
				
		return(
			<div className="popup_container">
			
				<div className="popup_overlay"></div>
				
				<div  className="popup_dialogBoxContainer">
					<div  className="popup_dialogBox col-xs-4 col-xs-offset-4">
						<div className="popup_title">Transaction Details</div>
						<div className="popup_fields">

							<AutocompleteInputComponent
								key='series'
								ref='series'
								type="typeahead"
								placeholder={'Select Series'}
								defaultValue={this.state.series}
								options={seriesOptions}
								addToken_callback={this.changeSeries}/>

							<AutocompleteInputComponent
								key='name'
								ref='name'
								type="typeahead"
								placeholder={'Select Fund'}
								defaultValue={this.state.name}
								options={this.props.options}
								addToken_callback={this.changeFundName}/>

							<div className="transaction_container">
								<select value={this.state.type} onChange={this.changeType}>
									<option value="" disabled>Transaction Type</option>
									<option value="purchase">Purchase</option>
									<option value="exchange">Exchange</option>
									<option value="distribution">Distribution</option>
									<option value="rebalancing">Rebalancing</option>
									<option value="sale">Sale</option>
								</select>
							</div>
			
							<div className="date_container">
								<DateComponent date={this.state.date} onChange={this.changeDate}/>
							</div>

							<div className="amount_container">
								<input 
									key='amount'
									ref='amount'
									className={'popup_amount'}
									type={'text'}
									value={this.state.amount} 
									onChange={this.changeAmount}
									onBlur={this.validateAmount}
									placeholder={'Amount'}/>
							</div>

							<div  className="popup_buttonsContainer">

								<div className="FA-button popup_button" onClick={this.onSubmit}>Confirm</div>

								<div  className="FA-button popup_button cancel" onClick={this.props.onCancel}>Cancel</div>

							</div>


						</div>
			
					</div>
				</div>
			</div>
		  )
	}

});


module.exports = PopupComponent;
