function getAverageColour(img, canvas) {
    var width, height;
    canvas == null ? document.createElement('canvas') : canvas;
    height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
    canvas.getContext('2d').drawImage(img, 0, 0);

    return getCanvasAverageColour(canvas, width, height)
}
function getCanvasAverageColour(canvas, width, height) {
    var context, data, r, g, b, len, color = {r:0, g:0, b:0};
    r = g = b = 0;
    context = canvas.getContext('2d')
    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        alert('security error, img on diff domain? ' + e);
        return color;
    }
    len = data.data.length;
    for (var i = 0; i < len; i += 4) {
        r += data.data[i];
        g += data.data[i + 1];
        b += data.data[i + 2];
    }
    len /= 4;
    color.r = ~~(r / len);
    color.g = ~~(g / len);
    color.b = ~~(b / len);
    return color;
}
function getCanvasPixelColors(canvas, width, height) {
    var bmp = canvas.getContext('2d').getImageData(0, 0, width, height);
    var pixels = bmp.data;
    var colors = [];
    var i = 0;
    for (i = 0; i < pixels.length; i += 4) {
        colors[i / 4] = {r:pixels[i], g:pixels[i + 1], b:pixels[i + 2], a:pixels[i + 3]};
    }
    return colors;
}
function similarColor(rgb1, rgb2, tolerance) {
    tolerance == null ? tolerance = 0.01 : tolerance

    tolerance = tolerance * ( 255 * 255 * 3 ) << 0;

    var distance = 0;

    distance += Math.pow(rgb1.r - rgb2.r, 2);
    distance += Math.pow(rgb1.g - rgb2.g, 2);
    distance += Math.pow(rgb1.b - rgb2.b, 2);

    return distance <= tolerance;
}
function getBlackAndWhiteImage(canvas) {
    var context = canvas.getContext('2d');
    var bmp = context.getImageData(0, 0, canvas.width, canvas.height);
    var pix = bmp.data;
    for (var i = 0, n = pix.length; i < n; i += 4) {
        var grayscale = pix[i  ] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11;
        pix[i  ] = grayscale; 	// red
        pix[i + 1] = grayscale; 	// green
        pix[i + 2] = grayscale; 	// blue
        // alpha
    }
    context.putImageData(bmp, 0, 0);
}
function createCanvas(img) {
    var width, height, canvas;
    canvas = document.createElement('canvas');
    height = canvas.height = img.naturalHeight || img.offsetHeight || img.height;
    width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;
    canvas.getContext('2d').drawImage(img, 0, 0);

    return canvas;//getCanvasAverageColour(canvas, width, height)
}
function getCanvasData(canvas) {
    return canvas.toDataURL('image/png')

}