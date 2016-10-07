var addFlatCtrl = angular.module('addFlatCtrl',['geolocation','geoService']);
addFlatCtrl.controller('addFlatCtrl', function($scope, $http, geolocation, geoService, $rootScope){

	$scope.formData = {};
	var coordinate = {};
	var latitude =0;
	var longitude =0;

	//setting initial cooridnates
	$scope.formData.latitude = 30.500;
	$scope.formData.longitude = -90.500;

	// Getting coordinates when click event is detected
		$rootScope.$on("clicked", function(){

	    // Run the geoService functions associated with new coordinates
	    $scope.$apply(function(){
	        $scope.formData.latitude = parseFloat(geoService.clickLat).toFixed(3);
	        $scope.formData.longitude = parseFloat(geoService.clickLong).toFixed(3);
	    });
	});


	//Create Flat with the form data from the user
	$scope.createFlat = function(){
		//Getting user filled form data
		var flatData = {
			username: $scope.formData.username,
			address: $scope.formData.address,
			email: $scope.formData.email,
			location: [$scope.formData.longitude, $scope.formData.latitude]
		};

		//saving into db
		$http.post('/flats', flatData)
			.success(function(data){

				//clearing the form after saving successfully
				$scope.formData.username = "";
				$scope.formData.address = "";
				$scope.formData.location = "";
				$scope.formData.email = "";

				// Refresh the map with new data
                geoService.refresh($scope.formData.latitude, $scope.formData.longitude);
			})
			.error(function(data){
				console.log('Error'+data);
			});
	};
});