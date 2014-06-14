services.factory('timelineService', function ($http,$location,$window) {

	service = {}

	Timeline._Band.prototype._onDblClick = function(innerFrame, evt, target) {
		var debugg = this.pixelOffsetToDate(evt.offsetX);
		eventSource1.loadJSON(timeline_data, '.');
		eventSource1._fire("onAddMany", []);
		tl.layout();
	};

	SimileAjax.History.enabled = false;

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

	function userPollsToEvents(userPolls) {
		events = [];
		for (var i = 0; i < userPolls.length; i++) {
			var userPoll = userPolls[i];
			for (var j = 0; j < userPoll.time_slots.length; j++) {

				var timeStart = new Date(userPoll.time_slots[j].timeStart).toISOString();
				var timeEnd = new Date(userPoll.time_slots[j].timeEnd).toISOString();

				var userPollEvent = {
					start : timeStart,
					end : timeEnd,
					//start: "Jun 9 2014 20:30:00 GMT",
					//end: "Jun 9 2014 21:30:00 GMT",
					title : userPoll.user_name,
					color : 'green'
				}
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
	}

	service.load = function() {
		onLoad();
	}

	service.reload = function() {

	}



	return service;
});