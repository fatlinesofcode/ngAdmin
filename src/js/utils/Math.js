var hitTest = function (box1, box2) {
    return !(box2.left > box1.right
            || box2.right < box1.left
            || box2.top > box1.bottom
            || box2.bottom < box1.top);
}
var getDistance = function (x1, y1, x2, y2) {
    return Math.sqrt(((x1 - x2) * (x1 - x2)) + ((y1 - y2) * (y1 - y2)))
}
var getTriangleSides = function (angle, hypotenuse) {
    var an, o, a, h, deg, rad, x, y;
    an = angle;
    rad = an * (Math.PI / 180)
    h = hypotenuse;
    o = Math.sin(rad) * h;
    a = rad > 0 ? o / Math.tan(rad) : h;
    x = ~~(a);
    y = ~~(o);
    return {x:x, y:y, angle:an};
}
var randomChance = function (n) {
    var r = parseInt(Math.random() * n + 1)
    return r % n == 0;
}
var rand = function (min, max) {
    return Math.random() * (max - min) + min;
    return (Math.random() * max) + min;
}
/*
 0, 30, 120, 360
  */
var randRange = function (min1, max1, min2, max2) {
    var outrange = min2-max1;
    var range = max2-outrange;
    var r = (Math.random() * range)
    r+= min2;
    if(r > max2){
        r-= max1;
    }
    return r;
}

var getAngle2 = function (vectorInput1, vectorInput2) {
    var convertToDegrees = true;
    var nOutput = 0;
    var opp = -(vectorInput2.y - vectorInput1.y);
    var adj = vectorInput2.x - vectorInput1.x;
    nOutput = (convertToDegrees) ? Math.atan2(opp, adj) * (180 / Math.PI) : Math.atan2(opp, adj);
    return nOutput;
}

var getAngle = function (x1, x2, y1, y2) {
    var angle = Math.atan2(x1 - x2, y1 - y2) * (180 / Math.PI);
    if (angle < 0)
        angle = Math.abs(angle);
    else
        angle = 360 - angle;
    return angle;
}