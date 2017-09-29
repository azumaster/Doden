(function(){

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

    //获取我的在售/待审核/已下架商品列表(带分页)
    server.getList  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getList', params , callback);
    } ;

    //获取我的在售/待审核/已下架商品的数量
    server.getGoodsNum  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getGoodsNum', params , callback);
    } ;

    //获取我的在售/待审核/已下架商品的类型列表
    server.getTypeList  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getTypeList', params , callback);
    } ;

    //获取我的价格过期商品的数量
    server.getSoldoutNum  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getSoldoutNum', params , callback);
    } ;

    //更新我的价格过期商品的价格过期时间
    server.updateExpirationTime  = function(params, callback){
        return send('post', 'index.php?m=Seller&c=Goods&a=updateExpirationTime', params , callback);
    } ;

    //更新我的商品的价格
    server.changePrice  = function(params, callback){
        return send('post', 'index.php?m=Seller&c=Goods&a=changePrice', params , callback, 'application/json');
    } ;

    //删除我的商品
    server.delGoods  = function(params, callback){
        return send('post', 'index.php?m=Seller&c=Goods&a=delGoods', params , callback);
    } ;

    //商品上下架
    server.updateSaleStatus  = function(params, callback){
        return send('post', 'index.php?m=Seller&c=Goods&a=updateSaleStatus', params , callback);
    } ;

    //获取商品规格及型号约束
    server.getBasicAttr  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getBasicAttr', params , callback);
    } ;

    //获取商品通知列表
    server.getNoticeList  = function(params, callback){
        return send('get', 'index.php?m=PublicTemplate&c=Goods&a=getNoticeList', params , callback);
    } ;

    //获取该商家所有的商品类型列表
    server.getShopGoodsType  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getShopGoodsType', params , callback);
    } ;

    //获取品牌列表
    server.getBrandList  = function(params, callback){
        return send('get', 'index.php?m=sellers&c=Goods&a=getBrandList', params , callback);
    } ;

    //获取商品详情
    server.getGoodsInfo  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getGoodsInfo', params , callback);
    } ;

    //获取未读商品通知数量;
    server.getNoticeNum  = function(params, callback){
        return send('get', 'index.php?m=PublicTemplate&c=Goods&a=getNoticeNum', params , callback);
    };

    //获取价格体系规则;
    server.getPriceRule  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getPriceRule', params , callback);
    };

    //获取商品的价格规则;
    server.getGoodsPriceRule  = function(params, callback){
        return send('get', 'index.php?m=Seller&c=Goods&a=getGoodsPriceRule', params , callback);
    };
})();