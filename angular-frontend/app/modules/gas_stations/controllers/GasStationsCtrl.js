"use strict";

angular.module('ng-laravel').controller('GasStationsCtrl',function($rootScope,$scope,Notification,GasStationsService,CopyService){

    $scope.showData = false;
    $scope.showLoader = false;
    $scope.gas_stations = [];
    $scope.datatable_options = {
        // date Sortierung für ltztLieferung, SpaltenIndex = 11
        // wenn neue Spalten zwischendurch kommen, dann muss der Index angepasst werden
        columnDefs: [
            { type: 'de_date', targets: [13,14] },
            { orderable: false, targets: [15,16] }
        ]
    };
//    $scope.searchLoading = false;
    $scope.touren = [];//[{"name":"T1","ladedatum":"20.09.2018","lager":"E01","lademenge":"20000"},{"name":"T2","ladedatum":"02.10.2018","lager":"E03","lademenge":"18000"}];
    GasStationsService.getTerminals().then(function(data){
        $scope.terminals = data.plain();
    });



    $scope.search = function(lieferantenId){
        var length_data;
        $scope.selected_lieferantenId = lieferantenId;
        $scope.showLoader = true;

        GasStationsService.search( { "lieferantenId" : $scope.selected_lieferantenId } ).then(function (data) {
            if (data[0].Tankstellen.Tankstelle && data[0].Tankstellen.Tankstelle != '') {
                if (data[0].Tankstellen.Tankstelle.length == undefined) {
                    $scope.gas_stations[0] = {
                        projektid           : data[0].Tankstellen.Tankstelle.Projektid,
                        projektnummer       : data[0].Tankstellen.Tankstelle.Projektnummer,
                        geopos_laenge       : data[0].Tankstellen.Tankstelle.GeoPosLng,
                        geopos_breite       : data[0].Tankstellen.Tankstelle.GeoPosLat,
                        name1               : data[0].Tankstellen.Tankstelle.Name1,
                        strasse             : data[0].Tankstellen.Tankstelle.Strasse,
                        plz                 : data[0].Tankstellen.Tankstelle.PLZ,
                        ort                 : data[0].Tankstellen.Tankstelle.Ort,
                        nachtlieferung      : data[0].Tankstellen.Tankstelle.Nachtlieferung,
                        anlieferzeiten      : data[0].Tankstellen.Tankstelle.Anlieferzeiten,
                        liefertage          : data[0].Tankstellen.Tankstelle.Liefertage,
                        raffinerieTerminal  : data[0].Tankstellen.Tankstelle.Raffinerie_Terminal,
                        behaelter           : data[0].Tankstellen.Tankstelle.Behaelter,
                        seriennr            : data[0].Tankstellen.Tankstelle.Seriennr,
                        ltztLieferung       : data[0].Tankstellen.Tankstelle.ltztLieferung,
                        nLieferung          : data[0].Tankstellen.Tankstelle.nLieferung,
                        tour                : data[0].Tankstellen.Tankstelle.tour,
                        showError:0,
                        showOk:0
                    };
//                    console.log($scope.gas_stations[0].tour);
                } else {
                    length_data = data[0].Tankstellen.Tankstelle.length;
                    for (var i = 0; i < length_data; i++) {
                        $scope.gas_stations[i] = {
                            projektid           : data[0].Tankstellen.Tankstelle[i].Projektid,
                            projektnummer       : data[0].Tankstellen.Tankstelle[i].Projektnummer,
                            geopos_laenge       : data[0].Tankstellen.Tankstelle[i].GeoPosLng,
                            geopos_breite       : data[0].Tankstellen.Tankstelle[i].GeoPosLat,
                            name1               : data[0].Tankstellen.Tankstelle[i].Name1,
                            strasse             : data[0].Tankstellen.Tankstelle[i].Strasse,
                            plz                 : data[0].Tankstellen.Tankstelle[i].PLZ,
                            ort                 : data[0].Tankstellen.Tankstelle[i].Ort,
                            nachtlieferung      : data[0].Tankstellen.Tankstelle[i].Nachtlieferung,
                            anlieferzeiten      : data[0].Tankstellen.Tankstelle[i].Anlieferzeiten,
                            liefertage          : data[0].Tankstellen.Tankstelle[i].Liefertage,
                            raffinerieTerminal  : data[0].Tankstellen.Tankstelle[i].Raffinerie_Terminal,
                            behaelter           : data[0].Tankstellen.Tankstelle[i].Behaelter,
                            seriennr            : data[0].Tankstellen.Tankstelle[i].Seriennr,
                            ltztLieferung       : data[0].Tankstellen.Tankstelle[i].ltztLieferung,
                            nLieferung          : data[0].Tankstellen.Tankstelle[i].nLieferung,
                            tour                : data[0].Tankstellen.Tankstelle[i].tour,
                            showError:0,
                            showOk:0
                        };
//                        console.log(i+"="+$scope.gas_stations[i].tour);
                    }
                }
            }else{
                $scope.gas_stations = [];
            }
            $scope.showData = true;
            $scope.showLoader = false;

        });
    };

    $scope.search("6692");

    $scope.tourBuild = function(tourData){
        if(tourData != undefined) {
            $scope.editTour = tourData;
            $scope.oldTour = {};
            $scope.oldTour.name = tourData.name;
            $scope.oldTour.ladedatum = tourData.ladedatum;
            $scope.oldTour.lager = tourData.lager;
            $scope.oldTour.lademenge = tourData.lademenge;
        }
        else{
            $scope.editTour = {"name":"","ladedatum":"","lager":"","lademenge":"", "modus":"I"};
        }
        $('#buildTourModal').modal( {'modal' : 'show', 'backdrop' : 'static' } );
    }

    $scope.tourBuildAbbrechen = function(){
        if($scope.oldTour != undefined){
            $scope.editTour.name        = $scope.oldTour.name;
            $scope.editTour.ladedatum   = $scope.oldTour.ladedatum;
            $scope.editTour.lager       = $scope.oldTour.lager;
            $scope.editTour.lademenge   = $scope.oldTour.lademenge;
        }
        $('#buildTourModal').modal('hide');
    }


    $scope.setStyles = function(){

        if($scope.editTour.name != undefined && $scope.editTour.name != ""){
            $scope.tour_style = '';
        }else{
            $scope.tour_style = 'border-color: darkred; border-width: 2px;';
        }
        if($scope.editTour.ladedatum != undefined && $scope.editTour.ladedatum != ""){
            $scope.ladedatum_style = '';
        }else{
            $scope.ladedatum_style = 'border-color: darkred; border-width: 2px;';
        }
        if($scope.editTour.lager != undefined && $scope.editTour.lager != ""){
            $scope.lager_style = '';
        }else{
            $scope.lager_style = 'border-color: darkred; border-width: 2px;';
        }
        if($scope.editTour.lademenge != undefined && $scope.editTour.lademenge != ""){
            $scope.lademenge_style = 'width: 50%';
        }else{
            $scope.lademenge_style = 'border-color: darkred; border-width: 2px; width: 50%';
        }
    }

    $scope.changeTour = function(tour,index){
        $scope.entlade_index = index;
        console.log($scope.entlade_index);

        $scope.chTour = tour;
        if($scope.chTour != undefined && $scope.chTour.tour){
            for( var i = 0; i < $scope.touren.length; i++) {
                if($scope.touren[i].name == $scope.chTour.tour){
                    $scope.setChangesTour($scope.touren[i]);
                }
            }
        }
        if($scope.mobile == 1){
            $scope.width = 'width: 50%';
        }else{
            $scope.width =  "width: 10%";
        }
        $('#changeTourModal').modal('show');
    }

    $scope.createTour = function(data){
        if( data.modus == "I" ){
            $scope.touren.push({"name":data.name,"ladedatum":data.ladedatum,"lager":data.lager,"lademenge":data.lademenge,"entladedatum":data.ladedatum});
        }
        $('#buildTourModal').modal('hide');
    }

    $scope.setChangesTour = function(data){
        $scope.tour = data;
        $scope.tour_name = data.name;
        $("#TourModalTable > tbody > tr").each( function( index ) {
            $( this ).find("td").switchClass("success","info");
        });
        $("#tour_" + data.name).switchClass("info","success");
    }

    $scope.updateTour = function(tour){
   //     console.log(tour);
        $scope.gas_stations[$scope.entlade_index].entladedatum = tour.entladedatum;

        $scope.chTour.tour = tour.name;
        $scope.chTour.changed = true;
        $('#changeTourModal').modal('hide');
    }

    $scope.cancelUpdate = function(tour){
        $('#changeTourModal').modal('hide');
    }

    $scope.transmitTourToErp = function(tour,index,event){
 //       console.log($scope.gas_stations);
 //       console.log(tour);

        var vTour = tour.tour;
        var vZielTourTr = $("#tourTable > tbody > tr > td:contains('"+vTour+"')").closest("tr");
        var vLadedatum = vZielTourTr.find("td:eq(1)").text();
        var vLager = vZielTourTr.find("td:eq(2)").text();
        var vLademenge = vZielTourTr.find("td:eq(3)").text();
        var vProjekte = "";
        var jsonString;
        var vKomma = "";
        var vTours = [];
        $scope.searchLoading = [];
        $scope.searchLoading[index] = true;
        // Query aus projekten bilden
        for(var i=0; i < $scope.gas_stations.length; i++){
            if($scope.gas_stations[i].tour == vTour && $scope.gas_stations[i].changed == true){
                vProjekte = vProjekte + vKomma + '{"Projekt":{"Projektnr":"' + $scope.gas_stations[i].projektnummer + '", "Entladedatum":"' + $scope.gas_stations[i].entladedatum + '"}}';
                $scope.gas_stations[i].changed = false;
                vKomma = ',';
                vTours.push(i);
            }
        }
        jsonString = '{"tour":"'+vTour+'", "ladedatum":"'+vLadedatum+'","lager":"'+vLager+'","lademenge":"'+vLademenge+'","Positionen":['+vProjekte+']}';
//        console.log(jsonString);

        GasStationsService.insertGasStationsTour(jsonString).then(function (data) {
            if(data[0].status == 0){
//                console.log("data: "+data[0].statustext);
                Notification({message: 'Tour '+vTour+' build successfully' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
                $scope.searchLoading[index] = false;
                for(var i=vTours[0]; i< vTours.length; i++){
                    $scope.gas_stations[i].showError = 0;
                    $scope.gas_stations[i].showOk = 1;
                }
            }
            else{
//                console.log("data: "+data[0].statustext);
                Notification({message: data[0].statustext ,templateUrl:'app/vendors/angular-ui-notification/tpl/validation.tpl.html'},'error');
                $scope.searchLoading[index] = false;
                for(var i=vTours[0]; i< vTours.length; i++){
                    $scope.gas_stations[index].showError = 0;
                    $scope.gas_stations[index].showOk = 1;
                    $scope.gas_stations[index].changed = true;
                }
            }
        });
    }



    $scope.copyTourenToClipboard = function () {
        var vTouren = "tour;ladedatum;terminal;lademenge"+"\r\n";
        $scope.touren.forEach(function (tour) {
            vTouren += tour.name+";"+tour.ladedatum+";"+tour.lager+";"+tour.lademenge+"\r\n";
        });
        CopyService.copyTextToClipboard(vTouren,"main");
    }

    /********************************************************
     * Event Listeners
     * Prospect event listener related to ProspectEditCtrl
     ********************************************************/

    // Edit  event listener
});
