"use strict";

var app = angular.module('ng-laravel');
app.controller('ChangePassCtrl',function($scope,$auth,hotkeys,$state,Restangular,SweetAlert,$stateParams){
    
    
    /*
     * Change password
     */
    $scope.change = function(user){
        
        $scope.isDisabled = true;
        user.token = $stateParams.token;
        $scope.profile = $auth.getProfile().$$state.value;
        user.email = $scope.profile.email;

        // password/reset/
        Restangular.one('password').customPOST('user','change',user).then(function(data) {
            // if reset password successfully
            SweetAlert.swal({ title: "Success", text: data, type: "success"});
            $scope.isDisabled = false;
            $state.go('login');
        }, function(response) {  // if if reset password failed
            if(response.data.error){
                // if error related to invalid data
                SweetAlert.swal({ title: "Error", text: response.data.error, type: "error"});
            }
            else if(response.data.validation){
                // if error related to validations
                var tmp = [];
                angular.forEach(response.data.validation,function(item,key){
                    angular.forEach(item,function(value,key){
                        tmp += value+'</br>';
                    })
                })
                SweetAlert.swal({ title: "Error Validation", text: tmp, type: "error",html: true});
            }
            $scope.isDisabled = false;
        })

    }

});