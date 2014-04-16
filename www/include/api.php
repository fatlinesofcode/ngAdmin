<?php
//include_once 'DB.php';
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
        //    DB::pdo($db_dsn, $db_user, $db_pass);
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

        function __get_test(){
            $this->render_json(array('result'=>true));
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
                $method = '__' . htmlentities($_GET['action'], ENT_QUOTES);
                $data = $this->get_json_post();
                if (!$data) {
                    $data = $this->santize($_GET);
                }
                call_user_func_array(array($this, $method), array($data));
            }
        }

        function get_date_time()
        {
            return date('Y-m-j H:i:s');
        }

        function render_error($data, $msg = '', $data=array()){
            header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
            echo "Request execution failed: $data \n";
            echo "with values:\n";
            print_r($data);
            die();
        }
        function render_json($data, $encode = true)
        {
            header('Content-type: application/json');
            $output = $data;
            if ($encode)
                $output = json_encode($data);

            echo $output;
        }

        function get_json_post()
        {
            $rawrequest = file_get_contents('php://input');
            return json_decode($rawrequest, true);
        }

    /*
     * $myinputs = filter_var_array($data,FILTER_SANITIZE_STRING);
     * $myinputs = filter_var_array($data,array('email'=>FILTER_SANITIZE_EMAIL);
     */
        function santize($postdata, $filterFields = array())
        {
            $filteredData = array();

            $filteredData =  filter_var_array($postdata,FILTER_SANITIZE_STRING);
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
                if($filter)
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
