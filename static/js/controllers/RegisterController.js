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
        };

        var onCancel = function () {
            console.log("[INFO] User registration has failed");
        };

        registerService.registerNewUser($scope.registration, onSuccess, onCancel);

    }
});