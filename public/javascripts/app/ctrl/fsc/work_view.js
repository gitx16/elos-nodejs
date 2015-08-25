'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp',[])
    .controller('WorkViewCtrl', function ($scope,resourcePool) {
        var ResourceSc = resourcePool.works
        ResourceSc.query({workId:$scope.workId,type:"ques"},function(){
        })
    });