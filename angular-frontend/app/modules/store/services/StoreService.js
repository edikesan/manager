'use strict';

angular.module('ng-laravel').service('StoreService', function($rootScope, Restangular,CacheFactory) {

    var _storeService = Restangular.all('store');
    if (!CacheFactory.get('storeCache')) {
        var storeCache = CacheFactory('storeCache');
    }

    this.store = {data:{}};
    var self = this;

    this.getStore = function() {
        // GET /api/optionlist
        _storeService.getList().then(function(response){
            self.store.data = response.plain();
            return true;
        });
    }

    /*
    * Update address (PUT)
    */
    this.updateStore = function(data) {
        // PUT /api/address/:id
        console.log(data);
        _storeService.post(data).then(function(data1) {
            $rootScope.$broadcast('store.update', data1);
        },function(response) {
            //$rootScope.$broadcast('address.validationError',response.data1.error);
        });
    };

    /*
     * Show specific optionlist by Id
     */
    this.searchStationDeatil = function(query,per_page) {

        if(query !=''){
            return _storeService.customGETLIST("searchStationDetail",{query:query, per_page:per_page});
        }else{
            return _storeService.getList();
        }
    };

    /*
     * Show specific optionlist by Id
     */
    this.search = function(query,per_page) {

        if(query !=''){
            return _storeService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _storeService.getList();
        }
    };

});

