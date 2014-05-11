controllers.controller('PollController', function ($scope, $rootScope, $location, pollService, modalService,$routeParams) {

	$scope.messages = {
		"pollUpdateError" : "There were problems updating your poll!",
		"pollUpdateSuccess" : "Poll successfully updated!"
	}

	$scope.poll = {};

	$scope.edit = function() {

		var onConfirm = function(data) {

			console.log(data);

            console.log($routeParams.id);
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

		modalService.updatePollModal(pollService.networkToGui($scope.poll),onConfirm);
	}

	$scope.getPollInfo = function() {

		var onSuccess = function(data) {

			groups = {};
			for (i in data.required_groups) {
				groups[data.required_groups[i]] = true;
			}
			$scope.poll = data;
			$scope.poll.required_groups = groups;
			$scope.canEdit = data.can_edit;
		};

		var onError = function() {
			
		};


		pollService.getPollInfo($routeParams.id,onSuccess,onError);

	}

	$scope.getPollInfo();


});