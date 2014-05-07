//holds all modal related code
services.factory('modalService', function ($http,$location,$window,$modal,$log) {

    var service = {};

    var ModalInstanceCtrl = function ($scope, $modalInstance, onSuccess, onCancel) {

		
    	$scope.ok = function () {
    		$modalInstance.close();
    		if (onSuccess) onSuccess();
    	};

    	$scope.cancel = function () {
    		$modalInstance.dismiss('cancel');
    		if (onCancel) onCancel();
    	};
	};

	service.confirmPollCreate = function(onSuccess, onCancel) {
		
		var modalInstance = $modal.open({
			templateUrl: 'confirm.html',
			controller: ModalInstanceCtrl,
			resolve: {
				onSuccess: function() { return onSuccess },
				onCancel: function() {}
			}
		});

		modalInstance.result.then(function (data) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});

	}
    
    return service;
});