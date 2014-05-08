app.controller('LoginController', ['$scope', '$timeout', 'apiService','routeService', '$cookieStore', function LoginController($scope, $timeout, apiService,routeService, $cookieStore) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.alerts = [
    ];

    scope.initialize = function () {
        apiService.logout();
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
        scope.alerts = [];
        // return;
        scope.state = "submitted";

        if(scope.form.$invalid){
            scope.alerts = [ { type: 'danger', msg: 'You must enter your username and password.' } ];
            return;
        }

        scope.processing = true;


        apiService.login(data, function(response){
            scope.processing =false;
            scope.form.$setPristine();
            log("41","LoginController","", apiService.loggedin);
            if(apiService.loggedin)
            routeService.redirectTo(['home'])
            else{
                scope.state = "invalid"

                scope.alerts = [ { type: 'danger', msg: 'Invalid username or password.' } ];
            }
        })
    }

    scope.closeAlert = function (index) {
        scope.alerts.splice(index, 1);
    };

    scope.initialize();
    return scope;
}]);