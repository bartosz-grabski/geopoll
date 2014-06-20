controllers.controller('PollController', function ($scope, $rootScope, $location, $window, pollService, modalService, $routeParams, timelineService) {


	$scope.addPhase = false;
    $scope.messages = {
        "pollUpdateError": "There were problems updating your poll!",
        "pollUpdateSuccess": "Poll successfully updated!"
    };

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
    };

    function getPollInfo() {

        var onSuccess = function (data) {

            $scope.poll = data;
            $scope.canEdit = data.can_edit;
        };

        var onError = function () {

        };


        pollService.getPollInfo($routeParams.id, onSuccess, onError);

    }

    // new entry, save entry functions

    $scope.newUserPoll = function() {
    	modalService.newUserPollModal(function(result) {
    		var username = result.username;
    		var groups = result.groups;
    		$scope.username = result.username;
    		$scope.groups = result.groups;
    		$scope.addPhase = true;
    		console.log("[INFO] The newUserPoll modal was confirmed");
    		timelineService.enableTimeline(username);
    	}, function() {
    		console.log("[INFO] The newUserPoll modal was dismissed");
    	}, $scope.poll.required_groups);
    };

    $scope.saveUserPoll = function() {

    	console.log("[INFO] Save user poll was clicked!");
    	$scope.addPhase = false;
    	var events = timelineService.getEventsAndDisableTimeline();
    	var userPoll = createUserPollFromEvents(events);

    	var onSuccess = function() {
    		console.log("[INFO] UserPoll was created!");
    	};

    	var onCancel = function() {
    		console.log("[INFO] UserPoll failed to create");
    	};

    	pollService.newUserPoll(userPoll, onSuccess, onCancel);
    	delete $scope.username;
    	delete $scope.groups;

    };

    function createUserPollFromEvents(events) {

    	var userPoll = {};
    	userPoll.user_name = $scope.username;
    	userPoll.poll_id = $routeParams.id;
    	userPoll.chosen_groups = $scope.groups;
    	userPoll.time_slots = events;
    	return userPoll;

    }


    function getUserPolls() {

    	var onSuccess = function(userPolls) {
    		timelineService.loadEvents(userPolls);
    	};

    	var onFailure = function() {

    	};

    	pollService.getUserPolls($routeParams.id,onSuccess,onFailure);

    }

    timelineService.load();
    getPollInfo();
	getUserPolls();    


});