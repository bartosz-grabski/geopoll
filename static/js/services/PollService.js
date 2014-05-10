services.factory('pollService', function ($http,$location,$window) {

    var service = {};
    
    /**
    *	Sends post request to create a new poll, handles response
    *
    */
    service.createPoll = function(data,onSuccess, onFailure) {

    	$http.post('/create',data)
    	.success(onSuccess)
    	.error(onFailure);
    }

    service.getPollInfo = function(pollId,onSuccess,onFailure) {
    	$http.get('/poll/'+pollId)
    	.success(onSuccess)
    	.error(onFailure);
    }

    service.updatePoll = function(pollId,data,onSuccess,onFailure) {
    	$http.put(/poll/+pollId,data)
    	.success(onSuccess)
    	.error(onFailure);
    }

    service.gatherPollInfo = function($scope) {

    	return function () {

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
    };

    service.timezones = [ 
        {string : '+05:00'},
        {string : '+06:00'}
    ]
    
    return service;
});