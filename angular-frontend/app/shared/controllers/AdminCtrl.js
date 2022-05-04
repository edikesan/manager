"use strict";

angular.module('ng-laravel').controller('AdminCtrl',function($scope,$auth,hotkeys,$state,$translate,$timeout,$rootScope,$translatePartialLoader,uibPaginationConfig,trans){


    /* show loading on page change */
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
            $scope.loader = true;
        }
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        if (toState.resolve) {
            $scope.loader = false;
        }
    });

    $scope.showSideBar = function(){
        var elem = document.getElementById('sidebar');
        elem.className = 'sidebar sidebar-show';
    };

    $scope.hideSideBar = function(){
        var elem = document.getElementById('sidebar');
        elem.className = 'sidebar';
    };

    window.mobilecheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };
    if(window.mobilecheck() == true){
        $scope.mobile = 1;
    }else{
        $scope.mobile = 0;
    }


    /* Get user profile info */
    $scope.profile = $auth.getProfile().$$state.value;
    

    /* Offline Syncronisierung */
    $scope.permission_sync = 0;
    for (var key in $scope.profile.permissions) {
        if($scope.profile.permissions[key] == "offline_sync") {
            $scope.permission_sync = 1;
        }
    }

    /* Define keyboard short-key */
    hotkeys.add({
        combo: 'ctrl+b',
        description: 'Open Request List',
        callback: function() {
            $state.go("admin.tasks");
        }
    });


    if($scope.permission_sync == 1) {

        /*var schema_synced = 0;
        open_db();

        db.transaction(function (tx) {
            var sql = "SELECT tbl_name from sqlite_master WHERE type = 'table'";
            tx.executeSql(sql, [], function (tx, results) {
                for (var i = 0; i < results.rows.length; i++) {
                    if (results.rows.item(i).tbl_name == "addresses") {
                        schema_synced = 1;
                    }
                }

                if (schema_synced == 0) {
                    console.log("Syncronisiere gesamtes Schema");
                    get_schema_and_data_from_server();
                }
            }, errorHandler);
        });

        start_sync_intervall();*/
    }else{
        //clearInterval(sync_int);
    }



    /* Search Input & Per Page toggle */
    $scope.searchShow = false;
    $scope.perPageShow = false;



    /* Change Language Function*/
    $scope.changeLanguage = function (langKey) {
        $rootScope.currentLanguage = $translate.use(langKey);
    };

    
    $scope.openContract = function(contract){
        $scope.contractsCustomer = contract;
            $("#contractModal").modal('show');

    };

    $scope.searchProspectBlur = function () {

        $timeout(function()
        {
            $scope.query = '';
            delete $scope.prospects;
        }, 500);
    };

    /* get available langKey */
    $scope.AvailableLanguageKeys = $translate.getAvailableLanguageKeys();

    /* Show loading on translate switch */
    $rootScope.$on('$translateChangeStart', function () {
        $scope.transLoader = true;
    });
    $rootScope.$on('$translateChangeSuccess', function() {
        $scope.transLoader = false;

        // ui-pagination translate
        uibPaginationConfig.firstText = $translate.instant('app.shared.paging.first');
        uibPaginationConfig.previousText = $translate.instant('app.shared.paging.pre');
        uibPaginationConfig.nextText = $translate.instant('app.shared.paging.next');
        uibPaginationConfig.lastText = $translate.instant('app.shared.paging.last');

        // populate sweet alert
        $rootScope.areYouSureDelete ={
            title: $translate.instant('app.shared.alert.areYouSure'),
            text: $translate.instant('app.shared.alert.areYouSureDescription'),
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: $translate.instant('app.shared.alert.confirmButtonText'),
            cancelButtonText: $translate.instant('app.shared.alert.cancelButtonText'),
            closeOnConfirm: false,
            closeOnCancel: true,
            showLoaderOnConfirm: true
        };

        // populate sweet alert
        $rootScope.recordDeleted = {
            title: $translate.instant('app.shared.alert.deletedTitle'),
            text: $translate.instant('app.shared.alert.successDeleted'),
            type:"success",
            confirmButtonText: $translate.instant('app.shared.alert.okConfirm'),
        };

        // populate sweet alert
        $rootScope.recordNotDeleted = {
            title: $translate.instant('app.shared.alert.errorDeleteTitle'),
            text: $translate.instant('app.shared.alert.errorDeleteDescription'),
            type:"error",
            confirmButtonText: $translate.instant('app.shared.alert.okConfirm'),
        };

        var htmlInputForm = '<div class="radio radio-primary"> <input type="radio" name="exportSelect" id="radio1" ng-model="radioValue"  value="1" checked> <label for="radio1">'+$translate.instant('app.shared.alert.selectWholeRecords')+'</label> </div> <div class="radio radio-primary"> <input type="radio" name="exportSelect" id="radio2" ng-model="radioValue" value="2"> <label for="radio2"> '+ $translate.instant('app.shared.alert.selectSelectedRecords')+' </label> </div>';
        // populate sweet alert
        $rootScope.exportSelect = {
            title: $translate.instant('app.shared.alert.exportSelectTitle'),
            text: htmlInputForm ,
            html: true,
            showCancelButton: true,
            confirmButtonText: $translate.instant("app.shared.alert.downloadExport"),
            confirmButtonColor: "#006DCC",
            cancelButtonText: $translate.instant('app.shared.alert.cancelAlert'),
            closeOnConfirm: false,
            closeOnCancel: true,
            //showLoaderOnConfirm: true
        };

        // populate sweet alert
        $rootScope.selectFileError = {
            title: $translate.instant('app.shared.alert.selectFileErrorTitle'),
            text: $translate.instant('app.shared.alert.selectFileError'),
            type:"error",
            confirmButtonText: $translate.instant('app.shared.alert.okConfirm')
        };


    });

});
