/**
 * Created by Doden on 2017.05.03
 */

import React from 'react';

class Order extends React.Component {
    constructor(props) {
        super(props);
    }

    toOrder(type){
        switch (type){
            case 'all':
            case 'unPay':
                window.location.href = '/index.php?m=PublicTemplate&c=ApiPublic&a=seller#/order/dqr';
                break;
            case 'wait':
                window.location.href = '/index.php?m=PublicTemplate&c=ApiPublic&a=seller#/order/dfh';
                break;
            case 'receive':
                window.location.href = '/index.php?m=PublicTemplate&c=ApiPublic&a=seller#/order/yfh';
                break;
        }
    }

    render() {
        return (<div id="order" className="order">
            <div className="order-title"><p>我的订单</p><p onClick={this.toOrder.bind(this, 'all')}>全部订单 <i className="icon right"></i></p></div>
            <div className="order-content">
                <div className="order-item" onClick={this.toOrder.bind(this, 'unPay')}>
                    <div className={'order-icon '+(this.props.shopInfo.newOrderNum>0?'message':'')} data-message={this.props.shopInfo.newOrderNum}><i className="icon unPay"></i></div>
                    <p>未付款</p>
                </div>
                <div className="order-item" onClick={this.toOrder.bind(this, 'wait')}>
                    <div className={'order-icon '+(this.props.shopInfo.dfhOrderNum>0?'message':'')} data-message={this.props.shopInfo.dfhOrderNum}><i className="icon wait"></i></div>
                    <p>待发货</p>
                </div>
                <div className="order-item" onClick={this.toOrder.bind(this, 'receive')}>
                    <div className={'order-icon '+(this.props.shopInfo.consignmentOrderNum>0?'message':'')} data-message={this.props.shopInfo.consignmentOrderNum}><i className="icon receive"></i></div>
                    <p>已发货</p>
                </div>
            </div>
        </div>);
    }
}

export default Order;