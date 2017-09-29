(function(){

    var server = H.namespace('server');

    var contextPath = '/mock';
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
        {'Cache-Control': 'no-cache', 'Accept': 'application/json', 'Content-Type': contentType} :
        {'Cache-Control': 'no-cache', 'Accept': 'application/json'};
        var request = $.ajax({
            url: api + '?r=' + Math.random(),
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
                        101: '网络不稳定或不畅通，请检查网络设置',
                        403: '服务器禁止此操作！',
                        500: '服务器遭遇异常阻止了当前请求的执行<br/><br/><br/>'
                    };

                    var msg = null;
                    switch (textStatus) {
                        case 'timeout':
                            msg = '网络连接超时，请检查网络是否畅通！';
                            break;
                        case 'error':
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
                                msg = '服务器响应异常<br/><br/>' + (jqXHR.status == 0 ? '' : jqXHR.status) + '&nbsp;' + errorThrown;
                            }
                            break;
                        case 'abort':
                            msg = null;//'数据连接已被取消！';
                            break;
                        case 'parsererror':
                            msg = '数据解析错误！';
                            break;
                        default:
                            msg = '出现错误:' + textStatus + '！';
                    }
                    if (errorThrown.code != null && errorThrown.message != null && !errors[errorThrown.code]) {
                        msg += '</br>[code:' + errorThrown.code + '][message:' + errorThrown.message + ']' + (null == errorThrown.stack ? '' : errorThrown.stack);
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


    //地址列表;
    server.shop_address = function (data, callback) {
        return send('get', '/mock/shop/address.json', data, callback);
    };

    //添加地址;
    server.shop_address_add = function (data, callback) {
        return send('get', '/mock/shop/address/add.json', data, callback);
    };

    //修改地址;
    server.shop_address_update = function (data, callback) {
        return send('get', '/mock/shop/address/update.json', data, callback);
    };

    //删除地址;
    server.shop_address_delete = function (data, callback) {
        return send('get', '/mock/shop/address/delete.json', data, callback);
    };

    //发件;
    server.shop_order_add = function (data, callback) {
        return send('get', '/mock/shop/order/add.json', data, callback);
    };

    //历史记录;
    server.shop_order = function (data, callback) {
        return send('get', '/mock/shop/order.json', data, callback);
    };

    //订单详情;
    server.shop_order_ = function (data, callback) {
        return send('get', '/mock/shop/order/id.json', data, callback);
    };

    //取消单个运单;
    server.shop_delivery_cancel_ = function (data, callback) {
        return send('get', '/mock/shop/delivery/cancel/id.json', data, callback);
    };

    //地址输入提示;
    server.map_search_hint = function (data, callback) {
        return send('get', '/mock/map/search/hint.json', data, callback);
    };

    //逆地址解析;10
    server.map_geocode_regeo = function (data, callback) {
        return send('get', '/mock/map/geocode/regeo.json', data, callback);
    };

})();