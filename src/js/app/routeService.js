app.Routes = [];
/* add view routes here. Title, URL, Template and Controller names will be generated based on the name if not provided */
app.Routes.push({name: 'home'});

app.config(['$routeProvider', function ($routeProvider) {
    for (var i in app.Routes) {
        var o = app.Routes[i];
        o.url = o.url || o.name;
        o.title = o.title || o.name;
        o.templateUrl = o.templateUrl || app.AppConfig.templatePath + o.url.replace("/", "-") + '.tpl.html';
        o.controller = o.controller || (o.name.charAt(0).toUpperCase() + o.name.substr(1).toLowerCase()) + 'Controller';
        $routeProvider.when('/' + o.url, { templateUrl: o.templateUrl, controller: o.controller});
    }
    // $routeProvider.when('/food/:category', {templateUrl: Config.templatePath +'food-categories.html', controller: 'FoodController'});
    // $routeProvider.when('/exercise/recording', { templateUrl: Config.templatePath + 'exercise-recording.html', controller: 'ExerciseController'});
    $routeProvider.otherwise({redirectTo: '/home'});
}]);

app.factory('routeService', ['$timeout', '$location', function ($timeout, $location) {

    var service = {};
    /*
     * @description redirect to a new view by changing the location hash.
     * @usage service.redirectTo(['mytheme', 'myalbum']);
     * @param arr Array The values to make up the new address.
     *
     */
    service.redirectTo = function (arr) {
        arr = angular.isArray(arr) ? arr : [arr];
        var hash = "";
        if (arr)
            hash = arr.length > 0 ? arr.join("/") : "";

        $timeout(function () { $location.path(hash); });
    };

    service.currentPath = function () {
        var path = $location.path().replace("/", "");
        path = path.split("/")
        return path;
    };

    service.getRoutePosition = function(name) {
        var i=0;
        for(var r in app.Routes){
            if(app.Routes[r].url == name)
                return i;
            i++;
        }
        return -1;
    }



    service.currentRoute = function () {

        var route = $location.path().replace("/", "");
        route = route.split("/")[0];

        if (route == '')route = 'home';
        return route;
    }

    return service;


}]);