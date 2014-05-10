controllers.controller('PollController', function ($scope, $rootScope, $location, pollService, modalService,$routeParams) {

	$scope.messages = {
		"pollUpdateError" : "There were problems updating your poll!",
		"pollUpdateSuccess" : "Poll successfully updated!"
	}

	$scope.poll = {};

	$scope.edit = function() {

		var onConfirm = function(data) {

			console.log(data);

			pollService.updatePoll($routeParams.id,data,function() {
				$scope.poll = data;
				$scope.pollUpdateSuccess = true;
				$scope.pollUpdateError = false;
			},
			function() {
				$scope.pollUpdateError = true;
				$scope.pollUpdateSuccess = false;
			});
		};

		modalService.updatePollModal($scope.poll,onConfirm);
	}

	$scope.getPollInfo = function() {

		var onSuccess = function(data) {
			$scope.poll = data;
			$scope.canEdit = true;
		};

		var onError = function() {
			
		};


		pollService.getPollInfo($routeParams.id,onSuccess,onError);

	}

	$scope.getPollInfo();


});