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

    H.allKeys = function(obj) {
        if (!H.isObject) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    };

    H.sheet = function(obj) {
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
    };

    H.hideSheet = function() {
        $('#actionSheet_wrap').removeClass('show');
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

    // if ( typeof noGlobal === strundefined ){
        window.H = H;
    // }
}));

