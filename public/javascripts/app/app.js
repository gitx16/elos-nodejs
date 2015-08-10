'use strict';

/**
 * @ngdoc overview
 * @name elmApp
 * @description
 * # elmApp
 *
 * Main module of the application.
 */
var fscApp = angular
    .module('fscApp', [
//        'ngAnimate',
        'ngCookies',
        'ngRoute',
        'ngSanitize',
        'ui.bootstrap',
        'LocalStorageModule'
    ])
    .config(function ($routeProvider) {
        var viewPath = "/im/javascripts/app/";
        $routeProvider
            .when('/session', {
                templateUrl: viewPath + 'view/session.html',
                controller: 'SessionCtrl'
            })
            .when('/linkman', {
                templateUrl: viewPath + 'view/linkman.html',
                controller: 'LinkmanCtrl'
            })
            .when('/group', {
                templateUrl: viewPath + 'view/group.html',
                controller: 'GroupCtrl'
            });
    })
    .run(function ($rootScope, $location,
                   resourcePool, global, socket, utils,
                   constants, sync,msgRegister) {
        $location.path('');
        var Init = resourcePool.init;
        var sessionId = $location.search().sessionId;
        Init.get({}, function (data) {
            global.cache = data.model;
            global.cache.groups = {
                "cGroup": {name: "班级组", open: false,type:constants.session.class},
                "gGroup": {name: "群组", open: false,type:constants.session.group}
            };
            var userType = global.cache.user.userType;
            if (userType == constants.userType.teacher) {
                global.cache.groups.tGroup = {name: "教研组", open: false,type:constants.session.trg};
            }
            utils.procUser();
            utils.procSession();
            utils.procClasses();
            if(sessionId){
                var sessionVO = utils.getFscSessionByFid(sessionId);
                global.pageStatus.session.selectSession = sessionVO;
            }
            if ($location.path) {
                $location.path('/session');
            }
            socket.emit("register", global.cache.user);//注册五福
            socket.on("notify", function (data) {
                if (data.reqCode == constants.reqCode.NOTIFY_PULL_FSC_SESSION) {
                    sync.syncSessions();
                }
            })
            msgRegister.dispatchMsg(constants.msgCode.USER_UPDATE);
        });
    });
