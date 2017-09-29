;(function(){

var server = H.namespace('server');

var contextPath = '';
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

//1 团购商品列表;
server.getBulkPurchasingList = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getBulkPurchasingList', params, callback);
};

//2 新品推荐列表;
server.getNewProductList = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getNewProductList', params, callback);
};

//3 昨日热销列表;
server.getHotSaleList = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getHotSaleList', params, callback);
};

//4 涨幅列表;
server.getPriceChangeList = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getPriceChangeList', params, callback);
};

//5 领取红包;
server.dailyRedPack = function(params,callback) {
    return send('post', contextPath + 'index.php?m=Buyers&c=ShowPage&a=dailyRedPack', params, callback);
};

//6 商品详情;
server.getGoodsInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=GoodsMain&a=getGoodsInfo', params, callback);
};

//7 购物车数据;
server.shopCartInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShopCart&a=getInfo', params, callback);
};

//8 商品详情中供应商数据;
server.getSellerShopInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Home&c=Shop&a=getSellerShopInfo', params, callback);
};

//9 咨询窗口信息;
server.getConsultInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getConsultInfo', params, callback);
};

//10 下单时，获取当前商品的信息;
server.getGoodsConfirmInfo = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShopCart&a=getGoodsConfirmInfo', params, callback);
};

//11 商品详情中评价;
server.evaluate = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=GoodsMain&a=getGoodsEvaluate', params, callback);
};

//12 新品推荐中的数据统计;
server.goods_new = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getNewProductPageStatistics', params, callback);
};

//13 昨日热销中的数据统计;
server.hot_count = function(params,callback) {
    return send('get', contextPath + 'index.php?m=Buyers&c=ShowPage&a=getHotSellPageStatistics', params, callback);
};

//14 添加常购;
server.addOftenBuyGoods = function(params,callback) {
    return send('post', contextPath + 'index.php?m=Buyers&c=OftenBuyGoodsMain&a=addOftenBuyGoods', params, callback);
};

//15 添加到购物车接口;
server.addGoodsToShopCart = function(params,callback) {
    return send('post', contextPath + 'index.php?m=buyers&c=Goods&a=addGoodsToShopCart', params, callback);
};

//16 获取OSS的图片请求水印;
server.getOssImagesWatermark = function(params,callback) {
    //return send('get', contextPath + '/buyers/list', params, callback);
    return send('get', 'index.php?m=DataCenter&c=OssIdentityInfo&a=getOssImagesWatermark', params, callback);
};

//17 取消常购;
server.delOftenBuyGoods = function(params,callback) {
    //return send('get', contextPath + '/buyers/list', params, callback);
    return send('post', 'index.php?m=Buyers&c=OftenBuyGoodsMain&a=delOftenBuyGoods', params, callback);
};

//18 推荐商品列表;
server.getRecommendGoodsList = function(params,callback) {
    //return send('get', contextPath + '/buyers/list', params, callback);
    return send('get', 'index.php?m=Buyers&c=ShowPage&a=getRecommendGoodsList', params, callback);
};

//19 秒杀商品列表;
server.getActivityGoodsList = function(params,callback) {
    //return send('get', contextPath + '/buyers/list', params, callback);
    return send('get', 'index.php?m=Buyers&c=ShowPage&a=getActivityGoodsList', params, callback);
};

//一批商在线下单;
server.genGoodsOrder = function (params, callback) {
    return send('post', 'index.php?m=Buyers&c=Goods&a=genGoodsOrder', params, callback);
};

//填写报价请求
server.addQuotation = function(params,callback) {
    return send('post', 'index.php?m=Buyers&c=GoodsMain&a=addQuotation', params, callback);
};

//二批商咨询商品微信通知卖家接口
server.sendGoodsConsultNotice = function (params, callback) {
    return send('get', 'index.php?m=Buyers&c=Goods&a=sendGoodsConsultNotice', params, callback);
};

//获取当前登录的用户信息;
server.getInfo = function (params, callback) {
    return send('get', 'index.php?m=Member&c=Shop&a=getInfo', params, callback);
};

//商品的全部评价列表;
server.getAppraiseGoods = function (params, callback) {
    return send('get', '/index.php?m=buyers&c=Appraise&a=goods', params, callback);
};

//评价点赞;
server.appraisePraise = function (params, callback) {
    return send('post', '/index.php?m=buyers&c=Appraise&a=praise', params, callback);
};
})();