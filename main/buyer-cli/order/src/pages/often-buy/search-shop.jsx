import React from 'react';

class SearchShop extends React.Component {
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

    //搜索出来的卖家店铺中商品列表;
    getSearchDataList = () => {
        let server = H.server,
            p = {
                shop_name: this.state.shopName ? this.state.shopName : '',
                user_id: this.props.userInfo.user_id,
                page: this.state.pageNum,
                size: this.state.pageSize
            },
            loading = this.loadingBehavior();
        server.often_goods_search(p, (res) => {
            loading.hide();
            H.we_loading.hide();
            if(res.code == 0){
                let pageNum = this.state.pageNum,
                    _thisData = {};

                if(!res.data.goods_infos) return;

                if(res.data.goods_infos.length <= 0){
                    this.setState({isLoad: false});
                }else {
                    pageNum++;
                }

                if(this.state.pageNum == 1){
                    _thisData = res.data.goods_infos;
                    this.state.scroller.scrollTo(0, 0);
                }else {
                    _thisData = this.state.data.concat(res.data.goods_infos);
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

    //加入常购商品;
    addOftenGoods = (p) => {
        H.we_loading.show();
        H.server.often_goods_add(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0){
                H.dialog(res.message);
                let d = this.state.data;
                for(let i = 0 ; i < d.length ; i++) {
                    if(d[i].goods_id == p.goods_id) {
                        d[i].oftenbuy = 1;
                        this.setState({data: d});
                        break;
                    }
                }
            }else {
                H.dialog(res.message);
            }
        });
    }

    //删除常购商品;
    delOftenGoods = (p) => {
        H.we_loading.show();
        H.server.often_goods_del(p, (res) => {
            H.we_loading.hide();
            if(res.code == 0) {
                H.dialog(res.message);
                let d = this.state.data;
                for(let i = 0 ; i < d.length ; i++) {
                    if(d[i].goods_id == p.goods_id) {
                        d[i].oftenbuy = 2;
                        this.setState({data: d});
                        break;
                    }
                }
            }else {
                H.dialog(res.message);
            }
        });
    }

    componentDidMount = () => {
        this.setState({shopName: this.props.shopName}, () => {
            H.we_loading.show();
            this.scrollCreator(this.getSearchDataList);
        });
    }

    //店铺关键词搜索;
    sellerShopSearch = () => {
        let shopName = $('#shop_name').val();
        if(shopName == ''){
            H.dialog('搜索店铺名不能为空');
            return;
        }
        this.setState({shopName: shopName, pageNum: 1}, () => {
            this.getSearchDataList();
            H.we_loading.show();
        });
    }

    render = () => {
        let warpStyle = {top: '113px', bottom: '0'};

        return (
            <section>
                <div className="back-bar"><a onClick={this.props.callback.bind(this, 1)} className="back before-back">返回</a></div>
                <header className="search-bar flex-box">
                    <div className="flex-num1 search-words"><input type="text" id="shop_name" placeholder="搜索卖家店铺名" /></div>
                    <a className="search-btn" onClick={this.sellerShopSearch}>搜索</a>
                </header>
                <aside className="aside-shop-info">买家：{this.props.userInfo.shop_name}（{this.props.userInfo.user_name}）</aside>
                <div id="wrapper" style={warpStyle}>
                    <div id="scroller">
                        <ul className="often-buy-list">
                            {
                                this.state.data.map((data, index) => {
                                    let param = {};
                                    let btnXml = '';
                                    if(data.oftenbuy == 2) {  //商品搜索列表;
                                        param ={
                                            goods_id: data.goods_id,
                                            user_id: this.props.userInfo.user_id
                                        };
                                        btnXml = (
                                            <a
                                                className="btn btn-green add-often-buy"
                                                onClick={this.addOftenGoods.bind(this, param)}>加入
                                            </a>
                                        );
                                    }else {  //会员常购列表;
                                        param = {
                                            goods_id: data.goods_id,
                                            often_buy_id: data.often_buy_id,
                                            user_id: this.props.userInfo.user_id
                                        };
                                        btnXml = (
                                            <a
                                                className="btn add-often-buy">已添加
                                            </a>
                                        );
                                    }
                                    return (
                                        <li className="flex-box often-shop" key={index}>
                                            <img src={'http://img.idongpin.com/'+data.goods_image+'@100w_90Q.jpg'} />
                                            <div className="flex-num1">
                                                <h3 className="title">{data.goods_name}（{data.goods_brand}）</h3>
                                                <div className="flex-box align-items">
                                                    <div className="flex-num1">
                                                        <p className="weight">{data.goods_weight}{data.goods_unit}</p>
                                                        <address>地址：{data.sell_shop_name}</address>
                                                    </div>
                                                    <div>
                                                        {btnXml}
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

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default SearchShop;