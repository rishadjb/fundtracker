var React = require('react');

var ModalComponent = React.createClass({
	serverURL: "/",
	
	getInitialState: function(){
		return({
			errorMessage:'',
			messageConfirmation:''
		})	
	},
	
	sendEmail: function(){
		
		var name = this.refs.name.value.trim()
		var email = this.refs.email.value.trim()
		var phone = this.refs.phone.value.trim()
		var message = this.refs.message.value.trim()
		
		var errorMessage = ''
		var emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		
		if(name == '')
			errorMessage = "Please enter your name"
			
		else if(email == '')
			errorMessage = "Please enter your email address"
			
		else if(!emailRegex.test(email))
			errorMessage = "Please enter a valid email address"
			
		else if(message == '')
			errorMessage = "Please enter a message"
							
		if(errorMessage != '') {
			this.setState({errorMessage: errorMessage})
			return
		}
		
		
		var data = {name:name, email:email, phone:phone, message:message}
				
		var settings = {
            "async": true,
            "crossDomain": true,
            "url": this.serverURL + 'check_password',
            "method": "POST",
			"data": data,
            "headers": {}
        };
        
        $.ajax(settings).done(function (response) {
			
//			var returnedData = JSON.parse(response)	
			
			this.props.closeModal()
//			this.setState({
//				errorMessage:'',
//				messageConfirmation:'Thank you for message. We will get back to you shortly.'
//			})	
			
        }.bind(this)).fail(function (error) {
            console.log(error);
			this.props.hideLoader()
			
        }.bind(this));
	},
	
	render:function(){
		return(
			<div className="modalComponent">
				<div className="modalBackground">
					<div className="clearfix modalContainer">
						
						<div className="closeModal" onClick={this.props.closeModal}>X</div>
			
						<p className="contact-form-text">To learn more about investing and how to make your money work for you, please contact us using the form below.</p> 
			
						<div className="contact-form col-xs-12 col-sm-12 col-md-12 col-lg-12">

							<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
								<input ref="name" placeholder="name (required)" />
								<input ref="email" placeholder="email (required)" />
								<input ref="phone" placeholder="phone (optional)" />
							</div>

							<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6">
								<textarea ref="message" placeholder="a brief message (500 characters maximum)" maxlength="500"/>
							</div>
						
							{this.state.errorMessage != '' ? <p className="login-error">{this.state.errorMessage}</p> : null} 	

							<div className="buttonContainer"><div className="FA-button bannerButton" onClick={this.sendEmail}>send</div></div>

							{/*<div className="contact col-xs-12 col-sm-12 col-md-6 col-lg-6">

								<div className="contact-form-text">
									<p>I am also available by email or telephone</p>
								</div>

								<div>
									<div className="icon-phone"><p>647-515-5644</p></div>
								</div>
								<div>
									<div className="icon-phone"><p>rishad.bhattacharjee@primerica.com</p></div>
								</div>

								<div className="button"><div>submit</div></div>

							</div>*/}
						</div>
			
						{this.state.messageConfirmation != '' ? <p className="message-confirmation">{this.state.messageConfirmation}</p> : null} 	
			
						{/*<div className="contact-form-text">
							<p>To learn more about investing and how to make your money work for you, get in touch with me.</p> 
							<p>Feel free to contact me using the form below</p>
						</div>
			
						<div className="contact-form">
							<div className="contact col-xs-12 col-sm-10 col-md-8 col-lg-7">
								<input ref="name" placeholder="name" />
								<input ref="email" placeholder="email" />
								<input ref="phone" placeholder="phone" />
								<div className="button"><div>submit</div></div>
							</div>
						</div>
			
						<div className="contact-form-text">
							<p>I am also available by email or telephone</p>
						</div>
			
						<div>
							<div>
								<div className="icon-phone"></div>
								<p>647-515-5644</p>
							</div>
							<div>
								<div className="icon-phone"></div>
								<p>rishad.bhattacharjee@primerica.com</p>
							</div>
						</div>*/}
						

					</div>
				</div>
			</div>
		)

	},
	

});


module.exports = ModalComponent;