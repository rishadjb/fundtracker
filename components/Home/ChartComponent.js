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
          rangeSelector: {
                selected: 4
            },

            yAxis: {
                labels: {
                    formatter: function () {
                        return (this.value > 0 ? ' + ' : '') + this.value + '%';
                    }
                },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },

            plotOptions: {
                series: {
                    compare: 'percent',
                    showInNavigator: true
                }
            },

            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
                valueDecimals: 2,
                split: true
            },

            series: this.props.fundPrices
        };
		
        return(
			<div oldclassName="col-md-12 col-sm-12 col-lg-12">
				<div className="chartContainer">
					{this.props.fundPrices.length == 0 ? <div className='chartEmptyDiv'>select funds from the dropdown below to generate chart</div> : React.createElement(ReactHighstock, {config: config})}
				</div>
			</div>
        )
    }
})

module.exports = ChartComponent;
