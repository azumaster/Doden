/**
 * Created by H5 on 2017.03.08.
 */

/**
 *
 * @param options:{
 * title: 弹窗标题
 * cancelText:取消按钮的文字
 * okText:确认按钮的文字
 * content: 弹窗body的内容
 * seller:是否是卖家端
 * cancelCallback: 取消按钮执行的事件
 * okCallback: 确认按钮执行的事件
 * }
 */

    /*
    * 需要改一下，options在不传的时候会有默认的obj对象，接收的options可以为字符串，设置到content里面，接收到的options是对象时用Object.assign()合并;
    * */
let createDom = (option)=>{
    let options = {
        title: '温馨提示',
        content: '知道了',
        cancelText: '取消',
        okText: '确定',
        cancel: false,
        autoClose: true,
        seller: false,
        cancelCallback: () => {},
        okCallback: () => {}
    };
    let div = document.createElement('div');
    div.setAttribute('id', 'mask');
    div.className = 'mask';
    if(typeof option == 'string') options.content = option;
    if(typeof option == 'object') options = Object.assign(options, option);
    div.innerHTML='<div id="dialog" class="dialog">' +
        '<div class="dialog-title"><h2 class="text-center">'+(options.title?options.title:'温馨提示')+'</h2></div>' +
        '<div class="dialog-body">'+options.content+'</div>' +
        '<div class="dialog-button flex">' +
        (!options.cancel?'':'<button id="dialogCancel" type="button" class="btn btn-dialog-cancel">'+(options.cancelText?options.cancelText:'取消')+'</button>')+
        '<button id="dialogOk" type="button" class="btn '+(options.seller?'btn-dialog-confirm':'btn-dialog-ok')+'">'+(options.okText?options.okText:'确定')+'</button>'+
        '</div></div>';

    $.selector('#app').appendChild(div);

    setTimeout(()=>{
        showDialog(options);
    }, 100);

    let showDialog = (options)=>{
        $.selector('#dialog').className = 'dialog active';

        $.selector('#dialogOk').addEventListener('click', ()=>{
            if(options.autoClose){
                hideDialog();
            }
            options.okCallback && options.okCallback();
        }, false);

        if($.selector('#dialogCancel')){
            $.selector('#dialogCancel').addEventListener('click', ()=>{
                hideDialog();
                options.cancelCallback && options.cancelCallback();
            }, false);
        }

        window.addEventListener('popstate', ()=>{
            if($.selector('#dialog')){
                $.selector('#app').removeChild($.selector('#mask'));
            }
        }, false);
    };

    let hideDialog = ()=>{
        $.selector('#dialog').className = 'dialog';
        setTimeout(()=>{
            $.selector('#app').removeChild($.selector('#mask'));
        }, 300);
    };
    return {
        hide: hideDialog
    };

};

export default (options) =>{
    if($.selector('#dialog')){
        return null;
    }
    return createDom(options);
};