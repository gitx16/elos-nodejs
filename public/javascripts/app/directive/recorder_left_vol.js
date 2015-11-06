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
                scope.resUrl = global.cache.resUrl;
                scope.recorder.message = scope.recorder.message.replace(".amr","_mp4.mp4")
                setTimeout(function(){
                    var id = scope.recorder.id+""
                    window.jwplayer(id).setup({
                        flashplayer: '/node_static/javascripts/thd/jwplayer/jwplayer2/jwplayer.swf',
                        file: scope.resUrl+"/"+scope.recorder.message,
                        stretching: 'exactfit',
                        width: 200,
                        height: 40,
                        primary: 'flash'
                    });
                },10)
                scope.openLinkman = function(){
                    sync.openLinkman(scope.recorder,scope.session,scope.resUrl);
                };
            }
        }
    });
