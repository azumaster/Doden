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
            url = ajax.type == 'post'?ajax.url+'?r='+Math.random():ajax.url+'?'+urlEncode(ajax.data).substr(1)+'&r='+Math.random();
        ajax.async = ajax.async || true;
        ajax.data = ajax.data || null;

        xhr.open(ajax.type, url, ajax.async);
        ajax.type=='post'?xhr.setRequestHeader('Content-type', 'application/json'):null;
        xhr.setRequestHeader('Cache-Control', 'no-cache');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        let p = (typeof ajax.data == 'string') ? ajax.data : urlEncode(ajax.data).substr(1);
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


    req.getShopInfo = (data, callback)=>{
        return send({type:'get', url: '/api/shop/info', data: data, callback: callback});
    };
    req.getMarketList = (data, callback)=>{
        return send({type:'get', url: '/api/shop/markets', data: data, callback: callback});
    };
    req.updateMarket = (data, callback)=>{
        return send({type:'post', url:'/api/shop/markets', data: data, callback: callback});
    };
    req.getCustomList = (data, callback)=>{
        return send({type:'get', url:'/api/shop/customers', data: data, callback: callback});
    };
    req.getTicketList = (data, callback)=>{
        return send({type:'get', url:'/api/shop/sale', data:data, callback:callback});
    };
    req.operateTicket = (data, callback)=>{
        return send({type:'post', url:'/api/shop/sale', data:data, callback:callback});
    };
    req.purchase = (data, callback)=>{
        return send({type:'post', url:'/api/shop/purchase', data:data, callback:callback});
    };
    req.showCustom = (data, callback)=>{
        return send({type:'get', url:'/api/shop/customers/'+data.id, data:data, callback:callback});
    };
    req.getTypeList = (data, callback)=>{
        return send({type:'get', url:'/api/shop/sorts', data:data, callback:callback});
    };
    req.getGoodsPrice = (data, callback)=>{
        return send({type:'get', url:'/api/shop/sorts/prices', data:data, callback:callback});
    };
    req.addPrice = (data, callback)=>{
        return send({type:'post', url:'/api/shop/sorts/prices/rise', data:data, callback:callback});
    };
    req.getPayList = (data, callback)=>{
        return send({type:'get', url:'/api/other/payments', data:data, callback:callback});
    };
    req.updatePay = (data, callback)=>{
        return send({type:'post', url:'/api/shop/payments', data:data, callback:callback});
    };
    req.getMemberLink = (data, callback)=>{
        return send({type:'get', url:'/api/shop/member/url', data:data, callback:callback});
    };
    req.canOperateMember = (data, callback)=>{
        return send({type:'get', url:'/api/shop/member/can', data:data, callback:callback});
    };
    req.getMemberList = (data, callback)=>{
        return send({type:'get', url:'/api/shop/member/all', data:data, callback:callback});
    };
    req.deleteMember = (data, callback)=>{
        return send({type:'post', url:'	/api/shop/member/remove', data:data, callback:callback});
    };

    //获取屏蔽列表;
    req.getBlacklist = (data, callback)=>{
        return send({type:'get', url:'/api/shop/goods/blacklist', data:data, callback:callback});
    };

    //添加屏蔽项;
    req.blacklistAdd = (data, callback)=>{
        return send({type:'post', url:'/api/shop/goods/blacklist/add', data:data, callback:callback});
    };

    //删除屏蔽项;
    req.blacklistRemove = (data, callback)=>{
        return send({type:'post', url:'/api/shop/goods/blacklist/remove', data:data, callback:callback});
    };

    // 获取置顶列表
    req.getStickList = (data, callback)=>{
        return send({type:'get', url:'/api/shop/goods/stick', data:data, callback:callback});
    };

    // 重置置顶列表
    req.resetStick = (data, callback)=>{
        return send({type:'post', url:'/api/shop/goods/stick', data:data, callback:callback});
    };

    /***
     * buyer
     * @param data
     * @param callback
     */
    req.getCustomerTypeList = (data, callback)=>{   //搜索商品中的分类列表数据获取;
        return send({type:'get', url:'api/customer/sorts', data:data, callback:callback});
    };
    req.getGoodsFilter = (data, callback)=>{   //获取搜索商品的筛选项;
        let url = $.seller ? '/api/shop/goods/filters' : '/api/customer/goods/filters';
        return send({type:'post', url: url, data:data, callback:callback});
    };
    req.searchGoods = (data, callback)=>{   //搜索商品;
        let url = $.seller ? '/api/shop/goods' : '/api/customer/goods';
        return send({type:'post', url:url, data:data, callback:callback});
    };
    //商品详情页面
    req.getGoodsInfo = (data, callback)=>{   //获取商品详情页面;
        let url = $.seller ? '/api/shop/goods/'+data : '/api/customer/goods/'+data;
        return send({type:'get', url: url, data:{}, callback:callback});
    };
    req.addCar = (data, callback)=>{   //添加到购物车;
        return send({type:'post', url:'/api/customer/shopping-cart/add', data:data, callback:callback});
    };
    req.contactShop = (data, callback)=>{   //联系服务商;
        return send({type:'get', url:'/api/customer/contact', data:data, callback:callback});
    };

    /*
     * 购物车接口
     * */
    req.shoppingCart = (data, callback)=>{   //服务商客户购物车列表;
        return send({type:'get', url:'/api/customer/shopping-cart', data:data, callback:callback});
    };
    req.shoppingCartDel = (data, callback)=>{   //删除购物车商品;
        return send({type:'post', url:'/api/customer/shopping-cart/del', data:data, callback:callback});
    };
    req.updateNum = (data, callback)=>{   //更新购物车商品数量;
        return send({type:'post', url:'/api/customer/shopping-cart/update', data:data, callback:callback});
    };
    req.updateTotal = (data, callback)=>{   //动态计算购物车商品数量和金额;
        return send({type:'post', url:'/api/customer/shopping-cart/calc', data:data, callback:callback});
    };
    req.getAddress = (data, callback)=>{   //服务商客户获取已有收货地址列表;
        return send({type:'get', url:'/api/customer/user-addresses', data:data, callback:callback});
    };
    req.createOrder = (data, callback)=>{   //服务商客户获取已有收货地址列表;
        return send({type:'post', url:'/api/customer/orders', data:data, callback:callback});
    };

    /*
     * 公共数据接口;
     * */
    req.getPayments = (data, callback)=>{   //获取可付款方式列表;
        return send({type:'get', url:'/api/other/payments', data:data, callback:callback});
    };
    req.getDelivery = (data, callback)=>{   //获取可付款方式列表;
        return send({type:'get', url:'/api/other/delivery/list', data:data, callback:callback});
    };
    req.getShop = (data, callback)=>{
        return send({type:'get', url:'/api/customer/contact', data:data, callback:callback});
    };

    /**
     * 订单
     * @type {{}}
     */
    req.getOrderList = (data, callback)=>{
        return send({type:'get', url:'/api/customer/orders', data:data, callback:callback});
    };
    req.updateOrder = (data, callback)=>{
        return send({type:'post', url:'/api/customer/order/status/update', data:data, callback:callback});
    };
    req.pay = (data, callback)=>{
        return send({type: 'post', url:'/api/customer/order/payment', data:data, callback:callback});
    };

    //查看当前支付的支付状态;
    req.paymentQuery = (data, callback)=>{
        return send({type: 'post', url:'/api/customer/order/payment/query', data:data, callback:callback});
    };

    window.$.req = req;
})(window);

// 构建Send的数据结构
function buildData(data) {
    if(data == null) return data;

    let arr = [];
    for(let key in data){
        let str = key+'='+data[key];
        arr.push(str);
    }

    return arr.join('&');
}

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