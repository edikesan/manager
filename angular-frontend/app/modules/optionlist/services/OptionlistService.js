'use strict';

angular.module('ng-laravel').service('OptionlistService', function($rootScope, Restangular,CacheFactory) {
    /*
     * Build collection /optionlist
     *
     *
     */

    this.optionlists = {data:[]};
    this.optionlist = {data:[]};
    var self = this;

    var _optionlistService = Restangular.all('optionlist');
    if (!CacheFactory.get('optionlistCache')) {
        var optionlistCache = CacheFactory('optionlistCache');
    }

    /*
     * Get list of optionlist from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/optionlist
        if (!optionlistCache.get('list')) {
            return this.list();
        } else{
            return optionlistCache.get('list');
        }
    };


    /*
     * Get list of optionlist
     */
    this.list = function() {
        // GET /api/optionlist
        var data = _optionlistService.getList();
        optionlistCache.put('list',data);
        return data;
    };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page) {
        // GET /api/optionlist?page=2
        return _optionlistService.getList({page:pageNumber,per_page:per_page});
    };


    /*
     * Show specific optionlist by Id
     */
    this.show = function(id) {
        // GET /api/optionlist/:id
        return _optionlistService.get(id);
    };


    /*
     * Create optionlist (POST)
     */
    this.create = function(optionlist) {
        // POST /api/optionlist/:id
        _optionlistService.post(optionlist).then(function() {
            $rootScope.$broadcast('optionlist.create');
        },function(response) {
            $rootScope.$broadcast('optionlist.validationError',response.data.error);
        });
    };


    /*
     * Update optionlist (PUT)
     */
    this.update = function(optionlist) {
        // PUT /api/optionlist/:id
        optionlist.put().then(function() {
            $rootScope.$broadcast('optionlist.update');
        },function(response) {
            $rootScope.$broadcast('optionlist.validationError',response.data.error);
        });
    };


    /*
     * Delete optionlist
     * To delete multi record you should must use 'Restangular.several'
     */
    this.delete = function(optionlist) {
        // DELETE /api/optionlist/:id
        optionlist.remove().then(function() {
            $rootScope.$broadcast('optionlist.delete');
        },function(response){
            $rootScope.$broadcast('optionlist.not.delete');
        });
    };


    /*
     * Search in optionlists
     */
    this.search = function(query,per_page) {
        // GET /api/optionlist/search?query=test&per_page=10
        if(query !=''){
            return _optionlistService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _optionlistService.getList();
        }
    }


});

