var ROOT_PATH;
var App = {};
var Controllers = {};
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngResource']);
// configure your app
//app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {
app.config(['$locationProvider',function ($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);

(function (app) {
    function AppConfig() {
        throw "Static Class. AppConfig cannot be instantiated.";
    }

    var self = AppConfig;

    self.templatePath="./";
    self.testMode = false;

    app.AppConfig = AppConfig;

}(app = app || {}));
var app;

app.filter('titlecase', function () {
    return function (src) {
        log("3","filter",src, "");
        var str = src.replace("_", " ");
        return str.substr(0,1).toUpperCase()+""+str.substr(1)
    }
});
app.filter('maxChars', function () {
    return function (src, maxlength) {
        if(src.length > maxlength)
        return src.substr(0,maxlength)+"...";
        else
        return src;
    }
});
app.Routes = [];
/* add view routes here. Title, URL, Template and Controller names will be generated based on the name if not provided */
app.Routes.push({name: 'home'});

app.config(['$routeProvider', function ($routeProvider) {
    for (var i in app.Routes) {
        var o = app.Routes[i];
        o.url = o.url || o.name;
        o.title = o.title || o.name;
        o.templateUrl = o.templateUrl || app.AppConfig.templatePath + o.url.replace("/", "-") + '.tpl.html';
        o.controller = o.controller || (o.name.charAt(0).toUpperCase() + o.name.substr(1).toLowerCase()) + 'Controller';
        $routeProvider.when('/' + o.url, { templateUrl: o.templateUrl, controller: o.controller});
    }
    // $routeProvider.when('/food/:category', {templateUrl: Config.templatePath +'food-categories.html', controller: 'FoodController'});
    // $routeProvider.when('/exercise/recording', { templateUrl: Config.templatePath + 'exercise-recording.html', controller: 'ExerciseController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {

    var service = {};
    /*
     * @description redirect to a new view by changing the location hash.
     * @usage service.redirectTo(['mytheme', 'myalbum']);
     * @param arr Array The values to make up the new address.
     *
     */
    service.redirectTo = function (arr) {
        arr = angular.isArray(arr) ? arr : [arr];
        var hash = "";
        if (arr)
            hash = arr.length > 0 ? arr.join("/") : "";

        $timeout(function () { $location.path(hash); });
    };

    service.currentPath = function () {
        var path = $location.path().replace("/", "");
        path = path.split("/")
        return path;
    };

    service.getRoutePosition = function(name) {
        var i=0;
        for(var r in app.Routes){
            if(app.Routes[r].url == name)
                return i;
            i++;
        }
        return -1;
    }



    service.currentRoute = function () {

        var route = $location.path().replace("/", "");
        route = route.split("/")[0];

        if (route == '')route = 'home';
        return route;
    }

    return service;


}]);
app.factory('apiService', ['$resource', function ($resource) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;


    //self.facebook = new FBservice();
    //self.facebook.premissions = "email";
    //self.facebook.debugMode = false;

    var url = Config.ROOT_PATH + "api/:method/:param1/:param2/:param3/:param4";
    _resource = $resource(url, {method:'@method', param1:'@param1', param2:'@param2', param3:'@param3', param4:'@param4'}, {
        update:{method:'JSON'}
    });

    self.initialize = function () {

    };

    self.resource = function () {
        return _resource;
    };


    self.initialize()
    return self;

}]);
app.factory('eventService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */

    self.initialize = function () {

    };

    self.broadcast = function (eventName, data, deferred) {
        log("--", "eventService", "broadcast", eventName, data);
        var func = function () {
            $rootScope.$broadcast(eventName, data);
        }
        if (deferred) {
            $timeout(func, 50)
        } else {
            func();
        }
    }
    self.emit = function (eventName, data, deferred) {
        log("--", "eventService", "emit", eventName, data);
        var func = function () {
            $rootScope.$emit(eventName, data);
        }
        if (deferred) {
            $timeout(func, 50)
        } else {
            func();
        }
    }
    self.on = function(eventName, func) {
        $rootScope.$on(eventName, func);
    }


    self.initialize()
    return self;

}]);
app.controller('AppController', ['$scope', '$timeout', '$rootScope', 'routeService','eventService',
    function AppController($scope, $timeout, $rootScope, routeService, eventService) {

        /* structure hack for intellij structrue panel */
        var scope = this;
        if (true)scope = $scope;
        /* end */
        scope.pageClass = '';
        scope.debug = $('body').hasClass('debug-enabled');


        scope.initialize = function () {
            log("8", "AppController", "initialize", "", routeService.currentRoute());

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

        var onRouteStart = function ($event, next, current) {
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



        scope.initialize();
        return scope;
    }]);
app.controller('HomeController', ['$scope', '$timeout', function HomeController($scope, $timeout) {
    /* structure hack for intellij structrue panel */
    var self = this;
    if (true)self = $scope;
    /* end */

    self.initialize = function () {
        log("8","HomeController","initialize", "");
        toggleListeners(true);
    };


    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.

        self.$on('$destroy', onDestroy)
    };
    var onDestroy = function (enable) {
        toggleListeners(false);
    };

    self.initialize();
    return self;
}]);