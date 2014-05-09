controllers.controller('CreateController', function ($scope, $rootScope, $location, $modal,$log,modalService, pollService) {

    messages = {
        "pollCreationMessageSuccess" : "Successfully created new poll!",
        "pollCreationMessageError" : "Error creating new poll!"
    }

    $scope.timezones = [ 
        {string : '+05:00'},
        {string : '+06:00'}
    ]

    var gatherPollInfo = function () {
        
        var data = {};
        data.name = $scope.pollName;
        data.description = $scope.pollDesc;
        data.creator_name = $scope.creatorName;
        data.creator_mail = $scope.creatorMail;
        data.timezone = $scope.timezone;

        data.required_groups = [];
        for (group in $scope.groups) {
        	data.required_groups.push(group);
        }     

        var startDate = $scope.startDate;
        var endDate = $scope.endDate;
        var declEndDate = $scope.declEndDate;
        var startTime = $scope.startTime;
        var endTime = $scope.endTime;
        var declEndTime = $scope.declEndTime;
       
        startDate.setHours(startTime.getHours());
        startDate.setMinutes(startTime.getMinutes());

        endDate.setHours(endTime.getHours());
        endDate.setMinutes(endTime.getMinutes());

        declEndDate.setHours(declEndTime.getHours());
        declEndDate.setMinutes(declEndTime.getMinutes());

        data.start_time = startDate;
        data.end_time = endDate;
        data.declaration_end_time = declEndDate;

        return data;
    }


    var confirmed = function() {

        var data = gatherPollInfo();
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


  $scope.today = function() {
     $scope.dt = new Date();
 };
 $scope.today();
 $scope.startTime = $scope.dt;
 $scope.endTime = $scope.dt;
 $scope.declEndTime = $scope.dt;
  	// Disable weekend selection
  	$scope.disabled = function(date, mode) {
  		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  	};

  	$scope.toggleMin = function() {
  		$scope.minDate = $scope.minDate ? null : new Date();
  	};
  	$scope.toggleMin();

  	$scope.open = function($event,type) {
          $event.preventDefault();
          $event.stopPropagation();
          if (type === 'end') {
            $scope.endOpened = true;
        } else if (type === 'decl') {
            $scope.declEndOpened = true;
        } else {
            $scope.startOpened = true;
        }
    };

    $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    $scope.initDate = new Date('2016-15-20');
    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[0];

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