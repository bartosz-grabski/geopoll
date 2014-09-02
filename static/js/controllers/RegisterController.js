controllers.controller('RegisterController', function ($scope, registerService) {

    $scope.registration = {};
    $scope.saveData = function () {
        console.log($scope.registration);
        console.log("[INFO] Register was clicked!");

        var onSuccess = function () {
            console.log("[INFO] New user has been registered!");
            $scope.registerSuccess=true;
            $scope.registerError=false;
            $scope.registerMessage="Successfully registered new user!";
        };

        var onCancel = function (res) {
            console.log("[INFO] User registration has failed");
            $scope.registerSuccess=false;
            $scope.registerError=true;
            $scope.registerMessage=res;
        };

        registerService.registerNewUser($scope.registration, onSuccess, onCancel);

    }
});