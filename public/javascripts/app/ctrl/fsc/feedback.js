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
        .when('/self', {
            templateUrl: viewPath + 'view/feedback/vote_list.html',
            controller: 'VoteSelfCtrl'
        })
        .when('/:voteId', {
            templateUrl: viewPath + 'view/feedback/vote_detail.html',
            controller: 'VoteDetailCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/feedback/feedback.html',
            controller: 'FeedbackCtrl'
        });
}).run(function ($rootScope, resourcePool) {
    $rootScope.backUrl = "#/";
    resourcePool.session.get({}, false, function (data) {
        $rootScope.isLogin = data.isLogin;
        $rootScope.resServer = data.resServer + "/";
    });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        session: rc('/open/session'),
        feedback: rc('/open/feedbacks'),
        item: rc('/open/feedback/items')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {}
}).controller('FeedbackCtrl', function ($scope, resourcePool, $location, $rootScope, global, rootDataService,msg) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    ROOT_messageData.title = "意见反馈";

    var Item = resourcePool.item;
    var Feedback = resourcePool.feedback;
    $scope.parentArray = [];
    $scope.fb = {};
    $scope.fbDone = false;
    Item.query({}, function (data) {
        $scope.fbItems = data;
    });

    $scope.onTouchend = function (item) {
        $scope.selectId = 0;
    };
    $scope.onTouchstart = function (item) {
        $scope.selectId = item.id;
    };
    $scope.clickItem = function (item) {
        if (item.isParent) {
            $scope.parentArray.push(item);
            Item.query({parentId: item.id}, function (data) {
                $scope.fbItems = data;
            });
        }else if($scope.parentArray.length==2){
            item.selected = item.selected?!item.selected:true;
        }
    };
    $scope.backParent = function () {
        if ($scope.parentArray.length) {
            var parentItem = $scope.parentArray.pop();
            Item.query({parentId: parentItem.parentId}, function (data) {
                $scope.fbItems = data;
            });
        }
    };
    $scope.submitFb = function(){
        var itemIdArray = [];
        angular.forEach($scope.fbItems,function(item){
            if(item.selected){
                itemIdArray.push({itemId:item.id});
            }
        });
        if(itemIdArray.length){
            $scope.fb.mapList = itemIdArray;
            Feedback.create({}, $scope.fb, function (data) {
                $scope.fbDone = true;
            });
        }else{
            msg.error('请选择反馈项');
        }
    }
});
