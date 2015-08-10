'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('SidebarCtrl', function ($scope,$location,global,$templateCache,sync,
                                         msgRegister,constants,dialog,resourcePool,$rootScope,utils,msg) {
        var ClassStudents = resourcePool.classStudents;
        var Teachers = resourcePool.teachers;
        var Deans = resourcePool.deans;
        var selectUserIdMap = {};
        $scope.isActive = function (route) {
            var select = route === '#' + $location.path();
            if(select){
                return "down";
            }else{
                return "normal";
            }
        };
        if(global.cache){
            $scope.user = global.cache.user;
        }
        $scope.openGroup=function()
        {
            $scope.shouldShow=false;
            dialog.complexBox(
                {
                    templateUrl: '/im/javascripts/app/view/menus/menu-dialog.html',
                    size:'md',
                    onComplete: function (dialogScope,modalInstance) {
                        dialogScope.selectGroup = [];
                        dialogScope.selectUsers= [];
                        dialogScope.classes = global.cache.classes;
                        dialogScope.students = global.cache.students;
                        dialogScope.groups = global.pageStatus.linkman.groups;
                        var sessionName = "";
                        var userList = [];
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
                        var Groups = resourcePool.groups;
                        dialogScope.ok=function() {
                            for (var i = 0; i <dialogScope.selectUsers.length; i++) {
                                var user =   dialogScope.selectUsers[i];
                                if (i <= 9) {
                                    if (i == 0) {
                                        sessionName += user.name;
                                    } else {
                                        sessionName += "、" + user.name;
                                    }
                                }
                                userList.push({userId: user.id});
                            }
                            var groupSession = {
                                userList: userList,
                                name:sessionName
                            };
                            if (userList.length>0) {
                                Groups.create(groupSession, function (data) {
                                    sync.syncSessions(function(syncSessions){
                                        if(syncSessions[0]){
                                            global.pageStatus.session.selectSession = syncSessions[0];
                                            global.pageStatus.session.toTop = true;
                                            msgRegister.dispatchMsg(constants.msgCode.SESSION_POST);
                                            $location.path('/session');
                                        }
                                        modalInstance.close();
                                    });
                                });
                            }
                            else{
                                msg.warn("至少选择一个成员");
                            }

                        };
                        dialogScope.removeMember = function (user) {
                            var flag=true;
                            dialogScope.user = user;
                            for (var j = 0; j < dialogScope.selectUsers.length; j++) {
                                if (!user.lock) {
                                    var obj = dialogScope.selectUsers[j];
                                    if (obj.id == user.id) {
                                        delete selectUserIdMap[obj.id];
                                        dialogScope.selectUsers.splice(j, 1);
                                        break;
                                    }
                                }
                                else {
                                    flag=false;
                                }
                            }
                            for (var j = 0; j < dialogScope.groupUsers.length&&dialogScope.groupUsers.length>0; j++) {
                                if(flag) {
                                    var obj = dialogScope.groupUsers[j];
                                    if (obj.id == user.id) {
                                        obj.checked = false;
                                        break;
                                    }
                                }
                            }
                        };

                        dialogScope.classClick = function (class_) {
                            if (!class_.students) {
                                ClassStudents.query({classId: class_.id}, function (students) {
                                    utils.procStudents(students);
                                    class_.students = students;
                                    dialogScope.groupUsers = students;
                                    userSelectCheck(dialogScope.groupUsers);
                                });
                            } else {
                                dialogScope.groupUsers = class_.students;
                                userSelectCheck(dialogScope.groupUsers);
                            }
                            dialogScope.selectGroup = class_;
                        };

                        dialogScope.groupClick = function (type, group) {
                            if (group.users) {
                                dialogScope.groupUsers = group.users;
                                userSelectCheck(dialogScope.groupUsers);
                            } else {
                                if (type == "teacher") {
                                    Teachers.query({}, function (teachers) {
                                        utils.procTeachers(teachers);
                                        global.cache.teachers = teachers;
                                        group.users = teachers;
                                        dialogScope.groupUsers = group.users;
                                        userSelectCheck(dialogScope.groupUsers);
                                    });
                                } else if (type == "dean") {
                                    Deans.query({}, function (deans) {
                                        utils.procTeachers(deans);
                                        global.cache.deans = deans;
                                        group.users = deans;
                                        dialogScope.groupUsers = group.users;
                                        userSelectCheck(dialogScope.groupUsers);
                                    });
                                }
                            }
                            dialogScope.selectGroup = group;
                        };

                        dialogScope.updateClick=function(user) {
                                var flag = false;
                                user.checked = false;
                                if (!user.checked) {
                                    selectUserIdMap[user.id] = true;
                                    for (var j = 0; j < dialogScope.selectUsers.length; j++) {
                                        var obj = dialogScope.selectUsers[j];
                                        if (obj.id == user.id) {
                                            obj.checked = false;
                                            dialogScope.selectUsers.splice(j, 1);
                                            delete selectUserIdMap[obj.id];
                                            dialogScope.removeMember(obj);
                                            flag = true;
                                            break;
                                        }
                                    }
                                    if (!flag) {
                                        user.checked = true;
                                        dialogScope.selectUsers.push(user);
                                    }
                                }
                                else {
                                    dialogScope.removeMember(user);
                                }
                        };

                        dialogScope.newClick=function(user){
                            var flag=false;
                            user.checked=false;
                            if (!user.checked) {
                                selectUserIdMap[user.id] = true;
                                for (var j = 0; j < dialogScope.selectUsers.length; j++) {
                                    var obj = dialogScope.selectUsers[j];
                                    if (obj.id == user.id) {
                                        obj.checked = false;
                                        dialogScope.selectUsers.splice(j, 1);
                                        delete selectUserIdMap[obj.id];
                                        dialogScope.removeMember(obj);
                                        flag = true;
                                        break;
                                    }
                                }
                                if (!flag) {
                                    user.checked = true;
                                    dialogScope.selectUsers.push(user);
                                }
                            }
                            else {
                                scope.removeMember(user);
                            }
                        };

                        dialogScope.cancel =function(){
                            modalInstance.close();
                        };

                    }
                })
        };

        var userUpdateHandler = function () {
            $scope.user = global.cache.user;
        };
        msgRegister.registerMsg(constants.msgCode.USER_UPDATE, userUpdateHandler);
    });
