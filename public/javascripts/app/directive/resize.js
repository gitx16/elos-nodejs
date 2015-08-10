'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .directive('resize', function($window) {
        return function(scope, element, attr) {
            var w = angular.element($window);
            w.on('resize', function() {
                scope.winHeight = w.height();
                scope.$apply();
            });
        };
    });

