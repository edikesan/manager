"use strict";

angular.module('ng-laravel').controller('RegistrationsCtrl',function($rootScope,$scope,$state,Notification,RegistrationsService) {

    var vm = this;

    $scope.showData = false;
    $scope.showLoader = false;
    $scope.selectedUserForDelete = undefined;
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


    $scope.playerId = $scope.profile.guest_id;
    $scope.player = $scope.profile.player_firstname+$scope.profile.player_number;


    $scope.getUnregistredUsers = function (){
        $scope.unregistredUsers = [];
        $scope.showData = false;
        $scope.showLoader = true;

        RegistrationsService.getUnregistredUsers().then(function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $scope.unregistredUsers[i] = {
                        guest_id: data[i].guest_id,
                        player_name: data[i].player_name + ", "+data[i].player_firstname,
                    };
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
    $scope.getUnregistredUsers();

    $scope.getTrainingDate = function (){

        RegistrationsService.getTrainingDate().then(function (data) {
            $scope.trainingDate = data[0].game_datetime;
            $scope.gameId = data[0].game_id;
            $scope.game_date = data[0].game_date;
        });
    }
    $scope.getTrainingDate();

    $scope.getRegistrations = function () {
        $scope.registrations = [];
        $scope.registrations_cancelled = [];
        $scope.showData = false;
        $scope.showLoader = true;

        $scope.unregistredUsers.forEach(function (val) {
            if(val.guest_id === $scope.playerId) {
                // User für das Training vorselektieren
                $scope.selectedUser = $scope.playerId;
            }
        });

        RegistrationsService.getRegistrations().then(function (data) {
            if (data.length > 0) {
                var index_reg = 0, index_cancelled = 0;
                for (var i = 0; i < data.length; i++) {
                    if( data[i].cancelation_datetime !== null ){
                        $scope.registrations_cancelled[index_cancelled++] = {
                            guest_id: data[i].guest_id,
                            player_number: data[i].player_number,
                            player_name: data[i].player_name,
                            player_firstname: data[i].player_firstname,
                            registration_datetime: data[i].registration_datetime,
                            cancelation_datetime: data[i].cancelation_datetime,
                            player_position: data[i].player_position
                        };
                    }
                    else{
                        $scope.registrations[index_reg++] = {
                            guest_id: data[i].guest_id,
                            player_number: data[i].player_number,
                            player_name: data[i].player_name,
                            player_firstname: data[i].player_firstname,
                            registration_datetime: data[i].registration_datetime,
                            cancelation_datetime: data[i].cancelation_datetime,
                            player_position: data[i].player_position
                        };
                    }
                }
                $scope.showData = true;
                $scope.showLoader = false;
                $scope.filter_aktiv = false;

                $scope.registrations.forEach(function (val) {
                    if(val.guest_id === $scope.playerId) {
                        // User für das Training vorselektieren
                        $scope.selectedUserForUnregister = $scope.playerId;
                        console.log("selectedUserForUnregister selected: "+$scope.selectedUserForUnregister);
                    }
                });


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

    $scope.getRegistrations();

    var sortPlayer = function (player1, player2) {
        if (player1.player_firstname+player1.player_name < player2.player_firstname+player2.player_name) return -1;
        if (player1.player_firstname+player1.player_name > player2.player_firstname+player2.player_name) return 1;
        return 0;
    };


    $scope.makeRegistration = function (){
        $scope.showData = false;
        $scope.showLoader = true;

        RegistrationsService.makeRegistration({"game_date":$scope.game_date, "game_id":$scope.gameId, "guest_id":$scope.selectedUser}).then(function (data) {
            if (data[0]=="success") {
                $scope.registrations.push({
                    "player_number": data.player_number,
                    "player_name": data.player_name,
                    "player_firstname": data.player_firstname,
                    "registration_datetime": data.registration_datetime,
                    "cancelation_datetime": undefined
                });
                $scope.unregistredUsers.forEach(function (player, index){
                    if(player.guest_id === data.guest_id )
                        $scope.unregistredUsers.splice(index,1);
                });
                $scope.selectedUser = undefined;
                $scope.registrations.sort(sortPlayer);
                Notification({
                    message: 'Der Spieler ' + data.player_name + ", " + data.player_firstname + " wurde angemeldet",
                    templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                }, 'success');
/*                $scope.registrations.forEach(function (player){
                    console.log(player.player_number);
                });*/
                $scope.selectedUser = undefined;
                $state.go('admin.registrations');
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


    $scope.cancelRegistration = function (){
        $scope.showData = false;
        $scope.showLoader = true;

        RegistrationsService.cancelRegistration({"game_id":$scope.gameId, "guest_id":$scope.selectedUserForUnregister}).then(function (data) {
            if (data[0]=="success") {
                $scope.unregistredUsers.push({
                    "player_number": data.player_number,
                    "player_name": data.player_name,
                    "player_firstname": data.player_firstname,
                    "registration_datetime": data.registration_datetime,
                    "cancelation_datetime": undefined
                });
                $scope.registrations.forEach(function (player, index){
                    if(player.guest_id === parseInt(data.guest_id) )
                        $scope.registrations.splice(index,1);
                });
                $scope.selectedUserForUnregister = undefined;
                $scope.unregistredUsers.sort(sortPlayer);
                Notification({
                    message: 'Der Spieler ' + data.player_name + ", " + data.player_firstname + " wurde abgemeldet",
                    templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'
                }, 'success');
                /*                $scope.registrations.forEach(function (player){
                                    console.log(player.player_number);
                                });*/
                $scope.selectedUser = undefined;
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


//////////////////////////////////////////////////////////////////






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
