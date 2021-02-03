/*
 * This component shows the history of a stock
*/

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
var UtilsStocks = require('../../common/utils/UtilsStocks');
var HistoryChartUtils = require('./Utils');
var TableComponent = require('../Home/TableComponent');
var ChartComponent = require('./ChartComponent');

var PageComponent = React.createClass({
		
	getInitialState:function(){
      var _this = this
      var processRequest = ticker != undefined ? true : false
	
      return({
          processRequest: processRequest,            
          loading: false,            
          historyChartData: [],
          shouldHistoryTableUpdate:true,

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
                          formatter: function(value,row){return _this.convertEpochToDate(value)},
                          type: 'link',
                          link: function(value,row){return _this.dateLink(value, row['1m'])}
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
                          formatter: function(value,row){return UtilsStocks.formatVolume(value)}
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
        HistoryChartUtils.fetchData(this,ticker);
    }        
	},

  convertEpochToDate: function(epochDate){
    var date = new Date(epochDate*1000)
    return UtilsStocks.formatNumberTo2Dgits(date.getDate()) + "/" + UtilsStocks.formatNumberTo2Dgits(date.getMonth()+1) + "/" + date.getFullYear();
  },	

  dateLink: function(epochDate, flag_1m){
    var date = new Date(epochDate*1000)
    var dateStr = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
    if(flag_1m == '') return '';
    return 'day_action?ticker='+ticker+'&date='+dateStr;
  },

	render:function(){		
		var _this = this        
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

        <ChartComponent 
           key={'chart1'}
           data={this.state.historyChartData}
           shouldUpdate={true}
           ticker={this.ticker}/>
        
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
