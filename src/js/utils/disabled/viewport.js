var _viewport = null;
var viewport = function () {
    if (!_viewport) {
        _viewport = {};
        $(window).bind(InputEvent.RESIZE(), function () {
            _viewport.height = null;
        })
    }
    if (!_viewport.height) {
        var headerheight = 64;
        var footerheight = 34;
        _viewport.width = parseInt($("#content-wrapper").width())
        _viewport.height = parseInt($("#content-wrapper").height()) - (headerheight + footerheight)
        _viewport.minHeight = 816;
        _viewport.headerheight = headerheight;
        _viewport.footerheight = footerheight;
    }
    return _viewport;
}