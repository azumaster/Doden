/**
 * Created by Doden on 2017.03.09
 */

import React from 'react';
import { connect } from 'react-redux';
import Action from './../../../redux/actions/action.js';

import Tab from './../../../components/tab/tab.jsx';

class Order extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL:null,
            orderList:[],
            currentStatus: 0,
            page: 1,
            size: 10,
            total: 20
        };
        this.onBridgeReady = this.onBridgeReady.bind(this);
    }

    componentWillMount(){
        this.getData();
    }

    getData(){
        let data = {
            page: this.state.page,
            size: this.state.size
        };

        if(this.state.currentStatus !=0){
            data.status = this.state.currentStatus;
        }else {
            if(data.status){
                delete data.status;
            }
        }

        $.loading.show();

        $.req.getOrderList(data, (res)=>{
            if(res.code == 0){
                let orderList = this.state.orderList;
                $.loading.hide();

                if(this.state.page == 1) orderList = [];

                orderList = orderList.concat(res.data.orders);

                this.setState({
                    orderList: orderList,
                    total: res.data.total
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
                $.loading.hide();
            }
        });
    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        this.state.SCROLL.refresh();
    }

    createScroll() {
        let scrollOptions = {
            zoom: true,
            scrollX: false,  //是不中可以横向滚动;
            scrollY: true,  //是否可以纵向滚动;
            mouseWheel: true, //是否监听鼠标滚轮;
            wheelAction: 'zoom',
            probeType: 2,
            preventDefault: false
        };

        let SCROLL = new IScroll('#orderList', scrollOptions);

        this.setState({SCROLL: SCROLL}, ()=>{
            SCROLL.on('scrollStart', () => {SCROLL.options.preventDefault = true;});
            SCROLL.on('scrollEnd', () => {
                SCROLL.options.preventDefault = false;
                if(this.state.orderList){
                    if(this.state.orderList.length >= this.state.total) return;
                    if((SCROLL.y - SCROLL.maxScrollY)<300){
                        this.state.page ++;
                        new Promise(()=>{this.getData();});
                    }
                }
            });
        });
    }

    createTab(){
        let tabNames = ['全部', '待确认', '待发货', '待收货'],
            tabData = [0, 1, 2, 3];

        return(<Tab tabNames={tabNames} tabData={tabData} style="tab-item" activeStyle="tab-item active-buyer"
                    clickCallback={this.toggleTab.bind(this)} status={this.state.currentStatus}/>);
    }

    toggleTab(e){
        let index = e.target.dataset.index;

        this.setState({
            currentStatus:index,
            page: 1
        }, this.getData);
    }

    createList(){
        let orderList = [],
            orders = this.state.orderList;

        if(orders.length>0&&orders[0]){
            orders.map((order, index)=>{
                let orderGoodList = [],
                    orderStatus = {1:'待确认', 2:'待发货', 3:'待收货', 4:'已收货', 5:'已取消', 100:'支付中', 101:'待确认', 102:'支付失败'};
                let btns = [];

                if(order.status == 5 && order.status==4 && order.status == 100){
                    btns = [];
                } else if(order.status == 101){
                    btns.push(<button key={0} type="button" data-id={order.id} className="btn btn-active btn-sm pull-right" onClick={this.operateOrder.bind(this)}>取消订单</button>);
                } else if(order.status == 3){
                    btns.push(<button key={0} type="button" data-id={order.id} className="btn btn-active btn-sm pull-right" onClick={this.operateOrder.bind(this)}>确认收货</button>);
                }else if(order.status == 2){
                    btns.push(<button key={0} type="button" data-id={order.id} className="btn btn-active btn-sm pull-right" onClick={this.operateOrder.bind(this)}>取消订单</button>);
                }else if(order.status == 1){
                    btns.push(<button key={0} type="button" data-id={order.id} className="btn btn-default btn-sm pull-right" onClick={this.operateOrder.bind(this)}>取消订单</button>);
                    if(order.payment == 2){
                        btns.push(<button key={1} type="button" data-id={order.id} className="btn btn-active btn-sm pull-right" onClick={this.operateOrder.bind(this)}>支付订单</button>);
                    }
                }else if(order.status == 102){
                    btns.push(<button key={0} type="button" data-id={order.id} className="btn btn-active btn-sm pull-right" onClick={this.operateOrder.bind(this)}>重新支付</button>);
                }

                order.goods.map((good, i)=>{
                    orderGoodList.push(<div key={i} className="li order-good">
                        <div className="good-img pull-left"><img src={$.cdn()+good.goods_pic + $.img(90, 90)} className="img-rounded"/></div>
                        <div className="good-des pull-left">
                            <h3 className="good-title">{good.goods_title}</h3>
                            <h3 className="pull-left text-primary">￥{good.goods_price}</h3>
                            <h6 className="pull-right text-assist">X{good.buy_num}</h6>
                        </div>
                    </div>);
                });

                orderList.push(<div key={index} className="order-item ul">
                    <div className="li order-title">
                        <h5 className="text-assist pull-left">下单时间:{order.created_at}</h5>
                        <h5 className="text-primary pull-right">{orderStatus[order.status]}</h5>
                        <div style={{clear:'both'}}></div>
                    </div>
                    {orderGoodList}
                    <div className="li order-footer">
                        <div className="order-price"><h2 className="pull-right">￥{order.order_amount}</h2><h6 className="pull-right">共{order.buy_count}件 合计 </h6></div>
                        <div className="order-operate">
                            {btns}
                        </div>
                    </div>
                </div>);
            });
        }else {
            orderList.push(<div key={0} className="order-no">
                <img src={$.cdn() + 'Public/service-provider/images/car-goods-no.png'} />
                <p className="note">暂无订单</p>
            </div>);
        }

        return orderList;
    }

    operateOrder(e){
        let operate = e.target.innerHTML,
            id = e.target.dataset.id;

        switch (operate){
            case '取消订单':
                this.handle('确认要取消订单？', 5, id);
                break;
            case '确认收货':
                this.handle('确认已经收货？', 4, id);
                break;
            case '确认发货':
                this.handle('确认已经发货？', 3, id);
                break;
            case '确认订单':
                this.handle('确认订单？', 2, id);
                break;
            case '支付订单':
            case '重新支付':
                this.pay(id);
        }


    }

    handle(text, status, id){
        $.dialog({
            content:'<h4>'+text+'</h4>',
            cancel: true,
            okCallback:()=>{
                $.req.updateOrder(JSON.stringify({status:status, id: id}), (res)=>{
                    if(res.code == 0){
                        this.getData();
                        $.toast({text:'操作成功'});
                    }else {
                        $.toast({text:res.message, icon: 'info'});
                    }
                });
            }
        });
    }

    pay(id){
        $.dialog({
            content: '<h4>确认支付？</h4>',
            cancel: true,
            okCallback:()=>{
                let data = {};
                new Promise((resolve, reject)=>{
                    $.req.pay(JSON.stringify({id: id}), (res)=>{
                        if(res.code == 0){
                            data = res.data;
                            resolve('ok');
                        }else {
                            $.toast({text: res.message, icon: 'info'});
                            reject('error');
                        }
                    });
                }).then(()=>{
                    this.onBridgeReady(data, id);
                }).catch(()=>{
                    $.req.paymentQuery(JSON.stringify({id: id}), () => {});
                    $.toast({text: '支付失败', icon: 'info'});
                });
            }
        });
    }

    onBridgeReady(data, id){
        let _this = this;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                'appId': data.appId,
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.package,
                'signType': data.signType,
                'paySign': data.paySign
            },
            function(res){
                if(res.err_msg == 'get_brand_wcpay_request:ok' ) {
                    _this.getData();
                    $.toast({text: '支付成功'});
                }else if (res.err_msg == 'get_brand_wcpay_request:cancel' || res.err_msg == 'get_brand_wcpay_request:fail'){
                    $.req.paymentQuery(JSON.stringify({id: id}), (res) => {
                        if(res.code == 0) {
                            _this.getData();
                        }
                    });
                    $.toast({text: '支付失败.', icon: 'info'});
                }
            }
        );
    }

    render() {
        return (<div id="buyerOrder" className="buyer-order">
            {this.createTab()}
            <div id="orderList" className="order-list">
                <div id="scroll">
                    {this.createList()}
                </div>
            </div>
        </div>);}
}

const mapStateToProps = (state)=>{
    return {
        orderList: state.orderList
    };
};

const mapDispatchToProps = (dispatch) =>{
    return {
        getOrderList: (data)=>{Action(dispatch, 'fetchOrderList', data);},
        updateOrder:(data)=>{Action(dispatch, 'fetchUpdateOrder', JSON.parse(data));}
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Order);