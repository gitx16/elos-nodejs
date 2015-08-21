'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('utils', function (constants, global) {
        return {
            /**
             * 处理会话图片
             */
            procSession: function () {
                var sessions = global.cache.sessions;
                for (var i = 0; i < sessions.length; i++) {
                    var session = sessions[i];
                    if (!session.portraitArray) {
                        if (session.type == constants.session.public) {
                            session.portraitArray = [constants.portrait.public];
                        } else if (session.type == constants.session._class) {
                            session.portraitArray = [constants.portrait._class];
                        } else {
                            var array = session.portrait.split(",");
                            for (var j = 0; j < array.length; j++) {
                                var obj1 = array[j];
                                if (obj1 == "-") {
                                    array[j] = constants.portrait._default;
                                } else {
                                    array[j] = global.cache.resUrl + "/" + array[j];
                                }
                            }
                            session.portraitArray = array;
                        }
                    }
                    if (!session.recorders) {
                        session.recorders = [];
                    }
                }
            },
            getSessionIndex: function(sessionId) {
                var sessions = global.cache.sessions;
                for (var i = 0; i < sessions.length; i++) {
                    if(sessionId==sessions[i].id) {
                        return i;
                    }
                }
            },
            procClasses: function () {
                var classes = global.cache.classes;
                for (var i = 0; i < classes.length; i++) {
                    var class_ = classes[i];
                    class_.open = false;
                    class_.open_parents = false;
                }
            },
            procUser: function () {
                var user = global.cache.user;
                if (!user.portrait) {
                    user.portrait = constants.portrait._default;
                }else{
                    user.portrait = global.cache.resUrl + "/" + user.portrait;
                }
            },
            procUsers: function (users) {
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    if(user.id==global.cache.user.id){
                        user.unGoSession=true;
                    }
                    else{
                        user.unGoSession=false;
                    }
                    if (!user.portrait) {
                        user.portrait = constants.portrait._default;
                    }else{
                        user.portrait = global.cache.resUrl + "/" + user.portrait;
                    }
                }
            },
            procStudents: function (students) {
                for (var i = 0; i < students.length; i++) {
                    var student = students[i];
                    if(student.id==global.cache.user.id){
                        student.unGoSession=true;
                    }
                    else{
                        student.unGoSession=false;
                    }
                    if (!student.portrait) {
                        student.portrait = constants.portrait._default;
                    }else{
                        student.portrait = global.cache.resUrl + "/" + student.portrait;
                    }
                    student.checked = false;
                }
            },
            procParents: function (parents) {
                for (var i = 0; i < parents.length; i++) {
                    var parent = parents[i];
                    if(parent.id==global.cache.user.id){
                        parent.unGoSession=true;
                    }
                    else{
                        parent.unGoSession=false;
                    }
                    if (!parent.portrait) {
                        parent.portrait = constants.portrait._default;
                    }else{
                        parent.portrait = global.cache.resUrl + "/" + parent.portrait;
                    }
                    parent.checked = false;
                }
            },
            procTeachers: function (teachers) {
                for (var i = 0; i < teachers.length; i++) {
                    var teacher = teachers[i];
                    if(teacher.id==global.cache.user.id){
                        teacher.unGoSession=true;
                    }
                    else{
                        teacher.unGoSession=false;
                    }
                    if (!teacher.portrait) {
                        teacher.portrait = constants.portrait._default;
                    }else{
                        teacher.portrait = global.cache.resUrl + "/" + teacher.portrait;
                    }
                    teacher.checked = false;
                }
            },
            procGroups: function (groups, code) {
                var groupObj = global.cache.groups[code];
                    for (var j = 0; j < groups.length; j++) {
                        var group = groups[j];
                        if (!group.portrait) {
                            group.portrait = constants.portrait._default;
                        } else {
                            group.portrait = global.cache.resUrl + "/" + group.portrait;
                        }
                        group.type = groupObj.type;
                    }
                groupObj.groups = groups;
            },
            getFscSession: function(type,sessionId){
                var sessions = global.cache.sessions;
                for (var i = 0; i < sessions.length; i++) {
                    var session = sessions[i];
                    if(session.type==type&&session.sessionId==sessionId){
                        return session;
                    }
                }
            },
            getFscSessionByFid: function(fscSessionId){
                var sessions = global.cache.sessions;
                for (var i = 0; i < sessions.length; i++) {
                    var session = sessions[i];
                    if(session.id==fscSessionId){
                        return session;
                    }
                }
            },
            procDateTime: function (createdTemp){
                var now=new Date();
                var nowDay=now.getDate();
                var time = new Date(createdTemp);
                var c = nowDay - time.getDate();
                var timeRecorder = {
                    type: 5
                };
                if(time.getFullYear()==now.getFullYear()) {
                    if (c <= 2) {
                        switch (c) {
                            case 0:
                                timeRecorder.message = time.toLocaleTimeString();
                                break;
                            case 1:
                                timeRecorder.message =  "昨天" +time.toLocaleTimeString();
                                break;
                            case 2:
                                timeRecorder.message =  "前天" +time.toLocaleTimeString();
                                break;
                            default :
                                break;
                        }
                    }else {
                        timeRecorder.message =  time.toLocaleString();
                    }
                } else{
                    timeRecorder.message =  time.toLocaleString();
                }
                return timeRecorder;
            },
            procRecorder: function (curSession,recorders) {
                var cacheRecorders = curSession.recorders;
                var user = global.cache.user;
                var baseDate;
                var result = [];
                if(recorders.length==0){
                    return result;
                }
                if (recorders) {
                    if (cacheRecorders.length > 0) {
                        baseDate = cacheRecorders[cacheRecorders.length - 1].createdDate;
                    } else {
                        baseDate = recorders[0].createdDate;
                        var info = this.procDateTime(baseDate);
                        result.push(info);
                    }
                }
                for (var i = 0; i < recorders.length; i++) {
                    var obj = recorders[i];
                    if (!obj.portrait) {
                        obj.portrait = constants.portrait._default;
                    } else {
                        obj.portrait = global.cache.resUrl + "/" + obj.portrait;
                    }
                    if (user.id == obj.createdBy) {
                        obj.isRight = true;
                    } else {
                        obj.isLeft = true;
                    }
                    var createdTemp = obj.createdDate;
                    var time = new Date(createdTemp);
                    var baseTemp = new Date(baseDate);
                    var b = (time.getTime() - baseTemp.getTime()) / 1000 / 60 > 5;
                    if (createdTemp) {
                        if (b) {
                            var info = this.procDateTime(createdTemp);
                            result.push(info);
                            baseDate = createdTemp;
                        }
                        result.push(obj);
                    }
                }
                return result;
            }
        }
    });
