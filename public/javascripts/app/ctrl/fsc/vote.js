'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('voteApp', [])
    .controller('VoteCtrl', function ($scope, $http) {
        $http({
            url: "/ma_fsc/vote/46.json"
        }).success(function (res, status, headers, config) {
            debugger
            var stat = res.stat;
        }).error(function (res, status, headers, config) {
            debugger
            $log.log('请求失败：' + res);
            })['finally'](function () {
        });

        $scope.vote = {
            voteName: "投票",
            voteQuesList: [
                {
                    id: 1,
                    title: "题目1",
                    checkType: 1,
                    voteQuesItemList: [
                        {
                            isChecked: 0,
                            title: "选项1"
                        },
                        {
                            isChecked: 0,
                            title: "选项2"
                        },
                        {
                            isChecked: 0,
                            title: "选项3"
                        }
                    ]
                }
            ]
        }
    });
