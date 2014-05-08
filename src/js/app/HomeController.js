app.controller('HomeController', ['$scope', '$timeout','apiService', 'CmsConfig', function HomeController($scope, $timeout,apiService,CmsConfig) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.initialize = function () {

        scope.tables = CmsConfig.tables;
        scope.setTitle("");

        getRowCount();
        toggleListeners(true);
    };

    var getRowCount = function() {
        var tablenames =[];
        for(var key in scope.tables){
            tablenames.push(key);
        }
        apiService.retrieve({task:'count', tables:angular.toJson(tablenames)}, function(response){
            for(var k in response.result){
                scope.tables[k].count = response.result[k];
            }
        })
    }

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