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

    // 获取首页的信息
    server.getHome  = function (params, callback) {
        return send('get', '/mock/home/getHome.json', params, callback);
    };

    // 获取贷款列表
    server.getLoanList = function (params, callback) {
        return send('get', '/mock/loan/loanList.json', params, callback);
    };
    // 获取贷款信息的详情
    server.getLoanDetail = function (params, callback) {
        return send('get', '/mock/loan/loanDetail.json', params, callback);
    };
    // 获取正常还款的信息
    server.getRePayInfo = function (params, callback) {
        return send('get', '/mock/loan/rePay.json', params, callback);
    };
    // 正常还款
    server.rePay = function (params, callback) {
        return send('get', '/mock/loan/status.json', params, callback);
    };
    // 获取转账还款的信息
    server.getTransfer = function (params, callback) {
        return send('get', '/mock/loan/transfer.json', params, callback);
    };
    // 上传转账还款的凭证
    server.transfer = function (params, callback) {
        return send('get', '/mock/loan/status.json', params, callback);
    };

    // 获取站内信
    server.getMail = function (params, callback) {
        return send('get', '/mock/mail/mail.json', params, callback);
    };

    // 获取个人信息
    server.getMe = function (params, callback) {
        return send('get', '/mock/me/me.json', params, callback);
    };
    // 添加新银行卡
    server.addBank = function (params, callback) {
        return send('get', '/mock/me/status.json', params, callback);
    };

    // 获取婚姻选项信息
    server.getMarriage = function (params, callback) {
        return send('get', '/mock/options/marriage.json', params, callback);
    };
    // 获取开户行编码
    server.getBankCode = function (params, callback) {
        return send('get', '/mock/options/bankCode.json', params, callback);
    };
})();