'use strict';

angular.module('ng-laravel').service('SettingsService', function($rootScope, Restangular, CacheFactory) {
    /*
     * Build collection /settings
     */
    var _settingsService = Restangular.all('settings');


    /*
     * Search in prospects
     */
    this.search = function(settings) {
        // GET /api/settings/search?settings=50321
        return _settingsService.customGETLIST("search",{settings:settings});
    };

});

