/**
 * Created by 迟宁 on 2015/7/2.
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
    .directive('recorderTip', function(){
        return {
            restrict: 'E',
            templateUrl: '/im/javascripts/app/view/directive/recorder_tip.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function(scope, element, attrs){
            }
        }
    });
