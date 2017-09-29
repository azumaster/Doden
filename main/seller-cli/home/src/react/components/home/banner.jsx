/**
 * Created by Doden on 2017.05.04
 */

import React from 'react';

class banner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            currentImg: 0
        };
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        H.server.getBanner({retainType: 2, dataCount: 3}, (res)=>{
            if(res.status == 0){
                let banners = [];

                res.data.articleTitleInfo.map((article)=>{
                   if(article.cover_pic) banners.push(article);
                });

                this.setState({
                    banners: banners
                });
            }else {
                alert(res.message);
            }
        });
    }

    componentDidMount(){
        let width = window.innerWidth;
        document.getElementById('banner').style.height = width/2 + 'px';
    }

    componentDidUpdate(){
        this.split();
    }

    createImg(){
        let imgs = [],
            _this = this;

        if(this.state.banners.length>0){
            let last = this.state.banners[this.state.banners.length-1],
                first = this.state.banners[0];

            imgs.push(<img style={{width: window.innerWidth + 'px'}} id={'banner0'} className="banner-item" key={0} data-url={last.article_link} data-key={_this.state.banners.length-1}
                           onClick={this.toNewPage.bind(this)} src={last.cover_pic.indexOf('htt')==-1?'http://img.idongpin.com/'+last.cover_pic:last.cover_pic}/>);

            this.state.banners.map((banner, index)=>{
                if(banner.cover_pic){
                    imgs.push(<img style={{width: window.innerWidth + 'px'}} id={'banner'+(index+1)} className="banner-item" key={index+1} data-url={banner.article_link} data-key={index}
                                   onClick={this.toNewPage.bind(this)} src={banner.cover_pic.indexOf('htt')==-1?'http://img.idongpin.com/'+banner.cover_pic:banner.cover_pic}/>);
                }
            });
            imgs.push(<img style={{width: window.innerWidth + 'px'}} id={'banner'+(this.state.banners.length+1)} className="banner-item" key={_this.state.banners.length+1} data-url={first.article_link}
                onClick={this.toNewPage.bind(this)} src={first.cover_pic.indexOf('htt')==-1?'http://img.idongpin.com/'+first.cover_pic:first.cover_pic} data-key={0}/>);

        }

        return imgs;
    }

    createPoint(){
        let points = [];

        this.state.banners.map((banner, index)=>{
            if(banner.cover_pic){
                points.push(<a href="javascript:;" key={index} className="banner-point"></a>);
            }
        });

        return points;
    }

    split(){
        let container = document.getElementById('bannerImg'),
            points = document.getElementsByClassName('banner-point'),
            width = window.innerWidth,
            auto = null,
            _this = this;

        let currentImg = 0,
            currentPoint = 0,
            startX = 0,
            endX = 0;

        if(this.state.banners.length>1){
            if(!this.props.stop){
                auto = setInterval(function () {
                    autoPlay(2000);
                }, 3000);
                container.addEventListener('touchstart', touchStart, false);
                container.addEventListener('touchmove', touchMove, false);
                container.addEventListener('touchend', touchEnd, false);
                if(points.length>0){
                    points[0].className = 'banner-point active';
                }

                function autoPlay(time) {

                    if(points.length>0){
                        for(let i=0; i<_this.state.banners.length; i++){
                            $(points).eq(i).removeClass('active');
                        }

                        currentImg ++;
                        currentPoint = currentImg;
                        if(currentPoint == _this.state.banners.length){
                            currentPoint = 0;
                        }
                        $(points[currentPoint]).addClass('active');
                        $(container).animate({left: -(currentImg+1)*width + 'px'}, 300);
                        if(currentImg == _this.state.banners.length){
                            currentImg = 0;
                            setTimeout(function () {
                                $(container).animate({left: -(currentImg+1)*width + 'px'}, 0);
                            }, time);
                        }
                    }
                }
                function touchStart(e) {
                    e.stopPropagation();
                    startX = e.targetTouches[0].pageX;
                }
                function touchMove(e) {
                    e.stopPropagation();
                    endX = e.targetTouches[0].pageX;
                    clearInterval(auto);
                }
                function touchEnd(e) {
                    e.stopPropagation();
                    auto = setInterval(autoPlay, 2000);

                    if(endX - startX < - 30){
                        autoPlay(300);
                    }else if(endX - startX > 30){
                        for(let i=0; i<_this.state.banners.length; i++){
                            $(points).eq(i).removeClass('active');
                        }
                        currentImg --;
                        currentPoint = currentImg;
                        if(currentPoint <= -1){
                            currentPoint = (_this.state.banners.length-1);
                        }
                        $(points[currentPoint]).addClass('active');
                        $(container).animate({left: -(currentImg+1)*width + 'px'}, 300);
                        if(currentImg == '-1'){
                            currentImg = (_this.state.banners.length-1);
                            setTimeout(function () {
                                $(container).animate({left: -(currentImg+1)*width + 'px'}, 0);
                            }, 300);
                        }

                    }
                }
            }else{
                clearInterval(auto);
            }
        }
    }

    toNewPage(e){
        let url = e.target.dataset.url;
        if(url) window.location.href = url;
    }

    render() {
        return (<div id="banner" className="banner">
            <div className="banner-img" id="bannerImg" style={{width: (this.state.banners.length+2)*window.innerWidth + 'px', left: -window.innerWidth+'px'}}>
                {this.createImg()}
                </div>
            <div className="banner-points">{this.createPoint()}</div>
            <div className="banner-decorate"></div>
        </div>);
    }
}

export default banner;