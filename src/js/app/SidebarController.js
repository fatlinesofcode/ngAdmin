app.controller('SidebarController', ['$scope', 'CmsConfig', function SidebarController($scope, CmsConfig) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.initialize = function () {
        scope.tables = CmsConfig.tables;
        toggleListeners(true);
    };


    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.

        scope.$on('$destroy', onDestroy)
    };
    var onDestroy = function (enable) {
        toggleListeners(false);
    };

    scope.initialize();
    return scope;
}]);