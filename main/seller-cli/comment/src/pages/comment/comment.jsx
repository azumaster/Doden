import React from 'react';
import Star from '../../components/star/star.jsx';

class Comment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            average_score: '',
            goods_appraise_time: 0,
            scroller: {},
            pageNum: 1,
            pageSize: 20,
            isLoad: true,
            browser: ''
        };
    }

    scrollCreator = (fn) => {
        // 创建iscroll实例
        fn();
        let loading = this.loadingBehavior();
        var wrapper = document.getElementById('wrapper');
        var myScroll = new IScroll(wrapper, {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            click: true,
            topOffset: 50
        });
        this.setState({scroller: myScroll});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

        myScroll.on('scrollEnd', () => {
            if(myScroll.y == myScroll.maxScrollY) {
                if(this.state.isLoad) {
                    loading.show();
                    fn && fn();
                }
            }
        });
        return myScroll ;
    }

    getData = () => {
        let server = H.server,
            p = {
                page: this.state.pageNum,
                size: this.state.pageSize
            },
            loading = this.loadingBehavior();
        server.order_appraise_sell_list(p, (res) => {
            loading.hide();
            if(res.code == 0){
                let pageNum = this.state.pageNum,
                    average_score = this.state.average_score,
                    goods_appraise_time = this.state.goods_appraise_time;
                if(res.data.appraise_infos.length <= 0){
                    this.setState({isLoad: false});
                }else {
                    pageNum++;
                    average_score = res.data.average_score;
                    goods_appraise_time = res.data.goods_appraise_time;
                }
                let _thisData = this.state.data.concat(res.data.appraise_infos);
                this.setState({
                    data: _thisData,
                    average_score: average_score,
                    goods_appraise_time: goods_appraise_time,
                    pageNum: pageNum
                }, () => {
                    setTimeout(() => {
                        this.state.scroller.refresh();
                    }, 500);
                });
            }else {
                alert(res.message);
            }
        });
    }

    componentWillMount = () => {
        let browser={
            versions:function(){
                var u = navigator.userAgent;
                //app = navigator.appVersion;
                return {
                    trident: u.indexOf('Trident') > -1, //IE内核
                    presto: u.indexOf('Presto') > -1, //opera内核
                    webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核;
                    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                    mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                    android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
                    iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
                    iPad: u.indexOf('iPad') > -1, //是否iPad
                    webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                    weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
                    qq: u.match(/\sQQ/i) == 'qq' //是否QQ
                };
            }(),
            language:(navigator.browserLanguage || navigator.language).toLowerCase()
        };

        this.setState({browser: browser});
    }

    componentDidMount = () =>{
        this.scrollCreator(this.getData);
    }

    loadingBehavior() {
        var $pullUpEl = $('.pullUp'),
            _this = this;
        function show() {
            if (_this.state.data.length === 0) {
                $pullUpEl.addClass('noOrder');
            }
            $pullUpEl.addClass('loading').html('<span class="pullUpIcon">&nbsp;</span><span class="pullUpLabel">Loading...</span>');
        }
        function hide() {
            $pullUpEl.removeClass('loading noOrder').html('');
        }
        return {
            show: show,
            hide: hide
        };
    }

    render = () => {
        let starXml = '',
            backXml = '',
            wrapperStyle = {};
        if(this.state.average_score != '') {
            let totalScore = '';
            if(parseInt(this.state.average_score) > 0){
                totalScore = parseInt(this.state.average_score) + '';
                starXml = <Star id={totalScore} size="2" operate={totalScore} goodsId="0" />;
            }else {
                starXml = <Star size="2" operate="0" goodsId="0" />;
            }
        }
        if(this.state.browser != '') {
            if(!this.state.browser.versions.ios) {
                backXml = (
                    <div className="back-bar"><a href="/index.php" className="back before-back">返回</a></div>
                );
                wrapperStyle = {
                    top: '36px',
                    bottom: '0px'
                };
            }else {
                wrapperStyle = {
                    top: '0px',
                    bottom: '0px'
                };
            }
        }
        return (
            <div>
                {backXml}
                <div id="wrapper" style={wrapperStyle}>
                    <div id="scroller">

                        <div className="count-score flex-box">
                            <div>
                                <div className="star-warp">总分：
                                    {starXml}
                                </div>
                            </div>
                            <div className="count-person flex-num1">
                                <div className="flex-box">
                                    <div className="flex-num1" style={{color: '#2a2a2a', fontSize: '14px'}}>
                                        {this.state.average_score}分
                                    </div>
                                    <div>{this.state.goods_appraise_time}次评价</div>
                                </div>
                            </div>
                        </div>
                        <ul>
                            {
                                this.state.data.map((data, index) => {
                                    let colorObj = {color: '#ffc63b'},
                                        shopScore = '+0';
                                    if(data.score < 0){
                                        colorObj.color = '#fa4c4c';
                                        shopScore = data.score;
                                    }else if(data.score > 0) {
                                        colorObj.color = '#23ce2f';
                                        shopScore = '+'+data.score;
                                    }
                                    return (
                                        <li className="comment-list" key={index}>
                                            <div className="flex-box">
                                                <img className="goods-img" src={'http://img.idongpin.com/'+data.goods_picture+'@100w_90Q.jpg'} />
                                                <div className="goods-info">
                                                    <p className="title">{data.goods_name}</p>
                                                    <p className="goods-num">
                                                        {data.goods_price}元*{data.buy_number}{data.goods_unit}={data.goods_total_price}元
                                                    </p>
                                                    <p className="goods-time">{data.create_time}</p>
                                                </div>
                                            </div>
                                            <div className="enter-comment">
                                                <div className="synthesis flex-box">
                                                    <div className="flex-num1">
                                                        <div className="star-warp">商品品质：
                                                            <Star size="1" operate={data.quality}/>
                                                        </div>
                                                        <div className="star-warp">卖家服务：
                                                            <Star size="1" operate={data.sell_service}/>
                                                        </div>
                                                        <div className="star-warp">发货速度：
                                                            <Star size="1" operate={data.delivery_speed}/>
                                                        </div>
                                                    </div>
                                                    <div className="flex-box line-center" style={{fontSize: '14px'}}>
                                                        <p style={colorObj}>您的店铺分：{shopScore}</p>
                                                    </div>
                                                </div>
                                                <div className="flex-box msg-warp">
                                                    <div className="flex-num1">
                                                        {data.buyers_shop_name}<span style={{color: '#797979'}}>：{data.content}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <div className="footer_c">
                            <div className="pullUp">
                                {/*<span className="pullUpIcon">&nbsp;</span>
                                 <span className="pullUpLabel">Loading...</span>*/}
                            </div>
                            <p>买家的评价将被其他人看到，差评会影响您的信誉</p>
                            <p>恶意刷评价的，商品会自动下架，无法在线销售</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Comment;