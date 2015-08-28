'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('sync', function (resourcePool,constants,
                               global,utils,msgRegister,socket,$q,dialog) {
        return {
            /**
             * 同步群组
             */
            syncGroups:function(code) {
                var Groups = resourcePool.groups;
                Groups.query({code: code}, function (groups) {
                    utils.procGroups(groups, code);
                });
            },
            /**
             * 同步用户会话
             */
            syncUserSession:function(userId,cb){
                var Sessions = resourcePool.sessions;
                var sessions = global.cache.sessions;
                var self = this;
                if(sessions){
                    var sessionExists = false;
                    for (var i = 0; i < sessions.length; i++) {
                        var session = sessions[i];
                        if(session.type==constants.session.user){
                            if(session.msId== userId){
                                    cb(session);
                            }
                        }
                    }
                    if(!sessionExists){
                        Sessions.create({linkmanId:userId},{},function(data){
                            socket.emit("notify", {userIdArray: [userId], reqCode: "NOTIFY_PULL_FSC_LINKMAN_ACCEPT"})
                            self.syncSessions(function(sessions){
                                for (var i = 0; i < sessions.length; i++) {
                                    var session = sessions[i];
                                    if(session.type==constants.session.user){
                                        if(session.msId== userId){
                                            cb(session);
                                        }
                                    }
                                }
                            });
                        });
                    }
                }
            },
            /**
             * 同步会话
             */
            syncSessions:function(cb){
                var sessions = global.cache.sessions;
                var timestamp = 0;
                sessions.forEach(function(session){
                    if(session.timestamp>timestamp){
                        timestamp = session.timestamp;
                    }
                });
                var SessionSync = resourcePool.sessionSync;
                SessionSync.query({timestamp:timestamp},function(syncSessions){
                    var sessionMap = {};
                    syncSessions.forEach(function(session){
                        sessionMap[session.id] = session;
                    });
                    sessions.forEach(function(session){
                        if(sessionMap[session.id]){
                            var syncSession = sessionMap[session.id];
                            session.msName = syncSession.msName;
                            session.unreadCount = syncSession.unreadCount;
                            session.timestamp = syncSession.timestamp;
                            delete sessionMap[session.id];
                            msgRegister.dispatchMsg(constants.msgCode.SESSION_UPDATE,session.id);
                        }
                    });
                    angular.forEach(sessionMap, function(value, key) {
                        sessions.unshift(value);
                    });
                    utils.procSession();
                    cb&&cb(syncSessions);
                });
            },
            syncSessionUsers:function(fscSession,cb){
                var SessionUsers = resourcePool.sessionUsers;
                SessionUsers.query({sessionId: fscSession.id}, function (users) {
                    utils.procUsers(users);
                    fscSession.users = users;
                    cb(users);
                });
            },
            syncSessionToTop:function(session){
                var sessions = global.cache.sessions;
                var index=utils.getSessionIndex(session.id);
                sessions.splice(index,1);
                sessions.splice(0,0,session);
            },
            openLinkman : function(recorder,session,resUrl){
                var self = this;
                var deferred = $q.defer(); // 声明延后执行，表示要去监控后面的执行
                var sessionUser = resourcePool.sessionUser;
                var userTemp;
                sessionUser.query({id:recorder.createdBy},function(user) {
                    userTemp =user[0];
                    if(session.type!=1){
                        userTemp.unGoSession=false;
                    }
                    deferred.resolve();
                });
                var open =  function(){
                    dialog.complexBox(
                        {
                            templateUrl: '/node_static/javascripts/app/view/menus/linkman-menu.html',
                            size:'sm',
                            onComplete: function (dialogScope,modalInstance) {
                                dialogScope.user = userTemp;
                                dialogScope.recorder = recorder;
                                dialogScope.resUrl = resUrl;
                                dialogScope.closeMenu = function(){
                                    modalInstance.close();
                                };
                                dialogScope.goSession = function(userId){
                                    self.syncUserSession(userId,function(session){
                                        msgRegister.dispatchMsg(constants.msgCode.SESSION_SHOW,session);
                                    });
                                    modalInstance.close();
                                };
                            }
                        })
                };
                deferred.promise.then(open);
            }
        }
    });
