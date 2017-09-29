(function (window) {
    let req = {};

    let send = (options)=>{
        let ajax = {
            method: 'get',   //请求方式，默认get
            url: '/',        //请求地址;
            data : null,       //请求数据
            callback: () => {}, //请求成功的回调;
            async: true,      //异步请求;
            cache: 'no-cache',
            Accept: 'application/json',   //前端期望得到的数据的格式;
            type: 'application/x-www-form-urlencoded'   //前端请求数据的格式,默认为表单提交，;
        };

        Object.assign(ajax, options);

        let xhr = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP'),
            url = ajax.method == 'post'?ajax.url:ajax.url+urlEncode(ajax.data);

        xhr.open(ajax.method, url, ajax.async);
        xhr.setRequestHeader('Cache-Control', ajax.cache);
        xhr.setRequestHeader('Accept', ajax.Accept);
        xhr.setRequestHeader('Content-type', ajax.type);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        let p = ajax.data;
        if(ajax.type == 'application/x-www-form-urlencoded') p = urlEncode(ajax.data).substr(1); //当用表单请求的时候，参数的格式为：?name=1&user='xy';
        if(ajax.type == 'application/json' && (ajax.method == 'post' || ajax.method == 'POST')) {  //数据类型为json时并且请求方式为post, 则需要的数据格式应该json串;
            if(typeof ajax.data == 'object') {
                p = JSON.stringify(ajax.data);
            }
        }
        xhr.send(p);

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    if(ajax.Accept == 'application/json') {
                        try{
                            var obj = JSON.parse(xhr.responseText);
                            if(typeof obj === 'object') {
                                ajax.callback(JSON.parse(xhr.responseText));
                            }else {
                                ajax.callback({code: -100, message: xhr.responseText});
                            }
                        }
                        catch(e){
                            ajax.callback({code: -100, message: xhr.responseText});
                        }
                    }else {
                        ajax.callback(xhr.responseText);
                    }
                }else {
                    ajax.error && ajax.error();
                }
            }
        };
    };

    //获取当前会员冻品白条状态;
    req.getStatus = (data, callback)=>{
        return send({method:'get', url: '/?m=Buyers&c=Ious&a=getStatus', data: data, callback: callback});
    };

    //获取申请手机验证码;
    req.getMobile = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=VerificationCode&a=getMobile', data: data, callback: callback});
    };

    //验证码验证;
    req.verify = (data, callback)=>{
        return send({method:'post', url: '/?m=DataCenter&c=VerificationCode&a=verify', data: data, callback: callback});
    };

    //获取已有申请资料;
    req.getApplyData = (data, callback)=>{
        return send({method:'get', url: '/?m=Buyers&c=Ious&a=getApplyData', data: data, callback: callback});
    };

    //身份认证;
    req.identity = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=identity', data: data, callback: callback, type: 'application/json'});
    };

    //基本资料验证;
    req.basis = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=basis', data: data, callback: callback, type: 'application/json'});
    };

    //影像资料验证;
    req.images = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=images', data: data, callback: callback, type: 'application/json'});
    };

    //联系人信息验证;
    req.contact = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=contact', data: data, callback: callback, type: 'application/json'});
    };

    //银行卡信息验证;
    req.bankCard = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=bankCard', data: data, callback: callback, type: 'application/json'});
    };

    //确认提交资料认证;
    req.submitApply = (data, callback)=>{
        return send({method:'post', url: '/?m=Buyers&c=Ious&a=submitApply', data: data, callback: callback, type: 'application/json'});
    };

    //居住状况编码;
    req.getDwellCondition = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=Ious&a=getDwellCondition', data: data, callback: callback});
    };

    //紧急联系人关系编码;
    req.getRelationCode = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=Ious&a=getRelationCode', data: data, callback: callback});
    };

    //婚姻状况编码;
    req.getMarriageCode = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=Ious&a=getMarriageCode', data: data, callback: callback});
    };

    //开户行编码;
    req.getBankCode = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=Ious&a=getBankCode', data: data, callback: callback});
    };

    //地区数据列表获取;
    req.getArea = (data, callback)=>{
        return send({method:'get', url: '/?m=DataCenter&c=Ious&a=getAreas', data: data, callback: callback});
    };

    //获取各种协议;
    req.getArticle = (data, callback)=>{
        return send({type:'get', url: '/Public/buyer-cli/ious/'+data+'.html', data: {}, callback: callback, Accept: 'text/html'});
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
    if(param==null || param == {}) return '';
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