controllers.controller('PollController', function ($scope, $rootScope, $location, $window, pollService, modalService, $routeParams, timelineService, $timeout, $route) {


	
    var messages = {
        "updateError": "There were problems updating your poll!",
        "updateSuccess": "Poll successfully updated!",
        "pollNotFound" : "No poll with provided id!",
        "declarationClosed" : "Declaration phase is closed now. Vote on selected terms",
        "declarationClosedEditable" : "Declaration phase is closed now. Please choose terms to vote on"
    };

    $scope.messages = messages;

    $scope.addPhase = false;
    $scope.userPolls = [];
    $scope.eventDisabled = false;
    $scope.declarationClosedMessage = messages.declarationClosed;

    $scope.edit = function () {

        var onConfirm = function (data) {

            console.log(data);

            console.log($routeParams.id);
            pollService.updatePoll($routeParams.id, data, function () {
                    $scope.poll = data;
                    $scope.pollSuccess = true;
                    $scope.pollError = false;
                    $scope.currentMessage = messages.updateSuccess;
                },
                function () {
                    $scope.pollError = true;
                    $scope.pollSuccess = false;
                    $scope.currentMessage = messages.updateError;
                });
        };

        modalService.updatePollModal(pollService.networkToGui($scope.poll), onConfirm);
    };

    $scope.voteOnTerm = function(termId) {

        var onSuccess = function(data) {
            console.log("[INFO] Succesfully voted on a term");
        };

        var onError = function(err) {
            console.log("[ERROR] There was an error during voting on a term :"+ err);
        };

        pollService.voteOnTerm($scope.poll._id, termId, onSuccess, onError);
    };

    $scope.deleteTerm = function(termId) {

        var onSuccess = function(data) {
            console.log("[INFO] Succesfully deleted a term");
            timelineService.deleteTermAndReload(termId);
        };

        var onError = function(err) {
            console.log("[ERROR] There was an error during deleting a term :"+ err);
        };

        pollService.deleteTerm($scope.poll._id, termId, onSuccess, onError);

    };

    $scope.finishDeclaration = function() {

        var onSuccess = function(data) {
            console.log("[INFO] Successfully finished poll's declaration phase");
            $route.reload();
        };

        var onFailure = function() {
            console.log("[ERROR] Failed to finish poll's declaration phase");
        };

        pollService.finishDeclarationPhase($routeParams.id, onSuccess, onFailure);
    };

    $scope.finishVoting = function() {

        var onSuccess = function(data) {
            console.log("[INFO] Successfully finished poll's declaration phase");
            $route.reload();
        };

        var onFailure = function() {
            console.log("[ERROR] Failed to finish poll's declaration phase");
        };

        pollService.finishVotingPhase($routeParams.id, onSuccess, onFailure);
    };


    function getUserPolls() {

        var onSuccess = function(userPolls) {
            timelineService.loadEvents(userPolls);
        };

        var onFailure = function() {

        };

        pollService.getUserPolls($routeParams.id,onSuccess,onFailure);

    };


    function getPollInfo() {

        var onSuccess = function (data) {

            if (data.is_closed) {
                $scope.pollError = true;
                $scope.currentMessage = "Poll has been closed!";
                return;
            }

            $scope.poll = data;
            $scope.canEdit = data.can_edit;
            $scope.chosenTerms = data.chosenTerms; //array of objects
            if (data.can_edit && data.isDeclarationClosed) {
                $scope.declarationClosedMessage = messages.declarationClosedEditable;
                $scope.eventDisabled = true;
                $timeout(function() { //interesting, otherwise it doesn't work, perhaps updating UI ($scope =, causes timeline loading to be blocked)
                    timelineService.loadTerms(data.selected_terms);
                    timelineService.enableTimeline("asd",[]);
                    timelineService.setPoll(data,data._id);
                }, 0, false);

            } else if (data.isDeclarationClosed) {
                $scope.eventDisabled = true;
                $timeout(function() {
                    timelineService.loadTerms(data.selected_terms);
                }, 0, false);
            } else {
                getUserPolls();
            }

        };

        var onError = function () {

        	$scope.pollError = true;
        	$scope.pollSuccess = false;
        	$scope.currentMessage = messages.pollNotFound;

        };


        pollService.getPollInfo($routeParams.id, onSuccess, onError);

    }

    // new entry, save entry functions

    function newUserPoll() {
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

    function saveUserPoll() {

    	console.log("[INFO] Save user poll was clicked!");
    	$scope.addPhase = false;
    	var events = timelineService.getEventsAndDisableTimeline();
    	var userPoll = createUserPollFromEvents(events);

    	var onSuccess = function() {
    		console.log("[INFO] UserPoll was created!");
    	};

    	var onCancel = function(err,status) {
    		console.log("[INFO] UserPoll failed to create");
            if (status === 400) {
                $scope.currentMessage = messages.declarationClosed;
                $scope.pollError = true;
                $scope.pollSuccess = false;
            }
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

    };

    $scope.newEvent = newUserPoll;  // when declaration is closed then it's swapped for newTerm, saveTerm
    $scope.saveEvent = saveUserPoll;
    timelineService.load("tl");
    timelineService.setScope($scope);

    getPollInfo();
    


});