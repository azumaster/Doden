/**
 * Created by Doden on 2017.06.26
 */

import React from 'react';

class Sum extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(){
        this.drawCanvas();
    }

    // 绘制可用额度的图形
    drawCanvas(){
        let canvas = document.getElementById('canvas');

        let allMoney = this.props.total,
            useMoney = this.props.used;

        let lastMath = 0,
            divide = useMoney/allMoney/200;

        canvas.width = window.innerHeight;
        canvas.height = 200;

        let ctx = canvas.getContext('2d');
        devicePR(canvas, ctx);

        drawCircle(92, 8, 0, 2*Math.PI, '#148cfc');
        drawCircle(84, 8, 0, 2*Math.PI, '#c7f9fe');
        drawCircle(84, 8, -Math.PI/2, lastMath*2*Math.PI-Math.PI/2, '#096dd3');
        drawCircle(76, 8, 0, 2*Math.PI, '#148cfc');
        let loanInterval = setInterval(()=>{
            lastMath+=divide;
            ctx.clearRect(0, 0, window.innerHeight, 200);
            drawCircle(92, 8, 0, 2*Math.PI, '#148cfc');
            drawCircle(84, 8, 0, 2*Math.PI, '#c7f9fe');
            drawCircle(84, 8, -Math.PI/2, lastMath*2*Math.PI-Math.PI/2, '#096dd3');
            drawCircle(76, 8, 0, 2*Math.PI, '#148cfc');
            if(Number(lastMath) - Number((useMoney)/allMoney)>=0){
                clearInterval(loanInterval);
            }
        }, 5);

        function drawCircle(r, w, start, end, color) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = w;
            var circle = {
                x : window.innerWidth/2,    //圆心的x轴坐标值
                y : 100,    //圆心的y轴坐标值
                r : r      //圆的半径
            };
            ctx.arc(circle.x, circle.y, circle.r, start, end, false);
            //按照指定的路径绘制弧线
            ctx.stroke();
            ctx.closePath();
        }
        // 这个地方是处理Canvas画圆弧边缘平滑的问题，支持-webkit和-opera；
        // 主要是解决Retina屏幕所带来的锯齿感
        function devicePR(canvas, ctx) {
            if (window.devicePixelRatio) {
                canvas.style.width = canvas.width + 'px';
                canvas.style.height = canvas.height + 'px';
                canvas.height = canvas.height * window.devicePixelRatio;
                canvas.width = canvas.width * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
            }
        }
    }

    render() {
        return (<canvas id="canvas" className="canvas"></canvas>);
    }
}

export default Sum;