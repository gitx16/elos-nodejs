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
    'ngTouch',
    'infinite-scroll'
]).config(function ($routeProvider) {
    var viewPath = "/node_static/javascripts/app/";
    $routeProvider
        .when('/self', {
            templateUrl: viewPath + 'view/activity/activity_list.html',
            controller: 'ActivitySelfCtrl'
        })
        .when('/:actId', {
            templateUrl: viewPath + 'view/activity/activity_detail.html',
            controller: 'ActivityDetailCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/activity/activity_list.html',
            controller: 'ActivityListCtrl'
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
        activity: rc('/open/activities/{actId}'),
        activitySelf: rc('/el/activities/self'),
        actApply: rc('/el/activities/{actId}/apply')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {
        activities:[],
        currentPage:1,
        noMore:false,
        procActList:function(actList){
            for (var i = 0; i < actList.length; i++) {
                var obj = actList[i];
                if(obj.actStatus==1){
                    obj.statusImg = "vote_status_apply.png";
                }else if(obj.actStatus==2){
                    obj.statusImg = "act_status_apply_end.png";
                }else if(obj.actStatus==3){
                    obj.statusImg = "act_status_start.png";
                }else if(obj.actStatus==4){
                    obj.statusImg = "act_status_end.png";
                }
            }
        },
        offsetTop:0
    }
}).controller('ActivityListCtrl', function ($scope, resourcePool, $location, $rootScope, global,rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    ROOT_messageData.title  = "活动列表"
    $rootScope.showBack = false;
    $rootScope.inSelf = false;
    $rootScope.backUrl = "#/";
    $scope.noMore = global.noMore;

    var Activity = resourcePool.activity;
    var doRequire = false;
    var doLoadData = function(){
        doRequire = true;
        Activity.query({currentPage:global.currentPage}, function (data) {
            global.procActList(data);
            global.activities = global.activities.concat(data);
            $scope.activities = global.activities;
            global.currentPage+=1;
            if(data.length<25){
                global.noMore = true;
                $scope.noMore = global.noMore;
            }
            doRequire = false;
        });
    };

    if (global.activities) {
        $scope.activities = global.activities;
        setTimeout(function(){
            window.scrollTo(0,global.offsetTop);
        },10);
    }

    $scope.showAct = function (activity) {
        global.offsetTop = window.scrollY;
        $rootScope.backUrl = "#/";
        $location.path('/' + activity.id);
    }
    $scope.loadData = function(){
        if(!doRequire){
            doLoadData();
        }
    }
}).controller('ActivitySelfCtrl', function ($scope, resourcePool, $location, $rootScope, global) {
    $rootScope.backUrl = "#/";
    $rootScope.loading = true;
    $rootScope.showBack = false;
    $rootScope.inSelf = true;

    var ActivitySelf = resourcePool.activitySelf;
    ActivitySelf.query({}, function (data) {
        global.procActList(data);
        $scope.activities = data;
        $rootScope.loading = false;
    });
    $scope.showAct = function (activity) {
        $rootScope.backUrl = "#/self";
        $location.path('/' + activity.id);
    }
}).controller('ActivityDetailCtrl', function ($scope, $sce,$routeParams, $rootScope, resourcePool, msg,rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    $scope.actId = $routeParams.actId;
    $rootScope.loading = true;
    $rootScope.showBack = true;
    $rootScope.inSelf = false;

    $scope.to_trusted = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };

    var Activity = resourcePool.activity;
    Activity.get({}, {actId: $scope.actId}, function (data) {
        $scope.activity = data.model;
        ROOT_messageData.title = data.model.actName
        $rootScope.loading = false;
    });


    window.getCoverImg = function(){
        window.control&&window.control.getCoverImg($scope.activity.coverImg||"");
    }

    var ActApply = resourcePool.actApply;
    $scope.submitAct = function () {
        if($scope.activity.dataStatus==1){
            ActApply.create({actId:$scope.actId},{},function(){
                $scope.activity.dataStatus = 3;
                msg.success('报名成功');
                $scope.doSubmit = false;
                $scope.activity.actNum+=1;
            });
        }else if($scope.activity.dataStatus==3){
            ActApply.delete({actId:$scope.actId},{},function(){
                $scope.activity.dataStatus = 1;
                msg.success('取消报名成功');
                $scope.doSubmit = false;
                $scope.activity.actNum-=1;
            });
        }
    }
})
