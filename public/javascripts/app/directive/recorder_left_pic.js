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
    .directive('recorderLeftPic', function(global,dialog,resourcePool,$q,msgRegister,sync,constants) {
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_left_pic.html',
            replace: true,
            scope: {
                recorder: '=',
                session:'='
            },
            link: function (scope, element, attrs) {
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
                                };
                                dialogScope.jmdc = "123";
                            }
                        })
                };
                scope.openLinkman = function(){
                    sync.openLinkman(scope.recorder,scope.session,scope.resUrl);
                };
            }
        }
    })
