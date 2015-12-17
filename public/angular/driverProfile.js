/**
 * New node file
 */
var facebook = angular.module('uber', []);
// defining the login controller
facebook.controller('driverController', function($scope, $http, $timeout, $window)
{

	$scope.isProfile = true;

	$http.get('/getDriverProfile').success(function(data)
	{

		$scope.firstname = data.about.firstname;
		$scope.lastname = data.about.lastname;
		$scope.address = data.about.address;
		$scope.city = data.about.city;
		$scope.state = data.about.state;
		$scope.zipcode = data.about.zipcode;
		$scope.phone = data.about.phone;
		$scope.carNumber = data.about.carnumber;
		$scope.carModel = data.about.carmodel;
		$scope.ssnNumber = data.about.ssnnumber;
		$scope.introVideo = data.about.video;
		// $scope.$apply();
	});

	$scope.onUploadSelect = function($files)
	{
		alert("ala");
		$scope.newResource.newUploadName = $files[0].name;
	};

	$scope.updateDriverProfile = function()
	{

		var geocoder = new google.maps.Geocoder();
		var new_address = $scope.address+' '+$scope.city+' '+$scope.state;
		var latitude, longitude;
		var addressCheck = true;
		var addressError = "";
		geocoder.geocode( { 'address': new_address}, function(results, status) {

		  if (status == google.maps.GeocoderStatus.OK) {
		  	console.log(results[0]);
		  	for(var i=0; i<results[0].address_components.length; i++) {
		  		if((results[0].address_components[i].types).indexOf("administrative_area_level_1")>-1) {
					if(!($scope.state.toLowerCase()===results[0].address_components[i].long_name.toLowerCase()||$scope.state.toLowerCase()===results[0].address_components[i].short_name.toLowerCase())) {
						console.log("Success");
						addressCheck=false;
						addressError = addressError + " States details do not match with address.";
						break;
					} 	  				
		  		} else if((results[0].address_components[i].types).indexOf("postal_code")>-1) {
		  			if(!($scope.zipcode.toString()===results[0].address_components[i].long_name.toLowerCase()||$scope.zipcode.toString()===results[0].address_components[i].short_name.toLowerCase())) {
						console.log("Success");
						addressCheck=false;
						addressError = addressError + " Zipcode details do not match with address.";
						break;
					} 
		  		}
		  	  }
		  	  if(addressCheck) {
		  	  	latitude = results[0].geometry.location.lat();
		    	 longitude = results[0].geometry.location.lng();
				$http({
				method : "POST",
				url : '/updateDriverProfile',
				data : {
				"firstName" : $scope.firstname,
				"lastName" : $scope.lastname,
				"address" : $scope.address,
				"city" : $scope.city,
				"state" : $scope.state,
				"zipcode" : $scope.zipcode,
				"phone" : $scope.phone,
				"carNumber" : $scope.carNumber,
				"carModel" : $scope.carModel,
				"ssnNumber" : $scope.ssnNumber,
				"video": $scope.introVideo,
				"lat" : latitude,
				"lng" : longitude 
				}
				}).success(function(data) {
				
				if (data.success == 1) {
				alert("Profile update successfully");
				} else {
				alert(data.error);
				}
				
				}).error(function(error) {
				alert("There was an error. Please try again.");
				});
			 }	else {
			 	alert(addressError);
			 }
		  	} else {
		  		alert("Invalid address entered");	
		  	}
		  	
		 });

		// $scope.fileSelected = function(files) {
		// if (files && files.length) {
		// $scope.file = files[0];
		// alert("got file");
		// }
		//		 
		// $upload.upload({
		// url: "/updateDriverProfile", //node.js route
		// file: $scope.file,
		// data : {
		// "firstName" : $scope.firstname,
		// "lastName" : $scope.lastname,
		// "address" : $scope.address,
		// "city" : $scope.city,
		// "state" : $scope.state,
		// "zipcode" : $scope.zipcode,
		// "phone" : $scope.phone,
		// "cardNumber" : $scope.cardNumber,
		// "cardCvv" : $scope.cardCvv,
		// "cardExpirationDate" : $scope.cardExpirationDate,
		// }
		// })
		// .success(function(data) {
		// console.log(data, 'uploaded');
		// });
		//		 
		// };

		// $http({
		// method : "POST",
		// url : '/updateDriverProfile',
		// data : {
		// "firstName" : $scope.firstname,
		// "lastName" : $scope.lastname,
		// "address" : $scope.address,
		// "city" : $scope.city,
		// "state" : $scope.state,
		// "zipcode" : $scope.zipcode,
		// "phone" : $scope.phone,
		// "cardNumber" : $scope.cardNumber,
		// "cardCvv" : $scope.cardCvv,
		// "cardExpirationDate" : $scope.cardExpirationDate,
		// }
		// }).success(function(data) {
		//
		// if (data.success == 1) {
		// alert("Profile update successfully");
		// } else {
		// alert(data.error);
		// }
		//
		// }).error(function(error) {
		// alert("There was an error. Please try again.");
		// });
	};

	$scope.counter = 0;
	$scope.isDoneOnce = false;
	$scope.onTimeout = function()
	{
		// $scope.counter++;

		$scope.getDriverStatus = $http.get('/getDriverStatus').success(
				function(data)
				{

					console.log(data.status);

					if (data.status == "AVA")
					{
						console.log("available");
					} else if (data.status == "REQ" && $scope.isDoneOnce == false)
					{
						alert("You've been requested. Starting ride now");
						console.log("requested");
						// $scope.startRide();
						$http.post('/startRide').success(function(data)
						{

							if (data.code == 200 && data.rideId)
							{
								alert("Ride has been started");

								$scope.rideId = data.rideId;
								$scope.startLat = data.startLat;
								$scope.startLng = data.startLng;
								$scope.endLat = data.endLat;
								$scope.endLng = data.endLng;
								$scope.userId = data.userId;
								$scope.isDoneOnce = true;
							} else
							{
								alert("Ride was cancelled by user");

							}

							//$scope.isDoneOnce = true;
						});
					} else if (data.status == "STA")
					{
						console.log("started");

						var origin = new google.maps.LatLng($scope.startLat,
								$scope.startLng);
						var destination = new google.maps.LatLng($scope.endLat,
								$scope.endLng);

						var service = new google.maps.DistanceMatrixService();
						service.getDistanceMatrix({
							origins : [ origin ],
							destinations : [ destination ],
							travelMode : google.maps.TravelMode.DRIVING,
							unitSystem : google.maps.UnitSystem.IMPERIAL
						}, function callback(response, status)
						{

							if (status == google.maps.DistanceMatrixStatus.OK)
							{
								var origins = response.originAddresses;
								var destinations = response.destinationAddresses;

								var distanceString = "";

								for (var i = 0; i < origins.length; i++)
								{
									var results = response.rows[i].elements;
									for (var j = 0; j < results.length; j++)
									{
										var element = results[j];
										var distance = element.distance.text;
										var duration = element.duration.text;
										distanceString = distance.split(" ")[0];
										var from = origins[i];
										var to = destinations[j];
									}

									//alert(distanceString);
									alert("Click to end your ride");

									$http({
										method : "POST",
										url : '/endRide',
										data : {
											"distance" : parseFloat(distanceString)
										}
									}).success(function(data)
									{

										if (data.code == 200)
										{
											alert("Ride has been ended");
											
											$http({
												method : "POST",
												url : '/generateBill',
												data : {
													"rideId" : $scope.rideId
												}
											}).success(function(data)
											{

												if (data.code == 200)
												{
													$('#ratingModal').modal('show'); 
//													alert("Ride has been ended");
												} else
												{
//													alert("Ride was not able to be ended");
												}

												$scope.isDoneOnce = false;

											}).error(function(error)
											{
												alert("There was an error. Please try again.");
											});

										} else
										{
											alert("Ride was not able to be ended");
										}

										$scope.isDoneOnce = false;

									}).error(function(error)
									{
										alert("There was an error. Please try again.");
									});
								}
							}
						});
					}
				});

		mytimeout = $timeout($scope.onTimeout, 10000);
	}
	var mytimeout = $timeout($scope.onTimeout, 10000);

	 $('#ratingModal').on('shown.bs.modal', function () {
      console.log("setting driver and ride id");
      (document.getElementById("rideId")).value = $scope.rideId;
      (document.getElementById("userId")).value = $scope.userId;
     });

	  $('#ratingModal').on('hide.bs.modal', function () {
      console.log("In hide modal");
      alert("A default rating of one will be given to the user");      
     });

	$scope.stop = function()
	{
		$timeout.cancel(mytimeout);
	}
})