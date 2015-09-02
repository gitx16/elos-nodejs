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
    .directive('recorderLeftPos', function(msg,resourcePool,global,sync,dialog) {
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/recorder_left_pos.html',
            replace: true,
            scope: {
                recorder: '=',
                session:'='
            },
            link: function (scope, element, attrs) {
                scope.resUrl = global.cache.resUrl;
                scope.openLinkman = function(){
                    sync.openLinkman(scope.recorder,scope.session,scope.resUrl);
                };
                scope.goMap = function(recorder){
                    dialog.complexBox(
                        {
                            templateUrl: '/node_static/javascripts/app/view/directive/map.html',
                            size:'md',
                            onComplete: function (dialogScope,modalInstance) {
                                setTimeout(function(){
                                    var map = new BMap.Map($(".allmap")[0]);
                                    var point = new BMap.Point(recorder.message.longitude,recorder.message.latitude);

                                    map.centerAndZoom(point, 14);
                                    var navigationControl = new BMap.NavigationControl({
                                        anchor: BMAP_ANCHOR_TOP_LEFT,
                                        type: BMAP_NAVIGATION_CONTROL_LARGE,
                                        enableGeolocation: true
                                    });
                                    var marker = new BMap.Marker(point);  // 创建标注
                                    var label = new BMap.Label(recorder.message.locationAddress,{offset:new BMap.Size(20,-10)});
                                    label.setStyle({
                                        color : "red",
                                        fontSize : "14px",
                                        height : "20px",
                                        lineHeight : "20px",
                                        fontFamily:"微软雅黑",
                                        border:"0px"
                                    });
                                    marker.setLabel(label);
                                    map.addOverlay(marker);              // 将标注添加到地图中
                                    map.addControl(navigationControl);
                                },100);
                                dialogScope.closeMenu = function(){
                                    modalInstance.close();
                                }
                            }
                        })
                }

            }
        }
    })
