<?php
function getMd5($file){
    $c = md5_file($file);
   // return $file;
    return $file."?md5=".$c;
}
function getJs($folder = "app", $compiled = null)
{
    if(is_null($compiled))$compiled=SiteUtils::$useCompiled;

    $str = "<!-- ".$folder." js ".($compiled? 'build' : 'source')." -->\n";
    $files = array();
    if($compiled){
        array_push($files, SiteUtils::getJsBuild($folder));
    }else{
        $files = SiteUtils::getJsSource($folder);
    }
    foreach($files as $f){
        if($f)
            $str .= script($f);
    }

    return $str;
}
function getJsLib($url, $useLocalLib = null){
    if(is_null($useLocalLib))$useLocalLib=SiteUtils::$useLocalLib;
    if($useLocalLib)
    $src = SiteUtils::$libpath.substr( strrchr( $url, '/' ), 1 );
    else
    $src = $url;

    return script($src);
}
function script($url){
    return "<script src='" . $url . "'></script>\n";
}
class SiteUtils
    {

        public static $projectname = "project";
        public static $sitepath = './';
        public static $buildpath = "assets/js/build/";
        public static $libpath = "assets/js/libs/";
        public static $srcpath = '../src/js/';
        public static $useCompiled = true;
        public static $useLocalLib = false;

        /*
         * Devmode is enabled by default on localhost
         * Use a query string variable to override the default
         * dev mode setting, /?dev_mode=0
         */
        public static function setDevMode($devmode){

            if(isset($_REQUEST['dev_mode'])){
                $devmode = $_REQUEST['dev_mode'];
            }
            SiteUtils::$useCompiled = !$devmode;
            SiteUtils::$useLocalLib = $devmode;
        }
        public static function getJsBuild($folder){
            $file = SiteUtils::$sitepath.SiteUtils::$buildpath.SiteUtils::$projectname.'.'.$folder.'.min.js';
            return getMd5($file);//."?md5=".$c;
        }
        public static function getJsSource($folder, $manifest='_manifest.md')
        {
            $path = SiteUtils::$sitepath.SiteUtils::$srcpath.$folder.'/';


            $lines = file($path.$manifest, FILE_IGNORE_NEW_LINES);

            $files = array();
            foreach($lines as $l){
                if($l){
                    if((substr($l,0,1) != '#'))
                    array_push($files, $path.$l);
                }
            }

            return $files;
        }
        public static function getSpriteNames($path = "assets/img/sprites/"){
            $d = dir($path);
            $str = "";
            while ($entry = $d->read()) {
                if (strpos($entry, ".png") > 0) {
                    $parts = explode("-", $entry);
                    $str .= 'Config.SPRITE_'.strtoupper($parts[0]). " = '".$path.$entry."';\n";
                }
            }
            return $str;
        }
    }