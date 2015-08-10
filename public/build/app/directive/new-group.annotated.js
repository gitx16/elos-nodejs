'use strict';

/**
 * @ngdoc directive
 * @name circleApp.directive:annNews
 * @description
 * # annNews
 */
angular.module('fscApp')
    .directive('newGroup', ["msgRegister", "constants", "resourcePool", "utils", "global", function (msgRegister,constants,resourcePool,utils,global) {
        var ClassStudents = resourcePool.classStudents;
        var Teachers = resourcePool.teachers;
        var Deans = resourcePool.deans;
        return {
            restrict:'E',
            templateUrl: '/im/javascripts/app/view/directive/new_group/new-group.html',
            replace:true,
            scope:{
                global: '=',
                ok:'=',
                cancel:'=',
                userMember:'=',
                update:'=',
                code:'=',
                selectUserIdMap:'='
            },
            link: function (scope,$element,attrs) {
                var selectUserIdMap = {};
                scope.classes = scope.global.cache.classes;
                scope.students = scope.global.cache.students;
                scope.groups = scope.global.pageStatus.linkman.groups;
                var userSelectCheck = function (users) {
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        if (selectUserIdMap[user.id]) {
                            user.checked = true;
                        } else {
                            user.checked = false;
                        }
                    }
                };
                if(scope.userMember){
                    for (var i = 0; i < scope.userMember.length; i++) {
                        selectUserIdMap[scope.userMember[i].id] = true;
                        scope.global.selectUsers.push(scope.userMember[i]);
                        scope.userMember[i].lock=true;
                        userSelectCheck(scope.global.selectUsers);
                    }
                }
                scope.removeMember = function (user) {
                    var flag=true;
                    scope.global.user = user;
                    for (var j = 0; j < scope.global.selectUsers.length; j++) {
                        if (!user.lock) {
                            var obj = scope.global.selectUsers[j];
                            if (obj.id == user.id) {
                                delete selectUserIdMap[obj.id];
                                scope.global.selectUsers.splice(j, 1);
                                break;
                            }
                        }
                        else {
                            flag=false;
                        }
                    }
                    for (var j = 0; j < scope.groupUsers.length&&scope.groupUsers.length>0; j++) {
                        if(flag) {
                            var obj = scope.groupUsers[j];
                            if (obj.id == user.id) {
                                obj.checked = false;
                                break;
                            }
                        }
                    }
                };

                scope.classClick = function (class_) {
                    if (!class_.students) {
                        ClassStudents.query({classId: class_.id}, function (students) {
                            utils.procStudents(students);
                            class_.students = students;
                            scope.groupUsers = students;
                            userSelectCheck(scope.groupUsers);
                        });
                    } else {
                        scope.groupUsers = class_.students;
                        userSelectCheck(scope.groupUsers);
                    }
                    scope.global.selectGroup = class_;
                };

                scope.groupClick = function (type, group) {
                    if (group.users) {
                        scope.groupUsers = group.users;
                        userSelectCheck(scope.groupUsers);
                    } else {
                        if (type == "teacher") {
                            Teachers.query({}, function (teachers) {
                                utils.procTeachers(teachers);
                                global.cache.teachers = teachers;
                                group.users = teachers;
                                scope.groupUsers = group.users;
                                userSelectCheck(scope.groupUsers);
                            });
                        } else if (type == "dean") {
                            Deans.query({}, function (deans) {
                                utils.procTeachers(deans);
                                global.cache.deans = deans;
                                group.users = deans;
                                scope.groupUsers = group.users;
                                userSelectCheck(scope.groupUsers);
                            });
                        }
                    }
                    scope.global.selectGroup = group;
                };

                scope.updateClick=function(user) {
                    user.lock=false;
                    for(var i=0;i<scope.userMember.length;i++) {
                        if (user.id == scope.userMember[i].id) {
                            user.lock=true;
                            break;
                        }
                    }
                    if(!user.lock) {
                        var flag = false;
                        user.checked = false;
                        if (!user.checked) {
                            selectUserIdMap[user.id] = true;
                            for (var j = 0; j < scope.global.selectUsers.length; j++) {
                                var obj = scope.global.selectUsers[j];
                                if (obj.id == user.id) {
                                    obj.checked = false;
                                    scope.global.selectUsers.splice(j, 1);
                                    delete selectUserIdMap[obj.id];
                                    scope.removeMember(obj);
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                user.checked = true;
                                scope.global.selectUsers.push(user);
                            }
                        }
                        else {
                            scope.removeMember(user);
                        }
                    }
                };

                scope.newClick=function(user){
                    var flag=false;
                    user.checked=false;
                        if (!user.checked) {
                            selectUserIdMap[user.id] = true;
                            for (var j = 0; j < scope.global.selectUsers.length; j++) {
                                var obj = scope.global.selectUsers[j];
                                if (obj.id == user.id) {
                                    obj.checked = false;
                                    scope.global.selectUsers.splice(j, 1);
                                    delete selectUserIdMap[obj.id];
                                    scope.removeMember(obj);
                                    flag = true;
                                    break;
                                }
                            }
                            if (!flag) {
                                user.checked = true;
                                scope.global.selectUsers.push(user);
                            }
                        }
                        else {
                            scope.removeMember(user);
                        }
                };

                var userUpdateHandler = function () {
                    scope.user = global.cache.user;
                };
                msgRegister.registerMsg(constants.msgCode.USER_UPDATE, userUpdateHandler);
            }
        }
    }])
