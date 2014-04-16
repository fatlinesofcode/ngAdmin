var addCss = function(url){
    var link = $("<link>");
    link.attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: url
    });
    $("head").append(link);
}