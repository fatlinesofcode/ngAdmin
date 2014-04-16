window.log = function f() {
    log.history = log.history || [];
    log.history.push(arguments);
    if (this.console) {
        var args = arguments, newarr;
        args.callee = args.callee.caller;
        newarr = [].slice.call(args);

        if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr);
    }
};
window.plog = function h() {
    var args = arguments;
    var str = ""//args.join(", ");
    for (var i = 0; i < args.length; i++) {
        str += i + " " + args[i] + ", ";

    }
    if($("#debug")){
        $("#debug").text(str);
    }else
        console.log("plog: "+str);
};

window.echo = function g() {
    var args = arguments;
    var str = ""//args.join(", ");
    for (var i = 0; i < args.length; i++) {
        str += i + " " + args[i] + ", ";

    }
    alert(str);
};
(function (a) {
    function b() {}

    for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop());) {a[d] = a[d] || b;}
})
        (function () {
            try {
                console.log();
                return window.console;
            } catch (a) {return (window.console = {});}
        }());




