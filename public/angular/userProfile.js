/**
 * New node file
 */
var facebook = angular.module('uber', []);
// defining the login controller
facebook.controller('userProfileController', function($scope, $http, $timeout) {
	
	$scope.isHomePage = false;
	$scope.isProfile = true;
	$scope.isHistory = false;
	
	$http.get('/getUserProfile').success(function(data) {

		 $scope.firstname=data.about.firstname;
		 $scope.lastname=data.about.lastname;
		 $scope.address=data.about.address;
		 $scope.city=data.about.city;
		 $scope.state=data.about.state;
		 $scope.zipcode=data.about.zipcode;
		 $scope.phone=data.about.phone;
		 $scope.cardNumber=data.about.cardnumber;
		 $scope.cardCvv=data.about.cardcvv;
		 $scope.cardExpirationDate=data.about.cardexpirationdate;
		 console.log("firstname:"+$scope.firstname);
		 //$scope.$apply();
	});

	$scope.updateUserProfile = function() {
		console.log("In update");
		$http({
			method : "POST",
			url : '/updateUserProfile',
			data : {
				"firstName" : $scope.firstname,
				"lastName" : $scope.lastname,
				"address" : $scope.address,
				"city" : $scope.city,
				"state" : $scope.state,
				"zipcode" : $scope.zipcode,
				"phone" : $scope.phone,
				"cardNumber" : $scope.cardNumber,
				"cardCvv" : $scope.cardCvv,
				"cardExpirationDate" : $scope.cardExpirationDate,
			}
		}).success(function(data) {

			if (data.success == 1) {
				alert("Profile update successfully");
			} else {
				alert("Error found:" + data.error);
			}

		}).error(function(error) {
			alert("There was an error. Please try again.");
		});
	};
})