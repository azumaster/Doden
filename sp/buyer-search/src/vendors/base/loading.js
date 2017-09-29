/**
 * Created by H5 on 2017.03.28.
 */

let Loading = {};
Loading.show = (t) =>{
    if(document.getElementById('loading')){
        return;
    }
    createLoading(t);
};
Loading.hide = () =>{
    if(document.getElementById('loading')){
        hideLoading();
    }
};

let createLoading = (t) =>{
    let div = document.createElement('div'),
        text = t || '加载中...';
    div.className = 'loading';
    div.id = 'loading';


    div.innerHTML ='<div class="loading-icon">' +
        '<div></div><div></div><div></div><div></div><div></div>' +
        '</div><h4>'+text+'</h4>';


    document.body.appendChild(div);

    setTimeout(()=>{
        showLoading();
    }, 100);
};

let showLoading = ()=>{
    $.selector('#loading').className = 'loading active';
};

let hideLoading = ()=>{
    $.selector('#loading').className = 'loading';
    setTimeout(()=>{
        if($.selector('#loading')) {
            document.body.removeChild($.selector('#loading'));
        }
    }, 300);
};

export default Loading;