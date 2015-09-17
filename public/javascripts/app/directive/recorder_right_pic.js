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
                            windowClass:'modal-content-opacity',
                            size:'md',
                            onComplete: function (dialogScope,modalInstance) {
                                setTimeout(function(){
                                    dialogScope.$apply(function() {
                                        var imgHeight = $(".dialog-img").height()
                                        dialogScope.imgStytle = {height:imgHeight+'px','line-height':imgHeight+'px'}
                                    });
                                },100)
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
