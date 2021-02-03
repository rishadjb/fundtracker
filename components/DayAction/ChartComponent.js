var React = require('react');

var ReactHighstock = require('react-highcharts/bundle/ReactHighstock');

var ChartComponent = React.createClass({
    
    getInitialState: function(){
        return(
        {
            fundPrices:[],
            seriesOptions:[],  
			containerWidth:$( ".chartContainer" ).width(),

            data_prices:[],
            data_volume:[]
        })
    },
	
    componentWillReceiveProps: function(nextProps){
        this.setState({
			seriesOptions:nextProps.fundPrices,
			containerWidth:$( ".chartContainer" ).width()
		})        
		
//		console.log('chart container')
//		console.log($( ".chartContainer" ).width())
    },	
	
	shouldComponentUpdate: function(nextProps, nextState){
		return nextProps.shouldUpdate
	},

    render: function () {
        
        var containerWidth = this.state.containerWidth
        
        var config = {
            "chart": {
                backgroundColor: 'rgba(0,0,0,0)',
                marginBottom: 0,
                spacingTop: 10,
                width: containerWidth,
                animation:false
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
                selected: 1,
                enabled: false
            },

            title: {
                text: 'AAPL Stock Price'
            },

            tooltip: {
                split: true
            },

            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                lineWidth: 2,
                resize: {
                    enabled: true
                }   
            },
            {
                title: {
                    text: 'Volume',
                    style: {
                        color: "#DDD"
                    }
                },
                gridLineWidth: 0,
                opposite: true
            }],

            series: [
                {
                    type: 'column',
                    name: 'volume',
                    data: this.props.data_volume,
                    yAxis: 1,
                    dataGrouping: {
                        units: [
                            ['minute', [1,2,5,10,15]]
                        ],
                        groupPixelWidth: 10
                    },
                    upColor: '#66ff33'
                },
                {
                    id: 'dataseries',
                    type: 'candlestick',
                    name: 'AAPL Stock Price',
                    data: this.props.data_prices,
                    yAxis: 0,
                    dataGrouping: {
                        units: [
                            ['minute', [1,2,5,10,15]]
                        ],
                        groupPixelWidth: 10
                    }
                },
                {
                    type: 'flags',
                    name: 'Flags on series',
                    data: [],
                    onSeries: 'dataseries',
                    shape: 'flag',
                    events: {
                        click: function(event) {
                            alert('checknews');
                        }
                    }
                }
            ]
        };
		
        return(
			<div oldclassName="col-md-12 col-sm-12 col-lg-12">
				<div className="chartContainer">
					{React.createElement(ReactHighstock, {config: config})}
				</div>
			</div>
        )
    }
})

module.exports = ChartComponent;
