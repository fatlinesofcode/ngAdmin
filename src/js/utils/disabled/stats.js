var loadStats = function () {
    var script = document.createElement('script');
    script.src = 'http://github.com/mrdoob/stats.js/raw/master/build/Stats.js';
    document.body.appendChild(script);
    script = document.createElement('script');
    script.innerHTML = 'var%20interval=setInterval(function(){if(typeof%20Stats==\'function\'){clearInterval(interval);var%20stats=new%20Stats();stats.domElement.style.position=\'fixed\';stats.domElement.style.left=\'0px\';stats.domElement.style.top=\'0px\';document.body.appendChild(stats.domElement);setInterval(function(){stats.update();},1000/60);}},100);';
    document.body.appendChild(script);
}