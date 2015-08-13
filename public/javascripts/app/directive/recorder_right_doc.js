'use strict';
/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderRightDoc', function(msg){
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_right_doc.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function (scope, element, attrs){
                scope.document = function(){
                    msg.info("正在接入中");
                }
            }
        }
    })
