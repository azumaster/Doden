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
     * 每日推送
     * */
    //可推送用户列表;
    server.operate_dailyNews_receiveUser_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/receive-user/list', data, callback);
    };

    //今日推文列表;
    server.operate_todayArticle_list = function (data, callback) {
        return send('get', contextPath + '/operate/today-article/list', data, callback);
    };

    //今日推文类型获取;
    server.other_todayArticle_type = function (data, callback) {
        return send('get', contextPath + '/other/today-article/type', data, callback);
    };

    //今日推文编辑（添加/修改）;
    server.operate_todayArticle_edit = function (data, callback) {
        return send('post', contextPath + '/operate/today-article/edit', data, callback);
    };

    //今日推文删除;
    server.operate_todayArticle_delete = function (data, callback) {
        return send('post', contextPath + '/operate/today-article/delete', data, callback);
    };

    //推文商品列表;
    server.operate_dailyNews_goods_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/goods/list', data, callback);
    };

    //推文商品屏蔽操作;
    server.operate_dailyNews_goods_shield = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/goods/shield', data, callback);
    };

    //前端上传数据到OSS的签名接口;
    server.other_oss_signature = function (data, callback) {
        return send('get', contextPath + '/other/oss/signature', data, callback);
    };

    //获取前端上传数据到OSS的请求ID;
    server.other_oss_identity_data = function (data, callback) {
        return send('get', contextPath + '/other/oss/identity/data', data, callback);
    };

    //推文日志列表;
    server.operate_dailyNews_log_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/log/list', data, callback);
    };

    //每日推文设置
    server.operate_dailyNews_manage_list = function (data, callback) {
        return send('get', contextPath + '/operate/daily-news/manage/list', data, callback);
    };

    //每日推文设置发送
    server.operate_dailyNews_manage_edit = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/manage/edit', data, callback);
    };

    //店铺类型获取
    server.shop_type_info = function (data, callback) {
        return send('get', contextPath + '/shop/type/info', data, callback);
    };

    //获得活动列表
    server.activities_list = function (data, callback) {
        return send('get', contextPath + '/activities/list', data, callback);
    };

    //添加活动
    server.activities_add = function (data, callback) {
        return send('post', contextPath + '/activities/add', data, callback, 'application/json');
    };

    //更新活动
    server.activities_update = function (data, callback) {
        return send('post', contextPath + '/activities/update', data, callback, 'application/json');
    };

    //活动商品列表
    server.activities_goods_list = function (data, callback) {
        return send('get', contextPath + '/activities/goods/list', data, callback);
    };
    //活动商品添加
    server.activities_goods_add = function (data, callback) {
        return send('post', contextPath + '/activities/goods/add', data, callback);
    };

    //活动商品删除
    server.activities_goods_del = function (data, callback) {
        return send('post', contextPath + '/activities/goods/del', data, callback);
    };

    //活动商品清空
    server.activities_goods_clear = function (data, callback) {
        return send('post', contextPath + '/activities/goods/clear', data, callback);
    };

    //活动商品排序
    server.activities_goods_sort = function (data, callback) {
        return send('post', contextPath + '/activities/goods/sort', data, callback);
    };


    /*
     * 推荐商品
     * */

    //添加推荐榜商品;
    server.operate_dailyNews_goods_recommend = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/goods/recommend', data, callback);
    };

    //移除单个推荐榜商品;
    server.operate_dailyNews_recommend_goods_remove = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/remove', data, callback);
    };

    //移除全部推荐榜商品;
    server.operate_dailyNews_recommend_goods_removeAll = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/remove-all', data, callback);
    };

    //推荐榜商品排序;
    server.operate_dailyNews_recommend_goods_sort = function (data, callback) {
        return send('post', contextPath + '/operate/daily-news/recommend/goods/sort', data, callback);
    };

    /*
     * 首页管理
     * */
    // 大区列表
    server.get_area_list = function (data, callback) {
        return send('get', contextPath + '/other/custom-area/list', data, callback);
    };

    //品牌馆列表
    server.get_brand_house_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/brands-house/list', data, callback);
    };

    // 下架品牌
    server.sold_out_brand = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/brands-house/pull-off', data, callback)
    };

    // 通过id获取品牌
    server.search_brand = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/brand-name', data, callback);
    };

    // 新增品牌到品牌馆
    server.add_brand_house = function (data, callback) {
        return send('post', contextPath + '	/operation-manage/index-manage/brands-house/add', data, callback);
    };


    //推荐好货列表
    server.indexManage_recommendGoods_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/recommend-goods/list', data, callback);
    };

    //添加推荐好货
    server.indexManage_recommendGoods_add = function (data, callback) {
        return send('post', contextPath + '	/operation-manage/index-manage/recommend-goods/add', data, callback);
    };

    //下架推荐好货
    server.indexManage_recommendGoods_pullOff = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/recommend-goods/pull-off', data, callback);
    };

    //优质供应商列表
    server.indexManage_highQualitySuppliers_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/high-quality-suppliers/list', data, callback);
    };

    //添加优质供应商
    server.indexManage_highQualitySuppliers_add = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/high-quality-suppliers/add', data, callback);
    };

    //下架优质供应商
    server.indexManage_highQualitySuppliers_pullOff = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/high-quality-suppliers/pull-off', data, callback);
    };

    //通过id获取店铺名称
    server.indexManage_get_highQualitySuppliers_byId = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/shop-name', data, callback);
    };

    //7添加新上好货
    server.indexManage_newGoods_add = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/new-goods/add', data, callback);
    };

    //8获取新上好货列表
    server.indexManage_newGoods_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/new-goods/list', data, callback);
    };

    //9下架新上好货
    server.indexManage_newGoods_pullOff = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/new-goods/pull-off', data, callback);
    };

    //10移动新上好货
    server.indexManage_newGoods_move = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/new-goods/move', data, callback);
    };

    //11移动优质供应商
    server.indexManage_highQualitySuppliers_move = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/high-quality-suppliers/move', data, callback);
    };

    //12移动推荐好货
    server.indexManage_recommendGoods_move = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/recommend-goods/move', data, callback);
    };

    // 获取bannerList
    server.indexManage_banner_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/buyer-index/banner/list', data, callback);
    };

    // 上下架Banner
    server.indexManage_update_banner = function (data, callback) {
        return send('post', contextPath + '/common/banner/show-time/update', data, callback);
    };

    // 调整顺序
    server.indexManage_banner_position = function (data, callback) {
        return send('post', contextPath + '/common/banner/position/update', data, callback);
    };
    // 添加banner
    server.indexManage_banner_add = function (data, callback) {
        return send('post', contextPath+ '/operation-manage/buyer-index/banner/add', data, callback);
    };

    // 获取弹窗广告
    server.indexManage_ad_list = function (data, callback) {
        return send('get', contextPath + '/operation-manage/index-manage/popup-ads/list', data, callback);
    };

    // 下架弹窗广告
    server.indexManage_pulloff_ad = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/popup-ads/pull-off', data, callback);
    };

    // 添加弹窗广告
    server.indexManage_add_ad = function (data, callback) {
        return send('post', contextPath + '/operation-manage/index-manage/popup-ads/add', data, callback);
    };

    server.bi_order = function (data, callback) {
        return send('post', contextPath +'/bi/order', data, callback);
    };

    server.bi_order_filter = function (data, callback) {
        return send('post', contextPath +'/bi/order/filter', data, callback);
    };




    server.service_list = function (data, callback) {
        return send('get', contextPath + '/provider/', data, callback);
    };
    server.show_service = function (data, callback) {
        return send('get', contextPath + '/provider/show', data, callback);
    };
    server.update_service = function (data, callback) {
        return send('post', contextPath + '/provider/sp/update', data, callback);
    };
    server.search_service = function (data, callback) {
        return send('post', contextPath + '/provider/search', data, callback);
    };
    server.service_log_list = function (data, callback) {
        return send('get', contextPath + '/provider/log', data, callback);
    };
    server.handle_service = function (data, callback) {
        return send('post', contextPath + '/provider/handle', data, callback);
    };
    server.update_wechat_service = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-config', data, callback);
    };

    server.category_list = function (data, callback) {
        return send('get', contextPath + '/provider/sort', data, callback);
    };
    server.add_category = function (data, callback) {
        return send('post', contextPath + '/provider/sort/add', data, callback);
    };

    server.wechat_tag_list = function (data, callback) {
        return send('get', contextPath + '/provider/wechat-tags', data, callback);
    };
    server.update_tag = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-tag/update', data, callback);
    };
    server.del_tag = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-tag/del', data, callback);
    };

    server.wechat_menu_list = function (data, callback) {
        return send('get', contextPath + '/provider/wechat-menus', data, callback);
    };
    server.del_menu = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-menu/del', data, callback);
    };
    server.update_menu = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-menu/edit', data, callback);
    };
    server.get_menu_type = function (data, callback) {
        return send('get', contextPath + '/provider/wechat-menu-types', data, callback);
    };

    server.init_wechat = function (data, callback) {
        return send('post', contextPath + '/provider/wechat-init', data, callback);
    };

    // 删除服务商
    server.del_sp = function (data, callback) {
        return send('post', contextPath + '/provider/del', data, callback);
    };


    /*
     * 服务商统计
     * */
    //客户统计
    server.customer_statistics = function (data, callback) {
        return send('post', contextPath + '/bi/provider/customers', data, callback, 'application/json');
    };
    //订单统计
    server.order_statistics = function (data, callback) {
        return send('post', contextPath + '/bi/provider/order', data, callback, 'application/json');
    };

    server.get_provider_province = function (data, callback) {
        return send('get', contextPath + '/provider/province', data, callback);
    };
    server.get_provider_children = function (data, callback) {
        return send('get', contextPath + '/provider/children/'+data.id, data, callback);
    }
    //订单排行
    server.rank_order = function (data, callback) {
        return send('post', contextPath + '/bi/provider/rank-order', data, callback, 'application/json');
    };
    //商品排行
    server.rank_goods = function (data, callback) {
        return send('post', contextPath + '/bi/provider/rank-goods', data, callback, 'application/json');
    };
    //客户注册统计
    server.provider_customersRegister = function (data, callback) {
        return send('get', contextPath + '/bi/provider/customersRegister', data, callback);
    };
    //服务商搜索提示;
    server.provider_hint = function (data, callback) {
        return send('post', contextPath + '/provider/hint', data, callback, 'application/json');
    };

    //某服务商区域列表
    server.provider_area = function (data, callback) {
        return send('get', contextPath + '/provider/area', data, callback);
    };
    //添加服务商区域
    server.provider_area_add = function (data, callback) {
        return send('post', contextPath + '/provider/area/add', data, callback, 'application/json');
    };
    //删除服务商区域
    server.provider_area_remove = function (data, callback) {
        return send('post', contextPath + '/provider/area/remove', data, callback, 'application/json');
    };
    //修改服务商区域
    server.provider_area_edit = function (data, callback) {
        return send('post', contextPath + '/provider/area/edit', data, callback, 'application/json');
    };
})();