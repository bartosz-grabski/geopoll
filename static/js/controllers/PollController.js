controllers.controller('PollController', function ($scope, $rootScope, $location, pollService) {

	$scope.messages = {
		"pollUpdateError" : "There were problems updating your poll!",
		"pollUpdateSuccess" : "Poll successfully updated!"
	}

	$scope.poll = {};

	$scope.edit = function() {
		console.log('edit clicked');
	}

	$scope.getPollInfo = function() {

		var onSuccess = function(data) {
			$scope.poll = data;
			$scope.pollUpdateSuccess = true;
			$scope.pollUpdateError = false;
		}

		var onError = function() {
			$scope.pollUpdateError = true;
			$scope.pollUpdateSuccess = false;
		}


		pollService.getPollInfo($routeParams.id,onSuccess,onError);

	}


});