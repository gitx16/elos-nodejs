'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('constants', function () {
        return {
            env: {
                dev: {
                    socketUrl: "http://localhost:3000"
                },
                lan: {
                    socketUrl: "http://192.168.1.253:41034"
                },
                wan: {
                    socketUrl: "http://183.203.18.48:41032"
                },
                prod: {
                    socketUrl: "http://183.203.28.194:41032"
                }
            },
            resServer: "http://res.tourerp.cn/",
            reqCode: {
                NOTIFY_PULL_FSC_SESSION: "NOTIFY_PULL_FSC_SESSION"
            },
            msgCode: {
                AUTHC_TIMEOUT: "AUTHC_TIMEOUT",
                SESSION_UPDATE: "SESSION_UPDATE",
                SESSION_POST: "SESSION_POST",
                SESSION_SHOW: "SESSION_SHOW",
                USER_UPDATE: "USER_UPDATE"
            },
            rCode: {
                text: 1,
                img: 3
            },
            portrait: {
                _default: "/assets/img_tmp/portrait.jpg",
                _class: "/assets/img_tmp/group_default.png",
                public: "/assets/img_tmp/portrait.jpg"
            },
            userType: {
                teacher: 1,
                student: 2,
                parent: 3,
                dean: 4
            },
            session: {
                user: 1,
                group: 2,
                public: 3,
                _class: 4,
                trg: 5
            }
        }
    });
