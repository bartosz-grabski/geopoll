var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'geopoll.controllers', 'geopoll.services']);


app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/poll', {
            templateUrl: 'poll',
            controller: 'PollController'
        }).
        otherwise({
            redirectTo: '/'
        });

    }]);