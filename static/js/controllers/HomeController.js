controllers.controller('HomeController', function ($scope, $rootScope, $location) {

    $scope.createPoll = function () {
    	$location.path('/poll');
    };

});