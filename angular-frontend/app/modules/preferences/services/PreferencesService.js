'use strict';

angular.module('ng-laravel').service('PreferencesService', function($rootScope, Restangular, CacheFactory) {
    /*
     * Build collection /preferences
     */
    var _PreferencesService = Restangular.all('preferences');


    /*
     * Search in prospects
     */
    this.search = function(preferences) {
        // GET /api/settings/search?settings=50321
        return _PreferencesService.customGETLIST("search",{preferences:preferences});
    };

});

