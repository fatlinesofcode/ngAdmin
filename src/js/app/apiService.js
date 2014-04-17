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