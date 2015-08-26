'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp',[])
    .controller('WorkViewCtrl', function ($scope,resourcePool,$sce) {
        var ResourceSc = resourcePool.works
        ResourceSc.query({workId:$scope.workId,type:"ques"},function(data){
            $scope.questionGroups = data
            $scope.selectQuesNum(data[0].quesList[0])
        })
        $scope.curQuestion = {};
        $scope.selectQuesNum = function(q,qGroup){
            ResourceSc.get({workId:$scope.workId,type:"ques",qid: q.quesId},function(data){
                var resource = data.model;
                resource.question = $sce.trustAsHtml(resource.question)
                resource.answer = $sce.trustAsHtml(resource.answer)
                resource.analysis = $sce.trustAsHtml(resource.analysis)
                $scope.curQuestion = resource;
                $scope.curQuestion.expand = {};
                angular.extend($scope.curQuestion.expand,{
                    question: true,
                    answer: false,
                    analysis: false
                })
            })
        }
        $scope.changeShow = function(type){
            if(type==1){
                $scope.analysis = true
            }else{
                $scope.analysis = false
            }
        }
    });