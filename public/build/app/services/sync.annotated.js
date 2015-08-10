'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('sync', ["resourcePool", "constants", "global", "utils", "msgRegister", function (resourcePool,constants,
                               global,utils,msgRegister) {
        return {
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
            }
        }
    }]);
