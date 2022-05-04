'use strict';

angular.module('ng-laravel').service('RegistrationsService', function($rootScope, Restangular,CacheFactory) {

    var _RegistrationsService = Restangular.all('registrations');
    if (!CacheFactory.get('RegistrationsCache')) {
        var RegistrationsCache = CacheFactory('RegistrationsCache');
    }


    /*
     * Show specific optionlist by Id
     */


    this.getRegistrations = function() {
        return _RegistrationsService.getList();
    };

    this.getTrainingDate = function() {
        return _RegistrationsService.customGETLIST("getTrainingDate");
    }

    this.getUnregistredUsers = function() {
        return _RegistrationsService.customGETLIST("getUnregistredUsers");
    }

    this.makeRegistration = function(query) {
        return _RegistrationsService.customPOST(query);
    }

    this.cancelRegistration = function(query) {
        return _RegistrationsService.customGET("cancelRegistration", query);
    }

    // seltsamerweise erscheinen Parameter bei post genauso in der URL wie bei get
    this.post = function(pFunction,query,per_page) {
        if(query !=''){
            return _RegistrationsService.customPOST({}, pFunction,{query:query, per_page:per_page});
        }else{
            return _RegistrationsService.getList();
        }
    };

});

