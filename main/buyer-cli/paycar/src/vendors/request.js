const STATIC_PATH = '/';

;(function(){

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
var send = function (type, api, parameters, success, async) {
    typeof success == 'function' || (success = function () {
    });
    var request = $.ajax({
        url: api + "?r=" + Math.random(),
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

// 购物车商品信息接口
server.shopCart_goods_info = function(params,callback) {
    return send('get', contextPath + '/shopCart/goods/info', params, callback);
};

// 购物车选中商品总价计算接口
server.shopCart_selected_goods_totalPrice = function(params,callback) {
    return send('get', contextPath + '/shopCart/selected/goods/total-price', params, callback);
};

// 购物车商品数量调整接口
server.shopCart_goods_rejig_buyNumber = function(params,callback) {
    return send('post', contextPath + '/shopCart/goods/rejig/buy-number', params, callback);
};

//购物车商品删除接口
server.shopCart_goods_del = function(params,callback) {
    return send('post', contextPath + '/shopCart/goods/del', params, callback);
};

//购物车结算信息接口;
server.shopCart_goods_settlement_info = function(params,callback) {
    return send('get', contextPath + '/shopCart/goods/settlement/info', params, callback);
};

//钻石可减免金额计算接口;
server.other_diamond_exchange = function(params,callback) {
    return send('get', contextPath + '/other/diamond/exchange', params, callback);
};

//客服电话接口;
server.other_phone_customService = function(params,callback) {
    return send('get', contextPath + '/other/phone/custom-service', params, callback);
};

//提交购物车信息生成订单接口;
server.order_create = function(params,callback) {
    return send('post', contextPath + '/order/create', params, callback);
};

//获取区域接口;
server.other_area_list = function(params,callback) {
    return send('get', contextPath + '/other/area/list', params, callback);
};

//集采报价时间;
server.grouponTime = function(params,callback) {
    return send('get', contextPath + '/groupon/time', params, callback);
};

})();