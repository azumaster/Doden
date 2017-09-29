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
                            '<div class="dialog-content">' +
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

        function show(html,classname) {
            var classname = classname || '',
                mask = $('<div class="weui_mask_transparent"></div>').appendTo(document.body),
                tpl = '<div class="weui_toast ' + classname + '">' + html + '</div>',
                dialog = $(tpl).appendTo(document.body);
            dialog.show().addClass('weui_toast_visible');
        }

        function showLoading(text){
            var html = '<div class="weui_loading">';
            for (var i=0 ; i<12 ; i++) {
                html += '<div class="weui_loading_leaf weui_loading_leaf_' + i + '"></div>';
            }
            html += '</div>'; 
            html += '<p class="weui_toast_content">' + (text||"数据加载中") + '</p>';
            show(html,'weui_loading_toast');
        }

        function hideLoading(){
            $('.weui_mask_transparent').hide();
            $('.weui_toast_visible').removeClass('weui_toast_visible').on('webkitTransitionEnd',function(){
                $(this).remove();
            });
        }

        return {
            show: showLoading,
            hide: hideLoading
        }

    })();

    // if ( typeof noGlobal === strundefined ){
        window.H = H;
    // }
}));

