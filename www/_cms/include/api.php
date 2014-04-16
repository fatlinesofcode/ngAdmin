<?php
include_once 'DB.php';
include_once 'config.php';

/*
 * Mega simple Restful api
 * GET example
 * .include/api.php?action=get_test
 * POST example
 * .include/api.php?action=post_test
 */

class Api extends BaseApi
    {
        function __construct($db_dsn, $db_user, $db_pass)
        {
            DB::pdo($db_dsn, $db_user, $db_pass);
            parent::__construct();
        }

    /*
     * register the user and save their woggy name
     */
        function __post_test($postdata)
        {
            //  $this->register_user($postdata);
            $this->render_json($postdata);

        }

        function __login($data)
        {
            $result = (strtolower($data['username']) == AppConfig::$admin_user) && (strtolower($data['password']) == md5(AppConfig::$admin_password));
            $this->render_json(array('result' => $result));
        }

        function __get_test()
        {
            $this->render_json(array('result' => true));
        }

        function __get_row_count($data){
            $result = array();
            foreach($data['tables'] as $tablename){
                $sql = "select count(id) as count from $tablename";
                $row = DB::fetch($sql);
                $result[$tablename] = $row['count'];
            }

            $this->render_json(array('result' => $result));
        }

        function __get_rows($data)
        {
            $limit = 200;
            $offset = 0;
            $fields = "*";
            if(isset($data['fields'])){
                $fields = implode(", ", $data['fields']);
            }
            $order_by = isset($data['order_by']) ? $data['order_by'] : 'ID';
            $sql = 'select '.$fields.' from ' . $data['table']." order by $order_by LIMIT $offset, $limit";
            $rows = DB::fetchAll($sql);

            $this->render_json(array('result' => $rows));
        }

        function __get_row($data)
        {

            $row = DB::fetch('select * from ' . $data['table'] . ' where id = :id', array('id' => $data['id']));

            $this->render_json($row);
        }

        function __save_row($data)
        {
            $table = $data['table'];
            $id = $data['id'];
            unset($data['table']);
            unset($data['id']);
            if(isset($data['username']))
            unset($data['username']);
            if(isset($data['password']))
            unset($data['password']);

            if(isset($data['image']))
                $data['image'] = $this->save_image($data['image'] );
            if(isset($data['thumbnail']))
                $data['thumbnail'] = $this->save_image($data['thumbnail']);

            $data['date_modified'] = $this->get_date_time();

            if ($id == 'add'){
                $data['date_created'] = $this->get_date_time();
                $result = DB::insert($table, $data);
            }
            else
                $result = DB::update($table, $data, array('id' => $id));

            $this->render_json(array('result' => $result));
        }

        function __delete_row($data)
        {
            $table = $data['table'];
            $id = $data['id'];

            DB::query("delete from $table where id = :id", array('id' => $id));

            $this->render_json(array('result' => 1));
        }

    //img.src.substr(img.src.indexOf(',') + 1).toString();
        function save_image($imagedata)
        {
            if (strpos($imagedata, 'base64') > 0) {

                $imagedata = substr($imagedata, strpos($imagedata, ",") + 1);

                //$this->render_debug($imagedata);

                $path = AppConfig::$uploadPath;
                if (!file_exists($path)) {
                    render_error($path, 'path does not exist');
                }

                if (!is_writable($path)) {
                    render_error($path, 'file is not writeable');
                }

                $decoded = base64_decode($imagedata);
                $binary = imagecreatefromstring($decoded);
                $filename = uniqid() . ".jpg";
                $success = file_put_contents($path . $filename, $decoded);
                if ($success) {
                    //   $data['file'] = $filename;
                    return $filename;
                    return array('filename' => $filename, 'binary' => $binary);
                } else
                    return "";
            } else {
                return $imagedata;
            }
        }


        function register_user($postdata)
        {
            DB::insert('users', array(
                'first_name' => $postdata['first_name'],
                'last_name' => $postdata['last_name'],
                'facebook_id' => $postdata['id'],
                'email' => $postdata['email'],
                'gender' => $postdata['gender'],
                'date_created' => $this->get_date_time(),
                'date_modified' => $this->get_date_time()
            ));
        }

    }

class BaseApi
    {
    /*
     * Construct the api, route the action parameter to any __functionname
     * If its a post grab the json p other wise, send the get paramaters to the function
     */
        function __construct()
        {
            if (isset($_GET['action'])) {
                $action = htmlentities($_GET['action'], ENT_QUOTES);
                $method = '__' . $action;
                $data = $this->get_json_post();
                if (!$data) {
                    $data = $this->santize($_GET);
                }
                if($action != "login"){
                    if(! $this->check_credentials($data)){
                        //$this->render_error($data,"Invalid username or password.");
                        $this->render_json(array('result' => false, "badlogin" => true, "error" => "Invalid username or password.", data=>$data));
                        return;
                    }
                }
                call_user_func_array(array($this, $method), array($data));
            }
        }

        function check_credentials($data){
            $result = (strtolower($data['username']) == AppConfig::$admin_user)
                && (strtolower($data['password']) == md5(AppConfig::$admin_password));

            return $result;

        }

        function get_date_time()
        {
            return date('Y-m-j H:i:s');
        }

        function render_error($data = array(), $msg = '' )
        {
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            echo "Request execution failed: $msg \n";
            echo "with values:\n";
            print_r($data);
            die();
        }

        function render_json($data, $encode = true)
        {
            header('Content-type: application/json');
            $output = $data;
            if ($encode) {
                //  $data = array_map(utf8_encode, $data);
                // $data = (array_map('base64_encode', $data));
                $output = json_encode($data);
            }
            echo $output;
        }

        function get_json_post()
        {
            $rawrequest = file_get_contents('php://input');
            return json_decode($rawrequest, true);
        }

        function render_debug($data)
        {
            echo "<pre>\n";
            print_r($data);
            echo "</pre>\n";
        }

    /*
     * $myinputs = filter_var_array($data,FILTER_SANITIZE_STRING);
     * $myinputs = filter_var_array($data,array('email'=>FILTER_SANITIZE_EMAIL);
     */
        function santize($postdata, $filterFields = array())
        {
            $filteredData = array();

            $filteredData = filter_var_array($postdata, FILTER_SANITIZE_STRING);
            // return filter_var_array($postdata,array('email'=>FILTER_SANITIZE_EMAIL));

            foreach ($filteredData as $key => $value) {
                $filter = null;
                $flags = null;
                if (isset($filterFields[$key])) {
                    $filter = $filterFields[$key];
                } else {
                    switch ($key) {
                        case 'email':
                            $filter = FILTER_SANITIZE_EMAIL;
                            break;
                        default:
                            break;
                    }
                }
                if ($filter)
                    $filteredData[$key] = filter_var($value, $filter, $flags);
                else
                    $filteredData[$key] = $value;
            }

            return $filteredData;
        }

        function validate($postdata, $expectedFields = array(), $filterFields = array())
        {
            $expectedKeys = array();
            foreach ($expectedFields as $field) {
                $expectedKeys[$field] = '';
            }

            $postdata = array_merge($expectedKeys, $postdata);

            $filteredData = array();

            foreach ($postdata as $key => $value) {
                $filter = null;
                $flags = null;
                if (isset($filterFields[$key])) {
                    $filter = $filterFields[$key];
                } else {
                    switch ($key) {
                        case 'email':
                            $filter = FILTER_VALIDATE_EMAIL;
                            break;
                        default:
                            $filter = null;
                            break;
                    }
                }
                if ($filter)
                    $filteredData[$key] = filter_var($value, $filter);
                else
                    $filteredData[$key] = $value ? true : false;
            }

            $overallResult = true;
            foreach ($filteredData as $bool) {
                if (!$bool) {
                    $overallResult = false;
                }
            }
            return $overallResult;
            return array('result' => $overallResult, 'fields' => $filteredData);
        }

    }

$api = new Api(AppConfig::$db_dsn, AppConfig::$db_user, AppConfig::$db_pass);
