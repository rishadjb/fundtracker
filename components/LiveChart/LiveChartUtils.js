var UtilsStocks = require('../../common/utils/UtilsStocks');
var Utils = {    
  
  fetchData: function(context, ticker, timestamp = 0){
    var data = {}
    var settings = UtilsStocks.getAjaxSettings('GET', 'live_ticker_data/'+ticker+'/'+timestamp, data);
    UtilsStocks.makeAjaxRequest(this, settings, this.createDataArray.bind(null, context), null);
  },

  fetchUpdatedData: function(context, ticker, series){
    var settings = UtilsStocks.getAjaxSettings('GET', 'live_ticker_data/'+ticker+'/'+context.state.filterTimestamp, null);
    UtilsStocks.makeAjaxRequest(this, settings, Utils.addToSeries.bind(null,context,series), null);
  },

  createDataArray: function(context,data){
    context.state.loadingLiveChart = false;

    if(data.length == 0) return

    var dateToCheckOffset = new Date(data[1][0]*1000);
    context.timezone_offset = dateToCheckOffset.getTimezoneOffset()*60;

    data.map(function(item,index){
      if(index==0){
        console.log(item[0])
      }
      item[0] = UtilsStocks.convertEpochToLocalInMs(item[0], context.timezone_offset)
      item[1] = parseFloat(item[1])

      if(index==0){
        console.log(item[0])
      }
    })

    // var maxts = data[data.length-1][0];
    // for(var i=1; i<100; i++){
    //  data.push([maxts+i*60, null])
    // }

    var data_temp = [...context.state.liveChartData, ...data]; //<<---- this might not be needed since we are appending new data in addToSeries

    context.setState(function(previousState,currentProps){ 
      previousState.shouldLiveChartUpdate = true
      previousState.liveChartData = data
      previousState.filterTimestamp = UtilsStocks.convertEpochToLocalInMs(data_temp[data_temp.length-1][0]/1000, context.timezone_offset)
    }, 
    function(){context.setState({shouldLiveChartUpdate:false})}
    )
  },

  addToSeries: function(context, series, data){
    if(data.length == 0) return
    data.map(function(item,index){
      series.addPoint([(parseInt(item[0])- context.timezone_offset)*1000, parseFloat(item[1])], true, true);
    })
    context.setState(function(previousState,currentProps){
      previousState.filterTimestamp = parseInt(data[data.length - 1][0])
    })
  },
}

module.exports = Utils;