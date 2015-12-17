function selectDriver(id) {
	console.log("In jQuery selectDriver");
	angular.element('#userHomepageCtrlId').scope().selectDriver(id);	
	//$('#iw-container').hide();
}
var myApp = angular.module('userHomepageApp', [ 'ngMap' ]);

	myApp.controller('userHomepageCtrl', function($scope, $compile, $http, $window) {
		$scope.isHomepage=true;

		//Common variables needed
		$scope.geocoder = new google.maps.Geocoder();
		$scope.correctDestinationAddress = null;
		
		$scope.requestRide = function() {			
			$('#addLifeEventModal').modal('show');			
		}
		
		$scope.resetRide = function() {
			console.log("Resetting ride");
			$scope.rideRequested = false;
    		$scope.map.markers['reqRideMarker'].setMap($scope.map);
    		$scope.carCoordinates = $scope.driverData; 
    		$scope.destinationAddress='';
    		$scope.correctDestinationAddress = null;
			$scope.driverDisplayData = {};				

		};

		$('#addLifeEventModal').on("shown.bs.modal", function() {
		      var autocomplete = new google.maps.places.Autocomplete((document.getElementById('destinationAddress')));
		      //autocomplete.bindTo('bounds', $scope.map);
		       autocomplete.addListener('place_changed', function() {			    
			    var place = autocomplete.getPlace();
			    if (!place.geometry) {
			    	$('#addLifeEventModal').modal('show');
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
    			var flag=true;
			    var directionsService = new google.maps.DirectionsService();
					var request = {
				       origin: $scope.currentPosition, 
				       destination: ($scope.correctDestinationAddress!=null)?$scope.correctDestinationAddress.formatted_address.toString():$scope.destinationAddress.toString(),
				       travelMode: google.maps.DirectionsTravelMode.DRIVING
				     };						     
			     directionsService.route(request, function(response, status) {
			       if (status == google.maps.DirectionsStatus.OK) {
			       		$('#addLifeEventModal').modal('hide');				        
			       } else {
			       		flag = false;
			       		alert("No route found to destination address");
			       }					       
			     });
			     if(flag) {
				       	$scope.driverDisplayData = $scope.driverData;
	    				$scope.carCoordinates={};
	    				$scope.rideRequested = true;
	    				$scope.map.markers['reqRideMarker'].setMap(null);
			     }					     			    	
    		} 		
    	};

		$scope.getDrivers = function() {
			
			if (navigator.geolocation) {
			    navigator.geolocation.getCurrentPosition(function(position) {
			        $scope.currentPosition = {
			            lat: position.coords.latitude,
			            lng: position.coords.longitude
			        };			        
			        $http.get('/getNearbyDrivers?lat='+$scope.currentPosition.lat+ '&lng='+$scope.currentPosition.lng).success(function(data) {
			        	if(data.success == 1)
							{
							    console.log("Success in getNearbyDrivers!!\n");
								$scope.carCoordinates = data.driversData; 
								$scope.driverData = data.driversData;
								console.log(JSON.stringify(data.driversData));		
							}
							else
							{
								console.log("Error");
								$window.location.href='/';
							}					
					}); 
			    }, function() {
			        alert("Browser doesn't support Geolocation-Some error");
			    });
			} else {
			    // Browser doesn't support Geolocation
				alert("Browser doesn't support Geolocation");
			}
		};
		var infowindow = new google.maps.InfoWindow({
		    content: "  Selected",
		    maxWidth: 500
		  });
		$scope.showDriverData = function(driver) {			
			var infoContent = '<div id="iw-container">' +
			  '<div class="" >' +
			      
			         '<div class="iw-content">' + 
			         	'<img src="http:/images/picture.png" height="115" width="83">' +
				         '<div class="iw-subTitle">' +
			            	'<p>Driver name: ' + this.name.firstname+' '+this.name.lastname+'</p>' +
				        '</div>' +
				         '<div class="iw-subTitle">' +
			            	'<p>Gender: ' + this.name.gender+'</p>' +
				        '</div>' +
				        '<div class="iw-subTitle">' +
			            	'<p>Car Model: '+ this.name.carmodel+'</p>' +
				        '</div>' +	
				        '<div class="iw-subTitle">' +
			            	'<p>Phone Number: '+ this.name.phone+'</p>' +
				        '</div>' +
				        '<div class="iw-subTitle">' +
			            	'<p>Driver Rating: '+ this.name.rating+'</p>' +
			            	// '<span class="stars">'+this.name.rating+'</span>'+
				        '</div>' +
				        '<div class="iw-subTitle">' +
			            	'<p>Description: Something to describe</p>' +
				        '</div>' +	
				        '<div class="iw-subTitle">' +
				        '<iframe width="400" height="300" src="'+this.name.video+'" frameborder="0" allowfullscreen></iframe>'+			     
				        '</div>' +					        
				        '<div class="iw-subTitle">' +
				        '<button id="selectDriverButton" type="submit" class="btn btn-xs btn-default pull-right" style="background-color:#3B5998; border: 1; color:white; margin-right:10px" onclick="selectDriver('+this.name.id+')">Select Driver</button>' +
				        '</div>' +
			        '</div>' +
			      '<div class="iw-bottom-gradient">' +
			      '</div>' +
			      
			  '</div>' +
			'</div>';
			infowindow.setContent(infoContent);
			
				google.maps.event.addListener(infowindow, 'domready', function() {
			    // Reference to the DIV that wraps the bottom of infowindow
			    var iwOuter = $('.gm-style-iw');
			    var iwBackground = iwOuter.prev();
			    iwBackground.children(':nth-child(2)').css({'display' : 'none'});
				iwBackground.children(':nth-child(4)').css({'display' : 'none'});
			    //iwOuter.parent().parent().css({left: '115px'});
			    // iwBackground.children(':nth-child(1)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
			    // iwBackground.children(':nth-child(3)').attr('style', function(i,s){ return s + 'left: 76px !important;'});
			    iwBackground.children(':nth-child(3)').find('div').children().css({'box-shadow': 'rgba(72, 181, 233, 0.6) 0px 1px 6px', 'z-index' : '1'});
			    var iwCloseBtn = iwOuter.next();
			    iwCloseBtn.css({opacity: '1', right: '30px', top: '9px', 'box-shadow': '0 0 5px #3990B9'});
			    if($('.iw-content').height() < 140){
			      $('.iw-bottom-gradient').css({display: 'none'});
			    }
			    iwCloseBtn.mouseout(function(){
			      $(this).css({opacity: '1'});
			    });			    
			  });
			
			infowindow.open($scope.map, this);
		};

		$scope.selectDriver = function(id) {
			console.log("In scope selectDriver "+id);
			var address= ($scope.correctDestinationAddress!=null)?$scope.correctDestinationAddress.formatted_address.toString():$scope.destinationAddress.toString();
			$scope.geocoder.geocode( { 'address': address},  function(results, status) {
			  if (status == google.maps.GeocoderStatus.OK) {
				    var destination1 = {
				    	lat:results[0].geometry.location.lat(),
				    	lng:results[0].geometry.location.lng()
				    };
				    var directionsService = new google.maps.DirectionsService();
 					var request = {
					       origin: $scope.currentPosition, 
					       destination: destination1,
					       travelMode: google.maps.DirectionsTravelMode.DRIVING
					     };						     
				     directionsService.route(request, function(response, status) {
				       if (status == google.maps.DirectionsStatus.OK) {
				       		var data = {};				       		
				       		data.sourceCoordinates= $scope.currentPosition;
				       		data.destinationCoordinates = destination1;
				       		data.driverId = id;				       		
				       		var latlng = new google.maps.LatLng(destination1.lat, destination1.lng);
						    $scope.geocoder.geocode({'latLng': latlng}, function(results, status) {
						      if (status == google.maps.GeocoderStatus.OK) {			      
						        if (results[1]) {			        
						        	data.destinationAddress = results[0].formatted_address;

						        	var latlng2 = new google.maps.LatLng(data.sourceCoordinates.lat, data.sourceCoordinates.lng);
								    $scope.geocoder.geocode({'latLng': latlng2}, function(results2, status2) {
								      if (status2 == google.maps.GeocoderStatus.OK) {			      
								        if (results2[1]) {			        
								        data.sourceAddress= (results2[0].formatted_address);
								        console.log(JSON.stringify(data));
							       		$http({
							       			method : "POST",
											url : '/selectDriver',
											data : data,
											responseType: "json",
											headers: {'Content-Type': 'application/json'}	
							       		}).success(function(data){
							       			console.log("Success in selectDriver: rideId"+ JSON.stringify(data));
							       			var driverSelected={};
							       			for(x in $scope.driverData) {
							       				if($scope.driverData[x].id==id) {
							       					driverSelected=$scope.driverData[x];
							       					break;
							       				}
							       			}
							       			alert("Your driver is on his way, please look for a "+driverSelected.carmodel);				       			
							       			//Redirect to booked a ride/waiting for a ride
							       			$window.location.href='/rideRequested';
							       		}).error(function(err){
							       			console.log("Error in selectDriver");
							       		});
								        } else {
								          alert("Source not found");
								        }
								      } else {
								        alert("Geocoder failed due to: " + status);
								      }
								    });
						        } else {
						          alert("Destination not found");
						        }
						      } else {
						        alert("Geocoder failed due to: " + status);
						      }
						    });
				       } else {				       		
				       		$('#addLifeEventModal').modal('show');
				       		alert("No route found");
				       }					       
				     });					     
		    	} else {		    		
		    		$('#addLifeEventModal').modal('show');			
		    		alert("Invalid destination address, please enter again");
		    	}
			});
		}
		// $('#addLifeEventModal').on('hide.bs.modal', function () {
		//   console.log("In hide modal");
		//   if($scope.correctDestinationAddress) {
		//   	$scope.destinationAddress = $scope.destiAddressDisplayText;			    	
		//   }		
		//  });

		$scope.getAddress=function(lat, lng) {
				console.log("In getAddress");
				var d = $q.defer();
				var latlng = new google.maps.LatLng(lat, lng);
			    $scope.geocoder.geocode({'latLng': latlng}, function(results, status) {
			      if (status == google.maps.GeocoderStatus.OK) {			      
			        if (results[1]) {			        
			        d.resolve(results[0].formatted_address);

			        } else {
			          alert("No results found");
			        }
			      } else {
			        alert("Geocoder failed due to: " + status);
			      }
			    });
			    return d.promise;
		}

		$scope.getDrivers();
	});