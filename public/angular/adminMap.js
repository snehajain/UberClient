function selectDriver(id) {
	console.log("In jQuery selectDriver");
	angular.element('#userHomepageCtrlId').scope().selectDriver(id);	
	//$('#iw-container').hide();
}
var myApp = angular.module('userHomepageApp', [ 'ngMap' ]);

	myApp.controller('userHomepageCtrl', function($scope, $compile, $http, $window) {
		$scope.isHomepage=true;

		//Common variables needed
		
	});