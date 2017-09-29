(function (window) {
    let req = {};

    let send = (options)=>{
        let ajax = {
            method: 'get',
            url: '/',
            data : {},
            callback: () => {},
            async: true,
            cache: 'no-cache',
            Accept: 'application/json',
            type: 'application/x-www-form-urlencoded'
        };
        Object.assign(ajax, options);

        let xhr = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP'),
            url = ajax.method == 'post'?ajax.url:ajax.url+'?'+urlEncode(ajax.data).substr(1);

        xhr.open(ajax.method, url, ajax.async);
        xhr.setRequestHeader('Cache-Control', ajax.cache);
        xhr.setRequestHeader('Accept', ajax.Accept);
        xhr.setRequestHeader('Content-type', ajax.type);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
        //let p = (typeof ajax.data == 'string') ? ajax.data : urlEncode(ajax.data).substr(1);
        xhr.send(ajax.data);

        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    let res = null;
                    if(ajax.Accept == 'application/json') {
                        try{
                            var obj = JSON.parse(xhr.responseText);
                            if(typeof obj === 'object') {
                                res = JSON.parse(xhr.responseText);
                            }else {
                                res = {code: -100, message: xhr.responseText};
                            }
                        }
                        catch(e){
                            res = {code: -100, message: xhr.responseText};
                        }
                    }else {
                        res = xhr.responseText;
                    }
                    ajax.callback(res);
                }else {
                    ajax.error && ajax.error();
                }
            }
        };
    };

    //获取当前会员冻品白条状态;
    req.getStatus = (data, callback)=>{
        return send({method:'get', url: '/mock/getStatus.json', data: data, callback: callback});
    };

    //获取申请手机验证码;
    req.getMobile = (data, callback)=>{
        return send({method:'get', url: '/mock/getMobileCode.json', data: data, callback: callback});
    };

    //验证码验证;
    req.verify = (data, callback)=>{
        return send({method:'get', url: '/mock/verify.json', data: data, callback: callback});
    };

    //获取已有申请资料;
    req.getApplyData = (data, callback)=>{
        return send({method:'get', url: '/mock/getApplyData.json', data: data, callback: callback});
    };

    //身份认证;
    req.identity = (data, callback)=>{
        return send({method:'get', url: '/mock/identity.json', data: data, callback: callback});
    };

    //基本资料验证;
    req.basis = (data, callback)=>{
        return send({method:'get', url: '/mock/basis.json', data: data, callback: callback});
    };

    //影像资料验证;
    req.images = (data, callback)=>{
        return send({method:'get', url: '/mock/images.json', data: data, callback: callback});
    };

    //联系人信息验证;
    req.contact = (data, callback)=>{
        return send({method:'get', url: '/mock/contact.json', data: data, callback: callback});
    };

    //银行卡信息验证;
    req.bankCard = (data, callback)=>{
        return send({method:'get', url: '/mock/bankCard.json', data: data, callback: callback});
    };

    //确认提交资料认证;
    req.submitApply = (data, callback)=>{
        return send({method:'get', url: '/mock/submitApply.json', data: data, callback: callback});
    };

    //居住状况编码;
    req.getDwellCondition = (data, callback)=>{
        return send({method:'get', url: '/mock/code/getDwellCondition.json', data: data, callback: callback});
    };

    //紧急联系人关系编码;
    req.getRelationCode = (data, callback)=>{
        return send({method:'get', url: '/mock/code/getRelationCode.json', data: data, callback: callback});
    };

    //婚姻状况编码;
    req.getMarriageCode = (data, callback)=>{
        return send({method:'get', url: '/mock/code/getMarriageCode.json', data: data, callback: callback});
    };

    //开户行编码;
    req.getBankCode = (data, callback)=>{
        return send({method:'get', url: '/mock/code/getBankCode.json', data: data, callback: callback});
    };

    //地区数据列表获取;
    req.getArea = (data, callback)=>{
        return send({type:'get', url: '/mock/code/area.json', data: data, callback: callback});
    };

    //获取各种协议;
    req.getArticle = (data, callback)=>{
        return send({type:'get', url: '/'+data+'.html', data: {}, callback: callback, Accept: 'text/html'});
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