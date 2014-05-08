services.factory('pollService', function ($http,$location,$window) {

    var service = {};
    
    /**
    *	Sends post request to create a new poll, handles response
    *
    */
    service.createPoll = function(data,onSuccess, onFailure) {

    	$http.post('/poll',data)
    	.success(onSuccess)
    	.failure(onFailure)
    }
    
    return service;
});