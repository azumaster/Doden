;(function(){

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
var send = function (type, api, parameters, success, async) {
    typeof success == 'function' || (success = function () {
    });
    var request = $.ajax({
        url: api + "&r=" + Math.random(),
        data: parameters,
        type: type,
        dataType: 'json',
        async: true,
        cache: false,
        headers: {"Cache-Control": "no-cache", "Accept": "application/json"},
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

// 订单列表
server.order_buy_list = function(params,callback) {
    return send('get', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderList', params, callback);
};

// 订单中商品删除
server.order_buy_goods_del = function(params,callback) {
    return send('post', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderGoodDel', params, callback);
};

// 订单收货
server.order_buy_receive = function(params,callback) {
    return send('post', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderTake', params, callback);
};

// 订单支付方式信息
server.order_payment_mode_info = function(params,callback) {
    return send('get', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderPaymentModeInfo', params, callback);
};

// 退货|退款
server.order_buy_back = function(params,callback) {
    return send('post', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderBuyBack', params, callback);
};

// 各状态的订单量
server.order_buy_quantity = function(params,callback) {
    return send('get', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderBuyQuantity', params, callback);
};

// 获取支付方式
server.order_payment_mode = function(params,callback) {
    return send('get', contextPath + '?m=Buyers&c=BuyOrderMain&a=orderPaymentMode', params, callback);
};

})()