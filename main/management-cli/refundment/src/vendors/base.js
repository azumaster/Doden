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

    H.isNumber = function (obj) {
        return proUtils.type(obj) === 'number';
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
                    width: '260',
                    height: '240',
                    title: '提示信息',
                    titlePostion: 'center',
                    content: '',
                    autoClose: true,
                    closeBtn: false,
                    closeCallback: null,
                    cancel: false,
                    cancelCallback: null,
                    cancelText: "关闭",
                    ok: true,
                    okText: "确定",
                    okCallback: null,
                    maskClose: false,

                    initFunc: function(){}
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

            $dialogBody = $('.dialog-body');

            $dialogBody.on('click','.dialog-close',function(event) {
                settings.closeCallback && settings.closeCallback(_this.destroy,$('#dialog-content'));
                _this.destroy();
            });

            $dialogBody.on('click','.dialog-ok',function(event) {
                settings.okCallback && settings.okCallback({destroy: _this.destroy,el:$('#dialog-content')});
                if (!_this.settings.autoClose) return;
                _this.destroy();
            });

            $dialogBody.on('click','.dialog-cancel',function(event) {
                settings.cancelCallback && settings.cancelCallback({destroy: _this.destroy,el:$('#dialog-content')});
                if (!_this.settings.autoClose) return;
                _this.destroy();
            });

            $('body').on('click','#dialog-mask',function(){
                if (settings.maskClose) {
                    if (!_this.settings.autoClose) return;
                    _this.destroy();
                }
            });

            settings.initFunc();
        });
        D.method('createDom',function(settings){
            var mask = '<div class="dialog-mask" id="dialog-mask" style="position: fixed;width: 100%;height: 100%;top: 0; left: 0;z-index: 1000;background: rgba(0,0,0,0.4);"></div>',
                dialogDom = '<div id="dialog-body" class="dialog-body animated zoomIn" style="position: fixed;width: '+settings.width+'px;height: '+settings.height+'px;top: 50%;left: 50%;margin-top:'+(-settings.height/2)+'px;margin-left:'+(-settings.width/2)+'px;overflow: hidden;background: #fff;z-index: 1001;border-radius: 4px;">'+
                    '<h4 class="dialog-title" style="position: relative;text-align: '+settings.titlePostion+'; margin: 0;padding: 5px 0;background: #d2d2d2;color:#666;">'+settings.title+'<i id="dialog-close" class="dialog-close" style="display: '+ (settings.closeBtn ? 'inline-block' : 'none') +';position: absolute;top: 3px;right: 3px;width: 20px;height: 20px;line-height: 16px;text-align: center;border-radius: 50%;font-style: normal;cursor: pointer">x</i></h4>'+
                    '<div class="dialog-content" id="dialog-content" style="width: 96%; height: '+(settings.height-70)+'px;;padding: 2%;color: #666;overflow: auto;word-break: break-all;">'+settings.content+'</div>'+
                    '<div class="dialog-btn-group" style="text-align: center; padding: 0;">'+
                    '<button id="dialog-ok" class="dialog-ok btn btn-warning" style="display: '+(settings.ok?'inline-block':'none')+';border: 0; border-radius: 3px; margin: 0 5px; padding: 5px 15px; font-size: 14px; color:#fff;">'+settings.okText+'</button>'+
                    '<button id="dialog-cancel" class="dialog-cancel btn btn-warning" style="display: '+(settings.cancel?'inline-block':'none')+';border: 0; border-radius: 3px; margin: 0 5px; padding: 5px 15px; font-size: 14px; color:#fff;">'+settings.cancelText+'</button>'+
                    '</div>'+
            '</div>';
            //append到页面
            $('body')
                .append(mask)
                .append(dialogDom);
            // setTimeout(function(){
            //     $('#dialog-body').css({
            //         'width': settings.width,
            //         'height': settings.height,
            //         'marginTop': '-' + settings.height/2 +'px',
            //         'marginLeft': '-' + settings.width/2 +'px'
            //     });
            // },100);
        });
        D.method('destroy',function(){
	    // 用class来销毁弹窗，因为页面进入时可能会同时进行多个请求，从而可能会出现多个弹窗，此时页面上有多个‘#dialog-body’，用id删除会出错。
            $('.dialog-body, .dialog-close, .dialog-ok, .dialog-cancel').off();
            $('.dialog-mask').remove();
            $('.dialog-body').remove();
            instance = null;
        });

        D.method('hideOkBtn',function() {
            $('.dialog-ok').hide();
        });

        D.method('showCancelBtn',function() {
            this.settings.autoClose = true;
            $('.dialog-cancel').show();
        });

        return function(option) {
            if (!option) throw 'error: 没有传参数。';
            return new D(option);
        };
    })();

    H.tip = function(option) {
        var defaults,
            settings,
            timer;

        defaults = {
            text: '',
            time: 2000
        };
        if (H.isString(option) || H.isNumber(option)) {
            option = {
                text: option
            };
        }
        settings = Object.assign(defaults, option || {});
        function render() {
            var $body = $('body'),
                dom = domCreate(settings);
            $body.append(dom);
        }
        function domCreate(data) {
            var dom = '<div id="modal-tip" class="modal-tip" style="position: fixed; top: 0; width: 100%; height: 100%; background: transparent; z-index: 1002">'+
                '<div class="tip-text" style="position: absolute; left: 50%; top: 50%; margin-top: -20px; height: 40px; line-height: 40px; transform: translateX(-50%); padding: 0 10px; border-radius: 3px; background: rgba(0,0,0,.8); color: #fff;">' + data.text + '</div>' +
            '</div>';
            return dom;
        }
        function destroy() {
            var body = document.body,
                tip = document.getElementById('modal-tip');
            body.removeChild(tip);
        }
        render();

        setTimeout(function() {
            destroy();
        }, settings.time);
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
        var money = (price || price==0) ? price/100 : 0;
        return money;
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

    // if ( typeof noGlobal === strundefined ){
    //     window.H = H;
    // }
    window.H = H;
}));

