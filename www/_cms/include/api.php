<?php
require_once "vendor/autoload.php";
require_once "config.php";

class Api
{
    function __construct()
    {
        ORM::configure(AppConfig::$db_dsn);
        ORM::configure('username', AppConfig::$db_user);
        ORM::configure('password', AppConfig::$db_pass);
        $this->app = new Slim(array("MODE" => "development"));
        $this->setup_routes();
        $this->app->run();
    }
    /*
     * Crud
     */
    function setup_routes(){
        //login
        $this->app->post('/login',  array($this, '__login') );
        //create
        $this->app->post('/rows/:table',  array($this, 'authorize'), array($this, '__save_row') );
        //update
        $this->app->put('/rows/:table/:id',  array($this, 'authorize'), array($this, '__save_row') );
        //retrieve
        $this->app->get('/rows/count',  array($this, 'authorize'), array($this, '__get_row_count') );
        $this->app->get('/rows/:table',  array($this, 'authorize'), array($this, '__get_rows') );
        $this->app->get('/rows/:table/:id', array($this, 'authorize'), array($this, '__get_row') );
        //delete
        $this->app->delete('/rows/:table/:id',  array($this, 'authorize'), array($this, '__delete_row') );

    }
    function authorize(){

        $result = false;

        $headers = apache_request_headers();
        if (isset($headers['Authorization'])) {
            $token = $headers['Authorization'];
            if($this->checkToken($token)){
                $result = true;
            }else{
                $result = false;
            }
        }
        else{
            $result = false;
        }

        if(! $result){
            $this->echo_json(array('error' => 'Not authorized'), 403);
          //  $this->app->halt(403, 'Not authorized.');
            $this->app->stop();
        }

        return $result;
    }

    function createToken($username, $hashPassword){

        return "ngAdminToken".md5(strtolower($username).strtolower($hashPassword));
    }
    function checkToken($token){
        return $token === $this->createToken(AppConfig::$admin_user, md5(AppConfig::$admin_password));
    }

    function __login()
    {
        $data = $this->get_json_payload();
        $result = (strtolower($data->username) == AppConfig::$admin_user) && (strtolower($data->password) == md5(AppConfig::$admin_password));

        $this->echo_json(array('result' => $result, 'token' => $this->createToken($data->username, $data->password)));
    }



    function __save_row($table, $id = null)
    {
        $data = $this->get_json_payload(true);

        if(isset($data['image']))
            $data['image'] = $this->save_image($data['image'] );
        if(isset($data['thumbnail']))
            $data['thumbnail'] = $this->save_image($data['thumbnail']);

        $data['date_modified'] = $this->get_date_time();

        if ( is_null($id) ){
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

    function __get_row($table, $id)
    {

        $row = ORM::for_table($table)
            ->find_one($id);

        if($row)
        $this->echo_json(array('result' => $row->as_array()) );
        else{
            $this->echo_json();
        }
    }

    function __get_rows($table = 'none'){


        $params = $this->app->request()->params();
        $limit = 200;
        $offset = 0;


        $fields = isset($params['fields']) ? json_decode($params['fields']) : '*';
        $order_by = isset($params['order_by']) ? $params['order_by'] : 'ID';


        $rows = ORM::for_table($table)
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

    function __get_row_count(){

        $tables = json_decode( $this->app->request()->params('tables'));

        $result = array();
        foreach($tables as $tablename){
            $result[$tablename] = ORM::for_table($tablename)->count();
        }

        $this->echo_json(array('result' => $result));
    }

    function __delete_row($table, $id)
    {

        $row = ORM::for_table($table)->find_one($id);
        $result = $row->delete();
        $this->echo_json(array('result' => $result));
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

    function get_json_payload($as_array = false){
        return json_decode($this->app->request()->getBody(), $as_array ? true : false);
    }


    function echo_json($response="", $status_code=200) {
        // Http response code
        $this->app->status($status_code);

        // setting response content type to json
        $this->app->contentType('application/json');


        echo json_encode($response);
    }
}
$api = new Api();