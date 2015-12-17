var ejs = require("ejs");
var mq_client = require('../rpc/client');

exports.getRideRequestedPage = function(req,res){
	var msg_payload = { "userId": req.session.userId};		
	msg_payload.apiCall = "getRideRequestedId";
	mq_client.make_request('ride_queue',msg_payload, function(err,results){
		if(err){
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem in retrieving ride data for user. Please try again."};
			res.send(json_responses);
		}
		else 
		{				
			if(results.code=="200") {
				console.log("successful getRideRequestedId");
				var json_responses = {"success" : 1};
				if(results.rideData) {
					json_responses.rideData = JSON.stringify(results.rideData);
					if(results.rideData.status=="REQ") {
						res.render('rideRequested',json_responses);
					} else {
						res.render('rideStarted',json_responses);
					}
				} else {
					res.render('userHomepage', {title: 'Logged in'});
				}					
			} else {
				console.log("getRideRequestedPage Error!");
				var json_responses = {"success" : 0,"error" : results.errorMessage};
				res.send(json_responses);
			}
		}  
	});
}

exports.cancelRide = function(req, res) {
	var rideId = req.param("id");
	var driverId = req.param("driverId");
	if(rideId == undefined) {
		var json_responses = {"success" : 0,"error" : "Ride id not present"};
		res.send(json_responses);
	} else if(driverId == undefined) {
		var json_responses = {"success" : 0,"error" : "Driver id not present"};
		res.send(json_responses);
	} else {
		var msg_payload = { "rideId": rideId, "userId": req.session.userId, "driverId": driverId};		
		msg_payload.apiCall = "cancelRide";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in cancelRide. Please try again."};
				res.send(json_responses);
			}
			else 
			{				
				if(results.code=="200") {
					console.log("successful getRideRequestedId");
					var json_responses = {"success" : 1};
					res.send(json_responses);					
				} else {
					console.log("getRideRequestedPage Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
				}
			}  
		});
	}
}

exports.changeDestination = function(req,res) {
	var rideId = req.param("rideId");
	var end_location = req.param("end_location");
	var end_location_lat = req.param("end_location_lat");
	var end_location_lng = req.param("end_location_lng");
	if(rideId == undefined) {
		var json_responses = {"success" : 0,"error" : "Ride id not present"};
		res.send(json_responses);
	} else if(end_location == undefined) {
		var json_responses = {"success" : 0,"error" : "end_location not present"};
		res.send(json_responses);
	} else if(end_location_lat == undefined) {
		var json_responses = {"success" : 0,"error" : "end_location_lat not present"};
		res.send(json_responses);
	} else if(end_location_lng == undefined) {
		var json_responses = {"success" : 0,"error" : "end_location_lat not present"};
		res.send(json_responses);
	} else {
		var msg_payload = { "rideId": rideId, "end_location": end_location, "end_location_lat": end_location_lat, "end_location_lng":end_location_lng};		
		msg_payload.apiCall = "changeDestination";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in changeDestination. Please try again."};
				res.send(json_responses);
			}
			else 
			{				
				if(results.code=="200") {
					console.log("successful changeDestination");
					var json_responses = {"success" : 1};
					res.send(json_responses);					
				} else {
					console.log("changeDestination Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
				}
			}  
		});
	}	
}

exports.checkRideStatus = function(req, res) {
	var rideId = req.param("rideId");
	if(rideId == undefined) {
		var json_responses = {"success" : 0,"error" : "Ride id not present"};
		res.send(json_responses);
	} else {
		var msg_payload = { "rideId": rideId};		
		msg_payload.apiCall = "checkRideStatus";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in checkRideStatus. Please try again."};
				res.send(json_responses);
			}
			else 
			{				
				if(results.code=="200") {
					console.log("successful checkRideStatus");
					var json_responses = {"success" : 1};
					json_responses.status = results.status;
					res.send(json_responses);					
				} else {
					console.log("checkRideStatus Error!");
					var json_responses = {"success" : 0,"error" : results.errorMessage};
					res.send(json_responses);
				}
			}  
		});
	}	
}


//Admin apis

	
exports.driverChart= function(req, res){
		
		var driverEmail = "apoorv@gmail.com"; //req.param("driverEmail");
		
		if (driverEmail==undefined)
		{
			var json_responses = {"success" : 0,"error" : "rideid not defined"};
			res.send(json_responses);
		}
		else
		{
			console.log("Inside driverChart");
			
			var msg_payload = { "driverEmail": driverEmail };		
			msg_payload.apiCall = "driverChart";
			mq_client.make_request('ride_queue',msg_payload, function(err,results){
				
				//console.log(results);
				if(err){
					var json_responses = {"success" : 0,"error" : "Oops! There was some problem in geting driver chart. Please try again."};
					res.send(json_responses);
				}
				else 
				{
						console.log("successful driverChart");
						console.log(results);
						var json_responses = JSON.parse(results.value);
						json_responses.code = results.code;
						
						res.send(json_responses);
					
				}  
			});
		}
	}


exports.userChart= function(req, res){
	
	var userEmail = "waad@gmail"; //req.param("driverEmail");
	
	if (userEmail==undefined)
	{
		var json_responses = {"success" : 0,"error" : "rideid not defined"};
		res.send(json_responses);
	}
	else
	{
		console.log("Inside userChart");
		
		var msg_payload = { "userEmail": userEmail };		
		msg_payload.apiCall = "userChart";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in geting user chart. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful userChart");
					console.log(results);
					var json_responses = JSON.parse(results.value);
					json_responses.code = results.code;
					
					res.send(json_responses);
				
			}  
		});
	}
}




exports.areaChart= function(req, res){
	
	//var userEmail = "waad@gmail"; //req.param("driverEmail");
	
	
		console.log("Inside areaChart");
		
		var msg_payload = {};		
		msg_payload.apiCall = "areaChart";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in geting areas chart. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful userChart");
					console.log(results);
					var json_responses = JSON.parse(results.value);
					json_responses.code = 200;
					
					res.send(json_responses);
				
			}  
		});
	
}
//

exports.getRidesByDate= function(req, res){
	
	//var userEmail = "waad@gmail"; //req.param("driverEmail");
	
	console.log("Inside getRidesByDate");
	var datep = req.param("date")//  "2015-12-01 00:00:00"// req.param("date");
	var date = new Date(datep);
	console.log(datep);
	if(date == "Invalid Date"){
		console.log("here");
		var json_responses = {
				value :"Invalid Date",
				code : 401
			};
			console.log(json_responses);
			res.send(json_responses);
		
	}else{
	console.log(date);
	var msg_payload = {"date":datep};		
	msg_payload.apiCall = "getRidesByDate";
	mq_client.make_request('ride_queue',msg_payload, function(err,results){
		
		//console.log(results);
		if(err){
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem in getRidesByDate. Please try again."};
			res.send(json_responses);
		}
		else 
		{
					console.log("successful getRidesByDate");
					console.log(results);
					var json_responses = {
							value :results.value,
					code:200}
					
					
					res.send(json_responses);
				
			}  
		});
	
}
}


exports.getRevenue= function(req, res){
	
	//var userEmail = "waad@gmail"; //req.param("driverEmail");
	
	
		console.log("Inside getRevenue");
		var datep = req.param("date")//  "2015-12-01 00:00:00"// req.param("date");
		var date = new Date(datep);
		console.log(datep);
		if(date == "Invalid Date"){
			console.log("here");
			var json_responses = {
					value :"Invalid Date",
					code : 401
				};
				console.log(json_responses);
				res.send(json_responses);
			
		}else{
		console.log(date);
		var msg_payload = {"date":datep};		
		msg_payload.apiCall = "getRevenue";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in getRevenue. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful getRevenue");
					var price = results.value;
					var json_responses = {
						"price" :price,
						"code" : 200
					};
					console.log(json_responses);
					res.send(json_responses);
					//res.render('adminUI',{price:price})
					
				
			} 
		
		});
		}
		
}



exports.getProfiles= function(req, res){
	
	//var userEmail = "waad@gmail"; //req.param("driverEmail");
	var user = req.param("user");
	var userEmail = req.param("userEmail");//"waad@gmail"; //
	var msg_payload = {userEmail:userEmail, user:user};	
		console.log("Inside getProfiles");		
		msg_payload.apiCall = "getProfiles";
		mq_client.make_request('ride_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err || res.code=="401"){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in getProfiles. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful getProfiles");
					console.log( results);
					var profiles = results.value[0];
					if(!profiles){
						console.log("code : 401");
						res.send({code : 401});
					}else{
						res.send({code : 200,value:profiles});
					}
			} 
		
		});
		}


