'use strict';
/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('recorderRightPic', function(global,dialog){
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_right_pic.html',
            replace: true,
            scope: {
                recorder: '='
            },
            link: function(scope, element, attrs,SessionCtrl){
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
