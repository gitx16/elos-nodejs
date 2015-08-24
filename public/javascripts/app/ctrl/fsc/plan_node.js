'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp', [])
    .controller('PlanNodeCtrl', function ($scope,$http,msg) {
        var nodeTypeMap ={
            1:"课件",
            2:"题目作业",
            3:"试卷",
            4:"图文作业",
            5:"云文件"
        }
        $scope.node =  {
            "nodeId": "节点id",
            "subjectName": "学科",
            "teacherName": "老师名称",
            "nodeName": "节点名称",
            "nodeTime": "2015-1-12",
            "imgText": "图文信息",
            "picture": "/assets/img/index/ic_launcher.png,/assets/img/index/ic_launcher.png,/assets/img/index/ic_launcher.png,/assets/img/index/ic_launcher.png",
            "voice": "语音信息",
            "fileType":"文件类型",
            "nodeType":"1",
            "isFinish":"作业状态1完成 0未完成",
            "nodeStatus":"",
            "osrCwScoVOList": [
                {
                    "id":"学习单元id",
                    "parentId":"父节点id",
                    "scoName":"学习单元名称"
                 }, {
                    "id":"学习单元id",
                    "parentId":"父节点id",
                    "scoName":"学习单元名称"
                }, {
                    "id":"学习单元id",
                    "parentId":"父节点id",
                    "scoName":"学习单元名称"
                }
            ],
            "knowlList": [
                 {
                    "id":"1",
                    "depth":"1",
                    "parentId":"0",
                    "name":"Item 1"
                 },{
                    "id":"2",
                    "depth":"1",
                    "parentId":"0",
                    "name":"Item 2"
                },{
                    "id":"3",
                    "depth":"1",
                    "parentId":"0",
                    "name":"Item 3"
                },{
                    "id":"4",
                    "depth":"2",
                    "parentId":"1",
                    "name":"Item 4"
                },{
                    "id":"5",
                    "depth":"2",
                    "parentId":"1",
                    "name":"Item 5"
                },{
                    "id":"6",
                    "depth":"3",
                    "parentId":"4",
                    "name":"Item 6"
                },{
                    "id":"7",
                    "depth":"2",
                    "parentId":"2",
                    "name":"Item 7"
                },{
                    "id":"8",
                    "depth":"3",
                    "parentId":"7",
                    "name":"Item 8"
                }
            ]
        }
        $scope.node.nodeTypeName =  nodeTypeMap[$scope.node.nodeType]
        if( $scope.node.picture){
            $scope.picture =  $scope.node.picture.split(",")
        }
        $scope.links = []
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
});