services.factory('registerService', function ($http) {

    var service = {};

    /**
     *    Sends post request to register new user, handles response
     *
     */
    service.registerNewUser = function (data, onSuccess, onFailure) {

            $http.post('/register', data)
                .success(onSuccess)
                .error(onFailure);
        };


        return service;

    }
    )
    ;