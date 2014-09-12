controllers.controller('LoginController', function ($scope, loginService) {
    $scope.login = {};
    $scope.saveData = function () {
        console.log($scope.login);
        console.log("[INFO] LogIn was clicked!");

        var userName = $scope.login.user_name;

        var onSuccess = function () {
            console.log("[INFO] Successful login");
            $scope.loginSuccess = true;
            $scope.loginError = false;
            $scope.loginMessage = "You have successfully logged in";
            $scope.setCurrentUser(userName);
        };

        var onCancel = function (res) {
            console.log("[INFO] Logging has failed");
            $scope.loginSuccess = false;
            $scope.loginError = true;
            $scope.loginMessage = res;
        };

        loginService.logIn($scope.login, onSuccess, onCancel);

    }
});