import Selector from './base/selector.js';
import Toast from './base/toast.js';
import Dialog from './base/dialog.js';
import browser from './base/browser.js';
import Loading from './base/loading.js';
import focusImg from './base/focusImg.js';
import validate from './base/validate.js';
import picker from './base/picker.js';
import {upload} from './base/upload';

(function (window) {
    let $ = {
        selector: Selector,
        toast: Toast,
        dialog: Dialog,
        setCookie: setCookie,
        getCookie: getCookie,
        loading: Loading,
        cdn: getCookie('domain'),
        img: function(w, q){return location.host.indexOf('192.168.') != -1 ? '' : '@'+w+'w_'+q+'Q.jpg';},
        browser: browser,
        urlParam: function(name) {var reg = new RegExp('(^|&)'+ name +'=([^&]*)(&|$)');var r = location.hash.substr(1).match(reg);if(r!=null)return  unescape(r[2]); return null;},
        focusImg: focusImg,
        validate: validate,
        picker: picker,
        upload: upload
    };

    window.$ = $;
})(window);
