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
    .directive('recorderLeftVol', function(msg,dialog,resourcePool,global,$q,msgRegister,sync,constants) {
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_left_vol.html',
            replace: true,
            scope: {
                recorder: '=',
                session:'='
            },
            link: function (scope, element, attrs) {
                scope.voice = function(){
                    msg.info("正在接入中");
                };
                scope.resUrl = global.cache.resUrl;
                scope.openLinkman = function(){
                    sync.openLinkman(scope.recorder,scope.session,scope.resUrl);
                };
            }
        }
    });
