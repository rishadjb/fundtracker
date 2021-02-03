var React = require('react');

var MenuTypeComponent = React.createClass({
    
    render: function(){
		
		var _this = this
		
        return (            
			<div className='menuBar'>
				<div className='menuItemsContainer'>
					{this.props.pages.map(function(pageItem, itemIndex){
			
						var classAddon = pageItem.key == _this.props.activePage ? 'activeTab' : ''
			
						return(
							<div key={itemIndex}
								className={'menuItem ' + classAddon } 
								onClick={_this.props.pageHandler.bind(null,itemIndex)}>
									{pageItem.title}
							</div>
						)
					})}
				</div>
			</div>
			
        );
    }
});
module.exports = MenuTypeComponent;
