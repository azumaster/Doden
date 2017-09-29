/**
 * Created by Doden on 2017.03.10
 */

import React from 'react';
import Action from '../../../redux/actions/action.js';
import { connect } from 'react-redux';

class ConfirmOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            SCROLL: null,
            payments: null,
            delivery: null,
            shop: null
        };
        if(!this.props.carConfirmData) location.href = '#/buyer/car';
    }

    componentWillMount(){
        $.req.getShop({}, (res)=>{
            if(res.code == 0){
                this.setState({
                    shop: res.data
                });
            }else{
                $.toast({text:res.message, icon: 'info'});
            }
        });
        //获取支付方式;
        $.req.getPayments({}, (res) => {
            if(res.code == 0) {
                this.setState({payments: res.data}, () => {
                    paramInit();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
        //获取配送方式;
        $.req.getDelivery({}, (res) => {
            if(res.code == 0) {
                this.setState({delivery: res.data}, () => {
                    paramInit();
                });
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
        let paramInit = () => {
            let param = this.props.carConfirmData;
                //payments = this.state.payments,
                //delivery = this.state.delivery;
            if(this.state.payments && this.state.delivery) {
                let p = this.state.payments;
                for(let i = 0; i < p.length ; i++) {
                    if(p[i].id == 1) {
                        if(p[i].selected) {
                            param.param.payment = 1;   //直接设置默认支付方式为货到付款;
                        }else {
                            param.param.payment = 2;    //当货到付款不可用时，使用微信支付;
                        }
                        break;
                    }
                }

                param.param.delivery = 1;  //直接设置默认配送方式为送货到店;
                //for(let i in delivery) {
                //    param.param.delivery = i;
                //    break;
                //}
                this.props.setCarConfirmData(param);
            }
        };
        //获取用户地址列表;
        $.req.getAddress({}, (res) => {
            if(res.code == 0) {
                this.props.getCarAddress({address: res.data, param: this.props.carConfirmData});
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
        document.title = '确认订单';
    }

    componentWillUpdate() {

    }

    componentDidMount(){
        this.createScroll();
    }

    componentDidUpdate(){
        //this.state.SCROLL.refresh();
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

        let SCROLL = new IScroll('#orders', scrollOptions);

        SCROLL.on('beforeScrollStart', () => {
            SCROLL.refresh();
        });
    }

    //选择地址;
    chooseAddress() {
        location.href = '#/buyer/car/confirm/address';
    }

    createAddress(){
        if(!this.props.address) return null;
        let address = this.props.address,
            carConfirmData = this.props.carConfirmData,
            data = null;

        for(let i in address.addresses) {
            if(carConfirmData.param.address_id == address.addresses[i].id) {
                data = address.addresses[i];
            }
        }
        let xml = null;

        if(!data) {    //没有默认地址;
            xml = (
                <div className="grid-col-8 grid-col-sm-7">
                    <h3 style={{textAlign: 'right', marginTop: '10px'}}>设置收货地址</h3>
                </div>
            );
        }else {
            xml = (
                <div className="grid-col-8 grid-col-sm-7">
                    <h3 className="inline">{data.receiver}</h3>
                    <h5 className="pull-right">{data.mobile}</h5>
                    <h5>{data.intact_address}</h5>
                </div>
            );
        }
        return(
            <div className="ul car-hd-address" onClick={this.chooseAddress.bind(this)} style={{marginBottom: 0}}>
                <div className="li grid-row">
                    <div className="grid-col-1">
                        <h3 className="address-icon"><i className="icon address"></i></h3>
                    </div>
                    <div className="grid-col-2 grid-col-sm-3">
                        <h3 className="text-justify">收货人:</h3>
                        <h5>收货地址:</h5>
                    </div>
                    {xml}
                    <div className="grid-col-1"><i className="icon right more"></i></div>
                    <div className="car-hr" style={{background: 'url('+ $.cdn() + 'Public/service-provider/images/car-hr.png) repeat-x', backgroundSize: 'auto 3px'}}></div>
                </div>
            </div>
        );
    }

    //生成商品列表;
    createGoodList(){
        if(!this.props.carConfirmData) return;
        let valid = this.props.carConfirmData.valid,
            goods = this.props.carConfirmData.param.goods;
        let goodList = [];
        for(let i = 0; i < valid.length ; i++){
            for(let n in goods) {
                if(valid[i].goods_id == goods[n].goods_id) {
                    goodList.push(
                        <div key={i} className="li">
                            <div className="good-img pull-left">
                                <img src={$.cdn() + valid[i].image + $.img(80, 90)} width="30px"/>
                            </div>
                            <div className="good-des pull-right">
                                <h3 className="good-name">{valid[i].goods_title}</h3>
                                <h3 className="pull-left text-primary">￥{valid[i].goods_price}</h3>
                                <h6 className="pull-right text-assist">X{goods[n].buy_num}</h6>
                            </div>
                            <div style={{clear: 'both'}}></div>
                        </div>
                    );
                }
            }
        }

        return(<div className="ul good-list">
            {goodList}
        </div>);
    }

    //生成支付方式;
    createPayType(){
        let xml = [],
            payments = this.state.payments;
        if(!payments) return null;
        for(let i = 1 ; i >= 0 ; i--) {
            if(payments[i].selected) {
                xml.push(
                    <div className="car-cell flex border-bottom" key={i}
                         onClick={this.deliveryChange.bind(this, 'payment', payments[i].id)}>
                        <div className="flex-item">{payments[i].pay_name}</div>
                        {
                            this.props.carConfirmData.param.payment == payments[i].id ? <i className="icon check-fill"></i> : <i className="icon check"></i>
                        }

                    </div>
                );
            }
        }
        return(
            <div className="ul send-type">
                <div className="li">
                    <h2 className="inline">支付方式</h2>
                </div>
                {xml}
            </div>
        );
    }

    //生成配送方式;
    createSendType(){
        let xml = [],
            delivery = this.state.delivery;
        if(!delivery) return null;

        for(let i in delivery) {
            xml.push(
                <div className="car-cell flex border-bottom" key={i} data-id={i}
                     onClick={this.deliveryChange.bind(this, 'delivery', i)}>
                    <div className="flex-item">{delivery[i]}</div>
                    {
                        this.props.carConfirmData.param.delivery == i ? <i className="icon check-fill"></i> : <i className="icon check"></i>
                    }

                </div>
            );
        }
        return(
            <div className="ul send-type">
                <div className="li">
                    <h2 className="inline">配送方式</h2>
                </div>
                {xml}
                <h6 className="text-assist send-time">(具体配送时间请联系“{this.props.contactShop && this.props.contactShop.shop_name}”
                    <a className="tel" href={'tel:'+(this.props.contactShop && this.props.contactShop.mobile)}>{this.props.contactShop && this.props.contactShop.mobile}</a>)</h6>
            </div>
        );
    }

    createTip(){
        return (<div className="order-tip">
            <i className="icon tip"></i>
            {this.state.shop?this.state.shop.delivery_remark:null}
        </div>);
    }

    //修改配送方式;
    deliveryChange(key, id) {
        let param = this.props.carConfirmData;
        param.param[key] = id;
        this.props.setCarConfirmData(param);
    }

    //创建订单
    createOrder(){
        let address = this.props.address,
            carConfirmData = this.props.carConfirmData,
            addrId = null;
        for(let i in address.addresses) {
            if(carConfirmData.param.address_id == address.addresses[i].id) {
                addrId = address.addresses[i];
            }
        }
        if(!addrId) {
            $.toast({'icon': 'info', text: '请设置收货地址'});
            return ;
        }
        $.loading.show();
        $.req.createOrder(JSON.stringify(this.props.carConfirmData.param), (res) => {
            $.loading.hide();
            if(res.code == 0) {
                if(this.props.carConfirmData.param.payment == 2) {   //用户选择了微信支付时让用户立即支付;
                    this.pay(res.data.id);
                }else {
                    this.paySuccess();
                }
            }else {
                $.toast({text:res.message, icon: 'info'});
            }
        });
    }

    //微信立即支付;
    pay(id) {
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
            this.paySuccess('支付失败', '支付失败，订单已经生成，可以去订单中进行支付');
            //$.toast({text: '支付失败', icon: 'info'});
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
                $.loading.hide();
                if(res.err_msg == 'get_brand_wcpay_request:ok' ) {
                    //$.toast({text: '支付成功'});
                    _this.paySuccess('支付成功', '支付成功');
                }else if (res.err_msg == 'get_brand_wcpay_request:cancel' || res.err_msg == 'get_brand_wcpay_request:fail'){
                    //$.toast({text: '支付失败', icon: 'info'});
                    $.req.paymentQuery(JSON.stringify({id: id}), () => {});
                    _this.paySuccess('支付失败.', '支付失败，订单已经生成，可以去订单中进行支付');
                }
            }
        );
    }

    //下单成功的弹窗口
    paySuccess(title, content) {
        $.dialog({
            title: title || '下单成功',
            content: content || '下单成功',
            okText: '查看订单',
            cancelText: '返回',
            cancel: true,
            okCallback: () => {
                location.href = '#/buyer/order';
            },
            cancelCallback: () => {
                location.reload();
            }
        });
    }

    render() {
        let total = this.props.carConfirmData.total;
        return (
            <div id="confirmOrder" className="confirm-car">
                <div id="orders" className="orders">
                    <div className="scroller">
                        {this.createAddress()}
                        {this.createTip()}
                        {this.createGoodList()}
                        {this.createPayType()}
                        {this.createSendType()}
                    </div>
                </div>
                <div className="car-ft flex border-top">
                    <div className="flex-item price-item">
                        <div>合计<span className="total-price">￥{total.total_amount}</span></div>
                        <div>共{total.goods_count}件</div>
                    </div>
                    <div className="settlement-btn" onClick={this.createOrder.bind(this)}>提交</div>
                </div>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        address: state.carAddress,
        carConfirmData: state.carConfirmData,
        contactShop: state.contactShop
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCarAddress: (data)=>{Action(dispatch, 'fetchGetCarAddress', data);},
        setCarConfirmData: (data)=>{Action(dispatch, 'fetchCarConfirmData', data);}
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmOrder);