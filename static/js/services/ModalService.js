//holds all modal related code
services.factory('modalService', function ($http,$location,$window,$modal,$log, pollService, datepickerService) {

	var service = {};

	var confirmPollCreateCtrl = function ($scope, $modalInstance, onSuccess, onCancel, name, description) {

		$scope.name = name;
		$scope.description = description;

		$scope.ok = function () {
			$modalInstance.close();
			if (onSuccess) onSuccess();
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
			if (onCancel) onCancel();
		};
	};

	service.confirmPollCreate = function(name, description, onSuccess, onCancel) {
		
		var modalInstance = $modal.open({
			templateUrl: 'confirm.html',
			controller: confirmPollCreateCtrl,
			resolve: {
				onSuccess: function() { return onSuccess },
				onCancel: function() { return onCancel },
				name: function() { return name },
				description: function() { return description }
			}
		});

		modalInstance.result.then(function (data) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	}

	var updatePollCtrl = function($scope, $modalInstance, onSuccess, onCancel) {

		$scope.modal = {}

		$scope.modal.timezones = pollService.timezones;
		$scope.modal.today = datepickerService.today($scope);

		$scope.modal.today();

		$scope.modal.startTime = $scope.dt;
		$scope.modal.endTime = $scope.dt;
		$scope.modal.declEndTime = $scope.dt;

		$scope.disabled = datepickerService.disabled;
		$scope.toggleMin = datepickerService.toggleMin($scope);

		$scope.toggleMin();

		$scope.modal.open = datepickerService.open($scope);
		$scope.modal.dateOptions = datepickerService.dateOptions;
		$scope.modal.initDate = datepickerService.initDate;
		$scope.modal.formats = datepickerService.formats;
		$scope.modal.format = datepickerService.format;

		$scope.modal.groups = {};

		var gatherPollInfo = pollService.gatherPollInfo($scope.modal);

		$scope.ok = function () {
			$modalInstance.close();
			if (onSuccess) onSuccess(gatherPollInfo());
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
			if (onCancel) onCancel();
		};
	}

	service.updatePoll = function(onSuccess,onCancel) {

		var modalInstance = $modal.open({
			templateUrl: 'update.html',
			controller: updatePollCtrl,
			resolve: {
				onSuccess: function() { return onSuccess },
				onCancel: function() { return onCancel }
			}
		});
	}

	return service;
});