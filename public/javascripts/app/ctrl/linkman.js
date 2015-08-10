'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp')
    .controller('LinkmanCtrl', function ($scope, $window,$location,resourcePool,
                                         global,utils,constants,sync) {
        $scope.classes = global.cache.classes;
        $scope.teachers = global.cache.teachers;
        var w = angular.element($window);
        $scope.winHeight = w.height();
        $scope.groups = global.pageStatus.linkman.groups;
        $scope.isGoing = false;

        $scope.selectLinkman = function (student) {
            $scope.selectUser = student;
            global.pageStatus.linkman.selectUser = student;
        };
        var ClassStudents = resourcePool.classStudents;
        var ClassParents = resourcePool.classParents;
        var Teachers = resourcePool.teachers;
        var Deans = resourcePool.deans;
        var ParentsStudents=resourcePool.parentsStudents;
        $scope.selectParent = function (parent) {
            ParentsStudents.query({parentId:parent.id},function(parentStudent) {
                $scope.selectUser.parentStudents=parentStudent;
            })
            $scope.selectUser = parent;
            global.pageStatus.linkman.selectUser = parent;
        };

        $scope.headerClick = function(code,index){
            if(code=="class"){
                var class_ = $scope.classes[index];
                class_.open = (!class_.open);
                if(!class_.students){
                    ClassStudents.query({classId:class_.id},function(students){
                        utils.procStudents(students);
                        class_.students = students;
                    });
                }
            }else if(code=="class_parent"){
                var class_ = $scope.classes[index];
                class_.open_parents = (!class_.open_parents);
                if(!class_.parents){
                    ClassParents.query({classId:class_.id},function(parents){
                        utils.procParents(parents);
                        class_.parents = parents;
                    });
                }
            } else{
                var group = $scope.groups[code];
                group.open = (!group.open);
                if(code=="teacher"){
                    if(!$scope.teachers){
                        Teachers.query({},function(teachers){
                            utils.procTeachers(teachers);
                            global.cache.teachers = teachers;
                            group.users = teachers;
                        });
                    }
                }else if(code=="dean"){
                    if(!$scope.deans){
                        Deans.query({},function(deans){
                            utils.procTeachers(deans);
                            global.cache.deans = deans;
                            group.users = deans;
                        });
                    }
                }
            }
        };

        var Sessions = resourcePool.sessions;
        $scope.goSession = function(userId){
            var sessions = global.cache.sessions;
            debugger
            if(userId){
                if(sessions){
                    var sessionExists = false;
                    for (var i = 0; i < sessions.length; i++) {
                        var session = sessions[i];
                        if(session.type==constants.session.user){
                            if(session.msId== userId){
                                global.pageStatus.session.selectSession = session;
                                global.pageStatus.session.toTop = true;
                                $location.path('/session');
                                sessionExists = true;
                            }
                        }
                    }
                    if(!sessionExists){
                        $scope.isGoing = true;
                        Sessions.new({linkmanId:userId},{},function(data){
                            sync.syncSessions(function(sessions){
                                for (var i = 0; i < sessions.length; i++) {
                                    var session = sessions[i];
                                    if(session.type==constants.session.user){
                                        if(session.msId== userId){
                                            global.pageStatus.session.selectSession = session;
                                            global.pageStatus.session.toTop = true;
                                            $location.path('/session');
                                            sessionExists = true;
                                        }
                                    }
                                }
                                $scope.isGoing = false;
                            });
                        });
                    }
                }
            }
            else {
                if (sessions) {
                    var sessionExists = false;
                    for (var i = 0; i < sessions.length; i++) {
                        var session = sessions[i];
                        if (session.type == constants.session.user) {
                            if (session.msId == $scope.selectUser.id) {
                                global.pageStatus.session.selectSession = session;
                                global.pageStatus.session.toTop = true;
                                $location.path('/session');
                                sessionExists = true;
                            }
                        }
                    }
                    if (!sessionExists) {
                        $scope.isGoing = true;
                        Sessions.new({linkmanId: $scope.selectUser.id}, {}, function (data) {
                            sync.syncSessions(function (sessions) {
                                for (var i = 0; i < sessions.length; i++) {
                                    var session = sessions[i];
                                    if (session.type == constants.session.user) {
                                        if (session.msId == $scope.selectUser.id) {
                                            global.pageStatus.session.selectSession = session;
                                            global.pageStatus.session.toTop = true;
                                            $location.path('/session');
                                            sessionExists = true;
                                        }
                                    }
                                }
                                $scope.isGoing = false;
                            });
                        });
                    }
                }
            }
        };

        $scope.$on('$viewContentLoaded', function () {
            $scope.selectUser = global.pageStatus.linkman.selectUser;
        });

    });
