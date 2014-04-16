app.controller('ListController', ['$scope', '$routeParams', 'apiService', 'CmsConfig', '$timeout', function ListController($scope, $routeParams, apiService, CmsConfig, $timeout) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    var _inputChangeTimeout=null;
    scope.initialize = function () {
        scope.table = $routeParams.table;
        scope.fields = CmsConfig.tables[scope.table].listfields;
        scope.order_by = CmsConfig.tables[scope.table].order_by || CmsConfig.order_by;

        scope.setTitle(scope.table, [ 'list'])


        loadData();

        toggleListeners(true);
    };

    var loadData = function() {
        scope.processing = true;
        var keys = [];
        for (var i = 0; i < scope.fields.length; i++) {
            var obj = scope.fields[i];
            keys.push(obj.name);
        }
        var data = {fields:keys};
        data.order_by = scope.order_by;
        apiService.get_rows(scope.table, data, function(response){
            scope.listdata = response.result;
            scope.processing = false;
        });
    }

    var toggleListeners = function (enable) {
        // remove listeners

        if (!enable)return;
        // add listeners.

        scope.$on('$destroy', onDestroy);
    };
    var onDestroy = function (enable) {
        toggleListeners(false);
    };
    scope.toggleActive = function(obj){
        var data = {};
        data.table = scope.table;
        data.id = obj.id;
        data.active = !obj.active;
        scope.processing = true;

        apiService.save_row(data, function(response){
            loadData();
        })
    }
    scope.delete = function(title, id) {
        var proceed = confirm("Are you sure you want to delete '"+title+"'?");
        if(proceed){
            var data = {};
            data.table = scope.table;
            data.id = id;
            apiService.delete_row(data, function(response){
                loadData();
            })
        }

    }
    scope.onInputChange= function(id, field, newVal)  {

        var data = {};
        data.table = scope.table;
        data.id = id;
        data[field] = newVal;

        $timeout.cancel(_inputChangeTimeout);
        _inputChangeTimeout = $timeout(function(){
            scope.processing = true;
            apiService.save_row(data, function(response){
                loadData();
            })
        },500);

    }

    scope.initialize();
    return scope;
}]);