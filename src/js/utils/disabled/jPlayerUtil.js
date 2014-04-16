var createJPlayer = function () {
    log("3", "createJPlayer", "createJPlayer", "");
    var elm = document.createElement('div');
    elm.id = "jPlayer";
    $(elm).css({height:0, width:0, display:'inline'})

    $("body").append($(elm));

    updateJPlayer()
}
var getJPlayer = function() {
}
var updateJPlayer = function () {
    var _selected;
    var _jPlayer = "#jPlayer";
    var _jPlayLink = ".audioLink";
    $(_jPlayer).jPlayer({
        swfPath:"http://www.jplayer.org/latest/js/Jplayer.swf",
        supplied:"mp3"
    });



    $(_jPlayLink).click(function (e) {
        $(_jPlayLink).find('.label').text("Play");
        if ((e.currentTarget) != _selected) {
            console.log("20", "", "", _selected);
            _selected = (e.currentTarget);
            $(_selected).find('.label').text("Pause");
            $(_jPlayer).jPlayer("setMedia", {
                mp3:this.href
            }).jPlayer("play");
        } else {

            _selected = false;
            $(_jPlayer).jPlayer().jPlayer("stop");
        }

        e.preventDefault();
    });
};
var playUrl = function(url) {
    log("43","playUrl","url", url);
    var _jPlayer = "#jPlayer";
    $(_jPlayer).jPlayer({
        swfPath:"http://www.jplayer.org/latest/js/Jplayer.swf",
        supplied:"mp3"
    });
    $(_jPlayer).jPlayer("setMedia", {
        mp3:url
    }).jPlayer("play");
}
//$(document).ready(createJPlayer);