//holds all modal related code
services.factory('modalService', function ($http,$location,$window,$modal,$log, pollService, datepickerService) {

	var service = {};

	var confirmPollCreateCtrl = function ($scope, $modalInstance, onConfirm, onCancel, name, description) {

		$scope.name = name;
		$scope.description = description;

		$scope.ok = function () {
			$modalInstance.close();
			if (onConfirm) onConfirm();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
			if (onCancel) onCancel();
		};
	};

	service.confirmPollCreateModal = function(name, description, onConfirm, onCancel) {
		
		var modalInstance = $modal.open({
			templateUrl: 'views/modals/create',
			controller: confirmPollCreateCtrl,
			resolve: {
				onConfirm: function() { return onConfirm; },
				onCancel: function() { return onCancel; },
				name: function() { return name; },
				description: function() { return description; }
			}
		});

		modalInstance.result.then(function (data) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	};

	var updatePollCtrl = function($scope, $modalInstance, data, onConfirm, onCancel) {

		$scope.modal = data;

		$scope.modal.today = datepickerService.today($scope.modal);

		$scope.modal.today();
		$scope.modal.groupCount = 1;

		$scope.modal.startTime = $scope.modal.dt;
		$scope.modal.endTime = $scope.modal.dt;
		$scope.modal.declEndTime = $scope.modal.dt;

		$scope.modal.disabled = datepickerService.disabled;
		$scope.modal.toggleMin = datepickerService.toggleMin($scope.modal);

		$scope.modal.toggleMin();

		$scope.modal.open = datepickerService.open($scope.modal);
		$scope.modal.dateOptions = datepickerService.dateOptions;
		$scope.modal.initDate = datepickerService.initDate;
		$scope.modal.formats = datepickerService.formats;
		$scope.modal.format = datepickerService.format;

		var temp = {};
		console.log($scope.modal.groups);
		for (var group in $scope.modal.groups) {
			console.log(group);
			temp[$scope.modal.groups[group][0]] = $scope.modal.groups[group][1];
		}

		$scope.modal.groups = temp;

		var gatherPollInfo = pollService.gatherPollInfo($scope.modal);

		$scope.modal.addNewGroup = function() {
        	$scope.modal.groups[$scope.modal.newGroup] = $scope.modal.groupCount;
    	};

    	$scope.modal.showGroupLabel = function (group) {
        	return $scope.modal.groups.length === 1;
    	};

    	$scope.modal.deleteGroup = function(group) {
       		delete $scope.modal.groups[group]; 
    	};

		$scope.modal.ok = function () {
			$modalInstance.close();
			if (onConfirm) onConfirm(gatherPollInfo());
		};

		$scope.modal.cancel = function () {
			$modalInstance.dismiss('cancel');
			if (onCancel) onCancel();
		};
	};

	service.updatePollModal = function(data,onConfirm,onCancel) {

		var modalInstance = $modal.open({
			templateUrl: 'views/modals/update',
			controller: updatePollCtrl,
			resolve: {
				onConfirm: function() { return onConfirm; },
				onCancel: function() { return onCancel; },
				data : function() { return data; }
			}
		});
	};

	var userPollCtrl = function($scope, $modalInstance, onConfirm, onCancel, groups) {

		$scope.modal = {};
		$scope.modal.groups = groups;

		$scope.modal.ok = function() {
			var username = $scope.modal.username;
			var groups = $scope.modal.selectedGroups;
			$modalInstance.close({username:username, groups:groups});
		};

		$scope.modal.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

	};


	service.newUserPollModal = function(onConfirm, onCancel, groups) {

		var modalInstance = $modal.open({
			templateUrl: 'views/modals/userpoll',
			controller: userPollCtrl,
			resolve: {
				onConfirm: function() { return onConfirm; },
				onCancel: function() { return onCancel; },
				groups: function() { return groups;}
			}
		});

		modalInstance.result.then(onConfirm, onCancel);
	};


	var userEventCtrl = function($scope, $modalInstance, selectedTimestamp, isTerm) {

		$scope.modal = {};
		$scope.modal.duration = 1;
		$scope.modal.selectedTimestamp = selectedTimestamp;
        $scope.modal.availability = "yes";

		$scope.modal.isTerm = isTerm;

		$scope.modal.ok = function() {

			var result = {
				duration : $scope.modal.duration,
				selectedTimestamp : selectedTimestamp
			};
            if (!isTerm) {
                result.availability = $scope.modal.availability ? $scope.modal.availability : "yes";
            }
			$modalInstance.close(result);
		};

		$scope.modal.cancel = function() {
			$modalInstance.dismiss('cancel');
		};

	};


	service.newUserEventModal = function(onConfirm, onCancel, selectedTimestamp, isTermModal) {

		var modalInstance = $modal.open({
			templateUrl: 'views/modals/event',
			controller: userEventCtrl,
			resolve : {
				selectedTimestamp : function() { return selectedTimestamp; },
				isTerm : function() { return isTermModal; }
			}
		});

		modalInstance.result.then(onConfirm,onCancel);

	};

	return service;
});