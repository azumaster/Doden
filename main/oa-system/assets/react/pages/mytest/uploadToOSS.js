function upload(type, target, imgURL, fn){
    let allowSuffix= '.jpg,.bmp,.gif,.png,.jpeg',
        url = imgURL ? imgURL : target.name ,
        suffix = url.substring(url.lastIndexOf('.')+1).toLowerCase(),
        key = imgURL + H.Date.getFullYear()+H.Date.getMonth()+H.Date.getDate()+'/'+ (new Date).getTime() +''+Math.floor(Math.random()*10)+'.'+ suffix,
        xhr = new XMLHttpRequest();
        POLICY_JSON = {
            'expiration': '2120-12-01T12:00:00.000Z',
            'conditions': [
                ['starts-with', key, ''],
                {'bucket': 'idongpin'},
                ['starts-with'],
                ['content-length-range', 0, 104857600]
            ]
        };

    if(allowSuffix.indexOf(suffix) == -1) {
        H.Modal('仅支持' + allowSuffix + '为后缀名的文件!');
        return ;
    }

    H.server.other_oss_signature({signature_data: policyBase64}, (res) => {
        if(res.code == 0){
            let signature = res.data.signature,
                access_id = res.data.access_id,
                fd = new FormData();
            fd.append('key', key);  //上传到的路径信息;
            fd.append('Content-Encoding', 'compress');  //压缩方式，这里为无压缩;
            fd.append('OSSAccessKeyId', access_id);  //访问ID
            fd.append('signature', signature);  //签名;
            switch (type){
                case 'file':
                        POLICY_JSON.conditions[2] = ['starts-with', target.type, ''];
                        policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
                        fd.append('Content-Length', Math.round(target.size * 100 / 1024) / 100);  //文件大小KB;
                        fd.append('policy', policyBase64);  //参与签名的头信息;
                        fd.append('file', target);          //文件对象
                        fd.append('Content-Type', target.type);  //文件类型;
                        xhr.addEventListener('load', () => {
                            fn();
                        }, false);
                        //请求error
                        xhr.addEventListener('error', function() {
                            H.Modal('请求错误');
                        }, false);
                        //请求中断
                        xhr.addEventListener('abort', function() {
                            H.Modal('请求中断');
                        }, false);
                        xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                        xhr.send(fd);
                    break;

                case 'blob':
                    target.toBlob(function (blob) {
                        POLICY_JSON.conditions[2] = ['starts-with', 'image/' + suffix, ''];
                        H.server.other_oss_identity_data({}, (res) => {

                        });
                        policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
                        fd.append('Content-Length', Math.round(blob.size * 100 / 1024) / 100);  //文件大小KB;
                        fd.append('file', blob);  //需上传的文件对像;
                        //完成后的请求
                        xhr.addEventListener('load', () => {
                            fn();
                        }, false);
                        //请求error
                        xhr.addEventListener('error', function() {
                            H.Modal('上传出现错误，您可以重新点击上传');
                        }, false);
                        //请求中断
                        xhr.addEventListener('abort', function() {
                            H.Modal('上传中断，请检查网络后重新上传');
                        }, false);
                        xhr.open('POST', 'http://oss-cn-qingdao.aliyuncs.com/idongpin', true);
                        xhr.send(fd);
                    });
                    break;
                default: return;
            }
        }else{
            H.Modal(res.message);
        }
    });
}