'use strict';

/**
 * @ngdoc function
 * @name elmApp.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the elmApp
 */
angular.module('fscApp', [
    'ngRoute',
    'ngTouch'
]).config(function ($routeProvider) {
    var viewPath = "/node_static/javascripts/app/";
    $routeProvider
        .when('/self', {
            templateUrl: viewPath + 'view/vote/vote_list.html',
            controller: 'VoteSelfCtrl'
        })
        .when('/:voteId', {
            templateUrl: viewPath + 'view/vote/vote_detail.html',
            controller: 'VoteDetailCtrl'
        })
        .otherwise({
            templateUrl: viewPath + 'view/vote/vote_list.html',
            controller: 'VoteListCtrl'
        });
}).run(function ($rootScope, resourcePool) {
    $rootScope.backUrl = "#/";
    resourcePool.session.get({}, false, function (data) {
        $rootScope.isLogin = data.isLogin;
    });
}).factory('resourcePool', function (resource) {
    var rc = resource.create;
    return {
        session: rc('/open/session'),
        vote: rc('/open/votes/{voteId}'),
        voteSelf: rc('/el/votes/self'),
        voteAnswer: rc('/el/votes/{voteId}/answer')
    }
}).factory('global', function ($rootScope, resourcePool) {
    return {
    }
}).controller('VoteListCtrl', function ($scope, resourcePool, $location, $rootScope, global) {
    $rootScope.loading = true;
    $rootScope.showBack = false;
    $rootScope.inSelf = false;
    $rootScope.backUrl = "#/";

    if (global.votes) {
        $scope.votes = global.votes;
        $rootScope.loading = false;
    } else {
        var Vote = resourcePool.vote;
        Vote.query({}, function (data) {
            global.votes = data;
            $scope.votes = global.votes;
            $rootScope.loading = false;
        });
    }
    $scope.showVote = function (vote) {
        $rootScope.backUrl = "#/";
        $location.path('/' + vote.id);
    }
}).controller('VoteSelfCtrl', function ($scope, resourcePool, $location, $rootScope, global) {
    $rootScope.backUrl = "#/";
    $rootScope.loading = true;
    $rootScope.showBack = false;
    $rootScope.inSelf = true;

    var VoteSelf = resourcePool.voteSelf;
    VoteSelf.query({}, function (data) {
        $scope.votes = data;
        $rootScope.loading = false;
    });
    $scope.showVote = function (vote) {
        $rootScope.backUrl = "#/self";
        $location.path('/' + vote.id);
    }
}).controller('VoteDetailCtrl', function ($scope, $routeParams, $rootScope, resourcePool, msg) {
    $scope.voteId = $routeParams.voteId;
    $rootScope.loading = true;
    $rootScope.showBack = true;
    $rootScope.inSelf = false;

    var Vote = resourcePool.vote;
    Vote.get({}, {voteId: $scope.voteId}, function (data) {
        $scope.vote = data.model;
        $rootScope.loading = false;
    });

    /**
     * 选择
     * @param voteQues
     * @param voteQuesItem
     */
    $scope.itemClick = function (voteQues, voteQuesItem) {
        if ($scope.vote.dataStatus != 1) {
            return;
        }
        if (voteQues.checkType == 1) {
            for (var i = 0; i < voteQues.voteQuesItemList.length; i++) {
                var obj = voteQues.voteQuesItemList[i];
                obj.isChecked = false;
            }
            voteQuesItem.isChecked = true;
        } else {
            voteQuesItem.isChecked = !voteQuesItem.isChecked;
        }
    };

    var VoteAnswer = resourcePool.voteAnswer;

    $scope.doSubmit = false;
    $scope.submitVote = function () {
        $scope.doSubmit = true;
        var selectItem = [];
        for (var i = 0; i < $scope.vote.voteQuesList.length; i++) {
            var ques = $scope.vote.voteQuesList[i];
            var doSelect = false;
            for (var j = 0; j < ques.voteQuesItemList.length; j++) {
                var item = ques.voteQuesItemList[j];
                if (item.isChecked) {
                    selectItem.push({
                        voteId: $scope.vote.id,
                        quesId: ques.id,
                        itemId: item.id
                    });
                    doSelect = true;
                }
            }
            if (!doSelect) {
                msg.error('请选择投票项');
                $scope.doSubmit = false;
                return;
            }
        }
        VoteAnswer.create({voteId: $scope.voteId}, selectItem, function (data) {
            $scope.vote.dataStatus = 3;
            $scope.doSubmit = false;
            $scope.vote.voteNum += 1;
        });
    }
})
