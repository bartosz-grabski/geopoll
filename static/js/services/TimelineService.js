services.factory('timelineService', function ($http,$location,$window, modalService, pollService, $compile) {

	var service = {};
	var doubleClick = false;
	var tl;
	var eventSource1;
	var serviceData = {
		username : "",
		events : [],
		groups : []
	};

	var pollId = "";
	var isTerm = false;
    var scope;
    var poll;

	var colors = {
		"yes" 	: "green",
		"no"  	: "red",
		"maybe" : "orange"
	};

	var eventFromData = function(startTime, endTime, title, description, color, groups) {
		return {
			'start': startTime.toISOString(),
			'end' : endTime.toISOString(),
			'title' : title,
			'description' : description,
			'color' : color,
            'caption' : groups,
            'hoverText' : 'temp'
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
		var availability = result.availability;
		var description = "";
		end.setHours(end.getHours()+duration);

		var onNewTerm = function(data) {
			var newTerm = eventFromData(start,end,"Chosen term", data.id, "blue",[]);
            if (poll && poll.selected_terms) {
                poll.selected_terms.push(data);
            } else if (!poll.selected_terms) {
                poll.selected_terms = [];
                poll.selected_terms.push(data);
            }
            console.log(poll.selected_terms);
			eventSource1.loadJSON({ "events":[newTerm] , "dateTimeFormat":"iso8601"}, '.');
		}

		if (isTerm) {
			var newTerm = {
				startDate : start,
				endDate: end
			}
			pollService.newTerm(pollId, newTerm, onNewTerm, function() {});
		} else {
            console.log();
			var newEvent = eventFromData(start,end,serviceData.username,description,colors[availability], serviceData.groups);
			serviceData.events.push({timeStart:start, timeEnd:end, type:availability});
			eventSource1.loadJSON({ "events":[newEvent] , "dateTimeFormat":"iso8601"}, '.');
		}

		


	};

	var onEventCanceled = function() {
		console.log("[INFO] Event creation was cancelled");
	};

	SimileAjax.History.enabled = false;

	function onLoad(id) {

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
		tl = Timeline.create(document.getElementById(id), bandInfos);

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
					//start: "Jun 9 2014  20:30:00 GMT",
					//end: "Jun 9 2014 21:30:00 GMT",
					title : userPoll.user_name,
					color : colors[userPoll.time_slots[j].type],
					description : "",
                    caption: userPoll.chosen_groups ? userPoll.chosen_groups : [],
                    hoverText: userPoll._id
				};
				events.push(userPollEvent);
			}	
		}
		return events;
	}

	function termsToEvents(terms) {

		if (!terms) return;

		var events = [];
		for (var i = 0; i < terms.length; i++) {
			
			var term = terms[i];
			var timeStart = new Date(term.startDate).toISOString();
			var timeEnd = new Date(term.endDate).toISOString();

			var termEvent = {
				start : timeStart,
				end : timeEnd,
				title : "Chosen term",
				description : term.id,
                color: "blue"
			};
			events.push(termEvent);
		}
		return events;	
	}
		


	service.loadEvents = function(userPolls) {
		console.log(userPolls);
		userPollEvents = userPollsToEvents(userPolls);
		eventSource1.loadJSON({ "events":userPollEvents , "dateTimeFormat":"iso8601"}, '.');
		tl.layout();
	};

	service.loadTerms = function(terms) {

		termEvents = termsToEvents(terms);
		console.log(termEvents);
		eventSource1.loadJSON({"events":termEvents, "dateTimeFormat":"iso8601"},".");
		tl.layout();

	}

	service.load = function(id) {
		onLoad(id);
	};

	service.reload = function() {

	};

	service.enableTimeline = function(username, groups) {
		console.log(username);
		doubleClick = true;
		serviceData.username = username;
		serviceData.groups = groups;
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

	service.setPoll = function(p,id) {
        poll = p;
		pollId = id;
		isTerm = true;
	};

    service.setScope = function($scope) {
        scope = $scope;
    };

    service.deleteTermAndReload = function(termId) {
        if (poll && poll.selected_terms)
            var selected_terms = poll.selected_terms;
        for (var i = 0; i < selected_terms.length; i++) {
            if (selected_terms[i].id === termId) {
                selected_terms.splice(i,1);
                break;
            }
        };

        eventSource1.clear();
        this.loadTerms(selected_terms);

    };

    service.getEventsInPixelRange = function(startX, endX) {
        var events = [];
        var evt, coords, startDate, endDate;

        if (startX >= endX) {
            events;
        }
        var hourBand = tl.getBand(0);



        evt = {pageX : startX, pageY: 0};
        coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, hourBand._div);
        startDate = hourBand.pixelOffsetToDate(coords.x);
        evt = {pageX: endX, pageY: 0};
        coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, hourBand._div);
        endDate = hourBand.pixelOffsetToDate(coords.x);

        var eventsIterator = hourBand._eventSource.getEventIterator(startDate,endDate);

        while(eventsIterator.hasNext()) {
            events.push(eventsIterator.next());
        }

        return events;
    };

    /**
     *
     * @param band index of a band, starting from 0 (top band)
     * @param listener listener function
     */
    service.addOnScrollListener = function(band, listener) {
        var band = tl.getBand(0)
        band.addOnScrollListener(listener);
    };


    /**
     * Timeline modifications
     */

    Timeline.DefaultEventSource.Event.prototype.fillButtons = function(div) {


        var termId = this.getDescription();

        div.innerHTML = '<button onclick="voteOnTerm(\''+termId+'\');">Vote<//button><br>'+
                        '<button onclick="deleteTerm(\''+termId+'\');">Delete<//button>';
    }


    Timeline._Band.prototype._onDblClick = function(innerFrame, evt, target) {

        if (doubleClick) {
            var coords = SimileAjax.DOM.getEventRelativeCoordinates(evt, innerFrame);
            var selectedTimestamp = this.pixelOffsetToDate(coords.x);
            modalService.newUserEventModal(onEventConfirmed,onEventCanceled,selectedTimestamp, isTerm);
        }
    };

    Timeline.DefaultEventSource.Event.prototype.fillInfoBubble = function(elmt, theme, labeller) {

        var doc = elmt.ownerDocument;

        var title = this.getText();
        var link = this.getLink();
        var image = this.getImage();

        if (image != null) {
            var img = doc.createElement("img");
            img.src = image;

            theme.event.bubble.imageStyler(img);
            elmt.appendChild(img);
        }

        var divTitle = doc.createElement("div");
        var textTitle = doc.createTextNode(title);
        if (link != null) {
            var a = doc.createElement("a");
            a.href = link;
            a.appendChild(textTitle);
            divTitle.appendChild(a);
        } else {
            divTitle.appendChild(textTitle);
        }
        theme.event.bubble.titleStyler(divTitle);
        elmt.appendChild(divTitle);

        var divBody = doc.createElement("div");
        this.fillDescription(divBody);
        theme.event.bubble.bodyStyler(divBody);
        elmt.appendChild(divBody);

        var divTime = doc.createElement("div");
        this.fillTime(divTime, labeller);
        theme.event.bubble.timeStyler(divTime);
        elmt.appendChild(divTime);

        var divWiki = doc.createElement("div");
        this.fillWikiInfo(divWiki);
        theme.event.bubble.wikiStyler(divWiki);
        elmt.appendChild(divWiki);

        if (this.voting) {
            var divVote = doc.createElement("div");
            this.fillButtons(divVote);
            elmt.appendChild(divVote);
        }

    };


	return service;
});


function voteOnTerm(termId) {
    var timeline = document.getElementById("tl");
    var scope = angular.element(timeline).scope();
    scope.voteOnTerm(termId);
}

function deleteTerm(termId) {
    var timeline = document.getElementById("tl");
    var scope = angular.element(timeline).scope();
    scope.deleteTerm(termId);
}