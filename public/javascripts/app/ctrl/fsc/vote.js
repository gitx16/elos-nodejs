'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp', [])
    .controller('VoteCtrl', function ($scope, $http,msg) {
        $scope.hasLoding = false;
        $http({
            url: "/open/vote/"+$scope.voteId+".json"
        }).success(function (res, status, headers, config) {
            var stat = res.stat;
            if (stat == "OK") {
                $scope.vote = res.data.model;
            }
            $scope.hasLoding = true;
        }).error(function (res, status, headers, config) {
            $log.log('请求失败：' + res);
        });

        $scope.itemClick = function (voteQues, voteQuesItem) {
            if ($scope.vote.dataStatus != 1) {
                return;
            }
            if (voteQues.checkType == 1) {
                for (var i = 0; i < voteQues.voteQuesItemList.length; i++) {
                    var obj = voteQues.voteQuesItemList[i];
                    obj.isChecked = false;
                }
                voteQuesItem.isChecked = true;
            } else {
                voteQuesItem.isChecked = !voteQuesItem.isChecked;
            }
        };
        $scope.doSubmit = false;
        /**
         *
         */
        $scope.submitVote = function () {
            $scope.doSubmit = true;
            /**
             * [
             *  {
             *      voteId:"",
             *      quesId:"",
             *      itemId:""
             *  }
             * ]
             */
            var selectItem = [];
            for (var i = 0; i < $scope.vote.voteQuesList.length; i++) {
                var ques = $scope.vote.voteQuesList[i];
                for (var j = 0; j < ques.voteQuesItemList.length; j++) {
                    var item = ques.voteQuesItemList[j];
                    if (item.isChecked) {
                        selectItem.push({
                            voteId: $scope.vote.id,
                            quesId: ques.id,
                            itemId: item.id
                        });
                    }
                }
            }
            if(selectItem.length==0){
                msg.error('请选择投票项');
                $scope.doSubmit = false;
            }else{
                $http({
                    url: "/el/vote/"+$scope.voteId+"/answer.json?_method=post",
                    method: "POST",
                    headers: {
                        contentType: 'application/json; charset=utf-8'
                    },
                    data: JSON.stringify(selectItem)
                }).success(function (res, status, headers, config) {
                    var stat = res.stat;
                    if(stat=="OK"){
                        $scope.vote.dataStatus = 3;
                        msg.error('投票成功');
                    }else{
                        if(res.errors&&res.errors.length>0){
                            msg.error(res.errors[0].msg);
                        }
                    }
                    $scope.doSubmit = false;
                }).error(function (res, status, headers, config) {
                    $scope.doSubmit = false;
                    msg.error('投票成功');
                });
            }
        }
    });
