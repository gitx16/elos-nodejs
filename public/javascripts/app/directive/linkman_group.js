'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .directive('linkmanGroup', function(){
        return {
            restrict: 'E',
            templateUrl: '/node_static/javascripts/app/view/directive/linkman_group.html',
            replace: true,
            scope: {
                group: '=',
                users: '=',
                selectUser: '=',
                showUser: '&',
                headerClick: '&'
            },
            link: function(scope, element, attrs){
            }
        }
    })
