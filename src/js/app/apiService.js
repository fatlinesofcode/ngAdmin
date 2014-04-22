app.factory('apiService', ['$resource','$cookieStore','routeService', 'CmsConfig', '$http', function ($resource,$cookieStore,routeService,CmsConfig, $http) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;



    var url =  "./include/api.php/:method/:action/:id";
    _resource = $resource(url, {}, {
        post:{method:'post'},
        put:{method:'put'}
    });


    self.loggedin = false;

    self.initialize = function () {
        self.setAuthToken($cookieStore.get('AuthToken'));
    };

    self.resource = function () {
        return _resource;
    };

    var onApiError = function (msg) {
        msg = msg ? "\n" + msg : "";
        alert("Oops...\n an error occurred communicating with the API." + msg);
    }



    self.delete = function(request, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.method = request.method || 'rows';

        return _resource.delete(request, function(response){
            if(response.error){
                onApiError(response.error);
            }
            if(response.badlogin){
                self.logout();
            }
            onCompleteCallback(response);
        }, onErrorCallback);
    }

    self.retrieve = function(request, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.method = request.method || 'rows';

        return _resource.get(request, function(response){
            if(response.error){
                onApiError(response.error);
            }
            if(response.badlogin){
                self.logout();
            }
            onCompleteCallback(response);
        }, onErrorCallback);
    }

    self.update = function(request, data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.method = request.method || 'rows';
        return _resource.put(request, data, function(response){
            if(response.error){
                onApiError(response.error);
            }
            if(response.badlogin){
                self.logout();
            }
            onCompleteCallback(response);
        }, onErrorCallback);
    }

    self.create = function(request, data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.method = request.method || 'rows';
        return _resource.save(request, data, function(response){
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
        self.loggedin=false;
        self.setAuthToken(null);
    }

    self.login = function(data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        data = angular.copy(data);
        if(data.password){
            data.password = MD5(data.password);
        }
        _resource.post({'action' : 'login'}, data, function(response){
            self.loggedin=response.result;
            self.setAuthToken(response.token);
            onCompleteCallback(response);
        }, onErrorCallback);
    }
    self.setAuthToken = function(token) {
        $cookieStore.put('AuthToken', token);
        $http.defaults.headers.common['Authorization'] = token;
    }


    self.initialize()
    return self;

}]);