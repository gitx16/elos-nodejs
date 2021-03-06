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
    'ngTouch',
    'infinite-scroll'
]).config(function ($routeProvider) {
    var viewPath = "/node_static/javascripts/app/";
    $routeProvider
        .when('/:noticeId', {
            templateUrl: viewPath + 'view/notice/notice_detail.html',
            controller: 'NoticeDetailCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/notice/notice_list.html',
            controller: 'NoticeListCtrl'
        });
}).run(function ($rootScope, resourcePool) {
    $rootScope.backUrl = "#/";
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        notice: rc('/open/notices/{noticeId}')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {
        notices: [],
        currentPage: 1,
        noMore: false,
        offsetTop:0
    }
}).controller('NoticeListCtrl', function ($scope, resourcePool, $window, $location, $rootScope, global,rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    ROOT_messageData.title = "通知公告"
    $rootScope.showBack = false;
    $rootScope.backUrl = "#/";
    $scope.noMore = global.noMore;

    var Notice = resourcePool.notice;
    var doRequire = false;
    var doLoadData = function () {
        doRequire = true;
        Notice.query({currentPage: global.currentPage}, function (data) {
            global.notices = global.notices.concat(data);
            $scope.notices = global.notices;
            global.currentPage += 1;
            if (data.length < 15) {
                global.noMore = true;
                $scope.noMore = global.noMore;
            }
            doRequire = false;
        });
    };

    if (global.notices.length > 0) {
        $scope.notices = global.notices;
        setTimeout(function(){
            window.scrollTo(0,global.offsetTop);
        },10);
    }

    $scope.showNotice = function ($event, notice) {
        global.offsetTop = window.scrollY;
        $rootScope.backUrl = "#/";
        $location.path('/' + notice.id);
    };
    $scope.loadData = function () {
        if (!doRequire) {
            doLoadData();
        }
    }
}).controller('NoticeDetailCtrl', function ($scope, $sce, $routeParams, $rootScope, resourcePool, rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    $scope.noticeId = $routeParams.noticeId;
    $rootScope.loading = true;
    $rootScope.showBack = true;

    $scope.to_trusted = function (html_code) {
        return $sce.trustAsHtml(html_code);
    };

    var Notice = resourcePool.notice;
    Notice.get({}, {noticeId: $scope.noticeId}, function (data) {
        $scope.notice = data.notice;
        ROOT_messageData.title = data.notice.title
        $scope.notice.noticeType = data.noticeType;
        $rootScope.loading = false;
    });
    window.getCoverImg = function(){
        window.control&&window.control.getCoverImg($scope.notice.coverImg||"");
    }
})
