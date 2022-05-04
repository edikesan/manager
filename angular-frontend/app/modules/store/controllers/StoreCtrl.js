"use strict";

angular.module('ng-laravel').controller('StoreCtrl',function($rootScope,$scope,$filter,Notification,SupplierProductService,SupplierService,StoreService, $state, $location, $stateParams){

    $scope.hideStationList = true;
    $scope.showStationDetail = false;
    $scope.suppliers = SupplierService.supplier;
    $scope.supplier_products = SupplierProductService.supplier_product;
    $scope.stores = StoreService.store;
    
    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    if(window.mobilecheck() == true){
        $scope.mobile = 1;
    }else{
        $scope.mobile = 0;
    }

    if($scope.mobile == 1){
        $scope.width_update_button = 'border: 0px; width: 100px;';
        $scope.width_product_modal= 'z-index:1060; margin-left: 35%';
    }else{
        $scope.width_update_button = 'border: 0px; max-width: 90px';
        $scope.width_product_modal= 'z-index:1060;';
    }

    $scope.search = function() {
        $scope.showLoader = true;
        $scope.date_value = $("#date_dropdown").val();
        StoreService.search($scope.date_value, 5).then(function (data) {

            if($scope.mobile == 1){
                $scope.width_suchbegriff = 'width: 40%; margin-top: 10px;';
            }else{
                $scope.width_suchbegriff = 'width: 20%; margin-top: 10px;';
            }

            $scope.hideStationList = false;
            $scope.showLoader = false;
            $scope.stations = [];
            for (var i = 0; i < data[0].Stationen.Station.length; i++) {
                $scope.stations[i] = {
                    station_id: data[0].Stationen.Station[i].Stationid,
                    suchbegriff: data[0].Stationen.Station[i].Suchbegriff
                }
            }
        });
    }

    function add_months(dt, n)
    {
        return new Date(dt.setMonth(dt.getMonth() + n));
    }
    $scope.dateDropdown = function berechne(pOptionsListId) {
        var datum;
        var monatZahl;
        var jahrZahl;
        var monaten = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
        var sOption;
        var sSelect = document.getElementById(pOptionsListId);
        for(var i=0; i>-3; i--){
            datum = add_months(new Date(),i);
            monatZahl = datum.getMonth();
            jahrZahl = datum.getFullYear();
            sOption = document.createElement("option");
            sOption.value = jahrZahl+("0"+(monatZahl+1)).slice(-2);
            sOption.text = monaten[monatZahl]+" "+jahrZahl;
            sSelect.options.add(sOption);
        }
    }
    $scope.dateDropdown('date_dropdown');

    $scope.searchStationDetail = function(station_id, station_name) {
        $scope.showLoader = true;
        $scope.showStationDetail = true;

        $scope.selectet_station_id = station_id;
        $scope.selectet_station_name = station_name;

        SupplierService.getSupplier();
        SupplierProductService.getSupplierProducts();
        StoreService.getStore();

        StoreService.searchStationDeatil(station_id, 5).then(function (data) {

            if($scope.mobile == 1){
                $scope.width_overview = 'width: 55%; margin-top: 10px;';
                $scope.width_date = 'width: 80px; margin-right: 20px; padding-right: 20px;';
            }else{
                $scope.width_overview = 'width: 30%; margin-top: 10px;';
                $scope.width_date = '';
            }
            $scope.showLoader = false;

            var $positionen_arr = [];
            if (data[0].Station.Positionen && data[0].Station.Positionen != '') {
                console.log(data[0].Station);
                console.log(data[0].Station.Positionen.Position.length );
                if (data[0].Station.Positionen.Position.length != undefined) {
                    console.log('1');
                    console.log(data[0].Station.Positionen.Position.length );
                    for( var i = 0; i < data[0].Station.Positionen.Position.length; i++) {
                        console.log('2');
                        $scope.station = [];
                        $scope.station[i] = [];
                        $positionen_arr[i] = {
                            positionid  : data[0].Station.Positionen.Position[i].positionid,
                            lfdnr       : data[0].Station.Positionen.Position[i].lfdnr,
                            dispoid     : data[0].Station.Positionen.Position[i].dispoid,
                            orderid     : data[0].Station.Positionen.Position[i].orderid,
                            loadid      : data[0].Station.Positionen.Position[i].loadid,
                            lagernr     : data[0].Station.Positionen.Position[i].lagernr,
                            lager       : data[0].Station.Positionen.Position[i].lager,
                            speditionnr : data[0].Station.Positionen.Position[i].speditionnr,
                            spedition   : data[0].Station.Positionen.Position[i].spedition,
                            produkt     : data[0].Station.Positionen.Position[i].produkt,
                            ladedatum   : data[0].Station.Positionen.Position[i].ladedatum,
                            entladedatum: data[0].Station.Positionen.Position[i].entladedatum,
                            bemerkung   : data[0].Station.Positionen.Position[i].bemerkung
                        };
                    }
                }else{
                    console.log('3');
                    $scope.station = [];
                    $scope.station[0] = [];
                    $positionen_arr[0] = {
                        positionid: data[0].Station.Positionen.Position.positionid,
                        lfdnr       : data[0].Station.Positionen.Position.lfdnr,
                        dispoid     : data[0].Station.Positionen.Position.dispoid,
                        orderid     : data[0].Station.Positionen.Position.orderid,
                        loadid      : data[0].Station.Positionen.Position.loadid,
                        lagernr     : data[0].Station.Positionen.Position.lagernr,
                        lager       : data[0].Station.Positionen.Position.lager,
                        speditionnr : data[0].Station.Positionen.Position.speditionnr,
                        spedition   : data[0].Station.Positionen.Position.spedition,
                        produkt     : data[0].Station.Positionen.Position.produkt,
                        ladedatum   : data[0].Station.Positionen.Position.ladedatum,
                        entladedatum: data[0].Station.Positionen.Position.entladedatum,
                        bemerkung   : data[0].Station.Positionen.Position.bemerkung
                    };
                }
            }

            
            $scope.station_detail = {
                station_id:     data[0].Station.stationid,
                suchbegriff:    data[0].Station.suchbegriff,
                lieferantnr:    data[0].Station.lieferantnr,
                liefernat:      data[0].Station.liefernat,
                ladestellennr:  data[0].Station.ladestellennr,
                ladestelle:     data[0].Station.ladestelle,
                vertragsart:    data[0].Station.vertragsart,
                preisformel:    data[0].Station.preisformel,
                molbo:          data[0].Station.molbo,
                vertragsmenge:  data[0].Station.vertragsmenge
            }

            $scope.station_detail["positionen"] = { position:     $positionen_arr };
        });
    }

    $scope.changeLine = function(station, type){
        $scope.edit_station = station;

        if(type == 'product'){
            for( var i = 0; i < $scope.supplier_products.data.length; i++) {
                if($scope.supplier_products.data[i].product_name == $scope.edit_station.produkt){
                    $scope.setChanges($scope.supplier_products.data[i], 'product');
                }
            }
            if($scope.mobile == 1){
                $scope.width = 'width: 50%';
            }else{
                $scope.width =  "width: 10%";
            }
            $('#changeProductModal').modal('show');
        }

        if(type == 'spedition'){
            for( var i = 0; i < $scope.suppliers.data.length; i++) {
                if($scope.suppliers.data[i].supplier_number == $scope.edit_station.speditionnr){
                    $scope.setChanges($scope.suppliers.data[i], 'spedition');
                }
            }
            if($scope.mobile == 1){
                $scope.width = 'width: 100%';
            }else{
                $scope.width =  "width: 40%";
            }
            $('#changeSpeditionModal').modal('show');
        }

        if(type == 'lager'){
            for( var i = 0; i < $scope.stores.data.length; i++) {
                if($scope.stores.data[i].store_number == $scope.edit_station.lagernr){
                    $scope.setChanges($scope.stores.data[i], 'lager');
                }
            }
            if($scope.mobile == 1){
                $scope.width = 'width: 100%';
            }else{
                $scope.width =  "width: 40%";
            }
            $('#changeLagerModal').modal('show');
        }
    }

    $scope.closeModal = function(type){
        if(type == 'spedition'){
            $('#changeSpeditionModal').modal('hide');
        }
        if(type == 'lager'){
            $('#changeLagerModal').modal('hide');
        }
    }
    
    $scope.setChanges = function(data, type){
        if(type == 'product'){
            $('#getProductList td').switchClass("success", "info");
            $scope.product = data;
            $scope.product_id = data.id;
            $("#getProduct_" + $scope.product.id).switchClass("info", "success");
        }

        if(type == 'spedition'){
            $('#getSpeditionList td').switchClass("success", "info");
            $scope.supplier = data;
            $scope.supplier_id = data.id;
            $("#getSpedition_" + $scope.supplier.id).switchClass("info", "success");
            $("#getSpeditionnr_" + $scope.supplier.id).switchClass("info", "success");
        }

        if(type == 'lager'){
            $('#getLagerList td').switchClass("success", "info");
            $scope.store = data;
            $scope.store_id = data.id;
            $("#getLager_" + $scope.store.id).switchClass("info", "success");
            $("#getLagernr_" + $scope.store.id).switchClass("info", "success");
        }
    }
    
    $scope.updateData = function(data, type){
        if(type == 'product'){
            $scope.edit_station.produkt = data.product_name;
            $scope.edit_station.produkt_row_id = data.row_id;
            $('#changeProductModal').modal('hide');
        }

        if(type == 'spedition'){
            $scope.edit_station.spedition = data.supplier;
            $scope.edit_station.speditionnr = data.supplier_number;
            $scope.edit_station.spedition_row_id = data.row_id;
            $('#changeSpeditionModal').modal('hide');
        }

        if(type == 'lager'){
            $scope.edit_station.lager = data.store;
            $scope.edit_station.lagernr = data.store_number;
            $scope.edit_station.lager_row_id = data.row_id;
            $('#changeLagerModal').modal('hide');
        }
    }

    $scope.showDate = function(index, type, station){
        $scope.edit_station = station;

        if(type == 'ladedatum'){
            $scope.indexLadedatum = index;
        }
        if(type == 'entladedatum'){
            $scope.indexEntladedatum = index;
        }
        if($scope.mobile == 1){
            $scope.width_load = 'width: 140px; margin-right: 20px; padding-right: 20px;';
            $scope.width_check = 'font-size: 150%; margin-left: -16px;';
            if(type == 'ladedatum'){
                $scope.created_time = new Date($scope.edit_station.ladedatum)
                $scope.station.ladedatum =  moment($scope.created_time).format("DD.MM.YYYY");
            }
            if(type == 'entladedatum'){
                $scope.created_time_entladedatum = new Date($scope.edit_station.entladedatum)
                $scope.station.entladedatum =  moment($scope.created_time_entladedatum).format("DD.MM.YYYY");
            }
        }else{
            $scope.width_load =  "max-width: 100px;";
            $scope.width_check = 'font-size: 150%; margin-left: 5px;';
        }
    }

    $scope.acceptDate = function(data, type){
        $scope.edit_station = data;

        if(type == 'ladedatum'){
            $scope.indexLadedatum = -1;
            $scope.edit_station.ladedatum_changed = true;
            if($scope.mobile == 1){
                $scope.value = $("#ladedatum").val();
                $scope.edit_station.ladedatum =  moment($scope.value).format("DD.MM.YYYY");
            }
        }
        if(type == 'entladedatum'){
            $scope.indexEntladedatum = -1;
            $scope.edit_station.entladedatum_changed = true;
            if($scope.mobile == 1){
                $scope.value_entladedatum = $("#entladedatum").val();
                $scope.edit_station.entladedatum =  moment($scope.value_entladedatum).format("DD.MM.YYYY");
            }
        }
    }

    $scope.updateLine = function(data){
        $scope.isDisabled = true;
        $scope.showLoader = true;
        if(!data.produkt_row_id || data.produkt_row_id == ''){
            for( var i = 0; i < $scope.supplier_products.data.length; i++) {
                if($scope.supplier_products.data[i].product_name == data.produkt){
                    data.produkt_row_id = $scope.supplier_products.data[i].row_id;
                }
            }
        }
        StoreService.updateStore(data);
    }

    $scope.show_all_details = false;

    $scope.showAllData = function(){
        $scope.show_all_details = true;
    }

    $scope.hideAllData = function(){
        $scope.show_all_details = false;
    }

    /********************************************************
     * Event Listeners
     * Prospect event listener related to ProspectEditCtrl
     ********************************************************/

    // Edit prospect event listener
    $scope.$on('store.update', function(event, data) {

        $scope.edit_station.lager_row_id = '';
        $scope.edit_station.spedition_row_id = '';
        $scope.edit_station.produkt_row_id = '';
        $scope.edit_station.ladedatum_changed = '';
        $scope.edit_station.entladedatum_changed = '';
        $scope.showLoader = false;

        Notification({message: 'Zeile erfolgreich geändert!' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
        $scope.isDisabled = false;
    });
});