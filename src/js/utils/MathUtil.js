(function (app) {
    function MathUtil() {
        throw "Static Class. MathUtil cannot be instantiated.";
    }

    var self = MathUtil;

    self.randomBoolean = function () {
        return self.rand(0,1) > 0.5;
    }
    self.randInt = function (min, max) {
        return Math.round(self.rand(min, max));
    }
    self.rand = function (min, max) {
        return (Math.random() * (max - min) + min);
    }
    self.distance = function (x1, y1, x2, y2) {
        return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))
    }

    app.MathUtil = MathUtil;

}(app = app || {}));
var app;
