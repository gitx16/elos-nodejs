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
                                dialogScope.magnify = function(){
                                    var width = $(".dialog-img img").width()
                                    if(width<800){
                                        $(".dialog-img img").css("width",width*2+"px")
                                        $(".modal-dialog").css("width",width*2+42+"px")
                                    }
                                }
                                setTimeout(function(){
                                    var width = $(".dialog-img img").width()+40
                                    $(".modal-dialog").css("width",width+"px")
                                    $(".modal-dialog").css("max-width","800px")
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
