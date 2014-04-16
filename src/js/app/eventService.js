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