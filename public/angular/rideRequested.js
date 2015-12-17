var app = angular.module('rideRequested', []);
//defining the login controller
app.controller('rideRequestedController', function($scope, $http, $window, $interval) {
	
	$scope.geocoder = new google.maps.Geocoder();
	$scope.correctDestinationAddress = null;

	$scope.resetRide = function() {
		var data = {};
		data.id = $scope.rideData.id;
		data.driverId = $scope.rideData.driver_id;
		$http({
   			method : "PUT",
			url : '/cancelRide',
			data : data,
			responseType: "json",
			headers: {'Content-Type': 'application/json'}	
   		}).success(function(data){
   			console.log("Success in cancelRide");
   			if(data.success==1) {
   				$window.location.href='/userHomepage';
   			} else {
   				alert("Error in Cancelling ride, please try again. Error: "+ data.error);
   			}  			
   		}).error(function(err){
   			console.log("Error in selectDriver");
   		});
	}

	$scope.requestRide = function() {			
			$('#changeDestination').modal('show');			
		}
	$('#changeDestination').on("shown.bs.modal", function() {
		      var autocomplete = new google.maps.places.Autocomplete((document.getElementById('destinationAddress')));
		      //autocomplete.bindTo('bounds', $scope.map);
		       autocomplete.addListener('place_changed', function() {			    
			    var place = autocomplete.getPlace();
			    if (!place.geometry) {
			    	$('#changeDestination').modal('show');
			      	alert("Address entered is not valid, please enter again");
			    } else {			    				    	
			    	$scope.correctDestinationAddress = place;
			    }
			});
    	});	

	$scope.addDestination = function() {
		if(!$scope.destinationAddress||$scope.destinationAddress=='') {
			alert("No destination provided");
		} else {
			var address= ($scope.correctDestinationAddress!=null)?$scope.correctDestinationAddress.formatted_address.toString():$scope.destinationAddress.toString();
			$scope.geocoder.geocode( { 'address': address},  function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
			    var newDestination = {
			    	lat:results[0].geometry.location.lat(),
			    	lng:results[0].geometry.location.lng()
			    };
			    if(address==$scope.rideData.end_location) {
			    	$('#changeDestination').modal('hide');				        
			    } else {
			    	var directionsService = new google.maps.DirectionsService();
					var request = {
				       origin: $scope.rideData.start_location, 
				       destination: newDestination,
				       travelMode: google.maps.DirectionsTravelMode.DRIVING
				     };						     
			     	directionsService.route(request, function(response, status) {
			       if (status == google.maps.DirectionsStatus.OK) {
			       		var data = {};
			       		data.rideId = $scope.rideData.id;
			       		data.end_location = address;
			       		data.end_location_lat = newDestination.lat;
			       		data.end_location_lng = newDestination.lng;
			       		$http({
				   			method : "PUT",
							url : '/changeDestination',
							data : data,
							responseType: "json",
							headers: {'Content-Type': 'application/json'}	
				   		}).success(function(data){
				   			console.log("Success in changeDestination");
				   			if(data.success==1) {
				   				$scope.end_location = address;
				   				$scope.rideData.end_location_lat =newDestination.lat;
				   				$scope.rideData.end_location_lng =newDestination.lng;
				   				$('#changeDestination').modal('hide');
				   				//$window.location.href='/userHomepage';
				   			} else {
				   				alert("Error in Cancelling ride, please try again. Error: "+ data.error);
				   			}  			
				   		}).error(function(err){
				   			alert("Error in selectDriver");
				   		});			       						        
			       } else {
			       		flag = false;
			       		alert("No route found to destination address");
			       }					       
			     });
			    }
			 } else {		    		
	    		$('#changeDestination').modal('show');			
	    		alert("Invalid destination address, please enter again");
	    	}
			});    			     					     			    
		} 		
	};

	$interval(function(){
		$http.get('/checkRideStatus?rideId='+$scope.rideData.id).success(function(data) {
        	if(data.success == 1)
			{	
				if(data.status=='REQ') {
					console.log("No change in ride status");							
				} else {
					$window.location.href='/rideRequested';
				}
			}
			else
			{
				console.log(data.error);
			}					
		});
		console.log("Upadted!!");
	},10000);

});