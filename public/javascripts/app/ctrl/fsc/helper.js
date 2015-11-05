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
            templateUrl: viewPath + 'view/fsc_helper/fsc_helper.html',
            controller: 'FscHelperCtrl'
        });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        item: rc('/open/fsc_helper/items/{itemId}'),
        fb: rc('/open/fsc_helper/fb')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {}
}).controller('FscHelperCtrl', function ($scope, resourcePool, $location, $rootScope, global, rootDataService,msg) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    ROOT_messageData.title = "帮助手册";

    var Item = resourcePool.item;
    var Fb = resourcePool.fb;
    $scope.parentArray = [];
    Item.query({}, function (data) {
        $scope.fhItems = data;
    });

    $scope.onTouchend = function (item) {
        $scope.selectId = 0;
    };
    $scope.onTouchstart = function (item) {
        $scope.selectId = item.id;
    };
    $scope.clickItem = function (item) {
        $scope.parentArray.push(item);
        if (item.isParent) {
            Item.query({parentId: item.id}, function (data) {
                $scope.fhItems = data;
            });
        }else{
            Item.get({itemId: item.id}, function (data) {
                $scope.helperItem = data.model;
            });
        }
    };
    $scope.backParent = function () {
        if ($scope.parentArray.length) {
            var parentItem = $scope.parentArray.pop();
            Item.query({parentId: parentItem.parentId}, function (data) {
                $scope.fhItems = data;
                $scope.helperItem = null;
                $scope.fbStatus=undefined;
            });
        }
    };
    $scope.submitFb = function(status){
        if($scope.fbStatus==undefined){
            if($scope.helperItem){
                Fb.create({}, {itemId:$scope.helperItem.id,fbStatus:status}, function (data) {
                    $scope.fbStatus = status;
                });
            }
        }
    }
});
