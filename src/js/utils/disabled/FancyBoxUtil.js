

var setupFancyBox = function () {
    $(".fancybox").fancybox({
        maxWidth:881,
        maxHeight:609,
        fitToView:false,
        width:881,
        height:609,
        padding:0,
        autoSize:false,
        closeClick:false,
        openEffect:'none',
        closeEffect:'none',
        prevEffect:'fade',
        nextEffect:'fade',
        // nextMethod	: 'step',
        nextClick:false,
        wrapCSS:'fancyProduct'
    });
}

$(document).ready(setupFancyBox);