/**
 * New node file
 */
var facebook = angular.module('uber', []);
// defining the login controller
facebook.controller('driverController', function($scope, $http, $timeout) {
	
	$scope.counter = 0;
	$scope.isDoneOnce = false;
    $scope.onTimeout = function(){
//        $scope.counter++;
    	
    	$scope.getDriverStatus = $http.get('/getDriverStatus').success(function(data) {
    	
    		console.log(data.status);
    		
    		if(data.status == "AVA")
    		{
    			console.log("available");
    		}
    		else if(data.status == "REQ" && $scope.isDoneOnce == false)
    		{
    			alert("You've been requested. Starting ride now");
    			console.log("requested");
    			$scope.isDoneOnce = true;
    		}
    		else if(data.status == "STA")
    		{
    			console.log("started");
    			$scope.isDoneOnce = false;			
    		}
    		
    			 
    			 //$scope.$apply();
    	});
    	
        mytimeout = $timeout($scope.onTimeout,10000);
    }
    var mytimeout = $timeout($scope.onTimeout,10000);
    
    $scope.stop = function(){
        $timeout.cancel(mytimeout);
    }
})