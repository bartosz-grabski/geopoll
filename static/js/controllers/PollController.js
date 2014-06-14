controllers.controller('PollController', function ($scope, $rootScope, $location, $window, pollService, modalService, $routeParams, timelineService) {


	$scope.addPhase = false;
    $scope.messages = {
        "pollUpdateError": "There were problems updating your poll!",
        "pollUpdateSuccess": "Poll successfully updated!"
    }

    $scope.poll = {};
    $scope.userPolls = [];

    $scope.edit = function () {

        var onConfirm = function (data) {

            console.log(data);

            console.log($routeParams.id);
            pollService.updatePoll($routeParams.id, data, function () {
                    $scope.poll = data;
                    $scope.pollUpdateSuccess = true;
                    $scope.pollUpdateError = false;
                },
                function () {
                    $scope.pollUpdateError = true;
                    $scope.pollUpdateSuccess = false;
                });
        };

        modalService.updatePollModal(pollService.networkToGui($scope.poll), onConfirm);
    }

    function getPollInfo() {

        var onSuccess = function (data) {

            groups = {};
            for (i in data.required_groups) {
                groups[data.required_groups[i]] = true;
            }
            $scope.poll = data;
            $scope.poll.required_groups = groups;
            $scope.canEdit = data.can_edit;
        };

        var onError = function () {

        };


        pollService.getPollInfo($routeParams.id, onSuccess, onError);

    }

    // new entry, save entry functions

    $scope.newUserPoll = function() {
    	modalService.newUserPollModal(function(username) {
    		$scope.username = username;
    		$scope.addPhase = true;
    		console.log("[INFO] The newUserPoll modal was confirmed")
    	}, function() {
    		console.log("[INFO] The newUserPoll modal was dismissed")
    	});
    }

    $scope.saveUserPoll = function() {

    	console.log("[INFO] Save user poll was clicked!");
    	$scope.addPhase = false;
    	delete $scope.username;

    }


    function getUserPolls() {

    	var onSuccess = function(userPolls) {
    		timelineService.loadEvents(userPolls);
    	}

    	var onFailure = function() {

    	}

    	pollService.getUserPolls($routeParams.id,onSuccess,onFailure);

    }

    timelineService.load();
    getPollInfo();
	getUserPolls();    


});