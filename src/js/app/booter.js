var ROOT_PATH;
var App = {};
var Controllers = {};
var app = angular.module('app', ['ngRoute', 'ngAnimate', 'ngResource']);
// configure your app
//app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {
app.config(['$locationProvider',function ($locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('!');
}]);
