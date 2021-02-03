/*
 * This component shows the action for a stock for a particular date
*/

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var UtilsStocks = require('../../common/utils/UtilsStocks');
var TableComponent = require('../Home/TableComponent');

var PageComponent = React.createClass({
	getInitialState:function(){
        var _this = this
        var processRequest = true;
		
        return({
            processRequest: processRequest,            
            loading: false,  
            intervalId: null,
            filterTimestamp:0,      
            data: [],
            data_prices: [],
            data_volume: [],

            table:{
                stocks:{
                    sortKey:'',
                    scrollable: {staticCols:12},
                    headers:[
                        {
                            key:'timestamp',  
                            name:'Time', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return _this.convertEpochToTime(value)}
                        },
                        {
                            key:'ticker', 
                            name:'Ticker',
                            class: 'text-left',
                            type:'link',
                            link: function(value,row){return 'all_action?ticker='+value},
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        }, 
                        {
                            key:'close', 
                            name:'Price', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },  
                        {
                            key:'headline', 
                            name:'News', 
                            class: 'text-left',
                            cols:12,
                            static:true,
                            formatter: function(value,row){return value}
                        },
                        /*{
                            key:'open', 
                            name:'Open', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },  
                        {
                            key:'high', 
                            name:'High',
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },
                        {
                            key:'low', 
                            name:'Low', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },*/ 
                        /*{
                            key:'volume', 
                            name:'Volume', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },*/
                    ],
                    subRows:[
                        {
                            key:'content',
                            formatter: function(value,row){return value}
                        }
                    ],
                    data:[],
                    compareData:[]
                }
            }
        })
    },
    
 componentDidMount: function(){
  var filterTimestamp = 0 //Math.round((new Date()).getTime() / 1000) - 86400;
  if(this.state.processRequest){            
     this.fetchData(filterTimestamp);
  }
  var intervalId = setInterval(this.testTimer, 20000);
  this.setState({intervalId: intervalId});
 },	

componentWillUnmount: function() {
  clearInterval(this.state.intervalId);
},

testTimer: function(){
  this.fetchData(this.state.filterTimestamp);
},

 convertEpochToTime: function(epochDate){
   var date = new Date(epochDate*1000)
   return UtilsStocks.formatNumberTo2Dgits(date.getHours()) + ":" + UtilsStocks.formatNumberTo2Dgits(date.getMinutes());
 },
   
 fetchData: function(timestamp = 0){
     var data = {timestamp:timestamp}
     var settings = UtilsStocks.getAjaxSettings('POST', 'get_realtime_news', data);
     UtilsStocks.makeAjaxRequest(this, settings, this.createDataArray, null);
 },

 createDataArray: function(data){
     /*var data_prices = [];
     var data_volume = [];

     var date1 = new Date(data[1].date*1000);
     var timezone_offset = date1.getTimezoneOffset();

     data.map(function(item,index){
         data_prices.push([(parseInt(item.date)-(timezone_offset*60))*1000, parseFloat(item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)])
         data_volume.push([(parseInt(item.date)-(timezone_offset*60))*1000, parseInt(item.volume)])
         item['perc_change'] = parseFloat(Math.round (100 * 100 * (parseFloat(item.close) - parseFloat(item.open))/parseFloat(item.open)) / 100).toFixed(2)
         item['amount_change'] = parseFloat(((parseFloat(item.close) - parseFloat(item.open)) )).toFixed(2)
     })*/

     var data_temp = [...data, ...this.state.table.stocks.data];

     this.setState(function(previousState, currentProps){
         previousState.table.stocks.data = data_temp
         previousState.filterTimestamp = parseInt(data_temp[0].timestamp)
     })
 },

	render:function(){
		return(
         <div className="content-container">
           <div className='tableContainer'>        
              <TableComponent 
                table={this.state.table.stocks}
                compareRows={false} />
            </div>  
         </div>  
		)
	}
});

module.exports = PageComponent;