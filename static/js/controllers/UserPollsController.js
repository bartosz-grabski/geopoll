controllers.controller('UserPollsController', function ($scope, userPollsService) {

    $scope.polls;

    userPollsService.getUserPolls(function (res) {
        console.log(res);
        $scope.polls = res;
    }, function () {
        console.log("Cannot load user polls");
    });
});