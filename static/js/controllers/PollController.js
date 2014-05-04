controllers.controller('PollController', function ($scope, $rootScope, $location, $modal,$log) {

	$scope.submit = function () {
		confirmModalCreate($modal,$scope,$log);
	};


    $scope.today = function() {
    	$scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
    	$scope.dt = null;
    };

  	// Disable weekend selection
  	$scope.disabled = function(date, mode) {
  		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  	};

  	$scope.toggleMin = function() {
  		$scope.minDate = $scope.minDate ? null : new Date();
  	};
  	$scope.toggleMin();

  	$scope.open = function($event) {
  	$event.preventDefault();
  	$event.stopPropagation();

  	$scope.opened = true;
  	};

  	$scope.dateOptions = {
  		formatYear: 'yy',
  		startingDay: 1
  	};

  	$scope.initDate = new Date('2016-15-20');
  	$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  	$scope.format = $scope.formats[0];

});

var ModalInstanceCtrl = function ($scope, $modalInstance, poll) {

	$scope.poll = poll;
    $scope.ok = function () {
    	$modalInstance.close();
    };

    $scope.cancel = function () {
    	$modalInstance.dismiss('cancel');
    };
};

var confirmModalCreate = function($modal,$scope,$log) {
		
		var modalInstance = $modal.open({
			templateUrl: 'confirm.html',
			controller: ModalInstanceCtrl,
			resolve: {
				poll : function () {
					return { title: $scope.pollName, description: $scope.pollDesc };
				}
			}
		});

		modalInstance.result.then(function (selectedItem) {
			$scope.selected = selectedItem;
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});



}