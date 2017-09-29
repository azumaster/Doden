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
    //my lib's here    
    /**
     * functon method added
     */
    Function.prototype.method = function(name,fn){
        this.prototype[name] = fn;
        return this;
    };
    
    /**
     * string trim
     *
     */
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
            if(m < 10) m = '0'+m;
            if(d < 10) d = '0'+d;
            return {
                year: y,   //年;
                month: m,  //月;
                day: d,  //日;
                "time1":y+"-"+m+"-"+d,
                "time2":m+"月"+d+"日",
                "time3":dd.getTime()
            };
        },
        appoint: function(paramTime) {    //根据传过来的截止时刻;返回一个时间（当天还是明天）;
            var dd = new Date(),
                time = dd.getTime(),    //当前时间的时间戳;
                y = dd.getFullYear(),
                m = dd.getMonth()+1,    //获取当前月份的日期
                d = dd.getDate();
            if(m < 10) m = '0'+m;
            if(d < 10) d = '0'+d;
            var thatTime = dd.getFullYear()+'-'+m+'-'+d+' '+paramTime;
            if(time > new Date(thatTime).getTime()) {
                var newDate = new Date(time + 24*60*60*1000);
                var mmm = newDate.getMonth()+1;
                var ddd = newDate.getDate();
                if(mmm < 10) mmm = '0'+mmm;
                if(ddd < 10) ddd = '0'+ddd;
                return newDate.getFullYear()+'-'+mmm+'-'+ddd+' '+paramTime;
            }else {
                return thatTime;
            }
        }
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
            };
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
            
            // $body
            //     .append(this.createDom())
            //     .find('.dialog-content')
            //     .show()
            //     .addClass('zoomIn');

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
                dom = '<div class="dialog-warp" id="dialog">' +
                        '<div class="dialog-mask"></div>' +
                        '<div class="dialog-content animated zoomIn">' +
                           '<div class="dialog-head"><strong class="dialog-title">' + settings.title + '</strong></div>' +
                            '<div class="dialog-body">' + settings.content + '</div>' +
                            '<div class="dialog-btn-group">' +
                                '<a href="javascript:;" class="weui_btn_dialog dialog_cancel" style="display: '+ (settings.cancel ? 'block' : 'none')  +'">'+settings.cancelText+'</a>' +
                                '<a href="javascript:;" class="weui_btn_dialog dialog_confirm">'+settings.okText+'</a>' +
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
            $('.dialog-warp').remove();
            // 初始化单例代理
            dialog(false);
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

    H.sheet = (function() {
        function create(obj) {
            //obj = {
            // style: 1                    //风格;
            // title: ''                   //标题，必填;
            // content: html字符串          //内容部分, 必填;
            // cancel: ''                  //关闭按钮名，可选，
            // cancelCallback:  fn         //关闭回调，可选，
            // confirm: ''                 //确认按钮名，可选，
            // confirmCallback: fn         //确认的回调，可选
            // };
            var wrapBg = '', padding = '';
            switch (obj.style) {
                case 1:
                    wrapBg = 'style="background-color: #f0eff5;"';
                    padding = 'style="padding: 0"';
                    break;
            }
            var str = '<div class="mask_transition fade_toggle" id="mask"></div>'+
                '<div class="actionsheet actionsheet_toggle" id="actionsheet" '+wrapBg+'>'+
                '<div class="actionsheet_menu" '+padding+'>'+
                '<div class="actionsheet_cell sheet-title read-only">'+
                '<span class="actionsheet_title">'+obj.title+'</span></div><div id="actionsheet_content">'+obj.content+'</div></div>'+
                '<div id="sheet-btn" class="actionsheet_action flex-box"><div class="sheet-btn cancel" id="actionsheet_cancel">'+(obj.cancel ? obj.cancel : '取消')+'</div>'+
                '<div class="sheet-btn confirm" id="actionsheet_confirm">'+(obj.confirm ? obj.confirm : '保存')+'</div></div></div>';


            if($('#actionSheet_wrap').length <= 0) {
                $('body').append('<div id="actionSheet_wrap"></div>');
            }
            $('#actionSheet_wrap').html(str);
            var cancel = $('#actionsheet_cancel'),
                confirm = $('#actionsheet_confirm'),
                wrap = $('#actionSheet_wrap');
            setTimeout(function() {
                wrap.addClass('show');
            }, 50);

            if(obj.cancel) {
                cancel.unbind('click');
                cancel.bind('click', function(){
                    wrap.removeClass('show');
                    obj.cancelCallback && obj.cancelCallback();
                });
            }else {
                cancel.hide();
            }
            confirm.unbind('click');
            confirm.bind('click', function() {
                if(obj.confirmCallback) {
                    obj.confirmCallback();
                }else {
                    wrap.removeClass('show');
                }
            });
        }

        //隐藏
        function hide() {
            $('#actionSheet_wrap').removeClass('show');
        }

        //访客用户操作时提示去注册的弹窗;
        function promptLogin() {
            create({
                title: '免费注册',
                content: '<div class="actionsheet_cell read-only">' +
                '<div class="actionsheet_item center"><p style="margin: 30px 0;text-align: center;width: 100%;">请先注册成找冻品网会员再操作</p></div>'+
                '</div>',
                cancel: '关闭',
                confirm: '免费注册',
                confirmCallback: function() {
                    window.location.href = 'index.php?m=PublicTemplate&c=ApiPublic&a=regIndex';
                }
            });
        }

        /*
        * 添加到购物车
        * */
        function addCar(options, fn) {
            var isBuy = options.disable ? 'disabled' : '';
            var inventory = options.tag == 2 ? options.goods_inventory : 10000;
            create({
                title: '加入购物车',
                content: '<div class="actionsheet_cell read-only">' +
                '<div class="actionsheet_item center">'+options.goods_name+'</div>'+
                '<div class="actionsheet_item center">'+options.goods_price+'元/'+options.goods_unit+'</div>'+
                '<div class="actionsheet_item center"><span class="label" style="width: 3em;">数量</span><div class="flex-num1"><div class="flex-box">' +
                '<div class="input"><input id="add_car_goods_num" '+isBuy+' type="number" pattern="[0-9]*" value="'+options.goods_start_num+'" class="input-item" style="width: 80px;text-align: center;padding-right: 10px;" />件</div></div></div></div>'+
                '<div class="actionsheet_item center" style="color: #888;">'+
                (options.disable ? '每个用户只能购买'+options.goods_start_num+'件' : options.goods_start_num+'件起售，最多购买'+ inventory +'件')+'</div>'+
                '</div>',
                cancel: '关闭',
                confirm: '加入购物车',
                confirmCallback: function() {
                    var param = {
                        goods_id: options.goods_id,
                        goods_tag: options.tag,
                        buy_number: $('#add_car_goods_num').val()
                    };
                    H.server.addGoodsToShopCart(param, function(res) {
                        if(res.code == 0) {
                            fn();
                            hide();
                            H.operationState('成功加入购物车');
                        }else {
                            H.operationState(res.message);
                        }
                    });
                }
            });
        }

        /*咨询的弹窗口;
        * options参数说明:
        * */
        function consulting(options) {
            create({
                title: '咨询台',
                content: '<div class="actionsheet_cell read-only">' +
                '<div class="actionsheet_item center">在线客服：平台交易员</div>'+
                '<div class="actionsheet_item center">售后服务：由'+' “'+options.seller_name+'('+options.market+')'+'” 提供</div>'+
                '<div class="actionsheet_item center" style="color: #888;">电话咨询后，立即在线下单，就有机会获得200钻石</div>'+
                '</div>',
                cancel: '关闭',
                confirm: '拨打',
                confirmCallback: function() {
                    window.location.href = 'tel:'+options.tel;
                }
            });
        }

        return {
            create: create,
            hide: hide,
            promptLogin: promptLogin,
            consulting: consulting,
            addCar: addCar
        }
    })();

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

    //OSS图片的大小;
    H.imgSize = function() {
        var domain = H.localhost;
        if(!domain) return '';
        //如果是本地环境，不用图片压缩参数，否则无法显示;
        if(domain.indexOf('192.168.') == -1) {
            return {
                110: '@110w_90Q.jpg',
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

    //拼接提货码;
    H.getExtractCode = function(codeArr) {
        var str = '';
        for(var i = 2 ; i < codeArr.length ; i++) {
            str+=codeArr[i]<10?'0'+codeArr[i]:codeArr[i];
        }
        return str;
    };

    //可用的CDN域名;
    H.localhost = H.cookie.getCookie('domain');

    // if ( typeof noGlobal === strundefined ){
        window.H = H;
    // }
}));

