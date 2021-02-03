/*
 * This component shows stocks that have changed by N percentage in each of the last X out of Y days
*/

var React = require('react');
var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;
// var ChartComponent = require('./ChartComponent');
var UtilsStocks = require('../../common/utils/UtilsStocks');

var PageComponent = React.createClass({	


	getInitialState:function(){

    var requestStatus = false
        
    if(max_price != undefined && min_growth != undefined && match_range != undefined && day_range != undefined){
        var processRequest = true;
    } else {
        var processRequest = false;
    }
    		
    return({
        processRequest: processRequest,            
        loading: false,            
        queryUrl: "",            
        data: [],
    })
  },
    
	componentDidMount: function(){        
    if(this.state.processRequest){  
      UtilsStocks.makeAjaxRequestX(this, 'POST', 'daily_riser', {max_price:max_price, min_growth:min_growth, match_range:match_range, day_range:day_range}, this.createDataArray);
    }
	},
	  
  createDataArray: function(data){
    console.log(data)
    this.setState({data: data});
  },
    
  updateQuery: function(){
    var refs = this.refs
    var maxPrice = refs.maxPrice.value;
    var minGrowth = refs.minGrowth.value;
    var xDays = refs.xDays.value;
    var yDays = refs.yDays.value;
    
    this.setState({queryUrl:"/daily_riser?max_price="+maxPrice+"&min_growth="+minGrowth+"&match_range="+xDays+"&day_range="+yDays}, function(){            
        window.location.assign(this.state.queryUrl)
    })
  },

  checkInputFields: function(ll, ul, event){
    console.log(event.target.value)
    // this.refs.maxPrice.value = this.refs.maxPrice.value < 0 ? 0 : this.refs.maxPrice.value
    // this.refs.minGrowth.value = this.refs.minGrowth.value < 0 ? 0 : this.refs.maxPrice.value

    this.validateBounds('maxPrice', 0, 20);

  },

  validateBounds: function(ll=0, ul=1000000, event){
    if(event.target.value < ll){
      event.target.value = ll
    } else if (event.target.value > ul) {
      event.target.value = ul
    }
  },

	render:function(){		
		var _this = this

    console.log(max_price)
        
		return(
            <div className="content-container">            
                <div className="daily-riser-inputs">
                  <div>
                    Show stocks with max. price of 
                    <input ref="maxPrice" defaultValue={max_price} type="number" min="0" onBlur={this.validateBounds.bind(null)}/>
                    <b>$</b> that have grown by 
                    <input ref="minGrowth" defaultValue={min_growth} type="number" min="-50" max="50" step="5" onBlur={this.validateBounds.bind(null,0,50)}/>
                    % in the last 
                    <input ref="xDays" defaultValue={match_range} type="number" min="1" max="5" onBlur={this.validateBounds.bind(null,1,5)}/>
                    of
                    <input ref="yDays" defaultValue={day_range} type="number" min="1" max="5" onBlur={this.validateBounds.bind(null,1,5)}/>
                    days
                  </div>
                  <div className='button-container gold circle' onClick={_this.updateQuery}>
                    <div className='border-layer'></div>
                    <div className='button-layer'>
                      <span className='button-text'>GO</span>
                    </div>
                    <div className='reflection-layer'></div>
                  </div>
                </div>            
            
                {this.state.data.map(function(item, index){
                  return (<Row className='ticker_range_prices'>
                            <Row>
                              <Col md={12} sm={12}  className='ticker_day_prices_and_graph'>
                                  {/*<Col md={12} sm={12}  className='ticker_day_graph'></Col>*/}
                                  {/*<Col md={12} sm={12}  className='ticker_day_prices'>*/}
                                      <Col md={1} sm={1}  className=''><a href={'/all_action/' + item.ticker}>{item.ticker}</a></Col>
                                      {item.data.map(function(ticker_data, data_index){
                                        var perc = (100 * (parseFloat(ticker_data.close) - parseFloat(ticker_data.open)) / parseFloat(ticker_data.open)).toFixed(2);

                                        return <Col className='day_data' md={2} sm={2}>
                                                <Col className='prices'>
                                                  <Row><span className='price_high'>{ticker_data.high}</span></Row>
                                                  <Row>
                                                    <span className='price_open'>{ticker_data.open}</span>
                                                    <span className='price_perc'><a href={'/day_action?ticker=' + item.ticker + '&date='+ticker_data.date}>{UtilsStocks.addGrowthColour(perc)}%</a></span>
                                                    <span className='price_close'>{ticker_data.close}</span>
                                                  </Row>     
                                                  <Row><span className='price_low'>{ticker_data.low}</span></Row>
                                                  <Row><span className='price_volume'>{UtilsStocks.formatVolume(ticker_data.volume)}</span></Row>
                                                </Col>
                                            </Col>
                                      })}
                                  {/*</Col>*/}
                              </Col>
                            </Row>
                          </Row>)
                })}
			</div>
		)
	}
});

module.exports = PageComponent;