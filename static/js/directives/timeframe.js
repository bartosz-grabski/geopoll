directives.directive("timeframe", function($document, timelineService) {

    var linker = function($scope, $element, $attributes) {

        $element.addClass("timeframe");

        var startX = 0, x = 0;
        var timeline = document.querySelector("#tl");

        var timelineWidth = timeline.getBoundingClientRect().width;
        var timeframeWidth = $element[0].getBoundingClientRect().width;

        

        $element.on('mousedown', function(event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            startX = event.pageX - x;
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        function mousemove(event) {
            x = event.pageX - startX;
            if (x < 0) {
                x = 0;
            } else if (x > timelineWidth - timeframeWidth ) {
                x = timelineWidth - timeframeWidth;
            }
            $element.css({
                left:  x + 'px'
            });
        }

        function mouseup() {
            $document.off('mousemove', mousemove);
            $document.off('mouseup', mouseup);

            var beginX = Math.round($element[0].getBoundingClientRect().x);
            var endX = Math.round(beginX + timeframeWidth);

            var events = timelineService.getEventsInPixelRange(beginX,endX);
            $scope.$apply(function() {
                var timeframe = {};

                timeframe.will = 0;
                timeframe.wont = 0;
                timeframe.probably = 0;

                $scope.timeframe = timeframe;

                events.forEach(function(event) {
                    if (event._color === "red") {
                        timeframe.wont += 1;
                    } else if (event._color === "green") {
                        timeframe.will += 1;
                    } else if (event._color === "orange") {
                        timeframe.probably += 1;
                    }
                });
            });

        }
    };

    return {
        restrict    : 'E',  // used E because of element
        replace:true,
        template: '<div></div>',
        link: linker
    }
});
