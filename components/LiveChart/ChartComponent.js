var React = require('react');
var ReactHighstock = require('react-highcharts/bundle/ReactHighstock');
var ChartOverlay = require('../../common/stocks/chartOverlay');

var ChartComponent = React.createClass({
    
  isIntervalSet: false,

  getInitialState: function(){
    return({ 
			 containerWidth:$( ".chartContainer" ).width(),
      shouldUpdate: false,
    })
  },

  componentDidMount: function(){
    window.addEventListener("resize", this.updateDimensions);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },
  
  updateDimensions: function() {
    this.setState({
        shouldUpdate:true,
        containerWidth:$( ".chartContainer" ).width()
      }, 
      function(){this.state.shouldUpdate = false}
    )
  },	

 	shouldComponentUpdate: function(nextProps, nextState){
 		 return (nextProps.shouldUpdate || this.state.shouldUpdate)
 	},

  calculatePlotBands: function(){
    
  },

  render: function () {
    var _this = this;  
    console.log(this.props.data_prices)      
    var config = {
      "chart": {
          backgroundColor: 'rgba(0,0,0,0)',
          marginBottom: 0,
          spacingTop: 10,
          width: this.state.containerWidth,
          animation:false,
          height: _this.props.height ? _this.props.height+'%' : null,

          events: {
            load: (!_this.props.shouldUpdate || _this.isIntervalSet) ? null : function () {
              // set up the updating of the chart every 30s
              var series = this.series[0];
              setInterval(function(){_this.props.fetchUpdatedData(series)}, 30000)
              _this.isIntervalSet = true
            }
          }
      },
      plotOptions: {
        series: {
          cursor: 'pointer'
        },
        candlestick: {
          color: 'red',
          upColor: 'green',
          upLineColor: 'darkgreen',
          lineColor:'darkred'
        },
        column: {
          color: 'lightgrey'
        }
      },

      rangeSelector: {
        enabled:false,
        //inputEnabled:false //this isn't needed is enabled is false - this controls the input only
      },

      title: {
        text: _this.props.ticker + ' LIVE CHART'
      },
      tooltip: {
        split: true
      },

      xAxis: {
        plotBands: [{ // mark the weekend
            color: '#FCFFC5',
            from: 1516281160000,
            to: 1516283533000,
            events: {
                click: function (e) {
                    $report.html(e.type);
                },
                mouseover: function (e) {
                    $report.html(e.type);
                },
                mouseout: function (e) {
                    $report.html(e.type);
                }
            }
        }]
    },

      yAxis: [{
        title: {
            text: 'PRICE'
        },
        height: '100%',
        lineWidth: 2,
        resize: {
            enabled: true
        }   
      }],
      series: [
        {
          id: 'dataseries',
          name: 'price',
          data: this.props.data_prices
        },
      ]
    };

    return(
   			<div oldclassName="col-md-12 col-sm-12 col-lg-12">
    				<div className="chartContainer">
              {this.props.loaderState ? <ChartOverlay overlayMessage={'LOADING'}/> : null}
              {this.props.ticker == '' ? <ChartOverlay overlayMessage={this.props.overlayMessage}/> : null}
    					{React.createElement(ReactHighstock, {config: config})}
    				</div>
   			</div>
    )
  }
})
module.exports = ChartComponent;