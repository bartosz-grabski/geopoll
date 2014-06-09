controllers.controller('PollController', function ($scope, $rootScope, $location, $window, pollService, modalService, $routeParams) {

    $scope.messages = {
        "pollUpdateError": "There were problems updating your poll!",
        "pollUpdateSuccess": "Poll successfully updated!"
    }

    SimileAjax.History.enabled = false;

    $scope.poll = {};

    $scope.edit = function () {

        var onConfirm = function (data) {

            console.log(data);

            console.log($routeParams.id);
            pollService.updatePoll($routeParams.id, data, function () {
                    $scope.poll = data;
                    $scope.pollUpdateSuccess = true;
                    $scope.pollUpdateError = false;
                },
                function () {
                    $scope.pollUpdateError = true;
                    $scope.pollUpdateSuccess = false;
                });
        };

        modalService.updatePollModal(pollService.networkToGui($scope.poll), onConfirm);
    }

    $scope.getPollInfo = function () {

        var onSuccess = function (data) {

            groups = {};
            for (i in data.required_groups) {
                groups[data.required_groups[i]] = true;
            }
            $scope.poll = data;
            $scope.poll.required_groups = groups;
            $scope.canEdit = data.can_edit;
        };

        var onError = function () {

        };


        pollService.getPollInfo($routeParams.id, onSuccess, onError);

    }

    $scope.getPollInfo();


    var timeline_data = {
        'events' : [
            {
                'start': "Jun 9 2014 20:30:00 GMT",
                'end': "Jun 9 2014 21:30:00 GMT",
                'title': 'Mark Evans',
                'description': 'It is suitable for me',
                'color': 'blue'
            }
            ,

            {
                'start': "Jun 9 2014 21:00:00 GMT",
                'end': "Jun 9 2014 22:00:00 GMT",
                'title': 'Julia Roberts',
                'description': "I'll be there too",
                'color': 'black'
            },

            {
                'start': "Jun 9 2014 23:00:00 GMT",
                'end': "Jun 9 2014 23:30:00 GMT",
                'title': 'Mark Evans',
                'description': "I can be there",
                'color': 'blue'
            }
        ]
    };


    function displayEvent() {
        eventSource1._fire("onAddMany", []);
        tl.layout();
    }

    var tl;
    var eventSource1;

    function onLoad() {

        eventSource1 = new Timeline.DefaultEventSource();

        var bandInfos = [
            Timeline.createBandInfo({
                width: "80%",
                intervalUnit: Timeline.DateTime.HOUR,
                intervalPixels: 100,
                eventSource: eventSource1
            }),
            Timeline.createBandInfo({
                width: "10%",
                intervalUnit: Timeline.DateTime.DAY,
                intervalPixels: 100
            }),
            Timeline.createBandInfo({
                width: "10%",
                intervalUnit: Timeline.DateTime.MONTH,
                intervalPixels: 100
            }),
            Timeline.createBandInfo({
                width: "10%",
                intervalUnit: Timeline.DateTime.YEAR,
                intervalPixels: 200
            })
        ];

        bandInfos[1].syncWith = 0;
        bandInfos[2].syncWith = 0;
        bandInfos[3].syncWith = 0;
        bandInfos[1].highlight = true;
        tl = Timeline.create(document.getElementById("tl"), bandInfos);


        eventSource1.loadJSON(timeline_data, '.');
        eventSource1._fire("onAddMany", []);
        displayEvent();
        tl.layout();
    }

    var resizeTimerID = null;

    function onResize() {
        if (resizeTimerID == null) {
            resizeTimerID = $window.setTimeout(function () {
                resizeTimerID = null;
                tl.layout();
            }, 500);
        }
    }

    onLoad();


});