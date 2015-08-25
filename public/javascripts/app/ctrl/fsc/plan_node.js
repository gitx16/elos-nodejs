'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp',[])
    .controller('PlanNodeCtrl', function ($scope,msg,resourcePool,$location) {
        $scope.suuid = window.location.search.split("=")[1]
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
});