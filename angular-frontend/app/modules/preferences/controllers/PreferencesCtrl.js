"use strict";

var app = angular.module('ng-laravel');
app.controller('SettingsCtrl',function($scope,PreferencesService,SweetAlert,Restangular,$rootScope,$translatePartialLoader,Notification,trans){
    /*
     * Define initial value
     */
    $scope.preferences={};

    /*
     * Update preferences
     */
    $scope.update = function(preference) {
        $scope.isDisabled = true;
        PreferencesService.update(preference);
    };


    /**********************************************************
     * Event Listener
     ***********************************************************/
    //Validation error in create settings event listener
    $scope.$on('preferences.validationError', function(event,errorData) {
        Notification({message: errorData ,templateUrl:'app/vendors/angular-ui-notification/tpl/validation.tpl.html'},'warning');
        $scope.isDisabled = false;
    });

    // Update preferences event listener
    $scope.$on('preferences.update', function() {
        Notification({message: 'settings.form.preferencesUpdateSuccess' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
        $scope.isDisabled = false;
        $scope.preferences={};
        PreferencesService.list().then(function(data){
            $scope.preferences = data;
        })
    });
});