'use strict';
/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderRightPic', function(global){
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_right_pic.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function(scope, element, attrs,SessionCtrl){
                scope.resUrl = global.cache.resUrl;
            }
        }
    })
