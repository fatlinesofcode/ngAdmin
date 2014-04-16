app.controller('AppController', ['$scope', '$timeout', '$rootScope', 'routeService','eventService', '$routeParams', 'apiService','$cookieStore','CmsConfig',
    function AppController($scope, $timeout, $rootScope, routeService, eventService, $routeParams, apiService, $cookieStore, CmsConfig) {

        /* structure hack for intellij structrue panel */
        var scope = this;
        if (true)scope = $scope;
        /* end */
        scope.pageClass = '';
        scope.debug = $('body').hasClass('debug-enabled');

        $rootScope.doctitle = "";


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
            if(! scope.isLoggedIn()){
                routeService.redirectTo('login');
            }


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


        scope.initialize();
        return scope;
    }]);