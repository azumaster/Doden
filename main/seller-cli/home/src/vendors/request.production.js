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

    server.getShopInfo  = function (params, callback) {
        return send('get', '/index.php?m=Home&c=UserShopInfo&a=shopInfo', params, callback);
    };

    server.getShop = function (params, callback) {
        return send('get', '/index.php?m=Home&c=UserShopInfo&a=sellerIndex', params, callback);
    };

    server.getBanner = function (params, callback) {
        return send('get', '/index.php?m=FrontPublic&c=Article&a=articleTitleGet', params, callback);
    };

    // 获取改价通知
    server.getSoldOut = function(params, callback) {
        return send('post', '/index.php?m=Seller&c=Goods&a=getSoldoutNum', params, callback);
    };

    // 获得钻石兑换券列表
    server.getCardList = function (params, callback) {
        return send('get', '/index.php?m=Seller&c=DiamondStore&a=getList', params, callback);
    };
    // 获得钻石明细
    server.getJewelDetail = function (params, callback) {
        return send('get', '/index.php?m=DataCenter&c=Diamond&a=getLog', params, callback);
    };
    // 兑换
    server.buy = function (params, callback) {
        return send('POST', '/index.php?m=Seller&c=DiamondStore&a=buy', params, callback);
    };

    // 获取当前用户的信息
    server.getMe = function (params, callback) {
        return send('get', '/index.php?m=Member&c=Shop&a=getInfo', params, callback);
    };

    // 获取钻石商城上线弹窗提示
    server.getNotify = function (params, callback) {
        return send('get', '/index.php?m=Seller&c=DiamondStore&a=onlineNotify', params, callback);
    };

    // 获取卖家中心日浏览量
    server.getBrowser = function (params, callback) {
        return send('get', '/index.php?m=seller&c=Statistics&a=dayBrowse', params, callback);
    };







    // 修改名字/接单电话
    server.update = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=shopModify', params, callback);
    };
    // 获取成员信息
    server.getMembers = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=shopMember', params, callback);
    };
    // 获取个人信息
    server.getWechat = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=userDataInfoDispose', params, callback);
    };
    // 获取二维码
    server.getQR = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=bangdingMa', params, callback);
    };
    // 修改员工角色
    server.changeRole = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=menberInfoSet', params, callback);
    };
    // 删除员工
    server.delMember = function (params, callback) {
        return send('post', '/index.php?m=Home&c=UserShopInfo&a=shopMemberDel', params, callback);
    };




    // 获取该商家的所有买家评价
    server.getAppraise = function (params, callback) {
        return send('get', '/index.php?m=DataCenter&c=Appraise&a=lists', params, callback);
    };
    // 获取店铺星级
    server.getAvg = function (params, callback) {
        return send('get', '/index.php?m=DataCenter&c=Appraise&a=getShopAvgAppraise', params, callback);
    };

    // 获取店铺信息
    server.getShopDetail = function (params, callback) {
        return send('get', '/index.php?m=Buyers&c=ShopMain&a=getSellerShopInfo', params, callback);
    };

    // 点赞
    server.praise = function (params, callback) {
        return send('post', '/index.php?m=buyers&c=Appraise&a=praise', params, callback);
    };
    // 回复
    server.replay = function (params, callback) {
        return send('post', '/index.php?m=seller&c=Appraise&a=revert', params, callback);
    };
})();