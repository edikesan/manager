"use strict";

angular.module('ng-laravel').controller('RegistrationsViewCtrl',function($rootScope,$scope,Notification,RegistrationsService) {

    var vm = this;

    $scope.showData = false;
    $scope.showLoader = false;

    $scope.personallager = $scope.profile.player_number;

    $scope.getRegistations = function(){
        var length_data;
        $scope.meineArtikeln = [];
        $scope.showData = false;
        $scope.showLoader = true;
        $scope.MenuFunktion = "MEINLAGER";

        RegistrationsService.get({"makro":"_SV_NETFRAME_RSD_EXPORT_ABGANGSLAGER_ARTIKEL","abgangslagernr": $scope.personallager}).then(function (data) {
            if (data[0].LagerProdukte) {
                if (data[0].LagerProdukte.LagerProdukte.LagerProdukt && data[0].LagerProdukte.LagerProdukte.LagerProdukt != '') {
                    if (data[0].LagerProdukte.LagerProdukte.LagerProdukt.length == undefined) {
                        $scope.meineArtikeln[0] = {
                            artikelid: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelid,
                            artikelnr: parseInt(data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelnr),
                            artikelbezeichnung: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikelbezeichnung,
                            artikellangtext: data[0].LagerProdukte.LagerProdukte.LagerProdukt.artikellangtext,
                            bestand: data[0].LagerProdukte.LagerProdukte.LagerProdukt.bestand,
                            showButton: true,
                            showError: undefined,
                            showOk: 0
                        };
                    } else {
                        length_data = data[0].LagerProdukte.LagerProdukte.LagerProdukt.length;
                        for (var i = 0; i < length_data; i++) {
                            $scope.meineArtikeln[i] = {
                                artikelid: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelid,
                                artikelnr: parseInt(data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelnr),
                                artikelbezeichnung: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikelbezeichnung,
                                artikellangtext: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].artikellangtext,
                                bestand: data[0].LagerProdukte.LagerProdukte.LagerProdukt[i].bestand,
                                showButton: true,
                                showError: undefined,
                                showOk: 0
                            };
                        }
                    }
                } else {
                    $scope.meineArtikeln = [];
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
    }


    $scope.getPersonallagerArtikel();


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
