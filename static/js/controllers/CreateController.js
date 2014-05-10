controllers.controller('CreateController', function ($scope, $rootScope, $location, $modal,$log,modalService, pollService, datepickerService) {

    messages = {
        "pollCreationMessageSuccess" : "Successfully created new poll!",
        "pollCreationMessageError" : "Error creating new poll!"
    }

    $scope.timezones = pollService.timezones;
    var gatherPollInfo = pollService.gatherPollInfo($scope);

    var confirmed = function() {

        var data = gatherPollInfo($scope);
        pollService.createPoll(data,function() {
            $scope.pollCreationSuccess = true;
            $scope.pollCreationError = false;
            $scope.pollCreationMessage = messages["pollCreationMessageSuccess"];
        },
        function() {
            $scope.pollCreationError = true;
            $scope.pollCreationSuccess = false;
            $scope.pollCreationMessage = messages["pollCreationMessageError"];
        });
    }

  	$scope.submit = function () {
    	modalService.confirmPollCreate($scope.pollName, $scope.pollDesc, confirmed);
  	};


  	$scope.today = datepickerService.today($scope);

 	$scope.today();

 	$scope.startTime = $scope.dt;
 	$scope.endTime = $scope.dt;
 	$scope.declEndTime = $scope.dt;
  	// Disable weekend selection

  	$scope.disabled = datepickerService.disabled;
  	$scope.toggleMin = datepickerService.toggleMin($scope);

  	$scope.toggleMin();

  	$scope.open = datepickerService.open($scope);
    $scope.dateOptions = datepickerService.dateOptions;
    $scope.initDate = datepickerService.initDate;
    $scope.formats = datepickerService.formats;
    $scope.format = datepickerService.format;

    $scope.groups = {};

    $scope.addNewGroup = function() {
        $scope.groups[$scope.newGroup] = true;
    };

    $scope.showGroupLabel = function (group) {
        return $scope.groups.length === 1;
    };

    $scope.deleteGroup = function(group) {
        delete $scope.groups[group]; 
    };

});