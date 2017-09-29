import React from 'react';
import TopToolbar from './top-toolbar.jsx';
import Footer from './footer.jsx';
//商品列表;
import GoodsList from './components/goods-list.jsx';
//非转接在线支付;
import OnlinePayment from './components/online-payment.jsx';
//上车收钱;
import CarPay from './components/car-pay.jsx';
//转接用户（在线支付/货到付款）;
import Transfer from './components/transfer.jsx';

class CarContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,  //滚动条事件;
            goodsInfo: null,  //商品信息;
            pageStatus: 0,  //当前在哪个页面,0表示商品列表页面, 1非转接在线支付， 2是非转接上车收钱， 3是转接在线支付， 4是转接货到付款;
            payWay: 1,  //选择支付方式,1是在线支付，2是上车收钱 ,5是货到付款, 6集采;
            nextPageBtnState: 1, //下一步和全选按钮是否可用，1为可用，0为不可用;
            goodsIdArr: [],  //购物车选择商品ID串;
            totalPrice: 0,   //购物车商品总价;
            settlementInfo: null, //付款信息;
            diamond: 0,  //最高奖励钻石数量;
            paidPrice: 0,  //运费实付金额;
            preferential: null,   //优惠减免;
            grouponTime: {
                start: '',
                end: ''
            }
        };
        this.showPage = this.showPage.bind(this);
        this.changePayWay = this.changePayWay.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this.changeNextPageState = this.changeNextPageState.bind(this);
        this.changeGoodsIdArr = this.changeGoodsIdArr.bind(this);
        this.changeSettlementInfo = this.changeSettlementInfo.bind(this);
        this.setPageStatus = this.setPageStatus.bind(this);
        this.setGoodsInfo = this.setGoodsInfo.bind(this);
        this.scrollCreator = this.scrollCreator.bind(this);
        this.scrollRefresh = this.scrollRefresh.bind(this);
    }

    componentWillMount() {
        let server = H.server;
        H.we_loading.show();
        //获取商品信息列表;
        server.shopCart_goods_info({}, (res) => {
            if(res.code == 0) {
                let data = res.data.market_info,
                    arr = [];
                for(var k in data) {
                    let obj = data[k];
                    if(obj) {
                        for(var i in obj.goods_infos) {
                            if(obj.goods_infos[i].goods_status == 2 && !obj.goods_infos[i].price_expired && obj.goods_infos[i].on_sale == 2) {
                                arr.push(obj.goods_infos[i].shop_cart_goods_id);
                            }
                        }
                    }
                }
                this.setState({goodsInfo: res.data, goodsIdArr: arr});
                this.changeGoodsIdArr(arr);
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
            window.onhashchange = () => {
                if(location.hash == '') {
                    this.setPageStatus();
                }
            };
        });

        server.grouponTime({}, (res) => {
            if(res.code == 0) {
                this.setState({grouponTime: res.data});
            }
        });
    }
    componentDidMount() {
        this.scrollCreator();
    }

    getChildContext() {
        return {
            totalPrice: this.state.totalPrice
        };
    }

    scrollCreator() {
        // 创建iscroll实例
        var wrapper = document.getElementById('wrapper'),
            SCROLL = new IScroll(wrapper, {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            click: true,
            topOffset: 50
        });
        this.setState({SCROLL: SCROLL});
        document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
    }

    scrollRefresh() {
        this.state.SCROLL.refresh();
    }

    //改变付款方式;
    changePayWay(status) {
        this.setState({payWay: status});
    }

    //点击下一步;
    nextPage() {
        let param = {
            shop_cart_goods_ids: this.state.goodsIdArr.join(','),
            payment_method: this.state.payWay
        };
        H.we_loading.show();
        H.server.shopCart_goods_settlement_info(param, (res) => {
            if(res.code == 0) {
                let state = 1, resData = res.data,
                    diamond = resData.max_reward_diamond; //最高奖励钻石数量;
                if(resData.shop_transfer == 1) {
                    if(this.state.payWay == 1 || this.state.payWay == 6) {
                        //非转接在线支付;
                        state = 1;
                    }else if(this.state.payWay == 2) {
                        //上车收钱;
                        state = 2;
                    }
                }else {
                    if(this.state.payWay == 1) {
                        //转接在线支付;
                        state = 3;
                    }else if(this.state.payWay == 5) {
                        //货到付款;
                        state = 4;
                    }
                }

                resData.payment_method = this.state.payWay;
                resData.shop_cart_goods_ids = this.state.goodsIdArr.join(',');
                resData.diamond_use_number = 0;
                resData.logistics_method = 2;
                this.setState({
                    pageStatus: state,
                    settlementInfo: resData,
                    diamond: diamond,
                    paidPrice: res.data.shop_transfer == 1 ? 0 : res.data.logistics_fees.paid_price
                }, () => {
                    window.location.href = '#payinfo';
                });
            }else {
                H.operationState(res.message);
            }
            H.we_loading.hide();
        });
    }

    //改变页面状态;点击返回的时候回到购物车商品列表页;
    setPageStatus() {
        this.setState({pageStatus: 0});
    }

    //删除商品时下一步和全选变为不可用;
    changeNextPageState(state) {
        this.setState({nextPageBtnState: state});
    }

    //判断当然在哪个页面，并显示对应该信息;
    //0表示商品列表页面, 1非转接在线支付， 2是非转接上车收钱， 3是转接在线支付， 4是转接货到付款
    showPage() {
        let xml = '';
        if(this.state.pageStatus == 0) {
            if(this.state.goodsInfo) {
                xml = (
                    <GoodsList
                        payWay={this.state.payWay}
                        changePayWayHandler={this.changePayWay}
                        goodsList={this.state.goodsInfo}
                        changeNextPageState={this.changeNextPageState}
                        goodsIdArr={this.state.goodsIdArr}
                        goodsIdArrHandler={this.changeGoodsIdArr}
                        setGoodsInfo={this.setGoodsInfo}
                        scrollRefresh={this.scrollRefresh}
                        grouponTime={this.state.grouponTime}
                    />
                );
            }
        }else if(this.state.pageStatus == 1) {
            //非转接在线支付;
            xml = (<OnlinePayment data={this.state.settlementInfo} changeSettlementInfo={this.changeSettlementInfo} scrollRefresh={this.scrollRefresh} operation={true} />);
        }else if(this.state.pageStatus == 2) {
            //非转接上车收钱;
            xml = (<CarPay data={this.state.settlementInfo} changeSettlementInfo={this.changeSettlementInfo} scrollRefresh={this.scrollRefresh} />);
        }else if(this.state.pageStatus == 3) {
            //转接在线支付;
            xml = (<Transfer data={this.state.settlementInfo} changeSettlementInfo={this.changeSettlementInfo} scrollRefresh={this.scrollRefresh} operation={true} />);
        }else if(this.state.pageStatus == 4) {
            //转接货到付款;
            xml = (<Transfer data={this.state.settlementInfo} changeSettlementInfo={this.changeSettlementInfo} scrollRefresh={this.scrollRefresh} />);
        }
        return xml;
    }

    changeSettlementInfo(obj) {
        this.setState({changeSettlementInfo: obj});
    }

    //改变购物车选中商品ID串;
    changeGoodsIdArr(arr) {
        if(arr.length > 0){
            let param = {
                shop_cart_goods_ids: arr.join(',')
            };
            H.we_loading.show('金额计算中</br>请稍候……');
            H.server.shopCart_selected_goods_totalPrice(param, (res) => {
                if(res.code == 0) {
                    this.setState({totalPrice: res.data.goods_total_price, goodsIdArr: arr, footData: res.data});
                }else {
                    H.operationState(res.message);
                }
                H.we_loading.hide();
            });
        }else {
            this.setState({totalPrice: 0, goodsIdArr: arr});
        }
    }

    setGoodsInfo(obj) {
        let data = this.state.goodsInfo;
        data.market_info = obj;
        this.setState({goodsInfo: data});
    }

    render() {
        return(
            <div>
                <TopToolbar pageStatus={this.state.pageStatus} setPageStatus={this.setPageStatus} />

                <div id="wrapper">
                    <div id="scroller">
                        {this.showPage()}
                    </div>
                </div>

                <Footer
                    pageStatus={this.state.pageStatus}
                    nextHandler={this.nextPage}
                    nextState={this.state.nextPageBtnState}
                    totalPrice={this.state.totalPrice}
                    diamond={this.state.diamond}
                    data={this.state.settlementInfo}
                    paidPrice={this.state.paidPrice}
                    goodsIdArrHandler={this.changeGoodsIdArr}
                    goodsList={this.state.goodsInfo}
                    footData={this.state.footData}
                    payWay={this.state.payWay}
                    grouponTime={this.state.grouponTime}
                />

            </div>
        );
    }
}
CarContent.childContextTypes = {
    totalPrice: React.PropTypes.number
};

export default CarContent;