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
    'ngTouch',
    'infinite-scroll'
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
        $rootScope.resServer = data.resServer+"/";
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
        votes:[],
        currentPage:1,
        noMore:false,
        offsetTop:0
    }
}).controller('VoteListCtrl', function ($scope, resourcePool, $location, $rootScope, global) {
    $rootScope.showBack = false;
    $rootScope.inSelf = false;
    $rootScope.backUrl = "#/";
    $scope.noMore = global.noMore;

    var Vote = resourcePool.vote;
    var doRequire = false;
    var doLoadData = function(){
        doRequire = true;
        Vote.query({currentPage:global.currentPage}, function (data) {
            global.votes = global.votes.concat(data);
            $scope.votes = global.votes;
            global.currentPage+=1;
            if(data.length<25){
                global.noMore = true;
                $scope.noMore = global.noMore;
            }
            doRequire = false;
        });
    };

    if (global.votes.length>0) {
        $scope.votes = global.votes;
        setTimeout(function(){
            window.scrollTo(0,global.offsetTop);
        },10);
    }

    $scope.showVote = function (vote) {
        global.offsetTop = window.scrollY;
        $rootScope.backUrl = "#/";
        $location.path('/' + vote.id);
    };
    $scope.loadData = function(){
        if(!doRequire){
            doLoadData();
        }
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
}).controller('VoteDetailCtrl', function ($scope, $routeParams, $rootScope, resourcePool, msg,rootDataService) {
    var ROOT_messageData = rootDataService.data('ROOT_messageData');
    $scope.voteId = $routeParams.voteId;
    $rootScope.loading = true;
    $rootScope.showBack = true;
    $rootScope.inSelf = false;
    var Vote = resourcePool.vote;
    Vote.get({}, {voteId: $scope.voteId}, function (data) {
        $scope.vote = data.model;
        if(!$scope.vote.osVoteUsers){
            $scope.vote.osVoteUsers = [];
        }
        ROOT_messageData.title = data.model.voteName
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
            $scope.vote.osVoteUsers.push(data.model);
        });
    }
})
