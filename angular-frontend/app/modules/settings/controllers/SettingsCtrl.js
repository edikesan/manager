"use strict";

var app = angular.module('ng-laravel');
app.controller('SettingsCtrl',function($scope,SettingsService,SweetAlert,Restangular,$rootScope,$translatePartialLoader,Notification,trans){
    /*
     * Define initial value
     */
    $scope.settings={};

    /*
     * Update settings
     */
    $scope.update = function(setting) {
        $scope.isDisabled = true;
        SettingsService.update(setting);
    };


    /**********************************************************
     * Event Listener
     ***********************************************************/
    //Validation error in create settings event listener
    $scope.$on('settings.validationError', function(event,errorData) {
        Notification({message: errorData ,templateUrl:'app/vendors/angular-ui-notification/tpl/validation.tpl.html'},'warning');
        $scope.isDisabled = false;
    });

    // Update settings event listener
    $scope.$on('settings.update', function() {
        Notification({message: 'settings.form.settingsUpdateSuccess' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
        $scope.isDisabled = false;
        $scope.settings={};
        SettingsService.list().then(function(data){
            $scope.settingss = data;
        })
    });
});