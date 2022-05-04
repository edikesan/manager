'use strict';

var app = angular.module('ng-laravel');
app.controller('datatablesCtrl',function($scope){
    $scope.dtOption1 = {
        responsive: true
    };
    $scope.dtOption2 = {
        sDom: "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-6 hidden-xs'T>r>"+
        "t"+
        "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-sm-6 col-xs-12'p>>",
        oTableTools: {
            aButtons: [
                "copy",
                "csv",
                "xls",
                {
                    sExtends: "pdf",
                    sTitle: "Yeptemplate_PDF",
                    sPdfMessage: "Yeptemplate PDF Export",
                    sPdfSize: "letter"
                },
                {
                    sExtends: "print",
                    sMessage: "Generated by YepTemplate <i>(press Esc to close)</i>"
                }
            ],
        },
        autoWidth : true,
        responsive: true
    };
    $scope.dtOption3 = {
        dom: 'C<"clear">lfrtip',
        bLengthChange: false,
        responsive: true
    };

})