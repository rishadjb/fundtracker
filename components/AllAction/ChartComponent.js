var React = require('react');
var ReactHighstock = require('react-highcharts/bundle/ReactHighstock');
var ChartOverlay = require('../../common/stocks/chartOverlay');

var ChartComponent = React.createClass({
    
    getInitialState: function(){
        return(
        { 
			containerWidth:$( ".chartContainer" ).width(),
            data_prices:[],
            data_volume:[],
        })
    },
	
    componentWillReceiveProps: function(nextProps){
      this.setState({
			 containerWidth:$( ".chartContainer" ).width()
		  })        
    },	
	
	shouldComponentUpdate: function(nextProps, nextState){
		return nextProps.shouldUpdate
	},

    render: function () {
        var _this = this;
        
        var config = {
            "chart": {
                backgroundColor: 'rgba(0,0,0,0)',
                marginBottom: 0,
                spacingTop: 10,
                width: this.state.containerWidth,
                animation:false,
                height: _this.props.height ? _this.props.height+'%' : null,
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
                selected: 1
            },

            title: {
                text: 'AAPL Price'
            },

            tooltip: {
                split: false
            },

            yAxis: [{
                title: {
                    text: 'PRICE'
                },
                height: '80%',
                lineWidth: 2,
                resize: {
                    enabled: true
                }   
            },
            {
                title: {
                    text: 'VOLUME',
                    style: {
                        color: "#DDD"
                    }
                },
                resize: {
                    enabled: true
                },   
                top: '82%',
                height: '18%',
                gridLineWidth: 0,
                opposite: true
            }],

            series: [
                {
                    type: 'column',
                    name: 'volume',
                    data: this.props.data.volume,
                    yAxis: 1,
                    name: 'volume',
                    dataGrouping: {
                        units: [
                            ['day', [1,2]],
                            ['week', [1,2]],
                            ['month', [1,2,3]]
                        ],
                        groupPixelWidth: 15
                    }
                },
                {
                    id: 'dataseries',
                    type: 'candlestick',
                    name: 'price',
                    data: this.props.data.prices,
                    dataGrouping: {
                        units: [
                            ['day', [1,2]],
                            ['week', [1,2]],
                            ['month', [1,2,3]]
                        ],
                        groupPixelWidth: 15
                    }
                },
                {
                    type: 'flags',
                    name: 'Flags on series',
                    data: this.props.data.news,
                    datas: [{
                        x: 1509024600000,
                        title: '1'
                    },
                    {

                        x: 1509543000000,
                        title: '2'
                    }],
                    onSeries: 'dataseries',
                    shape: 'flag',
                    events: {
                        click: function(event) {
                            console.log('onclickfalg')
                        }
                    }
                }
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
