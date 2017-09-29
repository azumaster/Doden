
let dialog = {};
dialog.show = (option) => {

    if(!document.getElementById('dialogMask')){
        createDom(option);
    }

};

let createDom = function (option) {
    let dom = document.createElement('div');
    dom.className = 'dialog-mask';
    dom.id = 'dialogMask';

    dom.innerHTML = '<div class="dialog">' +
        '<div class="dialog-title"><p>'+(option.title?option.title:'提示')+'</p><span class="icon icon-cha" id="dialogClose" "></span></div>' +
        '<div class="dialog-content">'+(option.content?option.content:'')+'</div>' +
        '<div class="dialog-footer">' +
        '<div class="dialog-btn btn-ok" id="dialogOk">'+(option.okText?option.okText:'确定')+'</div>' +
        (option.cancel?'<div class="dialog-btn btn-cancel" id="dialogCancel">'+(option.cancelText?option.cancelText:'取消')+'</div>':'')+
        '</div>' +
        '</div>';

    document.body.appendChild(dom);

    document.getElementById('dialogClose').addEventListener('click', function () {
        document.body.removeChild(document.getElementById('dialogMask'));
    }, false);

    document.getElementById('dialogCancel').addEventListener('click', function () {
        document.body.removeChild(document.getElementById('dialogMask'));

        if(option.cancelCallback){
            option.cancelCallback();
        }
    }, false);

    document.getElementById('dialogOk').addEventListener('click', function () {
        document.body.removeChild(document.getElementById('dialogMask'));

        if(option.okCallback){
            option.okCallback();
        }
    }, false);
};

export default dialog;