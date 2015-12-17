var mq_client = require('../rpc/client');
 
exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.selectDriver = function(req,res) {
	console.log("In selectDriver");
	var sourceAddress = req.param("sourceAddress");
	var sourceCoordinates = req.param("sourceCoordinates");
	var destinationCoordinates = req.param("destinationCoordinates");
	var destinationAddress = req.param("destinationAddress");
	var driverId = req.param("driverId");	
	if (sourceAddress==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Source Address not defined"};
		res.send(json_responses);
	}
	else if (sourceCoordinates==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Source Coordinates not defined"};
		res.send(json_responses);
	}
	else if (destinationCoordinates==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Destination Coordinates not defined"};
		res.send(json_responses);
	}
	else if (destinationAddress==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Destination Address not defined"};
		res.send(json_responses);
	}
	else if (driverId==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Driver id not defined"};
		res.send(json_responses);
	}
	else
	{	
		console.log("Inside selectDriver");
		
		var msg_payload = { "sourceAddress": sourceAddress, "sourceCoordinates":sourceCoordinates, "destinationCoordinates":destinationCoordinates, "destinationAddress":destinationAddress, "driverId":driverId, "userId":req.session.userId };		
		msg_payload.apiCall = "selectDriverCreateRide";
		mq_client.make_request('user_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in retrieving drivers. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful selectDriver and rideCreate");
					var json_responses = {"success" : 1};
					json_responses.rideId = results.rideId;
					res.send(json_responses);
				
			}  
		});
	}
}

exports.getProfile = function(req, res) {
	console.log("Inside user getProfile");
	res.render('userProfile');	

}

exports.deleteUser = function(req,res) {
	console.log("Inside selectDriver");
		
		var msg_payload = { "userId":req.session.userId };		
		msg_payload.apiCall = "deleteUser";
		mq_client.make_request('user_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in deleting user. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful delete user");					
					req.session.destroy();
					res.render('index');
				
			}  
		});
	
}

exports.rateDriver = function(req, res) {
	console.log("In rateDriver"+req.param("star")+" "+req.param("rideId"));
	var rating = req.param("star");
	var rideId = req.param("rideId");
	var driverId = req.param("driverId");	
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
	else if (driverId==undefined)
	{
		var json_responses = {"success" : 0,"error" : "Driver Id not defined"};
		res.send(json_responses);
	} else {
		var msg_payload = { "userId":req.session.userId, "rating":rating, "rideId":rideId, "driverId":driverId };		
		msg_payload.apiCall = "rateDriver";
		mq_client.make_request('user_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in driver rating. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful delete user");					
					res.render('userHomepage');
				
			}  
		});
	}

}