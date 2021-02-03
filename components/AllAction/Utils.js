var UtilsStocks = require('../../common/utils/UtilsStocks');
var Utils = {  


  fetchData: function(context,ticker){
    var data = {ticker:ticker}
    var settings = UtilsStocks.getAjaxSettings('POST', 'all_action', data);
    UtilsStocks.makeAjaxRequest(this, settings, this.createDataArray.bind(null, context), null);
  },


  createDataArray: function(context,data){

    context.state.loadingHistoryChart = false;

    var data_prices = [];
    var data_volume = [];
    var data_news = [];

    data.prices.slice(0).reverse().map(function(item,index){
        data_prices.push([(parseInt(item.date)-4*3600)*1000, parseFloat(item.open), parseFloat(item.high), parseFloat(item.low), parseFloat(item.close)])
        data_volume.push([(parseInt(item.date)-4*3600)*1000, parseInt(item.volume)])
        item['perc_change'] = parseFloat(Math.round (100 * 100 * (parseFloat(item.close) - parseFloat(item.open))/parseFloat(item.open)) / 100).toFixed(2)
        item['amount_change'] = parseFloat(((parseFloat(item.close) - parseFloat(item.open)) )).toFixed(2)
    })

    var news_item = 1;

    data.news.map(function(item,index){
        data_news.push({'x':(parseInt(item.timestamp)*1000),'title':news_item.toString(), 'headline':item.headline})
        news_item++;
    })

    context.setState({shouldHistoryChartUpdate:true}, function(){
      context.setState(function(previousState,currentProps){ 
        previousState.historyChartData.prices = data_prices
        previousState.historyChartData.volume = data_volume
        previousState.historyChartData.news = data_news

        //only update for history page; not for live data page
        if(previousState.shouldHistoryTableUpdate){
          previousState.table.stocks.data = data.prices
        }
      }, function(){
        context.setState({shouldHistoryChartUpdate:false})
      })
    })
  },


}

module.exports = Utils;