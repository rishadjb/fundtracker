/*
 * This component shows the live chart for a stock
 */

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var LiveChartUtils = require('./LiveChartUtils');
var UtilsStocks = require('../../common/utils/UtilsStocks');
var ChartComponent = require('./ChartComponent');
var StockInfoComponent = require('../Home/StockInfoComponent');

var PageComponent = React.createClass({

   timezone_offset: 0,
     
   getInitialState:function(){

     return({
       processRequest: true, 
       shouldLiveChartUpdate: false,
       filterTimestamp:0,               
       loading: false,            
       data: [],
       liveChartData: [],
       stockInfo:{structure:[]},
     })
   },
    
   componentDidMount: function(){
    // var filterTimestamp = Math.round((new Date()).getTime() / 1000) - 86400; 
    var filterTimestamp = 0; 
    if(this.state.processRequest){

       UtilsStocks.fetchStockInfo(this,ticker)        
       LiveChartUtils.fetchData(this, ticker, filterTimestamp);
    }
    var intervalId = setInterval(this.setTimer, 20000);
    this.setState({intervalId: intervalId});
   }, 

  componentWillUnmount: function() {
    clearInterval(this.state.intervalId);
  },

  setTimer: function(){
    LiveChartUtils.fetchData(this, ticker, this.state.filterTimestamp);
  },
  
  render:function(){      
    return(
      <div className='content-container'>

        <StockInfoComponent key={'stockInfo'} 
          stockInfo={this.state.stockInfo} 
          ticker={ticker}/>        
        <div className='spacer5'></div>

        <ChartComponent 
           key={'chart1'} 
           data_prices={this.state.liveChartData} 
           fetchUpdatedData={LiveChartUtils.fetchUpdatedData.bind(null,this,ticker)}
           shouldUpdate={this.state.shouldLiveChartUpdate}
           ticker={ticker}/>
      </div>
    )
  }
});

module.exports = PageComponent;