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
        'LocalStorageModule',
        'ngFileUpload'
    ])
    .config(function ($routeProvider) {
        var viewPath = "/node_static/javascripts/app/";
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
                   constants, sync,msgRegister,dialog,$http) {
        $location.path('');
        var Init = resourcePool.init;
        var sessionId = $location.search().sessionId;
        Init.get({}, function (data) {
            global.cache = data.model;
            global.cache.groups = {
                "cGroup": {name: "班级组", open: false,type:constants.session._class},
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

            if(typeof String.prototype.trim !== 'function') {
                String.prototype.trim = function() {
                    return this.replace(/^\s+|\s+$/g, '');
                }
            }
        });

        msgRegister.registerMsg(constants.msgCode.AUTHC_TIMEOUT,function(){
            if(!global.loginBoxShow){
                global.loginBoxShow = true;
                dialog.complexBox({
                    templateUrl: '/node_static/javascripts/app/view/login.html',
                    size:'sm',
                    onComplete: function (dialogScope,modalInstance) {
                        dialogScope.errMsg = "会话已经过期，请重新登陆";
                        dialogScope.ok = function(){
                            dialogScope.errMsg = "";
                            dialogScope.okClick = true;
                            var username = dialogScope.username;
                            var password = dialogScope.password;
                            if(username&&password){
                                global.loginBoxShow = false;
                                $http({
                                    url:"/login.json",
                                    method:"POST",
                                    headers:{
                                        contentType: 'application/json; charset=utf-8'
                                    },
                                    params:{
                                        username:username,
                                        password:password
                                    }
                                }).success(function (res, status, headers, config) {
                                    if(res.stat=="OK"){
                                        window.location.reload();
                                    }else{
                                        dialogScope.errMsg = res.errors[0].msg;
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });

    });
