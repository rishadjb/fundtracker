var React = require('react');

var Utils = require('../../common/utils/UtilsNew');

var LoginComponent = React.createClass({
	
//	serverURL: 'http://ec2-54-218-126-27.us-west-2.compute.amazonaws.com/projects/AGF/api/',
//	serverURL: '/',
	serverURL: 'http://www.fundanalytics.ca/',
	
	getInitialState: function(){
		return({
			errorMessage:''
		})	
	},
	
	recoverPassword: function(){
		var username = this.refs.username.value
		
		var errorMessage = ''
		var unameRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		if(!unameRegex.test(username)){
			errorMessage = "Please enter a valid email address"
			this.setState({errorMessage: errorMessage})
			return
		}
		
		this.setState({errorMessage: "A recovery email has been sent your email address"})
		
		//TODO - recover API
	},
	
	login: function(){
		
		var username = this.refs.username.value.trim()
		var password = this.refs.password.value
		
		//check if username and password are of valid format
		
		var errorMessage = ''
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		if(!emailRegex.test(username))
			errorMessage = "Please enter a valid email address"
			
		else if(password.trim() == '')
			errorMessage = "Please enter a password"
			
		else if(password.trim().length < 8)
			errorMessage = "Password must be at least 8 characters"
			
		
		if(errorMessage != '') {
			this.setState({errorMessage: errorMessage})
			return
		}
		
		this.props.showLoader()
		
		//username and password formats are valid
		//check if they are correct
		
		var data = {user:username, pass:password, broker:this.props.broker}
				
		var settings = {
            "async": true,
            "crossDomain": true,
//            "url": this.serverURL + 'check-password.php' + '?broker=' + this.props.broker,
            "url": this.serverURL + 'check_password',
            "method": "POST",
			"data": data,
            "headers": {}
        };
        
		//update the state.table
        $.ajax(settings).done(function (response) {
			
			var returnedData = JSON.parse(response)			
			
			if(returnedData.userid){
				Utils.setCookie('userid', returnedData.userid,1)
				Utils.setCookie('token', returnedData.token,1)
				
				this.props.downloadPersonalData(returnedData.userid, returnedData.personalSummary, returnedData.personalTransactions)
			} else {
				this.props.hideLoader()
				this.setState({errorMessage:"Invalid email or password!"})
			}
				
				
			
        }.bind(this)).fail(function (error) {
            console.log(error);
			this.props.hideLoader()
			
        }.bind(this));
	},
	
	
	
	render:function(){
		
		return(
			<div className="login-component">
			
				<div className="loginInputs">
					<input ref="username" placeholder="email" className="col-xs-3 col-md-2"></input>
					<input ref="password" placeholder="password" className="col-xs-3 col-md-2" type="password"></input>
				</div>
			
				{this.state.errorMessage != '' ? <p className="login-error">{this.state.errorMessage}</p> : null}				
				
				<div className="loginButtonsContainer">
					{/*<div className="loginButton" onClick={this.signup}>Sign Up</div>*/}
					<div className="FA-button loginButton" onClick={this.login}>
						<span>Login</span>
					</div>
				</div>
				
				<div className="loginButtonsContainer">
					<a onClick={this.recoverPassword}>Recover Password</a>
				</div>
			
			</div>
		)

	},
	

});


module.exports = LoginComponent;