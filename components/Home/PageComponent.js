var React = require('react');
var moment = require('moment');

var BannerComponent = require('./BannerComponent');
var ChartComponent = require('./ChartComponent');
var TableComponent = require('./TableComponent');
var PersonalSectionComponent = require('./PersonalSectionComponent');
var MenuComponent = require('./MenuComponent');
var FundInfoComponent = require('./FundInfoComponent');
var ModalComponent = require('./ModalComponent');
var Utils = require('../../common/utils/UtilsNew');

var AutocompleteInputComponent = require('../../common/cards/AutoCompleteComponent/AutocompleteInputComponent.js');

var PageComponent = React.createClass({
	
    tagHistory:[],
    fundSelected:[],
    fundPrices:[],
	
//	serverURL: 'http://ec2-54-218-126-27.us-west-2.compute.amazonaws.com/projects/AGF/api/',
	serverURL: '/',
	
	brokers:["AGF","Fidelity"],

	getInitialState:function(){
        
		var _this = this
		
        return({
			
			loading: false,
			
			bannerMinimized: false,
			
			shouldChartUpdate:false,
			
			fundInfo_fundName:'',
			
			broker:'agf',
			
			userid: null,
			
			chartCollapse: false,
			
			table:{
				fundsByGrowth:{
					sortKey:'',
					scrollable: {staticCols:6},
					headers:[
						{
							key:'checkbox', 
							name:'', 
							static:true,
							formatter: function(value,row, rowIndex)
							{
								return <input type="checkbox"
									name="fundCheckbox"
									className="fundCheckbox"
									value={row.shareID}
									checked={row.selected}
									key={rowIndex}
									onChange={_this.updateFundSelected.bind(null,row.shareID, row.shareCode, row.name,rowIndex)}
									/>
							}
						},
						{
							key:'name', 
							name:'Fund Name [Series]', 
							sort:'asc',
							cols:8,
							static:true,
							formatter: function(value,row, rowIndex){
																
								var link = "/fund/" + row.seriesName + "/" + row.shareCode
								
								return (
									<span className="fundName">{row.name} [{row.seriesName}]</span>
							)}
						},
						{
							key:'sharePrice_now', 
							name:'Price', 
							sort:'asc',
							cols:2,
							static:true,
							formatter: function(value,row){return value}
						},	
						{
							key:'priceChange', 
							name:'Change', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value,row){return _this.addGrowthColour(value)}
						},		
						{
							key:'growth_1mo', 
							name:'1 mo', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_3mo', 
							name:'3 mo', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_6mo', 
							name:'6 mo', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_1yr', 
							name:'1 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2yr', 
							name:'2 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_3yr', 
							name:'3 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_4yr', 
							name:'4 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_5yr', 
							name:'5 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_6yr', 
							name:'6 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_7yr', 
							name:'7 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_8yr', 
							name:'8 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_9yr', 
							name:'9 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_10yr', 
							name:'10 yr', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						}
					],
					data:[],
					compareData:[]
				},
				
				fundsByYear:{
					sortKey:'',
					scrollable: {staticCols:6},
					headers:[
						{
							key:'checkbox', 
							name:'', 
							static:true,
							formatter: function(value,row, rowIndex)
							{
								return <input type="checkbox"
									name="fundCheckbox"
									className="fundCheckbox"
									value={row.shareID}
									checked={row.selected}
									key={rowIndex}
									onChange={_this.updateFundSelected.bind(null,row.shareID, row.shareCode, row.name,rowIndex)}
									/>
							}
						},
						{
							key:'name', 
							name:'Fund Name [Series]',
							sort:'asc',
							cols:8,
							static:true,
							formatter: function(value,row, rowIndex){
											return (<span className="fundName">{row.name} [{row.seriesName}]</span>)
										}
//							formatter: function(value,row, rowIndex){return (<span onClick={_this.getFundHoldings.bind(null,value)} className="fundName">{row.name} [{row.seriesName}]</span>
//							)}
						},
						{
							key:'sharePrice_now', 
							name:'Price', 
							sort:'asc',
							cols:2,
							static:true,
							formatter: function(value,row){return value}
						},	
						{
							key:'priceChange', 
							name:'Change', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value,row){return _this.addGrowthColour(value)}
						},		
						{
							key:'growth_YTD', 
							name:'YTD', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2016', 
							name:'2016', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2015', 
							name:'2015', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2014', 
							name:'2014', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2013', 
							name:'2013', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2012', 
							name:'2012', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2011', 
							name:'2011', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2010', 
							name:'2010', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2009', 
							name:'2009', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2008', 
							name:'2008', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2007', 
							name:'2007', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2006', 
							name:'2006', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2005', 
							name:'2005', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2004', 
							name:'2004', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2003', 
							name:'2003', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2002', 
							name:'2002', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2001', 
							name:'2001', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
						{
							key:'growth_2000', 
							name:'2000', 
							sort:'asc',
							static:false,
							formatter: function(value,row){return _this.printFundGrowth(value)}
						},
					],
					data:[],
					compareData:[]
//					visible:true
				},
				
				fundsByPersonalSummary:{
					broker:'',
					sortKey:'',
					scrollable: false,
					headers:[
//						{
//							key:'edit', 
//							name:'',
//							static:true,
//							formatter: function(value, row, rowIndex)
//							{
//								return null
//							}
//						},
						{
							key:'name', 
							name:'Fund Name [Series]', 
							sort:'asc',
							cols:4,
							static:true,
							formatter: function(value,row, rowIndex)
							{
								return <span className="fundName" onClick={_this.getFundHoldings.bind(null,value)}>{row.name} [{row.series}]</span>
							}
						},
						{
							key:'sharePrice_now', 
							name:'Current Price', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return value
							}
						},	
						{
							key:'priceChange', 
							name:'Change', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value,row){return _this.addGrowthColour(value)}
						},
						{
							key:'amountPurchased', 
							name:'Purchase', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex)
							{
								return value == null ? 0 : value
							},
							formatter: function(value, row, rowIndex)
							{
								return value == null ? '---' : value
							}
						},
						{
							key:'amountExchanged', 
							name:'Exchange/ Rebalance', 
							cols:1,
							static:true,
							sort:'asc',
							formatter: function(value, row, rowIndex)
							{
								return value == null ? '---' : (value > 0 ? value : ("(" + parseFloat(-1*value).toFixed(2) + ")") )
							}
						},
						{
							key:'amountDistributed', 
							name:'Dividend/ Distribution', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex){return value > 0 ? value : 0},
							formatter: function(value, row, rowIndex)
							{
								return value > 0 ? value : '---'
							}
						},
						{
							key:'totalShares', 
							name:'Units', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return value > 0 ? value : '---'
							}
						},
						{
							key:'markvetValue', 
							name:'Market Value', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex)
							{
								return parseFloat( Math.round(row.totalShares * row.sharePrice_now * 100) /100).toFixed(2)
							},
							formatter: function(value, row, rowIndex)
							{
								return parseFloat( Math.round(row.totalShares * row.sharePrice_now * 100) /100).toFixed(2)
							}
						},
					],
					data:[],
					sumRow:true
				},
				
				fundsByPersonalTransactions:{
					broker:'',
					sortKey:'',
					scrollable: false,
					headers:[
						{
							key:'edit', 
							name:'',
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return (<div>
											<span title="edit fund" className="action-icon icon-edit" onClick={_this.editFund.bind(null,rowIndex)}></span>
											<span title="edit fund" className="action-icon icon-android-cancel" onClick={_this.removeFund.bind(null,rowIndex)}></span>
										</div>
										)
							}
						},
						{
							key:'name', 
							name:'Fund Name [Series]', 
							sort:'asc',
							cols:3,
							static:true,
							formatter: function(value,row, rowIndex)
							{
								return (<span className="fundName">{row.name} [{row.series}]</span>)
							}
						},
						{
							key:'datePurchased', 
							name:'Date Purchased', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return (<span>{moment(value,'YYYY-MM-DD').format("D MMM 'YY")}</span>)
							}
						},
			   			{
							key:'amountPurchased', 
							name:'Amount', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex){return value},
							formatter: function(value, row, rowIndex)
							{
								return (<span>{value == null ? '---' : (value > 0 ? value : ("(" + parseFloat(-1*value).toFixed(2) + ")") )}</span>)
							}
						},
						{
							key:'sharePricePurchased', 
							name:'Purchase Price', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return (<span>{value}</span>)
							}
						},
						{
							key:'sharePrice_now', 
							name:'Current Price', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								return (<span>{_this.returnCalculatedValue(rowIndex, value)}</span>)
							}
						},
						{
							key:'currentValue', 
							name:'Current Value', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex){									
								if(row.amountPurchased < 0)
									return row.amountPurchased
								
								return parseFloat( Math.round( row.sharePrice_now * (row.amountPurchased/row.sharePricePurchased) * 100) /100).toFixed(2)
							},
							formatter: function(value, row, rowIndex)
							{
//								if(row.sharePricePurchased == '') 
//									return (<span></span>)
								
								if(row.amountPurchased < 0)
									return (<span>---</span>)
						
								var val = parseFloat( Math.round( row.sharePrice_now * (row.amountPurchased/row.sharePricePurchased) * 100) /100).toFixed(2)
						
								return (<span>{_this.returnCalculatedValue(rowIndex, val)}</span>)
							}
						},
						{
							key:'growth', 
							name:'Growth Percent', 
							sort:'asc',
							cols:1,
							static:true,
							formatter: function(value, row, rowIndex)
							{
								if(row.amountPurchased < 0)
									return (<span>---</span>)
											
								var val = _this.printFundGrowth( Math.round((100*(row.sharePrice_now-row.sharePricePurchased)/row.sharePricePurchased)*100) /100)
								return (<div>{_this.returnCalculatedValue(rowIndex, val)}</div>)
							}
						},
						{
							key:'growthAmount', 
							name:'Growth Amount', 
							sort:'asc',
							cols:1,
							static:true,
							sum:true,
							sumFormatter: function(value, row, rowIndex){
								return (row.sharePrice_now*(row.amountPurchased/row.sharePricePurchased) - row.amountPurchased)
							},
							formatter: function(value, row, rowIndex)
							{
								if(row.amountPurchased < 0)
									return (<span>---</span>)
											
								var val = _this.printFundGrowth(row.sharePrice_now*(row.amountPurchased/row.sharePricePurchased) - row.amountPurchased)
								return val
							}
						}
					],
					data:[],
					sumRow:true
				}
				
			},
			
			pages: [{key:'fundsByGrowth', title:'Compound Returns'},
					{key:'fundsByYear', title:'Calendar Returns'},
//					{key:'fundInfo', title:'Fund Info'},
					{key:'personalSection', title:'Investments'}],
			
			activePage:'fundsByGrowth',
						
            fundPrices: [],	//used for the chart
			
			startInvesting: false
        })
    },
	componentDidMount: function(){
        this.getBrokerData();
        window.addEventListener("resize", this.updateDimensions);
		window.addEventListener('scroll', this.handleScroll);
//        this.getFundsByPersonalTransactionsJSON();
//        this.getFundsByPersonalSummaryJSON();
	},
	
    componentWillUnmount: function() {
        window.removeEventListener("resize", this.updateDimensions);
        window.removeEventListener("scroll", this.handleScroll);
    },
		
		
	/*----------------- FUNCTIONS FOR POPULATING PERSONAL SECTION COMPONENT ---------------------------*/
	/*------------------------------- FUNCTIONS TO CALCULATE FUND GROWTH AND ABSOLUTE VALUES ------------------------------- */
	
	editFund: function(rowIndex){
		this.refs.personalSection.editFund(rowIndex)
	},
		
	removeFund: function(rowIndex){
		this.refs.personalSection.removeFund(rowIndex)
	},
		
	/*getCurrentPriceAndChange: function(row){
		var current = row.sharePrice_now
		var prev = row.sharePrice_previous
		
		var change = this.addGrowthColour(current - prev)
				
		return (<span>{change}</span>)
		
	},*/
		
	returnCalculatedValue: function(rowIndex, value){
		
		if(this.state.table.fundsByPersonalTransactions.data[rowIndex].sharePricePurchased == "" || this.state.table.fundsByPersonalTransactions.data[rowIndex].sharePricePurchased == null){
			return ""
		}
		return value
	},
		
	printFundGrowth:function(value){
						
		return value == null ? '---' : this.addGrowthColour(value)
	},	
		
	
	addGrowthColour: function(value){
//		var arrowClass = '';
		var numberClass = '';
		
		if(value < 0) numberClass = 'negative'
		else if (value > 0) numberClass = 'positive'
		
		//get the absolute value without the sign rounded to 2 decimal places
		var valString = parseFloat(Math.abs(value)).toFixed(2)
		
//		return (<span className={"arrow-icon-div " + numberClass}>{valString}</span>);
		return (<span className={numberClass}>{valString}</span>);
		
	},
    
	/*----------------- FUNCTIONS FOR POPULATING PERSONAL SECTION COMPONENT ---------------------------*/
	/*********************************************************************************************************/
	
				
	/*----------------- FUNCTIONS TO HADNLE THE UI RESPONSE ON THE PAGE ---------------------------*/
	
	handleScroll: function(){
		var scrollPos = $(document).scrollTop()
		
		
		if(scrollPos > 50 & !this.state.bannerMinimized){
			this.toggleBanner()
		} else if (scrollPos <= 50 & this.state.bannerMinimized){
			this.toggleBanner()
		}
		
		
	},
	
	toggleBanner: function(){
		
		this.setState({bannerMinimized: !this.state.bannerMinimized}, function(){
			if(this.state.bannerMinimized){
				$( ".banner" ).addClass("bannerCollapsed", 100);
			} else {
				$( ".banner" ).removeClass( "bannerCollapsed", 100 );
			} 
		})
	},
	
    updateDimensions: function() {
		
		this.setState({
			shouldChartUpdate:true
		  }, 
		  function(){this.setState({shouldChartUpdate:false})}
		 )
    },
	
	showLoader: function(){
		this.setState({loading:true})
	},
	
	hideLoader: function(){
		this.setState({loading:false})
	},
	
	
    
	collapsePanel: function(){
		
		this.setState({chartCollapse: !this.state.chartCollapse}, function(){
			if(this.state.chartCollapse){
				$( ".collapsiblePanel" ).addClass("collapsed", 1000);
			} else {
				$( ".collapsiblePanel" ).removeClass( "collapsed", 1000 );
			} 
		})
	},
	
	/*----------------- FUNCTIONS TO HADNLE THE UI RESPONSE ON THE PAGE ---------------------------*/    
	/*********************************************************************************************************/
	
    
	getBrokerData: function(){
		
		this.showLoader();
		
		this.getFundsByGrowthJSON();
        this.getFundsByYearJSON();
		
		if(this.state.userid != null){
			Utils.isTokenValid(this.state.broker, this.downloadPersonalData, false)
		}
	},
	
	getFundHoldings: function(shareName){
		
		this.setState(function(previousState,currentProps){
			previousState.fundInfo_fundName = shareName
			previousState.activePage = 'fundInfo'
		})
	},
	
	
	/*----------------- FUNCTIONS TO GET THE DATA FROM THE SERVER ON INITIAL LOAD ---------------------------*/
    
		
	//Gets the entire funds List from the server
    getFundsByGrowthJSON: function(){
		
		var _this = this
		
//		var url = this.serverURL + 'funds-by-growth.php?dbName=' + this.state.broker
		var url = this.serverURL + 'funds_by_growth/' + this.state.broker
				
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {}
        };
        
        $.ajax(settings).done(function (response) {
			
            this.setState(function(previousState,currentProps){				
				
				previousState.loading = false
				
				var funds_JSON = JSON.parse(response);
				
				funds_JSON.map(function(fund,index){
					fund.selected = false
					
					fund.growth_1mo = _this.calculateGrowth(fund.sharePrice_1mo, fund.sharePrice_now)
					fund.growth_3mo = _this.calculateGrowth(fund.sharePrice_3mo, fund.sharePrice_now)
					fund.growth_6mo = _this.calculateGrowth(fund.sharePrice_6mo, fund.sharePrice_now)
					fund.growth_1yr = _this.calculateGrowth(fund.sharePrice_1yr, fund.sharePrice_now)
					fund.growth_2yr = _this.calculateGrowth(fund.sharePrice_2yr, fund.sharePrice_now)
					fund.growth_3yr = _this.calculateGrowth(fund.sharePrice_3yr, fund.sharePrice_now)
					fund.growth_4yr = _this.calculateGrowth(fund.sharePrice_4yr, fund.sharePrice_now)
					fund.growth_5yr = _this.calculateGrowth(fund.sharePrice_5yr, fund.sharePrice_now)
					fund.growth_6yr = _this.calculateGrowth(fund.sharePrice_6yr, fund.sharePrice_now)
					fund.growth_7yr = _this.calculateGrowth(fund.sharePrice_7yr, fund.sharePrice_now)
					fund.growth_8yr = _this.calculateGrowth(fund.sharePrice_8yr, fund.sharePrice_now)
					fund.growth_9yr = _this.calculateGrowth(fund.sharePrice_9yr, fund.sharePrice_now)
					fund.growth_10yr = _this.calculateGrowth(fund.sharePrice_10yr, fund.sharePrice_now)
				})
				
                previousState.table.fundsByGrowth.data = funds_JSON
            })
            
        }.bind(this)).fail(function (error) {
			this.hideLoader()
            console.log(error);
        }.bind(this));
    },
	
	getFundsByYearJSON: function(){
		
		var _this = this
		
        var settings = {
            "async": true,
            "crossDomain": true,
//            "url": this.serverURL + 'funds-by-year.php?dbName=' + this.state.broker,
            "url": this.serverURL + 'funds_by_year/' + this.state.broker,
            "method": "GET",
            "headers": {}
        };
        
        $.ajax(settings).done(function (response) {			
            
            this.setState(function(previousState,currentProps){
				var fundsbyYear_JSON = JSON.parse(response);
			
				previousState.loading = false	
				
				fundsbyYear_JSON.map(function(fund,index){
					fund.selected = false
					fund.growth_YTD = _this.calculateGrowth(fund.sharePrice_2017, fund.sharePrice_now)
					fund.growth_2016 = _this.calculateGrowth(fund.sharePrice_2016, fund.sharePrice_2017)
					fund.growth_2015 = _this.calculateGrowth(fund.sharePrice_2015, fund.sharePrice_2016)
					fund.growth_2014 = _this.calculateGrowth(fund.sharePrice_2014, fund.sharePrice_2015)
					fund.growth_2013 = _this.calculateGrowth(fund.sharePrice_2013, fund.sharePrice_2014)
					fund.growth_2012 = _this.calculateGrowth(fund.sharePrice_2012, fund.sharePrice_2013)
					fund.growth_2011 = _this.calculateGrowth(fund.sharePrice_2011, fund.sharePrice_2012)
					fund.growth_2010 = _this.calculateGrowth(fund.sharePrice_2010, fund.sharePrice_2011)
					fund.growth_2009 = _this.calculateGrowth(fund.sharePrice_2009, fund.sharePrice_2010)
					fund.growth_2008 = _this.calculateGrowth(fund.sharePrice_2008, fund.sharePrice_2009)
					fund.growth_2007 = _this.calculateGrowth(fund.sharePrice_2007, fund.sharePrice_2008)
					fund.growth_2006 = _this.calculateGrowth(fund.sharePrice_2006, fund.sharePrice_2007)
					fund.growth_2005 = _this.calculateGrowth(fund.sharePrice_2005, fund.sharePrice_2006)
					fund.growth_2004 = _this.calculateGrowth(fund.sharePrice_2004, fund.sharePrice_2005)
					fund.growth_2003 = _this.calculateGrowth(fund.sharePrice_2003, fund.sharePrice_2004)
					fund.growth_2002 = _this.calculateGrowth(fund.sharePrice_2002, fund.sharePrice_2003)
					fund.growth_2001 = _this.calculateGrowth(fund.sharePrice_2001, fund.sharePrice_2002)
					fund.growth_2000 = _this.calculateGrowth(fund.sharePrice_2000, fund.sharePrice_2001)
				})
				
                previousState.table.fundsByYear.data = fundsbyYear_JSON
            })
            
        }.bind(this)).fail(function (error) {
			this.hideLoader()
            console.log(error);
        }.bind(this));
    },
	
	calculateGrowth: function(valueStart, valueEnd){
		var val = Math.round(10000*(parseFloat(valueEnd)-parseFloat(valueStart))/parseFloat(valueStart))/100
		return isNaN(val) ? null : val
	},
	
	
	/*----------------- FUNCTIONS TO GET THE DATA FROM THE SERVER ON INITIAL LOAD ---------------------------*/
	/*********************************************************************************************************/
	

	
	
	/*----------------- FUNCTIONS TO GET THE DATA FOR SELECTED FUNDS FROM THE SERVER ---------------------------*/
	//Gets data for selected funds
    fetchFundData: function(){
        
        //empty fundPrices
        this.fundPrices = []
                
        var _this=this
        
        //call getDataForFund() to get price info for the selected funds
        this.fundSelected.map(function(fund, fundIndex){
            _this.getDataForFund(fund)
        })
    },
    
	//Gets data for specific fund
    getDataForFund: function(fund){ 
		
		this.setState({loading:true})
        
        var startDate = '2000-01-01'
        var endDate = '2016-11-01'
        
        var endDate = new Date().toISOString().slice(0,10);
		
        
        var settings = {
            "async": true,
            "crossDomain": true,
//            "url": this.serverURL + 'historical-prices.php?shareID='+fund.fundID+'&startDate='+startDate+'&endDate='+endDate+'&series=A&dbName=' + this.state.broker,
            "url": this.serverURL + 'historical_prices/' + fund.fundID + "/" + startDate + "/" + endDate + "/" + "A" + "/" +  this.state.broker,
            "method": "GET",
            "headers": {}
        };
		
        var _this = this;

        $.ajax(settings).done(function (response) {            
            
            //create a series object and push it into fundPrices
            var series = {name:fund.fundName, data:JSON.parse(response)}           
            
            _this.fundPrices.push(series)
            
            //when the number of objects in funPrices and fundSelected are equal, i.e. data for all selected funds have been fetched,
            //update state.fundPrices
			//set shouldChartUpdate to true so that the chart can update (shouldChartUpdate is used in shouldComponentUpdate of chartComponent)
			//then reset it to false
            if(_this.fundPrices.length == _this.fundSelected.length){                
                this.setState({
					fundPrices:_this.fundPrices,
					shouldChartUpdate:true,
					loading:false
				  }, 
				  function(){this.setState({shouldChartUpdate:false})}
				 )
            }

        }.bind(this)).fail(function (error) {
            console.log(error);
			this.hideLoader()

        }.bind(this));
        
    },
	
	/*----------------- FUNCTIONS TO GET THE DATA FOR SELECTED FUNDS FROM THE SERVER ---------------------------*/
	/*********************************************************************************************************/
	
	
	
	
	/*----------------- FUNCTIONS TO ADD OR REMOVE FUNDS FROM THE AUTOCOMPLETE ---------------------------*/
	
	addToken: function(token){
        this.fundSelected.push({fundID:token.shareID, fundName:token.name})
		
		//when token is added in the autocomplete, call updateSelectedValueOfFund() to update it's selected value to true
		this.updateSelectedValueOfFund(token.name)
		
		this.updateTagHistory()
    },
    
    removeToken: function(token){
        this.fundSelected = this.fundSelected.filter(function(el){return el.fundName != token})
		
		//when token is removed in the autocomplete, call updateSelectedValueOfFund() to update it's selected value to false
		this.updateSelectedValueOfFund(token)		
		
		this.updateTagHistory()
    },
		
	removeAllTokens: function(){
		
		var _this=this
		
		this.fundSelected.map(function(fund,key){		
			_this.updateSelectedValueOfFund(fund.fundName,false)
		}, function(){
			_this.fundSelected = []
			_this.updateTagHistory()
		})
		
	},
	
	updateTagHistory:function(){
		var _this=this
		
		this.tagHistory = []
		
		this.fundSelected.map(function(fund,key){
			_this.tagHistory.push({name:fund.fundName})
		})
	},
	
	/*----------------- FUNCTIONS TO ADD OR REMOVE FUNDS FROM THE AUTOCOMPLETE ---------------------------*/
    /*********************************************************************************************************/
	
	
	
	/*----------------- FUNCTIONS TO UPDATE VALUE OF CHECKBOXES ---------------------------*/
		
	//called when checkbox is toggled
    updateFundSelected: function(fundID, fundCode, fundName, fundIndex, event){
		
        //check if the fund is already in the list; if it exists remove it, else add it 
		//add or remove the fund to the autocomplete list, which in turn will toggle the checkbox to the correct value
        if(event.target.checked){
			this.refs.autocomplete.onTokenAdd(fundName)
		}
        else{
			this.refs.autocomplete.onTokenRemove(fundName)
		}
    },
	
	
	//called when fund is added/removed in autocomplete get the index of the fund with the matching fundName, and update it's selected value
	updateSelectedValueOfFund: function(fundName){
						
		var compoundIndex = this.state.table.fundsByGrowth.data.findIndex(x => x.name==fundName);
		var calendarIndex = this.state.table.fundsByYear.data.findIndex(x => x.name==fundName);
		
		this.setState(function(previousState,currentProps){
			previousState.table.fundsByGrowth.data[compoundIndex].selected = !previousState.table.fundsByGrowth.data[compoundIndex].selected
			previousState.table.fundsByYear.data[calendarIndex].selected = !previousState.table.fundsByYear.data[calendarIndex].selected
		})
	},
	/*----------------- FUNCTIONS TO UPDATE VALUE OF CHECKBOXES ---------------------------*/
    /*********************************************************************************************************/
	
    
	
	
	sortFunds: function(tableKey, headerKey){
				
		var funds = this.state.table[tableKey].data		
		
		var headers = this.state.table[tableKey].headers;					
		
		var index = headers.findIndex(x => x.key==headerKey);
				
		if(headerKey == 'name' || headerKey == 'datePurchased'){
			
			if(headers[index]['sort'] == 'desc'){
				funds.sort(function(a, b){
					if(a[headerKey] < b[headerKey]) return -1;
					if(a[headerKey] > b[headerKey]) return 1;
					return 0;
				})

				headers[index]['sort'] = 'asc'
			}
			else{
				funds.sort(function(a, b){
					if(a[headerKey] > b[headerKey]) return -1;
					if(a[headerKey] < b[headerKey]) return 1;
					return 0;
				})

				headers[index]['sort'] = 'desc'
			}

		} else {			
			
			if(headers[index]['sort'] == 'asc'){
				funds.sort(function(a,b) {						
					return b[headerKey] - a[headerKey]
				});

				headers[index]['sort'] = 'desc'
			}
			else{
				funds.sort(function(a,b) {				
					return a[headerKey] - b[headerKey]
				});

				headers[index]['sort'] = 'asc'
			}
			
		}		
				
		this.setState(function(previousState,currentProps){
			previousState.table[tableKey].data = funds
			previousState.table[tableKey].sortKey = headerKey
			previousState.table[tableKey].headers = headers
		})
	},
	

	pageHandler: function(itemIndex){
		this.setState({activePage: this.state.pages[itemIndex].key})
	},
		
	toggleBroker: function(){
		if(this.state.broker == 'agf'){
			this.setState({broker:'fidelity'},function(){this.getBrokerData()}.bind(this))
		}
		else this.setState({broker:'agf'},function(){this.getBrokerData()}.bind(this))
	},
		
	updateBroker: function(brokerIndex){
		
		if(this.brokers[brokerIndex].toLowerCase() != this.state.broker){
			
			//remove the tags from the autocomplete (won't come into effect till a re-render is calledx)
			this.fundSelected = []
			this.updateTagHistory()
		
			this.setState({broker: this.brokers[brokerIndex].toLowerCase()}, function(){this.getBrokerData()}.bind(this))	
		}
	},
		
		
	/*----------------- RETREIVE AND UPDATE PERSONAL DATA ---------------------------*/
		
	downloadPersonalData: function(userid, personalSummary, personalTransactions){
								
		this.setState(function(previousState,currentProps){
			previousState.loading = false
			previousState.userid = userid
			previousState.table.fundsByPersonalSummary.data = personalSummary
			previousState.table.fundsByPersonalTransactions.data = personalTransactions
			
		})
		
	},	
		
	//get the personal summary for specified date
	getPersonalDataForDate: function(date){
		
		if(this.state.userid != null){
			Utils.isTokenValid(this.state.broker, this.setPersonalDataForDate, this.showLoader, date)
		}
		
	},
		
	//update the dom with the new data
	setPersonalDataForDate: function(userid, personalSummary){
		
		this.setState(function(previousState,currentProps){
			previousState.loading = false
			previousState.userid = userid
			previousState.table.fundsByPersonalSummary.data = personalSummary
		})
		
	},
		
	updateFund: function(rowIndex, series, name, type, date, amount){
				
		//when adding a new fund
		if(rowIndex == ""){
			this.getFundPurchasePriceForDate(rowIndex, series, name, type, date, amount)
		} else {
			
			//changing series, fund name, or date for existing fund
			if(this.state.table.fundsByPersonalTransactions.data[rowIndex].series != series ||
				this.state.table.fundsByPersonalTransactions.data[rowIndex].name != name ||
				this.state.table.fundsByPersonalTransactions.data[rowIndex].datePurchased != date)
				{					
				
					this.getFundPurchasePriceForDate(rowIndex, series, name, type, date, amount)
				
				} else {
				
					this.setState(function(previousState,currentProps){	
						previousState.table.fundsByPersonalTransactions.data[rowIndex].transactionType = type
						previousState.table.fundsByPersonalTransactions.data[rowIndex].amountPurchased = amount
					
					})
				}
		}
	},
		
	getFundPurchasePriceForDate: function(rowIndex, series, name, type, date, amount){
		
		this.showLoader()
		
		var data = {sdate:date, name:name, series:series, broker:this.state.broker}
	
        var settings = {
            "async": true,
            "crossDomain": true,
//            "url": this.serverURL + 'fund-price.php?date='+date+'&name='+name+'&series='+series+'&broker='+this.state.broker,
            "url": this.serverURL + 'fund_price',
            "method": "POST",
			"data": data,
            "headers": {}
        };
        
		//update the state.table
        $.ajax(settings).done(function (response) {
			
			this.hideLoader()
			
			var response_JSON = JSON.parse(response);
			
			var funds = this.state.table.fundsByPersonalTransactions.data
			
			if(rowIndex+'' == ''){
				
				funds.push(
					{
						series:series,
						name:name, 
						transactionType:type,
						datePurchased:response_JSON[0].date, 
						amountPurchased:amount, 
						sharePricePurchased: response_JSON[0].sharePurchasedPrice, 
						sharePrice_now: this.getSharePrice(name, this.state.table.fundsByGrowth.data)
					}
				)
			}
			else{
				
				funds[rowIndex].seriesName = series
				funds[rowIndex].name = name
				funds[rowIndex].transactionType = type
				funds[rowIndex].datePurchased = response_JSON[0].date
				funds[rowIndex].amountPurchased = amount
				funds[rowIndex].sharePricePurchased = response_JSON[0].sharePurchasedPrice
				funds[rowIndex].sharePrice_now = this.getSharePrice(name, this.state.table.fundsByGrowth.data)
								
			}
			
			//sort funds by descending order of date
			funds.sort(function(a,b) {					
				return new Date(b.datePurchased) - new Date(a.datePurchased);
			});
			
			this.setState(function(previousState,currentProps){	
				previousState.table.fundsByPersonalTransactions.data = funds
			}/*, function(){console.log(this.state.table.fundsByPersonalTransactions)}*/)
			            
        }.bind(this)).fail(function (error) {
            console.log(error);
			this.hideLoader()
        }.bind(this));
    },		
		
	getSharePrice: function(fundName, options){	
		var fundIndex = options.findIndex(x => x.name==fundName)
		return options[fundIndex].sharePrice_now	
	},
		
	sortPersonalTransactions: function(){
	
		var funds = this.state.table.fundsByPersonalTransactions.data
			
		funds.sort(function(a,b) {						
//			return b['datePurchased'] - a['datePurchased']
			return new Date(b.datePurchased) - new Date(a.datePurchased);
		});
				
	},
		
			
		
	savePersonalFund: function(){
		
		this.showLoader()
		
		var token = Utils.getCookieIfExists("token");
		
		if(!token) return

		var data = {token:token, broker:this.state.broker, funds:this.state.table.fundsByPersonalTransactions.data}
		
		var settings = {
            "async": true,
            "crossDomain": true,
//            "url": this.serverURL + 'save-personal-data.php',
            "url": this.serverURL + 'save_personal_data',
            "method": "POST",
			"data": data,
            "headers": {}
        };
        
		//update the state.table
        $.ajax(settings).done(function (response) {
						
			this.hideLoader()
            
        }.bind(this)).fail(function (error) {
            console.log(error);
			this.hideLoader()
        }.bind(this));
	},
		
		
	/*----------------- RETREIVE AND UPDATE PERSONAL DATA ---------------------------*/
    /*********************************************************************************************************/
	
	logout:function(){
		Utils.setCookie("token", "", 0)
		Utils.setCookie("userid", "", 0)
		this.setState({userid:null})
	},
		
	goToInvestments: function(){
		this.pageHandler(2);
	},
		
	startInvesting: function(){
		this.setState({startInvesting: true})
	},
		
	closeModal: function(){
		this.setState({startInvesting: false})
	},

	render:function(){
		
		var _this = this
		
		return(
            <div>
                <BannerComponent minimized={this.state.bannerMinimized} userid={this.state.userid} logout={this.logout} login={this.goToInvestments} startInvesting={this.startInvesting}/>
			
                <div className='content-container'>
			
					<div className="collapsiblePanelContainer">
						<div className="collapsiblePanel">
							<ChartComponent key={'chart1'} fundPrices={this.state.fundPrices} shouldUpdate={this.state.shouldChartUpdate}/>

							<div className='autocomplete_box'>
								<div className="ACbuttonbox">
									<div className="FA-button fetchFundData" onClick={this.fetchFundData}>GO</div>
								</div>
								<AutocompleteInputComponent
									ref='autocomplete'
									type='tokenizer'
									key={'autocomplete'}
									options={this.state.table.fundsByGrowth.data}
									tagHistory={this.tagHistory}
									addToken_callback={this.addToken}
									onEnter={this.fetchFundData}
									placeholder={'Select Funds'}
									removeToken_callback={this.removeToken}/>
							</div>
						</div>
			
						<div className="collapsibleButtonContainer" >
							<div className="collapsibleButton" onClick={this.collapsePanel}>
								<span className={this.state.chartCollapse ? "icon-arrow-dropdown":"icon-up-arrow"} />
							</div>
						</div>
			
					</div>
			
					<div className="brokerListContainer">
						<div className="brokerList">
							{this.brokers.map(function(broker,brokerIndex){
								return (<div key={brokerIndex}
											className={"brokerTab" + (_this.brokers[brokerIndex].toLowerCase() == _this.state.broker ? " active":"")}
											onClick={_this.updateBroker.bind(null,brokerIndex)}>{broker}
										</div>)
							})}
						</div>
					</div>
						
						
									
					<div className="container">
						
						<div className="notice">Growth is calculated after MER deductions</div>
						
						<div className="pagesContainer">
							<MenuComponent pages={this.state.pages} pageHandler={this.pageHandler} activePage={this.state.activePage}/>

							{(this.state.activePage == 'fundsByGrowth'|| this.state.activePage == 'fundsByYear') ? 
								<TableComponent 
									table={this.state.table[this.state.activePage]}
									compareRows={true}
									sortFundsCallback={this.sortFunds.bind(null,this.state.activePage)}/>
								: null
							}

							{this.state.activePage == 'personalSection' ? 
								<PersonalSectionComponent 
									ref='personalSection'
									broker={this.state.broker}
									options={this.state.table.fundsByGrowth.data}
									userid={this.state.userid}
									personalTransactionsTable={this.state.table.fundsByPersonalTransactions}
									personalSummaryTable={this.state.table.fundsByPersonalSummary}
									sortFundsCallback={this.sortFunds}
									downloadPersonalData={this.downloadPersonalData}
									getPersonalDataForDate={this.getPersonalDataForDate}
									updateFund={this.updateFund}
									getFundHoldings={this.getFundHoldings}
									savePersonalFund={this.savePersonalFund}
									showLoader={this.showLoader}
									hideLoader={this.hideLoader}/> 
								: null
							}

							{this.state.activePage == 'fundInfo' ? 
								<FundInfoComponent 
									options={this.state.table.fundsByGrowth.data} 
									fundName={this.state.fundInfo_fundName}
									showLoader={this.showLoader}
									hideLoader={this.hideLoader}/> 
								: null
							}

						</div>
                	</div>
					
					{this.state.loading ? 
					 	<div className="loaderContainer">
							<div className="cs-loader">
								<div className="cs-loader-inner">
									<span>loading</span>
									<div>
										<label>●</label>
										<label>●</label>
										<label>●</label>
										<label>●</label>
										<label>●</label>
										<label>●</label>
									</div>
								</div>
							</div> 
						</div> 
						: null
					}
					
					{this.state.startInvesting ? <ModalComponent closeModal={this.closeModal}/> : null}
					
                </div>
            
			</div>
		)

	}

});


module.exports = PageComponent;
