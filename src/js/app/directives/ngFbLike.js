/*
 * @usage : <div class="fb-like-container" ng-fb-like="urlVariable">like</div>
 */
app.directive('ngFbLike', ['$timeout', '$parse', function ($timeout, $parse) {
    return {
        restrict: 'A',
        template: '<div class="fb-like" data-href="{{href}}" data-width="100" data-colorscheme="light" data-layout="button_count" data-action="like" data-show-faces="false" data-send="false"></div>',
        link: function(scope, element, attrs) {
            try{
                scope.$watch(attrs.ngFbLike, function (newVal, oldVal) {
                    if (newVal) {
                        scope.href = newVal;
                        $timeout(function(){
                            FB.XFBML.parse(element[0]);
                        },100);
                    }
                });
            }catch(error){
                log("17","ngFbLike","error", error);
            }

        }
    };
}]);


