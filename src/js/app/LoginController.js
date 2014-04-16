app.controller('LoginController', ['$scope', '$timeout', 'apiService','routeService', '$cookieStore', function LoginController($scope, $timeout, apiService,routeService, $cookieStore) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.initialize = function () {
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

    scope.save = function(data) {
        log("30","LoginController","save", data, "valid", scope.form);

        // return;
        scope.state = "submitted";

        if(scope.form.$invalid){
            return;
        }

        scope.processing = true;


        apiService.login(data, function(response){
            log("36","LoginController","login", response);
           // $cookieStore.put('loggedin', response.result? 'yes' : 'no');
           // apiService.loggedin=response.result;
            scope.processing =false;
            scope.form.$setPristine();
            if(apiService.loggedin)
            routeService.redirectTo(['home'])
            else{
                scope.state = "invalid"
            }
        })
    }

    scope.initialize();
    return scope;
}]);