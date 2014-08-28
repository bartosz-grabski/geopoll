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
        when('/register', {
                templateUrl: '/views/register',
                controller: 'RegisterController'
            }).
        when('/login', {
                templateUrl: '/views/login',
                controller: 'LoginController'
            }).
        otherwise({
            redirectTo: '/home',
            templateUrl: '/views/home'
        });

    }]);