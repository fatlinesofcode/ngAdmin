app.controller('ModalInstanceController', ['$scope', '$modalInstance', 'data', function ModalInstanceController($scope, $modalInstance, data) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.initialize = function () {
    };

    scope.data = data;


    scope.ok = function () {
        $modalInstance.close(true);
    };

    scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };



    scope.initialize();
    return scope;
}]);