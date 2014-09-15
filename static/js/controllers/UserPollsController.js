controllers.controller('UserPollsController', function ($scope, userPollsService) {

    $scope.polls;
    $scope.thereIsAtLeastOneUserPoll = false;

    userPollsService.getUserPolls(function (res) {
        console.log(res);
        $scope.polls = res;
        if (res.length > 0) {
            $scope.thereIsAtLeastOneUserPoll = true;
        }
    }, function () {
        console.log("Cannot load user polls");
    });
});