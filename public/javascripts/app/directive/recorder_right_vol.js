'use strict';
/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderRightVol', function(msg,global){
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_right_vol.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function (scope, element, attrs){
                scope.resUrl = global.cache.resUrl;
                scope.recorder.message = scope.recorder.message.replace(".amr","_mp4.mp4")
                setTimeout(function(){
                    var id = scope.recorder.id+""
                    window.jwplayer(id).setup({
                        flashplayer: scope.resUrl+'/thirdparty/jwplayer2/jwplayer.swf',
                        file: scope.resUrl+"/"+scope.recorder.message,
                        stretching: 'exactfit',
                        width: 200,
                        height: 40,
                        primary: 'flash'
                    });
                },10)
            }
        }
    })
