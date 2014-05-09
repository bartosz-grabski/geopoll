services.factory('pollService', function ($http,$location,$window) {

    var service = {};
    
    /**
    *	Sends post request to create a new poll, handles response
    *
    */
    service.createPoll = function(data,onSuccess, onFailure) {

    	$http.post('/create',data)
    	.success(onSuccess)
    	.error(onFailure)
    }
    
    return service;
});