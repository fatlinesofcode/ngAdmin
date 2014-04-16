app.filter('titlecase', function () {
    return function (src) {
        log("3","filter",src, "");
        var str = src.replace("_", " ");
        return str.substr(0,1).toUpperCase()+""+str.substr(1)
    }
});
app.filter('maxChars', function () {
    return function (src, maxlength) {
        if(src.length > maxlength)
        return src.substr(0,maxlength)+"...";
        else
        return src;
    }
});

app.filter('dateformat', ['$filter', 'CmsConfig', function ($filter, CmsConfig) {
    return function(text){
        if(!text)return "";
        var  tempdate= new Date(text.replace(/-/g,"/"));
        return $filter('date')(tempdate, CmsConfig.dateFormat);
    }
}]);
