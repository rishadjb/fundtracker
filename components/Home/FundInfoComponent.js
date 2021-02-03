var React = require('react');

var AutocompleteInputComponent = require('../../common/cards/AutoCompleteComponent/AutocompleteInputComponent.js');
var TableComponent = require('./TableComponent');

var FundInfoComponent = React.createClass({
	
//	serverURL: 'http://ec2-54-218-126-27.us-west-2.compute.amazonaws.com/projects/AGF/api/',
	serverURL: '/',
	AJAXState:false,
	
	getInitialState: function(){	
		
		//Need to optimize the AJAX call; it is being everytime we go to the tab
		
//		this.getFundHoldings(this.props.fundName);
		
		return({
			fundName:this.props.fundName,
			table:{
				fundHoldings:{
					sortKey:'holdingPercent',
					headers:[
						
						{
							key:'holdingName', 
							name:'Holding Name', 
							cols:5,
							formatter: function(value,row, rowIndex)
							{
								return (<span>{value}</span>)
							}
						},
						{
							key:'holdingPercent', 
							name:'Percent', 
							cols:1,
							formatter: function(value, row, rowIndex)
							{
								return (<span>{value}</span>)
							}
						},
						{
							key:'holdingValue', 
							name:'Value', 
							cols:1,
							sort:'asc',
							formatter: function(value, row, rowIndex)
							{
								return (<span>{parseInt(value).toLocaleString()}</span>)
							}
						}
					],
					data:[]
				}
			}
		})	
	},
		
	componentDidMount: function(){
		this.getFundHoldings(this.props.fundName);
	},
	
	
	getFundHoldings: function(fundName){
		
		if(this.AJAXState) return
		
		console.log('getFundHoldings')
		
		if (fundName == '' || fundName === undefined) return
				
		this.props.showLoader();
		this.setState({fundName:fundName})
		
		var url = this.serverURL + 'fund_holdings/' + fundName
		
		var settings = {
			"async": true,
			"crossDomain": true,
			"url": url,
			"method": "GET",
			"headers": {}
		};

		$.ajax(settings).done(function (response) {
			
			this.AJAXState = false
			
			this.props.hideLoader();

	//		console.log(response)
			this.setState(function(previousState,currentProps){
				previousState.table.fundHoldings.data = JSON.parse(response)
			})

		}.bind(this)).fail(function (error) {
			
			console.log(error);
			this.AJAXState = false
			this.props.hideLoader()
			
		}.bind(this));	
	},
	
	sortFunds: function(test){},
		
	changeFundName: function(token){
		this.getFundHoldings(token.name)
	},
		
	render:function(){
		
		return(
			<div className='fundInfo_container'>
				
				<div className='autocomplete_box'>
					<AutocompleteInputComponent
						key='name'
						ref='name'
						type="typeahead"
						placeholder={'Select Fund'}
						defaultValue={this.state.fundName}
						options={this.props.options}
						addToken_callback={this.changeFundName}/>
				</div>
			
				{this.state.fundName == '' ? null :
			
				<TableComponent 
					table={this.state.table.fundHoldings}
					sortFundsCallback={this.sortFunds.bind(null,'personalFunds')}/>
				}
			</div>
	
		)
	}

});


module.exports = FundInfoComponent;
