<?php
require 'SiteUtils.php';

SiteUtils::$projectname = "_html_template";
AppConfig::$debugClass = htmlentities(isset($_REQUEST['debug']) ? 'debug-enabled' : '', ENT_QUOTES);

class AppConfig{
        public static $facebook_app_id;
        public static $devmode;
        public static $APP_URL;
        public static $deviceType;
        public static $deviceVersion;
        public static $db_dsn ='mysql:dbname=mydb_dev;host=localhost';
        public static $db_user='root';
        public static $db_pass='root';
        public static $debugClass='';
    }

//require 'Mobile_Detect.php';
//$detect = new Mobile_Detect;
//AppConfig::$deviceType = ($detect->isMobile() ? ($detect->isTablet() ? 'tablet' : 'phone') : 'desktop');
//AppConfig::$deviceVersion = $detect->version('iPad') || $detect->version('iPhone') || $detect->version('iPod');


if($_SERVER["SERVER_NAME"] == "localhost" ||
    $_SERVER["SERVER_NAME"] == "phils-imac.local" ){
    AppConfig::$devmode = true;
    AppConfig::$facebook_app_id = '149807978496479';
} else if($_SERVER["SERVER_NAME"] == "srv.re"){
    AppConfig::$facebook_app_id = '375308732539158'; //staging srv
}



SiteUtils::setDevMode(AppConfig::$devmode);


?>