(function (app) {
    function AppConfig() {
        throw "Static Class. AppConfig cannot be instantiated.";
    }

    var self = AppConfig;

    self.templatePath="./";
    self.testMode = false;

    app.AppConfig = AppConfig;

}(app = app || {}));
var app;
