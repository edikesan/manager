'use strict';

angular.module('ng-laravel').service('ForwardRequestService', function($rootScope, Restangular,CacheFactory) {

    var _ForwardRequestService = Restangular.all('forward_request');
    if (!CacheFactory.get('ForwardRequestServiceCache')) {
        var ForwardRequestServiceCache = CacheFactory('ForwardRequestServiceCache');
    }


    /*
     * Show specific optionlist by Id
     */


    this.get = function(query,per_page) {
        return _ForwardRequestService.customGETLIST("forwardRequest",{query:query, per_page:per_page});
    };

    // seltsamerweise erscheinen Parameter bei post genauso in der URL wie bei get
    this.post = function(pFunction,query,per_page) {

        if(query !=''){
            return _ForwardRequestService.customPOST({}, pFunction,{query:query, per_page:per_page});
        }else{
            return _ForwardRequestService.getList();
        }
    };

});

