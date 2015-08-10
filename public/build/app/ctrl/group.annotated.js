'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('GroupCtrl', ["$scope", "$window", "$location", "resourcePool", "global", "utils", "constants", "sync", "dialog", "msg", "msgRegister", function ($scope, $window,$location,resourcePool,
                                       global,utils,constants,sync,dialog,msg,msgRegister) {
        var w = angular.element($window);
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
                    templateUrl: '/im/javascripts/app/view/menus/update-sidebar.html',
                    size:'md',
                    onComplete: function (dialogScope,modalInstance) {
                        dialogScope.update=true;
                        dialogScope.userMember=userMember;
                        dialogScope.global = global;
                        dialogScope.global.selectGroup = [];
                        dialogScope.global.selectUsers = [];
                        dialogScope.classes = global.cache.classes;
                        dialogScope.students=global.cache.students;
                        dialogScope.groups = global.pageStatus.linkman.groups;
                        dialogScope.ok=function() {
                            var users = dialogScope.global.selectUsers;
                            var Groups = resourcePool.groups;
                            var userList = [];
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
                                name:sessionName
                            };
                            if (userList.length>0) {
                                Groups.update(groupSession, function (data) {
                                    sync.syncSessions(function(){
                                        global.pageStatus.session.selectSession = fscSession;
                                        global.pageStatus.session.toTop = true;
                                        $location.path('/session');
                                        modalInstance.close();
                                    });
                                });
                            }
                            else{
                                msg.warn("至少选择一个成员");
                            }
                        };

                        dialogScope.cancel=function(){
                            modalInstance.close();
                        };

                    }
                })
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
                SessionClasses.new({classId:group.classId},{},function(){
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

    }]);
