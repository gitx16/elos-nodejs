'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmAjax
 * @description
 * # elmAjax
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('ajax', function ($q, $http, $log, msg,loading) {
        var REST = {
            'post': 'POST',
            'patch': 'PATCH',
            'get': 'GET',
            'del': 'DELETE',
            'put':'PUT'
        };
        // Public API here
        return function (options, hideLoading) {
            loading(!hideLoading);
            // 调用的地方，只需要关心业务上的成功失败，http级别的error在这里统一处理，所以需要重新创建一个defer对象，而不能直接返回http的defer（这个defer只能触发http的失败）
            var deferred = $q.defer();

            if (options.ids) {
                options.ids.forEach(function (id, index) {
                    options.url = options.url.replace('{' + index + '}', id);
                });
            }

            var method = REST[options.method] || 'GET';
            options.url += '.json?_method=' + method;
            options.method = (method === 'GET' ? 'GET' : 'POST');
            if (options.method !== 'GET') {
                options.headers = {
                    contentType: 'application/json; charset=utf-8'
                }
            }
            $http(options)
                .success(function (res, status, headers, config) {
                    var stat = res.stat;
                    switch(stat){
                        case 'OK':
                            deferred.resolve(res.data);
                            break;
                        default:
                            $log.error('错误：' ,res.errors);
                            console.trace('系统异常堆栈:');
                            msg.error(res.errors || '系统异常：未知原因');
                            deferred.reject(res.msg);
                    }
                })
                .error(function (res, status, headers, config) {
                    $log.log('请求失败：' + res);
                    msg.error('请求失败：' + res);
                    deferred.reject(res, status, headers, config);
                })
                .finally(function () {
                    loading(false);
                });
            return deferred.promise;
        };
    });
