/*
* 焦点图（轮播）
* Created by xy on 2017.03.09.
* */

export default function(options) {
    let box = $.selector(options.box),
        picArr = $.selector(options.box + ' .picArr li'),
        ctrlArr = $.selector(options.box + ' .ctrlArr li'),
        length = picArr.length, current = 0,
        startX, startY, moveX, moveY, flag = false,
        //autoPlayTime,
        w = box.offsetWidth;
    if(length <= 0) return;
    picArr[current].style.webkitTransform = 'translate3d(0, 0, 0)';
    ctrlArr[current].className = 'active';
    box.addEventListener('touchstart', touchStart, false);
    box.addEventListener('touchmove', touchMove, false);
    box.addEventListener('touchend', touchEnd, false);

    //autoPlayTime = setInterval(autoPlay, 5000);
    function touchStart(e) {
        e.preventDefault();
        //clearInterval(autoPlayTime);
        for(let i = 0 ; i < length ; i++) {
            picArr[i].style.webkitTransition = 'all 0ms ease';
        }
        moveX = startX = e.targetTouches[0].clientX;
        startY = moveY = e.targetTouches[0].clientY;
    }
    function touchMove(e) {
        e.preventDefault();
        moveX = e.touches[0].clientX;
        moveY = e.touches[0].clientY;
        if(Math.abs(moveX-startX) >= 10 && Math.abs(moveY-startY) < 10 && !flag) {
            flag = true;
        }
        if(flag) {
            if(moveX-startX>0){  //右滑动;
                if(current == 0) {
                    translate(current, length-1, moveX-startX, -w+moveX-startX);
                }else {
                    translate(current, current-1, moveX-startX, -w+moveX-startX);
                }
            }else if(moveX-startX<0){  //左滑动;
                if(current == length-1) {
                    translate(current, 0, moveX-startX, w+moveX-startX);
                }else {
                    translate(current, current+1, moveX-startX, w+moveX-startX);
                }
            }
        }
    }
    function touchEnd(e) {
        e.preventDefault();
        //box.removeEventListener('touchstart', touchStart, false);
        //box.removeEventListener('touchmove', touchMove, false);
        //box.removeEventListener('touchend', touchEnd, false);
        if(flag) {
            if(startX<moveX){  //向右滑动;
                prev();
            }else{
                next();
            }
        }
        flag = false;
        //autoPlayTime = setInterval(autoPlay, 5000);
    }

    function next() {
        if(current == length-1) {
            translate(current, 0, -w, 0, 300);
            current = 0;
        }else {
            translate(current, current+1, -w, 0, 300);
            current = current+1;
        }
        setCtrlActive();
    }

    function prev() {
        if(current == 0) {
            translate(current, length-1, w, 0, 300);
            current = length-1;
        }else {
            translate(current, current-1, w, 0, 300);
            current = current-1;
        }
        setCtrlActive();
    }

    function translate(current, beside, currentVal, besideVal, m) {
        picArr[current].style.webkitTransform = 'translate3d('+currentVal+'px, 0, 0)';
        picArr[beside].style.webkitTransform = 'translate3d('+besideVal+'px, 0, 0)';
        if(m) {
            picArr[current].style.webkitTransition = 'all ' + m + 'ms ease';
            picArr[beside].style.webkitTransition = 'all ' + m + 'ms ease';
        }
    }

    /*function autoPlay() {
        if(current == length-1) {
            translate(current, 0, 0, w);
            translate(current, 0, -w, 0, 3000);
            current = 0;
        }else {
            translate(current, current+1, 0, w);
            translate(current, current+1, -w, 0, 3000);
            current = current+1;
        }
        setCtrlActive();
    }*/

    function setCtrlActive() {
        for(let i = 0 ; i < length ; i++) {
            ctrlArr[i].className = '';
        }
        ctrlArr[current].className = 'active';
    }
};