services.factory('datepickerService', function ($http,$location,$window,$modal,$log) {

	var service = {};

	service.initDate = new Date('2016-15-20');
	service.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
	service.format = service.formats[0];

	service.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
    };

    service.today = function($scope) {
    	return function() {
    		$scope.dt = new Date();
    	};
 	};

 	service.open = function($scope) {

 		return function($event,type) {
 			$event.preventDefault();
 			$event.stopPropagation();
 			if (type === 'end') {
 				$scope.endOpened = true;
 			} else if (type === 'decl') {
 				$scope.declEndOpened = true;
 			} else {
 				$scope.startOpened = true;
 			}
 		};
 	};

	service.toggleMin = function($scope) {
  		return function() {
  			$scope.minDate = $scope.minDate ? null : new Date();
  		};
  	};

  	service.disabled = function(date, mode) {
  		return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  	};

	return service;

});