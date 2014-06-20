services.factory('timelineService', function ($http,$location,$window, modalService) {

	var service = {};
	var doubleClick = false;
	var username = "asd";
	var groups = [];
	var tl;
	var eventSource1;
	var serviceData = {
		username : "",
		events : []
	};

	var colors = {
		"yes" 	: "green",
		"no"  	: "red",
		"maybe" : "orange"
	};

	var eventFromData = function(startTime, endTime, title, description, color) {
		return {
			'start': startTime.toISOString(),
			'end' : endTime.toISOString(),
			'title' : title,
			'description' : description,
			'color' : color
		};
	};

	//hack to override closure, when function is declared the containing scope is captured
	//thus it does not resolve username properly (only reffering to the value it first encountered)
	var onEventConfirmed = function(result) {

		console.log(serviceData.username);
		console.log("[INFO] Event creation confirmed");
		var duration = result.duration;
		var start = result.selectedTimestamp;
		var end = new Date(start.getTime());
		end.setHours(end.getHours()+duration);

		var newEvent = eventFromData(start,end,serviceData.username,"sample","blue");
		serviceData.events.push({timeStart:start, timeEnd:end, type:"blue"});

		eventSource1.loadJSON({ "events":[newEvent] , "dateTimeFormat":"iso8601"}, '.');


	};

	var onEventCanceled = function() {
		console.log("[INFO] Event creation was cancelled");
	};


	Timeline._Band.prototype._onDblClick = function(innerFrame, evt, target) {
		
		if (doubleClick) {
			var selectedTimestamp = this.pixelOffsetToDate(evt.offsetX);
			modalService.newUserEventModal(onEventConfirmed,onEventCanceled,selectedTimestamp);
		}

	};

	SimileAjax.History.enabled = false;

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

	}

	var resizeTimerID = null;

	function onResize() {
		if (resizeTimerID === null) {
			resizeTimerID = $window.setTimeout(function () {
				resizeTimerID = null;
				tl.layout();
			}, 500);
		}
	}

	function userPollsToEvents(userPolls) {
		var events = [];
		for (var i = 0; i < userPolls.length; i++) {
			var userPoll = userPolls[i];
			console.log(userPoll);
			for (var j = 0; j < userPoll.time_slots.length; j++) {

				var timeStart = new Date(userPoll.time_slots[j].timeStart).toISOString();
				var timeEnd = new Date(userPoll.time_slots[j].timeEnd).toISOString();

				var userPollEvent = {
					start : timeStart,
					end : timeEnd,
					//start: "Jun 9 2014 20:30:00 GMT",
					//end: "Jun 9 2014 21:30:00 GMT",
					title : userPoll.user_name,
					color : colors[userPoll.time_slots[j].type]
				};
				events.push(userPollEvent);
			}	
		}
		return events;
	}


	service.loadEvents = function(userPolls) {
		
		userPollEvents = userPollsToEvents(userPolls);
		console.log(userPollEvents);
		eventSource1.loadJSON({ "events":userPollEvents , "dateTimeFormat":"iso8601"}, '.');
		tl.layout();
	};

	service.load = function() {
		onLoad();
	};

	service.reload = function() {

	};

	service.enableTimeline = function(username) {
		console.log(username);
		doubleClick = true;
		serviceData.username = username;
		serviceData.events = [];
	};

	service.disableTimeline = function() {
		doubleClick = false;
	};

	service.getEvents = function() {
		return serviceData.events;
	};

	service.getEventsAndDisableTimeline = function() {
		service.disableTimeline();
		return service.getEvents();
	};



	return service;
});