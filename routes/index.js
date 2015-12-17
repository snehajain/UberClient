var mq_client = require('../rpc/client');

exports.index = function(req, res){
	if(req.session.userId) {
		if(req.session.isUser) {//need to add check for driverSession and redirect to driver homepage
			var msg_payload = {};
			msg_payload.apiCall = "checkUserStatus";
			msg_payload.userId = req.session.userId;
			mq_client.make_request('user_queue', msg_payload, function (err, results) {
				if (err) {
					var json_responses = {
						"success": 0,
						"error": "Oops! There was some problem in checking user status. Please try again."
					};
					res.send(json_responses);
				}
				else {
					if (results.code == "200") {
						console.log("successful checkUserStatus");
						var json_responses = {"success": 1};
						if (results.rideData) {
							json_responses.rideData = JSON.stringify(results.rideData);
							if (results.rideData.status == "REQ") {
								res.render('rideRequested', json_responses);
							} else {
								res.render('rideStarted', json_responses);
							}
						} else {
							res.render('userHomepage');
						}
					}
					else {

						console.log("checkUserStatus Error!");
						var json_responses = {"success": 0, "error": results.errorMessage};
						res.send(json_responses);
						//res.render('fail', {title: 'Failed'});
					}

				}
			});
		} else {
			res.render('driverProfile', { title: 'Please login to use the application' });
		}
	} else if(req.session.isAdmin){
		res.render('adminHomepage', { title: 'Express' });
	} else {
		res.render('index', { title: 'Express' });
	}

};