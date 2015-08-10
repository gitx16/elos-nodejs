'use strict';

/**
 * @ngdoc service
 * @name elmApp.resourcePool
 * @description
 * # resourcePool
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('msgRegister', function () {
        var handlerMap = {};
        return {
            registerMsg:function(msgCode,handler){
                if(handlerMap[msgCode]){
                    handlerMap[msgCode].push(handler);
                }else{
                    handlerMap[msgCode] = [handler];
                }
            },
            removeMsg:function(msgCode,handler){
                if(handlerMap[msgCode]){
                    var handlerList = handlerMap[msgCode];
                    for (var i = 0; i < handlerList.length; i++) {
                        var obj = handlerList[i];
                        if(obj===handler){
                            handlerList.splice(i,1);
                            break;
                        }
                    }
                }
            },
            dispatchMsg:function(msgCode,data){
                if(handlerMap[msgCode]){
                    var handlerList = handlerMap[msgCode];
                    for (var i = 0; i < handlerList.length; i++) {
                        handlerList[i](data);
                    }
                }
            }
        }
    });
