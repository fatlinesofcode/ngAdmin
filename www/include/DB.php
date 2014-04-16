<?php

class DB
    {
        private static $_db = null;

        public static function pdo($dsn = null, $username = null, $password = null)
        {
            if ($dsn) {
                try {
                    DB::$_db = new PDO($dsn, $username, $password);
                    DB::$_db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
                } catch (Exception $e) {
                    die($e);
                }
            }
            return DB::$_db;
        }

        public static function query($sql, $array = null)
        {
            $query = DB::pdo()->prepare($sql);
            try {
                $result = $query->execute($array);
                if (!$result) {
                    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
                    echo "Query execution failed: $sql \n";
                    echo "with values:\n";
                    print_r($array);
                    echo "PDO errorInfo:\n";
                    print_r($query->errorInfo());
                    die();
                }
            } catch (Exception $e) {
                die($e);
            }
            return $query;
        }
    /*
     * DB::select('users', array('id,facebook_id'), array('facebook_id' => $facebook_id));
     */
        public static function select($table, $fields, $where)
        {
            $sql = "select FROM $table WHERE $condition";
        }

    /*
     * DB::update('users', array('wog_name' => $wog_name), array('id' => $user['id']));
     */
        public static function update($table, $fields, $where)
        {
            $_map = function ($key) {
                return "$key = :$key";
            };
            $values = join(", ", (array_map($_map, array_keys($fields))));
            $condition = join(", ", (array_map($_map, array_keys($where))));
            $sql = "UPDATE $table SET $values WHERE $condition";
            DB::query($sql, array_merge($fields, $where));

        }

    /*
     *
     * DB::insert('users', array( 'first_name' => $fbprofile['first_name'], 'last_name' => $fbprofile['last_name'] ));
     */
        public static function insert($table, $fields)
        {
            $keys = join(", ", array_keys($fields));
            $values = join(", ", (array_map(function ($key) {
                return ":$key";
            }, array_keys($fields))));
            $sql = "INSERT INTO $table ($keys) VALUES($values)";
            return DB::query($sql, $fields);

        }

        public static function fetch($sql, $fields = null)
        {
            return DB::query($sql, $fields)->fetch();
        }

        public static function fetchAll($sql, $fields = null)
        {
            return DB::query($sql, $fields)->fetchAll();
        }

    }