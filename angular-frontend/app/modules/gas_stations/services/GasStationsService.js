'use strict';

angular.module('ng-laravel').service('GasStationsService', function($rootScope, Restangular,CacheFactory) {

    var _GasStationsService = Restangular.all('gas_stations');
    if (!CacheFactory.get('GasStationsCache')) {
        var GasStationsCache = CacheFactory('GasStationsCache');
    }


    /*
     * Show specific optionlist by Id
     */
    this.search = function(query,per_page) {

        if(query !=''){
            return _GasStationsService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _GasStationsService.getList();
        }
    };


    this.insertGasStationsTour = function(query,per_page) {
        if(query !=''){
            return _GasStationsService.customGETLIST("update",{query:query, per_page:per_page});
        }else{
            return _GasStationsService.getList();
        }
    };

    this.getTerminals = function(query,per_page) {

        if(query !=''){
            return _GasStationsService.customGETLIST("getTerminals",{query:query, per_page:per_page});
        }else{
            return _GasStationsService.getList();
        }
    };

});

