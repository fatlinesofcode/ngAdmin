/*
 <!--
 min-width: 320px  // smartphones, iPhone, portrait 480x320 phones
 min-width: 481px  // portrait e-readers (Nook/Kindle), smaller tablets @ 600 or @ 640 wide.
 min-width: 641px  // portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 and 854x480 phones
 min-width: 961px  // tablet, landscape iPad, lo-res laptops ands desktops
 min-width: 1025px // big landscape tablets, laptops, and desktops
 min-width: 1281px // hi-res laptops and desktops
 -->
 */
function _BrowserManager() {
    var tabletWidth = 768;
    var a = navigator.userAgent.toLowerCase();
    this.detect = function (c) {
        for (var b = 0; b < c.length; b++) {
            if (a.indexOf(c[b]) != -1) {
                return true
            }
        }
        return false
    };
    this.mobile = this.detect(["mobile", "ipad", "iphone", "android", "blackberry", "webos", "windows phone", "wp7", "silk"]);
    this.tablet = this.detect(["ipad", "playbook", "touchpad"]) || (this.detect(["android"]) && screen.width >= tabletWidth);
    this.old = this.detect(["msie 6", "msie 7", "msie 8", "firefox/3", "safari 3"])
    this.filterSupport = true;
    if(this.detect(["safari"])){
        this.name = "safari";
        var b = String(a.match(/version\/[0-9.]+/));
        this.version = parseFloat(b.match(/[0-9\.]+/));
        if(this.version < 5.2)
        this.filterSupport=false;
    }

    if(this.detect(["firefox"])){
        this.name = "firefox";
        var b = String(a.match(/firefox\/[0-9.]+/));
        this.version = parseFloat(b.match(/[0-9\.]+/));
        if(this.version < 4)
            this.filterSupport=false;
    }
    if(/chrome/.test(a)){
        this.name = "chrome";
        this.version = parseFloat(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)[2])
        if(this.version < 18)
            this.filterSupport=false;
    }
    if(this.detect(["msie"])){
        this.name = "ie";
        this.version = 6;
        this.filterSupport=true;
    }
    //alert(this.name+" :"+this.version+" "+this.filterSupport)
    //

}
var _browser = null;
function Browser() {
    _browser = _browser || new _BrowserManager()
    return _browser;
}