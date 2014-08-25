services.factory('registerService', function(){

    var service = {};

    /**
     *	Sends post request to create a new poll, handles response
     *
     */
    service.registerNewUser = function(data,onSuccess, onFailure) {

        $http.post('/register',data)
            .success(onSuccess)
            .error(onFailure);
    };


    return service;

});