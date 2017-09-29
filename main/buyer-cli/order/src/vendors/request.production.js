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
var send = function (type, api, parameters, success, contentType, async) {
    typeof success == 'function' || (success = function () {
    });
    var Headers = contentType ?
    {"Cache-Control": "no-cache", "Accept": "application/json", "Content-Type": contentType} :
    {"Cache-Control": "no-cache", "Accept": "application/json"};
    var request = $.ajax({
        url: api + "&r=" + Math.random(),
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

// 微信支付请求获取支付charge;
server.weChat_pay = function(params, callback) {
    return send('post', contextPath + '?m=Buyers&c=BuyOrderMain&a=getPaymentCharge', params, callback);
};

// 获取大区 
// 这里上线的时候要去掉order前缀，因为实际接口里没有，这样方便测试。
server.area_list = function(params,callback) {
    return send('get', contextPath + '/?m=DataCenter&c=District&a=getAreaList', params, callback);
};

// weixin支付待确认列表
server.order_buy_wechat_payment_list = function(params,callback) {
    return send('get', contextPath + '/?m=Buyers&c=BuyOrderMain&a=getPaymentWaitConfirmedList', params, callback);
};

// 微信支付运营确认
server.order_buy_goods_back = function(params,callback) {
    return send('post', contextPath + ' /?m=Buyers&c=BuyOrderMain&a=wechatPaymentConfirm', params, callback);
};


// 买家订单评价列表
server.order_appraise_list = function(params, callback) {
    return send('get', contextPath + '/?m=Buyers&c=BuyOrderMain&a=getAppraiseList', params, callback);
};

// 订单商品评价写入
server.order_goods_appraise_add = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=BuyOrderMain&a=addGoodsAppraise', params, callback);
};

// 订单评价写入
server.order_appraise_add = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=BuyOrderMain&a=addOrderAppraise', params, callback, 'application/json');
};
// 订单评价写入新
server.orderAppraise = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=BuyOrderMain&a=orderAppraise', params, callback, 'application/json');
};

// 订单商品评价删除
server.order_goods_appraise_del = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=BuyOrderMain&a=delGoodsAppraise', params, callback);
};

// 获取当前用户的类型
server.userShopType = function(params, callback) {
    return send('post', contextPath + '/?m=DataCenter&c=WeChatDataCenter&a=userShopType', params, callback);
};

//常购买家店铺列表;
server.often_buy = function(params, callback) {
    return send('get', contextPath + '/?m=Buyers&c=ShopMain&a=getShopList', params, callback);
};

//常购买家店铺中常购商品列表;
server.often_goods_list = function(params, callback) {
    return send('get', contextPath + '/?m=Buyers&c=OftenBuyGoodsMain&a=getList', params, callback);
};

//删除常购;
server.often_goods_del = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=OftenBuyGoodsMain&a=delOftenBuy', params, callback);
};

//添加常购;
server.often_goods_add = function(params, callback) {
    return send('post', contextPath + '/?m=Buyers&c=OftenBuyGoodsMain&a=addOftenBuy', params, callback);
};

//商品搜索;
server.often_goods_search = function(params, callback) {
    return send('get', contextPath + '/?m=Buyers&c=OftenBuyGoodsMain&a=goodsList', params, callback);
};

// 购物车数据;
server.shopCartInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShopCart&a=getInfo', params, callback);
};

//集采报价时间;
server.grouponTime = function(params,callback) {
    return send('get', contextPath + '/?m=DataCenter&c=GrouponOrder&a=getGrouponTime', params, callback);
};

//获取用户已支付成功的身份信息;
server.getPayIdentity = function(params,callback) {
    return send('get', contextPath + '/?m=Buyers&c=Payment&a=getPayIdentity', params, callback);
};

//获取支付凭证;
server.getPaymentCharge = function(params,callback) {
    return send('post', contextPath + '/?m=Buyers&c=BuyOrderMain&a=getPaymentCharge', params, callback);
};

//白条额度查询;
server.getCreditLimit = function(params,callback) {
    return send('get', contextPath + '/?m=Buyers&c=Ious&a=getCreditLimit', params, callback);
};

//获取白条贷款利率;
server.getInterestRate = function(params,callback) {
    return send('get', contextPath + '/?m=Buyers&c=Ious&a=getInterestRate', params, callback);
};

//确认支用申请;
server.apply = function(params,callback) {
    return send('post', contextPath + '/?m=Buyers&c=Ious&a=apply', params, callback, 'application/json');
};

//获取贷款人信息;
server.getApplyData = function(params,callback) {
    return send('get', contextPath + '/?m=Buyers&c=Ious&a=getApplyData', params, callback);
};

})();