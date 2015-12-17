/**
 * New node file
 */
var mq_client = require('../rpc/client');

exports.driverSignUp = function(req, res){
	
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zipcode");
	var phone = req.param("phone");
	var email = req.param("email");
	var password = req.param("password");
	var gender = req.param("gender");
	var carNumber = req.param("carNumber");
	var carModel = req.param("carModel");
	var ssnNumber= req.param("ssnNumber");
	var lat = req.param("lat");
	var lng = req.param("lng");
	var ssnCheck = /(^\d{3}-?\d{2}-?\d{4}$)/;
	var zipcodeCheck = /(\d{5}([\-]\d{4})?)/; 

	//console.log("Gender:"+gender);

	if (firstName==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter first name"};
		res.send(json_responses);
	}
	else if (lastName==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter last name"};
		res.send(json_responses);
	}
	else if (email==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter email"};
		res.send(json_responses);
	}
	else if (password==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter password"};
		res.send(json_responses);
	}
	else if (password.length<6)
	{
		var json_responses = {"success" : 0,"error" : "Password length must be more than 6 characters"};
		res.send(json_responses);
	}
	else if (gender==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter gender"};
		res.send(json_responses);
	}
	else if (carModel==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter Car Model"};
		res.send(json_responses);
	}
	else if (carNumber==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter Car Number"};
		res.send(json_responses);
	}
	else if (!zipcodeCheck.test(zipcode))
	{
		var json_responses = {"success" : 0,"error" : "Incorret zipcode format "+zipcode};
		res.send(json_responses);
	}
	else if (ssnNumber==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter SSN"};
		res.send(json_responses);
	}
	else if (!ssnCheck.test(ssnNumber))
	{
		var json_responses = {"success" : 0,"error" : "Incorrect SSN format"};
		res.send(json_responses);
	}
	else if (lat==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter lat (latitude) details"};
		res.send(json_responses);
	}
	else if (lng==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter lng (longitude) details"};
		res.send(json_responses);
	}
	else
	{
		console.log("inside driver signup");
		
		var msg_payload = { "firstname": firstName, "lastname": lastName, "address" : address, "city" : city, "state" : state,
				            "zipcode" : zipcode, "phone" : phone,"email": email, "password": password, "gender" : gender,
				            "carnumber" : carNumber, "carmodel" : carModel, "ssnnumber" : ssnNumber,
				            "lat": lat, "lng":lng};
		mq_client.make_request('driver_signup_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
//				throw err;
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
				res.send(json_responses);
			}
			else 
			{
				if(results.code == 200){
					console.log("valid Registration");
					var json_responses = {"success" : 1};
					res.send(json_responses);
					//res.render('index', {title: 'Login'});
				}
				else {    
					
					console.log("Registration Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
					//res.render('fail', {title: 'Failed'});
				}
			}  
		});
	}

};

exports.driverLogin = function(req, res){
	
	var email = req.param("email");
	var password = req.param("password");
		
	if (email==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter email"};
		res.send(json_responses);
	}
	else if (password==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter password"};
		res.send(json_responses);
	}
	else if (password.length<6)
	{
		var json_responses = {"success" : 0,"error" : "Password length must be more than 6 characters"};
		res.send(json_responses);
	}
	else
	{
		console.log("inside driver login");
		
		var msg_payload = { "email": email, "password": password};
		
		mq_client.make_request('driver_login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				console.log("error");
//				throw err;
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
				res.send(json_responses);
			}
			else 
			{
				if(results.code == "200"){
					
					var json_responses = {"success" : results.success};
					req.session.username = results.username;
					req.session.lastname = results.lastname;
					req.session.userId = results.userId;
					req.session.email = results.email;
					req.session.isUser = false;
					res.send(json_responses);
					
					
					
					//res.render('index', {title: 'Login'});
				}
				else {    
					
					console.log("Registration Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
					//res.render('fail', {title: 'Failed'});
				}
			}  
		});
	}
};

exports.userSignUp = function(req, res){
	
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zipcode");
	var phone = req.param("phone");
	var email = req.param("email");
	var password = req.param("password");
	var gender = req.param("gender");
	var cardNumber = req.param("cardNumber");
	var cardCvv = req.param("cardCvv");
	var cardExpirationDate= req.param("cardExpirationDate");
	var zipcodeCheck = /(\d{5}([\-]\d{4})?)/; 
	
		
	if (firstName==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter first name"};
		res.send(json_responses);
	}
	else if (lastName==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter last name"};
		res.send(json_responses);
	}
	else if (gender==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please select Gender"};
		res.send(json_responses);
	}
	else if (email==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter email"};
		res.send(json_responses);
	}
	else if (password==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter password"};
		res.send(json_responses);
	}
	else if (password.length<6)
	{
		var json_responses = {"success" : 0,"error" : "Password length must be more than 6 characters"};
		res.send(json_responses);
	}
	else if (cardNumber==undefined||cardNumber.toString().length!=16)
	{
		var json_responses = {"success" : 0,"error" : "Please enter correct credit card number"};
		res.send(json_responses);
	}
	else if (cardCvv==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter credit card cvv"};
		res.send(json_responses);
	}
	else if (!zipcodeCheck.test(zipcode))
	{
		var json_responses = {"success" : 0,"error" : "Incorrect zipcode entered"};
		res.send(json_responses);
	}
	else if (cardCvv.toString().length != 3)
	{
		var json_responses = {"success" : 0,"error" : "Please enter valid credit card cvv"};
		res.send(json_responses);
	}
	else if (cardExpirationDate.length == undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter valid credit card expiration date"};
		res.send(json_responses);
	}
	else
	{
		console.log("inside user signup");
		
		var msg_payload = { "firstname": firstName, "lastname": lastName, "address" : address, "city" : city, "state" : state,
				            "zipcode" : zipcode, "phone" : phone,"email": email, "password": password, "gender" : gender,
				            "cardnumber" : cardNumber, "cardcvv" : cardCvv, "cardexpirationdate" : cardExpirationDate,
				            };
		
		mq_client.make_request('user_signup_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
//				throw err;
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
				res.send(json_responses);
			}
			else 
			{
				if(results.code == 200){
					console.log("valid Registration");
					var json_responses = {"success" : 1};
					res.send(json_responses);
					//res.render('index', {title: 'Login'});
				}
				else {    
					
					console.log("Registration Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
					//res.render('fail', {title: 'Failed'});
				}
			}  
		});
	}
};

exports.userLogin = function(req, res){
	
	var email = req.param("email");
	var password = req.param("password");
		
	if (email==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter email"};
		res.send(json_responses);
	}
	else if (password==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter password"};
		res.send(json_responses);
	}
	else if (password.length<6)
	{
		var json_responses = {"success" : 0,"error" : "Password length must be more than 6 characters"};
		res.send(json_responses);
	}
	else
	{
		console.log("inside user login");
		
		var msg_payload = { "email": email, "password": password};
		
		mq_client.make_request('user_login_queue',msg_payload, function(err,results){
			
			console.log(results);
			if(err){
				console.log("error");
//				throw err;
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
				res.send(json_responses);
			}
			else 
			{
				if(results.code == "200"){
					console.log("Login Success!");
					var json_responses = {"success" : results.success, "status":results.status};
					req.session.username = results.firstname;
					req.session.lastname = results.lastname;
					req.session.email = results.email;
					req.session.userId = results.userId;
					req.session.isUser = true;
					req.session.status = results.status;
					//console.log("User status: "+results.email);
					res.send(json_responses);
					//res.render('index', {title: 'Login'});
				}
				else {    
					
					console.log("Registration Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
					//res.render('fail', {title: 'Failed'});
				}
			}  
		});
	}
};

exports.adminLogin = function(req, res) {
	var email = req.param("email");
	var password = req.param("password");
		
	if (email==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter email"};
		res.send(json_responses);
	}
	else if (password==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter password"};
		res.send(json_responses);
	}
	else
	{	
		if(email=='admin@uber.com'&&password=='AdminLogin@15') {
			var json_responses = {"success" : 1};
			req.session.isAdmin = true;
			res.send(json_responses);
		} else {
			var json_responses = {"success" : 0,"error" : "Incorrect credentials"};
			res.send(json_responses);
		}		
	}	
}

exports.getUserHomepage = function(req, res) {
	res.render('userHomepage', {title: 'Logged in'});
}

exports.getDriverHomepage = function(req, res) {
	res.render('driverHomepage', {title: 'Logged in'});
}

exports.showDriverProfile= function(req, res) {
	res.render('driverProfile', {title: 'Logged in'});
}

exports.showUserHistory= function(req, res) {
	res.render('userHistory', {title: 'Logged in'});
}

exports.showDriverHistory= function(req, res) {
	res.render('driverHistory', {title: 'Logged in'});
}

exports.getAdminHomepage= function(req, res) {
	res.render('adminHomepage', {title: 'Logged in'});
}
