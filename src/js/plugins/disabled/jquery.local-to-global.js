// I translate the coordiantes from a global context to
// a local context.
$.transformPosition = function (context) {
    var parts = context.css('transform').match(/[0-9]+(?:\.[0-9]*)?px/)
    return({
        x:parseInt(parts[0]),
        y:parseInt(parts[1])
    });
}
$.globalToLocal = function (context, globalX, globalY) {
    // Get the position of the context element.
    var position = context.offset();

    // Return the X/Y in the local context.
    return({
        x:~~(globalX - position.left),
        y:~~(globalY - position.top)
    });
};


// I translate the coordinates from a local context to
// a global context.
jQuery.localToGlobal = function (context, localX, localY) {
    // Get the position of the context element.
    var position = context.offset();

    // Return the X/Y in the local context.
    return({
        x:~~(localX + position.left),
        y:~~(localY + position.top)
    });
};


// -------------------------------------------------- //
// -------------------------------------------------- //


// I am the FN version of the global to local function.
$.fn.transformPosition = function () {
    return(
            $.transformPosition(
                    this.first()
            )
            );
}
$.fn.globalToLocal = function (globalX, globalY) {
    return(
            $.globalToLocal(
                    this.first(),
                    globalX,
                    globalY
            )
            );
};


// I am the FN version of the local to global function.
$.fn.localToGlobal = function (localX, localY) {
    return(
            $.localToGlobal(
                    this.first(),
                    localX,
                    localY
            )
            );
};