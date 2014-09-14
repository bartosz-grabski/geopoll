services.factory('userPollsService', function ($http) {

    var service = {};

    service.getUserPolls = function(onSuccess,onFailure) {
        $http.get('/polls')
            .success(onSuccess)
            .error(onFailure);
    };

    return service;
});