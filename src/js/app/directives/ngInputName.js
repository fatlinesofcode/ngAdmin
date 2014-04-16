/*
 *
 * @usage <div ng-ngInputName=""></div>
 */
app.directive('ngInputName', ['$timeout', '$parse', '$compile', function ($timeout, $parse, $compile) {
    return {
        restrict: 'A',
       // priority:10,
       // terminal: true,
        //replace:true,
        //scope:{ data: '=ngInputName' }, // get data in isolated scope
        //template: '<div class="ngInputName" data-value="{{value}}"></div>',
        link: function (scope, elem, attrs) {
            var name = scope.$eval(attrs.ngInputName);
          //  log("ngInputName", "link", "", name);





          //  var name = $parse(elem.attr('ngInputName'))(scope);
          //  elem.removeAttr('ngInputName');
          //  elem.attr('name', name);
          //  $compile(elem)(scope);


        }
    }
}]);