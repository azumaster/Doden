import Selector from './base/selector.js';
import Toast from './base/toast.js';
import Dialog from './base/dialog.js';
import browser from './base/browser.js';
import Loading from './base/loading.js';
import focusImg from './base/focusImg.js';
import {setCookie, getCookie} from './base/cookie.js';

(function (window) {
    let $ = {
        selector: Selector,
        toast: Toast,
        dialog: Dialog,
        setCookie: setCookie,
        getCookie: getCookie,
        loading: Loading,
        cdn: function() {return getCookie('domain') ? getCookie('domain') : 'http://img.idongpin.com/';},
        img: function(w, q){return location.host.indexOf('192.168.') != -1 ? '' : '@'+w+'w_'+q+'Q.jpg';},
        browser: browser,
        hashParam: function(name) {var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');var r = location.hash.substr(1).match(reg);if(r!=null)return  unescape(r[2]); return null;},
        urlParam: function(name) {var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');var r = location.search.substr(1).match(reg);if(r!=null)return  unescape(r[2]); return null;},
        focusImg: focusImg,
        objToArr: function (obj) {var arr=[]; var i=0; for(var item in obj){arr[i]=obj[item]; i++;} return arr;}
    };

    window.$ = $;
})(window);
