app.directive('ngFileReaderImage', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        priority: 1,
        // replace:true,
        //  require: ['ngModel'],
        scope: {
            base64data: '=ngFileReaderImage',
            filename: '=',
        },
        template: '<div  class="preview"><img ng-src="{{image.src}}" /></div> <input type="file" class="imageLoader" name="imageLoader" accept="image/*"/>',
        link: function (scope, element, attrs) {
            //  log("ngFileReaderImage", "link", "", "");
            //  scope.value = attrs.ngFileReaderImage;
            // scope.image = {};

            // scope.image = scope.base64data;

            var filenameWatch;


            var init = function () {
                filenameWatch = scope.$watch('filename', onFilenameChange);
                fileinput.bind('change', onFileReaderImageSelect);
            }


            var RESIZE_WIDTH = attrs.resizeWidth || 320;
            var RESIZE_HEIGHT = attrs.resizeHeight || 240;
            var RESIZE_QUALITY = attrs.resizeQuality || 80;

            var fileinput = element.find("input[type='file']");

            /*
             * Load a an image via the Filereader api.
             * Resample using canvasResize plugin to avoid IOS squash and orientation bugs
             */
            var onFileReaderImageSelect = function (e) {
                scope.processing = (true);
                //  return;
                var file = e.target.files[0];
                log("49", "onFileReaderImageSelect", "file resizeWidth", attrs.resizeWidth, scope.$eval(attrs.resizeWidth));
                var reader = new FileReader();
                reader.onloadend = function (e) {
                    var raw = e.target.result;

                    canvasResize(file, {
                        width: RESIZE_WIDTH || raw.width,
                        height: RESIZE_HEIGHT || raw.height,
                        crop: false,
                        quality: RESIZE_QUALITY,
                        callback: function (data, width, height) {
                            var img = new Image();
                            img.onload = function () {
                                onResizeComplete(img);
                            }
                            img.src = data;
                        }
                    });
                }
                reader.readAsDataURL(file);
            }

            scope.fileReaderImageSelect = function () {
                log("37", "scope", "fileReaderImageSelect", "", element);
                var allowed = confirm("This feature would like to access your photos");
                if (allowed)
                    fileinput.click();
            }
            var onResizeComplete = function (img) {
                scope.$apply(function () {
                    scope.image = img;
                    scope.base64data = img.src;
                //    log("59", "onResizeComplete", "onResizeComplete", img);
                })
            }

            var getBase64Data = function (img) {
                return img.src.substr(img.src.indexOf(',') + 1).toString();
            }
            var onFilenameChange = function () {
                log("83","onFilenameChange","onFilenameChange", "");
                if (scope.filename && !scope.image) {
                    var img = new Image();
                    img.onload = function () {
                        scope.$apply(function () {
                            filenameWatch(); // un watch
                            scope.image = img;
                        })
                    }
                    img.src = app.AppConfig.uploadPath + scope.filename;
                }
            }

            init();

        }
    }
}]);