'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderRightMsg', function(emoji){
        return {
            restrict: 'E',
            templateUrl: '/im/javascripts/app/view/directive/recorder_right_msg.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function(scope, element, attrs){
                var msg = scope.recorder.message;
                var re= new RegExp("\\[(.*?)\\]","g");
                var match;
                while ((match = re.exec(msg)) != null) {
                    var emojiStr =  match[0];
                    var imgStr = emoji[emojiStr];
                    if(imgStr){
                        msg = msg.replace(emojiStr,"<img src='/im/images/emoji/"+imgStr+"' />");
                    }
                }
                scope.recorder.message = msg;
            }
        }
    });
