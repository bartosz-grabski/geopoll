controllers.controller('ApplicationController', function ($scope, loginService) {

    $scope.currentUser = null;

    $scope.setCurrentUser = function (user) {
        $scope.currentUser = user;
    };

    $scope.logout = function () {
        loginService.logOut();
        $scope.currentUser = null;
    };

});