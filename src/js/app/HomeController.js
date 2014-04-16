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