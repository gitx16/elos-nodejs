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
        .otherwise({
            templateUrl: viewPath + 'view/feedback/feedback.html',
            controller: 'FeedbackCtrl'
        });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        feedback: rc('/open/feedbacks'),
        item: rc('/open/feedback/items')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {}
}).controller('FeedbackCtrl', function ($scope, resourcePool, $location, $rootScope, global, rootDataService, msg) {
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
        } else if ($scope.parentArray.length == 2) {
            item.selected = item.selected ? !item.selected : true;
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

    $scope.submitFb = function () {
        var itemIdArray = [];
        angular.forEach($scope.fbItems, function (item) {
            if (item.selected) {
                itemIdArray.push({itemId: item.id});
            }
        });
        if (itemIdArray.length) {
            $scope.fb.mapList = itemIdArray;
            Feedback.create({}, $scope.fb, function (data) {
                $scope.fbDone = true;
            });
        } else {
            msg.error('请选择反馈项');
        }
    };

    $scope.showBack = true;
    $scope.inputBlur = function () {
        $scope.showBack = true;

    }

    $scope.inputFocus = function () {
        $scope.showBack = false;
        setTimeout(function () {
            $("html, body").animate({ scrollTop: $(".feedback").height() }, 100)
        }, 100)
    }
});
