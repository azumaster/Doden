/**
 * Created by Hc on 2015/11/6.
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
               return ns(new_ns);
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
    //作用是什么呢
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

    H.getDateTimeStamp = function(dateStr){
        return Date.parse(dateStr.replace(/-/gi,"/"));
    };

    H.GetDateStr = function(AddDayCount) { //获取n天后的日期;
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期;
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        var obj = {
            "time1":y+"-"+m+"-"+d,
            "time2":m+"月"+d+"日",
            "time3":dd.getTime()
        };
        return obj;
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
                                '<a href="javascript:;" class="weui_btn_dialog default dialog_cancel" style="display: '+ (settings.cancel ? 'block' : 'none')  +'">取消</a>' +
                                '<a href="javascript:;" class="weui_btn_dialog primary dialog_confirm">确定</a>' +
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

        function hideLoading(){
            $('.weui_mask_transparent').hide();
            $('.weui_toast').removeClass('weui_toast_visible');
        }

        return {
            show: showLoading,
            hide: hideLoading
        }

    })();
    //所有的键值
    H.allKeys = function(obj) {
        if (!H.isObject) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    };

    H.sheet = (function() {
        function create(obj) {
            var str = '<div class="mask_transition fade_toggle" id="mask"></div>'+
                '<div class="actionsheet actionsheet_toggle" id="actionsheet">'+
                '<div class="actionsheet_menu">'+
                '<div class="actionsheet_cell sheet-title read-only">'+
                '<span id="actionsheet_title">请选择付款方式</span></div><div id="actionsheet_content"></div></div>'+
                '<div id="sheet-btn" class="actionsheet_action flex-box"><div class="sheet-btn cancel" id="actionsheet_cancel">关闭</div>'+
                '<div class="sheet-btn confirm" id="actionsheet_confirm">确认</div></div></div>';


            if($('#actionSheet_wrap').length <= 0) {
                $('body').append('<div id="actionSheet_wrap"></div>');
            }
            $('#actionSheet_wrap').html(str);
            var cancel = $('#actionsheet_cancel'),
                confirm = $('#actionsheet_confirm'),
                content = $('#actionsheet_content'),
                title = $('#actionsheet_title'),
                wrap = $('#actionSheet_wrap');
            setTimeout(function() {
                wrap.addClass('show');
            }, 50);

            if(obj.cancel) {
                cancel.html(obj.cancel);
                cancel.unbind('click');
                cancel.bind('click', function(){
                    wrap.removeClass('show');
                    obj.cancelCallback && obj.cancelCallback();
                });
            }else {
                cancel.hide();
            }
            confirm.html(obj.confirm ? obj.confirm : '保存');
            confirm.unbind('click');
            confirm.bind('click', function() {
                if(obj.confirmClose) wrap.removeClass('show');
                obj.confirmCallback && obj.confirmCallback();
            });
            content.html(obj.content);
            title.html(obj.title);
        }

        //隐藏
        function hide() {
            $('#actionSheet_wrap').removeClass('show');
        }

        //访客用户操作时提示去注册的弹窗;
        function promptLogin() {
            create({
                title: '加入购物车',
                content: '<div class="actionsheet_cell read-only">' +
                '<div class="actionsheet_item center"><p style="margin: 30px 0;text-align: center;width: 100%;">请先注册成找冻品网会员再操作</p></div>'+
                '</div>',
                cancel: '关闭',
                confirm: '免费注册',
                confirmCallback: () => {
                    window.location.href = 'tel:15208359521';
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
                confirmCallback: () => {
                    console.log(options.tel);
                    window.location.href = 'tel:'+options.tel;
                }
            });
        }

        return {
            create: create,
            hide: hide,
            promptLogin: promptLogin,
            consulting: consulting
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
        wrap.html(text);
        wrap.show();
        setTimeout(function() {
            wrap.css('opacity', '0').on('webkitTransitionEnd', function() {
                wrap.hide();
                wrap.css('opacity', '1');
            });
        }, time);
    };

    H.countdown = function(options) {
        this.start = options.start ? H.getDateTimeStamp(options.start) : new Date().getTime();
        this.end = options.end ? H.getDateTimeStamp(options.end) : new Date().getTime();
        this.startTime = new Date().getTime();
        this.secondsCount = (this.end - this.start)/1000;
        this.interval = null;
        this.updateCallback = options.callback || function(){};
        var _this = this;

        function run() {
            var newTime = new Date().getTime(),
                time = _this.secondsCount - Math.floor((newTime - _this.startTime)/1000),
                hours = parseInt(time/3600),
                minutes = parseInt((time%3600)/60),
                seconds = parseInt((time%60));
            var str = '';
            if(time <= 0) {
                clearInterval(_this.interval);
                str = '00 : 00 : 00';
            }else {
                str = (hours < 10 ? '0' + hours : hours) + ' : ' + (minutes < 10 ? '0' + minutes : minutes) + ' : ' + (seconds < 10 ? '0' + seconds : seconds);
            }
            _this.updateCallback(str);
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

    //焦点图;
    H.focusImg = function(options) {
        var box = $(options.box),
            ul = box.find('ul'),
            arr = ul.find('li'),
            numDom = $('#num'),
            brWidth = box.width(),
            startX, moveX,
            LEFT,
            flag = true;
        numDom.html('1/'+arr.length);
        ul.find('li').first().find('img').attr('src', ul.find('li').first().find('img').attr('data-url'));
        ul.find('li').first().attr('l', '1');
        box[0].addEventListener('touchstart', touchStart, false);
        box[0].addEventListener('touchmove', touchMove, false);
        box[0].addEventListener('touchend', touchEnd, false);

        function touchStart(e) {
            e.preventDefault();
            moveX=startX=e.targetTouches[0].clientX;

        }
        function touchMove(e) {
            e.preventDefault();
            moveX=e.touches[0].clientX;
            if(flag) {
                if(moveX-startX>0){  //右滑动;
                    flag=false;
                    setCss(-brWidth);
                    ul.find('li').last().insertBefore(ul.find('li').first());
                    LEFT=-brWidth;
                }else if(moveX-startX<0){  //左滑动;
                    flag=false;
                    LEFT=0;
                }
            }
            var moveNum=LEFT+(moveX-startX);
            setCss(moveNum);
        }
        function touchEnd(e) {
            box[0].removeEventListener('touchstart', touchStart, false);
            box[0].removeEventListener('touchmove', touchMove, false);
            box[0].removeEventListener('touchend', touchEnd, false);
            e.preventDefault();
            if(startX<moveX){  //向右滑动;
                if(Math.abs(moveX-startX)>50){  //滑动距离大于50时才变换;
                    setCss(0, 300);
                }else{
                    setCss(-brWidth, 200, function() {
                        ul.find('li').first().insertAfter(ul.find('li').last());
                        setCss(0);
                    });
                }
            }else{
                if(Math.abs(moveX-startX)>50){
                    setCss(-brWidth, 300, function() {
                        ul.find('li').first().insertAfter(ul.find('li').last());
                        setCss(0);
                    });
                }else{
                    setCss(0, 200);
                }
            }
            flag = true;
        }

        function setCss(num, time, fn) {
            var t = time ? time : 0,
                index = parseInt(ul.find('li').first().attr('data-index'))+1;
            numDom.html(index + '/' + arr.length);
            if(!ul.find('li').first().attr('l')){
                ul.find('li').first().find('img').attr('src', ul.find('li').first().find('img').attr('data-url'));
                ul.find('li').first().attr('l', '1');
            }
            ul.css({
                '-webkit-transform': 'translate3d('+num+'px, 0px, 0px)',
                'transform': 'translate3d('+num+'px, 0px, 0px)',
                '-webkit-transition': 'all '+t+'ms ease',
                'transition': 'all '+t+'ms ease'
            });
            if(t > 0) {
                setTimeout(function() {
                    fn && fn();
                    box[0].addEventListener('touchstart', touchStart, false);
                    box[0].addEventListener('touchmove', touchMove, false);
                    box[0].addEventListener('touchend', touchEnd, false);
                }, t);
            }
        }
    };

    //滑动加载图片;
    H.imgLoad = function(options) {
        var box = $(options.box),
            $img = box.find('.goods-img').find('img').not('.load'),
            imgTop,          //图片距离顶部高度
            wH = $(window).height();           //获得可视浏览器的高度;
        $img.each(function(){
            imgTop =  $(this).offset().top;
            if(imgTop < wH-60 && $(this).data('url') != $(this).attr('src')){         //判断是否在当前屏幕;
                $(this).attr({
                    src: $(this).data('url')
                });
                $(this).addClass('load');
            }
        });
    };

    //弹出分享层;
    H.share = function() {
        var str = '<div id="share_layer" style="position: fixed;left: 0; top: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7);z-index: 9;">' +
            '<img src="'+H.localhost+'Public/images/buyer-cli/share-img.png" width="100%"/></div>';

        $('body').append(str);
        $('#share_layer').bind('click', function() {
            $(this).remove();
        });
    };

    //商品默认图片;
    H.defaultImg = function() {
        let domain = H.localhost;
        return {
            1: domain + 'Public/images/buyer-cli/default-img.png',
            2: domain + 'Public/images/buyer-cli/default-img1.png'
        };
    };

    //可用的CDN域名;
    H.localhost = H.cookie.getCookie('domain');

    // if ( typeof noGlobal === strundefined ){
        window.H = H;
    // }
}));

