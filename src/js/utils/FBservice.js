/*
 document.getElementById('fb-login-status').onclick = function() {
 FB.getLoginStatus(function(response) {
 Log.info('FB.getLoginStatus callback', response);
 });
 };


 FB.Event.subscribe('auth.login', function(response) {
 Log.info('auth.login event handler', response);
 });
 FB.Event.subscribe('auth.logout', function(response) {
 Log.info('auth.logout event handler', response);
 });
 FB.Event.subscribe('auth.statusChange', function(response) {
 Log.info('auth.statusChange event handler', response);
 });
 FB.Event.subscribe('auth.authResponseChange', function(response) {
 Log.info('auth.authResponseChange event handler', response);
 });

 document.getElementById('fb-permissions').onclick = function() {
 FB.login(
 function(response) {
 Log.info('FB.login with permissions callback', response);
 },
 { scope: 'publish_actions' }
 );
 };
 */

var FBservice = function () {
    var self = this;
    self.debugMode = false;
    self.initialized = false;
    self.connected = false;
    self.userID = null;
    self.accessToken = null;
    self.signedRequest = null;
    self.userProfile = null;
    self.premissions = '';
    self.useImageProxy = false;
    self.imageProxyUrl = Config.ROOT_PATH + "photo/facebook/";


    self.init = function (onCompleteCallback) {
        log("44", "FBservice", "init", "");
        if (!window.fbApiInitialized) {
            setTimeout(function () {
                self.init(onCompleteCallback);
            }, 50);
        } else { // complete
            self.initialized = true;
            if (onCompleteCallback) {
                onCompleteCallback();
            }
            addListeners();
        }
    }
    var addListeners = function () {
        FB.Event.subscribe('auth.login', function (response) {
            log('auth.login event handler', response);
        });
        FB.Event.subscribe('auth.logout', function (response) {
            log('auth.logout event handler', response);
        });
        FB.Event.subscribe('auth.statusChange', function (response) {
            log('auth.statusChange event handler', response);
        });
        FB.Event.subscribe('auth.authResponseChange', function (response) {
            log('auth.authResponseChange event handler', response);
        });
    }


    self.loginCheck = function (callback) {
        self.getLoginStatus(function () {
            if (self.userID) {
                callback();
            } else {
                self.login(callback);
            }
        })
    }
    self.checkPageLike = function (user_id, page_id, callback) {
        callback = callback || function () {};
        //  var user_id = response.session.uid;
        // var page_id = "40796308305"; //coca cola
        var fql_query = "SELECT uid FROM page_fan WHERE page_id = " + page_id + " and uid=" + user_id;

        log("88", "FBservice", "checkPageLike", fql_query);
        var the_query = FB.Data.query(fql_query);

        the_query.wait(function (rows) {
            log("91", "FBservice", "rows", rows);
            if (rows.length == 1 && rows[0].uid == user_id) {
                log("93", "FBservice", "checkPageLike", 'liked');
                callback(true)
            } else {
                log("93", "FBservice", "checkPageLike", 'not liked');
                callback(false)
            }
        });


    }

    self.checkPageLike2 = function (page_id) {
        FB.login(function (response) {
            if (response.session) {

                var user_id = response.session.uid;
                // var page_id = "40796308305"; //coca cola
                var fql_query = "SELECT uid FROM page_fan WHERE target_id = " + page_id + "and uid=" + user_id;
                var the_query = FB.Data.query(fql_query);

                the_query.wait(function (rows) {
                    log("91", "FBservice", "rows", rows);
                    if (rows.length == 1 && rows[0].uid == user_id) {
                        log("93", "FBservice", "checkPageLike", 'liked');
                    } else {
                        log("93", "FBservice", "checkPageLike", 'not liked');
                    }
                });


            } else {
                // user is not logged in
            }
        });
    }

    self.getLoginStatus = function (onCompleteCallback) {
        FB.getLoginStatus(function (response) {
            switch (response.status) {
            case "not_authorized":
                self.connected = false;
                break;
            case "connected":
                self.connected = true;
                self.userID = response.authResponse.userID;
                self.accessToken = response.authResponse.accessToken;
                self.signedRequest = response.authResponse.signedRequest;
                break;
            default:
                break;
            }

            onCompleteCallback(response)
        });
    }
    self.login = function (onCompleteCallback) {
        FB.login(
                function (response) {
                    echo('FB.login with permissions callback', response);
                    onCompleteCallback(response)
                },
                { scope: self.premissions }
        );

    }
    self.loadProfile = function (onCompleteCallback, onErrorCallback) {
        return self.loadUserProfile("me", onCompleteCallback, onErrorCallback);
    };
    /*
     {
     "id": "100000778309018",
     "name": "Phil McDevin",
     "first_name": "Phil",
     "last_name": "McDevin",
     "link": "http://www.facebook.com/phil.mcdevin",
     "username": "phil.mcdevin",
     "gender": "male",
     "timezone": 10,
     "locale": "en_GB",
     "verified": true,
     "updated_time": "2012-06-26T02:17:43+0000"
     }
     */
    self.loadUserProfile = function (userID, onCompleteCallback, onErrorCallback) {
        userID = userID || "me";

        FB.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                FB.api('/' + userID, function (response) {
                    response.photos = {};
                    response.photos.square = self.getPhotoUrl(response.id, 'square')
                    response.photos.small = self.getPhotoUrl(response.id, 'small')
                    response.photos.normal = self.getPhotoUrl(response.id, 'normal')
                    response.photos.large = self.getPhotoUrl(response.id, 'large')
                    if (userID == "me") {
                        self.userProfile = response;
                    }
                    onCompleteCallback(response);
                });
            } else {
                onErrorCallback();
            }
        });



    }

    self.checkConnected = function (onSuccessCallback, onErrorCallback) {
        FB.getLoginStatus(function (response) {
            if (response.status == 'connected') {
                onSuccessCallback();
            } else {
                onErrorCallback();
            }
        });

    }

    self.loadFriends = function (onCompleteCallback, onErrorCallback) {
        self.checkConnected(function(){
            FB.api({ method: 'friends.get' }, function (response) {
                echo('friends.get response', response);
                onCompleteCallback(response)
            })
        }, onErrorCallback)

    }
    self.wallpost = function (options) {
        return self.postDialog(options);
    }
    self.postDialog = function (options) {
        options = options || {};
        options.from = options.from || null;
        options.to = options.to || null;
        options.name = options.name || null;
        options.link = options.link || null;
        options.picture = options.picture || null;
        options.caption = options.caption || " ";
        options.description = options.description || null;
        options.message = options.message || null;
        options.callback = options.callback || function () {};

        FB.ui(
                {
                    method: 'feed',
                    to: options.to,
                    from: options.from,
                    name: options.name,
                    link: options.link,
                    picture: options.picture,
                    caption: options.caption,
                    description: options.description,
                    message: options.message
                }, options.callback);
        return;

        var publish = {
            method: 'feed',
            message: 'getting educated about Facebook Connect',
            name: 'Connect',
            to: userID,
            caption: 'The Facebook Connect JavaScript SDK',
            description: (
                    'A small JavaScript library that allows you to harness ' +
                            'the power of Facebook, bringing the user\'s identity, ' +
                            'social graph and distribution power to your site.'
                    ),
            link: 'http://www.fbrell.com/',
            picture: 'http://www.fbrell.com/public/f8.jpg',
            actions: [
                { name: 'fbrell', link: 'http://www.fbrell.com/' }
            ],
            user_message_prompt: 'Share your thoughts about RELL'
        };

        FB.ui(publish, Log.info.bind('feed callback'));
    }
    /*
     types
     square (50x50),
     small (50 pixels wide, variable height),
     normal (100 pixels wide, variable height)
     large (about 200 pixels wide, variable height):
     */
    self.getPhotoUrl = function (userID, type) {
        type = type || "square";
        if (self.useImageProxy)
            return self.imageProxyUrl + userID + "/" + type
        else
            return "http://graph.facebook.com/" + userID + "/picture?type=" + type;
    }
    var checkInitialized = function () {
        if (!self.initialized) {
            throw new Error("FBservice not initialized")
            return false;
        } else
            return true;
    }
    /* var checkConnected = function () {
     if (!self.connected) {
     throw new Error("FBservice not connected/logged")
     return false;
     } else
     return true;
     } */
    var echo = function () {
        if (self.debugMode) {
            log("FBservice", arguments)
        }
    }

    self.loadPhotos = function (fid, callback, loadOtherAlbums, token) {
        if (!fid) {
            alert('getPhotoList Error: no facebook id');
        }
        if (loadOtherAlbums == null) {
            loadOtherAlbums = false;
        }
        var photos = []
        var numOfAlbums = 0;
        var maxNumOfAlbums = 10;
        var albumIndex = 0;
        var firstAlbum = "Profile Pictures"
        var getAlbumId = function () {
            var query = ""
            if (token) {
                query += "?access_token=" + token
            }

            FB.api('/' + fid + '/albums' + query, function (response) {
                if (!response || response.error) {
                    echo('getPhotoList albums errors: ' + fid + " " + response);
                } else {
                    if (!response.data || response.data.length == 0) {
                        echo('getPhotoList albums are empty');
                        if (response.data.length == 0) {
                            getProfileAsAlbum(fid);
                        }
                    }

                    for (var i = 0; i < response.data.length; i++) {
                        if (response.data[i].name == firstAlbum) {
                            getPhotos(response.data[i].id)
                        }
                    }
                    if (loadOtherAlbums) {
                        numOfAlbums = Math.min(maxNumOfAlbums, response.data.length);

                        var i = 0;
                        var loadNextAlbum = function () {
                            log("258", "getAlbumId", "loadNextAlbum", i, numOfAlbums);
                            if (response.data[i].name != firstAlbum) {
                                getPhotos(response.data[i].id);
                            }
                            i++;
                            if (i < numOfAlbums) {
                                setTimeout(loadNextAlbum, 50);
                            }
                        }
                        // wait for profile album to load
                        setTimeout(loadNextAlbum, 500);

                    }

                }
            });
        };
        var getPhotos = function (albumId) {

            FB.api('/' + albumId + '/photos', function (response) {
                if (!response || response.error) {
                    echo('getPhotoList getPhotos errors: ' + response);
                } else {
                    for (var i = 0; i < response.data.length; i++) {
                        photos.push(response.data[i].source)
                    }
                    albumIndex++;
                    if (albumIndex >= numOfAlbums)
                        callback(photos)

                }
            });

        }
        var getProfileAsAlbum = function (fid) {
            callback([ "http://graph.facebook.com/" + fid + "/picture?type=large"]);
        }

        getAlbumId(fid);

    }


    return self;
}