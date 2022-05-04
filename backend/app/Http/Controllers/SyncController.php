<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\User;

use App\Http\Requests;
use Validator;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use DB;

class SyncController extends Controller
{

    public $tables_no_sync = array('migrations', 'password_resets',
        'cities', 'anfragen', 'anfragen_2', 'categories', 'comments', 'galleries', 'permission_role',
        'permissions', 'role_user', 'roles', 'route_permission', 'tags', 'task_tags', 'tasks', 'postcodes');

    /**
     * Load Sync
     *
     * @return Response
     */
    public function index()
    {
        return "1";
    }

    public function schema($get_all_tables = false)
    {

        $tables = DB::select('SHOW TABLES');

        $tables = array_map(function ($object) {
            return (array)$object;
        }, $tables);

        foreach ($tables as $key => $value) {
            //return $value;
            $new_tables[] = $value['Tables_in_sam_dev'];
        }

        $tables = array_flip($new_tables);

        foreach ($this->tables_no_sync as $key => $table_name) {
            unset($tables[$table_name]);
        }

        if ($get_all_tables) {

            return $tables;

        }else {

            foreach ($tables as $table_name => $empty) {
                $schema[$table_name] = DB::getSchemaBuilder()->getColumnListing($table_name);
            }

            return json_encode($schema);
        }
    }

    public function check_sync()
    {

        session_start();
        $User = User::find($_SESSION['user_id']);

        $tables = $this->schema(true);

        foreach ($tables as $table_name => $empty) {
            $sync['new_rows'][$table_name] = DB::table($table_name)->where("created_at", ">=", $User->synced_at)->get();
        }

        foreach ($tables as $table_name => $empty) {
            $sync['updated_rows'][$table_name] = DB::table($table_name)->where("updated_at", ">=", $User->synced_at)->get();
        }

        $User->synced_at = date("Y-m-d H:i:s", time());
        $User->update();

        return json_encode($sync);
    }

    public function table($table){

        if($table == "users") {
            //$table_content = DB::select('SELECT id, rl_nr, name, email, avatar_url, username, location, country, image, status, birthday, gender FROM ' . $table);
        }else{
            //$table_content = DB::select('SELECT * FROM ' . $table);
        }

        $shell_command = "mysqldump -u root -pserver1rheingas1ph47tyzx --complete-insert sam_dev " . $table . " | grep -v '^\/\*![0-9]\{5\}.*\/;$'";
        $table_dump = explode("DROP TABLE", shell_exec($shell_command));
        $table_dump = "DROP TABLE " . $table_dump[1] . ");";
        $table_drop_and_create = explode("ENGINE=InnoDB", $table_dump);
        $table_drop_and_create = $table_drop_and_create[0];

        $table_inserts = explode("WRITE;", $table_dump);
        $table_inserts = explode("UNLOCK TABLES;", $table_inserts[1]);
        $table_inserts = $table_inserts[0];

        $table_fields = explode("VALUES", $table_inserts);
        $table_fields = $table_fields[0];

        $table_inserts = str_replace($table_fields . "VALUES", "", $table_inserts);
        $table_inserts = str_replace(");", "),", $table_inserts);
        $table_inserts = $table_fields . "VALUES" . $table_inserts;
        $table_inserts = substr(trim($table_inserts), 0, -1) . ";";

        //$table_drop_and_create;
        $sql = $table_inserts;

        return $sql;
    }

}