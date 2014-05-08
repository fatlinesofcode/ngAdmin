app.factory('apiService', ['$resource','$cookieStore', 'CmsConfig', '$http', function ($resource,$cookieStore,CmsConfig, $http) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;

    var url =  "./include/api.php/:action/:task/:table/:id";
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



    self.delete = function(request, onCompleteCallback, onErrorCallback) {
        return self.call('delete', request, null, onCompleteCallback, onErrorCallback);
    }

    self.retrieve = function(request, onCompleteCallback, onErrorCallback) {
        return self.call('get', request, null, onCompleteCallback, onErrorCallback);

    }

    self.update = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.call('put', request, data, onCompleteCallback, onErrorCallback);

    }

    self.create = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.call('save', request, data, onCompleteCallback, onErrorCallback);

    }
    self.post = function(request, data, onCompleteCallback, onErrorCallback) {
        return self.call('post', request, data, onCompleteCallback, onErrorCallback);

    }

    self.call = function(method, request, data, onCompleteCallback, onErrorCallback) {
        onErrorCallback = onErrorCallback || onApiError;
        onCompleteCallback = onCompleteCallback || function(){};
        request.action = request.action || 'records';



        var onComplete = function(response){
            if(response.error){
                onApiError(response);
            }else{
                self.loggedin=true;
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

    var onApiError = function (response) {
        var msg =  "";
        if(response){
            if(response.status) {
                msg += "\nStatus: "+response.status;
            }
            if(response.error) {
                msg += "\nError: "+response.error;
            }
            if(response.data){
                if(response.data.error){
                    msg += "\nError: "+ response.data.error;
                }
                else{
                    msg += "\nData: "+response.data;
                }
            }
        }
        alert("Oops...\nan error occurred communicating with the API." + msg);
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
        $http.defaults.headers.common['HTTP_AUTHORIZATION'] = token;
    }


    self.initialize()
    return self;

}]);