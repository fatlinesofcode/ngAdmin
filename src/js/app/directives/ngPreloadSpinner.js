/*
 * @usage : <span class="spinner" ng-Preload-Spinner ng-hide="mapsource"></span>
 */
app.directive('ngPreloadSpinner', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        template: '<div id="floatingCirclesG" class="spinner"> <div class="f_circleG" id="frotateG_01"> </div> <div class="f_circleG" id="frotateG_02"> </div> <div class="f_circleG" id="frotateG_03"> </div> <div class="f_circleG" id="frotateG_04"> </div> <div class="f_circleG" id="frotateG_05"> </div> <div class="f_circleG" id="frotateG_06"> </div> <div class="f_circleG" id="frotateG_07"> </div> <div class="f_circleG" id="frotateG_08"> </div></div>',
        link: function(scope, element, attrs) {

        }
    };
}]);
