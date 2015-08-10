/**
 * Created by 迟宁 on 2015/7/14.
 */
'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('SessionCtrl', ["$scope", "$http", "$routeParams", function ($scope, $http,$routeParams) {
        $http.get('/api/work/get?workId=' + $routeParams.workId)
            .success(function (text) {
                $scope.recorder = text;
                $scope.recorder.message = $sce.trustAsHtml($rootScope.recorder.message);
            });
    }]);
