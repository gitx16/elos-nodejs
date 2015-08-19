'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp', [])
    .controller('ActivityCtrl', function ($scope, $http, $sce, msg) {
        $scope.to_trusted = function (html_code) {
            return $sce.trustAsHtml(html_code);
        };

        $scope.hasLoding = false;
        $scope.doSubmit = false;

        $http({
            url: "/open/activity/" + $scope.activityId + ".json"
        }).success(function (res, status, headers, config) {
            var stat = res.stat;
            if (stat == "OK") {
                $scope.activity = res.data.model;
            }
            $scope.hasLoding = true;
        }).error(function (res, status, headers, config) {
            $log.log('请求失败：' + res);
        });

        $scope.submitAct = function () {
            if($scope.activity.dataStatus==1){
                $http({
                    url: "/el/activity/" + $scope.activityId + "/apply.json?_method=post",
                    method: "POST"
                }).success(function (res, status, headers, config) {
                    var stat = res.stat;
                    if (stat == "OK") {
                        $scope.activity.dataStatus = 3;
                        $scope.activity.actNum+=1;
                        msg.success('报名成功');
                    } else {
                        if (res.errors && res.errors.length > 0) {
                            msg.error(res.errors[0].msg);
                        }
                    }
                    $scope.doSubmit = false;
                }).error(function (res, status, headers, config) {
                    $scope.doSubmit = false;
                    msg.error('报名失败');
                });
            }else if($scope.activity.dataStatus==3){
                $http({
                    url: "/el/activity/" + $scope.activityId + "/apply.json?_method=delete",
                    method: "POST"
                }).success(function (res, status, headers, config) {
                    var stat = res.stat;
                    if (stat == "OK") {
                        $scope.activity.dataStatus = 1;
                        $scope.activity.actNum-=1;
                        msg.success('取消报名成功');
                    } else {
                        if (res.errors && res.errors.length > 0) {
                            msg.error(res.errors[0].msg);
                        }
                    }
                    $scope.doSubmit = false;
                }).error(function (res, status, headers, config) {
                    $scope.doSubmit = false;
                    msg.error('取消报名失败');
                });
            }

        }
    });
