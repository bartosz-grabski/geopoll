directives.directive("timeframe", function($document, timelineService) {

    var linker = function($scope, $element, $attributes) {

        $element.addClass("timeframe");

        var startX = 0, x = 0;
        var offsetX = Math.round($element[0].getBoundingClientRect().left);
        var timeline = document.querySelector("#tl");

        var timelineWidth = timeline.getBoundingClientRect().width;
        var timeframeWidth = $element[0].getBoundingClientRect().width;

        var resizeConfig = {
            handles: "e",
            animate:true,
            helper: "resize-helper",
            minHeight: 290,
            maxHeight: 290,
            maxWidth: timelineWidth
        };

        $scope.beginX = startX;
        $scope.endX = startX + timeframeWidth;

        $element.resizable(resizeConfig);

        $element.on('resizestop', function(e,ui) {


            timeframeWidth = ui.helper.width();
            var beginX = Math.round($element[0].getBoundingClientRect().left);
            var endX = Math.round(beginX + timeframeWidth);

            $element.resizable("option","maxWidth",timelineWidth - beginX + offsetX);

            var events = timelineService.getEventsInPixelRange(beginX,endX);

            $scope.$apply(function() {
                $scope.timeframeWidth = timeframeWidth;
                $scope.updateTimeframeInfo(events,beginX,endX)
            });
        });


        $element.on('mousedown', function(event) {
            // Prevent default dragging of selected content
            event.preventDefault();
            if (event.target.className.indexOf("handle") > 0) { return; }
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

            var beginX = Math.round($element[0].getBoundingClientRect().left);
            var endX = Math.round(beginX + timeframeWidth);

            $element.resizable("option","maxWidth",timelineWidth - beginX + offsetX);

            var events = timelineService.getEventsInPixelRange(beginX,endX);

            $scope.$apply(function() {
                $scope.updateTimeframeInfo(events,beginX,endX)
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
