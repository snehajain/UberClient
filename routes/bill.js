var mq_client = require('../rpc/client');

exports.generateBill = function(req, res){
	
	var rideid = req.param("rideId"); //req.param("rideid");
	
	if (rideid==undefined)
	{
		var json_responses = {"success" : 0,"error" : "rideid not defined"};
		res.send(json_responses);
	}
	else
	{
		console.log("Inside generateBill");
		
		var msg_payload = { "rideid": rideid };		
		msg_payload.apiCall = "generateBill";
		mq_client.make_request('bill_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in  generating Bill. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful generateBill");
					var json_responses = {"success" : 1};
					json_responses.code = results.code;
					res.send(json_responses);
				
			}  
		});
	}
}

exports.userBillList = function(req, res){
	
	var user_id = req.session.userId;//1 req.param("rideid");
	
	if (user_id==undefined)
	{
		var json_responses = {"success" : 0,"error" : "user_id not defined"};
		res.send(json_responses);
	}
	else
	{
		console.log("Inside userBillList");
		var type = req.session.isUser?'user':'driver';
		var msg_payload = { "user_id":user_id, "type": type };		
		msg_payload.apiCall = "userBillList";
		mq_client.make_request('bill_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err){
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in  generating Bill. Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful userBillList");
					var json_responses = {"success" : 1};
					json_responses.code = results.code;
					json_responses.value = JSON.parse(results.value);
					console.log(results.value);
					console.log(json_responses.value);
					res.send(json_responses);
					// render to vishwas page 
				
			}  
		});
	}
}

exports.viewUserBill= function(req, res) {
	res.render('viewBill', {title: 'Logged in'});
}

//Admin apis
exports.adminViewBill= function(req, res){
	console.log("Inside adminViewBill");
	//var userEmail = "waad@gmail"; //req.param("driverEmail");
	var date = req.param("date");
	var userEmail = req.param("userEmail");//"waad@gmail"; //
	var msg_payload = {userEmail:userEmail, date:date};	

				
		msg_payload.apiCall = "adminViewBill";
		console.log(msg_payload);
		mq_client.make_request('bill_queue',msg_payload, function(err,results){
			
			//console.log(results);
			if(err || res.code=="401"){
				//console.log("Error 202");
				var json_responses = {"success" : 0,"error" : "Oops! There was some problem in adminViewBill . Please try again."};
				res.send(json_responses);
			}
			else 
			{
					console.log("successful adminViewBill");
					var bills = results.value;
					console.log( results.value);
					if(bills.length ==0){
						res.send({code : 401});
					}else{
						// render to profile page or save to session
						console.log("in adminview bill code:200");
						res.send({code : 200,value:bills});
					}
					
					//res.render('profile',{profiles:profiles})
					
					
				
			} 
		
		});
		}




