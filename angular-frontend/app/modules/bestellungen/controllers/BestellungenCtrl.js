"use strict";

angular.module('ng-laravel').controller('BestellungenCtrl',function($rootScope,$scope,Notification,ForwardRequestService) {

    $scope.showData = false;
    $scope.showLoader = false;
    $scope.datatable_options = {
        lengthMenu: [10, 18, 25, 50, 100, 250],
        iDisplayLength: 18,
        columnDefs: [
            {"type": "html-num", "targets": 0},
            { orderable: false, targets: [2] }
        ],
        language: {
            "url": "../assets/vendors/jquery-datatables/js/Plugins/German.json"
        }
    };

    $scope.personalnummer = $scope.profile.store;


    $scope.getBestellungen = function () {
        var length_data;
        $scope.bestellungen = [];
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.enableButtons = true;

        ForwardRequestService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_BESTELLUNG_FREIGABE","personalnr": $scope.personalnummer}).then(function (data) {
            if (data[0].Bestellungen) {
                if (data[0].Bestellungen.Bestellung && data[0].Bestellungen.Bestellung != '') {
                    if (data[0].Bestellungen.Bestellung.length == undefined) {
                        $scope.bestellungen[0] = {
                            belegid             : data[0].Bestellungen.Bestellung.Belegid,
                            belegnummer         : data[0].Bestellungen.Bestellung.Belegnummer,
                            belegbezeichnung    : data[0].Bestellungen.Bestellung.Belegbezeichnung,
                            belegdatum          : data[0].Bestellungen.Bestellung.Belegdatum,
                            leistungsdatum      : data[0].Bestellungen.Bestellung.Leistungsdatum,
                            lieferantennr       : data[0].Bestellungen.Bestellung.Lieferantennr,
                            lieferantenname     : data[0].Bestellungen.Bestellung.Lieferantenname,
                            freigabestatus      : data[0].Bestellungen.Bestellung.Freigabestatus,
                            anforderer          : data[0].Bestellungen.Bestellung.Anforderer,
                            netto               : data[0].Bestellungen.Bestellung.Nettobetrag.replace(".",",").concat(data[0].Bestellungen.Bestellung.Nettobetrag.indexOf(".")<0?",00":""),
                            showButtons         : false,
                            showError           : undefined,
                            showOk              : 0
                        };
                    } else {
                        length_data = data[0].Bestellungen.Bestellung.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.bestellungen[i] = {
                                belegid         : data[0].Bestellungen.Bestellung[i].Belegid,
                                belegnummer     : data[0].Bestellungen.Bestellung[i].Belegnummer,
                                belegbezeichnung: data[0].Bestellungen.Bestellung[i].Belegbezeichnung,
                                belegdatum      : data[0].Bestellungen.Bestellung[i].Belegdatum,
                                leistungsdatum  : data[0].Bestellungen.Bestellung[i].Leistungsdatum,
                                lieferantennr   : data[0].Bestellungen.Bestellung[i].Lieferantennr,
                                lieferantenname : data[0].Bestellungen.Bestellung[i].Lieferantenname,
                                freigabestatus  : data[0].Bestellungen.Bestellung[i].Freigabestatus,
                                anforderer      : data[0].Bestellungen.Bestellung[i].Anforderer,
                                netto           : data[0].Bestellungen.Bestellung[i].Nettobetrag.replace(".",",").concat(data[0].Bestellungen.Bestellung[i].Nettobetrag.indexOf(".")<0?",00":""),
                                showButtons     : false,
                                showError       : undefined,
                                showOk          : 0
                            };
                        }
                    }
                } else {
                    $scope.bestellungen_copy = [];
                }
                $scope.bestellungen_copy = angular.copy($scope.bestellungen);
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


    $scope.getBestellungen();


    $scope.removeFilter = function () {
        $scope.bestellungen_copy = angular.copy($scope.bestellungen);
        $scope.filter_aktiv = false;
        $scope.bestellung_positionen = [];
    }


    $scope.getBestellPositionen = function (pBestellung) {
        var length_data;

        if (!$scope.filter_aktiv) {
            $scope.bestellung_positionen = [];
            $scope.showLoader = true;
            // alle Bestellungen aus bestellungen_copy ausser der selektierten löschen
            for(var i=$scope.bestellungen_copy.length-1; i>=0; i--){
                if ($scope.bestellungen_copy[i].belegid != pBestellung.belegid) {
                    $scope.bestellungen_copy.splice(i, 1);
                }
            }

            ForwardRequestService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_BESTELLUNG_FREIGABE_POS","belegid": pBestellung.belegid}).then(function (data) {
                if (data[0].Positionen) {
                    if (data[0].Positionen.Position && data[0].Positionen.Position != '') {
                        if (data[0].Positionen.Position.length == undefined) {
                            $scope.bestellung_positionen[0] = {
                                belegzeilenid: data[0].Positionen.Position.Belegzeilenid,
                                artikelnummer: data[0].Positionen.Position.Artikelnummer,
                                artikelbezeichnung: data[0].Positionen.Position.Artikelbezeichnung,
                                artikellangtext: data[0].Positionen.Position.Artikellangtext,
                                termin: data[0].Positionen.Position.Termin,
                                menge: data[0].Positionen.Position.Menge,
                                artikelID: data[0].Positionen.Position.ArtikelID,
                                change_mode: false,
                                showError: 0,
                                showOk: 0
                            };
                            if ($scope.bestellung_positionen[0].artikellangtext != undefined && $scope.bestellung_positionen[0].artikellangtext.indexOf("<DEU>") > 0) {
                                // Text aus xml <DEU> XXX </DEU> ausschneiden
                                var vLength = $scope.bestellung_positionen[0].artikellangtext.indexOf("</DEU>") - $scope.bestellung_positionen[0].artikellangtext.indexOf("<DEU>") - "<DEU>".length;
                                $scope.bestellung_positionen[0].artikellangtext = $scope.bestellung_positionen[0].artikellangtext.substr($scope.bestellung_positionen[0].artikellangtext.indexOf("<DEU>") + "<DEU>".length, vLength);
                            }
                        } else {
                            length_data = data[0].Positionen.Position.length;
                            for (var i = 0; i < length_data; i++) {
                                $scope.bestellung_positionen[i] = {
                                    belegzeilenid: data[0].Positionen.Position[i].Belegzeilenid,
                                    artikelnummer: data[0].Positionen.Position[i].Artikelnummer,
                                    artikelbezeichnung: data[0].Positionen.Position[i].Artikelbezeichnung,
                                    artikellangtext: data[0].Positionen.Position[i].Artikellangtext,
                                    termin: data[0].Positionen.Position[i].Termin,
                                    menge: data[0].Positionen.Position[i].Menge,
                                    artikelID: data[0].Positionen.Position[i].ArtikelID,
                                    change_mode: false,
                                    showError: 0,
                                    showOk: 0
                                };
                                if ($scope.bestellung_positionen[i].artikellangtext != undefined && $scope.bestellung_positionen[i].artikellangtext.indexOf("<DEU>") > 0) {
                                    // xml <DEU> XXX </DEU> ausschneiden
                                    var vLength = $scope.bestellung_positionen[i].artikellangtext.indexOf("</DEU>") - $scope.bestellung_positionen[i].artikellangtext.indexOf("<DEU>") - "<DEU>".length;
                                    $scope.bestellung_positionen[i].artikellangtext = $scope.bestellung_positionen[i].artikellangtext.substr($scope.bestellung_positionen[i].artikellangtext.indexOf("<DEU>") + "<DEU>".length, vLength);
                                }
                            }
                        }
                        $scope.filter_aktiv = true;
                    } else {
                        $scope.bestellung_positionen = [];
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
        pBestellung.showButtons = true;
    };


    $scope.changeStatus = function (pBestellung,pStatus) {

        var vText;
        $('#verweigerungFormModal').modal('hide');
        pBestellung.showButtons = false;
        $scope.showLoader = true;
        // Bei Verweigerungen den Grund mitschicken
        if(pStatus === 4){
            vText = pBestellung.grund;
        }
        else{
            vText = "";
        }

        ForwardRequestService.get({"makro":"_SV_NETFRAME_RSD_UPDATE_BESTELLUNG_FREIGABEKZ","belegid": pBestellung.belegid,"personalnr":$scope.personalnummer,"freigabe":pStatus,"text":vText}).then(function (data) {
            $scope.showLoader = false;
            if (data[0].status == 0) {
                Notification({
                    message: 'Freigabe/Verweigerung wurde durchgeführt! Status: ' + data[0].statustext,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                }, 'success');
                for(var i = $scope.bestellungen.length-1; i >= 0 ; i--){
                    if ($scope.bestellungen[i].belegid === pBestellung.belegid) {
                        $scope.bestellungen.splice(i, 1);
                    }
                }
                $scope.removeFilter();
            }
            else {
                Notification({
                    message: 'Freigabe/Verweigerung wurde nicht durchgeführt! Fehlerhafte Antwort von ERPframe: ' + data[0].statustext,
                    templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
                }, 'error');
            }
        },
        function (response) {
            $scope.showLoader = false;
            pBestellung.showError = 'Freigabe/Verweigerung wurde nicht durchgeführt! (' + response.status + "-" + response.statusText + ")";
            Notification({
                message: 'Freigabe/Verweigerung wurde nicht durchgeführt! Fehlerhafte Antwort vom Server: ' + response.status + "-" + response.statusText,
                templateUrl: 'app/vendors/angular-ui-notification/tpl/error.tpl.html'
            }, 'error');
        });

    }

    $scope.openVerweigerungForm = function(pBestellung){
        $scope.aktBestellung = pBestellung;
        $('#verweigerungFormModal').modal({'modal': 'show', 'backdrop': 'static'});
    }

    $scope.cancel = function (pFormName) {
        $('#' + pFormName).modal('hide');
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
