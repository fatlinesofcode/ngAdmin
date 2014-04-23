var app = angular.module('ngAdmin', ['ngRoute', 'ngAnimate', 'ngResource', 'ngCookies']);
// configure your app
//app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {
app.config(['$locationProvider',function ($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);



deferredBootstrapper.bootstrap({
    element: document,
    module: 'ngAdmin',
    resolve: {
        CmsConfig: function ($http) {
            return $http.get('./assets/config.json');
        }
    }
});