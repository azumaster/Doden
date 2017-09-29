/**
 * Created by YYM on 2017.05.10.
 */
(function () {
    let req = {};
    let send = function (obj, method, url, data, callback, header) {
        if(!obj) return;
        let reqOption = {};
        reqOption.method = method;
        reqOption.url = url+'?r='+Math.random();
        if(method == 'post' || method == 'POST'){
            reqOption.body = data;
        }
        if(method == 'get' || method == 'GET') {
            reqOption.params = data;
        }
        if(header){
            reqOption.header = header;
        }
        let request = obj.$http(reqOption).then((res)=>{
            callback.call(this, res.data?res.data:res.body);
        });
        return request;
    };

    // 获取用户信息
    req.getUserInfo = function (obj, data, callback) {
        return send(obj, 'get', '/mock/common/info.json', data, callback, 'Accept:application/json');
    };
    //获取白名单
    req.getWhiteList = function (obj, data, callback) {
        return send(obj, 'get', '/mock/list.json', data, callback, 'Accept:application/json');
    }; 
    //获取大区
    req.getPlace = function (obj, data, callback) {
        return send(obj, 'get', '/mock/daqu.json', data, callback, 'Accept:application/json');
    };
    window.req = req;
})();