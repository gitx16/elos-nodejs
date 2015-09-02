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
        .when('/:stuId', {
            templateUrl: viewPath + 'view/time_table/time_table.html',
            controller: 'TimeTableCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/time_table/time_table.html',
            controller: 'TimeTableCtrl'
        });
}).run(function ($rootScope, resourcePool) {
    $rootScope.backUrl = "#/";
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        timeTable: rc('/open/timetable/{classId}')
    }
}).controller('TimeTableCtrl', function ($scope, resourcePool) {
    var timeTable = resourcePool.timeTable
    timeTable.query({classId:$scope.classId},function(data){
        $scope.timedata = data
    })
    $scope.currentType = "no"
    $scope.touch = function(type){
        $scope.currentType = type
    }

})
