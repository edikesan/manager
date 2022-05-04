'use strict';

angular.module('ng-laravel').service('ArtikelUmbuchungenService', function($rootScope, Restangular,CacheFactory) {

    var _ArtikelUmbuchungenService = Restangular.all('artikel_umbuchungen');
    if (!CacheFactory.get('ArtikelUmbuchungenCache')) {
        var ArtikelUmbuchungenCache = CacheFactory('ArtikelUmbuchungenCache');
    }


    /*
     * Show specific optionlist by Id
     */


    this.get = function(query,per_page) {
        return _ArtikelUmbuchungenService.customGETLIST("forwardRequest",{query:query, per_page:per_page});
    };

    // seltsamerweise erscheinen Parameter bei post genauso in der URL wie bei get
    this.post = function(pFunction,query,per_page) {

        if(query !=''){
            return _ArtikelUmbuchungenService.customPOST({}, pFunction,{query:query, per_page:per_page});
        }else{
            return _ArtikelUmbuchungenService.getList();
        }
    };

});

