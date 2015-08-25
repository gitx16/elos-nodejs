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
    .directive('recorderLeftPic', function(global,dialog) {
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_left_pic.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function (scope, element, attrs) {
                scope.resUrl = global.cache.resUrl;
                scope.openPhoto=function(message)
                {
                    dialog.complexBox(
                        {
                            templateUrl: '/node_static/javascripts/app/view/menus/photo-menu.html',
                            size:'md',
                            onComplete: function (dialogScope,modalInstance) {
                                dialogScope.message = message;
                                dialogScope.resUrl = scope.resUrl;
                                dialogScope.closePhoto = function(){
                                    modalInstance.close();
                                }
                            }
                        })
                };
            }
        }
    })
