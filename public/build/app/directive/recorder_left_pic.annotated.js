/**
 * Created by 迟宁 on 2015/7/3.
 */
'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderLeftPic', ["global", function(global) {
        return {
            restrict: 'E',
            templateUrl: '/im/javascripts/app/view/directive/recorder_left_pic.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function (scope, element, attrs) {
                scope.resUrl = global.cache.resUrl;
            }
        }
    }])
