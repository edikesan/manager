'use strict';

angular.module('ng-laravel').service('CopyService', function($rootScope) {

    var fallbackCopyTextToClipboard = function (text,element) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.getElementById(element).appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }
        document.getElementById(element).removeChild(textArea);
    }

    this.copyTextToClipboard = function (text,element) {
        if (!navigator.clipboard) {
            fallbackCopyTextToClipboard(text,element);
            return;
        }
        navigator.clipboard.writeText(text).then(function() {
            console.log('Async: Copying to clipboard was successful!');
        }, function(err) {
            console.error('Async: Could not copy text: ', err);
        });
    }
/*
    return {
        copyText: function(text,element){
            return copyTextToClipboard(text, element);
        }
    };
*/



});