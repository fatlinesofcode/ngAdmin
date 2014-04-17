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
(function (app) {
    function AppConfig() {
        throw "Static Class. AppConfig cannot be instantiated.";
    }

    var self = AppConfig;

    self.templatePath="./";
    self.testMode = false;
    self.uploadPath = "../uploads/";

    app.AppConfig = AppConfig;

}(app = app || {}));
var app;

app.filter('titlecase', function () {
    return function (src) {
        log("3","filter",src, "");
        var str = src.replace("_", " ");
        return str.substr(0,1).toUpperCase()+""+str.substr(1)
    }
});
app.filter('maxChars', function () {
    return function (src, maxlength) {
        if(src.length > maxlength)
        return src.substr(0,maxlength)+"...";
        else
        return src;
    }
});

app.filter('dateformat', ['$filter', 'CmsConfig', function ($filter, CmsConfig) {
    return function(text){
        if(!text)return "";
        var  tempdate= new Date(text.replace(/-/g,"/"));
        return $filter('date')(tempdate, CmsConfig.dateFormat);
    }
}]);


//var app = angular.module('ngCkeditor', []);
var $defer, loaded = false;

app.run(['$q', '$timeout', function($q, $timeout) {
    $defer = $q.defer();

    if (angular.isUndefined(CKEDITOR)) {
        throw new Error('CKEDITOR not found');
    }
    CKEDITOR.disableAutoInline = true;
    function checkLoaded() {
        if (CKEDITOR.status == 'loaded') {
            loaded = true;
            $defer.resolve();
        } else {
            checkLoaded();
        }
    }
    CKEDITOR.on('loaded', checkLoaded);
    $timeout(checkLoaded, 100);
}])

app.directive('ngCkeditor', ['$timeout', '$q', function ($timeout, $q) {
    'use strict';

    return {
        restrict: 'AC',
        require: ['ngModel', '^?form'],
        scope: false,
        link: function (scope, element, attrs, ctrls) {
            var ngModel = ctrls[0];
            var form    = ctrls[1] || null;
            var EMPTY_HTML = '<p></p>',
                isTextarea = element[0].tagName.toLowerCase() == 'textarea',
                data = [],
                isReady = false;

            if (!isTextarea) {
                element.attr('contenteditable', true);
            }

            var onLoad = function () {
                var options = {
                    toolbar: 'full',
                    toolbar_full: [
                        { name: 'basicstyles',
                            items: [ 'Bold', 'Italic', 'Strike', 'Underline' ] },
                        { name: 'paragraph', items: [ 'BulletedList', 'NumberedList', 'Blockquote' ] },
                        { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock' ] },
                        { name: 'links', items: [ 'Link', 'Unlink', 'Anchor' ] },
                        { name: 'tools', items: [ 'SpellChecker', 'Maximize' ] },
                        '/',
                        { name: 'styles', items: [ 'Format', 'FontSize', 'TextColor', 'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
                        { name: 'insert', items: [ 'Image', 'Table', 'SpecialChar' ] },
                        { name: 'forms', items: [ 'Outdent', 'Indent' ] },
                        { name: 'clipboard', items: [ 'Undo', 'Redo' ] },
                        { name: 'document', items: [ 'PageBreak', 'Source' ] }
                    ],
                    disableNativeSpellChecker: false,
                    enterMode : CKEDITOR.ENTER_BR,
                    uiColor: '#FAFAFA',
                    height: '400px',
                    width: '100%'
                };
                options = angular.extend(options, scope[attrs.ngCkeditor]);

                var instance = (isTextarea) ? CKEDITOR.replace(element[0], options) : CKEDITOR.inline(element[0], options),
                    configLoaderDef = $q.defer();

                element.bind('$destroy', function () {
                    instance.destroy(
                        false //If the instance is replacing a DOM element, this parameter indicates whether or not to update the element with the instance contents.
                    );
                });
                var setModelData = function(setPristine) {
                    var data = instance.getData();
                    if (data == EMPTY_HTML) {
                        data = null;
                    }
                    $timeout(function () { // for key up event
                        ngModel.$setViewValue(data);
                        (setPristine === true && form) && form.$setPristine();
                    }, 0);
                }, onUpdateModelData = function(setPristine) {
                    if (!data.length) { return; }


                    var item = data.pop() || EMPTY_HTML;
                    isReady = false;
                    instance.setData(item, function () {
                        setModelData(setPristine);
                        isReady = true;
                    });
                }

                //instance.on('pasteState',   setModelData);
                instance.on('change',       setModelData);
                instance.on('blur',         setModelData);
                instance.on('key',          setModelData); // for source view

                instance.on('instanceReady', function() {
                    scope.$apply(function() {
                        onUpdateModelData(true);
                    });
                });
                instance.on('customConfigLoaded', function() {
                    configLoaderDef.resolve();
                });

                ngModel.$render = function() {
                    if (ngModel.$viewValue === undefined) {
                        ngModel.$setViewValue(null);
                        ngModel.$viewValue = null;
                    }

                    data.push(ngModel.$viewValue);
                    if (isReady) {
                        onUpdateModelData();
                    }
                };
            };

            if (CKEDITOR.status == 'loaded') {
                loaded = true;
            }
            if (loaded) {
                onLoad();
            } else {
                $defer.promise.then(onLoad);
            }
        }
    };
}]);

app.directive('ngFileReaderImage', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        priority: 1,
        // replace:true,
        //  require: ['ngModel'],
        scope: {
            base64data: '=ngFileReaderImage',
            filename: '=',
        },
        template: '<div  class="preview"><img ng-src="{{image.src}}" /></div> <input type="file" class="imageLoader" name="imageLoader" accept="image/*"/>',
        link: function (scope, element, attrs) {
            //  log("ngFileReaderImage", "link", "", "");
            //  scope.value = attrs.ngFileReaderImage;
            // scope.image = {};

            // scope.image = scope.base64data;

            var filenameWatch;


            var init = function () {
                filenameWatch = scope.$watch('filename', onFilenameChange);
                fileinput.bind('change', onFileReaderImageSelect);
            }


            var RESIZE_WIDTH = attrs.resizeWidth || 320;
            var RESIZE_HEIGHT = attrs.resizeHeight || 240;
            var RESIZE_QUALITY = attrs.resizeQuality || 80;

            var fileinput = element.find("input[type='file']");

            /*
             * Load a an image via the Filereader api.
             * Resample using canvasResize plugin to avoid IOS squash and orientation bugs
             */
            var onFileReaderImageSelect = function (e) {
                scope.processing = (true);
                //  return;
                var file = e.target.files[0];
                log("49", "onFileReaderImageSelect", "file resizeWidth", attrs.resizeWidth, scope.$eval(attrs.resizeWidth));
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var raw = e.target.result;

                    canvasResize(file, {
                        width: RESIZE_WIDTH || raw.width,
                        height: RESIZE_HEIGHT || raw.height,
                        crop: false,
                        quality: RESIZE_QUALITY,
                        callback: function (data, width, height) {
                            var img = new Image();
                            img.onload = function () {
                                onResizeComplete(img);
                            }
                            img.src = data;
                        }
                    });
                }
                reader.readAsDataURL(file);
            }

            scope.fileReaderImageSelect = function () {
                log("37", "scope", "fileReaderImageSelect", "", element);
                var allowed = confirm("This feature would like to access your photos");
                if (allowed)
                    fileinput.click();
            }
            var onResizeComplete = function (img) {
                scope.$apply(function () {
                    scope.image = img;
                    scope.base64data = img.src;
                //    log("59", "onResizeComplete", "onResizeComplete", img);
                })
            }

            var getBase64Data = function (img) {
                return img.src.substr(img.src.indexOf(',') + 1).toString();
            }
            var onFilenameChange = function () {
                log("83","onFilenameChange","onFilenameChange", "");
                if (scope.filename && !scope.image) {
                    var img = new Image();
                    img.onload = function () {
                        scope.$apply(function () {
                            filenameWatch(); // un watch
                            scope.image = img;
                        })
                    }
                    img.src = app.AppConfig.uploadPath + scope.filename;
                }
            }

            init();

        }
    }
}]);
/*
 *
 * @usage <div ng-ngInputName=""></div>
 */
app.directive('ngInputName', ['$timeout', '$parse', '$compile', function ($timeout, $parse, $compile) {
    return {
        restrict: 'A',
       // priority:10,
       // terminal: true,
        //replace:true,
        //scope:{ data: '=ngInputName' }, // get data in isolated scope
        //template: '<div class="ngInputName" data-value="{{value}}"></div>',
        link: function (scope, elem, attrs) {
            var name = scope.$eval(attrs.ngInputName);
          //  log("ngInputName", "link", "", name);





          //  var name = $parse(elem.attr('ngInputName'))(scope);
          //  elem.removeAttr('ngInputName');
          //  elem.attr('name', name);
          //  $compile(elem)(scope);


        }
    }
}]);
/*
 * inject the template for svg loading
 * @usage <div ng-svg-loading=""></div>
 */
app.directive('ngSvgLoading', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        //priority:0,
        //replace:true,
        //scope:{ data: '=ngSpinner' }, // get data in isolated scope
        template: '<ng-include src="path"></ng-include>',
        link: function (scope, element, attrs) {
            scope.path = 'assets/img/loading-'+attrs.ngSvgLoading+'.svg';
        }
    }
}]);
app.Routes = [];
/* add view routes here. Title, URL, Template and Controller names will be generated based on the name if not provided */
app.Routes.push({name: 'home'});
app.Routes.push({name: 'edit'});
app.Routes.push({name: 'login'});
app.Routes.push({name: 'edit', url:'edit/:table/:id', templateUrl: app.AppConfig.templatePath + 'edit.tpl.html'});
app.Routes.push({name: 'list', url:'list/:table', templateUrl: app.AppConfig.templatePath + 'list.tpl.html'});

//Routes.push({name: 'food', url: 'food/browse/:category', templateUrl:Config.templatePath+'food-categories.html'});

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
    $routeProvider.otherwise({redirectTo: '/login'});
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
app.factory('apiService', ['$resource','$cookieStore','routeService', 'CmsConfig', function ($resource,$cookieStore,routeService,CmsConfig) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;


    //self.facebook = new FBservice();
    //self.facebook.premissions = "email";
    //self.facebook.debugMode = false;

    var url =  "./include/ngAdminAPI.php/:action";
    _resource = $resource(url, {}, {
        update:{method:'JSON'},
        post:{method:'post'},
        put:{method:'put'}
    });


    self.loggedin = false;

    self.initialize = function () {

    };

    self.resource = function () {
        return _resource;
    };

    var onApiError = function (msg) {
        msg = msg ? "\n" + msg : "";
        alert("Oops...\n an error occurred communicating with the API." + msg);
    }

    self.get_row_count = function( data, onCompleteCallback, onErrorCallback) {

        self.post('get_row_count', data, onCompleteCallback, onErrorCallback);
    }

    self.get_rows = function(table, data, onCompleteCallback, onErrorCallback) {
        if(!data)data = {};
        data.table = table;
        if(! data.order_by)
        data.order_by = CmsConfig.order_by;

        self.post('get_rows', data, onCompleteCallback, onErrorCallback);
    }

    self.get_row = function(table, data, onCompleteCallback, onErrorCallback) {
        if(!data)data = {};
        data.table = table;

        self.post('get_row', data, onCompleteCallback, onErrorCallback);
    }

    self.save_row = function(data, onCompleteCallback, onErrorCallback) {
        self.post('save_row', data, onCompleteCallback, onErrorCallback);
    }
    self.delete_row = function(data, onCompleteCallback, onErrorCallback) {
        self.post('delete_row', data, onCompleteCallback, onErrorCallback);
    }
    self.post = function(action, data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        data.username = $cookieStore.get('username');
        data.password = $cookieStore.get('password');
        _resource.post({'action' : action}, data, function(response){
            if(response.error){
                onApiError(response.error);
            }
            if(response.badlogin){
                self.logout();
            }
            onCompleteCallback(response);
        }, onErrorCallback);
    }
    self.logout = function() {
        $cookieStore.put('loggedin', 'no');
        $cookieStore.remove('username');
        $cookieStore.remove('password');
        self.loggedin=false;
        routeService.redirectTo('login')
    }

    self.login = function(data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        data = angular.copy(data);
        if(data.password){
            data.password = MD5(data.password);
        }
        _resource.post({'action' : 'login'}, data, function(response){
            $cookieStore.put('loggedin', response.result? 'yes' : 'no');
            $cookieStore.put('username', data.username);
            $cookieStore.put('password', data.password);
            self.loggedin=response.result;

            log("98","service","", response);

            onCompleteCallback(response);
        }, onErrorCallback);
    }


    self.initialize()
    return self;

}]);
app.factory('eventService', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */

    self.initialize = function () {

    };

    self.broadcast = function (eventName, data, deferred) {
        log("--", "eventService", "broadcast", eventName, data);
        var func = function () {
            $rootScope.$broadcast(eventName, data);
        }
        if (deferred) {
            $timeout(func, 50)
        } else {
            func();
        }
    }
    self.emit = function (eventName, data, deferred) {
        log("--", "eventService", "emit", eventName, data);
        var func = function () {
            $rootScope.$emit(eventName, data);
        }
        if (deferred) {
            $timeout(func, 50)
        } else {
            func();
        }
    }
    self.on = function(eventName, func) {
        $rootScope.$on(eventName, func);
    }


    self.initialize()
    return self;

}]);
app.controller('AppController', ['$scope', '$timeout', '$rootScope', 'routeService','eventService', '$routeParams', 'apiService','$cookieStore','CmsConfig',
    function AppController($scope, $timeout, $rootScope, routeService, eventService, $routeParams, apiService, $cookieStore, CmsConfig) {

        /* structure hack for intellij structrue panel */
        var scope = this;
        if (true)scope = $scope;
        /* end */
        scope.pageClass = '';
        scope.debug = $('body').hasClass('debug-enabled');

        $rootScope.doctitle = "";


        scope.initialize = function () {
            log("8", "AppController", "initialize", "", routeService.currentRoute());

            scope.config = CmsConfig;//app.CmsConfig;

            toggleListeners(true);
        };
        var toggleListeners = function (enable) {
            scope.$on('$destroy', onDestroy)
            scope.$on('$routeChangeStart', onRouteStart);
            scope.$on('$routeChangeSuccess', onRouteChange);
            scope.$on('$viewContentLoaded', onViewContentLoaded);
        };
        var onDestroy = function (enable) {
            toggleListeners(false);
        };

        var onViewContentLoaded = function() {

        }
        var onActionClick = function(e) {
        }
        var onRouteChange = function($event, current) {
            scope.pageClass = routeService.currentRoute();
        }

        scope.refresh = function () {
            $timeout(function () {
            });
        }
        scope.redirectTo = function (address) {
            routeService.redirectTo(address);
        }
        scope.runTest = function(name) {
           // log("46","AppController","runTest", name);
            eventService.emit(AppEvent.RUN_TEST, name)
        }

        scope.setTitle = function(table, names) {
            scope.currenttable = table;
            if(angular.isArray(names))
            scope.title = (names.join(" / "));
            else
            scope.title = "";

            $rootScope.doctitle = scope.config.sitetitle
            if(scope.currenttable)
                $rootScope.doctitle +=" | " +scope.currenttable;
            if(scope.title)
                $rootScope.doctitle +=" | " +scope.title;
        }

        var onRouteStart = function ($event, next, current) {
            if(! scope.isLoggedIn()){
                routeService.redirectTo('login');
            }


            //  return;
            var n = 0, c = 0;
            if (next && current) {
                if(next.originalPath)
                    n = routeService.getRoutePosition(next.originalPath.replace("/", ""));
                if(current.originalPath)
                    c = routeService.getRoutePosition(current.originalPath.replace("/", ""));
            }
            if(c < 0){
                scope.viewAnimationDirection = 'direction-left';
            }else
                scope.viewAnimationDirection = n < c ? 'direction-right' : 'direction-left';
        }

        scope.isLoggedIn = function() {
            return ($cookieStore.get('loggedin') == 'yes')
        }


        scope.initialize();
        return scope;
    }]);
app.controller('EditController', ['$scope', '$routeParams', 'apiService', 'routeService','CmsConfig', function EditController($scope, $routeParams, apiService, routeService, CmsConfig) {
    /* structure hack for intellij structrue panel */
    var scope = this;
    if (true)scope = $scope;
    /* end */

    scope.formdata = null;
    scope.image = {};
 // scope.ngFileReaderImage = {'test':'test'};

    scope.state = "";

    scope.processing = false;


    scope.initialize = function () {
        scope.table = $routeParams.table;
        scope.id = $routeParams.id;

        scope.fields = CmsConfig.tables[scope.table].editfields;

        scope.setTitle(scope.table, ['edit'])

        scope.ckeditorOptions = {
            height : '150px',
            format_tags : 'h3;div;p',
            toolbar_full: [
                { name: 'basicstyles',
                    items: [ 'Bold', 'Italic', 'Underline' ] },
                { name: 'paragraph', items: [ 'BulletedList', 'NumberedList' ] },
                { name: 'editing', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight' ] },
                { name: 'styles', items: [  'PasteText', 'PasteFromWord', 'RemoveFormat' ] },
                { name: 'formatting', items: [ 'Outdent', 'Indent', 'Format', 'Source'  ] }
            ]
        };

        log("11","EditController","initialize", $routeParams.table);

        if(scope.id ){
            loadFormData();
        }else{
        }
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
    scope.setImage = function(img) {
        log("51","EditController","setImage", "");
    }

    scope.save = function(data) {
        log("30","EditController","save", data, "valid", scope.form);

       // return;
        scope.state = "submitted";

        if(scope.form.$invalid){
            return;
        }

        data.table = scope.table;
        data.id = scope.id;

        scope.processing = true;

        apiService.save_row(data, function(response){
            scope.state = "complete";
            scope.id = response.id;
            log("80","EditController","save_row", response);
            loadFormData();
           // scope.processing = false;
          //  routeService.redirectTo(['list', scope.table])
        })
    }
    var loadFormData = function() {
        scope.formdata = null;
       // return;
        apiService.get_row(scope.table,{id: scope.id}, function(response){
            scope.formdata = {};
            for(var i in response){

                for (var j = 0; j < scope.fields.length; j++) {
                    var obj = scope.fields[j];
                    if(obj.name == i){
                        log("21","EditController","response", i, response[i], scope.fields.indexOf(i));
                        scope.formdata[i]  = response[i];
                    }
                }

            }

            log("82","getFormData","formdata",  scope.formdata);

            scope.setTitle(scope.table, [ 'edit', scope.formdata.title]);

            scope.form.$setPristine();

            scope.processing = false;
        })
    }

    scope.delete = function(title, id) {
        var proceed = confirm("Are you sure you want to delete '"+title+"'?");
        if(proceed){
            var data = {};
            data.table = scope.table;
            data.id = id;
            scope.processing = true;
            apiService.delete_row(data, function(response){
                scope.processing = false;
                scope.redirectTo('list/'+scope.table);
            })
        }

    }
    scope.cancel = function() {
        scope.redirectTo('list/'+scope.table);
    }
    scope.hello = function() {
        log("121","EditController","hello", "");
    }

    scope.initialize();
    return scope;
}]);
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