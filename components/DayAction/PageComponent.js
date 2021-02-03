/*
 * This component shows the action for a stock for a particular date
*/

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var UtilsStocks = require('../../common/utils/UtilsStocks');
var TableComponent = require('../Home/TableComponent');
var ChartComponent = require('./ChartComponent');

var PageComponent = React.createClass({
	getInitialState:function(){
        var _this = this
        var processRequest = false;

        if(ticker != undefined && date != undefined){
            processRequest = true;
        }
		
        return({
            processRequest: processRequest,            
            loading: false,         
            data: [],
            data_prices: [],
            data_volume: [],

            table:{
                stocks:{
                    sortKey:'',
                    scrollable: {staticCols:12},
                    headers:[
                        {
                            key:'date',  
                            name:'Date', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return _this.convertEpochToTime(value)}
                        },  
                        {
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
                        },  
                        {
                            key:'close', 
                            name:'Close', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },  
                        {
                            key:'amount_change', 
                            name:'$Δ', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },
                        {
                            key:'perc_change', 
                            name:'%Δ', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return UtilsStocks.addGrowthColour(value)}
                        }, 
                        {
                            key:'volume', 
                            name:'Volume', 
                            cols:1,
                            static:true,
                            formatter: function(value,row){return value}
                        },
                    ],
                    data:[],
                    compareData:[]
                }
            }
        })
    },
    
	componentDidMount: function(){        
   if(this.state.processRequest){            
       this.fetchData();
   }        
	},	

 convertEpochToTime: function(epochDate){
   var date = new Date(epochDate*1000)
   return UtilsStocks.formatNumberTo2Dgits(date.getHours()) + ":" + UtilsStocks.formatNumberTo2Dgits(date.getMinutes());
 },
   
 fetchData: function(){
     var data = {ticker:ticker, date:date}
     var settings = UtilsStocks.getAjaxSettings('POST', 'day_action', data);
     UtilsStocks.makeAjaxRequest(this, settings, this.createDataArray, null);
 },

 createDataArray: function(data){
     var data_prices = [];
     var data_volume = [];

     var date1 = new Date(data[1].date*1000);
     var timezone_offset = date1.getTimezoneOffset();

     data.map(function(item,index){
         data_prices.push([(parseInt(item.date)-(timezone_offset*60))*1000, parseFloat(item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)])
         data_volume.push([(parseInt(item.date)-(timezone_offset*60))*1000, parseInt(item.volume)])
         item['perc_change'] = parseFloat(Math.round (100 * 100 * (parseFloat(item.close) - parseFloat(item.open))/parseFloat(item.open)) / 100).toFixed(2)
         item['amount_change'] = parseFloat(((parseFloat(item.close) - parseFloat(item.open)) )).toFixed(2)
     })

     this.setState(function(previousState, currentProps){
         previousState.data_prices = data_prices
         previousState.data_volume = data_volume
         previousState.table.stocks.data = data
     })
 },

	render:function(){
		return(
         <div className="content-container">

           <div className='stockquote'>
             <div className='stock_title'>
               <div className='stock_ticker'>GLBR</div>
               <div className='stock_name'>Global Resources</div>
             </div>
             <div className='stock_details'>
             </div>
           </div>
           
           <div className='spacer10'></div>

           {<ChartComponent 
                        key={'chart1'} 
                        data_prices={this.state.data_prices} 
                        data_volume={this.state.data_volume}
                        shouldUpdate={true}/>}

           <div className='spacer10'></div>

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