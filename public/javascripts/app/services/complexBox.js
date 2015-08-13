'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .factory('sidebar', function ($scope,$location,global,$templateCache,sync,
                                         msgRegister,constants,dialog,resourcePool,utils,msg) {
        var ClassStudents = resourcePool.classStudents;
        var Teachers = resourcePool.teachers;
        var Deans = resourcePool.deans;
        $scope.openGroup=function(userMember)
        {
            dialog.complexBox(
                {
                    templateUrl: '/node_static/javascripts/app/view/menus/menu.html',
                    size:'md',
                    onComplete: function (dialogScope,modalInstance) {
                        dialogScope.selectUsers =[];
                        dialogScope.classes = global.cache.classes;
                        dialogScope.students=global.cache.students;
                        dialogScope.groups = global.pageStatus.linkman.groups;
                        var selectUserIdMap = {};
                        dialogScope.ok=function() {
                            var Groups = resourcePool.groups;
                            var users = dialogScope.selectUsers;
                            var userList = [];
                        };

                        var userSelectCheck = function(users){
                            for (var i = 0; i < users.length; i++) {
                                var user = users[i];
                                if(selectUserIdMap[user.id]){
                                    user.checked = true;
                                }else{
                                    user.checked = false;
                                }
                            }
                        };

                        dialogScope.removeMember=function(user){
                            for (var j = 0; j < dialogScope.selectUsers.length; j++) {
                                var obj = dialogScope.selectUsers[j];
                                if(obj.id==user.id){
                                    delete selectUserIdMap[obj.id];
                                    dialogScope.selectUsers.splice(j,1);
                                    break;
                                }
                            }
                            for (var j = 0; j < dialogScope.groupUsers.length; j++) {
                                var obj = dialogScope.groupUsers[j];
                                if(obj.id==user.id){
                                    obj.checked = false;
                                    break;
                                }
                            }
                        };

                        dialogScope.userClick=function(user){
                            var flag=false;
                            user.checked=false;;
                            if(!user.checked) {
                                selectUserIdMap[user.id] = true;
                                for (var j = 0; j < dialogScope.selectUsers.length; j++) {
                                    var obj = dialogScope.selectUsers[j];
                                    if (obj.id == user.id) {
                                        obj.checked=false;
                                        dialogScope.selectUsers.splice(j, 1);
                                        delete selectUserIdMap[obj.id];
                                        dialogScope.removeMember(obj);
                                        flag=true;
                                        break;
                                    }
                                }
                                if(!flag) {
                                    user.checked=true;
                                    dialogScope.selectUsers.push(user);
                                }
                            }
                            else{
                                dialogScope.removeMember(user);
                            }
                        };

                        dialogScope.classClick = function(class_){
                            if(!class_.students){
                                ClassStudents.query({classId:class_.id},function(students){
                                    utils.procStudents(students);
                                    class_.students = students;
                                    dialogScope.groupUsers = students;
                                });
                            }else{
                                dialogScope.groupUsers = class_.students;
                                userSelectCheck(dialogScope.groupUsers);
                            }
                            dialogScope.selectGroup = class_;
                        };

                        dialogScope.groupClick = function(type,group){
                            if(group.users){
                                dialogScope.groupUsers = group.users;
                                userSelectCheck(dialogScope.groupUsers);
                            }else{
                                if(type=="teacher"){
                                    Teachers.query({},function(teachers){
                                        utils.procTeachers(teachers);
                                        global.cache.teachers = teachers;
                                        group.users = teachers;
                                        dialogScope.groupUsers = group.users;
                                    });
                                }else if(type=="dean"){
                                    Deans.query({},function(deans){
                                        utils.procTeachers(deans);
                                        global.cache.deans = deans;
                                        group.users = deans;
                                        dialogScope.groupUsers = group.users;
                                    });
                                }
                            }
                            dialogScope.selectGroup = group;
                        }
                    }
                })
        };

        var userUpdateHandler = function () {
            $scope.user = global.cache.user;
        };
        msgRegister.registerMsg(constants.msgCode.USER_UPDATE, userUpdateHandler);
    });
