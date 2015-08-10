'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('global', function () {
        return {
            /**
             * 表情缓存 emojiCache
             */

            /**
             * cache:{
             *  user:"用户缓存",
             *  sessions:"会话缓存"
             *  classes:"班级缓存",
             *  resUrl:"资源服务器地址缓存",
             *  groups:"群组缓存"
             * }
             */
            //页面状态
            pageStatus:{
                //会话页面状态
                session:{},
                //联系人页面状态
                linkman:{
                    groups:{
                        "teacher":{name:"老师组",open:false},
                        "dean":{name:"教务组",open:false}
                    }
                },
                //群组状态
                group:{
                }
            }
        }
    });
