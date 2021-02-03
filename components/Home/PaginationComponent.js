var React = require('react');

var PaginationComponent = React.createClass({

	render:function(){
		
		var pagesList = [];
														 
	 	for(var i=1; i<=this.props.pages; i++ ){
			pagesList.push(<span key={'page'+i} className={this.props.activePage == i ? 'activePage' : ''} onClick={this.props.activePage == i ? null : this.props.onPageChange.bind(null,i)}>{i}</span>)
		}
							
		return(
			<div className="paginationBox">
	
				{this.props.pages > 1 ? <div className="paginationBoxInside">Page: {pagesList}</div> : null }											
				<div className="changeDisplayRows">show <input type="number" min="10" onChange={this.props.changeDisplayRows} defaultValue={this.props.displayRows}/> rows</div>
											
			</div>
		  )
	}

});


module.exports = PaginationComponent;
