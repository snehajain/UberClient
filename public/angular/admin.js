var adminHomepageApp = angular.module('adminHomepageApp', [ 'ngMap' ]);

adminHomepageApp.controller('adminCtr', function($scope,$compile, $http, $window) {
	//Initializing the 'invalid_login' and 'unexpected_error' 
	//to be hidden in the UI by setting them true,
	//Note: They become visible when we set them to false
	$scope.clear = function() {
		 $scope.price = null;
		 $scope.date = null;
		
	}
	
	$scope.getRidesByDate = function() {
		$scope.$apply();
		console.log($scope.date);
		     	$http({
				method : "POST",
				url : '/getRidesByDate',
				data : {
					"date" : $scope.date	
				}
			}).success(function(response) {
				if(response.code == 200)
				{
					if(!response.value){
						alert("No Results found ");
					}else{
				  // resposen.value (list of lats and langs)
					//	alert(response.value);
						
					 var directionsService = new google.maps.DirectionsService();
					 var num, map, data;
					 var requestArray = [], renderArray = [];
					 var destinationArray = response.value;
					 var routes=[];
					 for(i=0;i<destinationArray.length;i++){
					 var slatlng = new google.maps.LatLng(destinationArray[i].start_location_lat, destinationArray[i].start_location_lng);
					 var elatlng = new google.maps.LatLng(destinationArray[i].end_location_lat, destinationArray[i].end_location_lng);
					 var request = {
				                origin: slatlng,
				                destination: elatlng,
				                travelMode: google.maps.TravelMode.DRIVING
				            };
					 //alert(destinationArray[i].start_location_lat+destinationArray[i].start_location_lng);
					 

				            // and save it in our requestArray
				            requestArray.push({"route":[slatlng,elatlng], "request": request});
				        }
					   var i = 0;
					  
				        // Used to submit the request 'i'
				        function submitRequest(){
				            directionsService.route(requestArray[i].request, directionResults);
				        }

				        // Used as callback for the above request for current 'i'
				        function directionResults(result, status) {
				        	//alert(status);
				            if (status == google.maps.DirectionsStatus.OK) {
				                
				                // Create a unique DirectionsRenderer 'i'
				                renderArray[i] = new google.maps.DirectionsRenderer();
				                renderArray[i].setMap($scope.map);

				                // Some unique options from the colorArray so we can see the routes
				                renderArray[i].setOptions({
				                    preserveViewport: true,
				                    suppressInfoWindows: true,
				                    polylineOptions: {
				                        strokeWeight: 4,
				                        strokeOpacity: 0.8,
				                        strokeColor: 'blue'
				                    },
				                    markerOptions:{
				                        icon:{
				                            path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
				                            scale: 3,
				                            strokeColor: 'blue'
				                        }
				                    }
				                });

				                // Use this new renderer with the result
				                renderArray[i].setDirections(result);
				                // and start the next request
				                nextRequest();
				            }

				        }

				        function nextRequest(){
				            // Increase the counter
				            i++;
				            // Make sure we are still waiting for a request
				            if(i >= requestArray.length){
				                // No more to do
				                return;
				            }
				            // Submit another request
				            submitRequest();
				        }

				        // This request is just to kick start the whole process
				        submitRequest();	
						
					}
				}else {
					alert("invalid date formate");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  };

	

	$scope.getUserProfile = function() {
		
		
		console.log($scope.user_email);
		     	$http({
				method : "POST",
				url : '/getProfiles',
				data: {"user" : 1,
						"userEmail":$scope.user_email}
			
			}).success(function(response) {
				
				if(response.value){
				$scope.search_flag =1;
				$scope.user_flag =1;
				$scope.driver_flag =null;
				var value = response.value;
				$scope.firstname = value.firstname;
				$scope.lastname = value.lastname;
				$scope.address = value.address;
				$scope.city = value.city;
				$scope.state = value.state;
				$scope.zipcode = value.zipcode;
				$scope.phone = value.phone;
				$scope.cardnumber = value.cardnumber;
				$scope.cardcvv = value.cardcvv;
				$scope.cardexpirationdate = value.cardexpirationdate;
				}else{
					alert("No results found");
				}
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  
		
	};
	
	$scope.getDriverProfile = function() {
		console.log($scope.driver_email);
		     	$http({
				method : "POST",
				url : '/getProfiles',
				data : {
					"user" : 0,
					"userEmail":$scope.driver_email
				}
			}).success(function(response) {
				
				if(response.value)
				{
						$scope.search_flag =1;
						$scope.driver_flag =1;
						$scope.user_flag =null;
						var value = response.value;
						$scope.firstname = value.firstname;
						$scope.lastname = value.lastname;
						$scope.address = value.address;
						$scope.city = value.city;
						$scope.state = value.state;
						$scope.zipcode = value.zipcode;
						$scope.phone = value.phone;
						$scope.carNumber = value.carnumber;
						$scope.carModel = value.carmodel;
						$scope.ssnNumber = value.ssnnumber;
						
				}else {
					alert("No result found");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  
		
	};
	
	$scope.viewAdminBill = function() {
		$scope.viewBill = function(bill)
		{	
			$scope.rideSelected = bill;		
			//window.location.assign("/viewUserBill");
		};
	
		console.log($scope.billDate);
		     	$http({
				method : "POST",
				url : '/adminViewBill',
				data : {
					"date" : $scope.billDate,
					"userEmail":$scope.userEmail
				}
			}).success(function(response) {
				
				if(response.code == 200)
				{
					// render to usrHisotry
					$scope.billDate = null;
					$scope.userEmail= null;
					$scope.billList= response.value;
					
					
				}else {
					alert("No results found for the User");
				} 
			}).error(function(error) {
	            alert("There was an error in viewAdminBill. Please try again.");
			});
		  };
	
	
	$scope.getRevenue = function() {
		 
		 
		 $scope.price = null;
		console.log($scope.date);
		     	$http({
				method : "POST",
				url : '/getRevenue',
				data : {
					"date" : $scope.date	
				}
			}).success(function(response) {
				
				if(response.code == 200)
				{
					if(!response.price){
						alert("No Results found ");
					}else{
				   $scope.price = response.price;
					}
				}else {
					alert("invalid date formate");
				} 
			}).error(function(error) {
	            alert("There was an error. Please try again.");
			});
		  } 
}); 	

//defining the login controller
