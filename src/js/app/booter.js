var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngResource', 'ngCookies']);
// configure your app
//app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {
app.config(['$locationProvider',function ($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);



deferredBootstrapper.bootstrap({
    element: document,
    module: 'app',
    resolve: {
        CmsConfig: function ($http) {
            return $http.get('./assets/config.json');
        }
    }
});