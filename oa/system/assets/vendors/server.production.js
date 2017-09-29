(function () {

    var server = H.namespace('server');
    var contextPath = "";
    /**
     * 发起请求方法
     * @param type{get|post}    请求类型
     * @param api               请求地址 url
     * @param parameters        请求发布参数
     * @param success           回调方法,(错误也会调用)
     * @param async             事后异步请求
     * @returns {*}             ajax对象
     */
    var send = function (type, api, parameters, success, contentType) {
        typeof success == 'function' || (success = function () {
        });
        var Headers = contentType ?
        {"Cache-Control": "no-cache", "Accept": "application/json", "Content-Type": contentType} :
        {"Cache-Control": "no-cache", "Accept": "application/json"};
        var request = $.ajax({
            url: api + "?r=" + Math.random(),
            data: parameters,
            type: type,
            dataType: 'json',
            async: true,
            cache: false,
            headers: Headers,
            timeout: 300000,
            success: function (data, textStatus, jqXHR) {
                success.call(this, data, textStatus, jqXHR);
            },
            error: function (jqXHR, textStatus, errorThrown) {

                //alert(jqXHR+errorThrown+textStatus);
                if (jqXHR.status == 401) {
                    location.href = contextPath;
                } else {
                    if (!errorThrown) {
                        return false;
                    }
                    var errors = {
                        101: "网络不稳定或不畅通，请检查网络设置",
                        403: "服务器禁止此操作！",
                        500: "服务器遭遇异常阻止了当前请求的执行<br/><br/><br/>"
                    };

                    var msg = null;
                    switch (textStatus) {
                        case "timeout":
                            msg = "网络连接超时，请检查网络是否畅通！";
                            break;
                        case "error":
                            if (errors[jqXHR.status]) {
                                var data = null;
                                try {
                                    data = jQuery.parseJSON(jqXHR.responseText);
                                } catch (e) {
                                }
                                if (data && data.message) {
                                    msg = data.message;
                                } else {
                                    msg = errors[jqXHR.status];
                                }
                            } else {
                                msg = "服务器响应异常<br/><br/>" + (jqXHR.status == 0 ? "" : jqXHR.status) + "&nbsp;" + errorThrown;
                            }
                            break;
                        case "abort":
                            msg = null;//"数据连接已被取消！";
                            break;
                        case "parsererror":
                            msg = "数据解析错误！";
                            break;
                        default:
                            msg = "出现错误:" + textStatus + "！";
                    }
                    if (errorThrown.code != null && errorThrown.message != null && !errors[errorThrown.code]) {
                        msg += "</br>[code:" + errorThrown.code + "][message:" + errorThrown.message + "]" + (null == errorThrown.stack ? "" : errorThrown.stack);
                    }
                    if (msg == null) {
                        msg = '';
                    }
                    success.call(this, {code: jqXHR.status, message: msg}, textStatus, jqXHR, errorThrown);
                }
            }
        });
        return request;
    };

    /**
     * 登录/退出
     **/
    // 登录
    server.login = function (data, callback) {
        return send('post', contextPath + '/user/login', data, callback);
    };
    // 退出
    server.logout = function (data, callback) {
        return send('post', contextPath + '/user/logout', data, callback);
    };

    /**
     * 导航
     * */
    server.user_navigate = function (data, callback) {
        return send('get', contextPath + '/user/navigate', data, callback);
    };

    /*
     * 获取用户信息*
     */
    server.user_info = function (data, callback) {
        return send('get', contextPath + '/user/info', data, callback);
    };

    /*
     * 账户管理;
     * */
    //获取账户列表;
    server.user_list = function (data, callback) {
        return send('get', contextPath + '/user/list', data, callback);
    };
    //操作员信息修改;
    server.user_info_update = function (data, callback) {
        return send('post', contextPath + '/user/info/update', data, callback);
    };
    //操作员添加;
    server.user_add = function (data, callback) {
        return send('post', contextPath + '/user/add', data, callback);
    };
    //操作员状态更改;
    server.user_status_update = function (data, callback) {
        return send('post', contextPath + '/user/status/update', data, callback);
    };
    //指定ID的操作员所有权限获取;
    server.user_privilege = function (data, callback) {
        return send('get', contextPath + '/user/privilege', data, callback);
    };
    //用户权限修改;
    server.user_privilege_update = function (data, callback) {
        return send('post', contextPath + '/user/privilege/update', data, callback);
    };

    /*
     * 部门管理;
     * */
    //获取部门列表;
    server.department_list = function (data, callback) {
        return send('get', contextPath + '/department/list', data, callback);
    };
    //添加部门;
    server.department_add = function (data, callback) {
        return send('post', contextPath + '/department/add', data, callback);
    };
    //修改;
    server.department_info_update = function (data, callback) {
        return send('post', contextPath + '/department/info/update', data, callback);
    };
    //部门状态更改（删除）;
    server.department_status_update = function (data, callback) {
        return send('post', contextPath + '/department/status/update', data, callback);
    };

    /*
     * 店铺
     * */

    //店铺类型获取;
    server.shop_type_list = function (data, callback) {
        return send('get', contextPath + '/shop/type/list', data, callback);
    };

    /*
     * 省、市、区县信息获取
     * */

    //省、市、区县信息获取;
    server.other_area_list = function (data, callback) {
        return send('get', contextPath + '/other/area/list', data, callback);
    };

    //地区列表获取;
    server.other_customArea_list = function (data, callback) {
        return send('get', contextPath + '/other/custom-area/list', data, callback);
    };

    /*
     * 权限管理;
     * */
    //所有权限获取;
    server.privilege_list = function (data, callback) {
        return send('get', contextPath + '/privilege/list', data, callback);
    };

    /*
     * 版本管理
     * */
    //添加版本日志记录
    server.version_log_add = function (data, callback) {
        return send('post', contextPath + '/system/version/log/add', data, callback);
    };

    //版本日志记录列表
    server.version_log_list = function (data, callback) {
        return send('get', contextPath + '/system/version/log/list', data, callback);
    };

    //修改版本日志记录
    server.version_log_update = function (data, callback) {
        return send('post', contextPath + '/system/version/log/update', data, callback);
    };

    // 省市管理-列表
    server.get_market_list = function (data, callback) {
        return send('get', contextPath + '/market', data, callback);
    };
    // 省市管理-详情
    server.get_market_detail = function (data, callback) {
        return send('get', contextPath + '/market/show', data, callback);
    };
    // 省市管理-开通省份
    server.open_province = function (data, callback) {
        return send('post', contextPath + '/market/add/province', data, callback);
    };
    // 省市管理-开通市场
    server.open_market = function (data, callback) {
        return send('post', contextPath + '/market/add/market', data, callback);
    };
    // 省市管理-获取省市
    server.get_province_list = function (data, callback) {
        return send('get', contextPath + '/city', data, callback);
    };
    // 省市管理-获取地区
    server.get_county_list = function (data, callback) {
        return send('get', contextPath + '/county', data, callback);
    };
})();