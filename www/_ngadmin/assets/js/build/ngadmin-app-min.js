var app=angular.module("ngAdmin",["ngRoute","ngAnimate","ngResource","ngCookies","ui.bootstrap"]);app.config(["$locationProvider",function(a){a.html5Mode(!1).hashPrefix("!")}]),deferredBootstrapper.bootstrap({element:document,module:"ngAdmin",resolve:{CmsConfig:function(a){return a.get("./assets/config.json")}}}),function(a){function b(){throw"Static Class. AppConfig cannot be instantiated."}var c=b;c.templatePath="./",c.testMode=!1,c.uploadPath="../uploads/",a.AppConfig=b}(app=app||{});var app;app.filter("titlecase",function(){return function(a){log("3","filter",a,"");var b=a.replace("_"," ");return b.substr(0,1).toUpperCase()+""+b.substr(1)}}),app.filter("maxChars",function(){return function(a,b){return a.length>b?a.substr(0,b)+"...":a}}),app.filter("dateformat",["$filter","CmsConfig",function(a,b){return function(c){if(!c)return"";var d=new Date(c.replace(/-/g,"/"));return a("date")(d,b.dateFormat)}}]);var $defer,loaded=!1;app.run(["$q","$timeout",function(a,b){function c(){"loaded"==CKEDITOR.status?(loaded=!0,$defer.resolve()):c()}if($defer=a.defer(),angular.isUndefined(CKEDITOR))throw new Error("CKEDITOR not found");CKEDITOR.disableAutoInline=!0,CKEDITOR.on("loaded",c),b(c,100)}]),app.directive("ngCkeditor",["$timeout","$q",function(a,b){"use strict";return{restrict:"AC",require:["ngModel","^?form"],scope:!1,link:function(c,d,e,f){var g=f[0],h=f[1]||null,i="<p></p>",j="textarea"==d[0].tagName.toLowerCase(),k=[],l=!1;j||d.attr("contenteditable",!0);var m=function(){var f={toolbar:"full",toolbar_full:[{name:"basicstyles",items:["Bold","Italic","Strike","Underline"]},{name:"paragraph",items:["BulletedList","NumberedList","Blockquote"]},{name:"editing",items:["JustifyLeft","JustifyCenter","JustifyRight","JustifyBlock"]},{name:"links",items:["Link","Unlink","Anchor"]},{name:"tools",items:["SpellChecker","Maximize"]},"/",{name:"styles",items:["Format","FontSize","TextColor","PasteText","PasteFromWord","RemoveFormat"]},{name:"insert",items:["Image","Table","SpecialChar"]},{name:"forms",items:["Outdent","Indent"]},{name:"clipboard",items:["Undo","Redo"]},{name:"document",items:["PageBreak","Source"]}],disableNativeSpellChecker:!1,enterMode:CKEDITOR.ENTER_BR,uiColor:"#FAFAFA",height:"400px",width:"100%"};f=angular.extend(f,c[e.ngCkeditor]);var m=j?CKEDITOR.replace(d[0],f):CKEDITOR.inline(d[0],f),n=b.defer();d.bind("$destroy",function(){m.destroy(!1)});var o=function(b){var c=m.getData();c==i&&(c=null),a(function(){g.$setViewValue(c),b===!0&&h&&h.$setPristine()},0)},p=function(a){if(k.length){var b=k.pop()||i;l=!1,m.setData(b,function(){o(a),l=!0})}};m.on("change",o),m.on("blur",o),m.on("key",o),m.on("instanceReady",function(){c.$apply(function(){p(!0)})}),m.on("customConfigLoaded",function(){n.resolve()}),g.$render=function(){void 0===g.$viewValue&&(g.$setViewValue(null),g.$viewValue=null),k.push(g.$viewValue),l&&p()}};"loaded"==CKEDITOR.status&&(loaded=!0),loaded?m():$defer.promise.then(m)}}}]),app.directive("ngFileReaderImage",["$timeout",function(){return{restrict:"A",priority:1,scope:{base64data:"=ngFileReaderImage",filename:"="},template:'<div  class="preview"><img ng-src="{{image.src}}" /></div> <input type="file" class="imageLoader" name="imageLoader" accept="image/*"/>',link:function(a,b,c){var d,e=function(){d=a.$watch("filename",l),i.bind("change",j)},f=c.resizeWidth||320,g=c.resizeHeight||240,h=c.resizeQuality||80,i=b.find("input[type='file']"),j=function(b){a.processing=!0;var d=b.target.files[0];log("49","onFileReaderImageSelect","file resizeWidth",c.resizeWidth,a.$eval(c.resizeWidth));var e=new FileReader;e.onloadend=function(a){var b=a.target.result;canvasResize(d,{width:f||b.width,height:g||b.height,crop:!1,quality:h,callback:function(a){var b=new Image;b.onload=function(){k(b)},b.src=a}})},e.readAsDataURL(d)};a.fileReaderImageSelect=function(){log("37","scope","fileReaderImageSelect","",b);var a=confirm("This feature would like to access your photos");a&&i.click()};var k=function(b){a.$apply(function(){a.image=b,a.base64data=b.src})},l=function(){if(log("83","onFilenameChange","onFilenameChange",""),a.filename&&!a.image){var b=new Image;b.onload=function(){a.$apply(function(){d(),a.image=b})},b.src=app.AppConfig.uploadPath+a.filename}};e()}}}]),app.directive("ngInputName",["$timeout","$parse","$compile",function(){return{restrict:"A",link:function(a,b,c){a.$eval(c.ngInputName)}}}]),app.directive("ngSvgLoading",["$timeout",function(){return{restrict:"A",template:'<ng-include src="path"></ng-include>',link:function(a,b,c){a.path="assets/img/loading-"+c.ngSvgLoading+".svg"}}}]),app.Routes=[],app.Routes.push({name:"home"}),app.Routes.push({name:"edit"}),app.Routes.push({name:"login"}),app.Routes.push({name:"edit",url:"edit/:table/:id",templateUrl:app.AppConfig.templatePath+"edit.tpl.html"}),app.Routes.push({name:"list",url:"list/:table",templateUrl:app.AppConfig.templatePath+"list.tpl.html"}),app.config(["$routeProvider",function(a){for(var b in app.Routes){var c=app.Routes[b];c.url=c.url||c.name,c.title=c.title||c.name,c.templateUrl=c.templateUrl||app.AppConfig.templatePath+c.url.replace("/","-")+".tpl.html",c.controller=c.controller||c.name.charAt(0).toUpperCase()+c.name.substr(1).toLowerCase()+"Controller",a.when("/"+c.url,{templateUrl:c.templateUrl,controller:c.controller})}a.otherwise({redirectTo:"/login"})}]),app.factory("routeService",["$timeout","$location",function(a,b){var c={};return c.redirectTo=function(c){c=angular.isArray(c)?c:[c];var d="";c&&(d=c.length>0?c.join("/"):""),a(function(){b.path(d)})},c.currentPath=function(){var a=b.path().replace("/","");return a=a.split("/")},c.getRoutePosition=function(a){var b=0;for(var c in app.Routes){if(app.Routes[c].url==a)return b;b++}return-1},c.currentRoute=function(){var a=b.path().replace("/","");return a=a.split("/")[0],""==a&&(a="home"),a},c}]),app.factory("apiService",["$resource","$cookieStore","CmsConfig","$http",function(a,b,c,d){service=null;var e=service;e={};var f,g="./include/api.php/:action/:task/:table/:id";f=a(g,{},{post:{method:"post"},put:{method:"put"}}),e.loggedin=!1,e.initialize=function(){e.setAuthToken(b.get("AuthToken"))},e.resource=function(){return f},e.delete=function(a,b,c){return e.call("delete",a,null,b,c)},e.retrieve=function(a,b,c){return e.call("get",a,null,b,c)},e.update=function(a,b,c,d){return e.call("put",a,b,c,d)},e.create=function(a,b,c,d){return e.call("save",a,b,c,d)},e.post=function(a,b,c,d){return e.call("post",a,b,c,d)},e.call=function(a,b,c,d,g){g=g||h,d=d||function(){},b.action=b.action||"records";var i=function(a){a.error?h(a):e.loggedin=!0,d(a)},j=function(a){g(a)};return"get"==a||"delete"==a?f[a](b,i,j):f[a](b,c,i,j)};var h=function(a){var b="";a&&(a.status&&(b+="\nStatus: "+a.status),a.error&&(b+="\nError: "+a.error),a.data&&(b+=a.data.error?"\nError: "+a.data.error:"\nData: "+a.data)),alert("Oops...\nan error occurred communicating with the API."+b)};return e.logout=function(){e.loggedin=!1,e.setAuthToken(null)},e.login=function(a,b){a=angular.copy(a),a.password&&(a.password=MD5(a.password)),e.post({action:"login"},a,function(a){e.loggedin=a.result,e.setAuthToken(a.token),b(a)})},e.setAuthToken=function(a){b.put("AuthToken",a),d.defaults.headers.common.Authorization=a},e.initialize(),e}]),app.factory("eventService",["$rootScope","$timeout",function(a,b){service=null;var c=service;return c={},c.initialize=function(){},c.broadcast=function(c,d,e){log("--","eventService","broadcast",c,d);var f=function(){a.$broadcast(c,d)};e?b(f,50):f()},c.emit=function(c,d,e){log("--","eventService","emit",c,d);var f=function(){a.$emit(c,d)};e?b(f,50):f()},c.on=function(b,c){a.$on(b,c)},c.initialize(),c}]),app.controller("AppController",["$scope","$timeout","$rootScope","routeService","eventService","$routeParams","apiService","$cookieStore","CmsConfig","$modal",function(a,b,c,d,e,f,g,h,i,j){var k=this;k=a,k.pageClass="",k.debug=$("body").hasClass("debug-enabled"),k.sidebarCollapsed=!0,c.doctitle="";var l;k.initialize=function(){log("8","AppController","initialize","",d.currentRoute()),k.config=i,m(!0)};var m=function(){k.$on("$destroy",n),k.$on("$routeChangeStart",q),k.$on("$routeChangeSuccess",p),k.$on("$viewContentLoaded",o)},n=function(){m(!1)},o=function(){},p=function(){k.pageClass=d.currentRoute()};k.refresh=function(){b(function(){})},k.redirectTo=function(a){d.redirectTo(a)},k.runTest=function(a){e.emit(AppEvent.RUN_TEST,a)},k.setTitle=function(a,b){k.currenttable=a,k.title=angular.isArray(b)?b.join(" / "):"",c.doctitle=k.config.sitetitle,k.currenttable&&(c.doctitle+=" | "+k.currenttable),k.title&&(c.doctitle+=" | "+k.title)};var q=function(a,b,c){var e=0,f=0;b&&c&&(b.originalPath&&(e=d.getRoutePosition(b.originalPath.replace("/",""))),c.originalPath&&(f=d.getRoutePosition(c.originalPath.replace("/","")))),k.viewAnimationDirection=0>f?"direction-left":f>e?"direction-right":"direction-left"};return k.isLoggedIn=function(){return g.loggedin},k.openModal=function(a,b,c){return a=a||"Modal header",b=b||"Modal message",c=c||"",l&&l.dismiss(),l=j.open({templateUrl:"warningModal.html",controller:"ModalInstanceController",size:c,resolve:{data:function(){return{header:a,message:b}}}}),l.result.then(function(){l=null},function(){l=null}),l},k.initialize(),k}]),app.controller("SidebarController",["$scope","CmsConfig",function(a,b){var c=this;c=a,c.initialize=function(){c.tables=b.tables,d(!0)};var d=function(a){a&&c.$on("$destroy",e)},e=function(){d(!1)};return c.initialize(),c}]),app.controller("ModalInstanceController",["$scope","$modalInstance","data",function(a,b,c){var d=this;return d=a,d.initialize=function(){},d.data=c,d.ok=function(){b.close(!0)},d.cancel=function(){b.dismiss("cancel")},d.initialize(),d}]),app.controller("EditController",["$scope","$routeParams","apiService","routeService","CmsConfig","$modal","$timeout",function(a,b,c,d,e){var f=this;f=a,f.formdata=null,f.image={},f.state="",f.alerts=[],f.processing=!1;var g=null;f.initialize=function(){f.table=b.table,f.id=b.id,f.fields=e.tables[f.table].editfields,f.setTitle(f.table,["edit"]),f.ckeditorOptions={height:"150px",format_tags:"h3;div;p",toolbar_full:[{name:"basicstyles",items:["Bold","Italic","Underline"]},{name:"paragraph",items:["BulletedList","NumberedList"]},{name:"editing",items:["JustifyLeft","JustifyCenter","JustifyRight"]},{name:"styles",items:["PasteText","PasteFromWord","RemoveFormat"]},{name:"formatting",items:["Outdent","Indent","Format","Source"]}]},log("11","EditController","initialize",b.table),f.id&&j(),h(!0)};var h=function(a){a&&f.$on("$destroy",i)},i=function(){h(!1)};f.setImage=function(){log("51","EditController","setImage","")},f.save=function(a){if(log("30","EditController","save",a,"valid",f.form),f.state="submitted",!f.form.$invalid){f.processing=!0;var b=function(a){f.state="complete",f.alerts=[{type:"success",msg:"Saved!"}],f.id=a.id,log("80","EditController","save_row",a),j()};"add"==f.id?c.create({table:f.table},a,b):c.update({table:f.table,id:f.id},a,b)}};var j=function(){g=c.retrieve({table:f.table,id:f.id},function(a){f.formdata={};for(var b in a.result)for(var c=0;c<f.fields.length;c++){var d=f.fields[c];d.name==b&&(f.formdata[b]=a.result[b])}f.setTitle(f.table,["edit",f.formdata.title]),f.form.$setPristine(),f.processing=!1})};return f.delete=function(a){var b=f.openModal("Warning","Are you sure you want to delete '"+a+"'?","sm");b.result.then(function(a){a&&(f.processing=!0,c.delete({table:f.table,id:f.id},function(){f.processing=!1,f.redirectTo("list/"+f.table)}))},function(){})},f.cancel=function(){f.redirectTo("list/"+f.table)},f.hello=function(){log("121","EditController","hello","")},f.addAlert=function(){f.alerts.push({msg:"Another alert!"})},f.closeAlert=function(a){f.alerts.splice(a,1)},f.initialize(),f}]),app.controller("ListController",["$scope","$routeParams","apiService","CmsConfig","$timeout",function(a,b,c,d,e){var f=this;f=a;var g=null;f.initialize=function(){f.table=b.table,f.fields=d.tables[f.table].listfields,f.order_by=d.tables[f.table].order_by||d.order_by,f.setTitle(f.table,["list"]),h(),i(!0)};var h=function(){f.processing=!0;for(var a=[],b=0;b<f.fields.length;b++){var d=f.fields[b];a.push(d.name)}var e={table:f.table,fields:angular.toJson(a)};e.order_by=f.order_by,c.retrieve(e,function(a){f.listdata=a.result,f.processing=!1})},i=function(a){a&&f.$on("$destroy",j)},j=function(){i(!1)};return f.toggleActive=function(a){c.update({table:f.table,id:a.id},{active:!a.active},h)},f.delete=function(a,b){var d=f.openModal("Warning","Are you sure you want to delete '"+a+"'?","sm");d.result.then(function(a){a&&c.delete({table:f.table,id:b},h)})},f.onInputChange=function(a,b,d){var i={};i[b]=d,e.cancel(g),g=e(function(){f.processing=!0,c.update({table:f.table,id:a},i,h)},500)},f.initialize(),f}]),app.controller("LoginController",["$scope","$timeout","apiService","routeService","$cookieStore",function(a,b,c,d){var e=this;e=a,e.alerts=[],e.initialize=function(){c.logout(),f(!0)};var f=function(a){a&&e.$on("$destroy",g)},g=function(){f(!1)};return e.save=function(a){return e.alerts=[],e.state="submitted",e.form.$invalid?void(e.alerts=[{type:"danger",msg:"You must enter your username and password."}]):(e.processing=!0,void c.login(a,function(){e.processing=!1,e.form.$setPristine(),log("41","LoginController","",c.loggedin),c.loggedin?d.redirectTo(["home"]):(e.state="invalid",e.alerts=[{type:"danger",msg:"Invalid username or password."}])}))},e.closeAlert=function(a){e.alerts.splice(a,1)},e.initialize(),e}]),app.controller("HomeController",["$scope","$timeout","apiService","CmsConfig",function(a,b,c,d){var e=this;e=a,e.initialize=function(){e.tables=d.tables,e.setTitle(""),f(),g(!0)};var f=function(){var a=[];for(var b in e.tables)a.push(b);c.retrieve({task:"count",tables:angular.toJson(a)},function(a){for(var b in a.result)e.tables[b].count=a.result[b]})},g=function(a){a&&e.$on("$destroy",h)},h=function(){g(!1)};return e.initialize(),e}]);