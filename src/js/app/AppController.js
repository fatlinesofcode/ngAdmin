app.controller('AppController', ['$scope', '$timeout', '$rootScope', 'routeService','eventService', '$routeParams', 'apiService','$cookieStore','CmsConfig','$modal',
    function AppController($scope, $timeout, $rootScope, routeService, eventService, $routeParams, apiService, $cookieStore, CmsConfig, $modal) {

        /* structure hack for intellij structrue panel */
        var scope = this;
        if (true)scope = $scope;
        /* end */
        scope.pageClass = '';
        scope.debug = $('body').hasClass('debug-enabled');

        scope.sidebarCollapsed = true;

        $rootScope.doctitle = "";

        var _modalInstance;


        scope.initialize = function () {
            log("8", "AppController", "initialize", "", routeService.currentRoute());

            scope.config = CmsConfig;//app.CmsConfig;

            toggleListeners(true);
        };
        var toggleListeners = function (enable) {
            scope.$on('$destroy', onDestroy)
            scope.$on('$routeChangeStart', onRouteStart);
            scope.$on('$routeChangeSuccess', onRouteChange);
            scope.$on('$viewContentLoaded', onViewContentLoaded);
        };
        var onDestroy = function (enable) {
            toggleListeners(false);
        };

        var onViewContentLoaded = function() {

        }
        var onActionClick = function(e) {
        }
        var onRouteChange = function($event, current) {
            scope.pageClass = routeService.currentRoute();
        }

        scope.refresh = function () {
            $timeout(function () {
            });
        }
        scope.redirectTo = function (address) {
            routeService.redirectTo(address);
        }
        scope.runTest = function(name) {
           // log("46","AppController","runTest", name);
            eventService.emit(AppEvent.RUN_TEST, name)
        }

        scope.setTitle = function(table, names) {
            scope.currenttable = table;
            if(angular.isArray(names))
            scope.title = (names.join(" / "));
            else
            scope.title = "";

            $rootScope.doctitle = scope.config.sitetitle
            if(scope.currenttable)
                $rootScope.doctitle +=" | " +scope.currenttable;
            if(scope.title)
                $rootScope.doctitle +=" | " +scope.title;
        }

        var onRouteStart = function ($event, next, current) {
         //   if(! scope.isLoggedIn()){
         //       routeService.redirectTo('login');
         //   }


            //  return;
            var n = 0, c = 0;
            if (next && current) {
                if(next.originalPath)
                    n = routeService.getRoutePosition(next.originalPath.replace("/", ""));
                if(current.originalPath)
                    c = routeService.getRoutePosition(current.originalPath.replace("/", ""));
            }
            if(c < 0){
                scope.viewAnimationDirection = 'direction-left';
            }else
                scope.viewAnimationDirection = n < c ? 'direction-right' : 'direction-left';
        }

        scope.isLoggedIn = function() {
            return ($cookieStore.get('loggedin') == 'yes')
        }

        scope.openModal = function (header, message, size) {
            header = header || "Modal header";
            message = message || "Modal message";
            size = size || '';

            if(_modalInstance){
                _modalInstance.dismiss();
            }

            _modalInstance = $modal.open({
                templateUrl: 'warningModal.html',
                controller: 'ModalInstanceController',
                size:size,
                resolve: {
                    data: function () {
                        return {header:header,message:message};
                    }
                }
            });
            // clear the old instance once closed or dismissed
            _modalInstance.result.then(function () {
                _modalInstance = null;
            }, function(){
                _modalInstance = null;
            })

            return _modalInstance;
        };


        scope.initialize();
        return scope;
    }]);