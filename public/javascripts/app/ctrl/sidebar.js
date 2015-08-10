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
                                       msgRegister,constants,dialog,resourcePool,$rootScope) {
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
                    templateUrl: '/im/javascripts/app/view/menus/new-sidebar.html',
                    size:'md',
                    onComplete: function (dialogScope,modalInstance) {
                        dialogScope.update=false;
                        dialogScope.global = global;
                        dialogScope.global.selectUsers = [];
                        var sessionName = "";
                        var Groups = resourcePool.groups;
                        var userList = [];
                        dialogScope.ok=function() {
                            for (var i = 0; i <dialogScope.global.selectUsers.length; i++) {
                                var user =   dialogScope.global.selectUsers[i];
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
                                Groups.new(groupSession, function (data) {
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
