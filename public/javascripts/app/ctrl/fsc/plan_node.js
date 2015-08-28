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
        .when('/:workId/view', {
            templateUrl: viewPath + 'view/plan_nodes/plan_view.html',
            controller: 'PlanViewCtrl'
        })
        .when('/:workId/:paperId/analyze', {
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
    });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        session: rc('/open/session'),
        planNode:rc('/open/plan_nodes/{nodeId}'),
        works:rc('/open/works/{workId}/{type}/{qid}/{analysis}',null,{
            getAnalysis:{method:'get',params:{type:'papers',analysis:"analysis"}}
        }),
        exam:rc('/open/exam/{examId}/{type}/{qid}/{analysis}',null,{
            getAnalysis:{method:'get',params:{type:'papers',analysis:"analysis"}}
        })
    }
}).controller('PlanListCtrl', function ($scope, resourcePool, $rootScope,$location) {
    $scope.suuid = window.location.search.split("=")[1]
    debugger
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
        $scope.node.nodeTypeName =  nodeTypeMap[$scope.node.nodeType]
        if( $scope.node.picture){
            $scope.picture =  $scope.node.picture.split(",")
        }
        getLinks()
    })
    $scope.analyze = function(workId,paperId){
        $location.path('/' + workId+'/'+paperId+"/analyze");
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
}).controller('PlanViewCtrl', function ($scope, resourcePool, $routeParams, $sce) {
    $scope.workId = $routeParams.workId;
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
}).controller('PlanAnalyzeCtrl', function ($scope, $routeParams, $rootScope, resourcePool, msg) {
    $scope.workId = $routeParams.workId;
    $scope.paperId = $routeParams.paperId;
    var ResourceSc = resourcePool.works
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
