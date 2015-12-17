var mq_client = require('../rpc/client');
var util = require('util');

exports.updateUserProfile = function(req, res){
	console.log("In update");
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zipcode");
	var phone = req.param("phone");
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
	else if (!zipcodeCheck.test(zipcode))
	{
		var json_responses = {"success" : 0,"error" : "Incorrect zipcode entered"};
		res.send(json_responses);
	}
	else if (cardNumber==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter credit card number"};
		res.send(json_responses);
	}
	else if (cardNumber.toString().length!=16)
	{
		var json_responses = {"success" : 0,"error" : "Please enter correct credit card number"};
		res.send(json_responses);
	}
	else if (cardCvv==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter credit card cvv"};
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
		console.log("inside user profile");
		
		var msg_payload = { "firstname": firstName, "lastname": lastName, "address" : address, "city" : city, "state" : state,
				            "zipcode" : zipcode, "phone" : phone, "email" : req.session.email,
				            "cardnumber" : cardNumber, "cardcvv" : cardCvv, "cardexpirationdate" : cardExpirationDate};
		
		mq_client.make_request('update_user_profile_queue',msg_payload, function(err,results){
			
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

exports.updateDriverProfile = function(req, res){
	
	var firstName = req.param("firstName");
	var lastName = req.param("lastName");
	var address = req.param("address");
	var city = req.param("city");
	var state = req.param("state");
	var zipcode = req.param("zipcode");
	var phone = req.param("phone");
	var carNumber = req.param("carNumber");
	var carModel = req.param("carModel");
	var ssnNumber= req.param("ssnNumber");
	var lat = req.param("lat");
	var lng = req.param("lng");
	var video = req.param("video");
	var videoCheck = /^https:\/\/www.youtube.com\/embed/;
	var zipcodeCheck = /(\d{5}([\-]\d{4})?)/;
	var ssnCheck = /(^\d{3}-?\d{2}-?\d{4}$)/;
	
	if (firstName==undefined ||firstName==='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter first name"};
		res.send(json_responses);
	}
	else if (lastName==undefined ||lastName==='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter last name"};
		res.send(json_responses);
	}
	else if (address==undefined||address=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter address"};
		res.send(json_responses);
	}
	else if (zipcode==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Please enter zipcode"};
		res.send(json_responses);
	}
	else if (!zipcodeCheck.test(zipcode))
	{
		var json_responses = {"success" : 0,"error" : "Incorret zipcode format "+zipcode};
		res.send(json_responses);
	}
	else if (state==undefined||state=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter state"};
		res.send(json_responses);
	}
	else if (city==undefined||city=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter City"};
		res.send(json_responses);
	}
	else if (phone==undefined||phone=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter Phone number"};
		res.send(json_responses);
	}
	else if (carNumber==undefined||carNumber=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter Car Number"};
		res.send(json_responses);
	}
	else if (ssnNumber == undefined||ssnNumber=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter ssn"};
		res.send(json_responses);
	}
	else if (!ssnCheck.test(ssnNumber))
	{
		var json_responses = {"success" : 0,"error" : "Incorrect SSN format"};
		res.send(json_responses);
	}
	else if (carModel == undefined||carModel=='')
	{
		var json_responses = {"success" : 0,"error" : "Please enter Car Model"};
		res.send(json_responses);
	}
	else if (!(video==undefined)&&(video.length!='')&&!videoCheck.test(video))
	{
		var json_responses = {"success" : 0,"error" : "Invalid youtube video link format"};
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
		console.log("inside driver profile");
		if(video==undefined) {
			video=='';
		}
		var msg_payload = { "firstname": firstName, "lastname": lastName, "address" : address, "city" : city, "state" : state,
				            "zipcode" : zipcode, "phone" : phone, "email" : req.session.email,
				            "carModel" : carModel, "ssnNumber" : ssnNumber, "carNumber" : carNumber, "lat":lat, "lng":lng, "video":video};
		
		mq_client.make_request('update_driver_profile_queue',msg_payload, function(err,results){
			
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
					//res.render('driverProfile');
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


exports.getUserProfile = function(req,res){
	
	console.log("email "+req.session.email);
	var msg_payload = { "userId": req.session.userId};
	console.log("in user profile");
	
	mq_client.make_request('get_user_profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
//			throw err;
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
			res.send(json_responses);
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Registration");
				
				var json_responses = {"success" : 1, "about" : results.about};
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

exports.getDriverProfile = function(req,res){
	
	console.log("email "+req.session.email);
	var msg_payload = { "email": req.session.email};
	console.log("in user profile");
	
	mq_client.make_request('get_driver_profile_queue',msg_payload, function(err,results){
		
		console.log(results);
		if(err){
//			throw err;
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem. Please try again."};
			res.send(json_responses);
		}
		else 
		{
			if(results.code == 200){
				console.log("valid Registration");
				
				var json_responses = {"success" : 1, "about" : results.about};
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