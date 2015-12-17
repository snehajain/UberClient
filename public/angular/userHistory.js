/**
 * New node file
 */
var facebook = angular.module('uber',  ['ngMap' ]);
// defining the login controller
facebook.controller('userHistoryController', function($scope, $http, $timeout, $window)
{
	$scope.rideSelected= {};
	$scope.isHomePage = false;
	$scope.isProfile = false;
	$scope.isHistory = true;

	$http.get('/getUserBillList').success(function(data)
	{

		$scope.billList = data.value;
		$scope.$apply();

	});

	$scope.viewBill = function(bill)
	{	
		$scope.rideSelected = bill;		
		//window.location.assign("/viewUserBill");
	};

	$('#addLifeEventModal').on("shown.bs.modal", function() {
		    var directionsService = new google.maps.DirectionsService;
           var directionsDisplay = new google.maps.DirectionsRenderer;
           var map = new google.maps.Map(document.getElementById('map'), {
             zoom: 14,
             center: {lat: $scope.rideSelected.start_location_lat , lng: $scope.rideSelected.start_location_lng }
           });
           directionsDisplay.setMap(map);
         
           
             //calculateAndDisplayRoute(directionsService, directionsDisplay);
            directionsService.route({
             origin: new google.maps.LatLng($scope.rideSelected.start_location_lat ,$scope.rideSelected.start_location_lng),
             destination:new google.maps.LatLng($scope.rideSelected.end_location_lat ,$scope.rideSelected.end_location_lng),
             travelMode: google.maps.TravelMode.DRIVING
           }, function(response, status) {
             if (status === google.maps.DirectionsStatus.OK) {
               directionsDisplay.setDirections(response);
             } else {
               window.alert('Directions request failed due to ' + status);
             }
           });
           
           //document.getElementById('start').addEventListener('change', onChangeHandler);
           //document.getElementById('end').addEventListener('change', onChangeHandler);
    	});

	// function initMap() {
 //           var directionsService = new google.maps.DirectionsService;
 //           var directionsDisplay = new google.maps.DirectionsRenderer;
 //           var map = new google.maps.Map(document.getElementById('map'), {
 //             zoom: 14,
 //             center: {lat: 37.3382 , lng: -121.8863 }
 //           });
 //           directionsDisplay.setMap(map);
         
           
 //             calculateAndDisplayRoute(directionsService, directionsDisplay);
           
 //           document.getElementById('start').addEventListener('change', onChangeHandler);
 //           document.getElementById('end').addEventListener('change', onChangeHandler);
 //         }
         
 //         function calculateAndDisplayRoute(directionsService, directionsDisplay) {
 //           directionsService.route({
 //             origin: new google.maps.LatLng(37.3562569, -121.8948289),
 //             destination:new google.maps.LatLng(37.3351916, -121.8832602),
 //             travelMode: google.maps.TravelMode.DRIVING
 //           }, function(response, status) {
 //             if (status === google.maps.DirectionsStatus.OK) {
 //               directionsDisplay.setDirections(response);
 //             } else {
 //               window.alert('Directions request failed due to ' + status);
 //             }
 //           });
 //         }

})