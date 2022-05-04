"use strict";

angular.module('ng-laravel').controller('OptionlistCtrl',function($scope,OptionlistService,SweetAlert,Restangular,$rootScope,resolvedItems,$translatePartialLoader,Notification,trans){

    /*
     * Define initial value
     */
    $scope.optionlist={};


    /*
     * Get all optionlists
     * Get from resolvedItems function in this page route (config.router.js)
     */
    $scope.optionlists = resolvedItems;
    //$scope.pagination = $scope.optionlists.metadata;
    //$scope.maxSize = 5;


    /*
     * Get all optionlist and refresh cache.
     * At first check cache, if exist, we return data from cache and if don't exist return from API
     */
    OptionlistService.list().then(function(data){
        $scope.optionlists = data;
    });


    /*
     * Create a optionlist
     */
    $scope.create = function(optionlist) {
        $scope.notification={};
        $scope.isDisabled = true;
        OptionlistService.create(optionlist);
    };


    /*
     * Remove selected customers
     */
    $scope.delete = function(optionlist) {
        SweetAlert.swal($rootScope.areYouSureDelete,//define in AdminCtrl
        function(isConfirm){
            if (isConfirm) {
                OptionlistService.delete(optionlist);
            }
        });
    };


    /*
     * Edit mode optionlist - Copy optionlist to edit form
     */
    $scope.edit = function(optionlist) {
        var optionlistCopy = Restangular.copy(optionlist);
        $rootScope.$broadcast('optionlist.edit', optionlistCopy);
    };


    /*
     * Update optionlist
     */
    $scope.update = function(optionlist) {
        $scope.isDisabled = true;
        OptionlistService.update(optionlist);
    };


    /**********************************************************
     * Event Listener
     ***********************************************************/
    // Create optionlist event listener
    $scope.$on('optionlist.create', function() {
        OptionlistService.list().then(function(data){
            $scope.optionlists = data;
            $scope.optionlist={};
            Notification({message: 'optionlist.form.optionlistAddSuccess' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
            $scope.isDisabled = false;
        });
    });

    //Validation error in create optionlist event listener
    $scope.$on('optionlist.validationError', function(event,errorData) {
        Notification({message: errorData ,templateUrl:'app/vendors/angular-ui-notification/tpl/validation.tpl.html'},'warning');
        $scope.isDisabled = false;
    });

    // update list when optionlist deleted
    $scope.$on('optionlist.delete', function() {
        SweetAlert.swal($rootScope.recordDeleted);//define in AdminCtrl
        OptionlistService.list().then(function(data){
            $scope.optionlists =data;
            $scope.selection=[];
        });
    });

    // update list when optionlist not deleted
    $scope.$on('optionlist.not.delete', function() {
        SweetAlert.swal($rootScope.recordNotDeleted);//define in AdminCtrl
        OptionlistService.list().then(function(data){
            $scope.optionlists =data;
            $scope.selection=[];
        });
    });

    // copy optionlist to form for update
    $scope.$on('optionlist.edit', function(scope, optionlist) {
        $scope.optionlist = optionlist;
        $scope.updateMode= true;
    });

    // Update optionlist event listener
    $scope.$on('optionlist.update', function() {
        Notification({message: 'optionlist.form.optionlistUpdateSuccess' ,templateUrl:'app/vendors/angular-ui-notification/tpl/success.tpl.html'},'success');
        $scope.isDisabled = false;
        $scope.optionlist={};
        OptionlistService.list().then(function(data){
            $scope.optionlists = data;
        })
    });
});