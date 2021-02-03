var React = require('react');

var BannerComponent = React.createClass({
	
	render:function(){
		return(
			<div className="bannerComponent">
				<div className="banner">
			
					{this.props.userid == null ? <button className="bannerButton FA-button startInvestingButton" onClick={this.props.startInvesting}>START INVESTING</button> : null}
			
					<div className="bannerTitle">
						FUNDANALYTICS.CA
						<p>make money a tool, not a destination</p>
					</div>
			
					<button className="bannerButton FA-button logoutButton" onClick={this.props.userid == null ? this.props.login:this.props.logout}>{this.props.userid == null ? 'LOGIN':'LOGOUT'} </button>
			
				</div>
			</div>
		)

	},
	

});


module.exports = BannerComponent;