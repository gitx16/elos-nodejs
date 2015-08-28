'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('SessionCtrl',function ($scope, $window,$timeout,resourcePool,sync,
                                         constants, global, socket, utils,
                                         msgRegister,emoji,Upload) {
        $scope.sessionList = global.cache.sessions;
        $scope.resUrl = global.cache.resUrl;
        $scope.msg = "";
        $scope.file = {
            filepath:"",
            viewHeight:0
        };
        $scope.view = false;
        $scope.viewHeight = 90;
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
                if( $(".chat-content")[0])
                {$(".chat-content").scrollTop($(".chat-content")[0].scrollHeight);
                }

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
        };
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
                angular.forEach(users,function(user){
                    //forEach����IE8
                    if(user.id!=global.cache.user.id){
                        userIdArray.push(user.id);
                    }
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
            if ($scope.msg.trim()||$scope.view) {
                var recorder = {
                    sessionId: $scope.selectSession.id,
                    message: msg,
                    type:constants.rCode.text
                };
                if($scope.view){
                    recorder.message = $scope.jmdc;
                    recorder.type = constants.rCode.img;
                    $scope.view = false;
                    $scope.viewHeight -= 96;
                }
                $scope.msg = "";
                Recorders.create(recorder, function (data) {
                    var lastRecorder = recorderList[recorderList.length - 1];
                    loadNewMsg($scope.selectSession.id, lastRecorder ? lastRecorder.timestamp : 0, null);
                    socket.emit("notify", {userIdArray: userIdArray, reqCode: "NOTIFY_PULL_FSC_SESSION"});
                    userIdArray = [];
                });
                sync.syncSessionToTop($scope.selectSession);
            }
        };

        $scope.imgDelete = function(){
            $scope.view = false;
            $scope.viewHeight -= 96;
        };

        $scope.enterFile = function(){
            $scope.msg = "";
        };
        for(var i=0;i<$scope.sessionList.length;i++){
            if($scope.sessionList[i].show!=false){
                $scope.sessionList[i].show=true;
            }
        }
        $scope.removeFromSession = function(session){
            for(var i=0;i<$scope.sessionList.length;i++){
                if($scope.sessionList[i]==session){
                    session.show=false;
                }
            }
        };
        $scope.sessionRemove = function(session){
            session.removeSession=true;
        };
        $scope.sessionNotRemove = function(session){
            session.removeSession=false;
        };

        $scope.blurFirst = 0;

        $scope.focu = function(){
            $scope.blurFirst = 0;
        };
        $scope.blur = function(){
            $scope.flag = 1;
            var pos;
            var el = $('#chat-input').get(0);
            if ('selectionStart' in el) {
                //debugger
                pos = el.selectionStart;
            }else if ('selection' in document) {
                //debugger
                el.focus();
                var Sel = document.selection.createRange();
                var SelLength = document.selection.createRange().text.length;
                Sel.moveStart('character', -el.value.length);
                pos = Sel.text.length - SelLength;
            }
            if($scope.blurFirst == 0){
                $scope.flag = 0;
            }
            return pos;
        };

        $scope.click = false;
        $scope.faceOn = function(){
            $scope.click = !$scope.click;
        };

        if(!global.emojiCache){
            global.emojiCache = [];
            var row;
            var i = 0;
            angular.forEach(emoji,function(data,label){
                if(i%15==0){
                    row = [];
                    global.emojiCache.push(row);
                }
                row.push({
                    img:data,
                    label:label
                });
                i++;
            });
        }
        $scope.emojiArray = global.emojiCache;

        //��ӱ����ǩ
        $scope.faceLable = function(label,blur){
            var str = $('#chat-input').val();
            if($scope.flag == true){ //flagΪ1��ʾ����Ϊ�����Ľ��
                blur = $scope.blurFirst;
            }
            str = str.substr(0,blur) + label + str.substr(blur,str.length);
            $scope.msg = str;
            if($scope.blurFirst == 0 || $scope.flag == true){
                $scope.blurFirst = blur+label.length;
            }
            $scope.faceOn();
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

        var sessionShowHandler = function (fscSession) {
            $scope.showSession(fscSession);
            sync.syncSessionToTop(fscSession);
        };

        $scope.$on('$viewContentLoaded', function () {
            doSelectSession();
            msgRegister.registerMsg(constants.msgCode.SESSION_UPDATE, sessionUpdateHandler);
            msgRegister.registerMsg(constants.msgCode.SESSION_POST, sessionPostHandler);
            msgRegister.registerMsg(constants.msgCode.SESSION_SHOW, sessionShowHandler);
        });

        $scope.$on("$destroy", function () {
            msgRegister.removeMsg(constants.msgCode.SESSION_UPDATE, sessionUpdateHandler);
        });

        $scope.$watch('file', function () {
            $scope.upload = function (files) {
                if (files && files.length&&files[0].filepath != "") {
                    for (var i = 0; i < files.length; i++) {
                        var file = files[i];
                        Upload.upload({
                            url: '/files',
                            fileFormDataName:"myfile",
                            file: file
                        }).success(function (data, status, headers, config) {
                            $timeout(function() {
                                //$scope.log = 'file: ' + config.file.name + 'Response: ' + JSON.stringify(data) + '\n' + $scope.log;
                                $scope.file.filePath = $scope.resUrl+'/'+data.data.url;//�ϴ�ͼƬ�ĵ�ַ
                                $scope.jmdc = data.data.url;
                                $scope.view = true;
                                $scope.viewHeight = 182;
                            });
                        });
                    }
                }
            };
            $scope.upload([$scope.file]);
        });
    });
