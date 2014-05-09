var app = angular.module('app', ['ui.bootstrap', 'ngRoute', 'geopoll.controllers', 'geopoll.services']);


app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/create', {
            templateUrl: '/views/create',
            controller: 'PollController'
        }).
        when('/edit/:id', {
        	templateUrl: '/views/edit',
        	controller: 'EditController'
        }).
        otherwise({
            redirectTo: '/home',
            templateUrl: '/views/home'
        });

    }]);