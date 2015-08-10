'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('SessionCtrl', ["$scope", "$window", "resourcePool", "sync", "constants", "global", "socket", "utils", "msgRegister", function ($scope, $window, resourcePool,sync,
                                         constants, global, socket, utils,
                                         msgRegister) {
        $scope.sessionList = global.cache.sessions;
        var resUrl = global.cache.resUrl;
        $scope.msg = "";
        var w = angular.element($window);
        $scope.winHeight = w.height();
        var doReorder = function (data, firstLoad) {
            if (firstLoad) {
                data.reverse();
            }
            var result=utils.procRecorder($scope.selectSession,data);
            for (var i = 0; i < result.length; i++) {
                var obj = result[i];
                recorderList.push(obj);
            }
            setTimeout(function () {
                $(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
            }, 100)
        };
        var loadNewMsg = function (sessionId, lastTimestamp, firstTimestamp) {
            var params = {};
            params.sessionId = sessionId;
            params.lastTimestamp = lastTimestamp;
            params.firstTimestamp = firstTimestamp;
            var firstLoad = !lastTimestamp && !firstTimestamp;
            Recorders.query(params, function (data) {
                doReorder(data, firstLoad);
            });
        }
        var Recorders = resourcePool.recorders;
        var SessionUsers = resourcePool.sessionUsers;
        var SessionReader = resourcePool.sessionReader;
        var userIdArray = [];
        var recorderList = [];
        $scope.showSession = function (session) {
            $scope.selectSession = session;
            recorderList = session.recorders;
            global.pageStatus.session.selectSession = $scope.selectSession;
            var lastTimestamp = null;
            if (recorderList.length > 0) {
                lastTimestamp = recorderList[recorderList.length - 1].timestamp;
            }
            loadNewMsg($scope.selectSession.id, lastTimestamp, null);
            SessionUsers.query({sessionId: $scope.selectSession.id}, function (users) {
                users.forEach(function (user) {
                    userIdArray.push(user.id);
                });
            });
            SessionReader.update({sessionId: $scope.selectSession.id}, function (users) {
                $scope.selectSession.unreadCount = 0;
            })
        };
        $scope.send = function (ev) {
            if (ev.keyCode !== 13) return;
            $scope.doSend();
        };
        $scope.doSend = function () {
            var msg = $scope.msg.trim();
            if ($scope.msg.trim()) {
                var recorder = {
                    sessionId: $scope.selectSession.id,
                    message: msg
                };
                $scope.msg = "";
                Recorders.new(recorder, function (data) {
                    var lastRecorder = recorderList[recorderList.length - 1];
                    loadNewMsg($scope.selectSession.id, lastRecorder ? lastRecorder.timestamp : 0, null);
                    socket.emit("notify", {userIdArray: userIdArray, reqCode: "NOTIFY_PULL_FSC_SESSION"})
                });
                sync.syncSessionToTop($scope.selectSession)
            }
        };

        var sessionUpdateHandler = function (sessionId) {
            if (sessionId == $scope.selectSession.id) {
                $scope.selectSession.unreadCount = 0;
                var lastTimestamp = null;
                if (recorderList.length > 0) {
                    lastTimestamp = recorderList[recorderList.length - 1].timestamp;
                }
                loadNewMsg($scope.selectSession.id, lastTimestamp, null);
                SessionReader.update({sessionId: $scope.selectSession.id}, function (users) {
                })
            }
        };

        var doSelectSession = function(){
            $scope.selectSession = global.pageStatus.session.selectSession;
            if($scope.selectSession){
                $scope.showSession($scope.selectSession);
                if(global.pageStatus.session.toTop){
                    sync.syncSessionToTop($scope.selectSession);
                }
            }
        };

        var sessionPostHandler = function () {
            doSelectSession();
        };

        $scope.$on('$viewContentLoaded', function () {
            doSelectSession();
            msgRegister.registerMsg(constants.msgCode.SESSION_UPDATE, sessionUpdateHandler);
            msgRegister.registerMsg(constants.msgCode.SESSION_POST, sessionPostHandler);
        });

        $scope.$on("$destroy", function () {
            msgRegister.removeMsg(constants.msgCode.SESSION_UPDATE, sessionUpdateHandler);
        });
    }]);
