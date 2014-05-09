var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'geopoll.controllers', 'geopoll.services']);


app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/create', {
            templateUrl: '/views/create',
            controller: 'CreateController'
        }).
        when('/poll/:id', {
        	templateUrl: '/views/poll',
        	controller: 'PollController'
        }).
        otherwise({
            redirectTo: '/home',
            templateUrl: '/views/home'
        });

    }]);