var running_sync = 0;
var stop_stop = 1;
var db;
var sync_int;

function open_db(){
    db = openDatabase('sam2', '1.0', 'SAM', 100 * 1024 * 1024);
}

function start_sync_intervall(){
    sync_int = setInterval(check_sync, 10000);
}

function check_sync(){

    document.getElementById('sync_status').setAttribute("class", "label label-info");
    document.getElementById('sync_status').innerHTML = 'Syncronisiere...';

    if(running_sync == 0) {
        running_sync = 1;

        $.get("/backend/public/api/sync/check_sync", function (response) {
            document.getElementById('sync_status').setAttribute("class", "label label-success");
            document.getElementById('sync_status').innerHTML = 'Online';

            var response_object = $.parseJSON(response);
            $.each(response_object.new_rows, function (tablename, rows) {
                if (rows) {
                    sql_insert_objects(tablename, false, rows);
                }
            });

            $.each(response_object.updated_rows, function (tablename, rows) {
                if (rows) {
                    sql_update_objects(tablename, false, rows);
                }
            });

            running_sync = 0;


        }).fail(function () {
            document.getElementById('sync_status').setAttribute("class", "label label-danger");
            document.getElementById('sync_status').innerHTML = 'Offline';
            console.log("Keine Serververbindung");

            running_sync = 0;
        });
    }
}

function sync_db($http) {

    $.get( "/backend/public/api/sync/connection", function( response ) {

        //Submit new Entries
        console.log("sync DB Connection TRUE");
        //submit_new_entries($http);
        console.log("After submit new entries");

        //Get Tables, Fields and Data
        get_schema_and_data_from_server();


    }).fail(function() {
        console.log("Keine Serververbindung");
    });
}

function submit_new_entries($http) {
    console.log("Submit new Entries");
    LDBgetProspects(false, 1, 0, $http);
}

function get_schema_and_data_from_server() {

    $.get( "/backend/public/api/sync/schema", function( response ) {

        var sql = '';
        json = jQuery.parseJSON(response);
        $.each(json, function (tablename, data) {

            sql = tablename + ' (';
            execute_sync_sql('DROP TABLE IF EXISTS ' + tablename);

            $.each(data, function (index, field) {
                if(field == 'id') {
                    sql = sql + field + ' INTEGER PRIMARY KEY AUTOINCREMENT, ';
                }else{
                    sql = sql + field + ', ';
                }
            });

            sql = sql + 'sync_new, sync_update'
            sql = 'CREATE TABLE ' + sql + ')';

            execute_sync_sql(sql);
            sync_db_content(tablename);
        });
    });
}

function send_new_prospects_to_server(prospects, $http){

    $.each(prospects, function( index, prospect ) {

        var req = {
            method: 'POST',
            url: '/backend/public/api/prospect',
            headers: {
                'Content-Type': "application/json"
            },
            data: prospect
        };
        $http(req).then(function(){console.log("Send Prospects erfolgreich");}, function(){console.log("Send Prospects nicht erfolgreich");});
    });

    console.log("Send Prospects");
    console.log(prospects);
}

function send_updated_prospects_to_server(prospects){

}

function execute_sync_sql(sql) {

    db.transaction(function (tx) {
        tx.executeSql(sql, [], function(){}, sqlError);
        function sqlError(transaction, error) {
            console.log("Error : " + error.message + " in ");
        }
    });
}

function LDBgetProspect($scope, id) {

    var prospect = {};
    var address = {};
    var addresses = [];
    var products = [];

    db.transaction(function (tx) {
        var sql = "SELECT * FROM prospects WHERE prospects.id = '" + id + "'";
        tx.executeSql(sql, [], function (tx, results) {
            prospect = results.rows.item(0);
        }, errorHandler);

        db.transaction(function (tx) {
            var sql = "SELECT * FROM addresses WHERE prospect_id = '" + id + "' AND address_type_id = '1'";
            tx.executeSql(sql, [], function (tx, results) {
                address = results.rows.item(0);
                prospect.address = address;
            }, errorHandler);

            db.transaction(function (tx) {
                var sql = "SELECT * FROM addresses WHERE prospect_id = '" + id + "' AND address_type_id != '1'";
                tx.executeSql(sql, [], function (tx, results) {
                    for (var i = 0; i < results.rows.length; i++) {
                        addresses.push(results.rows.item(i));
                    }
                    prospect.addresses = addresses;
                }, errorHandler);

                db.transaction(function (tx) {
                    var sql = "SELECT * FROM products WHERE prospect_id = '" + id + "'";
                    tx.executeSql(sql, [], function (tx, results) {
                        for (var i = 0; i < results.rows.length; i++) {
                            products.push(results.rows.item(i));
                        }
                        prospect.products = products;
                        $scope.prospect = prospect;
                    }, errorHandler);
                });
            });
        });
    });
}


function LDBcreateProspect($scope, prospect) {

    var address = prospect.address;
    prospect.sync_new = '1';

    var sql = convert_to_insert('prospects', false, prospect);
    console.log(sql);
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {

            address.prospect_id = results.insertId;
            prospect.id = results.insertId;
            address.sync_new = '1';
            address.address_type_id = '1';

            var sql = convert_to_insert('addresses', false, address);
            console.log(sql);
            db.transaction(function (tx) {
                tx.executeSql(sql, [], function (tx, results) {

                    prospect.address_id = results.insertId;

                    var sql = convert_to_update('prospects', false, prospect);

                    db.transaction(function (tx) {
                        tx.executeSql(sql, [], function (tx, results) {}, errorHandler);
                    });
                }, errorHandler);
            });
        }, errorHandler);
    });
}

function LDBupdateProspect($scope, prospect) {

    var address = prospect.address;
    address.sync_update = '1';
    prospect.sync_update = '1';

    var sql = convert_to_update('prospects', false, prospect);
    db.transaction(function (tx) {
        tx.executeSql(sql, [], function (tx, results) {

            var sql = convert_to_update('addresses', false, address);
            db.transaction(function (tx) {
                tx.executeSql(sql, [], function (tx, results) {}, errorHandler);
            });

        }, errorHandler);
    });
}




//LDBget($scope, ['prospects':['limit':'1,10']], ['addresses':['object_name':'address','where':['address_type_id':'1']], 'products']);



function LDBget($scope, object_blueprint) {

    var object = {};
    var main_object = {};
    var main_object_key = '';
    var main_object_blueprint = {};
    var object_id = 0;
    var result_object = [];
    var main_object_in = '';
    var object_names = [];

    $.each(object_blueprint, function (object_name, object_properties) {
        object_names.push(object_name);

        $.each(object_properties, function (property_name, value) {
            if(property_name != 'limit' && property_name != 'tablename' && property_name != 'callback' && property_name != 'key' && property_name != 'type' && property_name != 'where') {
                object_names.push(property_name);
            }
        });
    });

    get_objects_from_db();

    function get_objects_from_db(sql_results) {

        if(!jQuery.isEmptyObject(sql_results)) {

            //SQL Ergebnis verarbeitung
            if(jQuery.isEmptyObject(result_object)){

                //Erster Durchlauf (Hauptobjekt)
                for (var i = 0; i < sql_results.rows.length; i++) {
                    result_object.push(sql_results.rows.item(i));
                    main_object_in = main_object_in + sql_results.rows.item(i).id + ",";
                }

                main_object_in = main_object_in + ")";
                main_object_in = main_object_in.replace(",)", "");

            }else{

                //Weitere Durchläufe (Subobjekte)
                for (var key in result_object) {
                    for (var sub_key in sql_results.rows) {

                        if (result_object[key].id == sql_results.rows.item(sub_key)[main_object_key]) {
                            if(object['type'] == "object") {
                                result_object[key][object_names[object_id]] = sql_results.rows.item(sub_key);
                            }

                            if(object['type'] == "array") {
                                if(result_object[key][object_names[object_id]] !== undefined) {
                                    result_object[key][object_names[object_id]].push(sql_results.rows.item(sub_key));
                                }else{
                                    result_object[key][object_names[object_id]] = [sql_results.rows.item(sub_key)];
                                }
                            }
                        }
                    }
                }
            }

            object_id = object_id + 1;
        }

        //Ausgabe Resultat
        if(jQuery.isEmptyObject(object_names[object_id])) {
            console.log("Result");
            console.log(result_object);
            if(main_object_blueprint.type == "object"){
                $scope[main_object] = result_object[0];
                if(main_object_blueprint.callback !== undefined) {
                    $scope[main_object_blueprint.callback](result_object[0]);
                }
            }else{
                $scope[main_object] = result_object;
                if(main_object_blueprint.callback !== undefined) {
                    $scope[main_object_blueprint.callback](result_object);
                }
            }

        }

        //Erster Durchlauf Hauptobjekt
        if(object_id == 0) {
            main_object = object_names[object_id];
            main_object_blueprint = object_blueprint[object_names[object_id]];
            object = object_blueprint[object_names[object_id]];
            main_object_key = object.key;
        }else{
            //Weitere Durchläufe
            //Einzelnes Object aus Blueprint entnehmen
            object = object_blueprint[main_object][object_names[object_id]];
        }


        //Where Filter zusammenbauen
        var where = '';
        if(object.where){
            $.each(object.where, function (field, value) {
                where = where + ' AND ' + field  + "=" +  value;
            });
        }

        if(main_object_in != ''){
            where = where + ' AND ' + main_object_key + ' IN (' + main_object_in + ')';
        }

        //Limit zusammenbauen
        var limit = '';
        if(object.limit) {
            limit = ' LIMIT ' + object.limit;
        }

        //SQL Abfrage durchführen
        if(!jQuery.isEmptyObject(object)) {
            db.transaction(function (tx) {
                var sql = "SELECT * FROM " + object['tablename'] + " WHERE 1=1 " + where + limit + ";";
                tx.executeSql(sql, [], function(tx, results){
                    sql_results = results;
                    get_objects_from_db(sql_results);
                }, function(transaction, error) {
                    console.log("Error : " + error.message + " in ");
                });
            });
        }
    }
}

function LDBgetProspects($scope, only_new, only_updated, $http) {

    var prospects = [];
    var prospects_new = [];
    var prospects_in = "";
    var sync = "";

    if(only_new == '1') {
        sync = "AND sync_new = '1'";
    }

    if(only_updated == '1') {
        sync = "AND sync_update = '1'";
    }

    db.transaction(function (tx) {
        var sql = "SELECT * FROM prospects WHERE 1=1 " + sync + " LIMIT 10";
        console.log(sql);
        tx.executeSql(sql, [], function (tx, results) {

            for (var i = 0; i < results.rows.length; i++) {
                prospects[results.rows.item(i).id] = results.rows.item(i);
                prospects[results.rows.item(i).id].products = [];

                if(sync != "") {
                    delete prospects[results.rows.item(i).id].id;
                }

                prospects_in = prospects_in + "'" + results.rows.item(i).id + "'" + ", ";
            }

            prospects_in = prospects_in + ")";
            prospects_in = prospects_in.replace("', )", "'");

            var sql = "SELECT * FROM addresses WHERE prospect_id IN ("+ prospects_in + ") AND address_type_id = '1' " + sync + "";
            console.log(sql);
            tx.executeSql(sql, [], function (tx, results) {
                for (var i = 0; i < results.rows.length; i++) {
                    prospects[results.rows.item(i).prospect_id].address = results.rows.item(i);

                    if(sync != "") {
                        console.log(prospects[results.rows.item(i).prospect_id].address.id);
                        delete prospects[results.rows.item(i).prospect_id].address.id;
                    }
                }

                var sql = "SELECT * FROM products WHERE prospect_id IN ("+ prospects_in + ") " + sync + "";
                console.log(sql);
                tx.executeSql(sql, [], function (tx, results) {
                    for (var i = 0; i < results.rows.length; i++) {
                        prospects[results.rows.item(i).prospect_id].products.push(results.rows.item(i));

                        if(sync != "") {
                            delete prospects[results.rows.item(i).prospect_id].products.id;
                        }
                    }

                    $.each(prospects, function( index, value ) {
                        if (value) {
                           prospects_new.push(value);
                        }
                    });

                    console.log(prospects_new);

                    if(sync == "") {
                        console.log("scope prospects");
                        $scope.prospects = prospects_new;
                    }else{

                        if(only_new == '1') {
                            console.log("send_new_prospects_to_server call");
                            send_new_prospects_to_server(prospects_new, $http);
                        }

                        if(only_updated == '1') {
                            send_updated_prospects_to_server(prospects_new, $http);
                        }
                    }
                }, errorHandler);
            }, errorHandler);
        }, errorHandler);
    });
}

function LDBgetOptionlists($scope) {

    var optionlists = [];

        db.transaction(function (tx) {
            var sql = "SELECT * FROM optionlists";
            tx.executeSql(sql, [], function (tx, results) {
                for (var i = 0; i < results.rows.length; i++) {
                    optionlists.push(results.rows.item(i));
                }
                $scope.optionlists = optionlists;
            }, errorHandler);
        });
}

function LDBgetUsers($scope) {

    var users = [];

    db.transaction(function (tx) {
        var sql = "SELECT * FROM users";
        tx.executeSql(sql, [], function (tx, results) {
            for (var i = 0; i < results.rows.length; i++) {
                users.push(results.rows.item(i));
            }
            $scope.users = users;
        }, errorHandler);
    });
}

function errorHandler(transaction, error) {

    console.log(error);
    return true;
}

function successHandler() {

    return true;
}

function sync_db_content(tablename){

    $.get( '/backend/public/api/sync/table/' + tablename, function( data ) {
        //console.log(data);
        //if(tablename == "postcodes"){
            execute_sync_sql(data);
        //}
        //sql_insert_json(tablename, data);
    });
}

function convert_to_insert(tablename, json, object){

    var sql = '';
    var fields = '';
    var values = '';

    if(json) {
        object = $.parseJSON(json);
    }

    $.each(object, function (field, value) {

        if(typeof value !== 'object') {
            fields = fields + field + ', ';
            values = values + "'" + value + "', ";
        }
    });

    fields = fields + ')';
    fields = fields.replace(', )', '');

    values = values + ')';
    values = values.replace(', )', '');

    sql = 'INSERT INTO ' + tablename + ' (' + fields + ') VALUES (' + values + ')';

    return sql;
}

function sql_update_objects(tablename, json, object){

    var sql = '';
    var update = '';
    var id = '';

    if(json) {
        object = $.parseJSON(json);
    }

    $.each(object, function (row_id, row) {

        var fields = '';
        var values = '';

        $.each(row, function (field, value) {

            if (field == "id") {
                id = value;
            } else {
                if (typeof value !== 'object') {
                    update = update + field + " = '" + value + "', ";
                }
            }
        });

        update = update + ')';
        update = update.replace(', )', '');

        sql = "UPDATE " + tablename + " SET " + update + " WHERE id = '" + id + "'";
        execute_sync_sql(sql);
    });
}

function sql_insert_objects(tablename, json, object){

    var sql = '';

    if(json) {
        object = $.parseJSON(json);
    }

    $.each(object, function (row_id, row) {

        var fields = '';
        var values = '';

        $.each(row, function (field, value) {
            if (typeof value !== 'object') {
                fields = fields + field + ', ';
                values = values + "'" + value + "', ";
            }
        });

        fields = fields + ')';
        fields = fields.replace(', )', '');

        values = values + ')';
        values = values.replace(', )', '');

        sql = 'INSERT INTO ' + tablename + ' (' + fields + ') VALUES (' + values + ')';
        execute_sync_sql(sql);
    });
}