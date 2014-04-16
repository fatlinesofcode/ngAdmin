InputEvent = {};
InputEvent._configTouchEvents = function () {
    if (typeof InputEvent._touchAvailabile == "undefined") {
        if ('ontouchstart' in document.documentElement) {
            InputEvent._touchAvailabile = true;
            InputEvent._pressEvent = "touchstart";
            InputEvent._releaseEvent = "touchend";
            InputEvent._moveEvent = "touchmove";
            InputEvent._resizeEvent = "orientationchange";
        } else {
            InputEvent._touchAvailabile = false;
            InputEvent._pressEvent = "mousedown";
            InputEvent._releaseEvent = "mouseup";
            InputEvent._moveEvent = "mousemove";
            InputEvent._resizeEvent = "resize";
        }
    }
};

InputEvent.RESIZE = function () {
    InputEvent._configTouchEvents();
    return InputEvent._resizeEvent;
};
InputEvent.PRESS = function () {
    InputEvent._configTouchEvents();
    return InputEvent._pressEvent;
};
InputEvent.RELEASE = function () {
    InputEvent._configTouchEvents();
    return InputEvent._releaseEvent;
};
InputEvent.MOVE = function () {
    InputEvent._configTouchEvents();
    return InputEvent._moveEvent;
};
InputEvent.touchAvailabile = function () {
    InputEvent._configTouchEvents();
    return InputEvent._touchAvailabile;
}
InputEvent.pageX = function (e) {
    return InputEvent.originalEvent(e).pageX;
}
InputEvent.pageY = function (e) {
    return InputEvent.originalEvent(e).pageY;
}
InputEvent.originalEvent = function (e) {
    var oe = e.originalEvent;
    if (oe.touches) {
        if (oe.touches[0])
            oe = oe.touches[0];
        else
            oe = {};
    }
    return oe;
};




