(function(){

    var server = H.namespace('server');

    var contextPath = "/mock";
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


    // 获取提现首页信息
    server.getPayment = function (params, callback) {
        return send('get', '/mock/payment.json', params, callback);
    };
    // 获取用户角色
    server.getUserRole = function (params, callback) {
        return send('get', '/mock/userRole.json', params, callback);
    };

    // 获取提现记录
    server.getRecode = function (params, callback) {
        return send('get', '/mock/recode.json', params, callback);
    };
    // 获取可提现订单
    server.getWithdraw = function (params, callback) {
        return send('get', '/mock/withdraw.json', params, callback);
    };
    // 获取未完成订单信息
    server.getIncomplete = function (params, callback) {
        return send('get', '/mock/incomplete.json', params, callback);
    };
    // 获取可提现订单信息
    server.getCan = function (params, callback) {
        return send('get', '/mock/can.json', params, callback);
    };

    // 获取提现中订单信息
    server.getWithdrawing = function (params, callback) {
        return send('get', '/mock/can.json', params, callback);
    };

    // 获取对账单
    server.getStatement = function (params, callback) {
        return send('get', '/mock/statement.json', params, callback);
    };

    // 添加或更新银行卡
    server.updateCard = function (params, callback) {
        return send('get', '/mock/status.json', params, callback);
    };
    // 查看银行卡信息
    server.showCard = function (params, callback) {
        return send('get', '/mock/card.json', params, callback);
    };

    // 申请提现
    server.withdraw = function (params, callback) {
        return send('get', '/mock/status.json', params, callback);
    };
})();