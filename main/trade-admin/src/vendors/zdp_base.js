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
     * array foreach
     */
    if ( !Array.prototype.forEach ) {
        Array.prototype.forEach = function forEach( callback, thisArg ) {
            var T,K;
            if ( this == null ) {
                throw new TypeError( "this is null or not defined" );
            }

            var O = Object(this);
            var len = O.length >>> 0;

            if ( typeof callback !== "function" ) {
                throw new TypeError( callback + "is not a function" );
            }
            if ( arguments.length > 1 ) {

                T = thisArg;
            }
            K = 0;
            while ( K < len ) {
                var kValue;
                if (K in O) {
                    kValue = O[K];
                    callback.call( T,kValue,K,O );
                }
                K++;
            }
        }
    }
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

    H.getId = function (id) {
        return document.getElementById(id);
    };

    H.getClass = function(classes){
        return document.getElementsByClassName(classes);
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

    H.addClass = function(el,value){
        var classes, elem, cur, clazz, j,finalValue,
            i = 0,
            len = el.length || 1;

        if ( H.isFunction( value ) ) {
            value = value.call(this,el.className);
        }

        var proceed = typeof value === "string" && value;
        if ( proceed ) {
            classes = ( value || "" ).match( rnotwhite ) || [];

            for ( ; i < len ; i++ ) {
                elem = el[i] || el ;
                cur = elem.nodeType === 1 && ( elem.className ?
                        ( " " + elem.className + " " ).replace( rclass," " ) : " ");
                if ( cur ) {
                    j = 0;
                    while ( clazz = classes[j++] ) {
                        //如果添加的class在当前class中不存在则添加
                        if ( cur.indexOf(" " + clazz + " ") < 0 ) {
                            cur += clazz + " ";
                        }
                    }
                    finalValue = cur.trim();
                    if ( elem.className !== finalValue ) {
                        elem.className = finalValue;
                    }
                }
            }
        }
        return this;
    };

    H.removeClass = function(el,value){
        var classes, elem, cur, clazz, j, finalValue,
            i = 0,
            len = el.length || 1;

        if (H.isFunction( value ) ) {
            value = value.call( this, el.className );
        }

        var proceed = typeof value === "undefined" || typeof value === "string" && value;
        if ( proceed ) {
            classes = ( value || "" ).match( rnotwhite ) || [];

            for ( ; i < len ; i++) {
                elem = el[i] || el ;
                cur = elem.nodeType === 1 && ( elem.className ?
                    ( " " + elem.className + " " ).replace( rclass," " ) : ""
                );

                if ( cur ) {
                    j = 0;
                    while ( (clazz = classes[j++]) ) {
                        while ( cur.indexOf( " " + clazz + " ") >= 0 ) {
                            cur = cur.replace( " " + clazz + " ", " " );
                        }
                    }

                    finalValue = value ? cur.trim() : "";
                    if ( elem.className !== finalValue ) {
                        elem.className = finalValue;
                    }
                }
            }
        }
        return this;
    };

    H.GetDateStr = function(AddDayCount) { //获取n天后的日期;
        let num = AddDayCount || 0;
        var dd = new Date();
        dd.setDate(dd.getDate()+num);//获取AddDayCount天后的日期;
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        m = m <10 ? '0' + m : m;
        d = d <10 ? '0' + d : d;
        var obj = {
            "time1":y+"-"+m+"-"+d,
            "time2":m+"月"+d+"日",
            "time3":dd.getTime()
        };
        return obj;
    };

    //弹出框
    H.Modal = (function () {
        //单例
        var instance = null;
        //定义dialog对象
        var D = function(option){
            this.settings = {};
            this.init(option);
        };
        //定义dialog的方法
        D.method('init',function(option){
            //如果已存在弹窗实例则返回，原则上同一页面只能有一个弹窗。
            if ( instance ) return;
                instance = this;
            var _this = this,
                defaults = {
                    width: '350',               // 弹窗的宽 （String|Numbwer）
                    height: '500',              // 弹窗的高 （String|Number）
                    title: '提示',           // 标题 （String）
                    titlePostion: 'center',     // 标题是否剧中 （String）
                    content: '',                // 内容 （String）
                    autoClose: true,            // 点击确认或者取消按钮时是否默认关闭弹窗 (Boolean)
                    closeBtn: true,            // 是否显示右上角关闭按钮（Boolean）
                    closeCallback: null,        // 右上角关闭按钮点击回调 （Funcution）
                    cancel: false,              // 是否显示底部取消按钮  （Boolean）
                    cancelCallback: null,       // 取消按钮点击回调  （Function）
                    cancelText: "关闭",         // 取消按钮文案 (String)
                    ok: true,                   // 是否显示确定按钮（Boolean）
                    okText: "确定",              // 确定按钮文案  （String）
                    okCallback: null,           // 确定按钮回调 (Function)
                    maskClose: false            // 点击遮罩层是否关闭弹窗 （Boolean）
                };
            if (H.isString(option)) {
                option = {content:option};
            }

            this.settings = $.extend(true, defaults, option || {});
            this.render(this.settings);
        });
        D.method('render',function(settings){
            var _this = this,
                $dialogBody = null;
            //创建dom
            this.createDom(settings);
            //绑定事件

            $dialogBody = $('.modal-body');

            $dialogBody.on('click','.modal-close',function(event) {
                settings.closeCallback && settings.closeCallback(_this.destroy,$('#modal-content'));
                _this.destroy();
            });

            $dialogBody.on('click','.modal-ok',function(event) {
                settings.okCallback && settings.okCallback(_this.destroy,$('#modal-content'),{hideOkBtn:_this.hideOkBtn,showCancelBtn:_this.showCancelBtn.bind(_this)});
                if (!_this.settings.autoClose) return;
                _this.destroy();
            });

            $dialogBody.on('click','.modal-cancel',function(event) {
                settings.cancelCallback && settings.cancelCallback(_this.destroy,$('#modal-content'));
                if (!_this.settings.autoClose) return;
                _this.destroy();
            });

            $('body').on('click','#modal-mask',function(){
                if (settings.maskClose) {
                    if (!_this.settings.autoClose) return;
                    _this.destroy();
                }
            });
        });
        D.method('createDom',function(settings){
            var color = '#28bb7f';
            var mask = '<div class="modal-mask" id="modal-mask" style="position: fixed;width: 100%;height: 100%;top: 0; left: 0;z-index: 1000;background: rgba(0,0,0,0.4);"></div>',
                dialogDom = '<div id="modal-body" class="modal-body" style="position: fixed;padding-bottom: 20px;width: '+settings.width+'px;max-height: '+settings.height+'px;top: 50%;left: 50%;-webkit-transform: translate(-50%,-50%);transform: translate(-50%,-50%);overflow: hidden;background: #fff;z-index: 1001;">'+
                    '<h4 class="modal-title" style="position: relative;margin: 0;padding-left: 20px;border-top: 4px solid '+color+';line-height: 42px;font-size: 14px;border-bottom: 1px solid #d0d0d0;">'+settings.title+
                    '<i id="modal-close" class="modal-close" style="display: '+ (settings.closeBtn ? 'inline-block' : 'none') +';position: absolute;top: 5px;right: 10px;line-height: 25px;font-style: normal;font-size: 25px;transform: scaleX(1.4);-webkit-transform: scaleX(1.4);cursor: pointer;color: #ccc;">x</i></h4>'+
                    '<div class="modal-content" id="modal-content" style="width: 96%;padding: 20px;color: #666;overflow: auto;word-break: break-all;">'+settings.content+'</div>'+
                    '<div class="modal-btn-group" style="text-align: center; padding: 0;">'+
                    '<button id="modal-ok" class="modal-ok btn btn-warning" style="display: '+(settings.ok?'inline-block':'none')+';width: 106px;height: 32px;border: 1px solid '+color+';margin: 0 5px; margin: 0 20px; font-size: 14px; color:#fff;background-color: '+color+'">'+settings.okText+'</button>'+
                    '<button id="modal-cancel" class="modal-cancel btn btn-warning" style="display: '+(settings.cancel?'inline-block':'none')+'; width: 106px;height: 32px;border: 1px solid '+color+'; margin: 0 5px; margin: 0 20px; font-size: 14px; color: '+color+';background-color: #fff;">'+settings.cancelText+'</button>'+
                    '</div>'+
            '</div>';
            //append到页面
            $('body')
                .append(mask)
                .append(dialogDom);
            // setTimeout(function(){
            //     $('#modal-body').css({
            //         'width': settings.width,
            //         'height': settings.height,
            //         'marginTop': '-' + settings.height/2 +'px',
            //         'marginLeft': '-' + settings.width/2 +'px'
            //     });
            // },100);
        });
        D.method('destroy',function(){
	    // 用class来销毁弹窗，因为页面进入时可能会同时进行多个请求，从而可能会出现多个弹窗，此时页面上有多个‘#modal-body’，用id删除会出错。
            $('.modal-body, .modal-close, .modal-ok, .modal-cancel').off();
            $('.modal-mask').remove();
            $('.modal-body').remove();
            instance = null;
        });

        D.method('hideOkBtn',function() {
            $('.modal-ok').hide();
        });

        D.method('showCancelBtn',function() {
            this.settings.autoClose = true;
            $('.modal-cancel').show();
        });

        return function(option) {
            if (!option) throw 'error: 没有传参数。';
            return new D(option);
        };
    })();

    H.isPhone = function(phone) {
        var myreg = /^1[0-9]{10}$/;
        return myreg.test(phone);
    };

    H.isEmail = function(email) {
        var myreg = /^[^\[\]\(\)\\<>:;,@.]+[^\[\]\(\)\\<>:;,@]*@[a-z0-9A-Z]+(([.]?[a-z0-9A-Z]+)*[-]*)*[.]([a-z0-9A-Z]+[-]*)+$/g;
        return myreg.test(email);
    };

    H.priceSwitch = function(price) {
        var money = (price || price==0) ? price/100 : 0;
        return money;
    };

    //验证输入的必须是数字
    H.isNumber = function(num) {
        var myreg = /^(-)?\d+(\.\d+)?$/;
        return myreg.test(num);
    };

    H.Date = (function(){
        var DateObj = new Date;
        return {
            getFullYear: function () {
                return DateObj.getFullYear();
            },
            getMonth: function () {
                // month 返回值的范围为(0~11)，所以最终返回的时候要加1才能显示正确的月份
                var month = DateObj.getMonth();
                if ( month < 10 ) {
                    month = '0' + (month + 1);
                }
                return month;
            },
            getCodeMonth: function () {
                // month 返回值的范围为(0~11)，所以最终返回的时候要加1才能显示正确的月份
                return DateObj.getMonth() + 1;
            },
            getDate: function () {
                var date = DateObj.getDate();
                if ( date < 10 ) {
                    date = '0' + date;
                }
                return date;
            },
            getCodeDate: function () {
                return DateObj.getDate();
            }

        }
    })();

    H.getSouroundDate = function (rangeNum) {
        var codedate = H.Date.getCodeDate(),
            codemonth = H.Date.getCodeMonth(),
            year = H.Date.getFullYear(),
            month = H.Date.getMonth(),
            sourroundDate = Number(codedate) - Math.min(rangeNum,14);

        if (sourroundDate >= 10 ) {
            return year + '-' + month + '-' + sourroundDate;
        } else if (sourroundDate < 10 && sourroundDate > 0) {
            return year + '-' + month + '-' + '0' + sourroundDate;
        } else if (sourroundDate <= 0) {

            codemonth = codemonth - 1;
            // 取浮动天数的绝对值
            sourroundDate = Math.abs(sourroundDate);

            if ( codemonth = 0 ) {
                // 如果浮动日期要跨年，则默认为今年的1月1号
                return year + '-' + '01-01';

            } else if ( codemonth = 2 ) {
                // 如果是浮动到2月则从29开始减
                sourroundDate = 29 - sourroundDate;
                return year + '-' + '0' + codemonth + '-' + sourroundDate;

            } else if ( (codemonth%2 === 1) && codemonth < 8 ) {
                // 如果是浮动的单月并且是在8月前，则该月有31天
                sourroundDate = 31 - sourroundDate;
                return year + '-' + '0' + codemonth + '-' + sourroundDate;

            } else if ( (codemonth%2 === 1) && codemonth > 8 ) {
                // 如果是浮动的单月并且是在8月后，则该月有30天
                sourroundDate = 30 - sourroundDate;
                if ( codemonth === 9 ) {
                    // 如果是9月
                    return year + '-' + '0' + codemonth + '-' + sourroundDate;
                } else {
                    // 如果是11月
                    return year + '-' + codemonth + '-' + sourroundDate;
                }

            } else if ( (codemonth%2 === 0) && codemonth < 8 ) {
                // 如果是浮动的双数月且在8月前，则该月有30天
                sourroundDate = 30 - sourroundDate;
                return year + '-' + '0' + codemonth + '-' + sourroundDate;

            } else if ( (codemonth%2 === 0) && codemonth >= 8 ) {
                // 如果是浮动的双月且大于等于8月，则该月有31天
                sourroundDate = 31 - sourroundDate;
                if (codemonth === 8) {
                    // 如果是8月
                    return year + '-' + '0' + codemonth + '-' + sourroundDate;
                } else {
                    // 如果是10月
                    return year + '-' + codemonth + '-' + sourroundDate;
                }
            }

        }
    };

    //请求接口的loading;
    H.we_loading = (function(){

        function show(classname, text) {
            var html = '<div class="data-loading">';
            for (var i=0 ; i<12 ; i++) {
                html += '<div class="data-loading-leaf data-loading-leaf-' + i + '"></div>';
            }
            html += '</div>';
            html += '<p class="data-toast-content">'+(text || '数据加载中')+'</p>';
            var classname = classname || '',
                mask = $('<div class="data-mask-transparent"></div>').appendTo(document.body),
                tpl = '<div class="data-toast ' + classname + '">' + html + '</div>',
                dialog = $(tpl).appendTo(document.body);
            dialog.show().addClass('data-toast-visible');
        }

        function showLoading(text){
            if($('.data-toast').length > 0) {
                $('.data-toast-content').html(text || '数据加载中');
                $('.data-mask-transparent').show();
                $('.data-toast').addClass('data-toast-visible');
            }else {
                show('data-loading-toast', text);
            }
        }

        function hideLoading(){
            $('.data-mask-transparent').hide();
            $('.data-toast').hide();
        }

        return {
            show: showLoading,
            hide: hideLoading
        }

    })();

    //登录过期;
    H.overdue = function() {
        this.Modal({
            content: '登录已过期，请重新登录',
            okCallback: function() {
                window.location.href = '/';
            }
        });
    };

    // if ( typeof noGlobal === strundefined ){
    //     window.H = H;
    // }
    window.H = H;
}));

