services.factory('loginService', function ($http) {

    var service = {};

    service.logIn = function (data, onSuccess, onFailure) {

        $http.post('/login', data)
            .success(onSuccess)
            .error(onFailure);
    };

    service.logOut = function (){
        // to be implemented
    }

    return service;
});