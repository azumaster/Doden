import React from 'react';

class OftenShop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            scroller: null,
            pageNum: 1,
            pageSize: 10,
            isLoad: true,
            shopName: ''
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

    getDataList = () => {
        let server = H.server,
            p = {
                shop_name: this.state.shopName ? this.state.shopName : '',
                page: this.state.pageNum,
                size: this.state.pageSize
            },
            loading = this.loadingBehavior();
        server.often_buy(p, (res) => {
            loading.hide();
            H.we_loading.hide();
            if(res.code == 0){
                let pageNum = this.state.pageNum,
                    _thisData = {};
                if(!res.data.shop_infos) {
                    return;
                }
                if(res.data.shop_infos.length <= 0){
                    this.setState({isLoad: false});
                }else {
                    pageNum++;
                }
                if(this.state.pageNum == 1) {
                    _thisData = res.data.shop_infos;
                    this.state.scroller.scrollTo(0, 0);
                }else {
                    _thisData = this.state.data.concat(res.data.shop_infos);
                }
                this.setState({
                    data: _thisData,
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

    //进入单个买家店铺;
    showInfo = (user) => {
        this.props.goodsHandler && this.props.goodsHandler(user);
    }

    componentDidMount = () => {
        H.we_loading.show();
        this.scrollCreator(this.getDataList);
    }

    //店铺关键词搜索;
    buyerShopSearch = () => {
        let shopName = $('#shop_name').val();
        if(shopName == ''){
            H.dialog('搜索店铺名不能为空');
            return;
        }
        this.setState({shopName: shopName, pageNum: 1}, () => {
            this.getDataList();
            H.we_loading.show();
        });
    }

    render = () => {
        let warpStyle = {top: '45px', bottom: '0'};
        return (
            <section>
                <header className="search-bar flex-box">
                    <div className="flex-num1 search-words"><input type="text" id="shop_name" placeholder="搜索买家店铺名" /></div>
                    <a className="search-btn" onClick={this.buyerShopSearch}>搜索</a>
                </header>
                <div id="wrapper" style={warpStyle}>
                    <div id="scroller">
                        <ul className="often-buy-list">
                            {
                                this.state.data.map((data, index) => {
                                    return (
                                        <li className="flex-box" key={index}>
                                            <div className="flex-num1">
                                                <h3 className="title">{data.user_name}（{data.shop_name}）</h3>
                                                <p><a className="phone" href={'tel:' + data.user_link_tel}>电话：{data.user_link_tel}</a></p>
                                                <address>地址：{data.shop_address}</address>
                                            </div>
                                            <div>
                                                <a
                                                    className="btn btn-green add-often-buy"
                                                    onClick={this.showInfo.bind(this, data)}>常购
                                                </a>
                                            </div>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                        <div className="footer_c">
                            <div className="pullUp">

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default OftenShop;