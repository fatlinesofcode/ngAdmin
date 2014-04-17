<?php
require_once "vendor/autoload.php";
require_once "config.php";

class ngAdminAPI
{
    function __construct()
    {
        ORM::configure(AppConfig::$db_dsn);
        ORM::configure('username', AppConfig::$db_user);
        ORM::configure('password', AppConfig::$db_pass);
        $this->app = new Slim(array(  "MODE" => "development" ));
        $this->setup_routes();
        $this->app->run();
    }
    /*
     * Wildcard route any /:action to a function, prefix the function with __ to indicate its exposed to the api.
     * Check the username and password for every action.
     */
    function setup_routes(){
        $this->app->post("/:action", function ($action) {
            $data = $this->get_json_post();
            if($action != "login"){
                if(! $this->check_credentials($data)){
                    $this->echo_json(array('result' => false, "badlogin" => true, "error" => "Invalid username or password.", 'data'=>$data));
                    return;
                }
            }
            $method = "__".$action;
            call_user_func_array(array($this, $method), array($data));
        });
    }
    function get_json_post()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

    function echo_json($response="", $status_code=200) {
        //$app = \Slim\Slim::getInstance();
       // $app = Slim::getInstance();
        // Http response code
        $this->app->status($status_code);

        // setting response content type to json
        $this->app->contentType('application/json');


        echo json_encode($response);
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

    function __login($data)
    {
        $result = (strtolower($data['username']) == AppConfig::$admin_user) && (strtolower($data['password']) == md5(AppConfig::$admin_password));
        $this->echo_json(array('result' => $result));
    }

    function __get_row($data)
    {

        $row = ORM::for_table($data['table'])
            ->find_one($data['id']);
        if($row)
        $this->echo_json($row->as_array());
        else{
            $this->echo_json();
        }
    }

    function __get_rows($data){
        $limit = 200;
        $offset = 0;


        $fields = isset($data['fields']) ? $data['fields'] : '*';
        $order_by = isset($data['order_by']) ? $data['order_by'] : 'ID';

        $rows = ORM::for_table($data['table'])
            ->select_many($fields)
            ->order_by_asc($order_by)
            ->limit($limit)
            ->offset($offset)
            ->find_many();

        $result = [];
        foreach($rows as $row) {
            array_push($result, $row->as_array());
        }
        $this->echo_json(array('result' => $result));
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
            $row = ORM::for_table($table)->create();
        }
        else{
            $row = ORM::for_table($table)->find_one($id);

        }
        $row->set($data);
        $result = $row->save();
        $id = $row->id();


        $this->echo_json(array('result' => $result, 'id'=>$id));
    }

    function __delete_row($data)
    {

        $row = ORM::for_table($data['table'])->find_one($data['id']);
        $result = $row->delete();
        $this->echo_json(array('result' => $result));
    }

    function __get_row_count($data){
        $result = array();
        foreach($data['tables'] as $tablename){
            $result[$tablename] = ORM::for_table($tablename)->count();
        }

        $this->echo_json(array('result' => $result));
    }
}
$api = new ngAdminAPI();
