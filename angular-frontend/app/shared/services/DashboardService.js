'use strict';

angular.module('ng-laravel').service('DashboardService', function($rootScope, Restangular, CacheFactory) {


    /*
     * Build collection /dashboard
     */
    var _dashboardService = Restangular.all('dashboard');
    if (!CacheFactory.get('dashboardsCache')) {
        var dashboardsCache = CacheFactory('dashboardsCache');
    }


    /*
     * Get list of dashboards from cache.
     * if cache is empty, data fetched and cache create else retrieve from cache
     */
    this.cachedList = function() {
        // GET /api/dashboard
        if (!dashboardsCache.get('list')) {
            return this.list();
        } else{
            return dashboardsCache.get('list');
        }
    };


    /*
     * Get list of dashboards
     */
    this.list = function() {
        // GET /api/dashboard

        var data = _dashboardService.getList();
        console.log(data);
        return data;
    };


    /*
     * Pagination change
     */
    this.pageChange = function(pageNumber,per_page,status_id) {
        // GET /api/dashboard?page=2
        return _dashboardService.getList({page:pageNumber,per_page:per_page,status_id:status_id});
    };


    this.cachedShow = function(id) {
        // GET /api/dashboard/:id
        if (!dashboardsCache.get('show'+id)) {
            return this.show(id);
        } else{
            return dashboardsCache.get('show'+id);
        }
    };


    /*
     * Show specific dashboard by Id
     */
    this.show = function(id) {
        // GET /api/dashboard/:id
        return _dashboardService.get(id);
    };


    /*
     * Create dashboard (POST)
     */
    this.create = function(dashboard) {
        // POST /api/dashboard/:id
        _dashboardService.post(dashboard).then(function(data) {
            $rootScope.$broadcast('dashboard.create');
        },function(response) {
            if(response.data) {
                $rootScope.$broadcast('dashboard.validationError', response.data.error);
            }else{
                return false;
            }
        });
    };

    /*
     * Create dashboard (POST)
     */
    this.send_to_rl = function(dashboard_id) {
        // POST /api/dashboard/:id
        var account = Restangular.one("dashboard", dashboard_id);
        account.customPOST({}, "send_to_rl", {}, {}).then(function(data) {
            $rootScope.$broadcast('dashboard.send_to_rl');
        },function(response) {
            if(response.data) {
                $rootScope.$broadcast('dashboard.validationError', response.data.error);
            }else{
                return false;
            }
        });
    };


    /*
     * Update dashboard (PUT)
     */
    this.update = function(dashboard) {
        // PUT /api/dashboard/:id
        if (typeof dashboard.put == 'function') {
            console.log('ist eine Funktion');
            dashboard.put().then(function () {
                $rootScope.$broadcast('dashboard.update');
            }, function (response) {
                $rootScope.$broadcast('dashboard.validationError', response.data.error);
            });
        }else{
            return false;
        }
    };


    /*
     * Delete dashboard
     * To delete multi record you should must use 'Restangular.several'
     */
    this.delete = function(selection) {
        // DELETE /api/dashboard/:id
        Restangular.several('dashboard',selection).remove().then(function() {
            $rootScope.$broadcast('dashboard.delete');
        },function(response){
            $rootScope.$broadcast('dashboard.not.delete');
        });
    };


     /*
     * Search in dashboards
     */
    this.search = function(query,per_page) {
        // GET /api/dashboard/search?query=test&per_page=10
        if(query !=''){
            return _dashboardService.customGETLIST("search",{query:query, per_page:per_page});
        }else{
            return _dashboardService.getList();
        }
    }


    /*
     * Download Exported File
     */
    this.downloadExport = function(recordType,selection,export_type){
        _dashboardService.withHttpConfig({responseType: 'blob'}).customGET('export/file',{record_type:recordType,export_type:export_type,'selection[]':selection}).then(function(response) {
            var url = (window.URL || window.webkitURL).createObjectURL(response);
            var anchor = document.createElement("a");
            document.body.appendChild(anchor);//required in FF, optional for Chrome
            anchor.download = "exportfile."+export_type;
            anchor.href = url;
            anchor.click();
        })
    };



});

