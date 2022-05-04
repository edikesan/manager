<?php


Route::group(['prefix' => 'api'], function()
{

    /*
   * import excel csv Route
   */
    Route::post('user/import_excel_csv','ImportController@importCSVEXCEl');
    Route::post('user/import_excel_csv_database','ImportController@importCSVEXCElDatabase');
    Route::post('user/{id}/delete_excel_csv','ImportController@deleteCSVEXCEl');



    // Route registrations
    Route::get('registrations/getTrainingDate', 'RegistrationsController@getTrainingDate');
    Route::get('registrations/getUnregistredUsers', 'RegistrationsController@getUnregistredUsers');
    Route::get('registrations/cancelRegistration', 'RegistrationsController@cancelRegistration');
    Route::post('registrations/makeRegistration', 'RegistrationsController@makeRegistration');

    Route::resource('registrations', 'RegistrationsController');

    // Password reset link request routes...
    Route::post('password/email', 'Auth\PasswordController@postEmail');

    // Password reset routes...
    Route::post('password/reset', 'Auth\PasswordController@postReset');

    // Password change routes...
    Route::post('password/change', 'Auth\PasswordController@postChange');

    // authentication
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate', 'AuthenticateController@authenticate');


    /*
     * User Route
     */
    Route::get('user/search','UserController@search');
    Route::resource('user', 'UserController');
    Route::get('user/export/file','UserController@exportFile');


    /*
     * Permission Route
     */
    Route::get('permission/search','PermissionController@search');
    Route::resource('permission', 'PermissionController');

    /*
     * Role Route
     */
    Route::get('role/search','RoleController@search');
    Route::resource('role', 'RoleController');

    /*
     * Task Route
     */
    Route::get('task/search','TaskController@search');
    Route::resource('task', 'TaskController');
    Route::get('task/export/file','TaskController@exportFile');

    /*
     * Prospect Route
     */
    Route::get('erp/search','ProspectController@search');
    Route::resource('erp', 'ProspectController');


    Route::get('prospect/export/file','ProspectController@exportFile');
    Route::post('prospect/{id}/send_to_rl','ProspectController@send_to_rl');
    //Route::post('prospect/store','ProspectController@store');


    /*
     * Store Route
     */
    Route::get('/store/search','StoreController@search');
    Route::get('/store/searchStationDetail','StoreController@searchStationDeatil');
    Route::resource('store', 'StoreController');

    Route::get('/project/search','ProjectController@search');
    Route::resource('project', 'ProjectController');

    Route::get('/store_administration/search','StoreAdministrationController@search');
    Route::get('/store_administration/updateStoreAdministration','StoreAdministrationController@updateStoreAdministration');
    Route::get('/store_administration/createWE','StoreAdministrationController@createWE');
    Route::get('/store_administration/createFrachtBeleg','StoreAdministrationController@createFrachtBeleg');
    Route::resource('store_administration', 'StoreAdministrationController');

    Route::get('/store_leaving/search','StoreLeavingController@search');
    Route::get('/store_leaving/fht_search','StoreLeavingController@fht_search');
    Route::get('/store_leaving/grosshandel_search','StoreLeavingController@grosshandel_search');
    Route::get('/store_leaving/speditionen_search','StoreLeavingController@speditionen_search');
    Route::get('/store_leaving/bottles_search','StoreLeavingController@bottles_search');
    Route::get('/store_leaving/kunden_search','StoreLeavingController@kunden_search');
    Route::get('/store_leaving/auswertung_search','StoreLeavingController@auswertung_search');
    Route::get('/store_leaving/projekte_search','StoreLeavingController@projekte_search');
    Route::get('/store_leaving/create_fht_gasabgang','StoreLeavingController@create_fht_gasabgang');
    Route::get('/store_leaving/create_grosshandel_gasabgang','StoreLeavingController@create_grosshandel_gasabgang');
    Route::get('/store_leaving/create_spedition_gasabgang','StoreLeavingController@create_spedition_gasabgang');
    Route::get('/store_leaving/create_kunden_gasabgang','StoreLeavingController@create_kunden_gasabgang');
    Route::get('/store_leaving/create_projekt_gasabgang','StoreLeavingController@create_projekt_gasabgang');
    Route::get('/store_leaving/createLieferschein','StoreLeavingController@createLieferschein');
    Route::resource('store_leaving', 'StoreLeavingController');

    Route::get('/store_review/search','StoreReviewController@search');
    Route::resource('store_review', 'StoreReviewController');


    Route::get('/supplier_check/search','SupplierCheckController@search');
    Route::get('/supplier_check/updateSupplierCheck','SupplierCheckController@updateSupplierCheck');
    Route::get('/supplier_check/updateTankstelleSupplierCheck','SupplierCheckController@updateTankstelleSupplierCheck');
    Route::get('/supplier_check/getSupplierDetail','SupplierCheckController@getSupplierDetail');
    Route::get('/supplier_check/getWareneingaenge','SupplierCheckController@getWareneingaenge');
    Route::get('/supplier_check/deleteSupplierCheck','SupplierCheckController@deleteSupplierCheck');
    Route::resource('supplier_check', 'SupplierCheckController');

    /*
     * GasStations Route
     */
    Route::get('/gas_stations/search','GasStationsController@search');
    Route::get('/gas_stations/update','GasStationsController@update');
    Route::get('/gas_stations/getTerminals','TerminalController@index');
    Route::resource('gas_stations', 'GasStationsController');

    /*
     * Dashboard Route
     */
    Route::resource('dashboard', 'DashboardController');

    /*
     * Comment Route
     */
    Route::get('comment/search','CommentController@search');
    Route::resource('comment', 'CommentController');

    /*
     * tag Route
     */
    Route::get('tag/search','TagController@search');
    Route::resource('tag', 'TagController');

    /*
     * Gallery Route
     */
    Route::get('gallery/search','GalleryController@search');
    Route::resource('gallery', 'GalleryController');


    /*
     * Category Route
     */
    Route::resource('category', 'CategoryController');

    /*
     * Category Route
     */
    Route::resource('optionlist', 'OptionlistController');

    Route::resource('supplier', 'SupplierController');
    Route::resource('supplier_product', 'SupplierProductController');
    Route::resource('store', 'StoreController');

    /*
    * Category Route
    */
    Route::resource('price', 'PriceController');

    /*
     * Address Route
     */
    Route::resource('address', 'AddressController');


    /*
* NetFrame Route
*/
    Route::get('netframe/customer','NetframeController@getCustomerByCustomerNumber');
    Route::get('netframe/stores','NetframeController@getStoresByDate');
    Route::get('netframe/customerid','NetframeController@getContractByCustomerId');
    Route::get('netframe/contract','NetframeController@getContractById');
    /*
    * Postcode Route
    */
    Route::get('postcode/search','PostcodeController@search');
    Route::resource('postcode', 'PostcodeController');

    /*
    * ArtikelUmbuchungen Route
    */
    Route::get('artikel_umbuchungen/forwardRequest','ArtikelUmbuchungenController@forwardRequest');
    Route::resource('artikel_umbuchungen', 'ArtikelUmbuchungenController');

    /*
    * Bestellungen Route
    */
    Route::get('forward_request/forwardRequest','ForwardRequestController@forwardRequest');
    Route::resource('forward_request', 'ForwardRequestController');

    /*
     * Product Route
     */
    Route::resource('product', 'ProductController');

    /*
     * Contract Route
     */
    Route::resource('contract', 'ContractController');

    /*
     * Mail Route
     */
    Route::resource('mail', 'MailController');

    /*
     * Upload image Controller
     */
    Route::post('/uploadimage','UploadController@uploadimage');
    Route::post('/deleteimage/{id}','UploadController@deleteUpload');

    /*
     * Container Route
     */
    Route::resource('container', 'ContainerController');

    /*
     * Sync Route
     */
    Route::get('/sync/schema', 'SyncController@schema');
    Route::get('/sync/connection', 'SyncController@index');
    Route::get('/sync/check_sync', 'SyncController@check_sync');
    Route::get('/sync/table/{table}', 'SyncController@table');

});


