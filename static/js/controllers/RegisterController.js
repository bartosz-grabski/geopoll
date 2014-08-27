controllers.controller('RegisterController', function ($scope, registerService) {

    messages = {
        "userRegistrationMessageSuccess": "Successfully registered new user!",
        "userRegistrationMessageError": "Error registering new user!"
    };

    $scope.isInvalida = false;
    $scope.usernameChange = function () {
        $scope.isInvalid = false;
    }

    $scope.registration = {};
    $scope.saveData = function () {
        console.log($scope.registration);
        console.log("[INFO] Register was clicked!");

        var onSuccess = function () {
            console.log("[INFO] New user has been registered!");
            $scope.registerSuccess=true;
            $scope.registerError=false;
            $scope.registerMessage=messages.userRegistrationMessageSuccess;
        };

        var onCancel = function () {
            console.log("[INFO] User registration has failed");
            $scope.registerSuccess=false;
            $scope.registerError=true;
            $scope.registerMessage=messages.userRegistrationMessageError;
        };

        registerService.registerNewUser($scope.registration, onSuccess, onCancel);

    }
});