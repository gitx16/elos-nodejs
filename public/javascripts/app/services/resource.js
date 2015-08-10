'use strict';

/**
 * @ngdoc service
 * @name elmApp.elmResource
 * @description
 * # elmResource
 * Factory in the elmApp.
 */
angular.module('fscApp')
    .factory('resource', function (ajax) {
        var noop = angular.noop,
            forEach = angular.forEach,
            extend = angular.extend,
            copy = angular.copy,
            isArray = angular.isArray,
            isFunction = angular.isFunction;
        var $resourceMinErr = angular.$$minErr('elm_resouce');
        var DEFAULT_ACTIONS = {
            'get': {
                method: 'get'
            },
            'query': {
                method: 'get',
                isArray: true,
                params: {
                    currentPage: 1
                }
            },
            'create': {
                method: 'post'
            },
            'update': {
                method: 'patch'
            },
            'save': {
                method: 'put'
            },
            'delete': {
                method: 'del'
            }
        }
        var VARS_RE = /{([^{]+)}/g;
        var defaultResourceConfig = {
//            requestSufix: '.json',//在elm_ajax里统一加
            primaryKey: 'id',
            createResource: true
        }


        function resourceFactory(url, paramDefaults, actions, resourceConfig) {
            var resourceConfig = extend({}, defaultResourceConfig, resourceConfig || {});

            function Resource(resourceData) {
                extend(this, resourceData);
            }

            function getHttpConfig(actionParams, invokeParams, data) {
                data = data || {};
                var finalParams = extend({}, paramDefaults, actionParams, invokeParams);
                var httpUrl = url;
                if (url.indexOf("{") > -1) {
                    httpUrl = url.replace(VARS_RE, function (m, key) {
                        var paramValue = finalParams[key] || data[key] || '';
                        paramValue = paramValue + "";
                        if (paramValue.charAt(0) === '@') {
                            var tmpKey = paramValue.substr(1);
                            paramValue = data[tmpKey] || '';
                        }
                        delete finalParams[key];//去掉匹配url变量的属性,剩下的加到http的params中去
                        return paramValue;
                    })
                }
                //    '//','///','////'... -> '/'
                httpUrl = httpUrl
                    .replace(/\/{2,}/g, '/')
                    .replace(/\/$/, '');
//                httpUrl += resourceConfig.requestSufix;//在elm_ajax里统一加
                return {
                    url: httpUrl,
                    params: finalParams
                }
            }

            actions = extend({}, DEFAULT_ACTIONS, actions);
            forEach(actions, function (action, actionName) {
                var hasBody = /^(POST|PUT|PATCH)$/i.test(action.method);
                Resource[actionName] = function (a1, a2, a3, a4) {
                    var params = {}, data, success, error,hideLoading=false;
                    switch (arguments.length) {
                        case 4:
                            error = a4;
                            success = a3;
                        //fallthrough
                        case 3:
                            hideLoading = a2;
                            success = a3;
                        case 2:
                            if (isFunction(a2)) {
                                if (isFunction(a1)) {
                                    success = a1;
                                    error = a2;
                                    break;
                                }

                                success = a2;
                                error = a3;
                                //fallthrough
                            } else {
                                params = a1;
                                data = a2;
                                success = a3;
                                break;
                            }
                        case 1:
                            if (isFunction(a1)) success = a1;
                            else if (hasBody) data = a1;
                            else params = a1;
                            break;
                        case 0:
                            break;
                        default:
                            throw $resourceMinErr('badargs',
                                "Expected up to 4 arguments [params, data, success, error], got {0} arguments",
                                arguments.length);
                    }
                    var httpConfig = getHttpConfig(action.params, params, data);
                    httpConfig.method = action.method;//isNew ? 'post' : action.method;
                    hasBody && (httpConfig.data = data);
                    var promise = ajax(httpConfig,true);
                    promise.then(function (data) {
                        if (action.isArray) {
                            var ret = [];
                            if (data&&!isArray(data.collection)) {
                                throw $resourceMinErr(httpConfig.url + '返回值解析错误', '方法{0}配置为array类型，服务器返回data.collection为: {1}', actionName, data.collection);
                            }
                            if (resourceConfig.createResource) {
                                forEach(data.collection, function (item) {
                                    ret.push(new Resource(item));
                                });
                            } else {
                                ret = data;
                            }
                            (success || noop)(ret, data);
                        } else {
                            var retModel = data || {};
                            var ret = resourceConfig.createResource ? new Resource(retModel) : retModel;
                            (success || noop)(ret);
                        }
                    }, function (res) {
                        (error || noop)(res);
                    })
                }

                Resource.prototype['$' + actionName] = function (params, success, error) {
                    if (isFunction(params)) {
                        error = success;
                        success = params;
                        params = {};
                    }
                    Resource[actionName].call(this, params, this, success, error);
                };
            });
            Resource.prototype['copy'] = function () {
                var copyResource = extend({}, this);
                return new Resource(copy(copyResource));
            }
            return Resource;
        }

        return {
            create: resourceFactory
        };
    })
