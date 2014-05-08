<?php
date_default_timezone_set('Australia/Melbourne');

//error_reporting(E_ALL);
//ini_set("display_errors", 1);

class AppConfig{
        public static $facebook_app_id;
        public static $devmode;
        public static $APP_URL;
        public static $deviceType;
        public static $deviceVersion;
        public static $db_dsn ='sqlite:/';
        public static $db_user='root';
        public static $db_pass='root';
        public static $admin_user='admin';
        public static $admin_password='admin';
        public static $debugClass='';
        public static $uploadPath='../../uploads/';
    }

AppConfig::$db_dsn ='sqlite:'.__DIR__.'/../../../sql/angularcms.sqlite';




?>