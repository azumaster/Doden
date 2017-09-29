
let createDom = (options)=>{
    let div = document.createElement('div'),
        i = document.createElement('i'),
        h4 = document.createElement('h4');

    options.icon = options.icon?options.icon:'ok';

    div.setAttribute('id', 'toast');
    div.className = 'toast';

    i.className = 'icon toast-icon '+options.icon;
    div.appendChild(i);

    h4.className = 'toast-text';
    h4.innerHTML = options.text;
    div.appendChild(h4);

    $.selector('#app').appendChild(div);

    setTimeout(()=>{
        showToast();
    }, 100);
};

let showToast = ()=>{
    $.selector('#toast').className = 'toast active';

    setTimeout(()=>{
        hideToast();
    }, 1300);
};

let hideToast = ()=>{
    $.selector('#toast').className = 'toast';
    setTimeout(()=>{
        $.selector('#app').removeChild($.selector('#toast'));
    }, 300);
};

export default (options)=>{
    if($.selector('#toast')){
        return;
    }
    createDom(options);
};