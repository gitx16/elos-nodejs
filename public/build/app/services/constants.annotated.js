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
            resServer: "http://res.tourerp.cn/",
            reqCode: {
                NOTIFY_PULL_FSC_SESSION: "NOTIFY_PULL_FSC_SESSION"
            },
            msgCode: {
                SESSION_UPDATE:"SESSION_UPDATE",
                SESSION_POST:"SESSION_POST",
                USER_UPDATE:"USER_UPDATE"
            },
            portrait: {
                default: "/assets/img_tmp/portrait.jpg",
                class: "/assets/img_tmp/group_default.png",
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
                class: 4,
                trg: 5
            }
        }
    });
