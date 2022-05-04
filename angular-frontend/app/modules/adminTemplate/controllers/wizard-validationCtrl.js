"use strict";

var app = angular.module('ng-laravel',['oitozero.ngSweetAlert']);
app.controller('wizard-validationCtrl',function($scope){

    $scope.stepsOptions2 = {
        headerTag: "h3",
        bodyTag: "section",
        transitionEffect: "slideLeft",
        stepsOrientation: "vertical"
    }
})
.directive('steps',function(SweetAlert){
        return {
            restrict:'A',
            link:function($scope,element,attrs){
                var form = element;
                form.steps({
                    headerTag: "h3",
                    bodyTag: "fieldset",
                    transitionEffect: "slideLeft",
                    onStepChanging: function (event, currentIndex, newIndex)
                    {
                        // Allways allow previous action even if the current form is not valid!
                        if (currentIndex > newIndex)
                        {
                            return true;
                        }
                        // Forbid next action on "Warning" step if the user is to young
                        if (newIndex === 3 && Number($("#age-2").val()) < 18)
                        {
                            return false;
                        }
                        // Needed in some cases if the user went back (clean up)
                        if (currentIndex < newIndex)
                        {
                            // To remove error styles
                            form.find(".body:eq(" + newIndex + ") label.error").remove();
                            form.find(".body:eq(" + newIndex + ") .error").removeClass("error");
                        }
                        form.validate().settings.ignore = ":disabled,:hidden";
                        return form.valid();
                    },
                    onStepChanged: function (event, currentIndex, priorIndex)
                    {
                        // Used to skip the "Warning" step if the user is old enough.
                        if (currentIndex === 2 && Number($("#age-2").val()) >= 18)
                        {
                            form.steps("next");
                        }
                        // Used to skip the "Warning" step if the user is old enough and wants to the previous step.
                        if (currentIndex === 2 && priorIndex === 3)
                        {
                            form.steps("previous");
                        }
                    },
                    onFinishing: function (event, currentIndex)
                    {
                        form.validate().settings.ignore = ":disabled";
                        return form.valid();
                    },
                    onFinished: function (event, currentIndex)
                    {
                        SweetAlert.swal("Good job!", "Your form is ready to be submitted!", "success");
                    }
                }).validate({
                    errorPlacement: function errorPlacement(error, element) { element.after(error); },
                    rules: {
                        confirm: {
                            equalTo: "#password-2"
                        }
                    }
                });
            }
        }
    })