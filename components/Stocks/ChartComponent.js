var React = require('react');

var ReactHighstock = require('react-highcharts/bundle/ReactHighstock');

var ChartComponent = React.createClass({
    
    getInitialState: function(){
        return(
        {
            fundPrices:[],
            seriesOptions:[],  
			containerWidth:$( ".chartContainer" ).width()
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
                marginBottom: 80,
                spacingTop: 20,
                width: containerWidth,
                animation:false
            },
            plotOptions: {
                series: {
                    cursor: 'pointer'
                }
            },

            rangeSelector: {
                selected: 1
            },

            title: {
                text: 'AAPL Stock Price'
            },

            tooltip: {
                headerFormat:'',
                split: true
            },

            yAxis: [{
                title: {
                    text: 'OHLC'
                },
                lineWidth: 2
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
                    id: 'dataseries',
                    type: 'candlestick',
                    name: 'AAPL Stock Price',
                    data: [
                        [1147651200000, 67.37, 68.38, 67.12, 67.79],
                        [1147737600000, 68.10, 68.25, 64.75, 64.98],
                        [1147824000000, 64.70, 65.70, 64.07, 65.26],
                        [1147910400000, 65.68, 66.26, 63.12, 63.18],
                        [1147996800000, 63.26, 64.88, 62.82, 64.51],
                        [1148256000000, 63.87, 63.99, 62.77, 63.38]
                    ],
                    yAxis: 0,
                    dataGrouping: {
                        units: [
                            ['week', // unit name
                            [1] // allowed multiples
                            ],
                            [
                                'month', [1, 2, 3, 4, 6]]
                        ]
                    }
                },
                {
                    type: 'column',
                    name: 'volume',
                    data: [
                        [1147651200000, 50000],
                        [1147737600000, 20000],
                        [1147824000000, 800000],
                        [1147910400000, 10000],
                        [1147996800000, 5000000],
                        [1148256000000, 500000]
                    ],
                    yAxis: 1
                },
                {
                    type: 'flags',
                    name: 'Flags on series',
                    data: [{
                        x: 1148256000000,
                        title: 'On series'
                    }],
                    onSeries: 'dataseries',
                    shape: 'squarepin',
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
