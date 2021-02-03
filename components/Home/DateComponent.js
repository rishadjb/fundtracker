var React = require('react');
var ReactDOM = require('react-dom');
var moment = require('moment');

var AutocompleteInputComponent = require('../../common/cards/AutoCompleteComponent/AutocompleteInputComponent.js');
var Utils = require('../../common/utils/Utils');
var confirm = require('../../common/modal/Confirm');

var PopupComponent = React.createClass({
	
	getInitialState: function(){
		
		var year = ''
		var month = ''
		var day = ''
		
		if(this.props.date != ''){
			year = moment(this.props.date,"YYYY-MM-DD").year()
			month = moment().month(moment(this.props.date,"YYYY-MM-DD").month()).format('MMM')
			day = moment(this.props.date,"YYYY-MM-DD").date()
		}
		
		
		return({
			day:day,
			month:month,
			year:year
		})
	},
	
	componentWillReceiveProps:function(newProps){
		
	},
	
	changeDate: function(event){
				
		if(this.state.year == "" ||this.state.month == "" ||this.state.day == "")
			return
		
		var date = this.state.year + "-" + moment().month(this.state.month).format('MM') + "-" + this.state.day
				
		//check if date is valid - changing Mar 31 to Feb 31 makes it invalid
		if(moment(date, 'YYYY-MM-DD').isValid()){
			this.props.onChange(moment(date,'YYYY-MM-DD').format('YYYY-MM-DD'))	
		}
	},
	
	changeYear:function(event){
		this.setState({year: event.target.value}, this.changeDate)
	},
	
	changeMonth:function(event){
		this.setState({month: event.target.value}, this.changeDate)
	},
	
	changeDay:function(event){
		this.setState({day: event.target.value}, this.changeDate)
	},
	
	getYears: function(){
		
		var options = [];
        options.push(<option key={'placeholder'} value="" disabled>{'Year'}</option>);
		
		for(var year=(new Date().getFullYear()); year>=1995; year--){
		 	options.push(<option key={year} value={year}>{year}</option>)
		}
		
		return(<select value={this.state.year} onChange={this.changeYear}>
				 {options}
				</select>)
	},

	
	getMonths: function(){
		
		var count = 0;		
		var months = [];
				
		while (count < 12) months.push(moment().month(count++).format("MMM"));
		
		var options = [];
        options.push(<option key={'placeholder'} value="" disabled>{'Month'}</option>);
					 
		return(<select value={this.state.month} onChange={this.changeMonth}>
					{options}
					{months.map(function(month,index){
						return <option key={month} value={month}>{month}</option>
					})}
				</select>)
	},
		
	getDates: function(){
		
		//get number of days in month
		//get index of first day = x
		
		//push x blank items into first row
		var totalDays = moment(this.state.year+"-"+this.state.month, "YYYY-MMM").daysInMonth()
		
		
		var options = [];
        options.push(<option key={'placeholder'} value="" disabled>{'Day'}</option>);
		
		for(var day=1; day<=totalDays; day++){
		 	options.push(<option key={day} value={day}>{day}</option>)
		}
		
		return(<select value={this.state.day} onChange={this.changeDay}>
				 {options}
				</select>)
	},

	render:function(){
		
		return(	<div className="datePicker">
			   		<div className="select">{this.getYears()}</div>
					<div className="select">{this.getMonths()}</div>
					<div className="select">{this.getDates()}</div>
				</div>
			  )
	}

});


module.exports = PopupComponent;
