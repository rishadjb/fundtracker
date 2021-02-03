var React = require('react');

var Row = require('react-bootstrap').Row;
var Col = require('react-bootstrap').Col;

var Pagination = require('./PaginationComponent');

var TableComponent = React.createClass({
	
	shouldWeCompare:-1,
		
	getInitialState: function(){
		
		return({
			pageNumber:1, 
			displayRows:30,
			
			sliderPosition: 0,
			showRight:false
		})
	},
	
	componentDidMount: function(){		
		//if table has a scrollable portion, check if showRight should be enabled		
		if (this.props.table.scrollable){			
			this.setState({
				showRight: ((document.getElementById('dynamicSection_contentSlider').clientWidth - this.state.sliderPosition > document.getElementById('dynamicSection_contentContainer').clientWidth) ? true : false)			
			})			
		}
	},
	
	onPageChange: function(pageNumber){
		this.setState({pageNumber:pageNumber})
	},
	
	changeDisplayRows: function(event){		
		var val = parseInt(event.target.value)		
		if(val >=10)
			this.setState({displayRows: val})	
	},
	
	showSortingArrows: function(sortOrder){
		return (<div className="sortArrows">
					{sortOrder == 'asc' ? <span className="icon-arrow-up-b"></span> : <span className="icon-arrow-down-b"></span>}
				</div>)
	},
				
	moveSlider: function(movement){			
		var newSliderPosition = this.state.sliderPosition + movement			
		this.setState({
			sliderPosition: newSliderPosition,
			showRight: ((document.getElementById('dynamicSection_contentSlider').clientWidth + newSliderPosition >= document.getElementById('dynamicSection_contentContainer').clientWidth) ? true : false)			
		}, function(){$(".dynamicSection_contentSlider").css({'left': newSliderPosition+'px'})}.bind(this))		
	},

 renderScrollableSection : function(){
  this.props.table.scrollable ? 
   <div className="dynamicSection col-md-6 col-sm-6">
    <div className="dynamicSection_contentContainer col-md-12 col-sm-12">
     <div className="dynamicSection_contentSlider">
      {this.props.table.headers.filter(function(obj){return obj.static==false}).map(function(header,headerIndex){

       {columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''}

       //header.key refers to the key set in the parent component table.header array
       var data = header.key=='checkbox' ? 
        header.formatter('checkbox',row, (rowIndex+(this.state.displayRows*(this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
       return(
        <Col key={headerIndex} className="dynamicSection_column">
         {data}
        </Col>
       )
      }),this}
     </div>
    </div>
   </div>
  : null
 },
	
	render: function () {
		var _this = this
		var columnSums = {}
		
		//variables for pagination
		var totalRows = this.props.table.data.length
		var noOfPages = Math.ceil(totalRows / this.state.displayRows)
		var showPagination = noOfPages > 1 ? true : false
		var firstRowNumber = (this.state.pageNumber-1)*this.state.displayRows
		var lastRowNumber = firstRowNumber + this.state.displayRows		
		
		this.shouldWeCompare = this.props.table.data.findIndex(row => row.selected==true)		
		var staticCols = this.props.table.scrollable ? this.props.table.scrollable.staticCols : 12				
  
  return(
			<div className={'fundCheckboxContainer'}>
			
				{/*super header row*/}
				{/*<Row className='tableSuperHeader'>
					<Col md={1} sm={1}></Col>
					<Col md={4} sm={4}></Col>
					<Col md={1} sm={1}></Col>
					<Col md={6} sm={6}>Growth in Percentage over:</Col>
				</Row>*/}
					
				{/*Print the table header row*/}
				<Row className='tableHeader'>
								
					{/*the static section*/}
					<div className={"staticSection col-md-" + staticCols + " col-sm-" + staticCols}>
						{this.props.table.headers.filter(function(obj){return obj.static}).map(function(header,headerIndex){

							columnSums[header.key] = 0

							return <Col 
        key={headerIndex} 
        md={header.cols ? header.cols : 1} 
        sm={header.cols ? header.cols : 1} 
        onClick={header.sort ? _this.props.sortFundsCallback.bind(null,header.key) : null} 
        className={header.sort ? 'sortColumn':''}
       >
       {header.name}{_this.props.table.sortKey == header.key ? _this.showSortingArrows(header.sort) : null}
       </Col>
						})}
					
					</div>
										
					{/*the scrollable section, if any*/}
					{this.props.table.scrollable ? 
						<div className="dynamicSection col-md-6 col-sm-6">
							
							{this.state.sliderPosition < 0 ? <span className="dynamicSection_scrollLeftButton icon-left-arrow" onClick={this.moveSlider.bind(null,+50)}></span>:null}

							<div  id="dynamicSection_contentContainer" className="dynamicSection_contentContainer col-md-12 col-sm-12">
								<div id="dynamicSection_contentSlider" className="dynamicSection_contentSlider">
									{this.props.table.headers.filter(function(obj){return obj.static==false}).map(function(header,headerIndex){

										columnSums[header.key] = 0

										return <Col key={headerIndex} 
													onClick={header.sort ? _this.props.sortFundsCallback.bind(null,header.key) : null} 
													className={'dynamicSection_column '+(header.sort ? 'sortColumn':'')}>
														{header.name}{_this.props.table.sortKey == header.key ? _this.showSortingArrows(header.sort) : null}
												</Col>
									})}
								</div>
							</div>

							{this.state.showRight ? <span className="dynamicSection_scrollRightButton icon-right-arrow" onClick={this.moveSlider.bind(null,-50)}></span> : null}
						</div>
						:null
					}
									   
				</Row>
				
				
				{/*Print the rows to be compared*/}
				{(this.props.compareRows && this.shouldWeCompare>-1) ? 					
					
					<div className="rowsToCompare">
				 	{this.props.table.data.map(function(row, rowIndex){
				
							return row.selected ?

							<Row key={rowIndex} >	
								{/*the static section*/}
									<div className={"staticSection col-md-" + staticCols + " col-sm-" + staticCols}>
									{_this.props.table.headers.filter(function(obj){return obj.static==true}).map(function(header,headerIndex){

										//for columns that need to have their sum displayed at the bottom, calculate the running sum
										columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''

										//header.key refers to the key set in the parent component table.header array
										var data = header.key=='checkbox' ? 
											header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
										
      										return(
											<Col key={headerIndex} md={header.cols ? header.cols : 1} sm={header.cols ? header.cols : 1} >
												{data}
											</Col>
										)
									})}
								</div>

													
								{/*the scrollable section, if any*/}
								{_this.props.table.scrollable ? 
									<div className="dynamicSection col-md-6 col-sm-6">
										<div className="dynamicSection_contentContainer col-md-12 col-sm-12">
											<div className="dynamicSection_contentSlider">
												{_this.props.table.headers.filter(function(obj){return obj.static==false}).map(function(header,headerIndex){

													{columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''}

													//header.key refers to the key set in the parent component table.header array
													var data = header.key=='checkbox' ? 
														header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
													return(
														<Col key={headerIndex} className="dynamicSection_column">
															{data}
														</Col>
													)
												})}
											</div>
										</div>
									</div>
									: null
								}
								
							</Row>
							: null
						})}
						<Row className="compareFooter"></Row>
					</div>
					:
					null
				}


		{/*Print the favourited rows*/}
    {(this.props.favRows && this.props.table.favData.length>0) ?   
    	<div className="rowsToCompare">
				 	{this.props.table.favData.map(function(row, rowIndex){
			
						return row.selected ?

						<Row key={rowIndex} >	
							{/*the static section*/}
								<div className={"staticSection col-md-" + staticCols + " col-sm-" + staticCols}>
								{_this.props.table.headers.filter(function(obj){return obj.static==true}).map(function(header,headerIndex){

									//for columns that need to have their sum displayed at the bottom, calculate the running sum
									columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''

									//header.key refers to the key set in the parent component table.header array
									var data = header.key=='checkbox' ? 
										header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
									
    										return(
										<Col key={headerIndex} md={header.cols ? header.cols : 1} sm={header.cols ? header.cols : 1} >
											{data}
										</Col>
									)
								})}
							</div>

												
							{/*the scrollable section, if any*/}
							{_this.props.table.scrollable ? 
								<div className="dynamicSection col-md-6 col-sm-6">
									<div className="dynamicSection_contentContainer col-md-12 col-sm-12">
										<div className="dynamicSection_contentSlider">
											{_this.props.table.headers.filter(function(obj){return obj.static==false}).map(function(header,headerIndex){

												{columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''}

												//header.key refers to the key set in the parent component table.header array
												var data = header.key=='checkbox' ? 
													header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
												return(
													<Col key={headerIndex} className="dynamicSection_column">
														{data}
													</Col>
												)
											})}
										</div>
									</div>
								</div>
								: null
							}
							
						</Row>
						: null
					})}
					<Row className="compareFooter"></Row>
			</div>
    	: null
  	}   
    
				
			{/*Populate the table rows based on how many rows to be shown*/}
			{this.props.table.data.slice(firstRowNumber,lastRowNumber).map(function(row, rowIndex){

				return (
			      <Row key={rowIndex} >  
			 						<Row key={rowIndex} >		
			        {/*the static section*/}
			 							<div className={"staticSection col-md-" + staticCols + " col-sm-" + staticCols}>
			 								{_this.props.table.headers.filter(function(obj){return obj.static==true}).map(function(header,headerIndex){

			 									{columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''}
			 									   							 							 
			 									//header.key refers to the key set in the parent component table.header array
			 									var data = header.key=='checkbox' ? 
			 										header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
			          									
			          return(
			 										<Col 
			            className={header.class}
			            key={headerIndex} 
			            md={header.cols ? header.cols : 1} 
			            sm={header.cols ? header.cols : 1} >
			 											 {header.type == 'link' ? (header.link(row[header.key],row,rowIndex) == '' ? data : <a href={header.link(row[header.key],row,rowIndex)}>{data}</a>) : data}
			 										</Col>
			 									)
			 								})}
			 							</div>
			 																			   
			 						 {/*the scrollable section, if any*/}
			 							{_this.props.table.scrollable ? 
			 								<div className="dynamicSection col-md-6 col-sm-6">
			 									<div className="dynamicSection_contentContainer col-md-12 col-sm-12">
			 										<div className="dynamicSection_contentSlider">
			 											{_this.props.table.headers.filter(function(obj){return obj.static==false}).map(function(header,headerIndex){

			 												{columnSums[header.key] = header.sum ? (columnSums[header.key] + parseFloat(header.sumFormatter(row[header.key],row,rowIndex))) : ''}

			 												//header.key refers to the key set in the parent component table.header array
			 												var data = header.key=='checkbox' ? 
			 													header.formatter('checkbox',row, (rowIndex+(_this.state.displayRows*(_this.state.pageNumber-1)))) : header.formatter(row[header.key],row,rowIndex)
			 												return(
			 													<Col key={headerIndex} className="dynamicSection_column">
			 														{data}
			 													</Col>
			 												)
			 											})}
			 										</div>
			 									</div>
			 								</div>		
			 								: null
			 						   	}
			       </Row>

			       {_this.props.table.subRows ? _this.props.table.subRows.map(function(subRow,subRowIndex){
			        return(
			         <Row>
			          <div className={"sub-row-collapsible text-left col-md-12"}>{row[subRow.key]}</div>
			         </Row>
			         )
			       }) : null}

					</Row>
				)

			})}
			
			{/*Row for sum*/}
			{this.props.table.sumRow ?
				<Row className='tableHeader'>
					{this.props.table.headers.map(function(header,index){
						return <Col key={index} md={header.cols ? header.cols : 1} sm={1}>{columnSums[header.key] == '' ? '' : columnSums[header.key].toFixed(2)}</Col>
					})}
				</Row>
				: null
			}

			{noOfPages > 1 ?
				<Pagination 
					pages={noOfPages} 
					activePage={this.state.pageNumber} 
					onPageChange={this.onPageChange} 
					changeDisplayRows={this.changeDisplayRows} 
					displayRows={this.state.displayRows}/>
				: null
			}
			
			
			
		</div>
      )
  }
})

module.exports = TableComponent;
