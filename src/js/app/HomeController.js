app.controller('HomeController', ['$scope', '$timeout','apiService', 'CmsConfig', function HomeController($scope, $timeout,apiService,CmsConfig) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.initialize = function () {
        log("8","HomeController","initialize", "");

        scope.tables = CmsConfig.tables;//app.CmsConfig.tables;
        scope.setTitle("");

        getRowCount();
        toggleListeners(true);
    };

    var getRowCount = function() {
        var keys =[]
        for(var key in scope.tables){
            keys.push(key);
        }
        apiService.get_row_count({tables:keys}, function(response){
            log("22","getRowCount","", response);
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