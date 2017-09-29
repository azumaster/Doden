(function() {
    let xhr = window.XMLHttpRequest?new XMLHttpRequest():new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('POST', 'index.php?m=FrontPublic&c=WeSdk&a=js_sdk_signature', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.send('signPageUrl='+encodeURIComponent(location.href));
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4){
            if(xhr.status == 200){
                let signData = JSON.parse(xhr.responseText);
                var signInfo = signData.signPackage,
                    wx_config = {
                        debug: false,
                        appId: signInfo.appId,
                        timestamp: signInfo.timestamp,
                        nonceStr: signInfo.nonceStr,
                        signature: signInfo.signature,
                        jsApiList: ['chooseImage', 'uploadImage']
                    };
                wx.config(wx_config);
                wx.ready(function() {
                    //分类的方法写在这里;;
                });
            }
        }
    };
})();

/*
* option{
*   length: 可选取的图片数量,
*   load: 单张图片上传完成执行的回调,
*   loadAll: 所有图片上传完成执行的回调
* }
* */
export function upload(option) {
    let o = {
        length: 1,   //可选取的图片数量,
        load: () => {},   //单张图片上传完成执行的回调,
        loadAll: () => {}   //所有图片上传完成执行的回调
    };
    Object.assign(o, option);
    wx.chooseImage({
        count: o.length, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有;
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有;
        success: function (res) {
            //res={"sourceType":"album","localds":["地址1","地址2"],"errMsg":"chooselmage:ok"};
            var localIds = res.localIds; //返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片;
            var localIndex=0;
            var picArr = [];   //已经上传的图片在微信服务器上的地址;
            function upImg(){
                wx.uploadImage({
                    localId: localIds[localIndex], // 需要上传的图片的本地ID，由chooseImage接口获得;
                    isShowProgressTips: 1, // 默认为1，显示进度提示;
                    success: function(res){
                        picArr.push(res.serverId);
                        o.load(res.serverId, localIds[localIndex]);  //传两个参数。一个是上传成功之后在微信服务器上的地址，第二个是本地ID可作显示;
                        if(localIndex < o.length) {
                            localIndex++;
                            upImg();
                        }else {
                            o.loadAll(picArr);   //参数, 全部上传完成之后返回所有在微信服务器上的地址列表，是数组;
                        }
                    }
                });
            }
            upImg();
        }
    });
}

