var version = '201607291024',CONNECT_TIME= 3000, testHost = 'test.m.zdongpin.com', host = 'm.zdongpin.com',
    staticArr = [
        {name: 'Public/basic/js/wx.js'},
        {name: 'Public/buyer-cli/we.js', time: 'Public/buyer-cli/mall/groupBuyBundle.js'}
    ];
var	brWidth = document.documentElement.clientWidth,
    brHeight = document.documentElement.clientHeight,
//	brWidth = brWidth>640?640:brWidth;
    size=brWidth/320*16;
document.getElementsByTagName("html")[0].style.fontSize=size+"px";
document.getElementsByTagName("html")[0].style.height=brHeight+"px";
function setCookie(name,value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 2*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
(function() {
    function staticChange(domain) {
        var v = version || '201607281407';
        for(var i = 0 ; i < staticArr.length ; i++) {
            var script = document.createElement('script');
            script.type = 'application/javascript';
            script.src = domain + staticArr[i].name + '?v='+v;
            document.body.appendChild(script);
            if(staticArr[i].time) {
                var time = staticArr[i].time;
                script.onload = function() {
                    var scriptTime = document.createElement('script');
                    scriptTime.type = 'application/javascript';
                    scriptTime.src = domain + time + '?v='+v;
                    document.body.appendChild(scriptTime);
                }
            }
        }
    }

    var domainUrl = '',
        localhost = window.location.href,
        imgSuccess = null,
        static1 = 'http://img.idongpin.com/',
        static2 = 'http://cdn2.img.idongpin.com/',
        imgTimeout = false,
        timeout = null;

    function createImgConnect(state) {
        imgError = function() {  //图片没加载成功，启用备用cdn;
            if(!timeout) return;
            clearInterval(timeout);
            timeout = null;
            imgTimeout = true;
            setCookie('domain', static2);
            if(state == 1) {
                staticChange(static2);
            }else if(state == 2) {
                staticChange('http://' + testHost+'/');
            }
        };

        imgSuccess = function() {
            clearInterval(timeout);
            imgTimeout = true;
            setCookie('domain', static1);
            if(state == 1) {
                staticChange(static1);
            }else if(state == 2) {
                staticChange('http://' + testHost+'/');
            }
        };

        var testImgDom = document.createElement('img');
        testImgDom.src = static1 + 'Public/images/test-connect.png';
        testImgDom.width = 0;
        testImgDom.height = 0;
        testImgDom.onerror = imgError;
        testImgDom.onload = imgSuccess;
        document.body.appendChild(testImgDom);
        timeout = setInterval(function() {
            if(!imgTimeout) {
                imgError();
            }
        }, CONNECT_TIME);
        //更新cookie;
    }

    if( localhost.indexOf(testHost) != -1) {
        if(getCookie('domain')) {
            staticChange('http://' + testHost+'/');
        }else {
            createImgConnect(2);
        }
    }else if(localhost.indexOf(host) != -1) {
        if(getCookie('domain')) {
            domainUrl = getCookie('domain');
            staticChange(domainUrl);
        }else {
            createImgConnect(1);
        }
    }

    if(localhost.indexOf('192.168.') != -1) {
        setCookie('domain', 'http://'+window.location.host+'/');
        staticChange('http://'+window.location.host+'/');
    }
})();