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
        notice: rc('/open/notices/{noticeId}')
    }
}).controller('TimeTableCtrl', function ($scope, resourcePool) {
    $scope.timedata = [{"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'},
                {"monSubject":'数学',"tueSubject":'数学',"wedSubject":'数学',"thuSubject":'数学',"friSubject":'数学'}]
    $scope.currentType = "no"
    $scope.touch = function(type){
        $scope.currentType = type
    }

})
