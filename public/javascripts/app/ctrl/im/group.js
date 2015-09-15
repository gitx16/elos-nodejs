'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('GroupCtrl', function ($scope, $window,$location,resourcePool,
                                       global,utils,constants,sync,dialog,msg,msgRegister) {
        var w = angular.element($window);
        var ClassStudents = resourcePool.classStudents;
        var Teachers = resourcePool.teachers;
        var Deans = resourcePool.deans;
        var selectUserIdMap = {};
        $scope.winHeight = w.height();
        $scope.groups = global.cache.groups;
        var Groups = resourcePool.groups;
        $scope.headerClick = function(code){
            var group = $scope.groups[code];
            group.open = (!group.open);
            if(!global.cache.groups[code].sessions){
                Groups.query({code:code},function(groups){
                    utils.procGroups(groups,code);
                });
            }
        };
        $scope.openGroup =function(userMember){
            dialog.complexBox(
                {
                    templateUrl: '/node_static/javascripts/app/view/menus/menu.html',
                    size:'md',
                    onComplete: function (dialogScope,modalInstance) {
                        selectUserIdMap = {};
                        dialogScope.checkPersonCount = 0;
                        dialogScope.selectGroup = [];
                        dialogScope.selectUsers= [];
                        dialogScope.classes = global.cache.classes;
                        dialogScope.students = global.cache.students;
                        dialogScope.groups = global.pageStatus.linkman.groups;
                        var users=dialogScope.selectUsers;
                        for (var i = 0; i < userMember.length; i++) {
                            selectUserIdMap[userMember[i].id]=true;
                            userMember[i].lock=true;
                            dialogScope.selectUsers[i]=userMember[i];
                        }
                        userSelectCheck(userMember);
                        var Groups = resourcePool.groups;
                        var userList = [];
                        var userUpdateList = [];
                        dialogScope.update=true;
                        dialogScope.ok=function() {
                            for (var i = 0; i < users.length; i++) {
                                userUpdateList.push({userId:users[i].id});
                            }
                            var fscSession = utils.getFscSession($scope.selectGroup.type, $scope.selectGroup.id);
                            var sessionName = fscSession.msName;
                            for (var i = userMember.length; i < users.length; i++) {
                                if(users.length>0) {
                                    var user = users[i];
                                    if ($scope.selectGroup.nameStatus == 1) {
                                        sessionName += "、" + user.name;
                                    }
                                    else {
                                        sessionName = fscSession.msName;
                                    }
                                    userList.push({userId: user.id});
                                    $scope.users.push(user);
                                }
                            }
                            var groupSession = {
                                userList: userList,
                                id: fscSession.sessionId,
                                name:sessionName,
                                usersList:userUpdateList
                            };
                            if (userList.length>0) {
                                Groups.update(groupSession, function (data) {
                                    sync.syncSessions(function(){
                                        global.pageStatus.session.selectSession = fscSession;
                                        global.pageStatus.session.toTop = true;
                                        $location.path('/session');
                                        modalInstance.close();
                                    });
                                    sync.syncGroups(codes);
                                });
                            }
                            else{
                                msg.warn("至少选择一个成员");
                            }
                        };

                        dialogScope.classClick = function (class_,index) {
                            if (!class_.students) {
                                ClassStudents.query({classId: class_.id}, function (students) {
                                    utils.procStudents(students);
                                    class_.students = students;
                                    dialogScope.groupUsers = students;
                                    userSelectCheck(dialogScope.groupUsers);
                                });
                                dialogScope.classes[index].open = !dialogScope.classes[index].open;
                            } else {
                                dialogScope.groupUsers = class_.students;
                                userSelectCheck(dialogScope.groupUsers);
                                dialogScope.classes[index].open = !dialogScope.classes[index].open;
                            }
                            dialogScope.selectGroup = class_;
                            dialogScope.classes;
                            debugger
                        };

                        dialogScope.groupClick = function (type, group) {
                            if (type == "teacher") {
                                Teachers.query({}, function (teachers) {
                                    utils.procTeachers(teachers);
                                    global.cache.teachers = teachers;
                                    group.users = teachers;
                                    dialogScope.groupUsers = group.users;
                                    userSelectCheck(dialogScope.groupUsers);
                                });
                                dialogScope.groups[type].open = !dialogScope.groups[type].open;
                            } else if (type == "dean") {
                                Deans.query({}, function (deans) {
                                    utils.procTeachers(deans);
                                    global.cache.deans = deans;
                                    group.users = deans;
                                    dialogScope.groupUsers = group.users;
                                    userSelectCheck(dialogScope.groupUsers);
                                });
                                dialogScope.groups[type].open = !dialogScope.groups[type].open;
                            }
                            dialogScope.selectGroup = group;
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
                            dialogScope.checkPersonCount--;
                        };

                        dialogScope.updateClick=function(user) {
                            user.lock=false;
                            for(var i=0;i<userMember.length;i++) {
                                if (user.id == userMember[i].id) {
                                    user.lock=true;
                                    break;
                                }
                            }
                            if(!user.lock) {
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
                                            dialogScope.checkPersonCount--;
                                            break;
                                        }
                                    }
                                    if (!flag) {
                                        user.checked = true;
                                        dialogScope.selectUsers.push(user);
                                    }
                                    dialogScope.checkPersonCount++;
                                }
                                else {
                                    scope.removeMember(user);
                                }
                            }
                            dialogScope.selectUsers;
                            debugger
                        };

                        dialogScope.cancel=function(){
                            modalInstance.close();
                        };

                    }
                })
        };
        var userSelectCheck = function (users) {
            if(users)
            for (var i = 0; i < users.length; i++) {
                var user = users[i];
                if (selectUserIdMap[user.id]) {
                    user.checked = true;
                } else {
                    user.checked = false;
                }
            }
        };
        var showUser = function(fscSession){
            if(!fscSession.users){
                sync.syncSessionUsers(fscSession,function(users){
                    $scope.users = users;
                    global.pageStatus.group.users = users;
                });
            }else{
                $scope.users = fscSession.users;
                global.pageStatus.group.users = fscSession.users;
            }
        };

        $scope.doSelectGroup = function(group){
            $scope.selectGroup = group;
            global.pageStatus.group.selectGroup = group;
            var fscSession = utils.getFscSession(group.type,group.id);
            if(!fscSession){
                SessionClasses.create({classId:group.classId},{},function(){
                    sync.syncSessions(function(syncSessions){
                        if(syncSessions&&syncSessions.length>0){
                            showUser(syncSessions[0]);
                        }
                    });
                });
            }else{
                showUser(fscSession);
            }
        };

        var SessionClasses = resourcePool.sessionClasses;

        $scope.goSession = function(){
            var fscSession = utils.getFscSession($scope.selectGroup.type,$scope.selectGroup.id);
            if(fscSession){
                global.pageStatus.session.selectSession = fscSession;
                global.pageStatus.session.toTop = true;
                global.pageStatus.session.selectSession.show = true;
                $location.path('/session');
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.selectGroup = global.pageStatus.group.selectGroup;
            $scope.users = global.pageStatus.group.users;
        });
        var userUpdateHandler = function () {
            $scope.user = global.cache.user;
        };
        msgRegister.registerMsg(constants.msgCode.USER_UPDATE, userUpdateHandler);

    });
