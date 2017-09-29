(function (window) {
    let req = {};

    /**
     * AJAX请求
     * @param ajax
     *          type: get/post      类型 *
     *          url: String         URL地址 *
     *          async: true/false   是否异步（默认为true）
     *          data:{}             请求参数
     *          callback:function   回调
     */

    let send = (ajax)=>{

        ajax.type = ajax.type?ajax.type:'get';

        let xhr = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP'),
            p = (typeof ajax.data == 'string') ? ajax.data : urlEncode(ajax.data).substr(1),
            url = ajax.type == 'post'?ajax.url+'?r='+Math.random():ajax.url+'?'+p+'&r='+Math.random();
        ajax.async = ajax.async || true;
        ajax.data = ajax.data || null;

        xhr.open(ajax.type, url, ajax.async);
        ajax.type=='post'?xhr.setRequestHeader('Content-type', 'application/json'):null;
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        xhr.send(ajax.type=='post'?p:'');

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    ajax.callback(JSON.parse(xhr.responseText));
                }else {
                    ajax.error && ajax.error();
                }
            }
        };
    };

    /***
     * Seller
     * @param data
     * @param callback
     */
    req.getShopInfo = (data, callback)=>{
        return send({type:'get', url: '/mock/seller/shopInfo.json', data: data, callback: callback});
    };
    req.getMarketList = (data, callback)=>{
        return send({type:'get', url: '/mock/seller/market.json', data: data, callback: callback});
    };
    req.updateMarket = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data: data, callback: callback});
    };
    req.getCustomList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/customList.json', data: data, callback: callback});
    };
    req.getTicketList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/ticket.json', data:data, callback:callback});
    };
    req.operateTicket = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };
    req.purchase = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };
    req.showCustom = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/custom.json', data:data, callback:callback});
    };
    req.getTypeList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/typeList.json', data:data, callback:callback});
    };
    req.getGoodsPrice = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/typePrice.json', data:data, callback:callback});
    };
    req.addPrice = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };
    req.getPayList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/payList.json', data:data, callback:callback});
    };
    req.updatePay = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };
    req.getMemberLink = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/memberLink.json', data:data, callback:callback});
    };
    req.canOperateMember = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/can.json', data:data, callback:callback});
    };
    req.getMemberList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/memberList.json', data:data, callback:callback});
    };
    req.deleteMember = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };

    //获取屏蔽列表;
    req.getBlacklist = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/getBlacklist.json', data:data, callback:callback});
    };

    //添加屏蔽项;
    req.blacklistAdd = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/blacklistAdd.json', data:data, callback:callback});
    };

    //删除屏蔽项;
    req.blacklistRemove = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/blacklistRemove.json', data:data, callback:callback});
    };

    // 获取置顶列表
    req.getStickList = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/stickList.json', data:data, callback:callback});
    };

    // 重置置顶列表
    req.resetStick = (data, callback)=>{
        return send({type:'get', url:'/mock/seller/operate.json', data:data, callback:callback});
    };

    /***
     * buyer
     * @param data
     * @param callback
     */
    req.getCustomerTypeList = (data, callback)=>{   //搜索商品中的分类列表数据获取;
        return send({type:'get', url:'/mock/buyer/buy/goodsTypeList.json', data:data, callback:callback});
    };
    req.getGoodsFilter = (data, callback)=>{   //获取搜索商品的筛选项;
        return send({type:'get', url:'/mock/buyer/buy/goodsFilters.json', data:data, callback:callback});
    };
    req.searchGoods = (data, callback)=>{   //搜索商品;
        return send({type:'get', url:'/mock/buyer/buy/searchGoods.json', data:data, callback:callback});
    };
    req.sellerSearchGoods = (data, callback)=>{   //管理员自己搜索商品;
        return send({type:'get', url:'/mock/buyer/buy/searchGoods.json', data:data, callback:callback});
    };
    //商品详情页面
    req.getGoodsInfo = (data, callback)=>{   //获取商品详情页面;
        return send({type:'get', url:'/mock/buyer/buy/goodsInfo.json', data:data, callback:callback});
    };
    req.addCar = (data, callback)=>{   //获取商品详情页面;
        return send({type:'get', url:'/mock/buyer/buy/addCar.json', data:data, callback:callback});
    };
    req.contactShop = (data, callback)=>{   //联系服务商;
        return send({type:'get', url:'/mock/buyer/contactShop.json', data:data, callback:callback});
    };
    /*
    * 购物车接口
    * */
    req.shoppingCart = (data, callback)=>{   //服务商客户购物车列表;
        return send({type:'get', url:'/mock/buyer/car/shoppingCart.json', data:data, callback:callback});
    };
    req.shoppingCartDel = (data, callback)=>{   //删除购物车商品;
        return send({type:'get', url:'/mock/buyer/car/shoppingCartDel.json', data:data, callback:callback});
    };
    req.updateNum = (data, callback)=>{   //更新购物车商品数量;
        return send({type:'get', url:'/mock/buyer/car/updateNum.json', data:data, callback:callback});
    };
    req.updateTotal = (data, callback)=>{   //动态计算购物车商品数量和金额;
        return send({type:'get', url:'/mock/buyer/car/updateTotal.json', data:data, callback:callback});
    };
    req.getAddress = (data, callback)=>{   //服务商客户获取已有收货地址列表;
        return send({type:'get', url:'/mock/buyer/car/addresses.json', data:data, callback:callback});
    };
    req.createOrder = (data, callback)=>{   //服务商客户获取已有收货地址列表;
        return send({type:'get', url:'/mock/buyer/car/createOrder.json', data:data, callback:callback});
    };
    req.getShop = (data, callback)=>{
        return send({type:'get', url:'/mock/buyer/shop.json', data:data, callback:callback});
    };

    /*
    * 公共数据接口;
    * */
    req.getPayments = (data, callback)=>{   //获取可付款方式列表;
        return send({type:'get', url:'/mock/buyer/getPayments.json', data:data, callback:callback});
    };
    req.getDelivery = (data, callback)=>{   //获取可付款方式列表;
        return send({type:'get', url:'/mock/buyer/getDelivery.json', data:data, callback:callback});
    };

    /**
     * 订单
     * @type {{}}
     */
    req.getOrderList = (data, callback)=>{
        return send({type:'get', url:'/mock/buyer/orderList.json', data:data, callback:callback});
    };
    req.updateOrder = (data, callback)=>{
        return send({type:'get', url:'/mock/buyer/operate.json', data:data, callback:callback});
    };
    req.pay = (data, callback)=>{
        return send({type: 'get', url:'/mock/buyer/pay.json', data:data, callback:callback});
    };

    //查看当前支付的支付状态;
    req.paymentQuery = (data, callback)=>{
        return send({type: 'get', url:'/mock/buyer/paymentQuery.json', data:data, callback:callback});
    };

    //获取该服务商的首页状态是否已经开启;
    req.openHome = (data, callback)=>{
        return send({type: 'get', url:'/mock/buyer/home.json', data:data, callback:callback});
    };

    window.$.req = req;
})(window);

// 构建Send的数据结构
//function buildData(data) {
//    if(data == null) return data;
//
//    let arr = [];
//    for(let key in data){
//        let str = key+'='+data[key];
//        arr.push(str);
//    }
//
//    return arr.join('&');
//}

function urlEncode(param, key, encode) {
    if(param==null) return '';
    var paramStr = '';
    var t = typeof (param);
    if (t == 'string' || t == 'number' || t == 'boolean') {
        paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);
    } else {
        for (var i in param) {
            var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
            paramStr += urlEncode(param[i], k, encode);
        }
    }
    return paramStr;
}