/*
 * @usage : <div ng-background-src="urlVariable">
 */
app.directive('ngBackgroundSrc', ['$timeout', function ($timeout) {
    return function (scope, elm, attrs) {
        scope.$watch(attrs.ngBackgroundSrc, function (newVal, oldVal) {
            if (newVal) {
                var url = encodeURI(newVal);
                elm.css({'background-image' : "url('"+url+"')"})
               // elm.css({'background-image' : "url('"+url+"')", 'filter' : "progid:DXImageTransform.Microsoft.AlphaImageLoader( src='"+url+"', sizingMethod='scale')"})
            }

        });
    };
}]);