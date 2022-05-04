"use strict";

angular.module('ng-laravel').controller('ArtikelUmbuchungenEditCtrl',function($rootScope,$scope,Notification,ArtikelUmbuchungenService,ForwardRequestService) {

    var vm = this;

    $scope.lieferscheinNr1 = "TEST1";
    $scope.showData = false;
    $scope.showLoader = false;
    $scope.artikelLagerbestand_datatable_options = {
        lengthMenu: [10, 18, 25, 50, 100, 250],
        iDisplayLength: 18,
        columnDefs: [
            {"type": "html-num", "targets": 0},
            { orderable: false, targets: [3] }
        ],
        language: {
            "url": "../assets/vendors/jquery-datatables/js/Plugins/German.json"
        }
    };

    $scope.lieferantenArtikel_datatable_options = {
        lengthMenu: [10, 18, 25, 50, 100, 250],
        iDisplayLength: 18,
        columnDefs: [
            {"type": "html-num", "targets": 0},
            { orderable: false, targets: [4] }
        ],
        language: {
            "url": "../assets/vendors/jquery-datatables/js/Plugins/German.json"
        }
    };


    $scope.personallager = $scope.profile.store;


    $scope.getErpBestellt = function () {
        var length_data;
        $scope.artikel_umbuchungen_erp = [];
        $scope.artikel_umbuchungen_erp_copy = undefined;
        $scope.artikel_positionen_erp = undefined;
        $scope.filter_aktiv = false;
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.MenuFunktion = "ERP";

        ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_BESTELLUNG_LAGER","lager": $scope.personallager}).then(function (data) {
            if (data[0].Bestellungen) {
                if (data[0].Bestellungen.Bestellung && data[0].Bestellungen.Bestellung != '') {
                    if (data[0].Bestellungen.Bestellung.length == undefined) {
                        $scope.artikel_umbuchungen_erp[0] = {
                            belegid: data[0].Bestellungen.Bestellung.Belegid,
                            belegnummer: data[0].Bestellungen.Bestellung.Belegnummer,
                            belegbezeichnung: data[0].Bestellungen.Bestellung.Belegbezeichnung,
                            belegdatum: data[0].Bestellungen.Bestellung.Belegdatum,
                            leistungsdatum: data[0].Bestellungen.Bestellung.Leistungsdatum,
                            lieferantennr: data[0].Bestellungen.Bestellung.Lieferantennr,
                            lieferantenname: data[0].Bestellungen.Bestellung.Lieferantenname,
                            lieferscheinNr: undefined,
                            termin: undefined,
                            buchungsnummer: undefined,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                        //                    console.log($scope.gas_stations[0].tour);
                    } else {
                        length_data = data[0].Bestellungen.Bestellung.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.artikel_umbuchungen_erp[i] = {
                                belegid: data[0].Bestellungen.Bestellung[i].Belegid,
                                belegnummer: data[0].Bestellungen.Bestellung[i].Belegnummer,
                                belegbezeichnung: data[0].Bestellungen.Bestellung[i].Belegbezeichnung,
                                belegdatum: data[0].Bestellungen.Bestellung[i].Belegdatum,
                                leistungsdatum: data[0].Bestellungen.Bestellung[i].Leistungsdatum,
                                lieferantennr: data[0].Bestellungen.Bestellung[i].Lieferantennr,
                                lieferantenname: data[0].Bestellungen.Bestellung[i].Lieferantenname,
                                lieferscheinNr: undefined,
                                termin: undefined,
                                buchungsnummer: undefined,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                            //                        console.log(i+"="+$scope.gas_stations[i].tour);
                        }
                    }
                } else {
                    $scope.artikel_umbuchungen_erp = [];
                }
                $scope.artikel_umbuchungen_erp_copy = angular.copy($scope.artikel_umbuchungen_erp);
                $scope.showData = true;
                $scope.showLoader = false;
                $scope.filter_aktiv = false;
            }
            else {
                if (data[0].result > "0") {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }
        }, function (response) {
            if (response.data) {
                Notification({
                    message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            } else {
                return false;
            }
            $scope.showData = true;
            $scope.showLoader = false;
        });
    };


    $scope.removeFilter = function () {
        $scope.artikel_umbuchungen_erp_copy = angular.copy($scope.artikel_umbuchungen_erp);
        $scope.filter_aktiv = false;
        $scope.artikel_positionen_erp = [];
    }


    $scope.getErpBestelltPositionen = function (pBestellung) {
        var length_data;

        if (!$scope.filter_aktiv) {
            $scope.artikel_positionen_erp = [];
            $scope.showLoader = true;
            // alle Bestellungen aus artikel_umbuchungen_erp_copy ausser der selektierten löschen
            for(var i=$scope.artikel_umbuchungen_erp_copy.length-1; i>=0; i--){
                if ($scope.artikel_umbuchungen_erp_copy[i].belegid != pBestellung.belegid) {
                    $scope.artikel_umbuchungen_erp_copy.splice(i, 1);
                }
            }

            ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_BESTELLUNG_POSITIONEN","belegid": pBestellung.belegid}).then(function (data) {
                if (data[0].Positionen) {
                    if (data[0].Positionen.Position && data[0].Positionen.Position != '') {
                        if (data[0].Positionen.Position.length == undefined) {
                            $scope.artikel_positionen_erp[0] = {
                                belegzeilenid: data[0].Positionen.Position.Belegzeilenid,
                                artikelnummer: data[0].Positionen.Position.Artikelnummer,
                                artikelbezeichnung: data[0].Positionen.Position.Artikelbezeichnung,
                                artikellangtext: data[0].Positionen.Position.Artikellangtext,
                                termin: data[0].Positionen.Position.Termin,
                                vorhandene_menge: data[0].Positionen.Position.Menge,
                                erhaltene_menge: data[0].Positionen.Position.Menge,
                                artikelID: data[0].Positionen.Position.ArtikelID,
                                change_mode: false,
                                showError: 0,
                                showOk: 0
                            };
                            if ($scope.artikel_positionen_erp[0].artikellangtext != undefined && $scope.artikel_positionen_erp[0].artikellangtext.indexOf("<DEU>") > 0) {
                                // Text aus xml <DEU> XXX </DEU> ausschneiden
                                var vLength = $scope.artikel_positionen_erp[0].artikellangtext.indexOf("</DEU>") - $scope.artikel_positionen_erp[0].artikellangtext.indexOf("<DEU>") - "<DEU>".length;
                                $scope.artikel_positionen_erp[0].artikellangtext = $scope.artikel_positionen_erp[0].artikellangtext.substr($scope.artikel_positionen_erp[0].artikellangtext.indexOf("<DEU>") + "<DEU>".length, vLength);
                            }
                        } else {
                            length_data = data[0].Positionen.Position.length;
                            for (var i = 0; i < length_data; i++) {
                                $scope.artikel_positionen_erp[i] = {
                                    belegzeilenid: data[0].Positionen.Position[i].Belegzeilenid,
                                    artikelnummer: data[0].Positionen.Position[i].Artikelnummer,
                                    artikelbezeichnung: data[0].Positionen.Position[i].Artikelbezeichnung,
                                    artikellangtext: data[0].Positionen.Position[i].Artikellangtext,
                                    termin: data[0].Positionen.Position[i].Termin,
                                    vorhandene_menge: data[0].Positionen.Position[i].Menge,
                                    erhaltene_menge: data[0].Positionen.Position[i].Menge,
                                    artikelID: data[0].Positionen.Position[i].ArtikelID,
                                    change_mode: false,
                                    showError: 0,
                                    showOk: 0
                                };
                                if ($scope.artikel_positionen_erp[i].artikellangtext != undefined && $scope.artikel_positionen_erp[i].artikellangtext.indexOf("<DEU>") > 0) {
                                    // xml <DEU> XXX </DEU> ausschneiden
                                    var vLength = $scope.artikel_positionen_erp[i].artikellangtext.indexOf("</DEU>") - $scope.artikel_positionen_erp[i].artikellangtext.indexOf("<DEU>") - "<DEU>".length;
                                    $scope.artikel_positionen_erp[i].artikellangtext = $scope.artikel_positionen_erp[i].artikellangtext.substr($scope.artikel_positionen_erp[i].artikellangtext.indexOf("<DEU>") + "<DEU>".length, vLength);
                                }
                            }
                        }
                        $scope.filter_aktiv = true;
                    } else {
                        $scope.artikel_positionen_erp = [];
                    }
                }
                else {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }, function (response) {
                if (response.data) {
                    Notification({
                        message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                } else {
                    return false;
                }
                $scope.showData = true;
                $scope.showLoader = false;
            });
        }
    };


    $scope.getUmbuchungsForm = function () {
        var vFehlermeldung = "";
        var vKommaFehler = "";
        var i = 0;
        $scope.gewaehlteArtikelErp = {artikeln:[]};
        $scope.artikel_positionen_erp.forEach(function (position) {
            if (parseInt(position.erhaltene_menge) < 0 || isNaN(position.erhaltene_menge)){
                vFehlermeldung += "ArtikelNr: " + position.artikelnummer + " hat Menge " + position.erhaltene_menge + vKommaFehler;
                vKommaFehler = ", ";
            }
            else if (parseInt(position.vorhandene_menge) < parseInt(position.erhaltene_menge) ){
                vFehlermeldung += "ArtikelNr " + position.artikelnummer + ": erhaltene Menge (" + position.erhaltene_menge + ") ist höher als vorhandene Menge (" + position.vorhandene_menge + ") -> bitte korrigieren!"+ vKommaFehler;
                vKommaFehler = ", ";
            }
            if (parseInt(position.erhaltene_menge) > 0) {
                $scope.gewaehlteArtikelErp.artikeln[i++] = {
                    posid: position.belegzeilenid,
                    menge: position.erhaltene_menge
                }
            }
        });
        if (vFehlermeldung !== "") {
            Notification({
                message: vFehlermeldung,
                templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
            }, 'error');
        }
        else{
            if($scope.gewaehlteArtikelErp.artikeln.length > 0) {
                $('#umbuchungFormModal').modal({'modal': 'show', 'backdrop': 'static'});
                $scope.setDatePicker("date");
            }
            else{
                Notification({
                    message: "Es wurde keine Artikel mit einer positiven erhaltenen Menge gewählt",
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/warning.tpl.html'
                }, 'warning');
            }
        }
    }


    $scope.cancel = function (pFormName) {
        $('#' + pFormName).modal('hide');
    }


    $scope.umbuchen = function () {

        var vArtikel = "";
        var vKomma = "";
        var length_data;
        $scope.showLoader = true;

        $scope.gewaehlteArtikelErp.artikeln.forEach(function (position) {
            vArtikel = vArtikel + vKomma + '{"position":{"belegid":"' + $scope.artikel_umbuchungen_erp_copy[0].belegid + '","posid":"' + position.posid + '","menge":"' + position.menge + '"}}';
            vKomma = ',';
        });
        var queryString = '{"makro":"_SV_NETFRAME_RSD_IMPORT_BESTELLABRUF","belegid":"' + $scope.artikel_umbuchungen_erp_copy[0].belegid + '","lieferscheinnr":"' + $scope.artikel_umbuchungen_erp_copy[0].lieferscheinnr + '","termin":"' + $scope.artikel_umbuchungen_erp_copy[0].termin
            + '","Positionen":[' + vArtikel + ']}';

        ArtikelUmbuchungenService.get(queryString).then(function (data) {
                $('#umbuchungFormModal').modal('hide');
                $scope.showLoader = false;
                if (data[0] && data[0].belegnummer != undefined) {
                    if (data[0].status == 0) {
                        Notification({
                            message: 'Erfassung wurde durchgeführt! Buchungsnummer: ' + data[0].belegnummer,
                            templateUrl: 'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                        }, 'success');
                        $scope.artikel_umbuchungen_erp_copy[0].buchungsnummer = data[0].belegnummer;
                        $scope.artikel_umbuchungen_erp_copy[0].showButton = false;
                        $scope.artikel_umbuchungen_erp_copy[0].showOk = true;
                        $scope.artikel_umbuchungen_erp_copy[0].showError = undefined;
                    }
                    else {
                        $scope.artikel_umbuchungen_erp_copy[0].showError = 'Erfassung wurde nicht durchgeführt!' + data[0].statustext;
                        Notification({
                            message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + data[0].statustext,
                            templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                        }, 'error');
                    }
                }
                else {
                    $scope.artikel_umbuchungen_erp_copy[0].showError = 'Erfassung wurde nicht durchgeführt!' + JSON.stringify(data);
                    Notification({
                        message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showLoader = false;
            },
            function (response) {
                $('#umbuchungFormModal').modal('hide');
                $scope.showLoader = false;
                $scope.artikel_umbuchungen_erp_copy[0].showError = 'Erfassung wurde nicht durchgeführt! (' + response.status + "-" + response.statusText + ")";
                Notification({
                    message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            });
    }


    $scope.getLagerbestand = function (pFunktion) {
        var length_data;
        $scope.personallaeger = [];
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.laegerGeladen = false;
        $scope.MenuFunktion = pFunktion;

        ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_PERSONAL_MATERIALLAGER","lagernr": $scope.personallager}).then(function (data) {
            if (data[0].PersonalLaeger) {
                if (data[0].PersonalLaeger.PersonalLaeger.PersonalLager && data[0].PersonalLaeger.PersonalLaeger.PersonalLager != '') {
                    if (data[0].PersonalLaeger.PersonalLaeger.PersonalLager.length == undefined) {
                        $scope.personallaeger[0] = {
                            lagerid: data[0].PersonalLaeger.PersonalLaeger.PersonalLager.lagerid,
                            lagernr: data[0].PersonalLaeger.PersonalLaeger.PersonalLager.lagernr,
                            lagerbezeichnung: data[0].PersonalLaeger.PersonalLaeger.PersonalLager.lagerbezeichnung,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                        //                    console.log($scope.gas_stations[0].tour);
                    } else {
                        length_data = data[0].PersonalLaeger.PersonalLaeger.PersonalLager.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.personallaeger[i] = {
                                lagerid: data[0].PersonalLaeger.PersonalLaeger.PersonalLager[i].lagerid,
                                lagernr: data[0].PersonalLaeger.PersonalLaeger.PersonalLager[i].lagernr,
                                lagerbezeichnung: data[0].PersonalLaeger.PersonalLaeger.PersonalLager[i].lagerbezeichnung,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                            //                        console.log(i+"="+$scope.gas_stations[i].tour);
                        }
                    }
                } else {
                    $scope.personallaeger = [];
                }
                $scope.laegerGeladen = true;
                $scope.showLoader = false;
            }
            else {
                if (data[0].result > "0") {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showLoader = false;
            }
        }, function (response) {
            if (response.data) {
                Notification({
                    message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            } else {
                return false;
            }
            $scope.showLoader = false;
        });
    };


    $scope.getArtikelAusLagerbestand = function () {
        var length_data;
        var vAbgangslagernr;
        $scope.lagerArtikel = [];
        $scope.gewaehlteArtikel = {};
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.filter_aktiv = false;
        $.fn.dataTable.ext.search.pop();
        // Lager umdrehen bei ausLagerbestand und ausMeinemLagerbestand
        if($scope.MenuFunktion == 'AUS_LAGERBESTAND')
            vAbgangslagernr = $scope.store.lagernr;
        else
            vAbgangslagernr = $scope.personallager;

        ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_ABGANGSLAGER_ARTIKEL","abgangslagernr": vAbgangslagernr}).then(function (data) {
            if (data[0].LagerProdukte) {
                if (data[0].LagerProdukte.LagerProdukte.LagerProdukt && data[0].LagerProdukte.LagerProdukte.LagerProdukt != '') {
                    if (data[0].LagerProdukte.LagerProdukte.LagerProdukt.length == undefined) {
                        $scope.lagerArtikel[0] = {
                            artikelid: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelid,
                            artikelnr: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelnr,
                            artikelbezeichnung: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelbezeichnung,
                            artikelgruppennr: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelgruppennr.trim(),
                            artikellangtext: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikellangtext,
                            bestand: data[0].LagerProdukte.LagerProdukte.LagerProdukt.bestand,
                            menge: undefined,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                    } else {
                        length_data = data[0].LagerProdukte.LagerProdukte.LagerProdukt.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.lagerArtikel[i] = {
                                artikelid: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelid,
                                artikelnr: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelnr,
                                artikelbezeichnung: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelbezeichnung,
                                artikelgruppennr: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelgruppennr.trim(),
                                artikellangtext: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikellangtext,
                                bestand: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].bestand,
                                menge: undefined,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                        }
                    }
                } else {
                    $scope.lagerArtikel = [];
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }
            else {
                if (data[0].result > "0") {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }
        }, function (response) {
            if (response.data) {
                Notification({
                    message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            } else {
                return false;
            }
            $scope.showData = true;
            $scope.showLoader = false;
        });
    };



    $scope.setzeArtikelFilter = function (pTableId) {
        var vArray;
        if(pTableId ==="artikelLagerbestandTable")
            vArray = $scope.lagerArtikel;
        else
            vArray = $scope.lieferantenArtikel;
        $.fn.dataTable.ext.search.push(
            function( settings, data, dataIndex, row, counter ) {
                if(vArray[dataIndex].menge != undefined && vArray[dataIndex].menge != "")
                    return true;
                else
                    return false;
            }
        );
        $scope.filter_aktiv = true;
        $("#"+pTableId).DataTable().draw();
    }



    $scope.removeArtikelFilter = function(pTableId){
        $.fn.dataTable.ext.search.pop();
        $scope.filter_aktiv = false;
        $("#"+pTableId).DataTable().draw();
    }



    $scope.getUmbuchungBestaetigungForm = function (pModus) {
        var vFehlerMeldung = "";
        var vKommaFehler = "";
        var vArtikelArray;
        var i = 0;
        var vMenge;

        $scope.modus = pModus;
        $scope.gewaehlteArtikel = {"lieferscheinNr":undefined,artikeln:[]};
        if(pModus == 'artikelLagerbestand') {
            vArtikelArray = $scope.lagerArtikel;
        }
        else {
            vArtikelArray = $scope.lieferantenArtikel;
        }
        vArtikelArray.forEach(function (item) {
            if (item.menge != undefined && item.menge != "") {
                vMenge = parseFloat(item.menge.replace(",","."));
                if ( vMenge <= 0 || isNaN(vMenge)) {
                    vFehlerMeldung += "ArtikelNr: " + item.artikelnr + " hat Menge " + item.menge + vKommaFehler;
                    vKommaFehler = ", ";
                }
                else if( pModus == 'artikelLagerbestand' && vMenge > parseInt(item.bestand) ){
                    vFehlerMeldung += "ArtikelNr: " + item.artikelnr + ": Menge ( " + item.menge + " ) ist höher als Bestand ( "+item.bestand+" )" + vKommaFehler;
                    vKommaFehler = ", ";
                }
                $scope.gewaehlteArtikel.artikeln[i++] = {
                    artikelnr: item.artikelnr,
                    artikelid: item.artikelid,
                    artikelbezeichnung: item.artikelbezeichnung,
                    artikelgruppennr: item.artikelgruppennr,
                    serienNrArray: item.serienNrArray,
                    serienNrSelectedArray: [],
                    menge: item.menge
                }
            }
        });
        if (vFehlerMeldung != "") {
            Notification({
                message: "Fehlerhafte Menge, bitte korrigieren! " + vFehlerMeldung,
                templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
            }, 'error');
        }
        else {
            $scope.checkAmountlSelektedSerienNr();
            $('#umbuchungBestaetigungFormModal').modal({'modal': 'show', 'backdrop': 'static'});
        }

    }

    $scope.checkAmountlSelektedSerienNr = function (){
        $scope.alleSeriennummernGewaehlt = true;
        $scope.gewaehlteArtikel.artikeln.forEach(function (item) {
            if( item.artikelgruppennr === "4110" ){
                //console.log("Menge:"+item.menge+" Arr:"+item.serienNrSelectedArray.length);
                if(item.menge!=item.serienNrSelectedArray.length){
                    $scope.alleSeriennummernGewaehlt = false;
                }
            }
        });
//        console.log("Erg: " +      $scope.alleSeriennummernGewaehlt);
    }

    $scope.checkAmountlDeSelektedSerienNr = function (){
        $scope.alleSeriennummernGewaehlt = false;
    }

    $scope.multiSelectEvents = {
        onItemSelect:   $scope.checkAmountlSelektedSerienNr,
        onItemDeselect: $scope.checkAmountlSelektedSerienNr,
        onDeselectAll: $scope.checkAmountlDeSelektedSerienNr
    }


    $scope.artikelLagerbestandUmbuchen = function () {
        var vArtikel = "";
        var vSeriennummer = "";
        var vKomma = "";
        var queryString = "";
        var length_data;
        $scope.gewaehlteArtikel.buchungsnummer = undefined;
        $scope.showLoader = true;

        $scope.gewaehlteArtikel.artikeln.forEach(function (artikel) {
            if(artikel.artikelgruppennr === "4110"){
//                artikel.serienNrArrayNeu = angular.copy(artikel.serienNrArray);
                artikel.serienNrSelectedArray.forEach(function (zaehler, index){
                    if(index==0) {
                        vSeriennummer = ',"zaehler":[{"objekt":{"id":"'+zaehler.id+'"}}';
                    }
                    else{
                        vSeriennummer += ',{"objekt":{"id":"'+zaehler.id+'"}}';
                    }
                    // Array für Seriennummern vorbereiten, wo die zu übertragenen schon fehlen
                    // artikel.serienNrArrayNeu.forEach(function (item, index, arr){
                    //     if(item.id === zaehler.id){
                    //         arr.splice(index, 1);
                    //     }
                    // });
                });
                vSeriennummer += "]";
            }
            else {
                vSeriennummer = ',"zaehler":[]';
            }
            vArtikel += vKomma + '{"artikel":{"artikelnr":"' + artikel.artikelnr + '","menge":"' + artikel.menge + '"'+vSeriennummer+'}}';
            vKomma = ',';
        });
        // Einmal vom Hauptlager auf Personallager und umgekehrt
        if($scope.MenuFunktion === 'AUS_LAGERBESTAND')
            queryString = '{"makro":"_SV_NETFRAME_RSD_IMPORT_MATERIALUMBUCHUNG","abgangslagernr":"' + $scope.store.lagernr + '","lagernr":"' + $scope.personallager + '","datum":"' + moment().format("DD.MM.YYYY") + '","positionen":[' + vArtikel + ']}';
        else
            queryString = '{"makro":"_SV_NETFRAME_RSD_IMPORT_MATERIALUMBUCHUNG","abgangslagernr":"' + $scope.personallager + '","lagernr":"' + $scope.store.lagernr + '","datum":"' + moment().format("DD.MM.YYYY") + '","positionen":[' + vArtikel + ']}';

        ArtikelUmbuchungenService.get(queryString).then(function (data) {
            $('#umbuchungBestaetigungFormModal').modal('hide');
            $scope.showLoader = false;
            if (data[0] && data[0].belegnummer != undefined) {
                if (data[0].status == 0) {
                    Notification({
                        message: 'Erfassung wurde durchgeführt! Buchungsnummer: ' + data[0].belegnummer,
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                    }, 'success');
                    $scope.gewaehlteArtikel.buchungsnummer = data[0].belegnummer;
                    var vRemainingArtikel = [];
                    $scope.lagerArtikel.forEach(function (item, index) {
                        if(parseInt(item.menge) < parseInt(item.bestand) || item.menge == undefined){
                            if (item.menge != undefined) {
                                item.bestand = item.bestand - item.menge;
                                item.menge = undefined;
                            }
                            if( item.bestand !== 0 )
                                vRemainingArtikel.push(item);
                        }
                    });
                    // $scope.gewaehlteArtikel.artikeln.forEach(function (artikel) {
                    //     if (artikel.artikelgruppennr === "4110") {
                    //         artikel.serienNrArray = artikel.serienNrArrayNeu;
                    //     }
                    // });
                    // gewählte Artikel löschen
                    $scope.gewaehlteArtikel.artikeln = [];
                    // Übertragene Artikel aus dem Bestand entfernen
                    $scope.lagerArtikel = vRemainingArtikel;
                }
                else {
                    Notification({
                        message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + data[0].statustext,
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
            }
            else {
                Notification({
                    message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + JSON.stringify(data),
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            }
            $scope.showLoader = false;
        },
        function (response) {
            $('#umbuchungFormModal').modal('hide');
            $scope.showLoader = false;
            Notification({
                message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
            }, 'error');
        });
    }


    $scope.getLieferanten = function(){
        var length_data;
        $scope.lieferantenGeladen = false;
        $scope.lieferanten = [];
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.MenuFunktion = "SELBST";

        ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_MATERIAL_LIEFERANTEN","lagernr": $scope.personallager}).then(function (data) {
            if (data[0].MaterialLieferanten) {
                if (data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant && data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant != '') {
                    if (data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.length == undefined) {
                        $scope.lieferanten[0] = {
                            lieferantenid: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.lieferantenid,
                            lieferantennr: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.lieferantennr,
                            lieferantenname: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.lieferantennr + " - " +
                                             data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.lieferantenname,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                        //                    console.log($scope.gas_stations[0].tour);
                    } else {
                        length_data = data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.lieferanten[i] = {
                                lieferantenid: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant[i].lieferantenid,
                                lieferantennr: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant[i].lieferantennr,
                                lieferantenname: data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant[i].lieferantennr + " - " +
                                                 data[0].MaterialLieferanten.MaterialLieferanten.MaterialLieferant[i].lieferantenname,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                        }
                    }
                }
                $scope.showLoader = false;
                $scope.lieferantenGeladen = true;
            }
            else {
                if (data[0].result > "0") {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showLoader = false;
            }
        }, function (response) {
            if (response.data) {
                Notification({
                    message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            } else {
                return false;
            }
            $scope.showLoader = false;
        });

    }


    $scope.getLieferantenArtikel = function (pLieferantId) {
        var length_data;
        $scope.lieferantenArtikel = [];
        $scope.gewaehlteArtikel = {};
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.filter_aktiv = false;
        $.fn.dataTable.ext.search.pop();
        $scope.lieferanten.forEach(function (lieferant) {
            if( lieferant.lieferantenid === pLieferantId )
                $scope.lieferantennr = lieferant.lieferantennr;
        });

        ArtikelUmbuchungenService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_LIEFERANTEN_ARTIKEL","lieferantenid": pLieferantId}).then(function (data) {
            if (data[0].LieferantenProdukte) {
                if (data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt && data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt != '') {
                    if (data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.length == undefined) {
                        $scope.lieferantenArtikel[0] = {
                            artikelid: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.artikelid,
                            artikelnr: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.artikelnr,
                            artikelbezeichnung: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.artikelbezeichnung,
                            artikellangtext: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.artikellangtext,
                            bestellnummer: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.bestellnummer,
                            ekm: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.ekm,
                            std: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.std,
                            menge: undefined,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                    } else {
                        length_data = data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.lieferantenArtikel[i] = {
                                artikelid: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].artikelid,
                                artikelnr: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].artikelnr,
                                artikelbezeichnung: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].artikelbezeichnung,
                                artikellangtext: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].artikellangtext,
                                bestellnummer: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].bestellnummer,
                                ekm: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].ekm,
                                std: data[0].LieferantenProdukte.LieferantenProdukte.LieferantenProdukt[i].std,
                                menge: undefined,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                        }
                    }
                } else {
                    $scope.lieferantenArtikel = [];
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }
            else {
                if (data[0].result > "0") {
                    Notification({
                        message: 'Fehlerhafte Daten von der ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showData = true;
                $scope.showLoader = false;
            }
        }, function (response) {
            if (response.data) {
                Notification({
                    message: 'Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            } else {
                return false;
            }
            $scope.showData = true;
            $scope.showLoader = false;
        });
    };


    $scope.lieferantenArtikelUmbuchen = function () {
        var vArtikel = "";
        var vKomma = "";
        var length_data;
        $scope.gewaehlteArtikel.buchungsnummer = undefined;
        $scope.showLoader = true;

        $scope.gewaehlteArtikel.artikeln.forEach(function (position) {
            vArtikel += vKomma + '{"artikel":{"artikelnr":"' + position.artikelnr + '","menge":"' + position.menge + '"}}';
            vKomma = ',';
        });
        var queryString = '{"makro":"_SV_NETFRAME_RSD_IMPORT_MATERIALWARENEINGANG","lieferantennr":"' + $scope.lieferantennr + '","lagernr":"' + $scope.personallager + '","datum":"' + moment().format("DD.MM.YYYY") + '","lieferscheinnr":"' + $scope.gewaehlteArtikel.lieferscheinNr1 + '","positionen":[' + vArtikel + ']}';

        ArtikelUmbuchungenService.get(queryString).then(function (data) {
                $('#umbuchungBestaetigungFormModal').modal('hide');
                $scope.showLoader = false;
                if (data[0] && data[0].belegnummer != undefined) {
                    if (data[0].status == 0) {
                        Notification({
                            message: 'Erfassung wurde durchgeführt! Buchungsnummer: ' + data[0].belegnummer,
                            templateUrl: 'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                        }, 'success');
                        $scope.gewaehlteArtikel.buchungsnummer = data[0].belegnummer;
                        $scope.lieferantenArtikel.forEach(function (item) {
                            if (item.menge != undefined) {
                                item.menge = undefined;
                            }
                        });
                    }
                    else {
                        Notification({
                            message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + data[0].statustext,
                            templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                        }, 'error');
                    }
                }
                else {
                    Notification({
                        message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + JSON.stringify(data),
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                }
                $scope.showLoader = false;
            },
            function (response) {
                $('#umbuchungFormModal').modal('hide');
                $scope.showLoader = false;
                Notification({
                    message: 'Erfassung wurde nicht durchgeführt! Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            });
    }


    $scope.getSeriennummern = function (pArtikel){
        var length_data;
        var vLager;
        if(pArtikel.artikelgruppennr === "4110" && pArtikel.serienNrArray==undefined){
            pArtikel.serienNrArray = [];
            pArtikel.serienNrSelectedArray = [];
            if($scope.MenuFunktion == 'AUS_LAGERBESTAND'){
                vLager = $scope.store.lagernr;
            } else  if($scope.MenuFunktion == 'AUS_MEINEM_LAGERBESTAND'){
                vLager = $scope.personallager;
            }
            ForwardRequestService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_ABGANGSLAGER_SN_BESTAND","abgangslagernr": vLager,"artikelid":pArtikel.artikelid}).then(function (data) {
                if (data[0].LagerBestaende.LagerBestaende.LagerBestand && data[0].LagerBestaende.LagerBestaende.LagerBestand != '') {
                    length_data = data[0].LagerBestaende.LagerBestaende.LagerBestand.length;
                    if (length_data  == undefined) {
                        pArtikel.serienNrArray[0] = {
                            id:       data[0].LagerBestaende.LagerBestaende.LagerBestand.objektid,
                            label:    data[0].LagerBestaende.LagerBestaende.LagerBestand.seriennr + ' - '
                                    + data[0].LagerBestaende.LagerBestaende.LagerBestand.herstellernr + ' - '
                                    + data[0].LagerBestaende.LagerBestaende.LagerBestand.baujahr
                            // baujahr             : data[0].serienNrArray.LagerBestand.baujahr,
                            // herstellerid        : data[0].LagerBestaende.LagerBestaende.LagerBestand.herstellerid,
                            // herstellernr        : data[0].LagerBestaende.LagerBestaende.LagerBestand.herstellernr,
                            // objektid            : data[0].LagerBestaende.LagerBestaende.LagerBestand.objektid,
                            // objektnr            : data[0].LagerBestaende.LagerBestaende.LagerBestand.objektnr,
                            // seriennr            : data[0].LagerBestaende.LagerBestaende.LagerBestand.seriennr
                        }
                    } else {
                        for (var i = 0; i < length_data; i++) {
                            pArtikel.serienNrArray[i] = {
                                id:      data[0].LagerBestaende.LagerBestaende.LagerBestand[i].objektid,
                                label:   data[0].LagerBestaende.LagerBestaende.LagerBestand[i].seriennr + ' - '
                                       + data[0].LagerBestaende.LagerBestaende.LagerBestand[i].herstellernr + ' - '
                                       + data[0].LagerBestaende.LagerBestaende.LagerBestand[i].baujahr
                            }
                        }
                    }
                }
            }, function (response) {
                if (response.data) {
                    Notification({
                        message: 'Keine Daten zu Seriennummern --> fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                        templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                    }, 'error');
                } else {
                    return false;
                }
            });
        }
    }



    $scope.setDatePicker = function(elementId){
        $(document).ready(function() {
            if (!$.fn.bootstrapDP && $.fn.datepicker && $.fn.datepicker.noConflict) {
                var datepicker = $.fn.datepicker.noConflict();
                $.fn.bootstrapDP = datepicker;
            }
            $("#"+elementId).datepicker({
                dateFormat: "dd.mm.yy",
                firstDay: 1,
                defaultDate: "+1d",
                closeText: 'Kalender schließen',
                currentText: 'Heute',
                dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober',  'November', 'Dezember'],
                showButtonPanel: true,
                showAnim: 'blind',
                ignoreReadonly: true,
                allowInputToggle: true
            });
        });
    }


    /********************************************************
     * Event Listeners
     * Prospect event listener related to ProspectEditCtrl
     ********************************************************/

    // Edit  event listener
});
