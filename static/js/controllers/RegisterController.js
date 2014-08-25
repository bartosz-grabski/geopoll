controllers.controller('RegisterController', function ($scope, registerService) {

    messages = {
        "userRegistrationMessageSuccess": "Successfully registered new user!",
        "userRegistrationMessageError": "Error registering new user!"
    };

    $scope.isInvalida=false;
    $scope.usernameChange = function () {
        $scope.isInvalid = false;
    }

    $scope.registration = {};
    $scope.saveData = function () {
        console.log($scope.registration);
    }
});