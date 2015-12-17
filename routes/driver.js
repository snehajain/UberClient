var mq_client = require('../rpc/client');

exports.getNearbyDrivers = function(req, res){
	
	var lat = req.param("lat");
	var lng = req.param("lng");
	if (lat==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Latitude not defined"};
		res.send(json_responses);
	}
	else if (lng==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Longitude not defined"};
		res.send(json_responses);
	}
	else
	{
		console.log("Inside GetNearbyDrivers");
		
		var msg_payload = { "lat": lat, "lng":lng };		
		msg_payload.apiCall = "getNearbyDrivers";
		mq_client.make_request('driver_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in retrieving drivers. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful GetNearbyDrivers");
					var json_responses = {"success" : 1};
					json_responses.driversData = results.driversData;
					res.send(json_responses);
				
			}  
		});
	}
}

exports.getDriverStatus = function(req, res){
	
	console.log("inside get driver status");
	
	var msg_payload = { "driverId": req.session.userId };		
	msg_payload.apiCall = "getDriverStatus";
	mq_client.make_request('driver_queue',msg_payload, function(err,results){
		
		//console.log(results);
		if(err){
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem in retrieving drivers. Please try again."};
			res.send(json_responses);
		}
		else 
		{
				console.log("successful GetDriverStatus");
				var json_responses = {"success" : 1,"status" : results.status,"rideId" : results.rideId};
				res.send(json_responses);
			
		}  
	});
}

exports.startRide = function(req, res){
	
	console.log("inside start ride");
	
	var msg_payload = { "driverId": req.session.userId };		
	msg_payload.apiCall = "startRide";
	mq_client.make_request('driver_queue',msg_payload, function(err,results){
		
		//console.log(results);
		if(err){
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem in starting ride. Please try again."};
			res.send(json_responses);
		}
		else 
		{
			if(results.startLat==undefined) {
				console.log("code "+results.code);
				console.log("Ride cancelled");
				var json_responses = {"code" : results.code,"msg":"Ride cancelled"};
				res.send(json_responses);
			} else {
				console.log("code "+results.code);
				console.log("successful StartRide");
				var json_responses = {"code" : results.code,"startLat":results.startLat,"startLng":results.startLng,"endLat":results.endLat,"endLng":results.endLng,"rideId":results.rideId, "userId":results.userId};
				res.send(json_responses);
			}
		}  
	});
}

exports.endRide = function(req, res){
	
	console.log("inside end ride");
	
	var msg_payload = { "driverId": req.session.userId,"distance": req.param("distance") };		
	msg_payload.apiCall = "endRide";
	mq_client.make_request('driver_queue',msg_payload, function(err,results){
		
		//console.log(results);
		if(err){
			var json_responses = {"success" : 0,"error" : "Oops! There was some problem in ending ride. Please try again."};
			res.send(json_responses);
		}
		else 
		{
			    console.log("code "+results.code);
				console.log("successful endRide");
				var json_responses = {"code" : results.code};
				res.send(json_responses);
		}  
	});
}

exports.deleteDriver = function(req,res) {
	console.log("Inside deleteDriver");
		
		var msg_payload = { "userId":req.session.userId };		
		msg_payload.apiCall = "deleteDriver";
		mq_client.make_request('driver_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in deleting driver. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful delete driver");					
					req.session.destroy();
					res.render('index');
				
			}  
		});
}

exports.rateUser = function(req,res) {
	console.log("In rateUser"+req.param("star")+" "+req.param("rideId"));
	var rating = req.param("star");
	var rideId = req.param("rideId");
	var userId = req.param("userId");	
	if (rating==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Rating not provided"};
		res.send(json_responses);
	}
	else if (rideId==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Ride id not defined"};
		res.send(json_responses);
	}
	else if (userId==undefined)
	{
		var json_responses = {"success" : 0,"error" : "User Id not defined"};
		res.send(json_responses);
	} else {
		var msg_payload = { "driverId":req.session.userId, "rating":rating, "rideId":rideId, "userId":userId };		
		msg_payload.apiCall = "rateUser";
		mq_client.make_request('driver_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in driver rating. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful rateUser");					
					res.render('driverProfile', {title: 'Logged in'});
				
			}  
		});
	}

}