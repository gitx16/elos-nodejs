'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmMsg
 * @description
 * # elmMsg
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('msg', ["rootDataService", "$timeout", function (rootDataService, $timeout) {
        var ROOT_messageData = rootDataService.data('ROOT_messageData');
        var timeout = {
                "info": 2,
                "success": 2,
                "warning": 3,
                "danger": 8,
                "error": 8
            },
            timer,
            clear = function () {
                $timeout.cancel(timer);
                timer = 0;
            };
        return {
            alert:function (messages, type) {
                clear();
                type = type || 'info';
                (type === "error") && (type = "danger");
                messages = angular.isArray(messages) ? messages : [{msg:messages}];
                ROOT_messageData.set('globalMsg',{
                    messages: messages,
                    type: type,
                    show: true
                });
                timer = $timeout(function () {
                    ROOT_messageData.set('globalMsg',{
                        messages: '',
                        type: '',
                        show: false
                    });
                }, (timeout[type]) * 1000);
            },
            success: function (msgs) {
                this.alert(msgs,'success');
            },
            error: function (msgs) {
                this.alert(msgs,'danger');
            },
            info: function (msgs) {
                this.alert(msgs,'info');
            },
            warn: function (msgs) {
                this.alert(msgs,'warning');
            }
        }
    }])
    .factory('rootDataService', ["$rootScope", function ($rootScope) {
        var RootData = function () {
        };
        RootData.prototype = {
            get: function (name) {
                return this[name];
            },
            set: function (name,value) {
                this[name] = value;
                return this;
            }
        };
        var register = function (rootDataArr) {
            angular.forEach(rootDataArr,function (key) {
                $rootScope[key] = new RootData();
            })
        };
        register(['ROOT_loginData','ROOT_loadingStatData','ROOT_messageData']);//必须一次性添加，不可动态添加单个，这样可以很方便的在一共地方查看所有rootScope下的变量
        return {
            data: function (key) {
                return $rootScope[key];
            }
        }
    }])
