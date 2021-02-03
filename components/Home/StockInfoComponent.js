var React = require('react');
var UtilsStocks = require('../../common/utils/UtilsStocks');
var StockInfoComponent = React.createClass({

  getInitialState:function(){ 
    return({
      intervalId: null,
    })
  },

  componentDidMount: function(){
    var intervalId = setInterval(this.setTimer, 20000);
    this.setState({intervalId: intervalId});        
  },

  componentWillUnmount: function() {
    clearInterval(this.state.intervalId);
  },

  setTimer: function(){
    if(this.props.ticker != '') {
      UtilsStocks.fetchStockInfo(this, this.props.ticker)
    }
  },

  render: function () {
    return(
      <div className='stock-live-info'>
        <div>
        {this.props.ticker == '' ? <div>No Data Available</div> : this.props.stockInfo.structure.map((group, index) => 
          { if((index < this.props.stockInfo.data.zone+3) && (index >= this.props.stockInfo.data.zone-1)) 
            {return this.makeFieldGroup(group)} }, this)
          }
        </div>
      </div>
    )
  },

  makeFieldGroup: function(group){
    return(
      <div className='field-group'>
        <div className='field-group-title'>{group.title}</div>
        <div className='field-group-data'>
          {group.fields.map((fieldCol, index) => {return <div className='field-group-col'>
            {fieldCol.map((field, index) => {return this.makeFieldRow(field)})}
          </div>},this)}
        </div> 
      </div>
    )
  },

  makeFieldRow: function(field){
    return(
      <div className='field-row'>
        <div className='field-row-title'>{field.title}</div>
        <div className='field-row-value'>{this.props.stockInfo.data[field.key]}</div>
      </div>
    )
  },

})
module.exports = StockInfoComponent;