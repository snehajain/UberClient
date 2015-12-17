/**
 * New node file
 */
var facebook = angular.module('uber', []);
//defining the login controller
facebook.controller('signupFunction', function($scope, $http, $window) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.driverSignUp = function() {
		var geocoder = new google.maps.Geocoder();
		var address = $scope.driverAddress+' '+$scope.driverCity+' '+$scope.driverState;
		var latitude, longitude;
		var addressCheck = true;
		var addressError = "";
		geocoder.geocode( { 'address': address}, function(results, status) {

		  if (status == google.maps.GeocoderStatus.OK) {
		  	console.log(results[0]);
		  	for(var i=0; i<results[0].address_components.length; i++) {
		  		if((results[0].address_components[i].types).indexOf("administrative_area_level_1")>-1) {
					if(!($scope.driverState.toLowerCase()===results[0].address_components[i].long_name.toLowerCase()||$scope.driverState.toLowerCase()===results[0].address_components[i].short_name.toLowerCase())) {
						console.log("Success");
						addressCheck=false;
						addressError = addressError + " States details do not match with address.";
						break;
					} 	  				
		  		} else if((results[0].address_components[i].types).indexOf("postal_code")>-1) {
		  			if(!($scope.driverZipcode.toString()===results[0].address_components[i].long_name.toLowerCase()||$scope.driverZipcode.toString()===results[0].address_components[i].short_name.toLowerCase())) {
						console.log("Success");
						addressCheck=false;
						addressError = addressError + " Zipcode details do not match with address.";
						break;
					} 
		  		}
		  	}	
		  	if (addressCheck){
		  		latitude = results[0].geometry.location.lat();
		     longitude = results[0].geometry.location.lng();		    
		     	$http({
				method : "POST",
				url : '/driverSignUp',
				data : {
					"firstName" : $scope.driverFirstName,
					"lastName" : $scope.driverLastName,
					"address" : $scope.driverAddress,
					"city" : $scope.driverCity,
					"state" : $scope.driverState,
					"zipcode" : $scope.driverZipcode,
					"phone" : $scope.driverPhone,
					"email" : $scope.driverSignupEmail,
					"password" : $scope.driverSignupPassword,
					"gender" : $scope.driverGender,
					"carNumber" : $scope.driverCarNumber,
					"carModel" : $scope.driverCarModel,
					"ssnNumber" : $scope.driverSSNNumber,
					"lat" : latitude,
					"lng" : longitude
				}
			}).success(function(data) {
				
				if(data.success == 1)
				{
				    console.log("Driver signup Successful");
				    $('#driversignup').modal('hide');	
				}
				else
				{
					alert(data.error);
				}
				 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  	} else {
		  		alert(addressError);
		  	}
		    
		  } else {
		  	alert("Invalid address");
		  } 
		}); 		
	};
	
	$scope.driverLogin = function() {
		
		$http({
			method : "POST",
			url : '/driverLogin',
			data : {
				"email" : $scope.driverLoginEmail,
				"password" : $scope.driverLoginPassword
			}
		}).success(function(data) {
									
			if(data.success == 1)
			{
				window.location.assign("/driverProfile"); 
//				alert("Successful login");
			}
			else if(data.success == 0)
			{
				alert("Please enter the correct password."); 
			}
			else if(data.success == -1)
			{
				alert("Please enter valid username and password."); 
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
	
	$scope.userSignUp = function() {
		console.log("zipc: "+$scope.userGender);
		$http({
			method : "POST",
			url : '/userSignUp',
			data : {
				"firstName" : $scope.userFirstName,
				"lastName" : $scope.userLastName,
				"address" : $scope.userAddress,
				"city" : $scope.userCity,
				"state" : $scope.userState,
				"zipcode" : $scope.userZipcode,
				"phone" : $scope.userPhone,
				"email" : $scope.userSignupEmail,
				"password" : $scope.userSignupPassword,
				"gender" : $scope.userGender,
				"cardNumber" : $scope.userCreditCardNumber,
				"cardCvv" : $scope.userCreditCardCvv,
				"cardExpirationDate" : $scope.userCreditCardExpirationDate,
			}
		}).success(function(data) {
			
			if(data.success == 1)
			{
			    alert("Successful");	
			}
			else
			{
				alert(data.error);
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
	
    $scope.userLogin = function() {
		
		$http({
			method : "POST",
			url : '/userLogin',
			data : {
				"email" : $scope.userLoginEmail,
				"password" : $scope.userLoginPassword
			}
		}).success(function(data) {
						
			if(data.success == 1)
			{
				if(data.status=='AVA') {
					window.location.assign("/userHomepage"); 	
				} else {
					$window.location.href='/rideRequested';
				}
				
				//alert("Successful login");
			}
			else if(data.success == 0)
			{
				alert("Please enter the correct password."); 
			}
			else if(data.success == -1)
			{
				alert("Please enter valid username and password."); 
			}
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};

	$scope.adminLogin = function() {
		
		$http({
			method : "POST",
			url : '/adminLogin',
			data : {
				"email" : $scope.adminLoginEmail,
				"password" : $scope.adminLoginPassword
			}
		}).success(function(data) {
						
			if(data.success == 1)
			{
				window.location.assign("/adminHomepage"); 					
			}
			else if(data.success == 0)
			{
				alert(data.error); 
			}			
			 
		}).error(function(error) {
            alert("There was an error. Please try again.");
		});
	};
})

// facebook.controller('signinFunction', function($scope, $http) {
// 	//Initializing the 'invalid_login' and 'unexpected_error' 
// 	//to be hidden in the UI by setting them true,
// 	//Note: They become visible when we set them to false
// 	alert("inJSSignIn");
// 	$scope.invalid_login = true;
// 	$scope.unexpected_error = true;
// 	$scope.signin = function() {
			
// 		$http({
// 			method : "POST",
// 			url : '/signin',
// 			data : {
// 				"email" : $scope.session_key,
// 				"password" : $scope.session_password
// 			}
// 		}).success(function(data) {			
// 			if(data.success == 1)
// 			{
// 				window.location.assign("/homepage"); 
// 			}
// 			else if(data.success == 0)
// 			{
// 				alert("Please enter the correct password."); 
// 			}
// 			else if(data.success == -1)
// 			{
// 				alert("Please enter valid username and password."); 
// 			}
// 		}).error(function(error) {
// //			$scope.unexpected_error = false;
// //			$scope.invalid_login = true;
// 		});
// 	};
// })