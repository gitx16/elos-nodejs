'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp', [
    'ngRoute',
    'ngTouch'
]).config(function ($routeProvider) {
    var viewPath = "/node_static/javascripts/app/";
    $routeProvider
        .when('/:typeId/:nodeId/:workId/view', {
            templateUrl: viewPath + 'view/plan_nodes/plan_view.html',
            controller: 'PlanViewCtrl'
        })
        .when('/:typeId/:workId/:paperId/analyze', {
            templateUrl: viewPath + 'view/plan_nodes/plan_analyze.html',
            controller: 'PlanAnalyzeCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/plan_nodes/plan_list.html',
            controller: 'PlanListCtrl'
        });
}).run(function ($rootScope, resourcePool) {
    $rootScope.backUrl = "#/";
    resourcePool.session.get({}, false, function (data) {
        $rootScope.isLogin = data.isLogin;
        $rootScope.resServer = data.resServer
    });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        session: rc('/open/session'),
        planNode:rc('/open/plan_nodes/{nodeId}/{map}'),
        works:rc('/open/works/{workId}/{type}/{qid}/{analysis}',null,{
            getAnalysis:{method:'get',params:{type:'papers',analysis:"analysis"}}
        }),
        exam:rc('/open/exam/{examId}/{type}/{qid}/{analysis}',null,{
            getAnalysis:{method:'get',params:{type:'papers',analysis:"analysis"}}
        })
    }
}).controller('PlanListCtrl', function ($scope, resourcePool, $rootScope,$location,msg,$sce,rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    $scope.suuid = window.location.search.split("=")[1]
    var ROOT_loginData = rootDataService.data('ROOT_loginData');
    ROOT_loginData.set("isBackdrop",false)
    var resourceNode = resourcePool.planNode
    var nodeTypeMap ={
        1:"课件",
        2:"题目作业",
        3:"试卷",
        4:"图文作业",
        5:"云文件"
    }
    $scope.links = []
    resourceNode.get({nodeId:$scope.nodeId,suuid:$scope.suuid},function(data){
        $scope.node= data.model;
        ROOT_messageData.title = data.model.nodeName
        if( $scope.node.teacherPortrait){
            $scope.node.teacherPortrait = $rootScope.resServer+'/'+ $scope.node.teacherPortrait
        }
        $scope.node.nodeTypeName =  nodeTypeMap[$scope.node.nodeType]
        if( $scope.node.picture){
            $scope.picture =  $scope.node.picture.split(",")
        }
        $scope.node.imgText = $sce.trustAsHtml( $scope.node.imgText)
        getLinks()
    })
    $scope.analyze = function(type,workId,paperId){
        if(paperId){
            $location.path('/' + type+'/' + workId+'/'+paperId+"/analyze");
        }else{
            msg.error('您没有权限查看，请先登录');
        }
    }
    $scope.over = function(){
        resourceNode.save({nodeId:$scope.nodeId,map:"submit"},{},function(){
            $scope.node.isFinish = true;
            msg.success("修改成功")
        })
    }
    $scope.collectWork = function(){
        resourceNode.save({nodeId:$scope.nodeId,map:"enshrine"},{},function(){
            if( $scope.node.isEnshrine){
                msg.success("取消收藏成功")
            }else{
                msg.success("收藏成功")
            }
            $scope.node.isEnshrine = !$scope.node.isEnshrine;
        })
    }
    var getLinks = function(){
        if( $scope.node.knowlList){
            var depthMap = {}
            var depth = 1;
            $scope.node.knowlList.forEach(function(knowl){
                if(depth<knowl.depth){
                    depth = knowl.depth;
                }
                if(!depthMap[knowl.depth]){
                    depthMap[knowl.depth] = {};
                }
                depthMap[knowl.depth][knowl.id] = knowl
            })
            for(var i=depth;i>1;i--){
                angular.forEach(depthMap[i],function(data){
                    if(!depthMap[i-1][data.parentId].submenu){
                        depthMap[i-1][data.parentId].submenu = []
                    }
                    depthMap[i-1][data.parentId].submenu.push(data)
                })
            }
            angular.forEach(depthMap[1],function(data){
                $scope.links.push(data)
            })
        }
    }
}).controller('PlanViewCtrl', function ($scope, resourcePool, $routeParams, $sce,rootDataService,msg) {
    $scope.workId = $routeParams.workId;
    var ROOT_loginData = rootDataService.data('ROOT_loginData');
    var typeMap = {
        2:"works",
        3:"exam"
    }
    $scope.suuid = window.location.search.split("=")[1]
    var ResourceSc = resourcePool[typeMap[$routeParams.typeId]]
    ResourceSc.query({workId:$scope.workId,type:"ques",nodeId:$routeParams.nodeId,suuid: $scope.suuid},function(data){
        $scope.questionGroups = data
        $scope.selectQuesNum(data[0].quesList[0],0,0)
    })
    $scope.curQuestion = {};
    $scope.next = function(){
        var index = $scope.curGroupIndex,
        parentIndex = $scope.curParentIndex,
        next = true
       if($scope.questionGroups[parentIndex].quesList.length-1== index){
           parentIndex = parentIndex+1;
           index = 0
           if(parentIndex >= $scope.questionGroups.length){
               msg.error("已经是最后一题")
               next = false
           }
       }else{
           index = index+1
       }
        if(next){
            $scope.selectQuesNum($scope.questionGroups[parentIndex].quesList[index],index,parentIndex)
        }
    }
    $scope.last = function(){
        var index = $scope.curGroupIndex,
            parentIndex = $scope.curParentIndex,
            last = true
        if(index==0){
            parentIndex = parentIndex-1;
            if(parentIndex < 0){
                msg.error("已经是第一题")
                last = false
            }else{
                index = $scope.questionGroups[parentIndex].length-1
            }
        }else{
            index = index-1
        }
        if(last){
            $scope.selectQuesNum($scope.questionGroups[parentIndex].quesList[index],index,parentIndex)
        }
    }
    $scope.selectQuesNum = function(q,index,parentIndex){
        $scope.curGroupIndex = index;
        $scope.curParentIndex = parentIndex
        ResourceSc.get({workId:$scope.workId,type:"ques",qid: q.quesId,suuid: $scope.suuid,nodeId:$routeParams.nodeId},function(data){
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
            $scope.answer = true
            $scope.quesList = false
            ROOT_loginData.set("isBackdrop",true)
        }else if(type==2){
            $scope.answer = false
            $scope.quesList = true
            ROOT_loginData.set("isBackdrop",true)
        }else{
            $scope.answer = false
            $scope.quesList = false
            ROOT_loginData.set("isBackdrop",false)
        }
    }
}).controller('PlanAnalyzeCtrl', function ($scope, $routeParams, $rootScope, resourcePool, msg) {
    $scope.workId = $routeParams.workId;
    $scope.paperId = $routeParams.paperId;
    var typeMap = {
        2:"works",
        3:"exam"
    }
    var ResourceSc = resourcePool[typeMap[$routeParams.typeId]]
    $scope.type = 1
    ResourceSc.getAnalysis({workId:$scope.workId,qid: $scope.paperId},function(data){
        var resource = data.model
        $scope.eachKnowlStat = resource.eachKnowlStat;
        $scope.knowlStat = resource.knowlStat;
    })
    $scope.change = function (type){
        $scope.type=type
    }
})
