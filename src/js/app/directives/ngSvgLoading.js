/*
 * inject the template for svg loading
 * @usage <div ng-svg-loading=""></div>
 */
app.directive('ngSvgLoading', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        //priority:0,
        //replace:true,
        //scope:{ data: '=ngSpinner' }, // get data in isolated scope
        template: '<ng-include src="path"></ng-include>',
        link: function (scope, element, attrs) {
            scope.path = 'assets/img/loading-'+attrs.ngSvgLoading+'.svg';
        }
    }
}]);