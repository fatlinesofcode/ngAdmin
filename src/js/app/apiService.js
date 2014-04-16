app.factory('apiService', ['$resource', function ($resource) {
    /* structure hack for intellij structrue panel */
    service = null;
    var self = service;
    if (true)self = {};
    /* end */
    var _resource;


    //self.facebook = new FBservice();
    //self.facebook.premissions = "email";
    //self.facebook.debugMode = false;

    var url = Config.ROOT_PATH + "api/:method/:param1/:param2/:param3/:param4";
    _resource = $resource(url, {method:'@method', param1:'@param1', param2:'@param2', param3:'@param3', param4:'@param4'}, {
        update:{method:'JSON'}
    });

    self.initialize = function () {

    };

    self.resource = function () {
        return _resource;
    };


    self.initialize()
    return self;

}]);