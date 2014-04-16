/*
 * fieldSort(myArr, 'width');
 */
var fieldSort = function (arr, fieldname) {
    arr.sort(function (a, b) {
        return parseInt(a[fieldname]) - parseInt(b[fieldname]);
    });
    return arr;
}
var randSort = function (arr) {
    arr.sort(function() {return 0.5 - Math.random()})
    return arr;
}