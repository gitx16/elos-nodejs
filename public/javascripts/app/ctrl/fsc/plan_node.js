'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp',[])
    .controller('PlanNodeCtrl', function ($scope,$http,msg,resourcePool) {
        var nodeTypeMap ={
            1:"课件",
            2:"题目作业",
            3:"试卷",
            4:"图文作业",
            5:"云文件"
        }
        $scope.links = []
        $http({
            url: "/open/plan_nodes/" + $scope.nodeId + ".json",
            data:{suuid:"f5aa88c4-8ccb-11e4-a4d0-a4fb000a34e4"}
        }).success(function (res) {
            var stat = res.stat;
            if (stat == "OK") {
                $scope.node = res.data.model;
                $scope.node.nodeTypeName =  nodeTypeMap[$scope.node.nodeType]
                if( $scope.node.picture){
                    $scope.picture =  $scope.node.picture.split(",")
                }
                getLinks()
            }
            $scope.hasLoding = true;
        }).error(function (res) {
            $log.log('请求失败：' + res);
        });
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