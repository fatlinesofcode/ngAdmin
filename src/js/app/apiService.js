app.factory('apiService', ['$resource','$cookieStore', 'CmsConfig', '$http', function ($resource,$cookieStore,CmsConfig, $http) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;

    var url =  "./include/api.php/:action/:table/:id";
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
        return self.apicall('delete', request, null, onCompleteCallback, onErrorCallback);
    }

    self.retrieve = function(request, onCompleteCallback, onErrorCallback) {
        return self.apicall('get', request, null, onCompleteCallback, onErrorCallback);

    }

    self.update = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.apicall('put', request, data, onCompleteCallback, onErrorCallback);

    }

    self.create = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.apicall('save', request, data, onCompleteCallback, onErrorCallback);

    }
    self.post = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.apicall('post', request, data, onCompleteCallback, onErrorCallback);

    }

    self.apicall = function(method, request, data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.action = request.action || 'rows';



        var onComplete = function(response){
            if(response.error){
                onApiError(response.error);
            }
            if(response.badlogin){
                self.logout();
            }
            onCompleteCallback(response);
        };
        var onError = function(response){
            onErrorCallback(response);
        };

        if(method == 'get' || method == 'delete'){
            return _resource[method](request, onComplete, onError);
        }else{
            return _resource[method](request, data, onComplete, onError);
        }

    }

    self.logout = function() {
        self.loggedin=false;
        self.setAuthToken(null);
    }

    self.login = function(data, onCompleteCallback, onErrorCallback) {
        data = angular.copy(data);
        if(data.password){
            data.password = MD5(data.password);
        }
        
        self.post({action:'login'}, data, function(response){
            self.loggedin=response.result;
            self.setAuthToken(response.token);
            onCompleteCallback(response);
        });
        
    }
    self.setAuthToken = function(token) {
        $cookieStore.put('AuthToken', token);
        $http.defaults.headers.common['Authorization'] = token;
    }


    self.initialize()
    return self;

}]);