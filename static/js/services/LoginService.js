services.factory('loginService', function ($http) {

    var service = {};

    service.logIn = function (data, onSuccess, onFailure) {

        $http.post('/login', data)
            .success(onSuccess)
            .error(onFailure);
    };

    service.logOut = function (onSuccess, onFailure) {
        $http.get('/logout').success(onSuccess).error(onFailure);
    }

    return service;
});