'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmLoading
 * @description
 * # elmLoading
 * Factory in the elmApp.
 */
angular.module('fscApp')
  .factory('loading', function ($rootScope) {
    return function (flag) {
        flag = angular.isUndefined(flag) ? true : flag;
        $rootScope.showLoading = flag;
    }
  });
