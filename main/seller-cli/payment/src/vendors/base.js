/**
 * Created by xy on 2016/5/6.
 */
;(function (global,factory) {
    if ( typeof module === 'object' && typeof module.exports === 'object' ){
        module.exports = global.document ?
            factory( global ,true ) :
            function( w ) {
                if ( !w.document ) {
                    throw new Error( 'I required a window with a document' );
                }
                return factory( w );
            };
    } else {
        factory( global );
    }
}(typeof window !== 'undefined' ? window : this , function(window,noGlobal){
    Function.prototype.method = function(name,fn){
        this.prototype[name] = fn;
        return this;
    };

    if ( !String.prototype.trim ) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g,'');
        }
    }

    var H = {},
        strundefined = typeof undefined,
        varType = {},
        toString = varType.toString,
        rnotwhite = /\S+/g,
        rclass = /[\t\r\n\f]/g;

    var proUtils = {
        eachVarType: function(v){
            var arr = "Boolean Number String Function Array Date RegExp Object Error".split(" ");
            arr.forEach(function(name){
                v['[object ' + name + ']'] = name.toLowerCase();
            });
            return v;
        },
        type: function(obj){
            if (obj == null) {
                return obj+'';
            }
            return typeof obj === 'object' || typeof obj === 'function' ?
                varType[ toString.call(obj) ] || 'object' : typeof obj;
        }
    };
    proUtils.eachVarType(varType);

    /**
     * 对象方法
     */
    H.isObject = function (obj){
        return proUtils.type(obj) === 'object';
    };

    H.isFunction = function (obj){
        return proUtils.type(obj) === 'function';
    };

    H.isArray = function (obj) {
        return proUtils.type(obj) === 'array';
    };

    H.isString = function (obj){
        return proUtils.type(obj) === 'string' ;
    };

    H.namespace = function(name){
        if ( H.isString( name ) ) {
            return ns( name );
        } else if ( H.isFunction( name )  ) {
           var new_ns =  name.call( this );
           if ( !H.isString( new_ns ) ){
                throw "必须返回一个有效的字符串。"
                return;
           } else {
               return ns( new_ns );
           }
        } else {
            throw "not strings in ";
        }

        function ns(names){
            var parts = names.split('.'),
                current = H ;
            for ( var i in parts ) {
                if ( !current[ parts[ i ] ] ) {
                    current[ parts[ i ] ] = {};
                };
                current = current[ parts[ i ] ];
            }
            return current;
        }
    };

    H.isMobile = function(mobile) {
        var myreg = /^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/, 
            zuoji = /^0\d{2,3}-?\d{7,8}$/;
        return myreg.test(mobile) || zuoji.test(mobile);
    };

    H.isEmail = function(email) {
        var myreg = /^[^\[\]\(\)\\<>:;,@.]+[^\[\]\(\)\\<>:;,@]*@[a-z0-9A-Z]+(([.]?[a-z0-9A-Z]+)*[-]*)*[.]([a-z0-9A-Z]+[-]*)+$/g;
        return myreg.test(email);
    };

    H.priceSwitch = function(price) {
        var money = (price || price==0) ? price/100 : -1;
        return money;
    };

    H.isPhone = function(phone) {
        var myreg = /^1[0-9]{10}$/;
        return myreg.test(phone);
    };

    H.getSingleton = function(fn) {
        var result;
        return function() {
            if (!arguments[0]) {
                result = null;
                return;
            }
            return result || (result = fn.apply(this,arguments));
        }
    };

    // 对钱的转换
    H.transferMoney = function(money){
        let m = '0.00';

        if(money){
            m = (money/100).toFixed(2);
        }

        return m;
    };

    //对时间进行处理;
    H.time = {
        //将指定的日期格式转换为时间戳,如：2016-09-07 12:06:11;
        timeStamp: function(dateStr){
            if(!dateStr) return {};
            var date = typeof dateStr === 'string' ? Date.parse(dateStr.replace(/-/gi,"/")) : dateStr;
            var dd = new Date(date);
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();
            return {
                stamp: date,  //时间戳;
                year: y,   //年;
                month: m,  //月;
                day: d,  //日;
                date: y+"年"+m+"月"+d+"日"  //年月日;
            };
        },
        count: function(AddDayCount) { //获取n天后的日期;
            var dd = new Date();
            dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期;
            var y = dd.getFullYear();
            var m = dd.getMonth()+1;//获取当前月份的日期
            var d = dd.getDate();
            return {
                "time1":y+"-"+m+"-"+d,
                "time2":m+"月"+d+"日",
                "time3":dd.getTime()
            };
        }
    };

    H.getToday = function () {

        var date = new Date(),
            year = date.getFullYear(),
            month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):(date.getMonth()+1),
            day = date.getDate()<10?'0'+date.getDate():date.getDate();

        return year+'-'+month+'-'+day;
    };

    /**
     *  dialog
     *
     */
    (function() {
        var defaults = {
                title: '提示信息',
                content: '',
                autoClose: true,
                cancel: false,
                cancelText: '取消',
                cancelCallback: function() {},
                okText: '确定',
                okCallback: function() {}
            };
        var Modal = function(options){
            if (H.isString(options)) {
                options = {content: options,};
            }
            // this.settings = Object.assign({},defaults,options||{});    
            this.settings = $.extend({},defaults,options||{});    
            this.init();
        };

        Modal.method('init',function(){
            this.render();      
        });

        Modal.method('render',function(){
            var $body = $('body'),
                _this = this;

            $body.append(this.createDom());
            
            $body.on('touchstart', '.dialog_cancel', function(e) {
                e.preventDefault();
                _this.settings.cancelCallback && _this.settings.cancelCallback();
                if (_this.settings.autoClose) _this.destroy();
            });

            $body.on('touchstart','.dialog_confirm', function(e){
                e.preventDefault();
                _this.settings.okCallback && _this.settings.okCallback();
                if (_this.settings.autoClose) _this.destroy();
            });

        });

        Modal.method('createDom',function(){
            var settings = this.settings,
                dom = '<div class="dialog-mask" id="dialog">' +
                        '<div class="dialog-content animated zoomIn">' +
                           '<div class="dialog-head"><strong class="dialog-title">' + settings.title + '</strong></div>' +
                            '<div class="dialog-body">' + settings.content + '</div>' +
                            '<div class="dialog-btn-group">' +
                                '<div class="btn_dialog dialog_cancel" style="display: '+ (settings.cancel ? 'block' : 'none')  +'">'+ settings.cancelText +'</div>' +
                                '<div class="btn_dialog dialog_confirm">' + settings.okText +'</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
            return dom;
        });

        Modal.method('destroy',function(){
            // webkitTransitionEnd 要事先检测是否要添加前缀，本来要应该通过mordernizr来检测，现在两个都写上
            // $('.dialog-mask').hide();
            // $('.dialog-content').removeClass('zoomIn').one('transitionend webkitTransitionEnd oTransitionEnd otransitionend', function(){
            //     $('.dialog-warp').remove();
            // });

			// 注意注意
            $('body').off('touchstart');
            $('.dialog-content').animate({bottom: '-100%'}, 400, function () {
                $('.dialog-mask').delay(500).remove();
                // 初始化单例代理
                dialog(false);
            });
        });

        Modal.method('reRender',function(settings){
            if (H.isString(settings)) {
                var settings = {content: settings,autoClose: true};
            }
            // this.settings = Object.assign({}, defaults, settings || {});
            this.settings = $.extend({},defaults,settings||{});    
            var dom = this.createDom();
            $('#dialog').remove();
            // $('body')
            //     .append(dom)
            //     .find('.dialog-content')
            //     .show()
            //     .addClass('zoomIn');
            $('body').append(dom);
        });

        var dialog = H.getSingleton(function(){
            var options = arguments[0];
            // 这个匿名函数必须要有返回值。
            return new Modal(options);
        });

        H.dialog = function(options) {
            return dialog(options);
        };

    })(H);

    H.we_loading = (function(){

        function show(classname, text) {
            var html = '<div class="weui_loading">';
            for (var i=0 ; i<12 ; i++) {
                html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
            }
            html += '</div>';
            html += '<p class="weui_toast_content">'+(text || '数据加载中')+'</p>';
            var classname = classname || '',
                mask = $('<div class="weui_mask_transparent"></div>').appendTo(document.body),
                tpl = '<div class="weui_toast ' + classname + '">' + html + '</div>',
                dialog = $(tpl).appendTo(document.body);
            dialog.show().addClass('weui_toast_visible');
        }

        function showLoading(text){
            if($('.weui_toast').length > 0) {
                $('.weui_toast_content').html(text || '数据加载中');
                $('.weui_mask_transparent').show();
                $('.weui_toast').addClass('weui_toast_visible');
            }else {
                show('weui_loading_toast', text);
            }
        }

        function hideLoading(){   //隐藏loading
            $('.weui_mask_transparent').hide();
            $('.weui_toast').removeClass('weui_toast_visible');
        }

        function timeout(load) {   //延时loading;
            if(!load) {
                showLoading('当前访问人数过多，正在排队处理中，请稍候…');
            }
        }

        return {
            show: showLoading,
            hide: hideLoading,
            timeout: timeout
        }

    })();

    H.allKeys = function(obj) {
        if (!H.isObject) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    };

    H.picker = function(string, title) {
        var str = '<div id="picker_mask" class="picker-mask"></div>'+
            '<div class="region-picker-wrapper visibility-control" id="region-picker" >'+
            '<div class="header"><div class="bar bar-header"><div id="picker_title" class="picker-title flex-num1">' +
            title + '</div>'+
            '<button class="button button-clear button-positive" id="selectClear">取消</button>'+
            '<button class="button button-clear button-positive" id="selectFinish">完成</button>'+
            '</div></div><div id="picker_body" class="body">'+ string +
            '</div></div>';
        $('#picker_container').html(str);
    };

    H.operationState = function(text, time) {
        var str = '<div id="operation_state" style="display: none;position: fixed;z-index: 2002;bottom: 20%;padding: 8px 15px;' +
            'background-color: rgba(0, 0, 0, 0.8); color: #fff; font-size: 14px;border-radius: 5px;-webkit-border-radius: 5px;left: 50%;-webkit-transform: translateX(-50%);' +
            'transform: translateX(-50%);transform: -webkit-translateX(-50%);-webkit-transition: opacity .2s linear;transition: opacity .2s linear;"></div>';
        if($('#operation_state').length <= 0) {
            $('body').append(str);
        }
        var wrap = $('#operation_state'),
            time = time ? time : 1000;
        if(wrap.html()) {
            return;
        }
        wrap.html(text);
        wrap.show();
        setTimeout(function() {
            wrap.css('opacity', '0').on('webkitTransitionEnd', function() {
                wrap.hide();
                wrap.css('opacity', '1');
                wrap.html('');
            });
        }, time);
    };

    H.countdown = function(options) {
        /*
        * options参数说明;
        * start: 开始时间，
        * end: 结束时间，
        * format: 时间之前加什么符号;默认为' : ' 带两个空格分开的;
         * callback：回调，显示到页面上*/

        this.start = options.start ? H.time.timeStamp(options.start).stamp : new Date().getTime();  //服务器时间的时间戳;
        this.end = options.end ? H.time.timeStamp(options.end).stamp : new Date().getTime();   //结束时间的时间戳;
        this.startTime = new Date().getTime();  //本地开始时间的时间戳
        this.secondsCount = (this.end - this.start)/1000;
        this.interval = null;
        this.updateCallback = options.callback || function(){};   //更新view的回调;
        this.format = options.format || ' : ';
        var _this = this;

        function run() {
            var newTime = new Date().getTime(),  //本地当前时间的时间戳
                time = _this.secondsCount - Math.floor((newTime - _this.startTime)/1000),
                hours = parseInt(time/3600),
                minutes = parseInt((time%3600)/60),
                seconds = parseInt((time%60));
            var str = '';
            if(time <= 0) {
                clearInterval(_this.interval);
                str = '00'+_this.format+'00'+_this.format+'00';
            }else {
                str = (hours < 10 ? '0' + hours : hours) + _this.format + (minutes < 10 ? '0' + minutes : minutes) + _this.format + (seconds < 10 ? '0' + seconds : seconds);
            }
            _this.updateCallback(str, time);
        }
        this.interval = setInterval(run, 200);
    };

    // toast
    H.toast = function (text) {
        var toast = document.createElement('div');
        toast.innerHTML = text;
        toast.setAttribute('style', 'transition: opacity .3s linear; position: fixed; padding: 10px; background: rgba(0, 0, 0, .7); bottom: 30%; left: 50%; transform: translate(-50%, 0); z-index: 500; color: #ffffff; opacity: 0; font-size: 12px;min-width: 80px;text-align:center; border-radius: 10px');

        document.getElementById('app').appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = '1';
            setTimeout(function () {
                toast.style.opacity = '0';
                setTimeout(function () {
                    document.getElementById('app').removeChild(toast);
                }, 300);
            }, 3000);
        }, 300);
    };

    //cookie;
    H.cookie = (function() {
        function setCookie(name,value) {
            var exp = new Date();
            exp.setTime(exp.getTime() + 10*60*1000);
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
        }

        function getCookie(name)
        {
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }
        return {
            setCookie: setCookie,
            getCookie: getCookie
        }
    })();

    // 将Number转换成钱的格式
    H.formatMoney = function(number, places, symbol, thousand, decimal) {
        number = number || 0;
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "$";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    };

    // 设置Input光标位置
    H.setInputPosition = function (obj, spos){
        var tobj = document.getElementById(obj);
        if(spos<0)
            spos = tobj.value.length;
        if(tobj.setSelectionRange){ //兼容火狐,谷歌
            setTimeout(function(){
                    tobj.setSelectionRange(spos, spos);
                    tobj.focus();}
                ,0);
        }else if(tobj.createTextRange){ //兼容IE
            var rng = tobj.createTextRange();
            rng.move('character', spos);
            rng.select();
        }
    };

    // 加载动画
    H.loading = (function(){
        function show(classname, text) {
            var html = '<div class="weui_loading">';
            for (var i=0 ; i<12 ; i++) {
                html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
            }
            html += '</div>';
            html += '<p class="weui_toast_content">'+(text || '数据加载中')+'</p>';
            var classname = classname || '',
                mask = $('<div class="weui_mask_transparent"></div>').appendTo(document.body),
                tpl = '<div class="weui_toast ' + classname + '">' + html + '</div>',
                dialog = $(tpl).appendTo(document.body);
            dialog.show().addClass('weui_toast_visible');
        }

        function showLoading(text){
            if($('.weui_toast').length > 0) {
                $('.weui_toast_content').html(text || '数据加载中');
                $('.weui_mask_transparent').show();
                $('.weui_toast').addClass('weui_toast_visible');
            }else {
                show('weui_loading_toast', text);
            }
        }

        function hideLoading(){   //隐藏loading
            $('.weui_mask_transparent').hide();
            $('.weui_toast').removeClass('weui_toast_visible');
        }

        function timeout(load) {   //延时loading;
            if(!load) {
                showLoading('当前访问人数过多，正在排队处理中，请稍候…');
            }
        }

        return {
            show: showLoading,
            hide: hideLoading,
            timeout: timeout
        }

    })();

    // 创建滚动
    H.scroll = function (element, callback) {
        var SCROLL = new IScroll(element, {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        });

        callback(SCROLL);
    };

    H.weSign = function(apiList, fn) {
        //先获取微信授权的配置数据;
        $.ajax({
            type: 'POST',
            url: 'index.php?m=FrontPublic&c=WeSdk&a=js_sdk_signature',
            data: 'signPageUrl='+encodeURIComponent(location.href),
            success: function(msg){
                var signData = JSON.parse(msg);
                var signInfo = signData.signPackage,
                    wx_config = {
                        debug: false,
                        appId: signInfo.appId,
                        timestamp: signInfo.timestamp,
                        nonceStr: signInfo.nonceStr,
                        signature: signInfo.signature,
                        jsApiList: apiList
                    };
                wx.config(wx_config);
                wx.ready(function() {
                    fn && fn();
                });
            }
        });
    };

    //OSS图片的大小;
    H.imgSize = function() {
        var domain = H.localhost;
        if(!domain) return '';
        //如果是本地环境，不用图片压缩参数，否则无法显示;
        if(domain.indexOf('192.168.') == -1) {
            return {
                110: '@110w_90Q.jpg',
                150: '@150w_90Q.jpg',
                450: '@450w_90Q.jpg',
                640: '@640w_100Q.jpg'
            }
        }else {
            return {
                110: '',
                450: '',
                640: ''
            }
        }
    };

    H.urlParam = function(name, url) {
        var href = url ? url : window.location.search.substr(1);
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = href.match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    };
    H.hashParam = function(name, url) {
        var href = url ? url : window.location.search.substr(1);
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = href.match(reg);
        if(r!=null) {
            if(r[2]) return decodeURIComponent(r[2]); return null;
        }
    };

    //可用的CDN域名;
    H.localhost = H.cookie.getCookie('domain');

    H.getCdn = function () {
        if(location.hostname.indexOf('192.168') == -1){
            return 'http://img.idongpin.com/';
        }else {
            return '';
        }
    };

    H.browser = {
        versions:function(){
            var u = navigator.userAgent;
            //var app = navigator.appVersion;
            return {
                //移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        }(),
        language:(navigator.browserLanguage || navigator.language).toLowerCase()
    };

    window.H = H;
}));

