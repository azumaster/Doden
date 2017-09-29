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
    document.getElementById('loading').className = 'loading active';
};

let hideLoading = ()=>{
    document.getElementById('loading').className = 'loading';
    setTimeout(()=>{
        document.body.removeChild(document.getElementById('loading'));
    }, 300);
};

export default Loading;