'use strict';
/**
 * @ngdoc directive
 * @name fscApp.directive:echarts
 * @description
 * # echarts
 */
angular.module('fscApp')
    .directive('echartsForce', function () {
        return {
            restrict:'E',
            replace:true,
            template:'<div class="echarts-force"></div>',
            scope:{
                initNodes:'='
            },
            link: function ($scope,$element,attrs) {
                var echartsUtil;
                var ecNodes = [],ecLinks = [];
                $scope.$watch('initNodes',function (val) {
                    if(val){
                        echartsUtil.forceMockThreeData($element[0],$scope.initNodes);
                        var options = echartsUtil.getOptions();
                        echarts.init($element[0]).setOption(options);
                    }
                })

                echartsUtil = {
                    forceMockThreeData: function (mainDom, initNodes) {
                        var self = this;
                        var x = mainDom.clientWidth / 2;
                        var y = 100 ;
                        var rootNode = {
                            name: "知识点",
                            value: 3,
                            id: 0,
                            depth:0,
                            initial : [x,y],
                            fixY : true,
                            category: 0
                        }
                        ecNodes.push(rootNode);
                        initNodes.forEach(function (node) {
                                var childNode = self.createRandomNode(mainDom,node);
                                var parentName = self.getParentname(node.parentId, initNodes);
                                ecLinks.push({
                                    source: parentName,
                                    target: childNode.name
                                });
                            }
                        );
                    },
                    createRandomNode: function (mainDom,node) {
                        var x = mainDom.clientWidth / 2 + (.5 - Math.random()) * 200;
                        var y = -(mainDom.clientHeight - 850) *node.depth/ (4 + 1)+120 ;
                        var nodeColour = node.accuracy*10+1;
                        var ecNode = {
                            name: node.name,
                            value: 3,
                            id: node.id,
                            depth:node.depth,
                            initial : [x, y],
                            fixY : true,
                            category: nodeColour
                        }
                        ecNodes.push(ecNode);
                        return ecNode;
                    },
                    getParentname: function (parentId, initNodes) {
                        if (parentId == 0) {
                            return "知识点";
                        }
                        var parentName;
                        initNodes.some(function (node) {
                            if (node.id == parentId) {
                                parentName = node.name;
                                return true;
                            }
                        });
                        return parentName;
                    },
                    getOptions: function () {
                        var categorieList = this.getCategories();
                        return {
                            title: {
                                text: '知识点',
                                subtext: '红色为未通过，绿色为通过',
                                textStyle:{
//                                    fontFamily:"Microsoft Yahei"
                                },
                                subtextStyle:{
                                    color:'#727272'
//                                    fontFamily:"Microsoft Yahei"
                                }
                            },
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} : {b}'
                            },
                            toolbox: {
                                show: true,
                                feature: {
//                                    restore: {show: true},
//                                    saveAsImage: {show: true}
                                }
                            },
                            legend: {
                                y: 'bottom',
                                x:"left",
                                data:['全错','0~10%','10%~20%','20%~30%','30%~40%','40%~50%',
                                    '50%~60%','60%~70%','70%~80%','80%~90%','全对']
                            },
                            series: [
                                {
                                    type: 'force',
                                    name: "Force tree",
                                    categories: categorieList,
                                    minRadius: 40,
                                    maxRadius: 80,
                                    nodes: ecNodes,
                                    links: ecLinks
                                }
                            ]
                        }
                    },
                    getCategories:function(){
                        var colourList = ["#E68080","#dc8881","#d29081","#c79882","#bda083",
                            "#b3a884","#a9af84","#9fb785", "#94bf86","#8ac786","#80cf87"];
                        var nameList = ['全错','0~10%','10%~20%','20%~30%','30%~40%','40%~50%',
                            '50%~60%','60%~70%','70%~80%','80%~90%','全对'];
                        var categorieList = [
                            {
                                name: '知识点',
                                itemStyle: {
                                    normal: {
                                        color: '#ffffff',
                                        strokeColor: '#000000',
                                        brushType: 'both',
                                        lineWidth: 1,
                                        label: {
                                            show: true,
                                            textStyle: {
                                                fontFamily:"Microsoft Yahei",
                                                color: '#424242'
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                        var self = this;
                        colourList.forEach(function(colour,index){
                            var categorie = self.getCategorie(colour,nameList[index]);
                            categorieList.push(categorie);
                        })
                        return categorieList;
                    },
                    getCategorie:function(colour,name){
                        var Categorie = {
                            name: name,
                            itemStyle: {
                                normal: {
                                    color: colour,
                                    label: {
                                        show: true,
                                        textStyle: {
//                                    fontFamily:"Microsoft Yahei",
                                            color: '#424242'
                                        }
                                    },
                                    nodeStyle: {
                                        brushType: 'both',
                                        strokeColor: colour,
                                        lineWidth: 1
                                    }
                                }
                            }
                        }
                        return Categorie;
                    }
                };
            }
        };


    })
    .directive('echartsBar', function () {
        return {
            restrict:'E',
            replace:true,
            template:'<div class="echarts-bar"></div>',
            scope:{
                initData:'='
            },
            link: function ($scope,$element,attrs) {
                $scope.$watch('initData',function (val) {
                    if(val){
                        echarts.init($element[0]).setOption(getOption());
                    }
                });
                function getOption() {
                    var initData = $scope.initData;
                    var lowestList = [];
                    var highestList = [];
                    var averageList = [];
                    var xAxisdata = [];
                    initData.forEach(function (knowlStat) {
                        lowestList.push(knowlStat.knowlStu);
                        highestList.push(knowlStat.knowlHighest);
                        averageList.push(knowlStat.knowlAverage);
                        xAxisdata.push(knowlStat.name);
                    });
                    return {
                        grid:{
                            x:35,
                            y:80,
                            x2:20,
                            y2:20
                        },
                        title: {
                            text: '知识点统计',
                            textStyle:{
                                fontFamily:"Microsoft Yahei"
                            }
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            y:45,
                            data: ['个人','平均','最高'],
                            textStyle:{
                            }
                        },
                        toolbox: {
                            show: true,
                            feature: {
                            }
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: xAxisdata
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value',
                                max: 1,
                                min:0
                            }
                        ],
                        series: [
                            {
                                name: '个人',
                                type: 'bar',
                                data: lowestList,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            textStyle:{
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: '平均',
                                type: 'bar',
                                data: averageList,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            textStyle:{
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                name: '最高',
                                type: 'bar',
                                data: highestList,
                                itemStyle: {
                                    normal: {
                                        label: {
                                            show: true,
                                            textStyle:{
                                            }
                                        }
                                    }
                                }
                            }
                        ]
                    };
                }

            }
        }
    })
;
