var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var PageComponent = React.createClass({
		
	serverURL: 'http://ec2-54-212-233-75.us-west-2.compute.amazonaws.com/',
    
//	serverURL: '/',
	

	getInitialState:function(){
        
        var _this = this
        
        console.log(ticker)   
        console.log(date)   
        
		
        return({			
			
            loading: false
            
        })
    },

    
		

	render:function(){
		
		var _this = this
        
		return(
            <div>
                <img src="http://realtimebigchart.gtm.idmanagedsolutions.com/custom/fidelity-com/big.chart?nosettings=1&symb=CA:HIVE&uf=0&type=4&size=1&style=1145&freq=1mi&time=1"></img>
                <img src="http://realtimebigchart.gtm.idmanagedsolutions.com/custom/fidelity-com/big.chart?nosettings=1&symb=US:BONT&uf=0&type=4&size=1&style=1145&freq=1mi&time=1"></img>
                <img src="http://realtimebigchart.gtm.idmanagedsolutions.com/custom/fidelity-com/big.chart?nosettings=1&symb=US:YUMA&uf=0&type=4&size=1&style=1145&freq=1mi&time=1"></img>
                <img src="http://realtimebigchart.gtm.idmanagedsolutions.com/custom/fidelity-com/big.chart?nosettings=1&symb=US:CARA&uf=0&type=4&size=1&style=1145&freq=1mi&time=1"></img>
            </div>  
            
            
		)

	}

});


module.exports = PageComponent;
