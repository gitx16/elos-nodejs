/**
 * Created by laborc on 15/8/26.
 */
angular.module('fscApp')
    .directive("ngTouchstart", function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchstart', onTouchStart);

                function onTouchStart(event) {
                    var method = '$scope.' + $element.attr('ng-touchstart');
                    $scope.$apply(function () {
                        eval(method);
                    });
                }
            }
        }
    })
    .directive("ngTouchend", function () {
        return {
            controller: function ($scope, $element, $attrs) {
                $element.bind('touchend', onTouchEnd);
                function onTouchEnd(event) {
                    var method = '$scope.' + $element.attr('ng-touchend');
                    $scope.$apply(function () {
                        eval(method);
                    });
                }
            }
        };
    });
