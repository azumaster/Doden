export default function(string, title, confirmFn) {
    var str = '<div id="picker_mask" class="picker-mask"></div>'+
        '<div class="region-picker-wrapper visibility-control" id="region-picker" >'+
        '<div class="header"><div class="bar bar-header">' +
        '<button class="button button-clear button-positive" id="selectClear">取消</button>'+
        '<div id="picker_title" class="picker-title flex-item">' + title + '</div>'+
        '<button class="button button-clear button-positive" id="selectFinish">完成</button>'+
        '</div></div><div id="picker_body" class="body">'+ string +
        '</div></div>';
    $.selector('#picker_container').innerHTML = str;
    let animaed = CAAnimation.createAnimation({
        id: 'region-picker'
    });

    $.selector('#selectClear').onclick = () => {
        console.log(1);
        $.selector('#picker_mask').style.display = 'none';
        animaed.finish();
    };
    $.selector('#selectFinish').onclick = () => {
        $.selector('#picker_mask').style.display = 'none';
        animaed.finish();
        animaed.removeEvent();
        confirmFn && confirmFn();
    };
    animaed.start();
}