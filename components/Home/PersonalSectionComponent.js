var React = require('react');
var TableComponent = require('./TableComponent');
var PopupComponent = require('./PopupComponent');
var LoginComponent = require('./LoginComponent');
var Utils = require('../../common/utils/UtilsNew');

//var DatePicker = require('react-datepicker');
var moment = require('moment');

//import 'react-datepicker/dist/react-datepicker.css';

var PersonalSectionComponent = React.createClass({
	
    getInitialState: function(){
		
		var _this = this
			
		return({
						
			showEditFundPopup: false,
			
			fund:{
				series:'',
				type:'',
				name:'',
				date:'',
				amount:'',
				rowIndex:''
			},
		
			table:{
				
				personalFundsSummary:this.props.personalSummaryTable,
				personalFunds:this.props.personalTransactionsTable,
				
			},
			
			personal_summary_date: '2017-06-06',     
		
		})
	},
	
	
	componentWillReceiveProps: function(newProps){		
		
		this.setState(function(previousState, currentProps){
			previousState.table.personalFundsSummary = newProps.personalSummaryTable
			previousState.table.personalTransactionsTable = newProps.personalTransactionsTable
		})
	},
	
	componentDidMount: function(){
		
		//if data isn't downloaded, download data is token is valid
		this.checkIfDataIsDownloaded() ? null : Utils.isTokenValid(this.props.broker, this.props.downloadPersonalData, this.props.showLoader)
	},
	
	
		
	/*------------------------------- ______________________________________________________ ------------------------------- */
	editFund: function(rowIndex){
		//show the editFund popup with the values from the row to be edited
					
		this.setState(function(previousState, currentProps){			
			previousState.showEditFundPopup = true
			previousState.fund.series = this.state.table.personalFunds.data[rowIndex].series
			previousState.fund.type = this.state.table.personalFunds.data[rowIndex].transactionType
			previousState.fund.name = this.state.table.personalFunds.data[rowIndex].name
			previousState.fund.date = this.state.table.personalFunds.data[rowIndex].datePurchased
			previousState.fund.amount = this.state.table.personalFunds.data[rowIndex].amountPurchased
			previousState.fund.rowIndex = rowIndex
		})
	},
	
	removeFund:function(rowIndex){
		
		this.setState(function(previousState, currentProps){	
			previousState.table.personalFunds.data.splice(rowIndex, 1)
		})
	},
		
	addFund: function(){
		this.setState(function(previousState, currentProps){			
			previousState.showEditFundPopup = true
			previousState.fund.series = ''
			previousState.fund.name = ''
			previousState.fund.type = ''
			previousState.fund.date = ''
			previousState.fund.amount = ''
			previousState.fund.rowIndex = ''
		})
	},
		
	updateFundByParent: function(rowIndex, series, name, type, date, amount){
				
		this.setState(function(previousState,currentProps){		
			previousState.showEditFundPopup = false
		})
		
		this.props.updateFund(rowIndex, series, name, type, date, amount)
		
	},
		
	cancelUpdate: function(){
		this.setState({showEditFundPopup: false})
	},
		
	/*------------------------------- ______________________________________________________ ------------------------------- */
		
	getSharePrice: function(fundName, options){	
		var fundIndex = options.findIndex(x => x.name==fundName)
		return options[fundIndex].sharePrice_now	
	},	
		
	/*------------------------------- ______________________________________________________ ------------------------------- */
		
	checkIfDataIsDownloaded: function(){
		if(this.state.table.personalFundsSummary.data.length == 0){			
			return false
		}
		return true
	},
		
	/*------------------------------- ______________________________________________________ ------------------------------- */
	
	updatePersonalSummaryDate: function(){
		this.setState({personal_summary_date: this.refs.summary_date.value});
	},

	render:function(){
				
		return(
			<div className='personalSection_container'>
			
			{this.props.userid != null ?
				<div>
					<div className="tableTitle">SUMMARY TABLE</div>
					
					<div>
						<input ref='summary_date' onChange={this.updatePersonalSummaryDate}/> 
						<div className="FA-button fetchFundData" onClick={this.props.getPersonalDataForDate.bind(null,this.state.personal_summary_date)}></div>
					</div>
					
					<TableComponent 
						table={this.state.table.personalFundsSummary}
						sortFundsCallback={this.props.sortFundsCallback.bind(null,'fundsByPersonalSummary')}/>

					<div className="tableTitle">TRANSACTIONS TABLE</div>
					<TableComponent 
						table={this.state.table.personalFunds}
						sortFundsCallback={this.props.sortFundsCallback.bind(null,'fundsByPersonalTransactions')}/>

					<div className="personalFunds_buttons">
						<div className="FA-button popup_button" onClick={this.addFund}>ADD</div>
						<div className="FA-button popup_button" onClick={this.props.savePersonalFund}>SAVE</div>
					</div>

					{this.state.showEditFundPopup ? 
					<div>
						<PopupComponent 
							broker={this.props.broker} 
							fund={this.state.fund} 
							options={this.props.options} 
							rowIndex={this.state.fund.rowIndex} 
							onSubmit={this.updateFundByParent} 
							onCancel={this.cancelUpdate}/>
					</div> : null
					}
				</div>
				:
				<LoginComponent downloadPersonalData={this.props.downloadPersonalData} broker={this.props.broker} showLoader={this.props.showLoader}  hideLoader={this.props.hideLoader} />
			
			
			}
			</div>
	
		)
	}

});


module.exports = PersonalSectionComponent;

				